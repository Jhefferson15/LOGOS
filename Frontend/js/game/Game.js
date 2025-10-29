import { PHILOSOPHERS_DATA } from '../data/philosophers.js';
import { CONCEPTS_DATA } from '../data/concepts.js';

export class Game {
    constructor() {
        this.players = [];
        this.deck = [];
        this.discardPile = [];
        this.currentPlayerIndex = 0;
        this.topCard = null;
        this.isAwaitingConcept = false;

        // DOM Elements will be assigned in the start method
        this.drawPileEl = null;
        this.discardPileEl = null;
        this.conceptsListEl = null;
        this.conceptPromptModal = null;
        this.skipConceptBtn = null;
        this.notificationModal = null;
    }

    start(playerConfigs) {
        this.setupPlayers(playerConfigs);
        this.setupDeck();
        this.dealInitialCards();
        this.dealConceptsToPlayers();
        this.startDiscardPile();

        // Assign DOM elements now that the HTML is on the page
        this.drawPileEl = document.getElementById('draw-pile');
        this.discardPileEl = document.getElementById('discard-pile');
        this.conceptsListEl = document.getElementById('concepts-list');
        this.conceptPromptModal = document.getElementById('concept-prompt-modal');
        this.skipConceptBtn = document.getElementById('skip-concept-btn');
        this.notificationModal = document.getElementById('notification-modal');

        this.drawPileEl.addEventListener('click', () => this.handleDrawClick());

        this.beginTurn();
    }

    // --- 1. FASE DE SETUP ---

    setupPlayers(playerConfigs) {
        this.players = playerConfigs.map((config, index) => ({
            id: index,
            name: config.name,
            isAI: config.isAI,
            hand: [],
            concepts: [],
            score: 0,
        }));
    }

    setupDeck() {
        this.deck = Object.keys(PHILOSOPHERS_DATA).map(id => ({
            id: parseInt(id),
            ...PHILOSOPHERS_DATA[id]
        }));
        this.shuffleDeck();
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealInitialCards() {
        for (let i = 0; i < 7; i++) {
            this.players.forEach(player => this.drawCard(player));
        }
    }

    dealConceptsToPlayers() {
        const allConcepts = Object.keys(CONCEPTS_DATA).map(id => ({
            id: parseInt(id),
            ...CONCEPTS_DATA[id],
            used: false
        }));

        for (let i = allConcepts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allConcepts[i], allConcepts[j]] = [allConcepts[j], allConcepts[i]];
        }

        this.players.forEach(player => {
            if (!player.isAI) {
                player.concepts = allConcepts.splice(0, 10);
            }
        });
    }

    startDiscardPile() {
        if (this.deck.length === 0) this.reshuffleDiscardPile();
        const firstCard = this.deck.pop();
        this.discardPile.push(firstCard);
        this.topCard = firstCard;
    }

    // --- 2. LÓGICA DE TURNO ---

    beginTurn() {
        this.renderAll();
        const currentPlayer = this.players[this.currentPlayerIndex];

        if (currentPlayer.isAI) {
            this.executeAITurn(currentPlayer);
        }
    }

    endTurn() {
        const winner = this.players.find(p => p.hand.length === 0);
        if (winner) {
            this.endGame(winner);
            return;
        }

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.beginTurn();
    }

    // --- 3. AÇÕES DO JOGADOR ---

    handleCardPlay(cardId) {
        const player = this.players[this.currentPlayerIndex];
        if (player.isAI || this.isAwaitingConcept) return;

        const cardIndex = player.hand.findIndex(c => c.id === cardId);
        if (cardIndex === -1) return;

        const card = player.hand[cardIndex];

        if (this.isValidPlay(card)) {
            player.hand.splice(cardIndex, 1);
            this.discardPile.push(card);
            this.topCard = card;

            this.renderAll();

            if (player.hand.length === 0) {
                this.endGame(player);
                return;
            }
            
            this.promptForConcept(card);
        } else {
            this.showNotification('Jogada inválida!', 1500);
        }
    }

