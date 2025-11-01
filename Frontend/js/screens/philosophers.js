import { PHILOSOPHERS_DATA } from '../data/philosophers.js';
import { CONCEPTS_DATA } from '../data/concepts.js';
import { popupManager } from '../ui/PopupManager.js';

export function initPhilosophersScreen(gameState, updateDynamicUI, toast) {
    const cardGrid = document.querySelector('.card-grid');
    if (!cardGrid) return;

    cardGrid.innerHTML = ''; // Limpa o grid para renderizar novamente

    const sortedPhilosophers = Object.entries(PHILOSOPHERS_DATA)
        .map(([id, philosopher]) => ({ ...philosopher, id: parseInt(id) }))
        .sort((a, b) => a.name.localeCompare(b.name));

    sortedPhilosophers.forEach(philosopher => {
        const isDiscovered = gameState.discoveredPhilosophers.includes(philosopher.id);
        const philosopherState = gameState.collection.philosophers[philosopher.id] || { level: 0, count: 0 };

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

export function handlePhilosophersScreenClick(e, gameState, updateDynamicUI, toast) {
    const cardItem = e.target.closest('.card-item');
    
    if (cardItem && cardItem.dataset.philosopherId) {
        const philosopherId = cardItem.dataset.philosopherId;
        const isDiscovered = gameState.discoveredPhilosophers.includes(parseInt(philosopherId));

        if (!isDiscovered) {
            toast.show('Este filósofo ainda não foi descoberto!', 'info');
            return;
        }

        const philosopherState = gameState.collection.philosophers[philosopherId] || { level: 0, count: 0 };
        popupManager.open('philosopher-details', { 
            philosopherId: philosopherId,
            philosopherState: philosopherState
        });
    }
}