import { arenas } from '../../js/data/arenas.js';
import { LogosGame } from '../../js/game/Game.js';

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
    const cs = t.closest('.chest-slot');
    if (cs) {
        const i = cs.dataset.index, c = gameState.chestSlots[i];
        if (c && c.status === 'locked' && !gameState.isUnlocking) {
            c.status = 'unlocking';
            gameState.isUnlocking = true;
            toast.show(`Começando a estudar a obra ${c.type}!`, 'info');
        } else if (c && c.status === 'locked' && gameState.isUnlocking) {
            toast.show('Outra obra já está sendo estudada!', 'warning');
        }
    }
    if (t.classList.contains('open-btn')) {
        const i = t.closest('.chest-slot').dataset.index;
        gameState.scrolls += 50;
        gameState.books += 1;
        toast.show(`Você ganhou 50 pergaminhos e 1 livro!`, 'success');
        gameState.chestSlots[i] = null;
    }
    if (t.matches('.battle-button')) {
        const gameContainer = document.querySelector('.game-container');
        const gameBoard = document.getElementById('game-board');

        gameContainer.style.display = 'none';
        gameBoard.style.display = 'flex';

        new LogosGame();
    }
}