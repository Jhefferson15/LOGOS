import { gameState } from '../../../data/gameState.js';

/**
 * Módulo para o popup de progresso de nível e XP.
 */
export const LevelXpPopup = {
    /**
     * Gera o título dinâmico do popup.
     * @returns {string} O título do popup.
     */
    get title() {
        return `Nível ${gameState.level} - Progresso`;
    },

    /**
     * Gera o HTML do conteúdo do popup.
     * @param {object} data - Dados para renderização (não utilizado neste popup).
     * @returns {string} HTML do conteúdo do popup.
     */
    getHTML: (data) => {
        const winRate = gameState.totalDebates > 0 ? ((gameState.wins / gameState.totalDebates) * 100).toFixed(1) : 0;
        return `<div class="level-xp-popup"><div class="popup-card"><h4>Progresso Atual</h4><div class="xp-bar-popup"><div class="xp-fill-popup" style="width: ${(gameState.xp / gameState.xpMax) * 100}%"></div><span class="xp-text">${gameState.xp} / ${gameState.xpMax} XP</span></div><p class="xp-remaining">Faltam ${gameState.xpMax - gameState.xp} XP para o próximo nível.</p></div><div class="popup-card"><h4>Recompensas do Nível ${gameState.level + 1}</h4><ul class="rewards-list"><li><i class="fas fa-coins"></i> +500 Ouro</li><li><i class="fas fa-scroll"></i> +100 Pergaminhos</li><li><i class="fas fa-unlock-alt"></i> Nova Arena Desbloqueada</li></ul></div><div class="popup-card"><h4>Estatísticas de Batalha</h4><div class="stats-grid"><div class="stat-item"><span>Vitórias</span><strong>${gameState.wins}</strong></div><div class="stat-item"><span>Derrotas</span><strong>${gameState.totalDebates - gameState.wins}</strong></div><div class="stat-item"><span>Coroas</span><strong>${gameState.crowns}</strong></div><div class="stat-item"><span>Taxa de Vit.</span><strong>${winRate}%</strong></div><div class="stat-item"><span>Filósofo Fav.</span><strong>Platão</strong></div><div class="stat-item"><span>Escola Fav.</span><strong>Grega</strong></div></div></div></div>`;
    },

    /**
     * Configura os event listeners para o popup.
     * @param {HTMLElement} element - O elemento do corpo do modal onde o HTML foi injetado.
     * @param {object} data - Dados para configuração (não utilizado neste popup).
     */
    setupListeners: (element, data) => {
        // Nenhuma lógica de listener específica para este popup.
    }
};
