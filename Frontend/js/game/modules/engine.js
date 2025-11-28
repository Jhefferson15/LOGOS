import { PHILOSOPHERS_DATA } from './../../data/philosophers.js';
import { CONCEPTS_DATA } from './../../data/concepts.js';
import { ERA_COLOR_MAP, OPPONENT_PLAY_DELAY } from './constants.js';
import { SoundManager } from './audio.js';
import { Utils } from './utils.js';
import { MechanicManager } from '../mechanics/MechanicManager.js';

/**
 * Core game logic module.
 * Handles card interactions, turn management, scoring, and win conditions.
 * @namespace EngineModule
 */
export const EngineModule = {
    /**
     * Draws a card from the draw deck.
     * If the deck is empty, it reshuffles the discard pile (excluding the top card) to form a new deck.
     * @async
     * @returns {Promise<string|null>} The ID of the drawn card, or null if the deck and discard pile are empty.
     */
    async drawCardFromDeck() {
        if (this.state.game.drawDeck.length === 0) {
            if (this.state.game.discardPile.length <= 1) {
                this.logEvent("O baralho de compra acabou!", 'game-event');
                return null;
            }
            await this.animateShuffle();
            const pile = this.state.game.discardPile;
            const topCard = pile.pop();
            this.state.game.drawDeck = Utils.shuffleArray(pile);
            this.state.game.discardPile = [topCard];
            this.render();
        }
        if (this.state.game.drawDeck.length === 0) return null;
        return this.state.game.drawDeck.pop();
    },

    /**
     * Executes the logic for a player playing a card.
     * Calculates score, triggers animations, updates game state, and advances the turn.
     * @async
     * @param {number} cardIndex - The index of the card in the player's hand.
     * @returns {Promise<void>}
     */
    async playCard(cardIndex) {
        if (this.state.isAnimating || this.state.isGameOver) return;

        const mechanic = MechanicManager.getActiveMechanic();
        const player = this.state.game.players['player-main'];
        const cardToPlayId = player.hand[cardIndex];

        if (!mechanic.canPlayCard(this.state, 'player-main', cardIndex, PHILOSOPHERS_DATA[cardToPlayId])) {
            SoundManager.play('error');
            // Visual feedback for invalid move could be added here
            return;
        }

        await mechanic.playCard(this, 'player-main', cardIndex, PHILOSOPHERS_DATA[cardToPlayId]);

        this.checkForWinner();
        if (this.state.isGameOver) {
            this.state.isAnimating = false;
            return;
        }

        this.applyCardEffect(PHILOSOPHERS_DATA[cardToPlayId]);
        this.advanceTurn();
        this.state.isAnimating = false;
    },

    /**
     * Calculates the score based on the chronological distance between the played card and the last played card.
     * @param {string} playedPhilosopherId - The ID of the philosopher card being played.
     * @returns {number} The calculated score points.
     */
    calculateChronologicalScore(playedPhilosopherId) {
        return MechanicManager.getActiveMechanic().calculateScore(this.state, playedPhilosopherId);
    },

    /**
     * Handles the action of the main player drawing a card.
     * Plays sound, triggers animation, and updates the player's hand.
     * @async
     * @param {boolean} shouldAdvanceTurn - Whether to advance the turn after drawing.
     * @returns {Promise<void>}
     */
    async playerDrawsCard(shouldAdvanceTurn) {
        if (this.state.isAnimating) return;
        const newCard = await this.drawCardFromDeck();
        if (newCard) {
            SoundManager.play('draw_card');
            await this.animateCardFly(this.elements.drawDeck, this.elements.crHandContainer, PHILOSOPHERS_DATA[newCard]);
            this.state.game.players['player-main'].hand.push(newCard);
            this.logEvent(`comprou uma carta.`, 'draw-card', 'player-main');
            this.render();
            if (shouldAdvanceTurn) this.advanceTurn();
        } else if (shouldAdvanceTurn) {
            this.logEvent(`não pôde comprar, o baralho está vazio.`, 'draw-card', 'player-main');
            this.advanceTurn();
        }
    },

    /**
     * Advances the game to the next player's turn.
     * Handles status effects (like skipping turns) and triggers opponent AI if applicable.
     */
    advanceTurn() {
        const game = this.state.game;
        let currentId = game.currentPlayerId;

        game.players[currentId].statusEffects = [];

        if (this.state.roundSummary.isActive && game.currentPlayerId === this.state.roundSummary.startPlayerId) {
            this.showRoundSummaryAndReset();
        }

        game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.playerOrder.length;
        let nextPlayerId = game.currentPlayerId;

        this.elements.playerAreas = document.querySelectorAll('.player-area');

        const skippedEffect = game.players[nextPlayerId].statusEffects.find(e => e.id === 'skipped');
        if (skippedEffect) {
            this.logEvent(`perdeu a vez.`, 'game-event', nextPlayerId);
            this.render();
            setTimeout(() => this.advanceTurn(), 1000);
            return;
        }

        this.render();

        const mechanic = MechanicManager.getActiveMechanic();
        mechanic.onTurnStart(this, nextPlayerId);

        if (game.currentPlayerId !== 'player-main' && !this.state.isGameOver) {
            setTimeout(() => this.simulateOpponentTurn(), OPPONENT_PLAY_DELAY);
        }
    },

    /**
     * Simulates the AI opponent's turn.
     * The AI tries to find the best card to play or draws a card if no good move is available.
     * @async
     * @returns {Promise<void>}
     */
    async simulateOpponentTurn() {
        if (this.state.isGameOver || this.state.isPaused) return;
        const opponentId = this.state.game.currentPlayerId;

        await MechanicManager.getActiveMechanic().simulateOpponentTurn(this, opponentId);

        this.checkForWinner();
        if (this.state.isGameOver) return;

        this.advanceTurn();
    },

    /**
     * Applies any special effects associated with the played card.
     * @param {object} card - The card data object.
     */
    applyCardEffect(card) {
        // Placeholder
    },

    /**
     * Checks if the game has ended (deck empty or player hand empty).
     * Determines the winner based on the highest score.
     */
    checkForWinner() {
        const winnerId = MechanicManager.getActiveMechanic().checkWinCondition(this.state);
        if (winnerId) {
            this.endGame(winnerId);
        }
    },

    /**
     * Activates a special concept power for the player.
     * Deducts score cost and executes the concept's handler.
     * @param {object} concept - The concept data object.
     * @param {HTMLElement} conceptEl - The DOM element representing the concept card.
     */
    onActivateConcept(concept, conceptEl) {
        if (this.state.isAnimating || this.state.isPaused) return;
        const player = this.state.game.players['player-main'];

        if (player.score < concept.cost) {
            SoundManager.play('error');
            conceptEl.classList.add('invalid-shake');
            setTimeout(() => conceptEl.classList.remove('invalid-shake'), 500);
            return;
        }

        if (!this.state.roundSummary.isActive) {
            this.state.roundSummary.isActive = true;
            this.state.roundSummary.startPlayerId = this.state.game.currentPlayerId;
        }
        this.state.roundSummary.powersUsed.push({ playerId: 'player-main', powerId: concept.id });

        player.score -= concept.cost;
        SoundManager.play('power_activate');

        conceptEl.classList.add('vanishing');
        if (concept.handler) { concept.handler(this); }

        setTimeout(() => {
            const conceptIndex = player.concepts.findIndex(c => c.id === concept.id);
            if (player.conceptDeck.length === 0) this.replenishConceptDeck();

            const newConcept = player.conceptDeck.shift();
            if (conceptIndex !== -1 && newConcept) player.concepts[conceptIndex] = newConcept;

            this.render();
        }, 500);
    },

    /**
     * Replenishes the player's concept deck when it runs out.
     * Shuffles available concepts that are not currently in the player's hand.
     */
    replenishConceptDeck() {
        const player = this.state.game.players['player-main'];
        this.logEvent('Seu deck de conceitos foi reembaralhado!', 'game-event');
        const currentConceptIds = new Set(player.concepts.map(p => p.id));
        const allConceptIds = Object.keys(CONCEPTS_DATA);
        const availableConcepts = allConceptIds.filter(id => !currentConceptIds.has(id));
        player.conceptDeck = Utils.shuffleArray(availableConcepts).map(id => CONCEPTS_DATA[id]);
    }
};