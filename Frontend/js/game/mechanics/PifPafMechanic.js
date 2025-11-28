import { GameMechanic } from './GameMechanic.js';
import { PHILOSOPHERS_DATA } from '../../data/philosophers.js';
import { ERA_COLOR_MAP } from '../modules/constants.js';
import { SoundManager } from '../modules/audio.js';

/**
 * Pif Paf Mechanic:
 * - 9 cards.
 * - Win condition: Form 3 sets of same school (simplified to: Have 3 cards of same school in hand to declare win? Or play them?)
 * - User said: "Ganha quem fizer 3 da mesma escola filosofica".
 * - Let's implement: If you have 3 cards of the same school, you can "Win" instantly.
 * - But gameplay is Draw/Discard.
 */
export class PifPafMechanic extends GameMechanic {
    get id() { return 'pifpaf'; }
    get name() { return 'Mecânica Pif Paf'; }
    get description() { return '9 cartas. Ganha quem juntar 3 cartas da mesma escola.'; }

    getTheme() {
        return {
            id: 'pifpaf',
            colors: {
                primary: '#16a085', // Dark Green
                secondary: '#ecf0f1', // White
                accent: '#f39c12', // Gold
                text: '#fff'
            },
            background: '#2c3e50', // Solid dark for focus
            font: "'Lato', sans-serif",
            music: 'lounge_theme',
            sfx: {
                play_card: '../assets/game/audio/flipcard.mp3'
            }
        };
    }

    getInitialHandSize() {
        return 9;
    }

    canPlayCard(gameState, playerId, cardIndex, cardData) {
        return true; // Can discard any card
    }

    calculateScore(gameState, playedCardId) {
        return 0;
    }

    async playCard(engine, playerId, cardIndex, cardData) {
        // In Pif Paf, "playing" a card is discarding it.
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
        engine.state.game.lastPlayedCard = playedCardId;

        engine.logEvent(`descartou ${cardData.name}.`, 'play-card', playerId);

        const color = ERA_COLOR_MAP[cardData.era] || 'wild';
        const discardRect = engine.elements.discardPile.getBoundingClientRect();
        engine.triggerVFX(discardRect.left + discardRect.width / 2, discardRect.top + discardRect.height / 2, color);

        engine.state.selectedCardIndex = null;
        engine.render();
    }

    checkWinCondition(gameState) {
        // Check if any player has 3 cards of the same school
        for (const playerId of gameState.game.playerOrder) {
            const hand = gameState.game.players[playerId].hand;
            const schoolCounts = {};

            for (const cardId of hand) {
                const school = PHILOSOPHERS_DATA[cardId].school;
                if (school) {
                    schoolCounts[school] = (schoolCounts[school] || 0) + 1;
                    if (schoolCounts[school] >= 3) {
                        return playerId; // Winner!
                    }
                }
            }
        }
        return null;
    }

    async simulateOpponentTurn(engine, opponentId) {
        const opponent = engine.state.game.players[opponentId];

        // AI: Draw card
        const newCard = await engine.drawCardFromDeck();
        if (newCard) {
            opponent.hand.push(newCard);
            engine.logEvent(`comprou uma carta.`, 'draw-card', opponentId);
            engine.render();
        }

        // Check if won (Engine calls checkWinCondition after play, but we check here too implicitly)
        // AI Discard logic: Discard card that contributes least to a set.
        // Simplified: Random discard.

        const discardIndex = Math.floor(Math.random() * opponent.hand.length);
        await this.playCard(engine, opponentId, discardIndex, PHILOSOPHERS_DATA[opponent.hand[discardIndex]]);
    }
}
