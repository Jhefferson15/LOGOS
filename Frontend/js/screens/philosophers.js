import { PHILOSOPHERS_DATA } from '../data/philosophers.js';
import { CONCEPTS_DATA } from '../data/concepts.js';
import { popupManager } from '../ui/PopupManager.js';

/**
 * Initializes the Philosophers Collection Screen.
 * Renders the grid of collected and undiscovered philosopher cards.
 * @module Screens/Philosophers
 * @param {object} gameState - The global game state.
 * @param {function} updateDynamicUI - Function to refresh the UI.
 * @param {object} toast - Toast notification utility.
 */
export function initPhilosophersScreen(gameState, updateDynamicUI, toast) {
    const cardGrid = document.querySelector('.card-grid');
    if (!cardGrid) return;

    cardGrid.innerHTML = ''; // Limpa o grid para renderizar novamente

    const sortedPhilosophers = Object.entries(PHILOSOPHERS_DATA)
        .map(([id, philosopher]) => ({ ...philosopher, id: parseInt(id) }))
        .sort((a, b) => a.name.localeCompare(b.name));

    sortedPhilosophers.forEach(philosopher => {
        const philosopherState = gameState.collection.philosophers[philosopher.id];
        const isDiscovered = !!philosopherState;

        const cardElement = document.createElement('div');
        cardElement.className = `card-item ${isDiscovered ? 'unlocked' : 'locked'}`;
        cardElement.dataset.philosopherId = philosopher.id;

        if (isDiscovered) {
            cardElement.innerHTML = `
                <img src="${philosopher.image}" alt="${philosopher.name}" class="card-image">
                <span class="card-name">${philosopher.name}</span>
                <span class="card-level">Nível ${philosopherState.level}</span>
            `;
        } else {
            cardElement.innerHTML = `
                <i class="fas fa-question-circle card-icon-locked"></i>
                <span class="card-name">???</span>
                <span class="card-level">Não Descoberto</span>
            `;
        }

        cardGrid.appendChild(cardElement);
    });

    updateDynamicUI();
}

/**
 * Handles click events on the Philosophers Screen.
 * Opens detailed views for discovered philosophers.
 * @param {Event} e - The click event object.
 * @param {object} gameState - The global game state.
 * @param {function} updateDynamicUI - Function to refresh the UI.
 * @param {object} toast - Toast notification utility.
 */
export function handlePhilosophersScreenClick(e, gameState, updateDynamicUI, toast) {
    const cardItem = e.target.closest('.card-item');

    if (cardItem && cardItem.dataset.philosopherId) {
        const philosopherId = cardItem.dataset.philosopherId;
        const philosopherState = gameState.collection.philosophers[philosopherId];
        const isDiscovered = !!philosopherState;

        if (!isDiscovered) {
            toast.show('Este filósofo ainda não foi descoberto!', 'info');
            return;
        }

        popupManager.open('philosophers:details', {
            philosopherId: philosopherId,
            philosopherState: philosopherState
        });
    }
}