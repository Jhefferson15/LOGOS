/**
 * Global object tracking the entire state of the game.
 * Persists player data, resources, timers, and collection status.
 * @namespace GameState
 */
export let gameState = {
    // --- Dados do Perfil ---
    playerName: 'Sábio Viajante',
    clanName: 'Escola de Atenas',
    level: 49,
    xp: 420,
    xpMax: 1000,
    trophies: 420,
    currentArena: 1,
    gameMode: 'classic', // 'classic', 'ranked', 'friendly'
    gameModes: {
        classic: { name: 'Clássico', desc: 'Debate padrão sem riscos.', icon: 'fa-scroll' },
        ranked: { name: 'Ranqueado', desc: 'Valendo troféus! (Req. 1000 Troféus)', icon: 'fa-trophy', req: 1000 },
        friendly: { name: 'Amistoso', desc: 'Pratique com amigos.', icon: 'fa-user-friends' }
    },

    // --- Moedas e Recursos ---
    scrolls: 15,   // Moeda premium (antigo 'books')
    books: 20,     // Ouro (antigo 'scrolls') - vamos corrigir a semântica

    // --- Estatísticas de Batalha ---
    wins: 120,
    totalDebates: 200,
    threeCrownWins: 45,
    crowns: 530,
    donations: 88,

    // --- NOVO: A Coleção de Cartas do Jogador ---
    /**
     * The player's collection of cards/philosophers.
     * @type {Object}
     * @property {Object.<string, {level: number, count: number}>} philosophers - Map of philosopher IDs to their state.
     */
    collection: {
        // A chave é o ID do filósofo, o valor é o seu estado atual
        philosophers: {
            '1': { level: 1, count: 0 },
            '2': { level: 1, count: 0 },
            '3': { level: 1, count: 0 },
            '4': { level: 1, count: 0 },
            '5': { level: 1, count: 0 },
            '6': { level: 1, count: 0 },
            '7': { level: 1, count: 0 },
            '8': { level: 1, count: 0 },
            '9': { level: 1, count: 0 },
            '10': { level: 1, count: 0 },
            '11': { level: 1, count: 0 },
            '12': { level: 1, count: 0 },
            '13': { level: 1, count: 0 },
            '14': { level: 1, count: 0 },
            '15': { level: 1, count: 0 },
            '16': { level: 1, count: 0 },
            '17': { level: 1, count: 0 },
            '18': { level: 1, count: 0 },
            '19': { level: 1, count: 0 },
            '20': { level: 1, count: 0 },
            '21': { level: 1, count: 0 },
            '22': { level: 1, count: 0 },
            '23': { level: 1, count: 0 },
            '24': { level: 1, count: 0 },
            '25': { level: 1, count: 0 },
            '26': { level: 1, count: 0 },
            '27': { level: 1, count: 0 },
            '28': { level: 1, count: 0 },
            '29': { level: 1, count: 0 },
            '30': { level: 1, count: 0 },
            '31': { level: 1, count: 0 },
            '32': { level: 1, count: 0 },
            '33': { level: 1, count: 0 },
            '34': { level: 1, count: 0 },
            '35': { level: 1, count: 0 },
            '36': { level: 1, count: 0 },
            '37': { level: 1, count: 0 },
            '38': { level: 1, count: 0 },
            '39': { level: 1, count: 0 },
            '40': { level: 1, count: 0 },
            '41': { level: 1, count: 0 },
            '42': { level: 1, count: 0 },
            '46': { level: 1, count: 0 },
            '47': { level: 1, count: 0 }
        }
        // Futuramente, poderia ter: collection.concepts, collection.avatars, etc.
    },

    // --- Timers e Baús ---
    /**
     * Active timers for chests and other time-based events.
     * @type {Object}
     * @property {number} freeChest - Seconds remaining for the free chest.
     * @property {number} crownChest - Seconds remaining for the crown chest.
     */
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
    isUnlocking: true,
    discoveredPhilosophers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 46, 47],

    // --- Ações do Usuário ---
    userActions: {
        likedPosts: [1, 3] // IDs dos posts que o usuário curtiu
    }
};