    handleDrawClick() {
        const player = this.players[this.currentPlayerIndex];
        if (player.isAI || this.isAwaitingConcept) return;

        this.drawCard(player);
        this.showNotification(`${player.name} comprou uma carta.`, 1500);
        
        setTimeout(() => this.endTurn(), 500);
    }

    handleConceptPlay(conceptId) {
        if (!this.isAwaitingConcept) return;

        const player = this.players[this.currentPlayerIndex];
        const concept = player.concepts.find(c => c.id === conceptId);
        if (!concept || concept.used) return;

        const playedCard = this.topCard;
        let points = 0;
        let message = '';

        if (playedCard.keyConcepts.includes(concept.id)) {
            points = concept.points;
            message = `<span class="correct">CORRETO! +${points} pontos!</span>`;
        } else {
            points = -Math.floor(concept.points / 2);
            message = `<span class="incorrect">INCORRETO! ${points} pontos!</span>`;
        }

        player.score += points;
        concept.used = true;
        
        this.showNotification(message, 2000);
        this.finishConceptPhase();
    }

    handleSkipConcept() {
        if (!this.isAwaitingConcept) return;
        this.showNotification('Conceito pulado.', 1500);
        this.finishConceptPhase();
    }

    finishConceptPhase() {
        this.isAwaitingConcept = false;
        this.conceptPromptModal.style.display = 'none';
        this.conceptsListEl.querySelectorAll('.concept-card').forEach(el => el.classList.remove('active-prompt'));
        this.renderAll();
        
        setTimeout(() => this.endTurn(), 500);
    }

    // --- 4. LÓGICA DA IA ---

    executeAITurn(player) {
        this.showNotification(`${player.name} está pensando...`, 1000);

        setTimeout(() => {
            const playableCard = player.hand.find(card => this.isValidPlay(card));

            if (playableCard) {
                const cardIndex = player.hand.findIndex(c => c.id === playableCard.id);
                player.hand.splice(cardIndex, 1);
                this.discardPile.push(playableCard);
                this.topCard = playableCard;

                this.showNotification(`${player.name} jogou ${playableCard.name}.`, 1500);

                setTimeout(() => this.endTurn(), 1000);
            } else {
                this.drawCard(player);
                this.showNotification(`${player.name} comprou uma carta.`, 1500);
                setTimeout(() => this.endTurn(), 1000);
            }
        }, 2000); 
    }

    // --- 5. REGRAS E UTILITÁRIOS ---

    isValidPlay(card) {
        if (!this.topCard) return true;
        if (card.school === this.topCard.school) return true;
        if (this.topCard.predecessors.includes(card.id)) return true;
        if (card.predecessors.includes(this.topCard.id)) return true;

        return false;
    }

    drawCard(player) {
        if (this.deck.length === 0) {
            if (!this.reshuffleDiscardPile()) {
                this.showNotification('Não há cartas para comprar!', 1500);
                return;
            }
        }
        const card = this.deck.pop();
        player.hand.push(card);
    }

    reshuffleDiscardPile() {
        this.showNotification('Reembaralhando o descarte...', 1500);
        const top = this.discardPile.pop();
        this.deck = [...this.discardPile];
        this.discardPile = top ? [top] : [];
        this.shuffleDeck();
        return this.deck.length > 0;
    }

    // --- 6. FIM DE JOGO ---

    endGame(winner) {
        const modal = document.getElementById('game-over-modal');
        document.getElementById('winner-message').textContent = `${winner.name} venceu!`;
        modal.style.display = 'flex';
    }

    // --- 7. RENDERING ---

    renderAll() {
        this.players.forEach(player => {
            if (player.isAI) {
                this.renderOpponentHand(player);
            } else {
                this.renderPlayerHand(player);
                this.renderConceptsPanel();
            }
            this.renderPlayerInfo(player);
        });
        this.renderPiles();
    }

