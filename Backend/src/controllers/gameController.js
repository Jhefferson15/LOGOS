const { db } = require('../config/firebase');

// Helper to get chest duration in seconds
const getChestDuration = (type) => {
    const durations = {
        'Papiro': 3600, // 1 hour
        'Tomo': 10800, // 3 hours
        'Obra Rara': 43200, // 12 hours
        'Lendário': 86400 // 24 hours
    };
    return durations[type] || 3600;
};

exports.sync = async (req, res) => {
    const userId = req.user.uid;
    try {
        const userRef = db.collection('users').doc(userId).collection('gameData').doc('progress');
        const doc = await userRef.get();
        if (!doc.exists) {
            return res.json({ message: 'No game data found, starting fresh', data: null });
        }
        res.json({ data: doc.data() });
    } catch (error) {
        console.error('Sync error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.unlockChest = async (req, res) => {
    const { chestIndex } = req.body;
    const userId = req.user.uid;

    if (chestIndex === undefined) return res.status(400).json({ error: 'Chest index required' });

    try {
        const userRef = db.collection('users').doc(userId).collection('gameData').doc('progress');

        await db.runTransaction(async (t) => {
            const doc = await t.get(userRef);
            if (!doc.exists) throw new Error('User data not found');

            const data = doc.data();
            const chestSlots = data.chestSlots || [];
            const chest = chestSlots[chestIndex];

            if (!chest) throw new Error('No chest at this index');
            if (chest.status !== 'locked') throw new Error('Chest is not locked');

            // Check if another chest is unlocking
            const isAnyUnlocking = chestSlots.some(c => c && c.status === 'unlocking');
            if (isAnyUnlocking) throw new Error('Another chest is already unlocking');

            const duration = getChestDuration(chest.type);

            chest.status = 'unlocking';
            chest.unlockStartTime = Date.now();
            chest.unlockEndTime = Date.now() + (duration * 1000);
            chest.remainingTime = duration; // For client display sync

            t.update(userRef, { chestSlots });
        });

        res.json({ message: 'Chest unlock started' });
    } catch (error) {
        console.error('Unlock error:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.openChest = async (req, res) => {
    const { chestIndex } = req.body;
    const userId = req.user.uid;

    if (chestIndex === undefined) return res.status(400).json({ error: 'Chest index required' });

    try {
        const userRef = db.collection('users').doc(userId).collection('gameData').doc('progress');

        const result = await db.runTransaction(async (t) => {
            const doc = await t.get(userRef);
            if (!doc.exists) throw new Error('User data not found');

            const data = doc.data();
            const chestSlots = data.chestSlots || [];
            const chest = chestSlots[chestIndex];

            if (!chest) throw new Error('No chest at this index');

            // Allow opening if status is 'ready' OR if 'unlocking' and time has passed
            const now = Date.now();
            const isReady = chest.status === 'ready';
            const isTimeUp = chest.status === 'unlocking' && chest.unlockEndTime <= now;

            if (!isReady && !isTimeUp) {
                throw new Error('Chest not ready yet');
            }

            // Generate Rewards
            const { PHILOSOPHERS_DATA } = require('../data/philosophersData');
            const { arenas } = require('../data/arenasData');

            // Helper to get available philosophers for the user's arena
            // We assume user can get cards from their current arena and below
            const userArenaId = data.currentArena || 1;
            const availableSchools = [];

            arenas.forEach(a => {
                if (a.id <= userArenaId) {
                    availableSchools.push(...a.schools);
                }
            });

            const availablePhilosophers = Object.values(PHILOSOPHERS_DATA).filter(p =>
                availableSchools.includes(p.school)
            );

            // Loot Table Logic
            const rewards = {
                scrolls: 0,
                books: 0,
                philosophers: []
            };

            if (chest.type === 'Papiro') {
                rewards.scrolls = Math.floor(Math.random() * 50) + 10;
                rewards.books = Math.floor(Math.random() * 5) + 1;
                // 50% chance of a philosopher
                if (Math.random() > 0.5 && availablePhilosophers.length > 0) {
                    const randomPhil = availablePhilosophers[Math.floor(Math.random() * availablePhilosophers.length)];
                    // Find ID by value (since we have the object)
                    const philId = Object.keys(PHILOSOPHERS_DATA).find(key => PHILOSOPHERS_DATA[key] === randomPhil);
                    rewards.philosophers.push({ id: philId, count: 1 });
                }
            } else if (chest.type === 'Tomo') {
                rewards.scrolls = Math.floor(Math.random() * 150) + 50;
                rewards.books = Math.floor(Math.random() * 15) + 5;
                // Guaranteed 2 philosophers
                for (let i = 0; i < 2; i++) {
                    if (availablePhilosophers.length > 0) {
                        const randomPhil = availablePhilosophers[Math.floor(Math.random() * availablePhilosophers.length)];
                        const philId = Object.keys(PHILOSOPHERS_DATA).find(key => PHILOSOPHERS_DATA[key] === randomPhil);
                        rewards.philosophers.push({ id: philId, count: Math.floor(Math.random() * 3) + 1 });
                    }
                }
            } else {
                // Fallback / Other chests
                rewards.scrolls = 100;
                rewards.books = 10;
            }

            // Update State
            const newScrolls = (data.scrolls || 0) + rewards.scrolls;
            const newBooks = (data.books || 0) + rewards.books;

            // Update Collection
            const collection = data.collection || { philosophers: {} };
            rewards.philosophers.forEach(reward => {
                if (!collection.philosophers[reward.id]) {
                    collection.philosophers[reward.id] = { level: 1, count: 0 };
                }
                collection.philosophers[reward.id].count += reward.count;
            });

            // Remove chest
            chestSlots[chestIndex] = null;

            t.update(userRef, {
                chestSlots,
                scrolls: newScrolls,
                books: newBooks,
                collection
            });

            return rewards;
        });

        res.json({ message: 'Chest opened', rewards: result });
    } catch (error) {
        console.error('Open chest error:', error);
        res.status(400).json({ error: error.message });
    }
};
