import { GameMechanic } from './GameMechanic.js';
import { PHILOSOPHERS_DATA } from '../../data/philosophers.js';
import { ERA_COLOR_MAP } from '../modules/constants.js';
import { SoundManager } from '../modules/audio.js';

/**
 * Conceptual Mechanic:
 * - 5 initial cards.
 * - Pile accepts only one line of thought (School).
 * - Simple implementation: Must match the School of the top card.
 */
export class ConceptualMechanic extends GameMechanic {
    get id() { return 'conceptual'; }
    get name() { return 'Mecânica Conceitual'; }
    get description() { return '5 cartas iniciais. O montante aceita apenas uma linha de pensamento (Escola).'; }

    getTheme() {
        return {
            id: 'conceptual',
            colors: {
                primary: '#8e44ad', // Purple
                secondary: '#f39c12', // Orange
                accent: '#1abc9c', // Teal
                text: '#ecf0f1'
            },
            background: 'radial-gradient(circle at center, #2c3e50 0%, #000000 100%)', // Deep, abstract
            font: "'Montserrat', sans-serif",
            music: 'ethereal_theme',
            sfx: {
                play_card: '../assets/game/audio/flipcard.mp3'
            }
        };
    }

    getInitialHandSize() {
        return 5;
    }

    canPlayCard(gameState, playerId, cardIndex, cardData) {
        const topCardId = gameState.game.lastPlayedCard;
        const topCardData = PHILOSOPHERS_DATA[topCardId];

        // Must match School
        if (cardData.school && topCardData.school && cardData.school === topCardData.school) {
            return true;
        }

        // Allow playing if the pile is empty or wild (start of game)
        if (!topCardData.school) return true;

        return false;
    }

    calculateScore(gameState, playedCardId) {
        return 15; // Fixed score
    }

    async playCard(engine, playerId, cardIndex, cardData) {
        const player = engine.state.game.players[playerId];

        const points = this.calculateScore(engine.state, null);
        player.score += points;

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

        engine.logEvent(`jogou ${cardData.name} seguindo a escola ${cardData.school}!`, 'play-card', playerId);

        const color = ERA_COLOR_MAP[cardData.era] || 'wild';
        const discardRect = engine.elements.discardPile.getBoundingClientRect();
        engine.triggerVFX(discardRect.left + discardRect.width / 2, discardRect.top + discardRect.height / 2, color);

        engine.state.selectedCardIndex = null;
        engine.render();
    }

    checkWinCondition(gameState) {
        const anyPlayerHandEmpty = gameState.game.playerOrder.some(id => gameState.game.players[id].hand.length === 0);
        if (anyPlayerHandEmpty) {
            return gameState.game.playerOrder.find(id => gameState.game.players[id].hand.length === 0);
        }
        return null;
    }

    async simulateOpponentTurn(engine, opponentId) {
        const opponent = engine.state.game.players[opponentId];
        let validCardIndex = -1;

        if (opponent.hand.length > 0) {
            validCardIndex = opponent.hand.findIndex((cardId, index) => {
                return this.canPlayCard(engine.state, opponentId, index, PHILOSOPHERS_DATA[cardId]);
            });
        }

        if (validCardIndex === -1) {
            const newCard = await engine.drawCardFromDeck();
            if (newCard) {
                opponent.hand.push(newCard);
                engine.logEvent(`comprou uma carta.`, 'draw-card', opponentId);
                engine.render();

                if (this.canPlayCard(engine.state, opponentId, opponent.hand.length - 1, PHILOSOPHERS_DATA[newCard])) {
                    await this.playCard(engine, opponentId, opponent.hand.length - 1, PHILOSOPHERS_DATA[newCard]);
                    return;
                }
            } else {
                engine.logEvent(`passou a vez.`, 'game-event', opponentId);
            }
            return;
        }

        await this.playCard(engine, opponentId, validCardIndex, PHILOSOPHERS_DATA[opponent.hand[validCardIndex]]);
    }
}
