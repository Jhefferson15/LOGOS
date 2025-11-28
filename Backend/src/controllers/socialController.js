const { db, admin } = require('../config/firebase');

exports.createGuild = async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user.uid;

    if (!name) return res.status(400).json({ error: 'Guild name is required' });

    try {
        const guildRef = db.collection('guilds').doc();
        const guildData = {
            id: guildRef.id,
            name,
            description: description || '',
            leader: userId,
            members: [userId],
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await guildRef.set(guildData);

        // Update user profile
        await db.collection('users').doc(userId).set({ guildId: guildRef.id }, { merge: true });

        res.json({ message: 'Guild created', guild: guildData });
    } catch (error) {
        console.error('Create guild error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.joinGuild = async (req, res) => {
    const { guildId } = req.body;
    const userId = req.user.uid;

    if (!guildId) return res.status(400).json({ error: 'Guild ID is required' });

    try {
        const guildRef = db.collection('guilds').doc(guildId);
        const doc = await guildRef.get();

        if (!doc.exists) return res.status(404).json({ error: 'Guild not found' });

        await guildRef.update({
            members: admin.firestore.FieldValue.arrayUnion(userId)
        });

        await db.collection('users').doc(userId).set({ guildId }, { merge: true });

        res.json({ message: 'Joined guild' });
    } catch (error) {
        console.error('Join guild error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.listFriends = async (req, res) => {
    const userId = req.user.uid;
    try {
        const friendsSnapshot = await db.collection('users').doc(userId).collection('friends').get();
        const friends = [];
        friendsSnapshot.forEach(doc => {
            friends.push({ id: doc.id, ...doc.data() });
        });
        res.json({ friends });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.donate = async (req, res) => {
    const { targetUserId, type, amount, cardId } = req.body;
    const userId = req.user.uid;

    try {
        await db.runTransaction(async (t) => {
            const senderRef = db.collection('users').doc(userId).collection('gameData').doc('progress');
            const receiverRef = db.collection('users').doc(targetUserId).collection('gameData').doc('progress');

            const senderDoc = await t.get(senderRef);
            const receiverDoc = await t.get(receiverRef);

            if (!senderDoc.exists || !receiverDoc.exists) throw new Error('User not found');

            const senderData = senderDoc.data();

            if (type === 'books') {
                if ((senderData.books || 0) < amount) throw new Error('Insufficient books');

                t.update(senderRef, { books: admin.firestore.FieldValue.increment(-amount) });
                t.update(receiverRef, { books: admin.firestore.FieldValue.increment(amount) });
            } else if (type === 'card') {
                const collection = senderData.collection || { philosophers: {} };
                if (!collection.philosophers[cardId] || collection.philosophers[cardId].count < 1) {
                    throw new Error('Card not owned');
                }

                // Deduct from sender
                collection.philosophers[cardId].count--;
                t.update(senderRef, { collection });

                // Add to receiver
                const receiverData = receiverDoc.data();
                const receiverCollection = receiverData.collection || { philosophers: {} };
                if (!receiverCollection.philosophers[cardId]) {
                    receiverCollection.philosophers[cardId] = { level: 1, count: 0 };
                }
                receiverCollection.philosophers[cardId].count++;
                t.update(receiverRef, { collection: receiverCollection });
            }
        });

        res.json({ message: 'Donation successful' });
    } catch (error) {
        console.error('Donation error:', error);
        res.status(400).json({ error: error.message });
    }
};
