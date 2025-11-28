const { db } = require('../config/firebase');
const { PHILOSOPHERS_DATA } = require('../data/philosophersData');
const { arenas } = require('../data/arenasData');
const { SHOP_DATA } = require('../data/shopData');
const { CONCEPTS_DATA_1 } = require('../data/conceptsData');

exports.seedDatabase = async (req, res) => {
    try {
        const batch = db.batch();

        // Seed Philosophers
        Object.entries(PHILOSOPHERS_DATA).forEach(([id, data]) => {
            const ref = db.collection('philosophers').doc(id);
            batch.set(ref, data);
        });

        // Seed Arenas
        arenas.forEach(arena => {
            const ref = db.collection('arenas').doc(arena.id.toString());
            batch.set(ref, arena);
        });

        // Seed Shop
        const shopRef = db.collection('shop').doc('config');
        batch.set(shopRef, SHOP_DATA);

        // Seed Concepts
        Object.entries(CONCEPTS_DATA_1).forEach(([id, data]) => {
            const ref = db.collection('concepts').doc(id);
            batch.set(ref, data);
        });

        await batch.commit();
        res.json({ message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Seed error:', error);
        res.status(500).json({ error: error.message });
    }
};
