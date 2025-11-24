import { PHILOSOPHERS_DATA } from '../../../data/philosophers.js';
import { CONCEPTS_DATA_1 } from '../../../data/concepts.js';
import { toast } from '../../Toast.js';

/**
 * Módulo para o popup de detalhes do filósofo.
 */
export const PhilosopherDetailsPopup = {
    /**
     * Gera o título dinâmico do popup.
     * @param {object} data - Dados para renderização, esperando data.philosopherId.
     * @returns {string} O título do popup.
     */
    title: (data) => {
        const philosopher = PHILOSOPHERS_DATA[data.philosopherId];
        return philosopher ? philosopher.name : 'Detalhes';
    },

    /**
     * Gera o HTML do conteúdo do popup.
     * @param {object} data - Dados para renderização, esperando data.philosopherId e data.philosopherState.
     * @returns {string} HTML do conteúdo do popup.
     */
    getHTML: (data) => {
        const philosopher = PHILOSOPHERS_DATA[data.philosopherId];
        if (!philosopher) return '<p>Erro: Filósofo não encontrado.</p>';
        
        const state = data.philosopherState;
        const keyConceptsHTML = philosopher.keyConcepts.map(conceptId => {
            const concept = CONCEPTS_DATA_1[conceptId];
            return concept ? `<div class="concept-chip"><strong>${concept.name}</strong> (${concept.points} pts)<p>${concept.description}</p></div>` : '';
        }).join('');

        const predecessorsLinks = philosopher.predecessors.map(id => {
            const pred = PHILOSOPHERS_DATA[id];
            return pred ? `<span class="philosopher-link" data-philosopher-id="${id}">${pred.name}</span>` : null;
        }).filter(Boolean);
        const predecessorsHTML = predecessorsLinks.length > 0 ? predecessorsLinks.join(', ') : '<span>Nenhum direto (pensador original)</span>';

        const nextLevelPergaminhos = state.level * 10;

        return `
            <div class="philosopher-popup">
                <div class="popup-header"><img src="${philosopher.image}" alt="${philosopher.name}" class="philosopher-image-large"><div class="header-info"><span class="philosopher-era">${philosopher.era}</span><h2 class="philosopher-school">${philosopher.school}</h2><p class="philosopher-description">${philosopher.description}</p></div></div>
                <div class="popup-stats"><div class="stat-item"><span>Nível</span><strong>${state.level}</strong></div><div class="stat-item"><span>Poder de Argumento</span><strong>${state.level * 15}</strong></div><div class="stat-item"><span>Custo de Aprimoramento</span><strong><i class="fas fa-coins"></i> ${state.level * 100}</strong></div></div>
                <div class="popup-upgrade-section"><div class="upgrade-bar"><div class="upgrade-fill" style="width: ${(state.count / nextLevelPergaminhos) * 100}%"></div><span class="upgrade-text">${state.count} / ${nextLevelPergaminhos} Pergaminhos</span></div><button class="action-button ${state.count >= nextLevelPergaminhos ? '' : 'disabled'}" id="upgrade-philosopher-btn">Aprimorar</button></div>
                <div class="popup-section"><h3>Conceitos-Chave</h3><div class="concepts-container">${keyConceptsHTML}</div></div>
                <div class="popup-section"><h3>Influenciado Por</h3><p class="predecessors-list">${predecessorsHTML}</p></div>
            </div>`;
    },

    /**
     * Configura os event listeners para o popup.
     * @param {HTMLElement} element - O elemento do corpo do modal onde o HTML foi injetado.
     * @param {object} data - Dados para configuração, esperando data.philosopherId.
     */
    setupListeners: (element, data, popupManager) => {
        const upgradeBtn = element.querySelector('#upgrade-philosopher-btn');
        if (upgradeBtn && !upgradeBtn.classList.contains('disabled')) {
            upgradeBtn.addEventListener('click', () => {
                toast.show(`Aprimorando ${PHILOSOPHERS_DATA[data.philosopherId].name}...`, 'success');
                popupManager.close();
            });
        }
    }
};
