import { gameState } from '../../../data/gameState.js';
import { toast } from '../../Toast.js';

/**
 * Módulo para o popup de perfil completo do usuário.
 */
export const FullProfilePopup = {
    title: 'Perfil do Filósofo',
    /**
     * Gera o HTML do conteúdo do popup.
     * @param {object} data - Dados para renderização (não utilizado neste popup).
     * @returns {string} HTML do conteúdo do popup.
     */
    getHTML: (data) => {
        const winRate = gameState.totalDebates > 0 ? ((gameState.wins / gameState.totalDebates) * 100).toFixed(1) : 0;
        return `<div class="profile-popup"><div class="profile-main-info"><div class="profile-avatar-container"><img src="assets/avatars/socrates.png" alt="Avatar" class="profile-avatar"><button class="avatar-change-btn"><i class="fas fa-pencil-alt"></i></button></div><div class="profile-details"><h3>${gameState.playerName}</h3><div class="profile-sub-details"><span><i class="fas fa-shield-alt"></i> ${gameState.clanName}</span><span><i class="fas fa-trophy"></i> ${gameState.trophies} Troféus</span></div></div></div><div class="profile-tabs"><button class="tab-btn active" data-tab="stats">Perfil</button><button class="tab-btn" data-tab="battles">Debates</button><button class="tab-btn" data-tab="friends">Amigos</button></div><div class="tab-content-container"><div class="tab-content active" id="stats-content"><div class="stats-grid"><div class="stat-item"><span>Vitórias</span><strong>${gameState.wins}</strong></div><div class="stat-item"><span>Vitórias 3 Coroas</span><strong>${gameState.threeCrownWins || 0}</strong></div><div class="stat-item"><span>Total Debates</span><strong>${gameState.totalDebates}</strong></div><div class="stat-item"><span>Taxa de Vit.</span><strong>${winRate}%</strong></div><div class="stat-item"><span>Filósofo Favorito</span><strong>Platão</strong></div><div class="stat-item"><span>Doações de Cartas</span><strong>${gameState.donations || 0}</strong></div></div></div><div class="tab-content" id="battles-content"><p>Histórico de debates aparecerá aqui.</p></div><div class="tab-content" id="friends-content"><p>Lista de amigos e convites.</p></div></div></div>`;
    },

    /**
     * Configura os event listeners para o popup.
     * @param {HTMLElement} element - O elemento do corpo do modal onde o HTML foi injetado.
     * @param {object} data - Dados para configuração (não utilizado neste popup).
     */
    setupListeners: (element, data) => {
        const tabs = element.querySelectorAll('.tab-btn');
        const contents = element.querySelectorAll('.tab-content');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                element.querySelector(`#${tab.dataset.tab}-content`).classList.add('active');
                if (tab.dataset.tab !== 'stats') {
                    toast.show('Funcionalidade em desenvolvimento!', 'info');
                }
            });
        });

        const avatarBtn = element.querySelector('.avatar-change-btn');
        if (avatarBtn) {
            avatarBtn.addEventListener('click', () => {
                toast.show('Customização de avatar em breve!', 'info');
            });
        }
    }
};