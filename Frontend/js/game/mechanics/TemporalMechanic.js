import { GameMechanic } from './GameMechanic.js';
import { PHILOSOPHERS_DATA } from '../../data/philosophers.js';
import { ERA_COLOR_MAP } from '../modules/constants.js';
import { SoundManager } from '../modules/audio.js';

/**
 * Temporal Mechanic (Cronos Mode):
 * - 10 initial cards.
 * - Timeline on table (abstracted as ordered list).
 * - Score based on chronological proximity (Gap).
 * - Accumulate points to unlock Concepts (every 15 pts).
 */
export class TemporalMechanic extends GameMechanic {
    get id() { return 'temporal'; }
    get name() { return 'Cronos'; }
    get description() { return 'Construa a linha do tempo! Pontue pela precisão histórica. A cada 15 pontos, desbloqueie um Conceito.'; }

    getLayout() { return 'temporal'; }

    getTheme() {
        return {
            id: 'temporal',
            colors: {
                primary: '#34495e', // Midnight Blue
                secondary: '#ecf0f1', // Cloud
                accent: '#e67e22', // Carrot (Time/Sand)
                text: '#333'
            },
            background: 'linear-gradient(to right, #ece9e6, #ffffff)', // Clean paper/marble
            font: "'Cinzel', serif",
            music: 'classic_theme',
            sfx: {
                play_card: '../assets/game/audio/flipcard.mp3',
                time_lock: '../assets/game/audio/lock.mp3' // Placeholder
            }
        };
    }

    getInitialHandSize() {
        return 10;
    }

    initializeState(engine, stateModule, utils) {
        // Cronos mode starts with a full deck shuffled.
        const fullDeck = Object.keys(PHILOSOPHERS_DATA);
        const shuffledDeck = utils.shuffleArray(fullDeck);

        // Deal 10 cards to each player
        Object.values(engine.state.game.players).forEach(player => {
            player.hand = shuffledDeck.splice(0, this.getInitialHandSize());
        });

        // Remaining cards form the draw deck
        engine.state.game.drawDeck = shuffledDeck;

        // No discard pile at the start
        engine.state.game.discardPile = [];
    }

    calculateScore(gameState, playedCardId) {
        const topOfPileId = gameState.game.lastPlayedCard;
        // In Cronos, we compare with the last played card for simplicity in this MVP, 
        // OR we should check the entire ordered list if we had a real timeline UI.
        // Given the current "Pile" structure, we compare with the top of the pile.

        if (!topOfPileId) return 10; // First card is free points

        const playedCard = PHILOSOPHERS_DATA[playedCardId];
        const topCard = PHILOSOPHERS_DATA[topOfPileId];

        const dateDiff = Math.abs(playedCard.date - topCard.date);

        // Scoring Logic:
        // < 50 years: Perfect (20 pts)
        // < 100 years: Great (15 pts)
        // < 300 years: Good (10 pts)
        // > 300 years: Poor (5 pts)
        // Wrong Order (e.g. Ancient after Modern)? 
        // The game engine currently just stacks. We assume "proximity" is the goal regardless of direction for now,
        // unless we enforce order. Let's enforce "Chronological Order" implies we should play LATER dates?
        // The user said: "Se a posição estiver correta...". In a stack, it's hard to define "between".
        // Let's stick to "Proximity" as the main factor for the stack version.

        if (dateDiff <= 50) return 20;
        if (dateDiff <= 100) return 15;
        if (dateDiff <= 300) return 10;
        return 5;
    }

