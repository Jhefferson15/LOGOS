import { GameMechanic } from './GameMechanic.js';
import { PHILOSOPHERS_DATA } from '../../data/philosophers.js';
import { ERA_COLOR_MAP } from '../modules/constants.js';
import { SoundManager } from '../modules/audio.js';

/**
 * Uno Mechanic (Dialética Mode):
 * - 7 initial cards.
 * - Match by School (Color).
 * - Match by Era (Value/Symbol).
 * - Match by Influence (Predecessors/InfluencedBy).
 * - "Eureka" rule (1 card left).
 */
export class UnoMechanic extends GameMechanic {
    get id() { return 'uno'; }
    get name() { return 'Dialética'; }
    get description() { return 'Associe ideias! Conecte por Escola, Era ou Influência. Grite EUREKA na última carta!'; }

    getTheme() {
        return {
            id: 'uno',
            colors: {
                primary: '#e74c3c', // Vibrant Red
                secondary: '#f1c40f', // Yellow
                accent: '#8e44ad', // Purple
                text: '#fff'
            },
            background: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)', // Warm, energetic
            font: "'Roboto', sans-serif",
            music: 'upbeat_theme',
            sfx: {
                play_card: '../assets/game/audio/flipcard.mp3',
                uno_shout: '../assets/game/audio/eureka.mp3' // Need this sfx
            }
        };
    }

    getInitialHandSize() {
        return 7;
    }

    initializeState(engine, stateModule, utils) {
        const fullDeck = Object.keys(PHILOSOPHERS_DATA);
        const shuffledDeck = utils.shuffleArray(fullDeck);

        // Deal 7 cards to each player
        Object.values(engine.state.game.players).forEach(player => {
            player.hand = shuffledDeck.splice(0, this.getInitialHandSize());
        });

        // Set the first card on the discard pile
        engine.state.game.discardPile = [shuffledDeck.pop()];
        engine.state.game.lastPlayedCard = engine.state.game.discardPile[0];

        // Remaining cards form the draw deck
        engine.state.game.drawDeck = shuffledDeck;
    }

    canPlayCard(gameState, playerId, cardIndex, cardData) {
        const topCardId = gameState.game.lastPlayedCard;
        if (!topCardId) return true; // First card

        const topCardData = PHILOSOPHERS_DATA[topCardId];

        // 1. Match by School (Color)
        if (cardData.school === topCardData.school) return true;

        // 2. Match by Era (Value/Symbol equivalent)
        if (cardData.era === topCardData.era) return true;

        // 3. Match by Influence (Direct connection)
        // Check if cardData is a predecessor of topCard (cardData influenced topCard)
        if (topCardData.predecessors && topCardData.predecessors.includes(parseInt(Object.keys(PHILOSOPHERS_DATA).find(key => PHILOSOPHERS_DATA[key] === cardData)))) return true;

        // Check if topCard is a predecessor of cardData (topCard influenced cardData)
        // We need the ID of the top card, which we have.
        if (cardData.predecessors && cardData.predecessors.includes(topCardId)) return true;

        return false;
    }

    calculateScore(gameState, playedCardId) {
        return 20;
    }

    async playCard(engine, playerId, cardIndex, cardData) {
        const player = engine.state.game.players[playerId];

        // Check Eureka Condition BEFORE playing (if they have 2 cards, they will have 1 after playing)
        if (player.hand.length === 2) {
            // They are about to have 1 card.
            // In a real implementation, we'd require a button press.
            // For now, auto-shout or penalty chance for AI.
            if (playerId === 'player-main') {
                engine.logEvent("VOCÊ: EUREKA!", "game-event");
                SoundManager.play('uno_shout');
            } else {
                // AI 20% chance to forget
                if (Math.random() > 0.8) {
                    engine.logEvent(`${engine.state.playersData[playerId].name} esqueceu de gritar Eureka! +2 cartas.`, "warning");
                    await engine.drawCardFromDeck(playerId);
                    await engine.drawCardFromDeck(playerId);
                } else {
                    engine.logEvent(`${engine.state.playersData[playerId].name}: EUREKA!`, "game-event");
                }
            }
        }

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

        engine.logEvent(`jogou ${cardData.name}!`, 'play-card', playerId);

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

        // Find current card ID to pass to canPlayCard checks if needed, 
        // but canPlayCard uses gameState.lastPlayedCard so we are good.

        if (opponent.hand.length > 0) {
            validCardIndex = opponent.hand.findIndex((cardId, index) => {
                // We need to find the ID of the card object to check predecessors correctly in canPlayCard if we used ID there
                // But canPlayCard uses cardData and topCardId.
                // Wait, my canPlayCard logic for "influenced by" used:
                // Object.keys(PHILOSOPHERS_DATA).find(key => PHILOSOPHERS_DATA[key] === cardData)
                // This is inefficient. Better to pass cardId if possible, but the signature is (gameState, playerId, cardIndex, cardData).
                // I will optimize canPlayCard slightly to assume cardData has an ID if I added it, or just rely on the loop.
                return this.canPlayCard(engine.state, opponentId, index, PHILOSOPHERS_DATA[cardId]);
            });
        }

        if (validCardIndex === -1) {
            const newCard = await engine.drawCardFromDeck(opponentId);
            if (newCard) {
                // Try to play drawn card
                if (this.canPlayCard(engine.state, opponentId, opponent.hand.length - 1, PHILOSOPHERS_DATA[newCard])) {
                    await this.playCard(engine, opponentId, opponent.hand.length - 1, PHILOSOPHERS_DATA[newCard]);
                    return;
                }
            }
            engine.logEvent(`passou a vez.`, 'game-event', opponentId);
            return;
        }

        await this.playCard(engine, opponentId, validCardIndex, PHILOSOPHERS_DATA[opponent.hand[validCardIndex]]);
    }
}
