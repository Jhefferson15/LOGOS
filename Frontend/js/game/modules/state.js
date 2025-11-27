import { PHILOSOPHERS_DATA } from '../../data/philosophers.js';
import { CONCEPTS_DATA } from '../../data/concepts.js';
import { MAIN_PLAYER_DATA, OPPONENT_POOL, PLAYER_CONCEPT_SLOTS } from './constants.js';
import { Utils } from './utils.js';

/**
 * Module responsible for managing the game state.
 * Initializes and resets the state, including players, decks, and game variables.
 * @namespace StateModule
 */
export const StateModule = {
    /**
     * Initializes the game state for a new match.
     * Sets up players, decks, initial hands, and game flags.
     */
    initializeState() {
        const opponentData = Utils.shuffleArray([...OPPONENT_POOL]).slice(0, 3);
        const playerIds = [MAIN_PLAYER_DATA.id];
        const playersData = { [MAIN_PLAYER_DATA.id]: { name: MAIN_PLAYER_DATA.name, avatarSVG: MAIN_PLAYER_DATA.avatarSVG } };

        opponentData.forEach((opponent, i) => {
            const opponentId = `opponent-${i}`;
            playerIds.push(opponentId);
            playersData[opponentId] = { name: opponent.name, avatarSVG: opponent.avatarSVG };
        });

        const allPhilosopherIds = Object.keys(PHILOSOPHERS_DATA);
        const philosopherDeck = Utils.shuffleArray(allPhilosopherIds);

        const orderedPhilosophers = Object.keys(PHILOSOPHERS_DATA)
            .map(id => ({ id, ...PHILOSOPHERS_DATA[id] }))
            .sort((a, b) => a.date - b.date)
            .map(p => p.id);

        const firstCardOnPile = philosopherDeck.pop();

        this.state = {
            isAnimating: false,
            isPaused: false,
            isGameOver: false,
            logMessages: [],
            dragState: { isDragging: false },
            selectedCardIndex: null,
            roundSummary: { isActive: false, startPlayerId: null, powersUsed: [] },
            playersData: playersData,
            game: {
                orderedPhilosophers: orderedPhilosophers,
                lastPlayedCard: firstCardOnPile,
                drawDeck: philosopherDeck,
                discardPile: [firstCardOnPile],
                playerOrder: playerIds,
                currentPlayerIndex: 0,
                get currentPlayerId() { return this.playerOrder[this.currentPlayerIndex]; },
                players: {}
            }
        };

        playerIds.forEach(id => {
            this.state.game.players[id] = {
                score: 0,
                hand: this.state.game.drawDeck.splice(0, 5),
                statusEffects: [],
                concepts: [],
                conceptDeck: []
            };
        });

        const mainPlayer = this.state.game.players['player-main'];
        const allConceptIds = Utils.shuffleArray(Object.keys(CONCEPTS_DATA));
        mainPlayer.concepts = allConceptIds.splice(0, PLAYER_CONCEPT_SLOTS).map(id => CONCEPTS_DATA[id]);
        mainPlayer.conceptDeck = allConceptIds.map(id => CONCEPTS_DATA[id]);
    }
};