
import { gameState } from '../data/gameState.js';
import { arenas } from '../data/arenas.js';
import { toast } from './Toast.js'; // Importar o toast para usar nos placeholders
import { PHILOSOPHERS_DATA } from '../data/philosophers.js';
import { CONCEPTS_DATA, CONCEPTS_DATA_1 } from '../data/concepts.js';

class PopupManager {
    constructor() {
        this.container = document.getElementById('modal-container');
        this.titleElement = document.getElementById('modal-title');
        this.bodyElement = document.getElementById('modal-body');
        this.closeBtn = document.getElementById('modal-close-btn');

        this.closeBtn.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-container')) {
                this.close();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.container.classList.contains('active')) {
                this.close();
            }
        });
    }

    open(popupId, data = {}) {
        let title = '';
        let contentHTML = '';

        switch (popupId) {
            case 'full-profile':
                title = 'Perfil do Filósofo';
                contentHTML = this._renderFullProfilePopup();
                break;
            case 'settings':
                title = 'Configurações';
                contentHTML = this._renderSettingsPopup();
                break;
            case 'chest-rewards':
                title = `Recompensas da Obra "${data.chestType}"`;
                contentHTML = this._renderChestRewardsPopup(data.rewards);
                break;
            case 'arena-timeline':
                title = 'Jornada Filosófica';
                contentHTML = this._renderArenaTimelinePopup();
                break;
            case 'level-xp':
                title = `Nível ${gameState.level} - Progresso`;
                contentHTML = this._renderLevelXpPopup();
                break;
            case 'chest-info':
                title = `Obra: ${data.chest.type}`;
                contentHTML = this._renderChestInfoPopup(data.chest);
                break;
            case 'timed-chest-info':
                title = data.type === 'free' ? 'Conceito Grátis' : 'Coroa da Sabedoria';
                contentHTML = this._renderTimedChestInfoPopup(data.type);
                break;
            case 'philosopher-details':
                const philosopher = PHILOSOPHERS_DATA[data.philosopherId];
                if (!philosopher) {
                    console.error(`Filósofo com ID ${data.philosopherId} não encontrado.`);
                    return;
                }
                title = philosopher.name; // O título do modal será o nome do filósofo
                contentHTML = this._renderPhilosopherCardPopup(philosopher, data.philosopherState);
                break;
            default:
                console.error(`Popup com ID "${popupId}" não encontrado.`);
                return;
        }

        this.titleElement.innerText = title;
        this.bodyElement.innerHTML = contentHTML;
        this.container.classList.add('active');
        this._addInternalListeners(popupId, data); // Passar 'data' para os listeners internos

        // Se for o popup da timeline de arenas, rolar para o final
        if (popupId === 'arena-timeline') {
            // Pequeno delay para garantir que o conteúdo foi renderizado e o scrollHeight é preciso
            setTimeout(() => {
                this.bodyElement.scrollTop = this.bodyElement.scrollHeight;
            }, 100);
        }
    }
     _renderPhilosopherCardPopup(philosopher, state) {
        // Gera o HTML para os conceitos-chave
        const keyConceptsHTML = philosopher.keyConcepts.map(conceptId => {
            const concept = CONCEPTS_DATA_1[conceptId]; // Use o objeto de dados correto
            if (!concept) {
                console.warn(`Conceito com ID ${conceptId} não encontrado para o filósofo ${philosopher.name}.`);
                return ''; // Retorna uma string vazia se o conceito não for encontrado
            }
            return `
                <div class="concept-chip">
                    <strong>${concept.name}</strong> (${concept.points} pts)
                    <p>${concept.description}</p>
                </div>
            `;
        }).join('');

        // Gera o HTML para os predecessores (links para outros filósofos)
        const predecessorsLinks = philosopher.predecessors.map(id => {
            const pred = PHILOSOPHERS_DATA[id];
            if (!pred) {
                console.warn(`Predecessor com ID ${id} não encontrado para o filósofo ${philosopher.name}.`);
                return null;
            }
            return `<span class="philosopher-link" data-philosopher-id="${id}">${pred.name}</span>`;
        }).filter(Boolean); // Remove quaisquer links nulos

        const predecessorsHTML = predecessorsLinks.length > 0
            ? predecessorsLinks.join(', ')
            : '<span>Nenhum direto (pensador original)</span>';

        const nextLevelPergaminhos = state.level * 10; // Exemplo de cálculo

        return `
            <div class="philosopher-popup">
                <div class="popup-header">
                    <img src="${philosopher.image}" alt="${philosopher.name}" class="philosopher-image-large">
                    <div class="header-info">
                        <span class="philosopher-era">${philosopher.era}</span>
                        <h2 class="philosopher-school">${philosopher.school}</h2>
                        <p class="philosopher-description">${philosopher.description}</p>
                    </div>
                </div>

                <div class="popup-stats">
                    <div class="stat-item">
                        <span>Nível</span>
                        <strong>${state.level}</strong>
                    </div>
                    <div class="stat-item">
                        <span>Poder de Argumento</span>
                        <strong>${state.level * 15}</strong>
                    </div>
                     <div class="stat-item">
                        <span>Custo de Aprimoramento</span>
                        <strong><i class="fas fa-coins"></i> ${state.level * 100}</strong>
                    </div>
                </div>

                <div class="popup-upgrade-section">
                    <div class="upgrade-bar">
                        <div class="upgrade-fill" style="width: ${(state.count / nextLevelPergaminhos) * 100}%"></div>
                        <span class="upgrade-text">${state.count} / ${nextLevelPergaminhos} Pergaminhos</span>
                    </div>
                    <button class="action-button ${state.count >= nextLevelPergaminhos ? '' : 'disabled'}" id="upgrade-philosopher-btn">
                        Aprimorar
                    </button>
                </div>

                <div class="popup-section">
                    <h3>Conceitos-Chave</h3>
                    <div class="concepts-container">
                        ${keyConceptsHTML}
                    </div>
                </div>

                <div class="popup-section">
                    <h3>Influenciado Por</h3>
                    <p class="predecessors-list">${predecessorsHTML}</p>
                </div>
            </div>
        `;
    }


    close() {
        this.container.classList.remove('active');
        setTimeout(() => { this.bodyElement.innerHTML = ''; }, 300);
    }
    
    // --- MÉTODOS DE RENDERIZAÇÃO DETALHADOS ---

    _renderArenaTimelinePopup() {
        const playerTrophies = gameState.trophies;

        // Encontra a arena atual do jogador
        let currentArena = null;
        // Itera de trás para frente para encontrar a arena de maior troféu que o jogador alcançou
        for (let i = arenas.length - 1; i >= 0; i--) {
            if (playerTrophies >= arenas[i].trophyReq) {
                currentArena = arenas[i];
                break;
            }
        }
        // Caso o jogador tenha menos troféus que a primeira arena (improvável com req 0)
        if (!currentArena) currentArena = arenas[0];

        const arenasHTML = arenas.map(arena => {
            let stateClass = '';
            if (playerTrophies >= arena.trophyReq) {
                // Se o jogador tem troféus suficientes, verifica se é a arena atual ou uma já passada
                stateClass = (arena.id === currentArena.id) ? 'current' : 'unlocked';
            } else {
                // Se não tem troféus suficientes, a arena está bloqueada
                stateClass = 'locked';
            }
            
            // Formata o nome das escolas para exibição
            const schoolsText = arena.schools.join(', ').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

            return `
                <div class="arena-card ${stateClass}" data-trophies="${arena.trophyReq}">
                    <div class="path-connector">
                        <div class="trophy-marker">
                            <i class="fa-solid fa-trophy icon"></i>
                            <span class="trophy-count">${arena.trophyReq}</span>
                        </div>
                    </div>
                    <div class="arena-content">
                        <div class="arena-image-wrapper">
                            <img src="${arena.image}" alt="${arena.name}" class="arena-image">
                             ${stateClass === 'locked' ? '<i class="fa-solid fa-lock lock-icon"></i>' : ''}
                        </div>
                        <div class="arena-info">
                             ${stateClass === 'current' ? '<span class="current-marker">SUA ARENA</span>' : ''}
                            <h2>${arena.id}: ${arena.name}</h2>
                            <div class="unlocks-section">
                                <h3>Escolas de Pensamento</h3>
                                <p class="schools-list">${schoolsText}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const css = `
            <style>
            .arena-timeline-popup .arenas-container {
                display: flex;
                flex-direction: column-reverse; /* Mostra a primeira arena embaixo */
                gap: 20px;
                padding: 10px;
            }
            .arena-timeline-popup .arena-card {
                display: flex;
                align-items: flex-start;
                gap: 15px;
                padding: 15px;
                background-color: #fff;
                border: 1px solid var(--color-border);
                border-radius: 12px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            }
            .arena-timeline-popup .path-connector {
                flex: 0 0 60px;
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
                align-self: stretch;
            }
            .arena-timeline-popup .path-connector::before {
                content: '';
                position: absolute;
                top: 0; bottom: 0; left: 50%;
                transform: translateX(-50%);
                width: 3px;
                background-image: linear-gradient(to bottom, #ccc 50%, transparent 50%);
                background-size: 1px 10px;
            }
            .arena-timeline-popup .arenas-container .arena-card:last-child .path-connector::before {
                height: 40px; top: auto; bottom: 0;
            }
            .arena-timeline-popup .arenas-container .arena-card:first-child .path-connector::before {
                height: calc(100% - 40px); top: 40px;
            }
            .arena-timeline-popup .trophy-marker {
                display: flex; flex-direction: column; align-items: center;
                background-color: var(--color-background);
                padding: 5px 0; z-index: 1;
            }
            .arena-timeline-popup .trophy-marker .icon { font-size: 24px; color: #aaa; }
            .arena-timeline-popup .trophy-marker .trophy-count { font-weight: bold; font-size: 14px; color: #777; }
            .arena-timeline-popup .arena-content { flex: 1; }
            .arena-timeline-popup .arena-image-wrapper { position: relative; margin-bottom: 10px; }
            .arena-timeline-popup .arena-image { width: 100%; border-radius: 8px; display: block; }
            .arena-timeline-popup .arena-info h2 { font-family: var(--font-title); font-size: 1.5em; margin-bottom: 8px; }
            .arena-timeline-popup .unlocks-section h3 {
                font-size: 0.8em; text-transform: uppercase; letter-spacing: 1px;
                color: #888; margin-bottom: 5px;
            }
            .arena-timeline-popup .schools-list { font-size: 0.9em; color: #555; }
            
            /* Estados */
            .arena-timeline-popup .arena-card.locked { opacity: 0.7; }
            .arena-timeline-popup .arena-card.locked .arena-image { filter: grayscale(100%) brightness(0.6); }
            .arena-timeline-popup .arena-card.locked .arena-info h2 { color: #999; }
            .arena-timeline-popup .lock-icon {
                position: absolute; top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                font-size: 48px; color: rgba(255, 255, 255, 0.8);
            }
            .arena-timeline-popup .arena-card.current {
                border-color: var(--color-accent);
                box-shadow: 0 0 15px rgba(212, 160, 23, 0.5);
            }
            .arena-timeline-popup .arena-card.current .trophy-marker .icon,
            .arena-timeline-popup .arena-card.current .trophy-marker .trophy-count {
                color: var(--color-accent); font-weight: bold;
            }
            .arena-timeline-popup .current-marker {
                background-color: var(--color-accent); color: white; font-weight: bold;
                padding: 4px 10px; border-radius: 20px; font-size: 0.8em;
                margin-bottom: 10px; display: inline-block;
            }
            .arena-timeline-popup .arena-card.unlocked .trophy-marker .icon {
                color: var(--color-primary);
            }
            </style>
        `;
        
        return `${css}<div class="arena-timeline-popup"><div class="arenas-container">${arenasHTML}</div></div>`;
    }

    _renderLevelXpPopup() {
        const winRate = gameState.totalDebates > 0 ? ((gameState.wins / gameState.totalDebates) * 100).toFixed(1) : 0;
        return `
            <div class="level-xp-popup">
                <div class="popup-card">
                    <h4>Progresso Atual</h4>
                    <div class="xp-bar-popup">
                        <div class="xp-fill-popup" style="width: ${(gameState.xp / gameState.xpMax) * 100}%"></div>
                        <span class="xp-text">${gameState.xp} / ${gameState.xpMax} XP</span>
                    </div>
                    <p class="xp-remaining">Faltam ${gameState.xpMax - gameState.xp} XP para o próximo nível.</p>
                </div>
                <div class="popup-card">
                    <h4>Recompensas do Nível ${gameState.level + 1}</h4>
                    <ul class="rewards-list">
                        <li><i class="fas fa-coins"></i> +500 Ouro</li>
                        <li><i class="fas fa-scroll"></i> +100 Pergaminhos</li>
                        <li><i class="fas fa-unlock-alt"></i> Nova Arena Desbloqueada</li>
                    </ul>
                </div>
                <div class="popup-card">
                    <h4>Estatísticas de Batalha</h4>
                    <div class="stats-grid">
                        <div class="stat-item"><span>Vitórias</span><strong>${gameState.wins}</strong></div>
                        <div class="stat-item"><span>Derrotas</span><strong>${gameState.totalDebates - gameState.wins}</strong></div>
                        <div class="stat-item"><span>Coroas</span><strong>${gameState.crowns}</strong></div>
                        <div class="stat-item"><span>Taxa de Vit.</span><strong>${winRate}%</strong></div>
                        <div class="stat-item"><span>Filósofo Fav.</span><strong>Platão</strong></div>
                        <div class="stat-item"><span>Escola Fav.</span><strong>Grega</strong></div>
                    </div>
                </div>
            </div>
        `;
    }

    _renderFullProfilePopup() {
        const winRate = gameState.totalDebates > 0 ? ((gameState.wins / gameState.totalDebates) * 100).toFixed(1) : 0;
        return `
            <div class="profile-popup">
                <div class="profile-main-info">
                    <div class="profile-avatar-container">
                        <img src="assets/avatars/socrates.png" alt="Avatar" class="profile-avatar">
                        <button class="avatar-change-btn"><i class="fas fa-pencil-alt"></i></button>
                    </div>
                    <div class="profile-details">
                        <h3>${gameState.playerName}</h3>
                        <div class="profile-sub-details">
                            <span><i class="fas fa-shield-alt"></i> ${gameState.clanName}</span>
                            <span><i class="fas fa-trophy"></i> ${gameState.trophies} Troféus</span>
                        </div>
                    </div>
                </div>
                <div class="profile-tabs">
                    <button class="tab-btn active" data-tab="stats">Perfil</button>
                    <button class="tab-btn" data-tab="battles">Debates</button>
                    <button class="tab-btn" data-tab="friends">Amigos</button>
                </div>
                <div class="tab-content-container">
                    <div class="tab-content active" id="stats-content">
                        <div class="stats-grid">
                             <div class="stat-item"><span>Vitórias</span><strong>${gameState.wins}</strong></div>
                             <div class="stat-item"><span>Vitórias 3 Coroas</span><strong>${gameState.threeCrownWins || 0}</strong></div>
                             <div class="stat-item"><span>Total Debates</span><strong>${gameState.totalDebates}</strong></div>
                             <div class="stat-item"><span>Taxa de Vit.</span><strong>${winRate}%</strong></div>
                             <div class="stat-item"><span>Filósofo Favorito</span><strong>Platão</strong></div>
                             <div class="stat-item"><span>Doações de Cartas</span><strong>${gameState.donations || 0}</strong></div>
                        </div>
                    </div>
                    <div class="tab-content" id="battles-content"><p>Histórico de debates aparecerá aqui.</p></div>
                    <div class="tab-content" id="friends-content"><p>Lista de amigos e convites.</p></div>
                </div>
            </div>
        `;
    }

    _renderSettingsPopup() {
        return `
            <div class="settings-popup">
                <div class="settings-section">
                    <h4><i class="fas fa-volume-up"></i> Áudio</h4>
                    <!-- ... outras configurações de áudio ... -->
                    <div class="setting-item">
                        <span>Música</span>
                        <div class="range-slider">
                            <input type="range" min="0" max="100" value="80">
                        </div>
                    </div>
                    <div class="setting-item">
                        <span>Efeitos Sonoros</span>
                        <div class="range-slider">
                            <input type="range" min="0" max="100" value="100">
                        </div>
                    </div>
                </div>
                <div class="settings-section">
                    <h4><i class="fas fa-user-circle"></i> Conta</h4>
                    <!-- ... outras configurações de conta ... -->
                    <button class="action-button-secondary"><i class="fab fa-google"></i> Vincular ao Google</button>
                    <button class="action-button-secondary"><i class="fab fa-facebook"></i> Vincular ao Facebook</button>
                </div>
                <div class="settings-section">
                    <h4><i class="fas fa-info-circle"></i> Outros</h4>
                    
                    <!-- BOTÃO DE TELA CHEIA ADICIONADO AQUI -->
                    <button id="fullscreen-btn" class="action-button-secondary">
                        <i class="fas fa-expand"></i> 
                        <span>Tela Cheia</span>
                    </button>
                    
                    <button class="action-button-secondary">Termos de Serviço</button>
                    <button class="action-button-secondary">Política de Privacidade</button>
                    <button id="logout-btn" class="action-button red">Sair da Conta</button>
                </div>
            </div>
        `;
    }
        
    _renderChestInfoPopup(chest) {
        const formatTime = (s) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return `${h}h ${m}m`; };
        return `
            <div class="chest-info-popup">
                <img src="assets/chests/${chest.type.toLowerCase().replace(' ', '-')}.png" alt="${chest.type}" class="chest-info-image">
                <p class="chest-arena-text">Obtido na Arena ${chest.arena}</p>
                <div class="chest-unlock-info">
                    <i class="fas fa-clock"></i>
                    <span>Tempo para estudar: <strong>${formatTime(chest.totalTime)}</strong></span>
                </div>
                <h4>Recompensas Possíveis</h4>
                <div class="possible-rewards">
                    <span><i class="fas fa-scroll"></i> Pergaminhos</span>
                    <span><i class="fas fa-book"></i> Livros</span>
                    <span><i class="fas fa-users"></i> Novos Filósofos</span>
                </div>
            </div>
        `;
    }
    
    _renderTimedChestInfoPopup(type) {
        const chest = type === 'free' ? gameState.timers.freeChest : gameState.timers.crownChest;
        const isReady = chest <= 0;
        const formatTime = (s) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60; return h > 0 ? `${h}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}` : `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`; };
        
        const info = {
            free: { icon: 'fa-box-open', desc: 'Um baú com conceitos e recursos básicos, disponível a cada 4 horas.'},
            crown: { icon: 'fa-crown', desc: 'Vença debates e colete 10 coroas para abrir este baú com recompensas superiores!'}
        };
        
        return `
            <div class="timed-chest-popup">
                <i class="fas ${info[type].icon} chest-icon"></i>
                <p>${info[type].desc}</p>
                ${isReady 
                    ? `<button class="action-button">Coletar Agora!</button>`
                    : `<div class="timed-chest-timer">Próximo em: <strong>${formatTime(chest)}</strong></div>`
                }
            </div>
        `;
    }

    _addInternalListeners(popupId, data) {
       
       
        if (popupId === 'full-profile') {
            const tabs = this.bodyElement.querySelectorAll('.tab-btn');
            const contents = this.bodyElement.querySelectorAll('.tab-content');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    contents.forEach(c => c.classList.remove('active'));
                    tab.classList.add('active');
                    this.bodyElement.querySelector(`#${tab.dataset.tab}-content`).classList.add('active');
                    if(tab.dataset.tab !== 'stats') {
                       toast.show('Funcionalidade em desenvolvimento!', 'info');
                    }
                });
            });
            this.bodyElement.querySelector('.avatar-change-btn').addEventListener('click', () => {
                 toast.show('Customização de avatar em breve!', 'info');
            });
        }
         if (popupId === 'philosopher-details') {
            const upgradeBtn = this.bodyElement.querySelector('#upgrade-philosopher-btn');
            if (upgradeBtn && !upgradeBtn.classList.contains('disabled')) {
                upgradeBtn.addEventListener('click', () => {
                    // Lógica de aprimoramento aqui (a ser implementada)
                    toast.show(`Aprimorando ${PHILOSOPHERS_DATA[data.philosopherId].name}...`, 'success');
                    // Aqui você atualizaria o gameState e re-renderizaria a tela
                    this.close();
                });
            }
         }
        if (popupId === 'settings') {
            this._setupFullscreenButton();
            const logoutBtn = this.bodyElement.querySelector('#logout-btn');
            if(logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('isLoggedIn');
                    window.location.href = 'login.html';
                });
            }
        }
        
    }
     _setupFullscreenButton() { 
            const fullscreenButton = document.getElementById('fullscreen-btn');
            if (!fullscreenButton) return;

            const buttonIcon = fullscreenButton.querySelector('i');
            const buttonText = fullscreenButton.querySelector('span');

            function updateButtonUI() {
                if (document.fullscreenElement) {
                    buttonIcon.classList.remove('fa-expand');
                    buttonIcon.classList.add('fa-compress');
                    buttonText.textContent = 'Sair da Tela Cheia';
                } else {
                    buttonIcon.classList.remove('fa-compress');
                    buttonIcon.classList.add('fa-expand');
                    buttonText.textContent = 'Tela Cheia';
                }
            }

            fullscreenButton.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {
                        console.error(`Erro ao tentar entrar em modo tela cheia: ${err.message}`);
                    });
                } else {
                    document.exitFullscreen();
                }
            });

            document.addEventListener('fullscreenchange', updateButtonUI);
            updateButtonUI();
        }
}




export const popupManager = new PopupManager();