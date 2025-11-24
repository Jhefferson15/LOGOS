class MatchmakingService {
    constructor() {
        this.queue = [];
        // Maps matchId -> Match Object
        this.matches = new Map();
        // Maps userId -> matchId
        this.playerMatchMap = new Map();
    }

    joinQueue(userId) {
        // If already in a match, return existing match info
        if (this.playerMatchMap.has(userId)) {
            return { status: 'in_match', matchId: this.playerMatchMap.get(userId) };
        }

        if (this.queue.includes(userId)) {
            return { status: 'queued' };
        }

        this.queue.push(userId);
        console.log(`User ${userId} joined queue. Queue size: ${this.queue.length}`);

        this.tryMatch();
        return { status: 'queued' };
    }

    leaveQueue(userId) {
        this.queue = this.queue.filter(id => id !== userId);
        console.log(`User ${userId} left queue.`);
    }

    tryMatch() {
        if (this.queue.length >= 2) {
            const player1 = this.queue.shift();
            const player2 = this.queue.shift();
            const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const match = {
                id: matchId,
                players: [player1, player2],
                startTime: Date.now(),
                status: 'active',
                turn: player1, // Player 1 starts
                state: {
                    [player1]: { health: 100, mana: 10 },
                    [player2]: { health: 100, mana: 10 }
                }
            };

            this.matches.set(matchId, match);
            this.playerMatchMap.set(player1, matchId);
            this.playerMatchMap.set(player2, matchId);

            console.log(`Match created: ${matchId} between ${player1} and ${player2}`);
        }
    }

    getMatchStatus(userId) {
        if (this.playerMatchMap.has(userId)) {
            const matchId = this.playerMatchMap.get(userId);
            const match = this.matches.get(matchId);
            return { status: 'matched', match };
        }

        if (this.queue.includes(userId)) {
            return { status: 'searching' };
        }

        return { status: 'idle' };
    }

    processMove(userId, moveData) {
        const matchId = this.playerMatchMap.get(userId);
        if (!matchId) throw new Error('User not in a match');

        const match = this.matches.get(matchId);
        if (!match) throw new Error('Match not found');

        if (match.turn !== userId) {
            throw new Error('Not your turn');
        }

        // Mock Move Logic
        const opponent = match.players.find(p => p !== userId);

        // Apply damage (mock)
        const damage = moveData.damage || 10;
        match.state[opponent].health -= damage;

        // Switch turn
        match.turn = opponent;

        // Check win condition
        if (match.state[opponent].health <= 0) {
            match.status = 'finished';
            match.winner = userId;
            // Cleanup would happen here in a real app
        }

        return match;
    }
}

module.exports = new MatchmakingService();
