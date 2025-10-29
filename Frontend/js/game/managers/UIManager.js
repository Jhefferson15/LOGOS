import { Card } from '../components/Card.js';
import { ConceptsPanel } from '../components/ConceptsPanel.js';
import { PlayerInfo } from '../components/PlayerInfo.js';
import { Hand } from '../components/Hand.js';
import { Piles } from '../components/Piles.js';

export class UIManager {
    constructor(gameInstance) {
        this.game = gameInstance; // Reference to the GameManager instance

        // Initialize sub-components
        this.conceptsPanel = new ConceptsPanel(
            document.getElementById('concepts-list'),
            this.game.handleConceptPlay.bind(this.game)
        );

        this.playerInfoEls = {
            1: new PlayerInfo(document.getElementById('player-info-1')),
            2: new PlayerInfo(document.getElementById('player-info-2')),
        };

        this.playerHand = new Hand(
            document.getElementById('player-hand'),
            this._createCardElement.bind(this), // Pass a bound helper for card creation
            this.game.isValidPlay.bind(this.game),
            this.game.handleCardPlay.bind(this.game)
        );
        this.opponentHand = new Hand(
            document.getElementById('opponent-hand-2'),
            this._createCardElement.bind(this), // Pass a bound helper for card creation
            this.game.isValidPlay.bind(this.game),
            this.game.handleCardPlay.bind(this.game) // Not strictly needed for opponent, but for consistency
        );

        this.piles = new Piles(
            document.getElementById('draw-pile'),
            document.getElementById('discard-pile'),
            this._createCardElement.bind(this) // Pass a bound helper for card creation
        );

        // Event listener for draw pile
        document.getElementById('draw-pile').addEventListener('click', () => this.game.handleDrawClick());
    }

    // Helper method to create a card element, used by Hand and Piles
    _createCardElement(cardData, isFaceUp = true) {
        const card = new Card(cardData, isFaceUp);
        return card.element;
    }

    renderAll(players, topCard, deckLength, currentPlayerId) {
        players.forEach(player => {
            if (player.isAI) {
                this.playerHand.renderOpponentHand(player); // Use playerHand for opponent rendering
            } else {
                this.playerHand.renderPlayerHand(player);
                this.conceptsPanel.render(player.concepts);
            }
            this.playerInfoEls[player.isAI ? 2 : 1].render(player, currentPlayerId);
        });
        this.piles.render(deckLength, topCard);
    }

    addActivePromptClassToConcepts() {
        this.conceptsPanel.addActivePromptClass();
    }

    removeActivePromptClassFromConcepts() {
        this.conceptsPanel.removeActivePromptClass();
    }
}