/**
 * Utility functions for the game.
 * @namespace Utils
 */
export const Utils = {
    /**
     * Shuffles an array in place using a random sort.
     * Note: This is a simple shuffle and may not be perfectly random for large datasets.
     * @param {Array} arr - The array to shuffle.
     * @returns {Array} The shuffled array.
     */
    shuffleArray: (arr) => arr.sort(() => Math.random() - 0.5),

    /**
     * Renders the HTML content of a card.
     * @param {object} cardData - The data of the card.
     * @returns {string} The HTML content of the card.
     */
    renderCardContent(cardData) {
        return `<span class="card-value">${cardData.name}</span><div class="card-cost">${cardData.date}</div>`;
    }
};