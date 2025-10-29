import { arenas } from '../../js/data/arenas.js';
import { LogosGame } from '../../js/game/Game.js';
import { popupManager } from '../../js/ui/PopupManager.js'; // Importe o popupManager


export function initPlayScreen(gameState, updateDynamicUI, toast) {
    const arena = arenas[Math.floor(Math.random() * arenas.length)];
    const arenaSection = document.querySelector('.arena-section');
    if (arenaSection) {
        const arenaDisplay = arenaSection.querySelector('.arena-display');
        arenaDisplay.innerHTML = `<img src="${arena.image}" alt="${arena.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0.6rem;">`;

        const arenaName = arenaSection.querySelector('.arena-name');
        if (arenaName) {
            arenaName.innerText = arena.name;
        }
    }
    updateDynamicUI();
}

export function handlePlayScreenClick(e, gameState, updateDynamicUI, toast, LogosGame) {
    const t = e.target;

    // --- Chamadas para o Popup Manager ---
    if (t.closest('.player-profile')) {
        popupManager.open('full-profile');
        return;
    }
    if (t.closest('.settings')) {
        popupManager.open('settings');
        return;
    }
    if (t.closest('.arena-display')) {
        popupManager.open('arena-timeline');
        return;
    }
    // Novo: Gatilhos para os baús de tempo
    if (t.closest('#free-chest')) {
        popupManager.open('timed-chest-info', { type: 'free' });
        return;
    }
    if (t.closest('#crown-chest')) {
        popupManager.open('timed-chest-info', { type: 'crown' });
        return;
    }
    
    // --- Lógica de Baús (existente e modificada) ---
    const cs = t.closest('.chest-slot');
    if (cs) {
        const i = cs.dataset.index, c = gameState.chestSlots[i];
        if (!c) return; // Slot vazio

        // Se clicar no botão de abrir
        if (t.classList.contains('open-btn')) {
            const chest = gameState.chestSlots[i];
            const rewards = { scrolls: 50, books: 1 };
            gameState.scrolls += rewards.scrolls;
            gameState.books += rewards.books;
            popupManager.open('chest-rewards', { chestType: chest.type, rewards: rewards });
            gameState.chestSlots[i] = null;
            return;
        }

        // Se clicar no baú trancado para ver informações
        if (c.status === 'locked' || c.status === 'unlocking') {
            popupManager.open('chest-info', { chest: c });
            return; // Abrimos o info, paramos aqui
        }
    }
    if (t.classList.contains('open-btn')) {
        const i = t.closest('.chest-slot').dataset.index;
        const chest = gameState.chestSlots[i];

        // Simular recompensas
        const rewards = { scrolls: 50, books: 1 };
        gameState.scrolls += rewards.scrolls;
        gameState.books += rewards.books;

        // Abrir o pop-up de recompensas
        popupManager.open('chest-rewards', { chestType: chest.type, rewards: rewards });
        
        // Limpar o slot do baú
        gameState.chestSlots[i] = null;
    }

    // --- Lógica de Iniciar Batalha (existente) ---
    if (t.matches('.battle-button')) {
        const gameContainer = document.querySelector('.game-container');
        const gameBoard = document.getElementById('game-board');

        gameContainer.style.display = 'none';
        gameBoard.style.display = 'flex';

        new LogosGame();
    }

    // Não precisa chamar updateDynamicUI() aqui, pois ele é chamado no loop do main.js
}