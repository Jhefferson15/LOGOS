/**
 * Base class for all game mechanics.
 * Defines the interface that specific game modes must implement.
 */
export class GameMechanic {
    constructor() {
        if (this.constructor === GameMechanic) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    /**
     * @returns {string} The unique ID of the mechanic.
     */
    get id() {
        throw new Error("Method 'id' must be implemented.");
    }

    /**
     * @returns {string} The display name of the mechanic.
     */
    get name() {
        throw new Error("Method 'name' must be implemented.");
    }

    /**
     * @returns {string} A brief description of the mechanic.
     */
    get description() {
        throw new Error("Method 'description' must be implemented.");
    }

    /**
     * @returns {string} The layout ID to use for this mechanic ('table', 'combat', 'timeline').
     */
    getLayout() {
        return 'table'; // Default layout
    }

    /**
     * Initializes the game state for this mechanic.
     * @param {object} engine - The EngineModule instance.
     * @param {object} stateModule - The StateModule instance.
     * @param {object} utils - The Utils module.
     */
    initializeState(engine, stateModule, utils) {
        // This is intended to be overridden by subclasses
    }

    /**
     * Checks if a card can be played.
     * @param {object} gameState - The current game state.
     * @param {string} playerId - The ID of the player.
     * @param {number} cardIndex - The index of the card in the player's hand.
     * @param {object} cardData - The data of the card.
     * @returns {boolean}
     */
    canPlayCard(gameState, playerId, cardIndex, cardData) {
        return true; // Default to allowing play if not overridden
    }

    /**
     * Executes the logic when a card is played.
     * @param {object} engine - The EngineModule instance.
     * @param {string} playerId - The ID of the player playing the card.
     * @param {number} cardIndex - The index of the card in the player's hand.
     * @param {object} cardData - The data of the card being played.
     * @returns {Promise<void>}
     */
    async playCard(engine, playerId, cardIndex, cardData) {
        throw new Error("Method 'playCard' must be implemented.");
    }

    /**
     * Calculates the score for a played card.
     * @param {object} gameState - The current game state.
     * @param {string} playedCardId - The ID of the card being played.
     * @returns {number} The calculated score.
     */
    calculateScore(gameState, playedCardId) {
        return 0;
    }

    /**
     * Checks if there is a winner.
     * @param {object} gameState - The current game state.
     * @returns {string|null} The ID of the winner, or null if no winner yet.
     */
    checkWinCondition(gameState) {
        return null;
    }

    /**
     * Returns the initial hand size for this mechanic.
     * @returns {number}
     */
    getInitialHandSize() {
        return 5; // Default
    }

    /**
     * Hook called at the start of a turn.
     * @param {object} engine - The EngineModule instance.
     * @param {string} playerId - The ID of the player whose turn it is.
     */
    onTurnStart(engine, playerId) {
        // Optional hook
    }

    /**
     * Hook called at the end of a turn.
     * @param {object} engine - The EngineModule instance.
     * @param {string} playerId - The ID of the player whose turn ended.
     */
    onTurnEnd(engine, playerId) {
        // Optional hook
    }

    /**
     * Logic for the AI opponent's turn.
     * @param {object} engine - The EngineModule instance.
     * @param {string} opponentId - The ID of the opponent.
     */
    async simulateOpponentTurn(engine, opponentId) {
        throw new Error("Method 'simulateOpponentTurn' must be implemented.");
    }
}
