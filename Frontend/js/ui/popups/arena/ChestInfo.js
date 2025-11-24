
/**
 * Módulo para o popup de informações do baú.
 */
export const ChestInfoPopup = {
    /**
     * Gera o título dinâmico do popup.
     * @param {object} data - Dados para renderização, esperando data.chest.type.
     * @returns {string} O título do popup.
     */
    title: (data) => `Obra: ${data.chest.type}`,

    /**
     * Gera o HTML do conteúdo do popup.
     * @param {object} data - Dados para renderização, esperando data.chest.
     * @returns {string} HTML do conteúdo do popup.
     */
    getHTML: (data) => {
        const chest = data.chest;
        if (!chest) return '<p>Erro: Informações do baú não fornecidas.</p>';

        const formatTime = (s) => { 
            const h = Math.floor(s / 3600);
            const m = Math.floor((s % 3600) / 60); 
            return `${h}h ${m}m`; 
        };

        return `<div class="chest-info-popup">
                    <img src="assets/chests/${chest.type.toLowerCase().replace(' ', '-')}.png" alt="${chest.type}" class="chest-info-image">
                    <p class="chest-arena-text">Obtido na Arena ${chest.arena}</p>
                    <div class="chest-unlock-info">
                        <i class="fas fa-clock"></i>
                        <span>Tempo para estudar: <strong>${formatTime(chest.totalTime)}</strong></span>
                    </div>
                    <h4>Recompensas Possíveis</h4>
                    <div class="possible-rewards">
                        <span><i class="fas fa-scroll"></i> Pergaminhos</span>
                        <span><i class="fas fa-book"></i> Livros</span>
                        <span><i class="fas fa-users"></i> Novos Filósofos</span>
                    </div>
                </div>`;
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
