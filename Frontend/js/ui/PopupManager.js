import { gameState } from '../data/gameState.js';
import { arenas } from '../data/arenas.js';
import { toast } from './Toast.js';
import { PHILOSOPHERS_DATA } from '../data/philosophers.js';
import { CONCEPTS_DATA, CONCEPTS_DATA_1 } from '../data/concepts.js';

// --- IMPORTANTE ---
// Presume-se a existência de um novo arquivo de dados para o conteúdo de estudo aprofundado.
// Crie este arquivo em: /data/study_content.js
import { STUDY_CONTENT_DATA } from '../data/study_content.js';


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

        if (popupId === 'philosopher-study-module') {
            const philosopherStudy = PHILOSOPHERS_DATA[data.philosopherId];
            if (!philosopherStudy || !STUDY_CONTENT_DATA[data.philosopherId]) {
                console.error(`Dados de estudo para o filósofo com ID ${data.philosopherId} não encontrados.`);
                toast.show('Material de estudo indisponível para este filósofo.', 'error');
                return;
            }
            title = `Estudando: ${philosopherStudy.name}`;
            contentHTML = this._renderPhilosopherStudyModulePopup(data.philosopherId);
        } else if (popupId === 'philosopher-details') {
            const philosopher = PHILOSOPHERS_DATA[data.philosopherId];
            if (!philosopher) {
                console.error(`Filósofo com ID ${data.philosopherId} não encontrado.`);
                return;
            }
            title = philosopher.name;
            contentHTML = this._renderPhilosopherCardPopup(philosopher, data.philosopherState);
        } else if (popupId === 'full-profile') {
            title = 'Perfil do Filósofo';
            contentHTML = this._renderFullProfilePopup();
        } else if (popupId === 'settings') {
            title = 'Configurações';
            contentHTML = this._renderSettingsPopup();
        } else if (popupId === 'chest-rewards') {
            title = `Recompensas da Obra "${data.chestType}"`;
            contentHTML = this._renderChestRewardsPopup(data.rewards);
        } else if (popupId === 'arena-timeline') {
            title = 'Jornada Filosófica';
            contentHTML = this._renderArenaTimelinePopup();
        } else if (popupId === 'level-xp') {
            title = `Nível ${gameState.level} - Progresso`;
            contentHTML = this._renderLevelXpPopup();
        } else if (popupId === 'chest-info') {
            title = `Obra: ${data.chest.type}`;
            contentHTML = this._renderChestInfoPopup(data.chest);
        } else if (popupId === 'timed-chest-info') {
            title = data.type === 'free' ? 'Conceito Grátis' : 'Coroa da Sabedoria';
            contentHTML = this._renderTimedChestInfoPopup(data.type);
        } else {
            console.error(`Popup com ID "${popupId}" não encontrado.`);
            return;
        }

        this.titleElement.innerText = title;
        this.bodyElement.innerHTML = contentHTML;
        this.container.classList.add('active');
        this._addInternalListeners(popupId, data);

        if (popupId === 'arena-timeline') {
            setTimeout(() => { this.bodyElement.scrollTop = this.bodyElement.scrollHeight; }, 100);
        }
    }

    close() {
        this.container.classList.remove('active');
        setTimeout(() => { this.bodyElement.innerHTML = ''; }, 300);
    }

    // --- MÉTODO DE RENDERIZAÇÃO DO NOVO MÓDULO DE ESTUDO ---

    _renderPhilosopherStudyModulePopup(philosopherId) {
        const studyData = STUDY_CONTENT_DATA[philosopherId];
        const philosopher = PHILOSOPHERS_DATA[philosopherId];

        // Inicializa o progresso no gameState se não existir (robusto)
        if (!gameState.studyProgress) gameState.studyProgress = {};
        if (!gameState.studyProgress[philosopherId]) {
            gameState.studyProgress[philosopherId] = { pagesViewed: new Set() };
        }
        
        const progress = gameState.studyProgress[philosopherId];
        const percentage = Math.floor((progress.pagesViewed.size / studyData.totalPages) * 100);
        const css = `
            <style>
            .study-module { display: flex; flex-direction: column; height: 100%; }
            .study-header { display: flex; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color); }
            .study-header img { width: 100px; height: 100px; object-fit: cover; border-radius: 50%; border: 3px solid var(--bg-darker); }
            .study-header .header-info { flex: 1; }
            .study-progress-bar { background: var(--bg-dark); border-radius: 5px; height: 10px; margin-top: 5px; overflow: hidden; }
            .study-progress-bar div { background: var(--accent-yellow); height: 100%; transition: width 0.5s ease; }
            .study-tabs { display: flex; border-bottom: 1px solid var(--border-color); margin-top: 1rem; }
            .study-tabs .tab-btn { background: none; border: none; padding: 0.8rem 1rem; cursor: pointer; border-bottom: 3px solid transparent; }
            .study-tabs .tab-btn.active { border-bottom-color: var(--accent-yellow); font-weight: bold; }
            .study-content-area { flex: 1; padding: 1rem 0; overflow-y: auto; font-family: 'Times New Roman', serif; line-height: 1.6; }
            .study-content-area h1, .study-content-area h2 { font-family: var(--font-title); }
            .study-content-area .comic-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
            .study-content-area .comic-grid img { width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            .study-content-area .quiz-question { background: var(--bg-light); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
            .study-content-area .toc-list { list-style: none; padding: 0; }
            .study-content-area .toc-list li { padding: 0.5rem; border-bottom: 1px dashed var(--border-color); cursor: pointer; }
            .study-content-area .toc-list li:hover { background: var(--bg-darker-alpha); }
            .study-navigation { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border-color); }
            .study-navigation button { background: var(--bg-darker); border: 1px solid var(--border-color); padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; }
            .study-navigation button:disabled { opacity: 0.5; cursor: not-allowed; }
            </style>
        `;
        return `
            ${css}
            <div class="study-module" data-id="${philosopherId}" data-current-page="1" data-total-pages="${studyData.totalPages}">
                <div class="study-header">
                    <img src="${studyData.realImage}" alt="Retrato de ${philosopher.name}">
                    <div class="header-info">
                        <h2>${philosopher.name}</h2>
                        <span>Progresso de Maestria: <span id="study-progress-text">${percentage}</span>%</span>
                        <div class="study-progress-bar"><div id="study-progress-fill" style="width:${percentage}%"></div></div>
                    </div>
                </div>

                <div class="study-tabs">
                    <button class="tab-btn active" data-tab="theory">Teoria</button>
                    <button class="tab-btn" data-tab="quiz">Quiz</button>
                    <button class="tab-btn" data-tab="comic">HQ</button>
                </div>

                <div id="study-content-area" class="study-content-area">
                    <!-- Conteúdo dinâmico será injetado aqui -->
                </div>

                <div id="study-navigation" class="study-navigation">
                    <button id="study-prev-btn"><i class="fas fa-arrow-left"></i> Anterior</button>
                    <button id="study-toc-btn"><i class="fas fa-list-ul"></i> Sumário</button>
                    <span id="study-page-counter">Página 1 de ${studyData.totalPages}</span>
                    <button id="study-next-btn">Próxima <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        `;
    }


    // --- MÉTODOS DE RENDERIZAÇÃO ANTIGOS (SEM ALTERAÇÃO) ---

    _renderPhilosopherCardPopup(philosopher, state) {
        const keyConceptsHTML = philosopher.keyConcepts.map(conceptId => {
            const concept = CONCEPTS_DATA_1[conceptId];
            if (!concept) return '';
            return `<div class="concept-chip"><strong>${concept.name}</strong> (${concept.points} pts)<p>${concept.description}</p></div>`;
        }).join('');
        const predecessorsLinks = philosopher.predecessors.map(id => {
            const pred = PHILOSOPHERS_DATA[id];
            return pred ? `<span class="philosopher-link" data-philosopher-id="${id}">${pred.name}</span>` : null;
        }).filter(Boolean);
        const predecessorsHTML = predecessorsLinks.length > 0 ? predecessorsLinks.join(', ') : '<span>Nenhum direto (pensador original)</span>';
        const nextLevelPergaminhos = state.level * 10;
        return `
            <div class="philosopher-popup">
                <div class="popup-header"><img src="${philosopher.image}" alt="${philosopher.name}" class="philosopher-image-large"><div class="header-info"><span class="philosopher-era">${philosopher.era}</span><h2 class="philosopher-school">${philosopher.school}</h2><p class="philosopher-description">${philosopher.description}</p></div></div>
                <div class="popup-stats"><div class="stat-item"><span>Nível</span><strong>${state.level}</strong></div><div class="stat-item"><span>Poder de Argumento</span><strong>${state.level * 15}</strong></div><div class="stat-item"><span>Custo de Aprimoramento</span><strong><i class="fas fa-coins"></i> ${state.level * 100}</strong></div></div>
                <div class="popup-upgrade-section"><div class="upgrade-bar"><div class="upgrade-fill" style="width: ${(state.count / nextLevelPergaminhos) * 100}%"></div><span class="upgrade-text">${state.count} / ${nextLevelPergaminhos} Pergaminhos</span></div><button class="action-button ${state.count >= nextLevelPergaminhos ? '' : 'disabled'}" id="upgrade-philosopher-btn">Aprimorar</button></div>
                <div class="popup-section"><h3>Conceitos-Chave</h3><div class="concepts-container">${keyConceptsHTML}</div></div>
                <div class="popup-section"><h3>Influenciado Por</h3><p class="predecessors-list">${predecessorsHTML}</p></div>
            </div>`;
    }

    _renderArenaTimelinePopup() {
        // ... (código original sem alterações)
        const playerTrophies = gameState.trophies;
        let currentArena = arenas.slice().reverse().find(arena => playerTrophies >= arena.trophyReq) || arenas[0];
        const arenasHTML = arenas.map(arena => {
            let stateClass = playerTrophies >= arena.trophyReq ? (arena.id === currentArena.id ? 'current' : 'unlocked') : 'locked';
            const schoolsText = arena.schools.join(', ').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
            return `<div class="arena-card ${stateClass}" data-trophies="${arena.trophyReq}"><div class="path-connector"><div class="trophy-marker"><i class="fa-solid fa-trophy icon"></i><span class="trophy-count">${arena.trophyReq}</span></div></div><div class="arena-content"><div class="arena-image-wrapper"><img src="${arena.image}" alt="${arena.name}" class="arena-image"> ${stateClass === 'locked' ? '<i class="fa-solid fa-lock lock-icon"></i>' : ''}</div><div class="arena-info"> ${stateClass === 'current' ? '<span class="current-marker">SUA ARENA</span>' : ''}<h2>${arena.id}: ${arena.name}</h2><div class="unlocks-section"><h3>Escolas de Pensamento</h3><p class="schools-list">${schoolsText}</p></div></div></div></div>`;
        }).join('');
        const css = `<style>.arena-timeline-popup .arenas-container { display: flex; flex-direction: column-reverse; gap: 20px; padding: 10px; } .arena-timeline-popup .arena-card { display: flex; align-items: flex-start; gap: 15px; padding: 15px; background-color: #fff; border: 1px solid var(--color-border); border-radius: 12px; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.05); } .arena-timeline-popup .path-connector { flex: 0 0 60px; display: flex; flex-direction: column; align-items: center; position: relative; align-self: stretch; } .arena-timeline-popup .path-connector::before { content: ''; position: absolute; top: 0; bottom: 0; left: 50%; transform: translateX(-50%); width: 3px; background-image: linear-gradient(to bottom, #ccc 50%, transparent 50%); background-size: 1px 10px; } .arena-timeline-popup .arenas-container .arena-card:last-child .path-connector::before { height: 40px; top: auto; bottom: 0; } .arena-timeline-popup .arenas-container .arena-card:first-child .path-connector::before { height: calc(100% - 40px); top: 40px; } .arena-timeline-popup .trophy-marker { display: flex; flex-direction: column; align-items: center; background-color: var(--color-background); padding: 5px 0; z-index: 1; } .arena-timeline-popup .trophy-marker .icon { font-size: 24px; color: #aaa; } .arena-timeline-popup .trophy-marker .trophy-count { font-weight: bold; font-size: 14px; color: #777; } .arena-timeline-popup .arena-content { flex: 1; } .arena-timeline-popup .arena-image-wrapper { position: relative; margin-bottom: 10px; } .arena-timeline-popup .arena-image { width: 100%; border-radius: 8px; display: block; } .arena-timeline-popup .arena-info h2 { font-family: var(--font-title); font-size: 1.5em; margin-bottom: 8px; } .arena-timeline-popup .unlocks-section h3 { font-size: 0.8em; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 5px; } .arena-timeline-popup .schools-list { font-size: 0.9em; color: #555; } .arena-timeline-popup .arena-card.locked { opacity: 0.7; } .arena-timeline-popup .arena-card.locked .arena-image { filter: grayscale(100%) brightness(0.6); } .arena-timeline-popup .arena-card.locked .arena-info h2 { color: #999; } .arena-timeline-popup .lock-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 48px; color: rgba(255, 255, 255, 0.8); } .arena-timeline-popup .arena-card.current { border-color: var(--color-accent); box-shadow: 0 0 15px rgba(212, 160, 23, 0.5); } .arena-timeline-popup .arena-card.current .trophy-marker .icon, .arena-timeline-popup .arena-card.current .trophy-marker .trophy-count { color: var(--color-accent); font-weight: bold; } .arena-timeline-popup .current-marker { background-color: var(--color-accent); color: white; font-weight: bold; padding: 4px 10px; border-radius: 20px; font-size: 0.8em; margin-bottom: 10px; display: inline-block; } .arena-timeline-popup .arena-card.unlocked .trophy-marker .icon { color: var(--color-primary); } </style>`;
        return `${css}<div class="arena-timeline-popup"><div class="arenas-container">${arenasHTML}</div></div>`;
    }

    _renderLevelXpPopup() {
        // ... (código original sem alterações)
        const winRate = gameState.totalDebates > 0 ? ((gameState.wins / gameState.totalDebates) * 100).toFixed(1) : 0;
        return `<div class="level-xp-popup"><div class="popup-card"><h4>Progresso Atual</h4><div class="xp-bar-popup"><div class="xp-fill-popup" style="width: ${(gameState.xp / gameState.xpMax) * 100}%"></div><span class="xp-text">${gameState.xp} / ${gameState.xpMax} XP</span></div><p class="xp-remaining">Faltam ${gameState.xpMax - gameState.xp} XP para o próximo nível.</p></div><div class="popup-card"><h4>Recompensas do Nível ${gameState.level + 1}</h4><ul class="rewards-list"><li><i class="fas fa-coins"></i> +500 Ouro</li><li><i class="fas fa-scroll"></i> +100 Pergaminhos</li><li><i class="fas fa-unlock-alt"></i> Nova Arena Desbloqueada</li></ul></div><div class="popup-card"><h4>Estatísticas de Batalha</h4><div class="stats-grid"><div class="stat-item"><span>Vitórias</span><strong>${gameState.wins}</strong></div><div class="stat-item"><span>Derrotas</span><strong>${gameState.totalDebates - gameState.wins}</strong></div><div class="stat-item"><span>Coroas</span><strong>${gameState.crowns}</strong></div><div class="stat-item"><span>Taxa de Vit.</span><strong>${winRate}%</strong></div><div class="stat-item"><span>Filósofo Fav.</span><strong>Platão</strong></div><div class="stat-item"><span>Escola Fav.</span><strong>Grega</strong></div></div></div></div>`;
    }

    _renderFullProfilePopup() {
        // ... (código original sem alterações)
        const winRate = gameState.totalDebates > 0 ? ((gameState.wins / gameState.totalDebates) * 100).toFixed(1) : 0;
        return `<div class="profile-popup"><div class="profile-main-info"><div class="profile-avatar-container"><img src="assets/avatars/socrates.png" alt="Avatar" class="profile-avatar"><button class="avatar-change-btn"><i class="fas fa-pencil-alt"></i></button></div><div class="profile-details"><h3>${gameState.playerName}</h3><div class="profile-sub-details"><span><i class="fas fa-shield-alt"></i> ${gameState.clanName}</span><span><i class="fas fa-trophy"></i> ${gameState.trophies} Troféus</span></div></div></div><div class="profile-tabs"><button class="tab-btn active" data-tab="stats">Perfil</button><button class="tab-btn" data-tab="battles">Debates</button><button class="tab-btn" data-tab="friends">Amigos</button></div><div class="tab-content-container"><div class="tab-content active" id="stats-content"><div class="stats-grid"><div class="stat-item"><span>Vitórias</span><strong>${gameState.wins}</strong></div><div class="stat-item"><span>Vitórias 3 Coroas</span><strong>${gameState.threeCrownWins || 0}</strong></div><div class="stat-item"><span>Total Debates</span><strong>${gameState.totalDebates}</strong></div><div class="stat-item"><span>Taxa de Vit.</span><strong>${winRate}%</strong></div><div class="stat-item"><span>Filósofo Favorito</span><strong>Platão</strong></div><div class="stat-item"><span>Doações de Cartas</span><strong>${gameState.donations || 0}</strong></div></div></div><div class="tab-content" id="battles-content"><p>Histórico de debates aparecerá aqui.</p></div><div class="tab-content" id="friends-content"><p>Lista de amigos e convites.</p></div></div></div>`;
    }

    _renderSettingsPopup() {
        // ... (código original sem alterações)
        return `<div class="settings-popup"><div class="settings-section"><h4><i class="fas fa-volume-up"></i> Áudio</h4><div class="setting-item"><span>Música</span><div class="range-slider"><input type="range" min="0" max="100" value="80"></div></div><div class="setting-item"><span>Efeitos Sonoros</span><div class="range-slider"><input type="range" min="0" max="100" value="100"></div></div></div><div class="settings-section"><h4><i class="fas fa-user-circle"></i> Conta</h4><button class="action-button-secondary"><i class="fab fa-google"></i> Vincular ao Google</button><button class="action-button-secondary"><i class="fab fa-facebook"></i> Vincular ao Facebook</button></div><div class="settings-section"><h4><i class="fas fa-info-circle"></i> Outros</h4><button id="fullscreen-btn" class="action-button-secondary"><i class="fas fa-expand"></i> <span>Tela Cheia</span></button><button class="action-button-secondary">Termos de Serviço</button><button class="action-button-secondary">Política de Privacidade</button><button id="logout-btn" class="action-button red">Sair da Conta</button></div></div>`;
    }

    _renderChestInfoPopup(chest) {
        // ... (código original sem alterações)
        const formatTime = (s) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return `${h}h ${m}m`; };
        return `<div class="chest-info-popup"><img src="assets/chests/${chest.type.toLowerCase().replace(' ', '-')}.png" alt="${chest.type}" class="chest-info-image"><p class="chest-arena-text">Obtido na Arena ${chest.arena}</p><div class="chest-unlock-info"><i class="fas fa-clock"></i><span>Tempo para estudar: <strong>${formatTime(chest.totalTime)}</strong></span></div><h4>Recompensas Possíveis</h4><div class="possible-rewards"><span><i class="fas fa-scroll"></i> Pergaminhos</span><span><i class="fas fa-book"></i> Livros</span><span><i class="fas fa-users"></i> Novos Filósofos</span></div></div>`;
    }

    _renderTimedChestInfoPopup(type) {
        // ... (código original sem alterações)
        const chest = type === 'free' ? gameState.timers.freeChest : gameState.timers.crownChest;
        const isReady = chest <= 0;
        const formatTime = (s) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60; return h > 0 ? `${h}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}` : `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`; };
        const info = { free: { icon: 'fa-box-open', desc: 'Um baú com conceitos e recursos básicos, disponível a cada 4 horas.'}, crown: { icon: 'fa-crown', desc: 'Vença debates e colete 10 coroas para abrir este baú com recompensas superiores!'} };
        return `<div class="timed-chest-popup"><i class="fas ${info[type].icon} chest-icon"></i><p>${info[type].desc}</p>${isReady ? `<button class="action-button">Coletar Agora!</button>` : `<div class="timed-chest-timer">Próximo em: <strong>${formatTime(chest)}</strong></div>` }</div>`;
    }

    // --- LISTENERS INTERNOS: ADIÇÃO DA LÓGICA DO MÓDULO DE ESTUDO ---

    _addInternalListeners(popupId, data) {

        if (popupId === 'philosopher-study-module') {
            this._setupStudyModuleListeners(data.philosopherId);
        }

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
                    toast.show(`Aprimorando ${PHILOSOPHERS_DATA[data.philosopherId].name}...`, 'success');
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
    
    // --- LÓGICA DE INTERAÇÃO DO MÓDULO DE ESTUDO ---
    
    _setupStudyModuleListeners(philosopherId) {
        const module = this.bodyElement.querySelector('.study-module');
        const contentArea = this.bodyElement.querySelector('#study-content-area');
        const navigation = this.bodyElement.querySelector('#study-navigation');
        const tabs = this.bodyElement.querySelectorAll('.study-tabs .tab-btn');

        const updatePage = (pageNumber) => {
            const studyData = STUDY_CONTENT_DATA[philosopherId];
            const totalPages = studyData.totalPages;
            
            // Valida a página
            let newPage = Math.max(1, Math.min(pageNumber, totalPages));
            module.dataset.currentPage = newPage;
            
            // Renderiza conteúdo
            contentArea.innerHTML = studyData.pages[newPage] || `<p>Conteúdo para esta página ainda não foi escrito.</p>`;
            
            // Salva progresso
            gameState.studyProgress[philosopherId].pagesViewed.add(newPage);
            
            // Atualiza UI
            const progress = gameState.studyProgress[philosopherId];
            const percentage = Math.floor((progress.pagesViewed.size / totalPages) * 100);
            this.bodyElement.querySelector('#study-progress-text').textContent = percentage;
            this.bodyElement.querySelector('#study-progress-fill').style.width = `${percentage}%`;
            this.bodyElement.querySelector('#study-page-counter').textContent = `Página ${newPage} de ${totalPages}`;
            
            // Atualiza botões
            this.bodyElement.querySelector('#study-prev-btn').disabled = (newPage === 1);
            this.bodyElement.querySelector('#study-next-btn').disabled = (newPage === totalPages);
        };
        
        const showTableOfContents = () => {
            const studyData = STUDY_CONTENT_DATA[philosopherId];
            const tocHTML = Object.entries(studyData.tableOfContents).map(([page, title]) => 
                `<li data-page="${page}"><strong>Pág. ${page}:</strong> ${title}</li>`
            ).join('');
            contentArea.innerHTML = `<ul class="toc-list">${tocHTML}</ul>`;
            
            contentArea.querySelectorAll('.toc-list li').forEach(item => {
                item.addEventListener('click', (e) => {
                    const page = parseInt(e.currentTarget.dataset.page);
                    // Retorna para a aba de teoria e pula para a página
                    tabs.forEach(t => t.classList.remove('active'));
                    this.bodyElement.querySelector('.tab-btn[data-tab="theory"]').classList.add('active');
                    navigation.style.display = 'flex';
                    updatePage(page);
                });
            });
        };
        
        // Listeners dos botões de navegação
        navigation.querySelector('#study-prev-btn').addEventListener('click', () => {
            let currentPage = parseInt(module.dataset.currentPage);
            updatePage(currentPage - 1);
        });
        
        navigation.querySelector('#study-next-btn').addEventListener('click', () => {
            let currentPage = parseInt(module.dataset.currentPage);
            updatePage(currentPage + 1);
        });

        navigation.querySelector('#study-toc-btn').addEventListener('click', showTableOfContents);

        // Listeners das abas
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const tabType = tab.dataset.tab;
                navigation.style.display = (tabType === 'theory') ? 'flex' : 'none';

                if (tabType === 'theory') {
                    updatePage(parseInt(module.dataset.currentPage));
                } else if (tabType === 'quiz') {
                    contentArea.innerHTML = `<div class="quiz-question">O sistema de Quiz está em desenvolvimento!</div>`;
                } else if (tabType === 'comic') {
                    const comicPanels = STUDY_CONTENT_DATA[philosopherId].comic.map(panelUrl => `<img src="${panelUrl}" alt="Painel da HQ">`).join('');
                    contentArea.innerHTML = `<div class="comic-grid">${comicPanels}</div>`;
                }
            });
        });
        
        // Carrega a primeira página ao abrir
        updatePage(1);
    }
    
    _setupFullscreenButton() { 
            const fullscreenButton = document.getElementById('fullscreen-btn');
            if (!fullscreenButton) return;
            const buttonIcon = fullscreenButton.querySelector('i');
            const buttonText = fullscreenButton.querySelector('span');
            function updateButtonUI() {
                if (document.fullscreenElement) {
                    buttonIcon.classList.remove('fa-expand'); buttonIcon.classList.add('fa-compress');
                    buttonText.textContent = 'Sair da Tela Cheia';
                } else {
                    buttonIcon.classList.remove('fa-compress'); buttonIcon.classList.add('fa-expand');
                    buttonText.textContent = 'Tela Cheia';
                }
            }
            fullscreenButton.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => console.error(`Erro: ${err.message}`));
                } else {
                    document.exitFullscreen();
                }
            });
            document.addEventListener('fullscreenchange', updateButtonUI);
            updateButtonUI();
    }
}

export const popupManager = new PopupManager();