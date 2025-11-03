import { arenas } from '../../js/data/arenas.js';
import { popupManager } from '../../js/ui/PopupManager.js';


export function initPlayScreen(gameState, updateDynamicUI, toast) {
    // Código de inicialização da tela, permanece o mesmo.
    const arena = arenas[1];
    const arenaSection = document.querySelector('.arena-section');
    if (arenaSection) {
        arenaSection.style.backgroundImage = `url('${arena.image}')`;
        const arenaName = arenaSection.querySelector('.arena-name');
        if (arenaName) {
            arenaName.innerText = arena.name;
        }
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
        popupManager.open('full-profile');
        return;
    }
    if (t.closest('.settings')) {
        popupManager.open('settings');
        return;
    }
    if (t.closest('.arena-section') && !t.matches('.battle-button')) {
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
        const i = cs.dataset.index;
        const c = gameState.chestSlots[i];
        if (!c) return;

        if (t.classList.contains('open-btn')) {
            const chest = gameState.chestSlots[i];
            const rewards = { scrolls: 50, books: 1 };
            gameState.scrolls += rewards.scrolls;
            gameState.books += rewards.books;
            popupManager.open('chest-rewards', { chestType: chest.type, rewards: rewards });
            gameState.chestSlots[i] = null;
            // É importante chamar updateDynamicUI após modificar o estado
            updateDynamicUI(); 
            return;
        }
        if (c.status === 'locked' || c.status === 'unlocking') {
            popupManager.open('chest-info', { chest: c });
            return;
        }
    }
}