    createCardElement(card, isFaceUp = true) {
        const cardEl = document.createElement('div');
        cardEl.classList.add('card');
        
        if (!isFaceUp) {
            cardEl.classList.add('card-back');
            return cardEl;
        }

        const schoolClass = `school-${card.school.toLowerCase().replace(/ /g, '-')}`;
        cardEl.classList.add(schoolClass);
        cardEl.dataset.id = card.id;

        cardEl.innerHTML = `
            <div class="card-name">${card.name}</div>
            <div class="card-school">${card.school}</div>
        `;
        return cardEl;
    }

    renderPlayerHand(player) {
        const handEl = document.getElementById('player-hand');
        handEl.innerHTML = '';
        player.hand.forEach(cardData => {
            const cardEl = this.createCardElement(cardData);
            if (this.isValidPlay(cardData)) {
                cardEl.classList.add('playable');
            }
            cardEl.addEventListener('click', () => this.handleCardPlay(cardData.id));
            handEl.appendChild(cardEl);
        });
    }

    renderOpponentHand(player) {
        const handEl = document.getElementById(`opponent-hand-2`);
        handEl.innerHTML = '';
        for (let i = 0; i < player.hand.length; i++) {
            handEl.appendChild(this.createCardElement(null, false));
        }
    }

    renderPlayerInfo(player) {
        const infoEl = document.getElementById(`player-info-${player.isAI ? 2 : 1}`);
        infoEl.innerHTML = `
            <div class="player-details">
                <div class="player-name">${player.name}</div>
                <div class="card-count">${player.hand.length} Cartas</div>
                ${!player.isAI ? `<div id="player-score">Pontos: ${player.score}</div>` : ''}
            </div>
        `;
        if (this.players[this.currentPlayerIndex].id === player.id) {
            infoEl.classList.add('active');
        } else {
            infoEl.classList.remove('active');
        }
    }
    
    renderPiles() {
        this.drawPileEl.innerHTML = '';
        if(this.deck.length > 0) {
            this.drawPileEl.appendChild(this.createCardElement(null, false));
        }

        this.discardPileEl.innerHTML = '';
        this.topCard = this.discardPile[this.discardPile.length - 1];
        if (this.topCard) {
            this.discardPileEl.appendChild(this.createCardElement(this.topCard));
        }
    }
    
    renderConceptsPanel() {
        const player = this.players.find(p => !p.isAI);
        this.conceptsListEl.innerHTML = '';
        player.concepts.forEach(concept => {
            const conceptEl = document.createElement('div');
            conceptEl.classList.add('concept-card');
            if (concept.used) conceptEl.classList.add('used');
            conceptEl.innerHTML = `
                <div class="concept-card-header">
                    <span class="concept-name">${concept.name}</span>
                    <span class="concept-points">${concept.points} pts</span>
                </div>
                <p class="concept-description">${concept.description}</p>
            `;
            conceptEl.addEventListener('click', () => this.handleConceptPlay(concept.id));
            this.conceptsListEl.appendChild(conceptEl);
        });
    }

    promptForConcept(playedCard) {
        document.getElementById('concept-prompt-philosopher').textContent = `Você jogou ${playedCard.name}`;
        this.conceptPromptModal.style.display = 'flex';
        
        this.conceptsListEl.querySelectorAll('.concept-card:not(.used)').forEach(el => el.classList.add('active-prompt'));

        const skipHandler = () => {
            this.handleSkipConcept();
            this.skipConceptBtn.removeEventListener('click', skipHandler);
        };
        this.skipConceptBtn.addEventListener('click', skipHandler);
    }

    showNotification(message, duration) {
        const msgEl = document.getElementById('notification-message');
        msgEl.innerHTML = message;
        this.notificationModal.style.display = 'flex';
        setTimeout(() => {
            this.notificationModal.style.display = 'none';
        }, duration);
    }
}
