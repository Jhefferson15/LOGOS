import { PHILOSOPHERS_DATA } from '../../data/philosophers.js';
import { CONCEPTS_DATA } from '../../data/concepts.js';
import { AIManager } from './AIManager.js';
import { ModalManager } from './ModalManager.js';
import { UIManager } from './UIManager.js';

export class Game {
    constructor() {
        this.players = [];
        this.deck = [];
        this.discardPile = [];
        this.currentPlayerIndex = 0;
        this.topCard = null;
        this.isAwaitingConcept = false;

        this.modalManager = new ModalManager();
        this.aiManager = new AIManager(this);
        this.uiManager = null; // UIManager will be instantiated in start() after DOM elements are available
    }

    start(playerConfigs) {
        this.setupPlayers(playerConfigs);
        this.setupDeck();
        this.dealInitialCards();
        this.dealConceptsToPlayers();
        this.startDiscardPile();

        // Instantiate UIManager here, after DOM is ready
        this.uiManager = new UIManager(this);

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
            this.aiManager.executeAITurn(currentPlayer);
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
        this.modalManager.hideConceptPrompt();
        this.uiManager.removeActivePromptClassFromConcepts();
        this.renderAll();
        
        setTimeout(() => this.endTurn(), 500);
    }

    // --- 4. LÓGICA DA IA ---

    // --- 5. GAME END ---

    endGame(winner) {
        this.modalManager.showGameOver(winner);
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
        this.modalManager.showGameOver(winner);
    }

    // --- 7. RENDERING ---

    renderAll() {
        this.uiManager.renderAll(this.players, this.topCard, this.deck.length, this.players[this.currentPlayerIndex].id);
    }

    promptForConcept(playedCard) {
        this.modalManager.showConceptPrompt(playedCard);
        this.uiManager.addActivePromptClassToConcepts();

        const skipHandler = () => {
            this.handleSkipConcept();
            document.getElementById('skip-concept-btn').removeEventListener('click', skipHandler);
        };
        document.getElementById('skip-concept-btn').addEventListener('click', skipHandler);
    }

    showNotification(message, duration) {
        this.modalManager.showNotification(message, duration);
    }
}