import { gameState } from '../../../data/gameState.js';
import { toast } from '../../Toast.js';
import { MechanicManager } from '../../../game/mechanics/MechanicManager.js';

/**
 * Módulo para o popup de seleção de modo de jogo.
 * @memberof Popups
 */
export const GameModeSelectionPopup = {
    title: 'Modo de Jogo',

    /**
     * Gera o HTML do conteúdo do popup.
     * @param {object} data - Dados para renderização (não utilizado neste popup).
     * @returns {string} HTML do conteúdo do popup.
     */
    getHTML: (data) => {
        const mechanics = MechanicManager.getAvailableMechanics();
        const activeMechanic = MechanicManager.getActiveMechanic();
        const currentModeId = activeMechanic ? activeMechanic.id : 'temporal';

        // Map mechanics to UI structure
        // We can add icons or specific requirements here if needed, or extend GameMechanic to include them.
        // For now, we'll use a default icon map or random.
        const iconMap = {
            'temporal': 'fa-hourglass-half',
            'uno': 'fa-layer-group',
            'conceptual': 'fa-brain',
            'combat': 'fa-fist-raised',
            'truco': 'fa-hand-paper',
            'pifpaf': 'fa-clone'
        };

        const modesHTML = mechanics.map(mechanic => {
            const isSelected = mechanic.id === currentModeId;
            const activeClass = isSelected ? 'active' : '';
            const icon = iconMap[mechanic.id] || 'fa-gamepad';
            // Future: Add locking logic based on player level/trophies if desired
            const isLocked = false;
            const lockedClass = isLocked ? 'locked' : '';

            return `
                <div class="game-mode-card ${activeClass} ${lockedClass}" data-mode="${mechanic.id}">
                    <div class="mode-icon"><i class="fas ${icon}"></i></div>
                    <div class="mode-info">
                        <h3>${mechanic.name}</h3>
                        <p>${mechanic.description}</p>
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

                // Set active mechanic
                MechanicManager.setActiveMechanic(modeKey);

                // Update gameState for persistence if needed
                gameState.gameMode = modeKey;
                localStorage.setItem('selectedGameMode', modeKey);

                const event = new CustomEvent('gamemode-changed', { detail: { mode: modeKey } });
                document.dispatchEvent(event);

                const modeName = card.querySelector('h3').innerText;
                toast.show(`Modo ${modeName} selecionado!`, 'success');

                // Restart game to apply new mechanic
                if (window.GameUI && typeof window.GameUI.restartGame === 'function') {
                    window.GameUI.restartGame();
                }

                popupManager.close(() => {
                    if (data && data.onGameModeSelected) {
                        data.onGameModeSelected();
                    }
                });
            });
        });
    }
};
