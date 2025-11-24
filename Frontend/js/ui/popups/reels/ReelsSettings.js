import { gameState } from '../../../data/gameState.js';
import { toast } from '../../Toast.js';

/**
 * Módulo para o popup de configurações dos Reels.
 */
export const ReelsSettingsPopup = {
    title: 'Configurações do Reels',

    /**
     * Gera o HTML do conteúdo do popup.
     * @param {object} data - Dados para renderização (não utilizado neste popup).
     * @returns {string} HTML do conteúdo do popup.
     */
    getHTML: (data) => {
        return `
            <div class="reels-settings-popup">
                <div class="settings-section">
                    <h4><i class="fas fa-history"></i> Histórico de Reels</h4>
                    <p>Limpe seu histórico de reels para vê-los novamente.</p>
                    <button id="clear-reels-history-btn" class="action-button red">Limpar Histórico</button>
                </div>
            </div>
        `;
    },

    /**
     * Configura os event listeners para o popup.
     * @param {HTMLElement} element - O elemento do corpo do modal onde o HTML foi injetado.
     * @param {object} data - Dados para configuração (não utilizado neste popup).
     */
    setupListeners: (element, data) => {
        const clearBtn = element.querySelector('#clear-reels-history-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (gameState.reelsHistory) {
                    gameState.reelsHistory = [];
                    toast.show('Histórico de Reels limpo!', 'success');
                } else {
                    toast.show('Histórico já está vazio.', 'info');
                }
                window.popupManager.close();
            });
        }
    }
};
