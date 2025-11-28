import { PHILOSOPHERS_DATA } from '../../../data/philosophers.js';
import { gameState } from '../../../data/gameState.js';
import { SoundManager } from '../../../game/modules/audio.js';
import { ImageService } from '../../../services/ImageService.js';

export const ChestOpeningPopup = {
    title: null,

    getHTML: (data) => {
        const { chestType } = data;
        // Adicionei 'sunburst' para o efeito de luz rotativa atrás do baú/cartas
        return `
            <div class="chest-overlay">
                <div class="chest-opening-content">
                    <div class="sunburst"></div> 
                    
                    <div class="chest-container">
                        <div class="chest-image-wrapper">
                            <img src="assets/game/chests/${chestType.toLowerCase().replace(' ', '_')}.png" alt="${chestType}" class="chest-image">
                        </div>
                        <h2 class="chest-title">Baú do Conhecimento</h2>
                        <button id="open-chest-btn" class="btn-primary">Revelar Sabedoria</button>
                    </div>

                    <div class="rewards-container" style="display: none;">
                        <!-- Cards injetados via JS -->
                    </div>
                </div>
            </div>
            <link rel="stylesheet" href="css/components/chest-opening.css">
        `;
    },

    setupListeners: (element, data, popupManager) => {
        const { rewards } = data;
        const openChestBtn = element.querySelector('#open-chest-btn');
        const chestContainer = element.querySelector('.chest-container');
        const rewardsContainer = element.querySelector('.rewards-container');
        const chestImage = element.querySelector('.chest-image');
        const sunburst = element.querySelector('.sunburst');

        let revealedRewards = 0;
        const rewardsToReveal = [];

        // Preparar recompensas
        if (rewards.scrolls) {
            rewardsToReveal.push({ type: 'scrolls', amount: rewards.scrolls });
        }
        for (let i = 0; i < rewards.cardCount; i++) {
            const keys = Object.keys(PHILOSOPHERS_DATA);
            const randomPhiloId = keys[Math.floor(Math.random() * keys.length)];
            rewardsToReveal.push({ type: 'philosopher', philosopherId: randomPhiloId, quantity: 1 });
        }

        openChestBtn.addEventListener('click', () => {
            SoundManager.play('chest_open');

            // Animação de abrir
            openChestBtn.style.opacity = '0';
            chestImage.classList.add('shaking');

            setTimeout(() => {
                chestImage.classList.remove('shaking');
                chestImage.classList.add('opening-burst'); // Efeito de explosão/sumiço
                sunburst.classList.add('active'); // Ativa os raios de luz

                setTimeout(() => {
                    chestContainer.style.display = 'none';
                    rewardsContainer.style.display = 'flex';
                    revealNextReward();
                }, 600);
            }, 800);
        });

        const revealNextReward = () => {
            if (revealedRewards >= rewardsToReveal.length) {
                // Botão de Concluir
                const doneButton = document.createElement('button');
                doneButton.textContent = 'Coletar Tudo';
                doneButton.className = 'btn-primary btn-done animate-pop-in';
                doneButton.onclick = () => popupManager.close();
                rewardsContainer.appendChild(doneButton);
                return;
            }

            const reward = rewardsToReveal[revealedRewards];
            const rewardCard = document.createElement('div');
            rewardCard.className = 'reward-card animate-card-flip';

            if (reward.type === 'scrolls') {
                rewardCard.innerHTML = `
                    <div class="card-inner common-reward">
                        <div class="glow-effect"></div>
                        <div class="reward-icon"><i class="fas fa-scroll"></i></div>
                        <div class="reward-info">
                            <span class="reward-name">Papiros</span>
                            <span class="reward-amount">+${reward.amount}</span>
                        </div>
                    </div>
                `;
            } else if (reward.type === 'philosopher') {
                const philosopher = PHILOSOPHERS_DATA[reward.philosopherId];
                // Lógica de duplicata
                const isDuplicate = gameState.ownedPhilosophers && gameState.ownedPhilosophers[reward.philosopherId];
                const rarityClass = philosopher.rarity || 'common'; // Assumindo que exista propriedade rarity

                rewardCard.innerHTML = `
                    <div class="card-inner ${rarityClass}-reward">
                        <div class="glow-effect"></div>
                        <div class="card-portrait" style="background-image: url('${ImageService.getUrl(philosopher.image, ImageService.Sizes.MEDIUM)}')"></div>
                        <div class="reward-info">
                            <span class="reward-type">Filósofo</span>
                            <span class="reward-name">${philosopher.name}</span>
                            ${isDuplicate ? '<span class="tag-duplicate">Convertido em XP</span>' : '<span class="tag-new">Novo!</span>'}
                        </div>
                    </div>
                `;
            }

            rewardsContainer.appendChild(rewardCard);
            SoundManager.play('play_card');

            revealedRewards++;
            setTimeout(revealNextReward, 1200); // Ritmo da revelação
        };
    }
};