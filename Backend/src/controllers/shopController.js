const { db, admin } = require('../config/firebase');
const { SHOP_DATA } = require('../data/shopData');

exports.getShop = (req, res) => {
    res.json(SHOP_DATA);
};

exports.buyItem = async (req, res) => {
    const { itemId, itemType } = req.body;
    const userId = req.user.uid;

    try {
        const userRef = db.collection('users').doc(userId).collection('gameData').doc('progress');

        await db.runTransaction(async (t) => {
            const doc = await t.get(userRef);
            if (!doc.exists) throw new Error('User data not found');

            const data = doc.data();
            let cost = 0;
            let currency = 'books';
            let item = null;

            // Find item in SHOP_DATA
            if (itemType === 'dailyDeal') {
                item = SHOP_DATA.dailyDeals.find(i => i.id === itemId);
            } else if (itemType === 'chest') {
                item = SHOP_DATA.chests.find(i => i.id === itemId);
            } else if (itemType === 'currencyPack') {
                item = SHOP_DATA.currencyPacks.find(i => i.id === itemId);
            }

            if (!item) throw new Error('Item not found');

            // Check cost (skip for real money packs in this mock)
            if (item.cost.currency !== 'real') {
                cost = item.cost.amount;
                currency = item.cost.currency;

                const currentBalance = data[currency] || 0;
                if (currentBalance < cost) {
                    throw new Error(`Insufficient ${currency}`);
                }

                // Deduct cost
                t.update(userRef, {
                    [currency]: admin.firestore.FieldValue.increment(-cost)
                });
            }

            // Grant Item
            if (item.type === 'philosopher') {
                const collection = data.collection || { philosophers: {} };
                const philId = item.philosopherId;

                if (!collection.philosophers[philId]) {
                    collection.philosophers[philId] = { level: 1, count: 0 };
                }
                collection.philosophers[philId].count += item.quantity;

                t.update(userRef, { collection });
            } else if (item.type === 'currency') {
                // Currency packs usually cost real money, but if they cost game currency (exchange), handle here
                // For now, just add the quantity to the target currency (e.g. buying gold with gems)
                // Assuming 'quantity' is the amount of gold/gems you GET
                // We need to know WHICH currency you get. 
                // In SHOP_DATA, name implies it. Let's assume 'books' (gold) for now if not specified.
                t.update(userRef, {
                    books: admin.firestore.FieldValue.increment(item.quantity)
                });
            }

            // Handle chests... (omitted for brevity, would call openChest logic)
        });

        res.json({ message: 'Purchase successful' });
    } catch (error) {
        console.error('Purchase error:', error);
        res.status(400).json({ error: error.message });
    }
};
