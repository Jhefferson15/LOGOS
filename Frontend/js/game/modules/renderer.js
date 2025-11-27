import { PHILOSOPHERS_DATA } from './../../data/philosophers.js';
import { CONCEPTS_DATA } from './../../data/concepts.js';
import { ERA_COLOR_MAP } from './constants.js';

/**
 * Module responsible for rendering the game UI.
 * Handles DOM manipulation and updates based on the game state.
 * @namespace RendererModule
 */
export const RendererModule = {
    /**
     * Caches DOM elements to improve performance.
     * Should be called during initialization.
     */
    cacheDOMElements() {
        this.elements = {
            gameScreen: document.getElementById('game-screen'),
            crHandContainer: document.getElementById('cr-hand'),
            drawDeck: document.getElementById('draw-deck'),
            discardPile: document.getElementById('discard-pile'),
            drawDeckCounter: document.getElementById('draw-deck-counter'),
            discardPileCounter: document.getElementById('discard-pile-counter'),
            tooltip: document.getElementById('card-tooltip'),
            tooltipTitle: document.getElementById('tooltip-title'),
            tooltipDescription: document.getElementById('tooltip-description'),
            logList: document.getElementById('log-list'),
            pauseButton: document.getElementById('pause-button'),
            pauseMenuOverlay: document.getElementById('pause-menu-overlay'),
            resumeButton: document.getElementById('resume-button'),
            restartButton: document.getElementById('restart-button'),
            soundToggle: document.getElementById('sound-toggle'),
            quitButton: document.getElementById('quit-button'),
            gameOverOverlay: document.getElementById('game-over-overlay'),
            gameOverTitle: document.getElementById('game-over-title'),
            gameOverMessage: document.getElementById('game-over-message'),
            gameOverWinnerAvatar: document.getElementById('game-over-winner-avatar'),
            playAgainButton: document.getElementById('play-again-button'),
            powersContainer: document.getElementById('powers-container'),
            hudToggle: document.getElementById('hud-toggle'),
            gameLog: document.getElementById('game-log'),
            logToggle: document.getElementById('log-toggle'),
            nextPowerPreview: document.getElementById('next-power-preview'),
            nextPowerCard: document.getElementById('next-power-card'),
            selectedCardSlot: document.getElementById('selected-card-slot')
        };
    },

    /**
     * Main render loop.
     * Updates all dynamic UI elements based on the current game state.
     */
    render() {
        this.renderOpponentHands();
        this.renderTurnIndicator();
        this.renderDiscardPile();
        this.renderBottomHud();
        this.renderDeckCounters();
        this.renderScores();
        this.renderStatusEffects();
        this.renderLog();
        this.renderUsedPowerIndicators();
    },

    /**
     * Renders the player areas (opponents) on the game board.
     * Positions them in a semi-circle layout.
     */
    renderPlayerAreas() {
        const container = document.getElementById('game-board-container');
        container.querySelectorAll('.player-area.opponent').forEach(el => el.remove());

        const opponentIds = this.state.game.playerOrder.filter(id => id !== 'player-main');
        const numOpponents = opponentIds.length;

        const centerX = 50, centerY = 40, radiusX = 42, radiusY = 28;
        const startAngle = -160, endAngle = -20;
        const totalAngle = endAngle - startAngle;
        const angleStep = numOpponents > 1 ? totalAngle / (numOpponents - 1) : 0;

        opponentIds.forEach((id, i) => {
            const playerData = this.state.playersData[id];
            const el = document.createElement('div');
            el.id = id;
            el.className = 'player-area opponent pre-enter';
            el.innerHTML = `
                <div class="status-effects-container"></div>
                <div class="used-power-indicator"></div> 
                <div class="player-score">0</div>
                <div class="avatar">${playerData.avatarSVG}</div>
                <div class="player-name">${playerData.name}</div>
                <div class="opponent-hand">5</div>`;

            let currentAngle = startAngle + (i * angleStep);
            if (numOpponents === 1) currentAngle = -90;

            const angleRad = currentAngle * (Math.PI / 180);
            el.style.left = `${centerX + Math.cos(angleRad) * radiusX}%`;
            el.style.top = `${centerY + Math.sin(angleRad) * radiusY}%`;

            container.appendChild(el);
        });
        this.elements.playerAreas = document.querySelectorAll('.player-area');
    },

    /**
     * Updates the card count display for opponent hands.
     */
    renderOpponentHands() {
        Object.keys(this.state.game.players).forEach(id => {
            if (id !== 'player-main') {
                const el = document.getElementById(id);
                if (el) el.querySelector('.opponent-hand').textContent = this.state.game.players[id].hand.length;
            }
        });
    },

    /**
     * Updates the visual indicator for the active player's turn.
     */
    renderTurnIndicator() {
        if (this.elements.playerAreas) {
            this.elements.playerAreas.forEach(area => area.classList.toggle('active-turn', area.id === this.state.game.currentPlayerId));
        }
    },

    /**
     * Renders the top card of the discard pile.
     */
    renderDiscardPile() {
        const cardId = this.state.game.lastPlayedCard;
        const discardPileEl = this.elements.discardPile;
        discardPileEl.innerHTML = '';
        if (cardId) {
            const cardData = PHILOSOPHERS_DATA[cardId];
            const color = ERA_COLOR_MAP[cardData.era] || 'wild';
            discardPileEl.innerHTML = `<div class="cr-card" data-color="${color}" data-id="${cardId}" style="width:100%; height:100%;">${this.renderCardContent(cardData)}</div>`;
        }
    },

    /**
     * Renders the bottom HUD, including player hand, concepts, and elixir bar.
     */
    renderBottomHud() {
        this.renderPlayerHandArc();
        this.renderConcepts();
        this.renderNextConceptPreview();
        this.renderElixirBar();
    },

    /**
     * Renders the player's hand in an arc layout.
     * Handles card positioning, rotation, and interactivity.
     */
    renderPlayerHandArc() {
        const handContainer = this.elements.crHandContainer;
        const selectedCardSlot = this.elements.selectedCardSlot;
        handContainer.innerHTML = '';
        selectedCardSlot.innerHTML = '';
        selectedCardSlot.classList.remove('has-card');

        const cards = this.state.game.players['player-main'].hand;
        const numCards = cards.length;
        const handCardsCount = numCards - (this.state.selectedCardIndex !== null ? 1 : 0);

        const maxAngle = window.innerWidth < 768 ? Math.min(handCardsCount * 8, 50) : Math.min(handCardsCount * 10, 80);
        const anglePerCard = handCardsCount > 1 ? maxAngle / (handCardsCount - 1) : 0;
        const startAngle = -maxAngle / 2;

        let handCardIndex = 0;
        cards.forEach((cardId, index) => {
            const cardData = PHILOSOPHERS_DATA[cardId];

            if (index === this.state.selectedCardIndex) {
                const cardEl = document.createElement('div');
                cardEl.className = 'cr-card';
                const color = ERA_COLOR_MAP[cardData.era] || 'wild';
                cardEl.dataset.color = color;
                cardEl.dataset.index = index;
                cardEl.dataset.id = cardId;
                cardEl.innerHTML = this.renderCardContent(cardData);
                selectedCardSlot.appendChild(cardEl);
                selectedCardSlot.classList.add('has-card');
                return;
            }

            const cardEl = document.createElement('div');
            cardEl.className = 'cr-card';
            cardEl.dataset.index = index;
            cardEl.dataset.id = cardId;
            const color = ERA_COLOR_MAP[cardData.era] || 'wild';
            cardEl.dataset.color = color;
            cardEl.innerHTML = this.renderCardContent(cardData);

            if (this.state.game.currentPlayerId === 'player-main') {
                const isPlayable = this.calculateChronologicalScore(cardId) > 0;
                if (isPlayable) cardEl.classList.add('playable');
            }

            const angle = startAngle + (handCardIndex * anglePerCard);
            const liftDistance = window.innerWidth < 768 ? 100 : 120;
            const yCurveFactor = -0.05 * Math.pow(angle, 2);
            const transformValue = `rotate(${angle}deg) translateY(-${liftDistance + yCurveFactor * 0.15}px)`;

            cardEl.style.transform = transformValue;
            cardEl.style.setProperty('--original-transform', transformValue);
            cardEl.addEventListener('mouseenter', () => this.showTooltip(cardData, cardEl));
            cardEl.addEventListener('mouseleave', () => this.hideTooltip());
            cardEl.addEventListener('click', () => this.onPointerDown({ target: cardEl, button: 0, clientX: 0, clientY: 0, preventDefault: () => { } }));

            handContainer.appendChild(cardEl);
            handCardIndex++;
        });
    },

    /**
     * Renders the player's available concept powers.
     */
    renderConcepts() {
        const powersContainer = this.elements.powersContainer;
        powersContainer.innerHTML = '';
        const playerConcepts = this.state.game.players['player-main'].concepts;
        const playerScore = this.state.game.players['player-main'].score;
        playerConcepts.forEach(concept => {
            const conceptEl = document.createElement('div');
            conceptEl.className = 'cr-card power-card';
            conceptEl.dataset.powerId = concept.id;
            if (playerScore < concept.cost) {
                conceptEl.classList.add('unaffordable');
            }
            conceptEl.innerHTML = `<div class="card-icon">${concept.icon}</div><div class="card-cost">${concept.cost}</div>`;
            const transformValue = 'none';
            conceptEl.style.transform = transformValue;
            conceptEl.style.setProperty('--original-transform', transformValue);
            conceptEl.addEventListener('dblclick', () => this.onActivateConcept(concept, conceptEl));
            conceptEl.addEventListener('mouseenter', () => this.showTooltip({ name: concept.name, date: `Custo: ${concept.cost}`, description: concept.description }, conceptEl));
            conceptEl.addEventListener('mouseleave', () => this.hideTooltip());
            powersContainer.appendChild(conceptEl);
        });
    },

    /**
     * Renders a preview of the next concept card in the player's deck.
     */
    renderNextConceptPreview() {
        const nextPowerCardEl = this.elements.nextPowerCard;
        const nextConcept = this.state.game.players['player-main'].conceptDeck[0];
        if (nextConcept) {
            nextPowerCardEl.innerHTML = `<div class="card-icon">${nextConcept.icon}</div><div class="card-cost">${nextConcept.cost}</div>`;
            nextPowerCardEl.addEventListener('mouseenter', () => this.showTooltip({ name: nextConcept.name, date: `Custo: ${nextConcept.cost}`, description: nextConcept.description }, nextPowerCardEl));
            nextPowerCardEl.addEventListener('mouseleave', () => this.hideTooltip());
        } else {
            nextPowerCardEl.innerHTML = '';
        }
    },

    /**
     * Renders indicators for powers used during the current round.
     */
    renderUsedPowerIndicators() {
        document.querySelectorAll('.player-area .used-power-indicator').forEach(el => {
            el.innerHTML = '';
            el.classList.remove('visible');
        });

        this.state.roundSummary.powersUsed.forEach(usage => {
            const playerEl = document.getElementById(usage.playerId);
            if (playerEl) {
                const indicatorEl = playerEl.querySelector('.used-power-indicator');
                const powerData = CONCEPTS_DATA[usage.powerId];
                if (indicatorEl && powerData) {
                    indicatorEl.innerHTML = powerData.icon;
                    indicatorEl.classList.add('visible');
                }
            }
        });
    },

    /**
     * Generates the HTML content for a card.
     * @param {object} cardData - The data of the card to render.
     * @returns {string} The HTML string for the card content.
     */
    renderCardContent(cardData) {
        return `<span class="card-value">${cardData.name}</span><div class="card-cost">${cardData.date}</div>`;
    },

    /**
     * Updates the counters for the draw deck and discard pile.
     */
    renderDeckCounters() {
        this.elements.drawDeckCounter.textContent = this.state.game.drawDeck.length;
        this.elements.discardPileCounter.textContent = this.state.game.discardPile.length;
    },

    /**
     * Updates the score display for all players.
     */
    renderScores() {
        this.state.game.playerOrder.forEach(id => {
            const playerEl = document.getElementById(id);
            const scoreEl = playerEl ? playerEl.querySelector('.player-score') : null;
            if (scoreEl) {
                scoreEl.textContent = this.state.game.players[id].score;
            }
        });
    },

    /**
     * Renders active status effects for all players.
     */
    renderStatusEffects() {
        this.state.game.playerOrder.forEach(id => {
            const playerEl = document.getElementById(id);
            if (!playerEl) return;
            const container = playerEl.querySelector('.status-effects-container');
            container.innerHTML = '';
            this.state.game.players[id].statusEffects.forEach(effect => {
                const el = document.createElement('div');
                el.className = `status-effect effect-${effect.id}`;
                container.appendChild(el);
            });
        });
    },

    /**
     * Renders the game log messages.
     */
    renderLog() {
        this.elements.logList.innerHTML = this.state.logMessages.map(entry => {
            const playerNameHtml = entry.playerName ? `<span class="player-name">${entry.playerName}</span>` : '';
            return `<li data-event-type="${entry.type}">${playerNameHtml} ${entry.message}</li>`;
        }).join('');
        this.elements.logList.scrollTop = 0;
    },

    /**
     * Renders the elixir (score) progress bar.
     */
    renderElixirBar() {
        const player = this.state.game.players['player-main'];
        const elixirFill = document.getElementById('elixir-bar-fill');
        const elixirText = document.getElementById('elixir-text');

        const maxElixir = 10;
        const currentElixir = player.score % (maxElixir + 1);
        const percentage = (currentElixir / maxElixir) * 100;

        if (elixirFill) elixirFill.style.width = `${percentage}%`;
        if (elixirText) elixirText.textContent = `${currentElixir}/${maxElixir}`;
    },

    /**
     * Displays a tooltip for a card or element.
     * @param {object} cardData - Data to display in the tooltip.
     * @param {HTMLElement} targetElement - The element triggering the tooltip.
     */
    showTooltip(cardData, targetElement) {
        if (!cardData.description) return;
        const rect = targetElement.getBoundingClientRect();
        this.elements.tooltipTitle.textContent = `${cardData.name} (${cardData.era || cardData.date})`;
        this.elements.tooltipDescription.textContent = cardData.description;
        const tooltipEl = this.elements.tooltip;
        tooltipEl.classList.add('visible');
        const tooltipRect = tooltipEl.getBoundingClientRect();

        let top = rect.top - tooltipRect.height - 10;
        if (top < 10) {
            top = rect.bottom + 10;
        }

        tooltipEl.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
        tooltipEl.style.top = `${top}px`;
    },

    /**
     * Hides the tooltip.
     */
    hideTooltip() {
        this.elements.tooltip.classList.remove('visible');
    },

    /**
     * Displays a summary of the round's events (e.g., powers used) and resets round data.
     */
    showRoundSummaryAndReset() {
        const summary = this.state.roundSummary;
        if (summary.powersUsed.length === 0) {
            this.state.roundSummary = { isActive: false, startPlayerId: null, powersUsed: [] };
            this.renderUsedPowerIndicators();
            return;
        }

        if (this.elements.gameLog.classList.contains('collapsed')) {
            this.elements.gameLog.classList.remove('collapsed');
        }

        const summaryHtml = `
            <div id="round-summary-card">
                <h3>Conceitos da Rodada</h3>
                <ul>
                    ${summary.powersUsed.map(usage => {
            const playerData = this.state.playersData[usage.playerId];
            const powerData = CONCEPTS_DATA[usage.powerId];
            return `
                            <li>
                                <div class="power-icon">${powerData.icon}</div>
                                <span class="player-name">${playerData.name}:</span>
                                <span>${powerData.name}</span>
                            </li>`;
        }).join('')}
                </ul>
            </div>
        `;

        this.elements.gameLog.insertAdjacentHTML('beforeend', summaryHtml);
        requestAnimationFrame(() => {
            this.elements.gameLog.classList.add('showing-summary');
        });

        setTimeout(() => {
            const summaryCard = document.getElementById('round-summary-card');
            this.elements.gameLog.classList.remove('showing-summary');

            if (summaryCard) {
                summaryCard.addEventListener('transitionend', () => summaryCard.remove(), { once: true });
            }

            this.state.roundSummary = { isActive: false, startPlayerId: null, powersUsed: [] };
            this.renderUsedPowerIndicators();
        }, 3000);
    },

    /**
     * Logs a game event and updates the log display.
     * @param {string} message - The message to log.
     * @param {string} [type='generic'] - The type of event (for styling).
     * @param {string} [playerId=''] - The ID of the player associated with the event.
     */
    logEvent(message, type = 'generic', playerId = '') {
        const playerName = playerId && this.state.playersData[playerId] ? this.state.playersData[playerId].name : '';
        this.state.logMessages.unshift({ message, type, playerName });
        if (this.state.logMessages.length > 30) this.state.logMessages.pop();
        this.renderLog();
    }
};