    async playCard(engine, playerId, cardIndex, cardData) {
        const player = engine.state.game.players[playerId];
        const cardToPlayId = player.hand[cardIndex];

        const points = this.calculateScore(engine.state, cardToPlayId);
        player.score += points;

        // Check Concept Trigger (Every 15 points)
        // We track "accumulated points since last trigger" or just total % 15.
        // Let's assume we trigger immediately if they cross a threshold.
        if (player.score % 15 < points) { // Simple check if we crossed a multiple of 15 roughly
            if (playerId === 'player-main') {
                engine.logEvent("CONCEITO DESBLOQUEADO! (Funcionalidade em breve)", "special");
                SoundManager.play('time_lock');
            }
        }

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

        // Target Timeline Container
        const timelineContainer = document.getElementById('timeline-container');

        // We need to insert the card in the correct visual position based on date
        // For now, let's just append it to the end or find the right spot
        // But animateCardFly expects a target element.
        // Let's create a placeholder target in the timeline.

        const cardEl = document.createElement('div');
        cardEl.className = 'cr-card timeline-card-placeholder';
        cardEl.style.opacity = '0';
        cardEl.style.width = '70px'; // Match card size
        cardEl.style.height = '85px';

        // Find insertion point based on date
        let inserted = false;
        const cardsInTimeline = Array.from(timelineContainer.querySelectorAll('.cr-card:not(.timeline-card-placeholder)'));

        // Sort existing cards by date to find insertion point
        // This assumes DOM order matches date order roughly

        // Simple append for now to avoid complex DOM manipulation during animation setup
        timelineContainer.appendChild(cardEl);

        const color = ERA_COLOR_MAP[cardData.era] || 'wild';
        await engine.animateCardFly(startElement, cardEl, PHILOSOPHERS_DATA[cardToPlayId], playerId !== 'player-main');

        // Replace placeholder with real card
        cardEl.className = 'cr-card';
        cardEl.style.opacity = '1';
        cardEl.dataset.color = color;
        cardEl.innerHTML = `<span class="card-value">${cardData.name}</span><div class="card-cost">${cardData.date}</div>`;

        // Re-sort timeline visually
        const allCards = Array.from(timelineContainer.querySelectorAll('.cr-card'));
        allCards.sort((a, b) => {
            const dateA = parseInt(a.querySelector('.card-cost').textContent);
            const dateB = parseInt(b.querySelector('.card-cost').textContent);
            return dateA - dateB;
        });
        allCards.forEach(c => timelineContainer.appendChild(c));

        const playedCardId = player.hand.splice(cardIndex, 1)[0];
        engine.state.game.discardPile.push(playedCardId);
        engine.state.game.lastPlayedCard = playedCardId;

        engine.logEvent(`jogou ${PHILOSOPHERS_DATA[playedCardId].name} (Gap: ${Math.abs(PHILOSOPHERS_DATA[playedCardId].date - (PHILOSOPHERS_DATA[engine.state.game.lastPlayedCard]?.date || 0))} anos) +${points} pts`, 'play-card', playerId);

        // Reuse color variable already declared on line 138
        const discardRect = engine.elements.discardPile.getBoundingClientRect();
        engine.triggerVFX(discardRect.left + discardRect.width / 2, discardRect.top + discardRect.height / 2, color);

        engine.state.selectedCardIndex = null;
        engine.render();

        // Check for winner is handled by engine after this returns
    }

    checkWinCondition(gameState) {
        // Win by emptying hand OR reaching X points (e.g. 100)
        const targetScore = 150;

        const winnerByScore = gameState.game.playerOrder.find(id => gameState.game.players[id].score >= targetScore);
        if (winnerByScore) return winnerByScore;

        const anyPlayerHandEmpty = gameState.game.playerOrder.some(id => gameState.game.players[id].hand.length === 0);
        if (anyPlayerHandEmpty) {
            return gameState.game.playerOrder.find(id => gameState.game.players[id].hand.length === 0);
        }

        return null;
    }

    async simulateOpponentTurn(engine, opponentId) {
        const opponent = engine.state.game.players[opponentId];

        let bestCardIndex = -1;
        let maxScore = -1;

        if (opponent.hand.length > 0) {
            opponent.hand.forEach((cardId, index) => {
                const score = this.calculateScore(engine.state, cardId);
                if (score > maxScore) {
                    maxScore = score;
                    bestCardIndex = index;
                }
            });
        }

        // AI Logic: If no good move (low score), draw a card?
        // In Cronos, you always want to play to empty hand, but maybe wait for better gap?
        // For now, AI is aggressive.

        if (bestCardIndex === -1) {
            await engine.drawCardFromDeck(opponentId);
            return;
        }

        await this.playCard(engine, opponentId, bestCardIndex, PHILOSOPHERS_DATA[opponent.hand[bestCardIndex]]);
    }
}
