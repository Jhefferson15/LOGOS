import { gameState } from '../../../data/gameState.js';
import { toast } from '../../Toast.js';

/**
 * Módulo para o popup de seleção de modo de jogo.
 */
export const GameModeSelectionPopup = {
    title: 'Modo de Jogo',

    /**
     * Gera o HTML do conteúdo do popup.
     * @param {object} data - Dados para renderização (não utilizado neste popup).
     * @returns {string} HTML do conteúdo do popup.
     */
    getHTML: (data) => {
        const modes = gameState.gameModes || {
            classic: { name: 'Debate Clássico', desc: 'Duelo padrão 1v1', icon: 'fa-book' },
            ranked: { name: 'Ranqueado', desc: 'Valendo troféus', icon: 'fa-trophy', req: 0 },
            event: { name: 'Evento Filosófico', desc: 'Regras especiais', icon: 'fa-star', req: 500 }
        };
        const currentMode = gameState.gameMode || 'classic';
        const playerTrophies = gameState.trophies;

        const modesHTML = Object.entries(modes).map(([key, mode]) => {
            const isLocked = mode.req && playerTrophies < mode.req;
            const isSelected = key === currentMode;
            const activeClass = isSelected ? 'active' : '';
            const lockedClass = isLocked ? 'locked' : '';

            return `
                <div class="game-mode-card ${activeClass} ${lockedClass}" data-mode="${key}">
                    <div class="mode-icon"><i class="fas ${mode.icon}"></i></div>
                    <div class="mode-info">
                        <h3>${mode.name}</h3>
                        <p>${mode.desc}</p>
                    </div>
                    ${isSelected ? '<div class="selected-badge"><i class="fas fa-check"></i></div>' : ''}
                    ${isLocked ? '<div class="lock-overlay"><i class="fas fa-lock"></i></div>' : ''}
                </div>
            `;
        }).join('');

        const css = `
            <style>
                .game-mode-selection { display: flex; flex-direction: column; gap: 15px; padding: 10px; }
                .game-mode-card { display: flex; align-items: center; gap: 15px; padding: 15px; background: #fff; border: 2px solid #eee; border-radius: 12px; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
                .game-mode-card:hover:not(.locked) { border-color: var(--color-primary); transform: translateY(-2px); }
                .game-mode-card.active { border-color: var(--color-accent); background: #fff8e1; }
                .game-mode-card.locked { opacity: 0.6; cursor: not-allowed; filter: grayscale(1); }
                .mode-icon { width: 50px; height: 50px; background: #f5f5f5; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #555; }
                .game-mode-card.active .mode-icon { background: var(--color-accent); color: #fff; }
                .mode-info h3 { margin: 0 0 5px 0; color: #333; }
                .mode-info p { margin: 0; font-size: 0.9rem; color: #666; }
                .selected-badge { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: var(--color-accent); font-size: 20px; }
                .lock-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; font-size: 24px; color: #333; }
            </style>
        `;

        return `${css}<div class="game-mode-selection">${modesHTML}</div>`;
    },

    /**
     * Configura os event listeners para o popup.
     * @param {HTMLElement} element - O elemento do corpo do modal onde o HTML foi injetado.
     * @param {object} data - Dados para configuração (não utilizado neste popup).
     */
    setupListeners: (element, data, popupManager) => {
        const cards = element.querySelectorAll('.game-mode-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                if (card.classList.contains('locked')) {
                    toast.show('Modo bloqueado! Consiga mais troféus.', 'error');
                    return;
                }
                const modeKey = card.dataset.mode;
                gameState.gameMode = modeKey;

                const event = new CustomEvent('gamemode-changed', { detail: { mode: modeKey } });
                document.dispatchEvent(event);

                const modeName = card.querySelector('h3').innerText;
                toast.show(`Modo ${modeName} selecionado!`, 'success');
                popupManager.close();
            });
        });
    }
};
