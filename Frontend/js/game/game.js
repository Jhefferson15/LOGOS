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

// Inicializa o SoundManager imediatamente
SoundManager.init();

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
    const GameUI = {
        state: {},
        elements: {},

        // Método de inicialização central
        init() {
            this.cacheDOMElements();
            this.restartGame();
        },

        restartGame() {
            this.initializeState(); // Do StateModule
            this.renderPlayerAreas(); // Do RendererModule
            this.render(); // Do RendererModule

            document.getElementById('pause-menu-overlay').classList.add('hidden');
            document.getElementById('game-over-overlay').classList.add('hidden');

            this.logEvent('Partida iniciada. Boa sorte!', 'game-event');
            this.animatePlayerEntry(); // Do AnimationsModule
        },

        endGame(winnerId) {
            this.state.isGameOver = true;
            const isPlayerWinner = winnerId === 'player-main';

            // Simulate rewards
            const trophyChange = isPlayerWinner ? 30 : -20;
            const scrollsReward = isPlayerWinner ? 100 : 25;
            const chestReward = isPlayerWinner ? 'Baú de Madeira' : null;

            // Open the new end game popup instead of the old overlay
            popupManager.open('game:end-game', {
                isVictory: isPlayerWinner,
                trophyChange: trophyChange,
                scrollsReward: scrollsReward,
                chestReward: chestReward
            });

            this.logEvent(`${this.state.playersData[winnerId].name} venceu a partida!`, 'game-event');
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
        });
    } else {
        GameUI.init();
        GameUI.bindEventListeners();
    }
}