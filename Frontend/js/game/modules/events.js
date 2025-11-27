import { SoundManager } from './audio.js';
import { popupManager } from '../../ui/PopupManager.js';

/**
 * Module responsible for handling user input and game events.
 * Manages event listeners, pointer interactions, and drag-and-drop logic.
 * @namespace EventsModule
 */
export const EventsModule = {
    listeners: [],

    /**
     * Adds an event listener to an element and tracks it for cleanup.
     * @param {HTMLElement|Window} element - The target element.
     * @param {string} event - The event name.
     * @param {Function} handler - The event handler function.
     * @param {object|boolean} [options=false] - Event listener options.
     */
    addListener(element, event, handler, options = false) {
        if (!element) return;
        element.addEventListener(event, handler, options);
        this.listeners.push({ element, event, handler });
    },

    /**
     * Removes all registered event listeners.
     * Should be called when the game is destroyed or restarted.
     */
    cleanupEventListeners() {
        this.listeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.listeners = [];
    },

    /**
     * Binds all necessary event listeners for the game.
     * Includes UI buttons, keyboard shortcuts, and pointer events.
     */
    bindEventListeners() {
        this.cleanupEventListeners();

        this.addListener(this.elements.gameScreen, 'pointerdown', this.onPointerDown.bind(this));
        this.addListener(window, 'pointermove', this.onPointerMove.bind(this), { passive: false });
        this.addListener(window, 'pointerup', this.onPointerUp.bind(this));

        this.addListener(this.elements.drawDeck, 'click', () => {
            if (this.state.game.currentPlayerId === 'player-main' && !this.state.isAnimating) {
                SoundManager.play('button_click');
                this.playerDrawsCard(true);
            }
        });

        this.addListener(this.elements.pauseButton, 'click', () => { SoundManager.play('button_click'); this.togglePause(true); });
        this.addListener(this.elements.resumeButton, 'click', () => { SoundManager.play('button_click'); this.togglePause(false); });
        this.addListener(this.elements.restartButton, 'click', () => { SoundManager.play('button_click'); this.restartGame(); });
        this.addListener(this.elements.playAgainButton, 'click', () => { SoundManager.play('button_click'); this.restartGame(); });
        this.addListener(this.elements.soundToggle, 'change', e => SoundManager.toggleMute(!e.target.checked));
        this.addListener(this.elements.quitButton, 'click', () => { SoundManager.play('button_click'); this.handleQuit(); });
        this.addListener(window, 'keydown', e => { if (e.key === 'Escape') this.togglePause(!this.state.isPaused); });

        this.addListener(this.elements.hudToggle, 'click', () => document.getElementById('bottom-hud').classList.toggle('collapsed'));
        this.addListener(this.elements.logToggle, 'click', () => this.elements.gameLog.classList.toggle('collapsed'));
    },

    /**
     * Toggles the game pause state.
     * @param {boolean} pauseState - True to pause, false to resume.
     */
    togglePause(pauseState) {
        this.state.isPaused = pauseState;
        this.elements.pauseMenuOverlay.classList.toggle('hidden', !this.state.isPaused);
    },

    /**
     * Handles the player quitting the game.
     * Calculates partial rewards and redirects to the main menu.
     */
    handleQuit() {
        // Close pause menu
        this.togglePause(false);

        // Calculate partial rewards for quitting mid-game
        // Player gets reduced rewards for quitting
        const trophyChange = -10; // Penalty for quitting
        const scrollsReward = 10; // Small consolation reward
        const chestReward = null; // No chest for quitting

        // Save result to localStorage to be shown in the main menu
        const gameResult = {
            isVictory: false,
            trophyChange: trophyChange,
            scrollsReward: scrollsReward,
            chestReward: chestReward,
            winnerName: 'Desistência'
        };
        localStorage.setItem('gameResult', JSON.stringify(gameResult));

        // Redirect to main menu immediately
        window.location.href = '../index.html';
    },

    // --- Pointer Logic & Drag ---
    /**
     * Handles the pointer down event (mouse click or touch start).
     * Initiates card selection or dragging.
     * @param {PointerEvent} e - The pointer event.
     */
    onPointerDown(e) {
        if (this.state.isAnimating || this.state.game.currentPlayerId !== 'player-main' || this.state.isPaused || e.button !== 0) return;

        const cardEl = e.target.closest('.cr-card');
        const isHandCard = cardEl && this.elements.crHandContainer.contains(cardEl);
        const isSlotCard = cardEl && this.elements.selectedCardSlot.contains(cardEl);

        if (!isHandCard && !isSlotCard) return;

        e.preventDefault();

        const cardIndex = isHandCard ? parseInt(cardEl.dataset.index) : this.state.selectedCardIndex;

        if (isHandCard) {
            if (this.state.selectedCardIndex === cardIndex) {
                this.state.selectedCardIndex = null;
            } else {
                this.state.selectedCardIndex = cardIndex;
            }
            this.renderPlayerHandArc();

            setTimeout(() => {
                const elementToDrag = this.elements.selectedCardSlot.querySelector('.cr-card');
                if (elementToDrag) this.startDrag(e, elementToDrag, cardIndex);
            }, 50);
        } else if (isSlotCard) {
            this.startDrag(e, cardEl, cardIndex);
        }
    },

    /**
     * Starts the drag operation for a card.
     * Creates a visual clone of the card for dragging.
     * @param {PointerEvent} e - The pointer event.
     * @param {HTMLElement} originalEl - The original card element.
     * @param {number} index - The index of the card in the hand.
     */
    startDrag(e, originalEl, index) {
        if (this.state.dragState.isDragging) return;

        SoundManager.play('button_click');

        const clone = originalEl.cloneNode(true);
        clone.classList.add('drag-clone');
        document.body.appendChild(clone);

        this.state.dragState = {
            isDragging: true,
            draggedCardIndex: index,
            draggedElement: originalEl,
            cloneElement: clone,
            offset: {
                x: e.clientX - originalEl.getBoundingClientRect().left,
                y: e.clientY - originalEl.getBoundingClientRect().top
            }
        };
        originalEl.style.opacity = '0';
    },

    /**
     * Handles the pointer move event.
     * Updates the position of the dragged card clone.
     * @param {PointerEvent} e - The pointer event.
     */
    onPointerMove(e) {
        if (!this.state.dragState.isDragging) return;
        e.preventDefault();

        const { cloneElement, offset } = this.state.dragState;

        cloneElement.style.left = `${e.clientX - offset.x}px`;
        cloneElement.style.top = `${e.clientY - offset.y}px`;

        const discardRect = this.elements.discardPile.getBoundingClientRect();
        const isOverDiscard = e.clientX > discardRect.left && e.clientX < discardRect.right &&
            e.clientY > discardRect.top && e.clientY < discardRect.bottom;
        this.elements.discardPile.classList.toggle('droppable', isOverDiscard);
    },

    /**
     * Handles the pointer up event (release).
     * Completes the drag operation, playing the card if dropped on the discard pile.
     * @param {PointerEvent} e - The pointer event.
     */
    onPointerUp(e) {
        if (!this.state.dragState.isDragging) return;

        const { cloneElement, draggedElement, draggedCardIndex } = this.state.dragState;
        const discardRect = this.elements.discardPile.getBoundingClientRect();

        const isOverDiscard = e.clientX > discardRect.left && e.clientX < discardRect.right &&
            e.clientY > discardRect.top && e.clientY < discardRect.bottom;

        if (isOverDiscard) {
            this.playCard(draggedCardIndex);
        } else {
            draggedElement.style.opacity = '1';
            this.state.selectedCardIndex = null;
            this.renderPlayerHandArc();
        }

        if (cloneElement) cloneElement.remove();
        this.elements.discardPile.classList.remove('droppable', 'invalid-drop');
        this.state.dragState = { isDragging: false };
    }
};