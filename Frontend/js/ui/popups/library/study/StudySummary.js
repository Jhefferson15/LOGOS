/**
 * StudySummary.js
 * Módulo responsável pela aba de Sumário.
 */
import { StudyState } from './StudyState.js';

export const StudySummary = {
    /**
     * Renderiza o sumário.
     * @param {HTMLElement} container - Onde renderizar (viewport)
     * @param {Object} data - Dados do filósofo
     * @param {string} philosopherId
     */
    render: (container, data, philosopherId) => {
        const summaryItems = Object.entries(data.tableOfContents || {}).map(([pageNum, title]) => `
            <li class="summary-item ${StudyState.isPageViewed(philosopherId, parseInt(pageNum)) ? 'viewed' : ''}" data-page="${pageNum}">
                <span class="summary-item-title">${title}</span>
                <span class="summary-item-page">Página ${pageNum}</span>
            </li>
        `).join('');

        container.innerHTML = `
            <div class="summary-container">
                <div class="summary-content animate__animated animate__fadeIn">
                    <h2><i class="fas fa-list"></i> Sumário do Estudo</h2>
                    <ul class="summary-list">${summaryItems}</ul>
                </div>
            </div>`;
    },

    /**
     * Configura eventos do sumário.
     * @param {HTMLElement} container 
     * @param {Function} onNavigate - Callback (pageNum) => void
     */
    setup: (container, onNavigate) => {
        container.querySelectorAll('.summary-item').forEach(item => {
            item.addEventListener('click', () => {
                onNavigate(parseInt(item.dataset.page));
            });
        });
    }
};
