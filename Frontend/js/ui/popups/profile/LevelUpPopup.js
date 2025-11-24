import { SoundManager } from '../../../game/modules/audio.js';

export const LevelUpPopup = {
    title: 'Você Subiu de Nível!',

    getHTML: ({ oldLevel, newLevel, rewards }) => {
        return `
            <div class="level-up-popup">
                <div class="level-up-animation">
                    <div class="level-display old-level">
                        <span class="level-label">Nível</span>
                        <span class="level-number">${oldLevel}</span>
                    </div>
                    <div class="arrow-separator">
                        <i class="fas fa-long-arrow-alt-right"></i>
                    </div>
                    <div class="level-display new-level">
                        <span class="level-label">Nível</span>
                        <span class="level-number">${newLevel}</span>
                    </div>
                </div>
                <h2>Recompensas de Nível</h2>
                <div class="level-up-rewards">
                    ${rewards.map(reward => `
                        <div class="reward-item">
                            <i class="fas ${reward.icon} fa-2x"></i>
                            <span class="reward-amount">+${reward.amount}</span>
                            <span class="reward-label">${reward.name}</span>
                        </div>
                    `).join('')}
                </div>
                <p class="level-up-message">Suas torres ficaram mais fortes!</p>
                <button id="level-up-continue-btn" class="btn-main">Continuar</button>
            </div>
            <link rel="stylesheet" href="css/components/level-up.css">
        `;
    },

    setupListeners: (element, data, popupManager) => {
        SoundManager.play('level_up'); // Assuming a sound for leveling up

        const continueBtn = element.querySelector('#level-up-continue-btn');
        continueBtn.addEventListener('click', () => {
            popupManager.close();
        });

        // Trigger animations
        setTimeout(() => {
            element.querySelector('.new-level').classList.add('animate');
            element.querySelectorAll('.reward-item').forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('revealed');
                }, 300 * (index + 1));
            });
        }, 500);
    }
};
