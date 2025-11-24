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
        // Mock implementation as we don't have a friend system yet
        // In reality, we would query a 'friends' subcollection
        res.json({ friends: [] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
