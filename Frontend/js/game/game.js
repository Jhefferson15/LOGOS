// --- MAIN GAME ENTRY POINT ---

// Importação dos Módulos
import { SoundManager } from './modules/audio.js';
import { StateModule } from './modules/state.js';
import { EngineModule } from './modules/engine.js';
import { RendererModule } from './modules/renderer.js';
import { AnimationsModule } from './modules/animations.js';
import { EventsModule } from './modules/events.js';
import { Utils } from './modules/utils.js'; // Importar se quiser expor utilitários globalmente, opcional
import { popupManager } from '../ui/PopupManager.js';
import { MechanicManager } from './mechanics/MechanicManager.js';
import { gameState } from '../data/gameState.js';

// Inicializa o SoundManager imediatamente
SoundManager.init();

// Initialize MechanicManager (registers all mechanics)
MechanicManager.init();

// FORCE active mechanic from localStorage
const storedMode = localStorage.getItem('selectedGameMode');
const targetMode = storedMode || 'temporal';

console.log(`[GameInit] Enforcing game mode: ${targetMode}`);
MechanicManager.setActiveMechanic(targetMode);

// Double check
if (MechanicManager.activeMechanicId !== targetMode) {
    console.warn(`[GameInit] Mechanic mismatch! Forcing ${targetMode}...`);
    MechanicManager.setActiveMechanic(targetMode);
}

// Expose MechanicManager globally for debugging/switching
window.MechanicManager = MechanicManager;
window.setGameMechanic = (id) => {
    MechanicManager.setActiveMechanic(id);
    // gameState.gameMode = id; // Removed to avoid conflicts
    localStorage.setItem('selectedGameMode', id); // Persist change
    if (window.GameUI) {
        window.GameUI.restartGame();
    }
};

// Verifica lógica SPA (Single Page App) para evitar duplicidade
if (window.GameUI && typeof window.GameUI.cleanupEventListeners === 'function') {
    window.GameUI.cleanupEventListeners();
    window.GameUI.cacheDOMElements();
    window.GameUI.bindEventListeners();
    window.GameUI.restartGame();
} else {
    'use strict';

    // --- AUTH CHECK ---
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = '../login.html';
    }

    // --- OBJETO PRINCIPAL (GameUI) ---
    /**
     * Main game controller object.
     * Integrates all game modules and manages the game lifecycle.
     * @namespace GameUI
     */
    const GameUI = {
        state: {},
        elements: {},

        // Método de inicialização central
        /**
         * Restarts the game session.
         * Resets state, re-renders UI, and starts animations.
         */
        restartGame() {
            this.initializeState(); // Do StateModule
            this.renderPlayerAreas(); // Do RendererModule
            this.render(); // Do RendererModule

            document.getElementById('pause-menu-overlay').classList.add('hidden');
            document.getElementById('game-over-overlay').classList.add('hidden');

            this.logEvent('Partida iniciada. Boa sorte!', 'game-event');
            this.animatePlayerEntry(); // Do AnimationsModule
        },

        /**
         * Ends the game and declares a winner.
         * Calculates rewards, saves results, and redirects to the main menu.
         * @param {string} winnerId - The ID of the winning player.
         */
        endGame(winnerId) {
            console.log('!!! DEBUG: endGame EXECUTED !!! Winner:', winnerId);
            this.state.isGameOver = true;
            const isPlayerWinner = winnerId === 'player-main';

            // Simulate rewards
            const trophyChange = isPlayerWinner ? 30 : -20;
            const scrollsReward = isPlayerWinner ? 100 : 25;
            const chestReward = isPlayerWinner ? 'Baú de Madeira' : null;

            // Save result to localStorage to be shown in the main menu
            const gameResult = {
                isVictory: isPlayerWinner,
                trophyChange: trophyChange,
                scrollsReward: scrollsReward,
                chestReward: chestReward,
                winnerName: this.state.playersData[winnerId].name
            };
            localStorage.setItem('gameResult', JSON.stringify(gameResult));

            this.logEvent(`${this.state.playersData[winnerId].name} venceu a partida!`, 'game-event');

            // Redirect to main menu immediately
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000); // Small delay to see the final move
        }
    };

    // --- MIXIN PATTERN ---
    // Mescla todas as funcionalidades dos módulos no objeto GameUI principal
    Object.assign(GameUI,
        StateModule,
        EngineModule,
        RendererModule,
        AnimationsModule,
        EventsModule
    );

    // Expõe para o escopo global (necessário para o padrão SPA usado no topo)
    window.GameUI = GameUI;

    // Inicialização segura baseada no estado do DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            GameUI.init();
            GameUI.bindEventListeners();
            GameUI.restartGame();
        });
    } else {
        GameUI.init();
        GameUI.bindEventListeners();
        GameUI.restartGame();
    }
}