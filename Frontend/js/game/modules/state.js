import { PHILOSOPHERS_DATA } from '../../data/philosophers.js';
import { CONCEPTS_DATA } from '../../data/concepts.js';
import { MAIN_PLAYER_DATA, OPPONENT_POOL, PLAYER_CONCEPT_SLOTS } from './constants.js';
import { Utils } from './utils.js';
import { MechanicManager } from '../mechanics/MechanicManager.js';

/**
 * Module responsible for managing the game state.
 * Initializes and resets the state, including players, decks, and game variables.
 * @namespace StateModule
 */
export const StateModule = {
    /**
     * Caches references to frequently accessed DOM elements.
     * Should be called once during initialization or when the DOM is reset.
     */
    cacheDOMElements() {
        this.elements = {
            // Game screen
            gameScreen: document.getElementById('game-screen'),

            // Game board and player areas
            gameBoardContainer: document.getElementById('game-board-container'),
            playerAreas: document.querySelectorAll('.player-area'),

            // Card areas
            discardPile: document.getElementById('discard-pile'),
            drawDeck: document.getElementById('draw-deck'),
            drawDeckCounter: document.getElementById('draw-deck-counter'),
            discardPileCounter: document.getElementById('discard-pile-counter'),

            // Player hand and UI
            crHandContainer: document.getElementById('cr-hand-container'),
            selectedCardSlot: document.getElementById('selected-card-slot'),
            powersContainer: document.getElementById('powers-container'),
            nextPowerCard: document.getElementById('next-power-card'),

            // UI elements
            tooltip: document.getElementById('card-tooltip'),
            tooltipTitle: document.getElementById('tooltip-title'),
            tooltipDescription: document.getElementById('tooltip-description'),
            gameLog: document.getElementById('game-log'),
            logList: document.getElementById('log-list'),
            hudToggle: document.getElementById('hud-toggle'),
            logToggle: document.getElementById('log-toggle'),

            // Buttons
            pauseButton: document.getElementById('pause-button'),
            resumeButton: document.getElementById('resume-button'),
            quitButton: document.getElementById('quit-button'),
            restartButton: document.getElementById('restart-button'),
            drawCardBtn: document.getElementById('draw-card-btn'),
            playAgainButton: document.getElementById('play-again-button'),
            soundToggle: document.getElementById('sound-toggle'),

            // Overlays
            pauseMenuOverlay: document.getElementById('pause-menu-overlay'),
        };
    },

    /**
     * Initializes the game by caching DOM elements and setting up the initial state.
     * This is the main entry point called by GameUI.
     */
    init() {
        this.cacheDOMElements();
        this.initializeState();
    },

    /**
     * Initializes the game state for a new match.
     * Sets up players, decks, initial hands, and game flags.
     */
    initializeState() {
        const opponentData = Utils.shuffleArray([...OPPONENT_POOL]).slice(0, 3);
        const playerIds = [MAIN_PLAYER_DATA.id];
        const playersData = { [MAIN_PLAYER_DATA.id]: { name: MAIN_PLAYER_DATA.name, avatarSVG: MAIN_PLAYER_DATA.avatarSVG } };

        opponentData.forEach((opponent, i) => {
            const opponentId = `opponent-${i}`;
            playerIds.push(opponentId);
            playersData[opponentId] = { name: opponent.name, avatarSVG: opponent.avatarSVG };
        });

        const mechanic = MechanicManager.getActiveMechanic();

        this.state = {
            isAnimating: false,
            isPaused: false,
            isGameOver: false,
            logMessages: [],
            dragState: { isDragging: false },
            selectedCardIndex: null,
            roundSummary: { isActive: false, startPlayerId: null, powersUsed: [] },
            playersData: playersData,
            game: {
                orderedPhilosophers: [],
                lastPlayedCard: null,
                drawDeck: [],
                discardPile: [],
                playerOrder: playerIds,
                currentPlayerIndex: 0,
                get currentPlayerId() { return this.playerOrder[this.currentPlayerIndex]; },
                players: {}
            }
        };

        playerIds.forEach(id => {
            this.state.game.players[id] = {
                score: 0,
                hand: [],
                statusEffects: [],
                concepts: [],
                conceptDeck: []
            };
        });

        // Delegate state initialization to the active mechanic
        mechanic.initializeState(this, this, Utils);

        // Continue with generic setup that isn't mechanic-dependent
        const mainPlayer = this.state.game.players['player-main'];
        const allConceptIds = Utils.shuffleArray(Object.keys(CONCEPTS_DATA));
        mainPlayer.concepts = allConceptIds.splice(0, PLAYER_CONCEPT_SLOTS).map(id => CONCEPTS_DATA[id]);
        mainPlayer.conceptDeck = allConceptIds.map(id => CONCEPTS_DATA[id]);
    }
};