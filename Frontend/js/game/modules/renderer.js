import { PHILOSOPHERS_DATA } from './../../data/philosophers.js';
import { CONCEPTS_DATA } from './../../data/concepts.js';
import { ERA_COLOR_MAP } from './constants.js';
import { Utils } from './utils.js';

/**
 * Module responsible for rendering the game UI.
 * Handles DOM manipulation and updates based on the game state.
 * @namespace RendererModule
 */
export const RendererModule = {
    render() {
        console.log('--- render ---');
        this.renderOpponentHands();
        this.renderTurnIndicator();
        this.renderDiscardPile();
        this.renderBottomHud();
        this.renderDeckCounters();
        this.state.game.playerOrder.forEach(id => {
            const playerEl = document.getElementById(id);
            const scoreEl = playerEl ? playerEl.querySelector('.player-score') : null;
            if (scoreEl) {
                scoreEl.textContent = this.state.game.players[id].score;
            }
        });
    },

    renderPlayerAreas() {
        console.log('--- renderPlayerAreas ---');
        const playerAreasContainer = this.elements.gameBoardContainer;
        playerAreasContainer.innerHTML = '';
        this.state.game.playerOrder.forEach(playerId => {
            const playerData = this.state.playersData[playerId];
            const playerEl = document.createElement('div');
            playerEl.id = playerId;
            playerEl.className = 'player-area';
            if (playerId !== 'player-main') {
                playerEl.classList.add('opponent');
            }
            playerEl.innerHTML = `
                <div class="player-info">
                    <div class="player-avatar">${playerData.avatarSVG}</div>
                    <span class="player-name">${playerData.name}</span>
                    <span class="player-score">${this.state.game.players[playerId].score}</span>
                </div>
                <div class="status-effects-container"></div>
            `;
            playerAreasContainer.appendChild(playerEl);
        });
    },

    renderOpponentHands() {
        this.state.game.playerOrder.forEach(id => {
            if (id === 'player-main') return;
            const player = this.state.game.players[id];
            const playerEl = document.getElementById(id);
            if (playerEl) {
                let handHtml = '';
                for (let i = 0; i < player.hand.length; i++) {
                    handHtml += `<div class="cr-card back"></div>`;
                }
                playerEl.querySelector('.status-effects-container').innerHTML = handHtml;
            }
        });
    },

    renderTurnIndicator() {
        this.elements.playerAreas.forEach(el => {
            el.classList.remove('active-player');
        });
        const currentPlayerEl = document.getElementById(this.state.game.currentPlayerId);
        if (currentPlayerEl) {
            currentPlayerEl.classList.add('active-player');
        }
    },

    renderDiscardPile() {
        const topCardId = this.state.game.lastPlayedCard;
        if (topCardId) {
            const cardData = PHILOSOPHERS_DATA[topCardId];
            const color = ERA_COLOR_MAP[cardData.era] || 'wild';
            this.elements.discardPile.innerHTML = `<div class="cr-card" data-color="${color}">${Utils.renderCardContent(cardData)}</div>`;
        } else {
            this.elements.discardPile.innerHTML = '';
        }
    },

    renderBottomHud() {
        this.renderPlayerHandArc();
        this.renderPlayerConcepts();
    },

    renderPlayerHandArc() {
        const hand = this.state.game.players['player-main'].hand;
        const handContainer = this.elements.crHandContainer;
        handContainer.innerHTML = '';
        hand.forEach((cardId, index) => {
            const cardData = PHILOSOPHERS_DATA[cardId];
            const cardEl = document.createElement('div');
            cardEl.className = 'cr-card';
            cardEl.dataset.index = index;
            const color = ERA_COLOR_MAP[cardData.era] || 'wild';
            cardEl.dataset.color = color;
            cardEl.innerHTML = Utils.renderCardContent(cardData);
            handContainer.appendChild(cardEl);
        });
    },

    renderPlayerConcepts() {
        const concepts = this.state.game.players['player-main'].concepts;
        const powersContainer = this.elements.powersContainer;
        powersContainer.innerHTML = '';
        concepts.forEach(concept => {
            const conceptEl = document.createElement('div');
            conceptEl.className = 'concept-card';
            conceptEl.innerHTML = `
                <div class="concept-icon">${concept.icon}</div>
                <div class="concept-name">${concept.name}</div>
                <div class="concept-cost">${concept.cost}</div>
            `;
            powersContainer.appendChild(conceptEl);
        });
    },

    renderDeckCounters() {
        this.elements.drawDeckCounter.textContent = this.state.game.drawDeck.length;
        this.elements.discardPileCounter.textContent = this.state.game.discardPile.length;
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