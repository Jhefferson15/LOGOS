import { PHILOSOPHERS_DATA } from '../data/philosophers.js';
import { CONCEPTS_DATA } from '../data/concepts.js';
import { UI } from '../ui/UI.js';

export class LogosGame {
    constructor(gameMode = 'offline', cardConnectionMode = 'school') {
        this.gameMode = gameMode;
        this.cardConnectionMode = cardConnectionMode;

        this.players = [
            { id: 1, name: 'Você', hand: [], concepts: [], score: 0, isAI: false },
            { id: 2, name: 'Reuthe', hand: [], concepts: [], score: 0, isAI: true },
            { id: 3, name: 'Tomb', hand: [], concepts: [], score: 0, isAI: true },
            { id: 4, name: 'Lesmoo', hand: [], concepts: [], score: 0, isAI: true },
        ];
        this.philosopherDeck = [];
        this.conceptDeck = [];
        this.discardPile = [];
        this.currentPlayerIndex = 0;
        this.topCard = null;
        this.ui = new UI();

        this.init();
    }

    init() {
        this.createDecks();
        this.shuffle(this.philosopherDeck);
        this.dealCards();
        this.startDiscardPile();
        this.addEventListeners();
        this.renderAll();
        this.startTurn();
    }
    
    createDecks() {
        for (let i = 0; i < 5; i++) {
            for (const id in PHILOSOPHERS_DATA) {
                this.philosopherDeck.push({ id: parseInt(id), ...PHILOSOPHERS_DATA[id] });
            }
        }

        for (const id in CONCEPTS_DATA) {
            this.conceptDeck.push({ id: parseInt(id), ...CONCEPTS_DATA[id] });
        }
    }

    shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    dealCards() {
        this.players.forEach(p => {
            for (let i = 0; i < 7; i++) p.hand.push(this.philosopherDeck.pop());
        });

        this.shuffle(this.conceptDeck);
        this.players.forEach(p => {
            if (!p.isAI) {
                for (let i = 0; i < 10; i++) p.concepts.push(this.conceptDeck.pop());
            }
        });
    }

    startDiscardPile() {
        this.topCard = this.philosopherDeck.pop();
        this.discardPile.push(this.topCard);
    }

    addEventListeners() {
        document.getElementById('discard-pile').addEventListener('click', () => this.ui.showTimeline(this.discardPile));
        document.getElementById('info-modal').addEventListener('click', (e) => {
            if (e.target.id === 'info-modal' || e.target.tagName === 'BUTTON') {
                this.ui.hideModals();
            }
        });
        document.getElementById('timeline-modal').addEventListener('click', (e) => {
            if (e.target.id === 'timeline-modal' || e.target.tagName === 'BUTTON') {
                this.ui.hideModals();
            }
        });
    }

    renderAll() {
        this.ui.renderAll(this.players, this.players[this.currentPlayerIndex], this.topCard, this.handleCardPlay.bind(this), this.ui.showInfo.bind(this.ui));
    }
    
    startTurn() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        this.renderAll();
        if (currentPlayer.isAI) {
            setTimeout(() => this.executeAITurn(currentPlayer), 1500);
        }
    }

    endTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.startTurn();
    }
    
    isValidPlay(card) {
        if (this.cardConnectionMode === 'school') {
            return card.school === this.topCard.school;
        } else if (this.cardConnectionMode === 'evolution') {
            return card.predecessors.includes(this.topCard.id);
        }
        return false;
    }
    
    handleCardPlay(player, card) {
        if (player.isAI || this.players[this.currentPlayerIndex].id !== player.id) return;
        
        if (this.isValidPlay(card)) {
            player.hand = player.hand.filter(c => c.id === card.id ? false : true);
            this.discardPile.push(card);
            this.topCard = card;
            
            if (player.hand.length === 0) {
                alert(`${player.name} venceu o jogo!`);
                location.reload();
            } else {
                this.endTurn();
            }
        } else {
            // Visual feedback for invalid move
            const playedCardEl = Array.from(document.querySelectorAll('#player-hand .philosopher-card')).find(el => el.querySelector('.name').textContent === card.name);
            if (playedCardEl) {
                playedCardEl.animate([
                    { transform: 'translateX(-10px)' },
                    { transform: 'translateX(10px)' },
                    { transform: 'translateX(-5px)' },
                    { transform: 'translateX(0)' }
                ], { duration: 300, easing: 'ease-in-out' });
            }
        }
    }
        
    executeAITurn(player) {
        const playableCard = player.hand.find(card => this.isValidPlay(card));
        if (playableCard) {
            player.hand = player.hand.filter(c => c !== playableCard);
            this.discardPile.push(playableCard);
            this.topCard = playableCard;
        } else {
            if (this.philosopherDeck.length > 0) {
                player.hand.push(this.philosopherDeck.pop());
            }
        }

        if (player.hand.length === 0) {
            alert(`${player.name} venceu o jogo!`);
            location.reload();
        } else {
            this.endTurn();
        }
    }
}