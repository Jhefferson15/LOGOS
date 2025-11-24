import { gameState } from '../../../data/gameState.js';
import { arenas } from '../../../data/arenas.js';
import { toast } from '../../Toast.js';

/**
 * Módulo para o popup da timeline de arenas.
 */
export const ArenaTimelinePopup = {
    title: 'Jornada Filosófica',

    /**
     * Gera o HTML do conteúdo do popup.
     * @param {object} data - Dados para renderização (não utilizado neste popup).
     * @returns {string} HTML do conteúdo do popup.
     */
    getHTML: (data) => {
        const playerTrophies = gameState.trophies;
        const currentArenaId = gameState.currentArena || 1;

        const arenasHTML = arenas.map(arena => {
            const isUnlocked = playerTrophies >= arena.trophyReq;
            const isCurrent = arena.id === currentArenaId;

            let stateClass = 'locked';
            if (isUnlocked) stateClass = 'unlocked';
            if (isCurrent) stateClass = 'current';

            const schoolsText = arena.schools.join(', ').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

            let actionButton = '';
            if (isUnlocked && !isCurrent) {
                actionButton = `<button class="action-button-secondary select-arena-btn" data-arena-id="${arena.id}" style="margin-top: 10px; padding: 5px 15px; font-size: 0.8rem;">Selecionar</button>`;
            } else if (isCurrent) {
                actionButton = `<span class="current-marker" style="margin-top: 10px; display: inline-block; font-weight:bold; color:var(--color-accent);">SELECIONADA</span>`;
            }

            return `
                <div class="arena-card ${stateClass}" data-trophies="${arena.trophyReq}">
                    <div class="path-connector">
                        <div class="trophy-marker">
                            <i class="fa-solid fa-trophy icon"></i>
                            <span class="trophy-count">${arena.trophyReq}</span>
                        </div>
                    </div>
                    <div class="arena-content">
                        <div class="arena-image-wrapper">
                            <img src="${arena.image}" alt="${arena.name}" class="arena-image">
                            ${!isUnlocked ? '<i class="fa-solid fa-lock lock-icon"></i>' : ''}
                        </div>
                        <div class="arena-info">
                            <h2>${arena.id}: ${arena.name}</h2>
                            <div class="unlocks-section">
                                <h3>Escolas de Pensamento</h3>
                                <p class="schools-list">${schoolsText}</p>
                            </div>
                            ${actionButton}
                        </div>
                    </div>
                </div>`;
        }).join('');

        const css = `<style>
            .arena-timeline-popup .arenas-container { display: flex; flex-direction: column-reverse; gap: 20px; padding: 10px; }
            .arena-timeline-popup .arena-card { display: flex; align-items: flex-start; gap: 15px; padding: 15px; background-color: #fff; border: 1px solid var(--color-border); border-radius: 12px; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            .arena-timeline-popup .path-connector { flex: 0 0 60px; display: flex; flex-direction: column; align-items: center; position: relative; align-self: stretch; }
            .arena-timeline-popup .path-connector::before { content: ''; position: absolute; top: 0; bottom: 0; left: 50%; transform: translateX(-50%); width: 3px; background-image: linear-gradient(to bottom, #ccc 50%, transparent 50%); background-size: 1px 10px; }
            .arena-timeline-popup .arenas-container .arena-card:last-child .path-connector::before { height: 40px; top: auto; bottom: 0; }
            .arena-timeline-popup .arenas-container .arena-card:first-child .path-connector::before { height: calc(100% - 40px); top: 40px; }
            .arena-timeline-popup .trophy-marker { display: flex; flex-direction: column; align-items: center; background-color: var(--color-background); padding: 5px 0; z-index: 1; }
            .arena-timeline-popup .trophy-marker .icon { font-size: 24px; color: #aaa; }
            .arena-timeline-popup .trophy-marker .trophy-count { font-weight: bold; font-size: 14px; color: #777; }
            .arena-timeline-popup .arena-content { flex: 1; }
            .arena-timeline-popup .arena-image-wrapper { position: relative; margin-bottom: 10px; }
            .arena-timeline-popup .arena-image { width: 100%; border-radius: 8px; display: block; }
            .arena-timeline-popup .arena-info h2 { font-family: var(--font-title); font-size: 1.5em; margin-bottom: 8px; }
            .arena-timeline-popup .unlocks-section h3 { font-size: 0.8em; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 5px; }
            .arena-timeline-popup .schools-list { font-size: 0.9em; color: #555; }
            .arena-timeline-popup .arena-card.locked { opacity: 0.7; }
            .arena-timeline-popup .arena-card.locked .arena-image { filter: grayscale(100%) brightness(0.6); }
            .arena-timeline-popup .arena-card.locked .arena-info h2 { color: #999; }
            .arena-timeline-popup .lock-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 48px; color: rgba(255, 255, 255, 0.8); }
            .arena-timeline-popup .arena-card.current { border-color: var(--color-accent); box-shadow: 0 0 15px rgba(212, 160, 23, 0.5); }
            .arena-timeline-popup .arena-card.current .trophy-marker .icon, .arena-timeline-popup .arena-card.current .trophy-marker .trophy-count { color: var(--color-accent); font-weight: bold; }
            .arena-timeline-popup .arena-card.unlocked .trophy-marker .icon { color: var(--color-primary); }
        </style>`;
        return `${css}<div class="arena-timeline-popup"><div class="arenas-container">${arenasHTML}</div></div>`;
    },

    /**
     * Configura os event listeners para o popup.
     * @param {HTMLElement} element - O elemento do corpo do modal onde o HTML foi injetado.
     * @param {object} data - Dados para configuração. Pode incluir `onArenaSelected` (callback).
     */
    setupListeners: (element, data, popupManager) => {
        // Listener para selecionar arena
        const selectButtons = element.querySelectorAll('.select-arena-btn');
        selectButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const arenaId = parseInt(btn.dataset.arenaId);
                gameState.currentArena = arenaId;

                // Dispara evento para atualizar UI principal se necessário
                const event = new CustomEvent('arena-changed', { detail: { arenaId } });
                document.dispatchEvent(event);

                toast.show(`Arena ${arenaId} selecionada!`, 'success');
                
                // Fecha o popup, passando o callback de sucesso para o popupManager
                popupManager.close(() => {
                    if (data.onArenaSelected) {
                        data.onArenaSelected();
                    }
                });
            });
        });

        // Scroll especial para timeline
        setTimeout(() => { element.scrollTop = element.scrollHeight; }, 100);
    }
};
