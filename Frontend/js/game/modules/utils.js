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
    shuffleArray: (arr) => arr.sort(() => Math.random() - 0.5)
};