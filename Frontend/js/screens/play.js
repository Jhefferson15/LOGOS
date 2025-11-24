import { arenas } from '../../js/data/arenas.js';
import { popupManager } from '../../js/ui/PopupManager.js';

/**
 * Initializes the Play Screen (Main Debate Arena).
 * Sets up the arena background and name based on the current level.
 * @param {object} gameState - The global game state.
 * @param {function} updateDynamicUI - Function to refresh the UI.
 * @param {object} toast - Toast notification utility.
 */
export function initPlayScreen(gameState, updateDynamicUI, toast) {
    // Código de inicialização da tela, permanece o mesmo.
    const currentArenaId = gameState.currentArena || 1;
    const arena = arenas.find(a => a.id === currentArenaId) || arenas[0];

    const arenaSection = document.querySelector('.arena-section');
    if (arenaSection) {
        arenaSection.style.backgroundImage = `url('${arena.image}')`;
        const arenaName = arenaSection.querySelector('.arena-name');
        if (arenaName) {
            arenaName.innerText = arena.name;
        }
    }

    // Listener para mudança de arena
    if (!window._arenaChangedListener) {
        window._arenaChangedListener = (e) => {
            const newArenaId = e.detail.arenaId;
            const newArena = arenas.find(a => a.id === newArenaId);
            if (newArena) {
                if (arenaSection) {
                    arenaSection.style.backgroundImage = `url('${newArena.image}')`;
                    const arenaName = arenaSection.querySelector('.arena-name');
                    if (arenaName) {
                        arenaName.innerText = newArena.name;
                    }
                }
            }
        };
        document.addEventListener('arena-changed', window._arenaChangedListener);
    }

    // --- GAME MODE UI ---
    let gameModeBtn = document.querySelector('.game-mode-btn');
    if (!gameModeBtn && arenaSection) {
        gameModeBtn = document.createElement('div');
        gameModeBtn.className = 'game-mode-btn';
        // Estilos inline para garantir visibilidade imediata
        gameModeBtn.style.cssText = 'position: absolute; top: 80px; right: 20px; background: rgba(0,0,0,0.6); color: #fff; padding: 8px 15px; border-radius: 20px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.9rem; border: 1px solid rgba(255,255,255,0.3); z-index: 10; transition: all 0.2s;';
        gameModeBtn.onmouseover = () => gameModeBtn.style.background = 'rgba(0,0,0,0.8)';
        gameModeBtn.onmouseout = () => gameModeBtn.style.background = 'rgba(0,0,0,0.6)';
        arenaSection.appendChild(gameModeBtn);
    }

    const updateGameModeUI = () => {
        if (gameModeBtn && gameState.gameModes) {
            const mode = gameState.gameModes[gameState.gameMode || 'classic'];
            gameModeBtn.innerHTML = `<i class="fas ${mode.icon}"></i> <span>${mode.name}</span> <i class="fas fa-chevron-down" style="font-size: 0.8em; margin-left: 5px; opacity: 0.7;"></i>`;
        }
    };
    updateGameModeUI();

    // Listener para mudança de modo de jogo
    if (!window._gameModeChangedListener) {
        window._gameModeChangedListener = (e) => {
            updateGameModeUI();
        };
        document.addEventListener('gamemode-changed', window._gameModeChangedListener);
    }

    updateDynamicUI();
}

/**
 * Função principal que trata os cliques na tela de menu.
 * @param {Event} e - O objeto do evento de clique.
 * @param {object} gameState - O estado atual do jogo.
 * @param {function} updateDynamicUI - Função para atualizar a UI.
 * @param {object} toast - O objeto para mostrar notificações.
 */
export function handlePlayScreenClick(e, gameState, updateDynamicUI, toast) {
    const t = e.target;

    // --- LÓGICA DO BOTÃO DE BATALHA ---

    if (t.matches('.battle-button')) {
        // Desabilita o botão para evitar cliques múltiplos
        t.disabled = true;
        t.textContent = 'Carregando Batalha...';

        // Redireciona diretamente para a página do jogo para um carregamento limpo
        window.location.href = './views/game.html';
        return; // Encerra a função aqui
    }

    // --- FIM DA LÓGICA DO BOTÃO DE BATALHA ---

    // O restante do seu código para outros cliques permanece o mesmo.
    if (t.closest('.player-profile')) {
        popupManager.open('profile:full');
        return;
    }
    if (t.closest('.settings')) {
        popupManager.open('shared:settings');
        return;
    }
    if (t.closest('.game-mode-btn')) {
        popupManager.open('shared:game-mode-selection');
        return;
    }
    if (t.closest('.arena-section') && !t.matches('.battle-button')) {
        popupManager.open('arena:timeline');
        return;
    }
    if (t.closest('#free-chest')) {
        popupManager.open('arena:timed-chest-info', { type: 'free' });
        return;
    }
    if (t.closest('#crown-chest')) {
        popupManager.open('arena:timed-chest-info', { type: 'crown' });
        return;
    }
    const cs = t.closest('.chest-slot');
    if (cs) {
        const i = cs.dataset.index;
        const c = gameState.chestSlots[i];
        if (!c) return;

        if (c.status === 'ready') {
            const chest = gameState.chestSlots[i];
            const rewards = { scrolls: 50, books: 1 };
            gameState.scrolls += rewards.scrolls;
            gameState.books += rewards.books;
            popupManager.open('arena:chest-rewards', { chestType: chest.type, rewards: rewards });
            gameState.chestSlots[i] = null;
            // É importante chamar updateDynamicUI após modificar o estado
            updateDynamicUI();
            return;
        }
        if (c.status === 'locked' || c.status === 'unlocking') {
            popupManager.open('arena:chest-info', { chest: c });
            return;
        }
    }
}