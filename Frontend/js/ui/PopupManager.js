
import { gameState } from '../data/gameState.js';
import { arenas } from '../data/arenas.js';
import { toast } from './Toast.js';
import { PHILOSOPHERS_DATA } from '../data/philosophers.js';
import { CONCEPTS_DATA, CONCEPTS_DATA_1 } from '../data/concepts.js';

// --- IMPORTANTE ---
// Presume-se a existência de um novo arquivo de dados para o conteúdo de estudo aprofundado.
// Crie este arquivo em: /data/study_content.js
import { STUDY_CONTENT_DATA } from '../data/study_content.js';


/**
 * Manages the display and interaction of modal popups in the application.
 * Handles opening, closing, and rendering specific popup content.
 */
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

    /**
     * Opens a specific popup with provided data.
     * @param {string} popupId - The unique identifier for the popup type (e.g., 'philosopher-details').
     * @param {Object} [data={}] - Data required to render the popup content.
     */
    open(popupId, data = {}) {
        let title = '';
        let contentHTML = '';

        // --- BIBLIOTECA (Seu arquivo principal) ---
        if (popupId === 'philosopher-study-module') {
            const philosopherStudy = PHILOSOPHERS_DATA[data.philosopherId];
            // ... validações ...

            // MUDANÇA: Envie NULL ou VAZIO para não gerar o texto duplicado no topo
            title = null;

            contentHTML = this._renderPhilosopherStudyModulePopup(data.philosopherId);
        }
        // --- FILÓSOFOS ---
        else if (popupId === 'philosopher-details') {
            const philosopher = PHILOSOPHERS_DATA[data.philosopherId];
            if (!philosopher) {
                console.error(`Filósofo com ID ${data.philosopherId} não encontrado.`);
                return;
            }
            title = philosopher.name;
            contentHTML = this._renderPhilosopherCardPopup(philosopher, data.philosopherState);
        }
        // --- PERFIL ---
        else if (popupId === 'full-profile') {
            title = 'Perfil do Filósofo';
            contentHTML = this._renderFullProfilePopup();
        } else if (popupId === 'level-xp') {
            title = `Nível ${gameState.level} - Progresso`;
            contentHTML = this._renderLevelXpPopup();
        }
        // --- GERAL / CONFIGURAÇÕES ---
        else if (popupId === 'settings') {
            title = 'Configurações';
            contentHTML = this._renderSettingsPopup();
        }
        // --- DEBATER (ARENA) ---
        else if (popupId === 'chest-rewards') {
            title = `Recompensas da Obra "${data.chestType}"`;
            contentHTML = this._renderChestRewardsPopup(data.rewards);
        } else if (popupId === 'arena-timeline') {
            title = 'Jornada Filosófica';
            contentHTML = this._renderArenaTimelinePopup();
        } else if (popupId === 'chest-info') {
            title = `Obra: ${data.chest.type}`;
            contentHTML = this._renderChestInfoPopup(data.chest);
        } else if (popupId === 'timed-chest-info') {
            title = data.type === 'free' ? 'Conceito Grátis' : 'Coroa da Sabedoria';
            contentHTML = this._renderTimedChestInfoPopup(data.type);
        }
        // --- REELS ---
        else if (popupId === 'reels-settings') {
            title = 'Configurações do Reels';
            contentHTML = this._renderReelsSettingsPopup();
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

    // ==================================================================================
    // --- SEÇÃO: BIBLIOTECA ---
    // ==================================================================================

    _renderPhilosopherStudyModulePopup(philosopherId) {
        const studyData = STUDY_CONTENT_DATA[philosopherId];
        const philosopher = PHILOSOPHERS_DATA[philosopherId];

        // Lógica de Progresso
        if (!gameState.studyProgress) gameState.studyProgress = {};
        if (!gameState.studyProgress[philosopherId]) gameState.studyProgress[philosopherId] = { pagesViewed: new Set() };
        const progress = gameState.studyProgress[philosopherId];
        const percentage = Math.floor((progress.pagesViewed.size / studyData.totalPages) * 100);

        const css = `
            <style>
                /* Container Raiz - Ocupa 100% do espaço do popup pai */
                .study-module-root {
                    display: flex; flex-direction: column;
                    height: 100%; width: 100%;
                    background: #f9f9f9;
                    font-family: 'Lato', sans-serif;
                    overflow: hidden;
                    /* Removemos bordas arredondadas aqui para preencher o modal completamente */
                }

                /* --- 1. HEADER PRINCIPAL --- */
                .study-header {
                    background: #fff;
                    border-bottom: 1px solid #e0e0e0;
                    padding: 0.8rem 1rem;
                    display: flex; align-items: center; justify-content: space-between;
                    flex-shrink: 0; z-index: 20;
                }
                .header-left { display: flex; align-items: center; gap: 10px; }
                .header-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #3e2723; }
                .header-title h3 { margin: 0; color: #3e2723; font-size: 1rem; font-weight: 700; }
                .header-xp { font-size: 0.75rem; color: #8d6e63; }

                /* Abas Integradas no Header (lado direito) */
                .header-tabs { display: flex; gap: 5px; background: #f5f5f5; padding: 4px; border-radius: 8px; }
                .tab-btn {
                    border: none; background: none; padding: 6px 12px; border-radius: 6px;
                    font-size: 0.85rem; font-weight: 600; color: #757575; cursor: pointer; transition: 0.2s;
                }
                .tab-btn.active { background: #fff; color: #3e2723; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }

                /* --- 2. BARRA DE FERRAMENTAS (Contextual) --- */
                .study-toolbar {
                    background: #fff; border-bottom: 1px solid #eee;
                    padding: 0.5rem 1rem; display: flex; justify-content: center; gap: 1.5rem;
                    flex-shrink: 0; align-items: center;
                    height: 40px;
                }
                .tool-group { display: flex; align-items: center; gap: 10px; }
                .tool-btn {
                    background: #f0f0f0; border: none; width: 28px; height: 28px; border-radius: 4px;
                    display: flex; align-items: center; justify-content: center; cursor: pointer; color: #333;
                }
                .tool-btn:hover { background: #e0e0e0; }
                .tool-label { font-size: 0.8rem; color: #666; font-weight: 600; min-width: 40px; text-align: center; }

                /* --- 3. ÁREA DE CONTEÚDO --- */
                .study-viewport {
                    flex: 1; position: relative; overflow: hidden; background: #f9f9f9;
                }
                
                /* Scroll interno para Texto */
                .text-scroll-area {
                    height: 100%; overflow-y: auto; padding: 2rem 1rem;
                    display: flex; justify-content: center;
                }
                .text-content {
                    max-width: 700px; width: 100%; background: #fff; 
                    padding: 3rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    transition: font-size 0.2s ease; /* Suaviza mudança de fonte */
                }
                
                /* Área da HQ (Fundo Branco + Zoom) */
                .comic-scroll-area {
                    height: 100%; width: 100%; overflow: auto; /* Permite scroll se der zoom */
                    background: #ffffff; /* FUNDO BRANCO PEDIDO */
                    display: flex; align-items: flex-start; justify-content: center;
                    padding: 1rem;
                }
                .comic-img-wrapper {
                    transition: transform 0.2s ease-out; /* Suaviza zoom */
                    transform-origin: top center;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                .comic-img { display: block; max-width: 100%; height: auto; }

                /* --- 4. RODAPÉ --- */
                .study-footer {
                    background: #fff; border-top: 1px solid #e0e0e0; padding: 0.8rem 1.5rem;
                    display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
                }
                .nav-btn {
                    background: #3e2723; color: #fff; border: none; padding: 0.6rem 1.2rem; border-radius: 4px;
                    font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px;
                }
                .nav-btn:disabled { background: #ccc; cursor: not-allowed; }
                .nav-btn.secondary { background: #fff; border: 1px solid #ccc; color: #555; }

                /* Mobile Adjustments */
                @media (max-width: 600px) {
                    .text-content { padding: 1.5rem; }
                    .study-header { flex-direction: column; gap: 10px; align-items: stretch; }
                    .header-left { justify-content: center; }
                    .header-tabs { justify-content: center; }
                }
            </style>
        `;

        return `
            ${css}
            <div class="study-module-root" id="study-root">
                
                <!-- HEADER -->
                <header class="study-header">
                    <div class="header-left">
                        <img src="${studyData.realImage}" class="header-avatar">
                        <div class="header-title">
                            <h3>${philosopher.name}</h3>
                            <span class="header-xp">${percentage}% Concluído</span>
                        </div>
                    </div>
                    <div class="header-tabs">
                        <button class="tab-btn active" data-tab="theory">Teoria</button>
                        <button class="tab-btn" data-tab="comic">HQ</button>
                        <button class="tab-btn" data-tab="quiz">Quiz</button>
                    </div>
                </header>

                <!-- TOOLBAR (Muda conforme a aba) -->
                <div class="study-toolbar" id="study-toolbar">
                    <!-- Injetado via JS -->
                </div>

                <!-- VIEWPORT -->
                <main class="study-viewport" id="study-viewport">
                    <!-- Conteúdo Injetado via JS -->
                </main>

                <!-- FOOTER -->
                <footer class="study-footer" id="study-footer">
                    <button class="nav-btn secondary" id="btn-prev">Anterior</button>
                    <span id="page-indicator" style="font-size:0.9rem; font-weight:600; color:#555;">Página 1</span>
                    <button class="nav-btn" id="btn-next">Próxima <i class="fas fa-arrow-right"></i></button>
                </footer>
            </div>
        `;
    }

    _setupStudyModuleListeners(philosopherId) {
        const root = this.bodyElement.querySelector('#study-root');
        if (!root) return;

        const studyData = STUDY_CONTENT_DATA[philosopherId];
        const viewport = root.querySelector('#study-viewport');
        const toolbar = root.querySelector('#study-toolbar');

        // Estado
        let state = {
            tab: 'theory',
            textPage: 1,
            comicIndex: 0,
            // Configurações de Usuário
            textSize: 16, // px
            fontFamily: 'serif', // serif ou sans
            zoomLevel: 1.0 // 100%
        };

        // --- RENDERIZADORES DE TOOLBAR ---

        const renderTheoryToolbar = () => {
            toolbar.innerHTML = `
                <div class="tool-group">
                    <span class="tool-label">Fonte:</span>
                    <button class="tool-btn" id="cmd-font-serif" style="font-family:serif; font-weight:bold;">T</button>
                    <button class="tool-btn" id="cmd-font-sans" style="font-family:sans-serif;">T</button>
                </div>
                <div class="tool-group" style="margin-left: 20px;">
                    <span class="tool-label">Tamanho:</span>
                    <button class="tool-btn" id="cmd-size-down"><i class="fas fa-minus"></i></button>
                    <span class="tool-label" id="lbl-size">${state.textSize}px</span>
                    <button class="tool-btn" id="cmd-size-up"><i class="fas fa-plus"></i></button>
                </div>
            `;

            // Listeners da Toolbar de Texto
            root.querySelector('#cmd-font-serif').onclick = () => { state.fontFamily = 'serif'; updateTextStyle(); };
            root.querySelector('#cmd-font-sans').onclick = () => { state.fontFamily = 'sans'; updateTextStyle(); };
            root.querySelector('#cmd-size-up').onclick = () => { if (state.textSize < 24) state.textSize += 2; updateTextStyle(); };
            root.querySelector('#cmd-size-down').onclick = () => { if (state.textSize > 12) state.textSize -= 2; updateTextStyle(); };
        };

        const renderComicToolbar = () => {
            toolbar.innerHTML = `
                <div class="tool-group">
                    <span class="tool-label">Zoom:</span>
                    <button class="tool-btn" id="cmd-zoom-out"><i class="fas fa-search-minus"></i></button>
                    <span class="tool-label" id="lbl-zoom">${Math.round(state.zoomLevel * 100)}%</span>
                    <button class="tool-btn" id="cmd-zoom-in"><i class="fas fa-search-plus"></i></button>
                    <button class="tool-btn" id="cmd-zoom-reset" title="Resetar"><i class="fas fa-compress"></i></button>
                </div>
            `;

            // Listeners da Toolbar de HQ
            root.querySelector('#cmd-zoom-in').onclick = () => {
                if (state.zoomLevel < 2.5) state.zoomLevel += 0.25;
                updateComicZoom();
            };
            root.querySelector('#cmd-zoom-out').onclick = () => {
                if (state.zoomLevel > 0.5) state.zoomLevel -= 0.25;
                updateComicZoom();
            };
            root.querySelector('#cmd-zoom-reset').onclick = () => {
                state.zoomLevel = 1.0;
                updateComicZoom();
            };
        };

        // --- ATUALIZADORES VISUAIS ---

        const updateTextStyle = () => {
            const textContent = root.querySelector('.text-content');
            const label = root.querySelector('#lbl-size');
            if (textContent && label) {
                textContent.style.fontSize = `${state.textSize}px`;
                textContent.style.fontFamily = state.fontFamily === 'serif' ? "'Merriweather', serif" : "'Lato', sans-serif";
                label.textContent = `${state.textSize}px`;

                // Destaque visual nos botões
                const btnSerif = root.querySelector('#cmd-font-serif');
                const btnSans = root.querySelector('#cmd-font-sans');
                btnSerif.style.background = state.fontFamily === 'serif' ? '#d7ccc8' : '#f0f0f0';
                btnSans.style.background = state.fontFamily === 'sans' ? '#d7ccc8' : '#f0f0f0';
            }
        };

        const updateComicZoom = () => {
            const imgWrapper = root.querySelector('.comic-img-wrapper');
            const label = root.querySelector('#lbl-zoom');
            if (imgWrapper && label) {
                imgWrapper.style.transform = `scale(${state.zoomLevel})`;
                // Ajusta margem para permitir scroll quando zoom aumenta
                imgWrapper.style.margin = state.zoomLevel > 1 ? `${(state.zoomLevel - 1) * 10}rem` : '0';
                label.textContent = `${Math.round(state.zoomLevel * 100)}%`;
            }
        };

        // --- RENDERIZAÇÃO DE CONTEÚDO PRINCIPAL ---

        const renderContent = () => {
            const footer = root.querySelector('#study-footer');
            const pageInd = root.querySelector('#page-indicator');
            const btnPrev = root.querySelector('#btn-prev');
            const btnNext = root.querySelector('#btn-next');

            if (state.tab === 'theory') {
                renderTheoryToolbar();
                footer.style.display = 'flex';

                const html = studyData.pages[state.textPage];
                viewport.innerHTML = `
                    <div class="text-scroll-area">
                        <div class="text-content animate__animated animate__fadeIn">
                            ${html}
                        </div>
                    </div>
                `;
                updateTextStyle(); // Aplica configs salvas

                pageInd.textContent = `Página ${state.textPage} de ${studyData.totalPages}`;
                btnPrev.disabled = state.textPage === 1;
                btnNext.innerHTML = state.textPage === studyData.totalPages ? 'Concluir' : 'Próxima <i class="fas fa-arrow-right"></i>';

                // Salva progresso
                gameState.studyProgress[philosopherId].pagesViewed.add(state.textPage);

            } else if (state.tab === 'comic') {
                renderComicToolbar();
                footer.style.display = 'flex';
                const comics = studyData.comic || [];

                if (comics.length > 0) {
                    viewport.innerHTML = `
                        <div class="comic-scroll-area">
                            <div class="comic-img-wrapper">
                                <img src="${comics[state.comicIndex]}" class="comic-img" alt="HQ">
                            </div>
                        </div>
                    `;
                    // Reseta zoom ao mudar de página, ou mantém? Geralmente resetar é melhor UX ao trocar de img
                    state.zoomLevel = 1.0;
                    updateComicZoom();
                } else {
                    viewport.innerHTML = '<div style="padding:2rem; text-align:center;">Sem HQ.</div>';
                }

                pageInd.textContent = `Quadro ${state.comicIndex + 1} de ${comics.length}`;
                btnPrev.disabled = state.comicIndex === 0;
                btnNext.innerHTML = state.comicIndex === comics.length - 1 ? 'Fim' : 'Próxima <i class="fas fa-arrow-right"></i>';

            } else {
                // Quiz
                toolbar.innerHTML = ''; // Sem toolbar pro quiz
                footer.style.display = 'none';
                viewport.innerHTML = '<div style="display:flex; height:100%; align-items:center; justify-content:center; color:#aaa;">Quiz em breve</div>';
            }
        };

        // --- LISTENERS DE NAVEGAÇÃO ---

        // Abas
        root.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                root.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.tab = btn.dataset.tab;
                renderContent();
            });
        });

        // Botões Rodapé
        root.querySelector('#btn-prev').addEventListener('click', () => {
            if (state.tab === 'theory' && state.textPage > 1) {
                state.textPage--;
                renderContent();
            } else if (state.tab === 'comic' && state.comicIndex > 0) {
                state.comicIndex--;
                renderContent();
            }
        });

        root.querySelector('#btn-next').addEventListener('click', () => {
            if (state.tab === 'theory') {
                if (state.textPage < studyData.totalPages) {
                    state.textPage++;
                    renderContent();
                } else {
                    // Fecha popup se concluir
                    const closeBtn = this.bodyElement.querySelector('.popup-overlay');
                    if (closeBtn) closeBtn.remove();
                }
            } else if (state.tab === 'comic') {
                const comics = studyData.comic || [];
                if (state.comicIndex < comics.length - 1) {
                    state.comicIndex++;
                    renderContent();
                }
            }
        });

        // Inicializa
        renderContent();
    }

    _handleLibraryListeners(data) {
        this._setupStudyModuleListeners(data.philosopherId);
    }

    // ==================================================================================
    // --- SEÇÃO: FILÓSOFOS ---
    // ==================================================================================

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

    _handlePhilosophersListeners(data) {
        const upgradeBtn = this.bodyElement.querySelector('#upgrade-philosopher-btn');
        if (upgradeBtn && !upgradeBtn.classList.contains('disabled')) {
            upgradeBtn.addEventListener('click', () => {
                toast.show(`Aprimorando ${PHILOSOPHERS_DATA[data.philosopherId].name}...`, 'success');
                this.close();
            });
        }
    }

    // ==================================================================================
    // --- SEÇÃO: DEBATER (ARENA) ---
    // ==================================================================================

    _renderArenaTimelinePopup() {
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

    _renderChestInfoPopup(chest) {
        const formatTime = (s) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return `${h}h ${m}m`; };
        return `<div class="chest-info-popup"><img src="assets/chests/${chest.type.toLowerCase().replace(' ', '-')}.png" alt="${chest.type}" class="chest-info-image"><p class="chest-arena-text">Obtido na Arena ${chest.arena}</p><div class="chest-unlock-info"><i class="fas fa-clock"></i><span>Tempo para estudar: <strong>${formatTime(chest.totalTime)}</strong></span></div><h4>Recompensas Possíveis</h4><div class="possible-rewards"><span><i class="fas fa-scroll"></i> Pergaminhos</span><span><i class="fas fa-book"></i> Livros</span><span><i class="fas fa-users"></i> Novos Filósofos</span></div></div>`;
    }

    _renderTimedChestInfoPopup(type) {
        const chest = type === 'free' ? gameState.timers.freeChest : gameState.timers.crownChest;
        const isReady = chest <= 0;
        const formatTime = (s) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60; return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}` : `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`; };
        const info = { free: { icon: 'fa-box-open', desc: 'Um baú com conceitos e recursos básicos, disponível a cada 4 horas.' }, crown: { icon: 'fa-crown', desc: 'Vença debates e colete 10 coroas para abrir este baú com recompensas superiores!' } };
        return `<div class="timed-chest-popup"><i class="fas ${info[type].icon} chest-icon"></i><p>${info[type].desc}</p>${isReady ? `<button class="action-button">Coletar Agora!</button>` : `<div class="timed-chest-timer">Próximo em: <strong>${formatTime(chest)}</strong></div>`}</div>`;
    }

    _renderChestRewardsPopup(rewards) {
        // Implementação básica se não existir
        return `<div>Recompensas: ${JSON.stringify(rewards)}</div>`;
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

    _handleDebateListeners(data) {
        // Listeners específicos para a área de debate/arena
    }

    // ==================================================================================
    // --- SEÇÃO: REELS ---
    // ==================================================================================

    _renderReelsSettingsPopup() {
        return `
            <div class="reels-settings-popup">
                <div class="settings-section">
                    <h4><i class="fas fa-history"></i> Histórico de Reels</h4>
                    <p>Limpe seu histórico de reels para vê-los novamente.</p>
                    <button id="clear-reels-history-btn" class="action-button red">Limpar Histórico</button>
                </div>
            </div>
        `;
    }

    _handleReelsListeners(data) {
        // Listener para limpar histórico de reels
        const clearBtn = this.bodyElement.querySelector('#clear-reels-history-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                // Lógica para limpar histórico (exemplo)
                if (gameState.reelsHistory) {
                    gameState.reelsHistory = [];
                    toast.show('Histórico de Reels limpo!', 'success');
                } else {
                    toast.show('Histórico já está vazio.', 'info');
                }
                this.close();
            });
        }
    }

    // ==================================================================================
    // --- SEÇÃO: ESCOLAS ---
    // ==================================================================================

    // Espaço reservado para futuros popups relacionados às Escolas de Pensamento

    // ==================================================================================
    // --- SEÇÃO: PERFIL ---
    // ==================================================================================

    _renderFullProfilePopup() {
        const winRate = gameState.totalDebates > 0 ? ((gameState.wins / gameState.totalDebates) * 100).toFixed(1) : 0;
        return `<div class="profile-popup"><div class="profile-main-info"><div class="profile-avatar-container"><img src="assets/avatars/socrates.png" alt="Avatar" class="profile-avatar"><button class="avatar-change-btn"><i class="fas fa-pencil-alt"></i></button></div><div class="profile-details"><h3>${gameState.playerName}</h3><div class="profile-sub-details"><span><i class="fas fa-shield-alt"></i> ${gameState.clanName}</span><span><i class="fas fa-trophy"></i> ${gameState.trophies} Troféus</span></div></div></div><div class="profile-tabs"><button class="tab-btn active" data-tab="stats">Perfil</button><button class="tab-btn" data-tab="battles">Debates</button><button class="tab-btn" data-tab="friends">Amigos</button></div><div class="tab-content-container"><div class="tab-content active" id="stats-content"><div class="stats-grid"><div class="stat-item"><span>Vitórias</span><strong>${gameState.wins}</strong></div><div class="stat-item"><span>Vitórias 3 Coroas</span><strong>${gameState.threeCrownWins || 0}</strong></div><div class="stat-item"><span>Total Debates</span><strong>${gameState.totalDebates}</strong></div><div class="stat-item"><span>Taxa de Vit.</span><strong>${winRate}%</strong></div><div class="stat-item"><span>Filósofo Favorito</span><strong>Platão</strong></div><div class="stat-item"><span>Doações de Cartas</span><strong>${gameState.donations || 0}</strong></div></div></div><div class="tab-content" id="battles-content"><p>Histórico de debates aparecerá aqui.</p></div><div class="tab-content" id="friends-content"><p>Lista de amigos e convites.</p></div></div></div>`;
    }

    _renderLevelXpPopup() {
        const winRate = gameState.totalDebates > 0 ? ((gameState.wins / gameState.totalDebates) * 100).toFixed(1) : 0;
        return `<div class="level-xp-popup"><div class="popup-card"><h4>Progresso Atual</h4><div class="xp-bar-popup"><div class="xp-fill-popup" style="width: ${(gameState.xp / gameState.xpMax) * 100}%"></div><span class="xp-text">${gameState.xp} / ${gameState.xpMax} XP</span></div><p class="xp-remaining">Faltam ${gameState.xpMax - gameState.xp} XP para o próximo nível.</p></div><div class="popup-card"><h4>Recompensas do Nível ${gameState.level + 1}</h4><ul class="rewards-list"><li><i class="fas fa-coins"></i> +500 Ouro</li><li><i class="fas fa-scroll"></i> +100 Pergaminhos</li><li><i class="fas fa-unlock-alt"></i> Nova Arena Desbloqueada</li></ul></div><div class="popup-card"><h4>Estatísticas de Batalha</h4><div class="stats-grid"><div class="stat-item"><span>Vitórias</span><strong>${gameState.wins}</strong></div><div class="stat-item"><span>Derrotas</span><strong>${gameState.totalDebates - gameState.wins}</strong></div><div class="stat-item"><span>Coroas</span><strong>${gameState.crowns}</strong></div><div class="stat-item"><span>Taxa de Vit.</span><strong>${winRate}%</strong></div><div class="stat-item"><span>Filósofo Fav.</span><strong>Platão</strong></div><div class="stat-item"><span>Escola Fav.</span><strong>Grega</strong></div></div></div></div>`;
    }

    _handleProfileListeners(data) {
        const tabs = this.bodyElement.querySelectorAll('.tab-btn');
        const contents = this.bodyElement.querySelectorAll('.tab-content');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                this.bodyElement.querySelector(`#${tab.dataset.tab}-content`).classList.add('active');
                if (tab.dataset.tab !== 'stats') {
                    toast.show('Funcionalidade em desenvolvimento!', 'info');
                }
            });
        });
        const avatarBtn = this.bodyElement.querySelector('.avatar-change-btn');
        if (avatarBtn) {
            avatarBtn.addEventListener('click', () => {
                toast.show('Customização de avatar em breve!', 'info');
            });
        }
    }

    // ==================================================================================
    // --- SEÇÃO: GERAL / CONFIGURAÇÕES ---
    // ==================================================================================

    _renderSettingsPopup() {
        return `<div class="settings-popup"><div class="settings-section"><h4><i class="fas fa-volume-up"></i> Áudio</h4><div class="setting-item"><span>Música</span><div class="range-slider"><input type="range" min="0" max="100" value="80"></div></div><div class="setting-item"><span>Efeitos Sonoros</span><div class="range-slider"><input type="range" min="0" max="100" value="100"></div></div></div><div class="settings-section"><h4><i class="fas fa-user-circle"></i> Conta</h4><button class="action-button-secondary"><i class="fab fa-google"></i> Vincular ao Google</button><button class="action-button-secondary"><i class="fab fa-facebook"></i> Vincular ao Facebook</button></div><div class="settings-section"><h4><i class="fas fa-info-circle"></i> Outros</h4><button id="fullscreen-btn" class="action-button-secondary"><i class="fas fa-expand"></i> <span>Tela Cheia</span></button><button class="action-button-secondary">Termos de Serviço</button><button class="action-button-secondary">Política de Privacidade</button><button id="logout-btn" class="action-button red">Sair da Conta</button></div></div>`;
    }

    _handleSettingsListeners(data) {
        this._setupFullscreenButton();
        const logoutBtn = this.bodyElement.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('isLoggedIn');
                window.location.href = 'login.html';
            });
        }
    }

    _addInternalListeners(popupId, data) {
        if (popupId === 'philosopher-study-module') {
            this._handleLibraryListeners(data);
        } else if (popupId === 'philosopher-details') {
            this._handlePhilosophersListeners(data);
        } else if (popupId === 'full-profile') {
            this._handleProfileListeners(data);
        } else if (popupId === 'settings') {
            this._handleSettingsListeners(data);
        } else if (popupId === 'reels-settings') {
            this._handleReelsListeners(data);
        } else if (['arena-timeline', 'chest-info', 'timed-chest-info', 'chest-rewards'].includes(popupId)) {
            this._handleDebateListeners(data);
        }
    }
}

export const popupManager = new PopupManager();