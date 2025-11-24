import { PHILOSOPHERS_DATA } from '../../../data/philosophers.js';
import { gameState } from '../../../data/gameState.js';
import { SoundManager } from '../../../game/modules/audio.js';

export const ChestOpeningPopup = {
    title: null, // Full screen experience

    getHTML: (data) => {
        const { chestType, rewards } = data;
        // The initial state shows the chest, ready to be opened.
        return `
            <div class="chest-opening-popup">
                <div class="chest-container">
                    <div class="chest-image-wrapper">
                        <img src="assets/game/chests/${chestType.toLowerCase().replace(' ', '_')}.png" alt="${chestType}" class="chest-image">
                    </div>
                    <button id="open-chest-btn" class="btn-main">Abrir Baú</button>
                </div>
                <div class="rewards-container">
                    <!-- Rewards will be revealed here one by one -->
                </div>
            </div>
            <link rel="stylesheet" href="css/components/chest-opening.css">
        `;
    },

    setupListeners: (element, data, popupManager) => {
        const { chestType, rewards } = data;
        const openChestBtn = element.querySelector('#open-chest-btn');
        const chestContainer = element.querySelector('.chest-container');
        const rewardsContainer = element.querySelector('.rewards-container');
        let revealedRewards = 0;
        
        // Generate a list of reward items to be revealed
        // This is a simplified simulation
        const rewardsToReveal = [];
        // 1. Gold
        if (rewards.scrolls) {
            rewardsToReveal.push({ type: 'scrolls', amount: rewards.scrolls });
        }
        // 2. Philosophers
        for (let i = 0; i < rewards.cardCount; i++) {
             // Just pick a random philosopher for demonstration
            const randomPhiloId = Object.keys(PHILOSOPHERS_DATA)[Math.floor(Math.random() * Object.keys(PHILOSOPHERS_DATA).length)];
            rewardsToReveal.push({ type: 'philosopher', philosopherId: randomPhiloId, quantity: 1 });
        }


        openChestBtn.addEventListener('click', () => {
            SoundManager.play('chest_open');
            chestContainer.classList.add('opening'); // CSS animation for chest opening

            // After animation, start revealing rewards
            setTimeout(() => {
                chestContainer.style.display = 'none';
                rewardsContainer.style.display = 'grid';
                revealNextReward();
            }, 1000); // Should match CSS animation duration
        });

        const revealNextReward = () => {
            if (revealedRewards >= rewardsToReveal.length) {
                // All rewards revealed, show a "Done" button
                const doneButton = document.createElement('button');
                doneButton.textContent = 'Concluir';
                doneButton.className = 'btn-main btn-done';
                doneButton.onclick = () => popupManager.close();
                rewardsContainer.appendChild(doneButton);
                return;
            }

            const reward = rewardsToReveal[revealedRewards];
            const rewardCard = document.createElement('div');
            rewardCard.className = 'reward-card';

            if (reward.type === 'scrolls') {
                rewardCard.innerHTML = `
                    <div class="reward-image gold-reward"><i class="fas fa-scroll"></i></div>
                    <div class="reward-name">Papiros</div>
                    <div class="reward-amount">+${reward.amount}</div>
                `;
            } else if (reward.type === 'philosopher') {
                const philosopher = PHILOSOPHERS_DATA[reward.philosopherId];
                // Check if player already owns this philosopher to simulate getting XP/duplicates
                const isDuplicate = gameState.ownedPhilosophers && gameState.ownedPhilosophers[reward.philosopherId];
                
                rewardCard.innerHTML = `
                    <div class="reward-image" style="background-image: url('${philosopher.image}')"></div>
                    <div class="reward-name">${philosopher.name}</div>
                    <div class="reward-amount">x${reward.quantity}</div>
                    ${isDuplicate ? '<div class="duplicate-indicator">DUPLICADA</div>' : ''}
                `;
            }
            
            rewardsContainer.appendChild(rewardCard);
            
            // Add animation and set up next reveal
            setTimeout(() => {
                rewardCard.classList.add('revealed');
                SoundManager.play('play_card');
            }, 100);

            revealedRewards++;

            // Wait before revealing the next card, or for the user to click
            setTimeout(revealNextReward, 1500); // Automatically reveal next card after 1.5s
        };
    }
};
