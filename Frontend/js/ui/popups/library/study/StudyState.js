/**
 * StudyState.js
 * Gerencia o estado da sessão de estudo e persistência.
 */
import { gameState } from '../../../../data/gameState.js';

export const StudyState = {
    /**
     * Carrega o estado salvo ou cria um inicial.
     * @param {string} philosopherId 
     * @returns {Object} Estado atual
     */
    loadState: (philosopherId) => {
        // Garante estrutura no gameState
        if (!gameState.studyProgress) gameState.studyProgress = {};
        if (!gameState.studyProgress[philosopherId]) {
            gameState.studyProgress[philosopherId] = { pagesViewed: new Set() };
        }

        const savedState = gameState.studyProgress[philosopherId]?.lastState;

        // Estado padrão
        const defaultState = {
            tab: 'theory',
            textPage: 1,
            comicIndex: 0,
            textSize: 18,
            fontFamily: 'serif',
            zoomLevel: 1.0,
            quizState: {
                started: false,
                currentQuestionIndex: 0,
                score: 0,
                answers: [],
                completed: false
            }
        };

        // Merge do salvo com padrão (para garantir campos novos)
        let state = savedState ? { ...defaultState, ...savedState } : { ...defaultState };

        // Garante integridade do quizState
        if (!state.quizState) state.quizState = { ...defaultState.quizState };

        return state;
    },

    /**
     * Salva o estado atual.
     * @param {string} philosopherId 
     * @param {Object} state 
     */
    saveState: (philosopherId, state) => {
        if (!gameState.studyProgress[philosopherId]) {
            gameState.studyProgress[philosopherId] = { pagesViewed: new Set() };
        }
        // Clona para evitar referências
        gameState.studyProgress[philosopherId].lastState = JSON.parse(JSON.stringify(state));
    },

    /**
     * Marca uma página como visualizada.
     * @param {string} philosopherId 
     * @param {number} pageNum 
     */
    markPageAsViewed: (philosopherId, pageNum) => {
        if (!gameState.studyProgress[philosopherId]) return;
        // Set não serializa bem em JSON puro se salvarmos o gameState direto, 
        // mas aqui estamos manipulando o objeto em memória.
        // Se o gameState for persistido em localStorage, precisará de tratamento para Sets.
        // Assumindo que gameState lida com isso ou é volátil/tratado externamente.
        if (!gameState.studyProgress[philosopherId].pagesViewed) {
            gameState.studyProgress[philosopherId].pagesViewed = new Set();
        }
        gameState.studyProgress[philosopherId].pagesViewed.add(pageNum);
    },

    /**
     * Verifica se uma página foi visualizada.
     */
    isPageViewed: (philosopherId, pageNum) => {
        return gameState.studyProgress[philosopherId]?.pagesViewed?.has(pageNum) || false;
    },

    /**
     * Retorna progresso geral (0-100).
     */
    getProgressPercentage: (philosopherId, totalPages) => {
        const viewed = gameState.studyProgress[philosopherId]?.pagesViewed?.size || 0;
        return Math.floor((viewed / totalPages) * 100);
    }
};
