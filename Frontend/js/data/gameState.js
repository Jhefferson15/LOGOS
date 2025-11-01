export let gameState = {
    // --- Dados do Perfil ---
    playerName: 'Sábio Viajante',
    clanName: 'Escola de Atenas',
    level: 49,
    xp: 420,
    xpMax: 1000,
    trophies: 4242,

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
    collection: {
        // A chave é o ID do filósofo, o valor é o seu estado atual
        philosophers: {
            // Filósofos que o jogador JÁ DESBLOQUEOU
            '1': { level: 2, count: 18 }, // Sócrates, Nível 2, tem 18/20 pergaminhos para o Nv. 3
            '2': { level: 1, count: 3 },  // Platão, Nível 1, tem 3/10 pergaminhos para o Nv. 2
            '3': { level: 1, count: 0 },  // Aristóteles, Nível 1, tem 0/10 pergaminhos
            '7': { level: 1, count: 0 },  // Descartes, Nível 1, tem 0/10 pergaminhos
            '17': { level: 3, count: 5 } // Foucault, Nível 3, tem 5/30 pergaminhos
        }
        // Futuramente, poderia ter: collection.concepts, collection.avatars, etc.
    },

    // --- Timers e Baús ---
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
    discoveredPhilosophers: [2, 3]
};