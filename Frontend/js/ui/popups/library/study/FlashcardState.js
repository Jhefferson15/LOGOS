
import { gameState } from '../../../../data/gameState.js';

export const FlashcardState = {
    /**
     * Carrega ou inicializa o estado dos flashcards para um filósofo.
     * @param {string} philosopherId 
     */
    loadState: (philosopherId) => {
        if (!gameState.flashcardProgress) {
            gameState.flashcardProgress = {};
        }
        if (!gameState.flashcardProgress[philosopherId]) {
            gameState.flashcardProgress[philosopherId] = {
                xp: 0,
                level: 1,
                streak: 0,
                cardsMastered: 0, // Cards com nível de maestria alto
                cards: {} // { cardId: { level: 0-5, nextReview: timestamp } }
            };
        }
        return gameState.flashcardProgress[philosopherId];
    },

    /**
     * Salva o estado (embora gameState seja reativo, é bom ter um ponto explícito)
     */
    saveState: (philosopherId, state) => {
        gameState.flashcardProgress[philosopherId] = state;
        // Aqui poderia ter lógica de persistência em localStorage ou backend
    },

    /**
     * Atualiza o progresso de um card usando algoritmo SRS (SM-2 simplificado).
     * @param {string} philosopherId 
     * @param {string} cardId 
     * @param {number} quality - 0 a 5 (0=Errou feio, 3=Acertou difícil, 5=Acertou fácil)
     */
    updateCardProgress: (philosopherId, cardId, quality) => {
        const state = FlashcardState.loadState(philosopherId);

        if (!state.cards[cardId]) {
            state.cards[cardId] = {
                level: 0, // Repetições consecutivas
                interval: 0, // Dias até próxima revisão
                easeFactor: 2.5, // Fator de facilidade
                nextReview: 0, // Timestamp
                lastReview: 0
            };
        }

        const card = state.cards[cardId];
        const now = Date.now();

        // Algoritmo SM-2
        if (quality >= 3) {
            // Acertou
            if (card.level === 0) {
                card.interval = 1;
            } else if (card.level === 1) {
                card.interval = 6;
            } else {
                card.interval = Math.round(card.interval * card.easeFactor);
            }
            card.level += 1;
        } else {
            // Errou
            card.level = 0;
            card.interval = 1;
        }

        // Atualiza Ease Factor
        // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        card.easeFactor = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        if (card.easeFactor < 1.3) card.easeFactor = 1.3;

        // Define próxima data (intervalo em dias -> ms)
        // Para testes, vamos usar minutos em vez de dias se interval for pequeno
        const dayInMs = 24 * 60 * 60 * 1000;
        card.lastReview = now;
        card.nextReview = now + (card.interval * dayInMs);

        // Atualiza XP Global
        if (quality >= 3) state.xp += 10 * (quality - 2);

        // Atualiza contagem de mestria (Cards com intervalo > 21 dias são considerados "Dominados")
        state.cardsMastered = Object.values(state.cards).filter(c => c.interval > 21).length;

        FlashcardState.saveState(philosopherId, state);
        return { card, state };
    },

    /**
     * Retorna estatísticas para o dashboard.
     */
    getStats: (philosopherId) => {
        const state = FlashcardState.loadState(philosopherId);
        const cards = Object.values(state.cards);
        const now = Date.now();
        const dayInMs = 24 * 60 * 60 * 1000;

        // Projeção de revisões (próximos 7 dias)
        const projection = [0, 0, 0, 0, 0, 0, 0];
        cards.forEach(c => {
            const daysUntil = Math.ceil((c.nextReview - now) / dayInMs);
            if (daysUntil >= 0 && daysUntil < 7) {
                projection[daysUntil]++;
            }
        });

        // Curva de esquecimento (simulada baseada na média dos intervalos)
        // R = e^(-t/S) onde S é a força da memória (intervalo)
        const avgInterval = cards.length > 0 ? cards.reduce((acc, c) => acc + c.interval, 0) / cards.length : 1;
        const retentionCurve = [];
        for (let t = 0; t <= 30; t += 5) { // 30 dias
            const ret = 100 * Math.exp(-t / (avgInterval || 1)); // Evita div por 0
            retentionCurve.push({ day: t, retention: ret });
        }

        return {
            xp: state.xp,
            mastered: state.cardsMastered,
            totalCards: cards.length, // Deveria pegar do deck total, mas ok por enquanto
            projection,
            retentionCurve,
            streak: state.streak
        };
    }
};
