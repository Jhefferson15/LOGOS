
export let gameState = {
    scrolls: 15,
    books: 20,
    xp: 420,
    xpMax: 1000,
    trophies: 4242,
    timers: {
        freeChest: 3353,
        crownChest: 40
    },
    chestSlots: [
        { type: 'Papiro', arena: 1, status: 'unlocking', totalTime: 10800, remainingTime: 31 },
        { type: 'Tomo', arena: 1, status: 'locked', totalTime: 28800, remainingTime: 28800 },
        { type: 'Obra Rara', arena: 2, status: 'locked', totalTime: 43200, remainingTime: 43200 },
        { type: 'Papiro', arena: 1, status: 'locked', totalTime: 10800, remainingTime: 10 },
    ],
    isUnlocking: true
};
