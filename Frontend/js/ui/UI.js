import { Card } from './components/Card.js';
import { Player } from './components/Player.js';
import { Modal } from './components/Modal.js';

export class UI {
    constructor() {
        this.playerHandElement = document.getElementById('player-hand');
        this.discardPileElement = document.getElementById('discard-pile');
        this.conceptPanelElement = document.getElementById('concept-panel');

        this.timelineModal = new Modal('timeline-modal');
        this.infoModal = new Modal('info-modal');
    }

    renderPlayerHand(player, cardPlayHandler) {
        this.playerHandElement.innerHTML = '';
        player.hand.forEach(card => {
            const cardEl = Card.create(card);
            cardEl.addEventListener('click', (e) => {
                e.stopPropagation();
                cardPlayHandler(player, card);
            });
            this.playerHandElement.appendChild(cardEl);
        });
    }

    renderOpponentHand(player) {
        const handEl = document.getElementById(`opponent-hand-${player.id}`);
        handEl.innerHTML = '';
        for (let i = 0; i < player.hand.length; i++) {
            handEl.appendChild(Card.create(null, true));
        }
    }

    renderPlayerInfo(player, currentPlayer) {
        Player.create(player, currentPlayer);
    }
    
    renderDiscardPile(topCard, showInfoHandler) {
        this.discardPileElement.innerHTML = '';
        if (topCard) {
            const cardEl = Card.create(topCard);
            cardEl.style.cursor = 'help'; // Indicate different function
            cardEl.onclick = () => showInfoHandler(topCard); // Override play function
            this.discardPileElement.appendChild(cardEl);
        }
    }

    renderConceptPanel(player) {
        this.conceptPanelElement.innerHTML = '';
        player.concepts.forEach(concept => {
            const cardEl = Card.createConcept(concept);
            this.conceptPanelElement.appendChild(cardEl);
        });
    }

    renderAll(players, currentPlayer, topCard, cardPlayHandler, showInfoHandler) {
        players.forEach(p => {
            this.renderPlayerInfo(p, currentPlayer);
            if (p.isAI) {
                this.renderOpponentHand(p);
            } else {
                this.renderPlayerHand(p, cardPlayHandler);
                this.renderConceptPanel(p);
            }
        });
        this.renderDiscardPile(topCard, showInfoHandler);
    }

    showTimeline(discardPile) {
        const timelineList = document.getElementById('timeline-list');
        timelineList.innerHTML = '';
        discardPile.forEach(card => {
            const li = document.createElement('li');
            li.textContent = `${card.name} (${card.school})`;
            timelineList.appendChild(li);
        });
        this.timelineModal.show();
    }

    showInfo(card) {
        this.infoModal.setContent(`
            <h2>${card.name}</h2>
            <p><strong>Escola:</strong> ${card.school}</p>
            <p>${card.description}</p>
            <button>Fechar</button>
        `);
        this.infoModal.show();
    }

    hideModals() {
        this.timelineModal.hide();
        this.infoModal.hide();
    }
}