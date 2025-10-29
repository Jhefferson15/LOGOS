import { arenas } from '../../js/data/arenas.js';
import { Game } from '../../js/game/index.js';
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

export function handlePlayScreenClick(e, gameState, updateDynamicUI, toast, loadScreen) {
    const t = e.target;

    if (t.matches('.battle-button')) {
        const gameScreen = document.querySelector('.game-screen');
        const gameBoard = document.getElementById('game-board');

        fetch('views/game.html')
            .then(response => response.text())
            .then(content => {
                gameBoard.innerHTML = content;
                gameScreen.style.display = 'none';
                gameBoard.style.display = 'flex';

                const game = new Game();
                game.start([
                    { name: 'Você', isAI: false },
                    { name: 'IA: Aristóteles', isAI: true },
                ]);

                document.getElementById('back-to-main').addEventListener('click', () => {
                    gameBoard.style.display = 'none';
                    gameScreen.style.display = 'flex';
                });
            });
    } else {
        // Handle other clicks for the play screen
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
        if (t.closest('#free-chest')) {
            popupManager.open('timed-chest-info', { type: 'free' });
            return;
        }
        if (t.closest('#crown-chest')) {
            popupManager.open('timed-chest-info', { type: 'crown' });
            return;
        }
        const cs = t.closest('.chest-slot');
        if (cs) {
            const i = cs.dataset.index, c = gameState.chestSlots[i];
            if (!c) return;
            if (t.classList.contains('open-btn')) {
                const chest = gameState.chestSlots[i];
                const rewards = { scrolls: 50, books: 1 };
                gameState.scrolls += rewards.scrolls;
                gameState.books += rewards.books;
                popupManager.open('chest-rewards', { chestType: chest.type, rewards: rewards });
                gameState.chestSlots[i] = null;
                return;
            }
            if (c.status === 'locked' || c.status === 'unlocking') {
                popupManager.open('chest-info', { chest: c });
                return;
            }
        }
    }
}