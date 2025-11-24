import { gameState } from '../../../data/gameState.js';

/**
 * Módulo para o popup de informações do baú cronometrado.
 */
export const TimedChestInfoPopup = {
    /**
     * Gera o título dinâmico do popup.
     * @param {object} data - Dados para renderização, esperando data.type.
     * @returns {string} O título do popup.
     */
    title: (data) => data.type === 'free' ? 'Conceito Grátis' : 'Coroa da Sabedoria',

    /**
     * Gera o HTML do conteúdo do popup.
     * @param {object} data - Dados para renderização, esperando data.type.
     * @returns {string} HTML do conteúdo do popup.
     */
    getHTML: (data) => {
        const type = data.type;
        if (!type) return '<p>Erro: Tipo de baú não fornecido.</p>';

        const chest = type === 'free' ? gameState.timers.freeChest : gameState.timers.crownChest;
        const isReady = chest <= 0;
        
        const formatTime = (s) => { 
            const h = Math.floor(s / 3600);
            const m = Math.floor((s % 3600) / 60);
            const sec = s % 60;
            return h > 0 
                ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}` 
                : `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`; 
        };

        const info = {
            free: { 
                icon: 'fa-box-open', 
                desc: 'Um baú com conceitos e recursos básicos, disponível a cada 4 horas.' 
            },
            crown: { 
                icon: 'fa-crown', 
                desc: 'Vença debates e colete 10 coroas para abrir este baú com recompensas superiores!' 
            }
        };

        return `<div class="timed-chest-popup">
                    <i class="fas ${info[type].icon} chest-icon"></i>
                    <p>${info[type].desc}</p>
                    ${isReady 
                        ? `<button class="action-button">Coletar Agora!</button>` 
                        : `<div class="timed-chest-timer">Próximo em: <strong>${formatTime(chest)}</strong></div>`
                    }
                </div>`;
    },

    /**
     * Configura os event listeners para o popup.
     * @param {HTMLElement} element - O elemento do corpo do modal onde o HTML foi injetado.
     * @param {object} data - Dados para configuração (não utilizado neste popup).
     */
    setupListeners: (element, data) => {
        // A lógica do botão "Coletar Agora!" pode ser adicionada aqui se necessário.
    }
};
