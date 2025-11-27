import { gameState } from '../../../data/gameState.js';
import { SoundManager } from '../../../game/modules/audio.js';

/**
 * @memberof Popups
 */
export const EndGamePopup = {
    title: null, // Full-screen experience

    getHTML: ({ isVictory, trophyChange, scrollsReward, chestReward }) => {
        const resultTitle = isVictory ? "Vitória!" : "Derrota";
        const resultClass = isVictory ? "victory" : "defeat";
        const trophyIcon = trophyChange >= 0 ? "fa-trophy" : "fa-heart-broken";
        const trophyClass = trophyChange >= 0 ? "gain" : "loss";

        return `
            <div class="end-game-popup ${resultClass}">
                <div class="end-game-banner">
                    <h1>${resultTitle}</h1>
                </div>
                <div class="end-game-summary">
                    <div class="summary-item trophy-summary">
                        <span class="summary-label">Troféus</span>
                        <div class="summary-value ${trophyClass}">
                            <i class="fas ${trophyIcon}"></i>
                            <span>${trophyChange > 0 ? '+' : ''}${trophyChange}</span>
                        </div>
                    </div>
                </div>
                <h2>Recompensas do Debate</h2>
                <div class="end-game-rewards">
                    <div class="reward-item">
                        <i class="fas fa-scroll fa-2x"></i>
                        <span class="reward-amount">+${scrollsReward}</span>
                        <span class="reward-label">Papiros</span>
                    </div>
                    ${chestReward ? `
                    <div class="reward-item">
                        <i class="fas fa-box fa-2x"></i>
                        <span class="reward-label">${chestReward}</span>
                    </div>
                    ` : ''}
                </div>
                <button id="end-game-continue-btn" class="btn-main">Continuar</button>
            </div>
            <link rel="stylesheet" href="../css/components/end-game.css">
        `;
    },

    setupListeners: (element, data, popupManager) => {
        SoundManager.play(data.isVictory ? 'win' : 'lose');

        const continueBtn = element.querySelector('#end-game-continue-btn');
        continueBtn.addEventListener('click', () => {
            // Update gameState with rewards
            gameState.trophies += data.trophyChange;
            gameState.scrolls += data.scrollsReward;

            if (data.chestReward) {
                // Find an empty chest slot and add the new chest
                const emptySlotIndex = gameState.chestSlots.findIndex(slot => slot === null);
                if (emptySlotIndex !== -1) {
                    gameState.chestSlots[emptySlotIndex] = {
                        type: data.chestReward,
                        arena: `Arena ${gameState.currentArena}`,
                        status: 'locked', // or 'unlocking'
                        remainingTime: 2 * 60 * 60 // 2 hours in seconds
                    };
                }
            }

            // If we are in the main menu (data.isMainMenu is true), just close the popup
            if (data.isMainMenu) {
                popupManager.close();
            } else {
                // If we are in-game, redirect to main menu
                window.location.href = '../index.html';
            }
        });
    }
};
