import { PHILOSOPHERS_DATA } from './../../data/philosophers.js';
import { CONCEPTS_DATA } from './../../data/concepts.js';
import { ERA_COLOR_MAP, OPPONENT_PLAY_DELAY } from './constants.js';
import { SoundManager } from './audio.js';
import { Utils } from './utils.js';

export const EngineModule = {
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

    async playCard(cardIndex) {
        if (this.state.isAnimating || this.state.isGameOver) return;

        const player = this.state.game.players['player-main'];
        const cardToPlayId = player.hand[cardIndex];

        const points = this.calculateChronologicalScore(cardToPlayId);
        player.score += points;

        this.state.isAnimating = true;
        this.hideTooltip();
        SoundManager.play('play_card');

        let startElement = this.elements.selectedCardSlot.querySelector('.cr-card') || Array.from(this.elements.crHandContainer.children).find(el => parseInt(el.dataset.index) === cardIndex);

        if (!startElement) startElement = Array.from(this.elements.crHandContainer.children)[0];

        await this.animateCardFly(startElement, this.elements.discardPile, PHILOSOPHERS_DATA[cardToPlayId]);

        const playedCardId = player.hand.splice(cardIndex, 1)[0];
        this.state.game.discardPile.push(playedCardId);
        this.state.game.lastPlayedCard = playedCardId;
        this.logEvent(`jogou ${PHILOSOPHERS_DATA[playedCardId].name} e ganhou ${points} Pontos de Sabedoria!`, 'play-card', 'player-main');

        const cardData = PHILOSOPHERS_DATA[playedCardId];
        const color = ERA_COLOR_MAP[cardData.era] || 'wild';
        const discardRect = this.elements.discardPile.getBoundingClientRect();
        this.triggerVFX(discardRect.left + discardRect.width / 2, discardRect.top + discardRect.height / 2, color);

        // --- ALTERAÇÃO AQUI ---
        // As linhas que compravam uma nova carta foram removidas.
        // O jogador agora ficará com uma carta a menos na mão após jogar.

        this.state.selectedCardIndex = null;
        this.render();

        this.checkForWinner();
        if (this.state.isGameOver) {
            this.state.isAnimating = false;
            return;
        }

        this.applyCardEffect(cardData);
        this.advanceTurn();
        this.state.isAnimating = false;
    },

    calculateChronologicalScore(playedPhilosopherId) {
        const topOfPileId = this.state.game.lastPlayedCard;
        const orderedList = this.state.game.orderedPhilosophers;

        const playedIndex = orderedList.indexOf(playedPhilosopherId);
        const topOfPileIndex = orderedList.indexOf(topOfPileId);

        if (playedIndex === -1 || topOfPileIndex === -1) return 0;

        const indexDiff = Math.abs(playedIndex - topOfPileIndex);

        if (indexDiff === 0) return 0;
        if (indexDiff === 1) return 10;

        const points = 10 - 2 * (indexDiff - 1);
        return Math.max(0, points);
    },

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
        if (game.currentPlayerId !== 'player-main' && !this.state.isGameOver) {
            setTimeout(() => this.simulateOpponentTurn(), OPPONENT_PLAY_DELAY);
        }
    },

    async simulateOpponentTurn() {
        if (this.state.isGameOver || this.state.isPaused) return;

        const opponentId = this.state.game.currentPlayerId;
        const opponent = this.state.game.players[opponentId];

        let bestCardIndex = -1;
        let maxScore = -1;

        if (opponent.hand.length > 0) {
            opponent.hand.forEach((cardId, index) => {
                const score = this.calculateChronologicalScore(cardId);
                if (score > maxScore) {
                    maxScore = score;
                    bestCardIndex = index;
                }
            });
        }

        // Lógica da IA: Se não tiver boa jogada, compra carta
        if (bestCardIndex === -1 || (maxScore <= 2 && Math.random() < 0.5)) {
            const newCard = await this.drawCardFromDeck();
            if (newCard) {
                opponent.hand.push(newCard);
                this.logEvent(`comprou uma carta.`, 'draw-card', opponentId);
                this.render();
            } else {
                this.logEvent(`tentou comprar mas o baralho está vazio.`, 'draw-card', opponentId);
            }
            this.advanceTurn();
            return;
        }

        const cardToPlayId = opponent.hand[bestCardIndex];
        opponent.score += maxScore;

        this.state.isAnimating = true;
        SoundManager.play('play_card');
        await this.animateCardFly(document.getElementById(opponentId), this.elements.discardPile, PHILOSOPHERS_DATA[cardToPlayId], true);

        const playedCardId = opponent.hand.splice(bestCardIndex, 1)[0];
        this.state.game.discardPile.push(playedCardId);
        this.state.game.lastPlayedCard = playedCardId;
        this.logEvent(`jogou ${PHILOSOPHERS_DATA[playedCardId].name} e ganhou ${maxScore} pts!`, 'play-card', opponentId);

        // --- ALTERAÇÃO AQUI ---
        // Também removi a compra automática da IA para manter as regras iguais para todos.
        // const newCard = await this.drawCardFromDeck();
        // if (newCard) opponent.hand.push(newCard);

        this.render();
        this.checkForWinner();
        if (this.state.isGameOver) { this.state.isAnimating = false; return; }

        this.advanceTurn();
        this.state.isAnimating = false;
    },

    applyCardEffect(card) {
        // Placeholder
    },

    checkForWinner() {
        // Verifica se alguém ficou sem cartas na mão OU se o deck acabou
        const anyPlayerHandEmpty = this.state.game.playerOrder.some(id => this.state.game.players[id].hand.length === 0);

        if (this.state.game.drawDeck.length === 0 || anyPlayerHandEmpty) {
            let winnerId = this.state.game.playerOrder[0];
            let highScore = -1;
            this.state.game.playerOrder.forEach(id => {
                const playerScore = this.state.game.players[id].score;
                if (playerScore > highScore) {
                    highScore = playerScore;
                    winnerId = id;
                }
            });
            this.endGame(winnerId);
        }
    },

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

    replenishConceptDeck() {
        const player = this.state.game.players['player-main'];
        this.logEvent('Seu deck de conceitos foi reembaralhado!', 'game-event');
        const currentConceptIds = new Set(player.concepts.map(p => p.id));
        const allConceptIds = Object.keys(CONCEPTS_DATA);
        const availableConcepts = allConceptIds.filter(id => !currentConceptIds.has(id));
        player.conceptDeck = Utils.shuffleArray(availableConcepts).map(id => CONCEPTS_DATA[id]);
    }
};