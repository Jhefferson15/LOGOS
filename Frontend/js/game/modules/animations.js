import { ERA_COLOR_MAP } from './constants.js';
import { PHILOSOPHERS_DATA } from '../../data/philosophers.js';
import { SoundManager } from './audio.js';
import { Utils } from './utils.js';

/**
 * Module responsible for handling game animations.
 * Includes card movements, visual effects, and UI transitions.
 * @namespace AnimationsModule
 */
export const AnimationsModule = {
    /**
     * Animates a card flying from a start element to an end element.
     * @async
     * @param {HTMLElement} startElement - The starting element.
     * @param {HTMLElement} endElement - The destination element.
     * @param {object} cardData - Data of the card being animated.
     * @param {boolean} [isOpponent=false] - Whether the card belongs to an opponent (shows card back).
     * @returns {Promise<void>}
     */
    async animateCardFly(startElement, endElement, cardData, isOpponent = false) {
        const startRect = startElement.getBoundingClientRect();
        const endRect = endElement.getBoundingClientRect();
        const cardEl = document.createElement('div');
        cardEl.className = 'cr-card animated-card-fly';
        const color = ERA_COLOR_MAP[cardData.era] || 'wild';
        cardEl.dataset.color = color;

        if (isOpponent) cardEl.classList.add('back');
        else cardEl.innerHTML = Utils.renderCardContent(cardData);

        document.body.appendChild(cardEl);

        Object.assign(cardEl.style, { width: `${startRect.width}px`, height: `${startRect.height}px`, top: `${startRect.top}px`, left: `${startRect.left}px` });
        await new Promise(r => requestAnimationFrame(r));

        const targetLeft = endRect.left + (endRect.width / 2) - (startRect.width / 2);
        const targetTop = endRect.top + (endRect.height / 2) - (startRect.height / 2);

        cardEl.style.transform = 'scale(1)';
        cardEl.style.left = `${targetLeft}px`;
        cardEl.style.top = `${targetTop}px`;

        await new Promise(r => setTimeout(r, 600));
        cardEl.remove();
    },

    /**
     * Triggers a visual effect (particle explosion) at a specific coordinate.
     * @param {number} x - The x-coordinate for the effect.
     * @param {number} y - The y-coordinate for the effect.
     * @param {string} color - The color of the particles (based on era).
     */
    triggerVFX(x, y, color) {
        const particleColor = color === 'wild' ? '#ffffff' : `var(--card-${color})`;
        for (let i = 0; i < 12; i++) {
            const p = document.createElement('div');
            p.className = 'vfx-particle';
            p.style.backgroundColor = particleColor;
            document.body.appendChild(p);
            const angle = (i / 12) * 360, r = 50 + Math.random() * 50;
            p.style.left = `${x}px`; p.style.top = `${y}px`;
            p.style.setProperty('--transform-end', `translate(${Math.cos(angle * Math.PI / 180) * r}px, ${Math.sin(angle * Math.PI / 180) * r}px)`);
            setTimeout(() => p.remove(), 700);
        }
    },

    /**
     * Animates the shuffling of the discard pile back into the draw deck.
     * @async
     * @returns {Promise<void>}
     */
    async animateShuffle() {
        this.state.isAnimating = true;
        SoundManager.play('shuffle');
        this.logEvent("Embaralhando descarte...", 'game-event');
        const discardRect = this.elements.discardPile.getBoundingClientRect();
        const drawRect = this.elements.drawDeck.getBoundingClientRect();
        const cardsToShuffle = this.state.game.discardPile.slice(0, -1);

        if (cardsToShuffle.length === 0) {
            this.state.isAnimating = false;
            return;
        }

        const cards = cardsToShuffle.map(cardId => {
            const cardData = PHILOSOPHERS_DATA[cardId];
            const card = document.createElement('div');
            card.className = 'cr-card shuffling-card';
            card.innerHTML = Utils.renderCardContent(cardData);
            Object.assign(card.style, { top: `${discardRect.top}px`, left: `${discardRect.left}px`, width: `${discardRect.width}px`, height: `${discardRect.height}px` });
            document.body.appendChild(card);
            return card;
        });

        await new Promise(r => requestAnimationFrame(r));
        cards.forEach((card, i) => {
            card.style.left = `${drawRect.left}px`;
            card.style.top = `${drawRect.top}px`;
            card.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
        });

        await new Promise(r => setTimeout(r, 600));
        cards.forEach(card => card.remove());
        this.state.isAnimating = false;
    },

    /**
     * Animates the entry of player areas when the game starts.
     */
    animatePlayerEntry() {
        document.querySelectorAll('.player-area.pre-enter').forEach((el, i) => {
            setTimeout(() => el.classList.remove('pre-enter'), 200 * (i + 1));
        });
    }
};