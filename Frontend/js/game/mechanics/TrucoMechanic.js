import { GameMechanic } from './GameMechanic.js';
import { PHILOSOPHERS_DATA } from '../../data/philosophers.js';
import { ERA_COLOR_MAP } from '../modules/constants.js';
import { SoundManager } from '../modules/audio.js';

/**
 * Truco Mechanic:
 * - Truco Mineiro hierarchy (Fixed).
 * - 3 cards (usually, but user didn't specify hand size, assumed 3 for Truco).
 * - Fixed strength list.
 */
export class TrucoMechanic extends GameMechanic {
    get id() { return 'truco'; }
    get name() { return 'Mecânica Truco'; }
    get description() { return 'Truco Mineiro. Ordem fixa de força. 3 cartas.'; }

    getTheme() {
        return {
            id: 'truco',
            colors: {
                primary: '#27ae60', // Green (Table)
                secondary: '#f1c40f', // Gold
                accent: '#e67e22', // Wood
                text: '#fff'
            },
            background: 'repeating-linear-gradient(45deg, #27ae60, #27ae60 10px, #2ecc71 10px, #2ecc71 20px)', // Felt-like pattern
            font: "'Lobster', cursive", // Fun, informal
            music: 'samba_theme',
            sfx: {
                play_card: '../assets/game/audio/flipcard.mp3' // Should be a loud slap
            }
        };
    }

    getInitialHandSize() {
        return 3;
    }

    // Truco Mineiro Hierarchy (Weakest to Strongest)
    // 4, 5, 6, 7, Q, J, K, A, 2, 3
    // We need to map Philosopher cards to these values.
    // Since we don't have standard suits/ranks, we'll hash the ID or use a property to assign a "Truco Rank".
    // For now, let's assign random strength or based on 'date' modulo 10?
    // Let's use a deterministic mapping based on name length or something to simulate "fixed" strength.
    getCardStrength(cardData) {
        // Mock mapping:
        // 0: 4, 1: 5, 2: 6, 3: 7, 4: Q, 5: J, 6: K, 7: A, 8: 2, 9: 3
        const hash = cardData.name.length + (cardData.knowledge || 0);
        return hash % 10;
    }

    canPlayCard(gameState, playerId, cardIndex, cardData) {
        return true;
    }

    calculateScore(gameState, playedCardId) {
        return 0;
    }

    async playCard(engine, playerId, cardIndex, cardData) {
        const player = engine.state.game.players[playerId];

        engine.state.isAnimating = true;
        engine.hideTooltip();
        SoundManager.play('play_card');

        let startElement = null;
        if (playerId === 'player-main') {
            startElement = engine.elements.selectedCardSlot.querySelector('.cr-card') ||
                Array.from(engine.elements.crHandContainer.children).find(el => parseInt(el.dataset.index) === cardIndex);
            if (!startElement) startElement = Array.from(engine.elements.crHandContainer.children)[0];
        } else {
            startElement = document.getElementById(playerId);
        }

        await engine.animateCardFly(startElement, engine.elements.discardPile, cardData, playerId !== 'player-main');

        const playedCardId = player.hand.splice(cardIndex, 1)[0];
        engine.state.game.discardPile.push(playedCardId);

        const pileSize = engine.state.game.discardPile.length;

        if (pileSize % 2 === 0) {
            // Compare
            const firstCardId = engine.state.game.discardPile[pileSize - 2];
            const secondCardId = playedCardId;
            await this.resolveTrucoRound(engine, firstCardId, secondCardId, playerId);
        } else {
            engine.logEvent(`${cardData.name} é jogado!`, 'play-card', playerId);
        }

        engine.state.game.lastPlayedCard = playedCardId;

        const color = ERA_COLOR_MAP[cardData.era] || 'wild';
        const discardRect = engine.elements.discardPile.getBoundingClientRect();
        engine.triggerVFX(discardRect.left + discardRect.width / 2, discardRect.top + discardRect.height / 2, color);

        engine.state.selectedCardIndex = null;
        engine.render();
    }

    async resolveTrucoRound(engine, firstCardId, secondCardId, secondPlayerId) {
        const firstCard = PHILOSOPHERS_DATA[firstCardId];
        const secondCard = PHILOSOPHERS_DATA[secondCardId];

        const playerOrder = engine.state.game.playerOrder;
        const secondPlayerIndex = playerOrder.indexOf(secondPlayerId);
        const firstPlayerIndex = (secondPlayerIndex - 1 + playerOrder.length) % playerOrder.length;
        const firstPlayerId = playerOrder[firstPlayerIndex];

        const s1 = this.getCardStrength(firstCard);
        const s2 = this.getCardStrength(secondCard);

        let winnerId = null;
        if (s1 > s2) winnerId = firstPlayerId;
        else if (s2 > s1) winnerId = secondPlayerId;
        else winnerId = null; // Canga/Empate

        await new Promise(r => setTimeout(r, 500));

        if (winnerId) {
            engine.logEvent(`Rodada para ${winnerId === 'player-main' ? 'Você' : 'Oponente'}!`, 'game-event');
            engine.state.game.players[winnerId].score += 1; // Round point
        } else {
            engine.logEvent(`Cangou!`, 'game-event');
        }
    }

    checkWinCondition(gameState) {
        // Truco usually goes to 12 points.
        // For this mini-game, let's say whoever has most points after hands are empty wins.
        const anyPlayerHandEmpty = gameState.game.playerOrder.some(id => gameState.game.players[id].hand.length === 0);
        if (anyPlayerHandEmpty) {
            let winnerId = gameState.game.playerOrder[0];
            let highScore = -1;
            gameState.game.playerOrder.forEach(id => {
                const playerScore = gameState.game.players[id].score;
                if (playerScore > highScore) {
                    highScore = playerScore;
                    winnerId = id;
                }
            });
            return winnerId;
        }
        return null;
    }

    async simulateOpponentTurn(engine, opponentId) {
        const opponent = engine.state.game.players[opponentId];
        // AI: Random play for bluffing? Or play strongest?
        // Let's play strongest 70% of time.

        let bestCardIndex = 0;
        let maxStr = -1;

        opponent.hand.forEach((cardId, index) => {
            const str = this.getCardStrength(PHILOSOPHERS_DATA[cardId]);
            if (str > maxStr) {
                maxStr = str;
                bestCardIndex = index;
            }
        });

        // 30% chance to play random (bluff/save card)
        if (Math.random() < 0.3) {
            bestCardIndex = Math.floor(Math.random() * opponent.hand.length);
        }

        await this.playCard(engine, opponentId, bestCardIndex, PHILOSOPHERS_DATA[opponent.hand[bestCardIndex]]);
    }
}
