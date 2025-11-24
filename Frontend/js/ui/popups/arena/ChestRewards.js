
/**
 * Módulo para o popup de recompensas do baú.
 */
export const ChestRewardsPopup = {
    /**
     * Gera o título dinâmico do popup.
     * @param {object} data - Dados para renderização, esperando data.chestType.
     * @returns {string} O título do popup.
     */
    title: (data) => `Recompensas da Obra "${data.chestType}"`,

    /**
     * Gera o HTML do conteúdo do popup.
     * @param {object} data - Dados para renderização, esperando data.rewards.
     * @returns {string} HTML do conteúdo do popup.
     */
    getHTML: (data) => {
        const rewards = data.rewards;
        if (!rewards) return '<p>Erro: Recompensas não fornecidas.</p>';

        return `<div>Recompensas: ${JSON.stringify(rewards)}</div>`;
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
