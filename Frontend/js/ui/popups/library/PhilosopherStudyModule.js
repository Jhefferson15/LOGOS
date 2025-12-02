// PhilosopherStudyModule.js
import { gameState } from '../../../data/gameState.js';
import { PHILOSOPHERS_DATA } from '../../../data/philosophers.js';
import { STUDY_CONTENT_DATA } from '../../../data/study_content.js';
import { ImageService } from '../../../services/ImageService.js';

// Sub-modules
import { StudyState } from './study/StudyState.js';
import { StudyTools } from './study/StudyTools.js';
import { StudySummary } from './study/StudySummary.js';
import { StudyTheory } from './study/StudyTheory.js';
import { StudyComic } from './study/StudyComic.js';
import { StudyQuiz } from './study/StudyQuiz.js';
import { FlashcardReviewModule } from './FlashcardReviewModule.js';

/**
 * Módulo para o popup de estudo aprofundado do filósofo (tela cheia).
 * Refatorado para usar arquitetura modular.
 */
export const PhilosopherStudyModulePopup = {
    title: null,

    /**
     * Gera o HTML do conteúdo do popup.
     */
    getHTML: (data) => {
        const philosopherId = data.philosopherId;
        const studyData = STUDY_CONTENT_DATA[philosopherId];
        const philosopher = PHILOSOPHERS_DATA[philosopherId];

        // Estado inicial para renderização (apenas leitura, sem efeitos colaterais)
        const state = StudyState.loadState(philosopherId);
        const percentage = StudyState.getProgressPercentage(philosopherId, studyData.totalPages);

        // --- CSS COMPLETO ---
        // Mantivemos o CSS aqui para garantir encapsulamento do popup, 
        // mas poderia ser movido para um arquivo .css separado.
        const css = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Lato:wght@400;700&display=swap');

                /* Reset e Base */
                .study-module-root { 
                    display: flex; flex-direction: column; height: 100%; width: 100%; 
                    background: #fdfbf7;
                    font-family: 'Lato', sans-serif; 
                    overflow: hidden; 
                    color: #3e2723;
                    position: relative;
                }

                /* Scrollbar */
                .study-module-root ::-webkit-scrollbar { width: 8px; height: 8px; }
                .study-module-root ::-webkit-scrollbar-track { background: transparent; }
                .study-module-root ::-webkit-scrollbar-thumb { 
                    background-color: #d7ccc8; border-radius: 10px; border: 2px solid transparent; background-clip: content-box; 
                }
                .study-module-root ::-webkit-scrollbar-thumb:hover { background-color: #a1887f; }

                /* Header */
                .study-header { 
                    background: #fff; border-bottom: 1px solid #efebe9; 
                    padding: 0.8rem 2rem; 
                    display: flex; align-items: center; justify-content: space-between; 
                    flex-shrink: 0; z-index: 20;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
                    min-height: 85px;
                }
                .header-left { display: flex; align-items: center; gap: 15px; }
                .header-avatar { 
                    width: 55px; height: 55px; border-radius: 50%; object-fit: cover; 
                    border: 2px solid #8d6e63; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                .header-title h3 { margin: 0; color: #3e2723; font-family: 'Cinzel', serif; font-size: 1.3rem; font-weight: 700; }
                .header-xp { 
                    font-size: 0.75rem; color: #fff; background: #8d6e63; padding: 2px 10px; border-radius: 10px;
                    display: inline-block; margin-top: 4px;
                }

                /* Abas Verticais */
                .header-tabs { display: flex; flex-direction: column; gap: 4px; align-items: flex-end; }
                .tab-btn { 
                    border: none; background: transparent; padding: 4px 12px; border-radius: 6px; 
                    font-size: 0.8rem; font-weight: 600; color: #757575; cursor: pointer; transition: all 0.2s ease; 
                    text-align: right; width: 100px;
                }
                .tab-btn:hover { color: #3e2723; background: rgba(0,0,0,0.03); }
                .tab-btn.active { background: #efebe9; color: #3e2723; box-shadow: 0 1px 3px rgba(0,0,0,0.08); font-weight: 700; }

                /* Toolbar */
                .study-toolbar { 
                    background: #fff; border-bottom: 1px solid #f0f0f0; padding: 0rem 1rem; height: 50px;
                    display: flex; justify-content: center; align-items: center; gap: 2rem; flex-shrink: 0; 
                }
                .tool-group { display: flex; align-items: center; gap: 8px; }
                .tool-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #9e9e9e; font-weight: bold; margin-right: 5px; }
                .tool-btn { 
                    background: transparent; border: 1px solid #e0e0e0; width: 32px; height: 32px; border-radius: 6px; 
                    display: flex; align-items: center; justify-content: center; cursor: pointer; color: #5d4037; transition: 0.2s;
                }
                .tool-btn:hover { background: #efebe9; border-color: #d7ccc8; color: #3e2723; }
                .tool-btn:active { transform: translateY(1px); }

                /* Viewport */
                .study-viewport { flex: 1; overflow: hidden; position: relative; }
                
                /* Estilos Específicos dos Módulos (Replicados para garantir funcionamento) */
                .text-scroll-area { height: 100%; overflow-y: auto; background: #fff; }
                .text-content-wrapper { width: 100%; min-height: 100%; display: flex; justify-content: center; background: #fff; }
                .text-content { max-width: 900px; width: 100%; background: #fff; padding: 0.1rem; box-sizing: border-box; color: #2c2c2c; line-height: 1.8; }
                
                .summary-container { height: 100%; overflow-y: auto; background: #fdfbf7; }
                .summary-content { max-width: 800px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
                .summary-content h2 { font-family: 'Cinzel', serif; color: #3e2723; margin-bottom: 1.5rem; border-bottom: 2px solid #efebe9; padding-bottom: 0.5rem; }
                .summary-list { list-style: none; padding: 0; margin: 0; }
                .summary-item { padding: 1rem; margin-bottom: 0.5rem; background: #fafafa; border-left: 4px solid #8d6e63; cursor: pointer; transition: all 0.2s ease; display: flex; justify-content: space-between; align-items: center; }
                .summary-item:hover { background: #efebe9; border-left-color: #5d4037; transform: translateX(5px); }
                .summary-item.viewed { border-left-color: #4caf50; }
                .summary-item-title { font-weight: 600; color: #3e2723; }
                .summary-item-page { font-size: 0.85rem; color: #757575; background: #e0e0e0; padding: 2px 8px; border-radius: 4px; }

                .comic-scroll-area { height: 100%; width: 100%; overflow: auto; background: #212121; display: flex; align-items: center; justify-content: center; }
                .comic-img-wrapper { transition: transform 0.2s ease-out; transform-origin: center center; box-shadow: 0 0 30px rgba(0,0,0,0.5); line-height: 0; }
                .comic-img { display: block; max-width: 90vw; max-height: 90vh; height: auto; width: auto; }
                .comic-zoomed .comic-img { max-width: none; max-height: none; }

                .quiz-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #8d6e63; gap: 1rem; background-image: radial-gradient(#efebe9 1px, transparent 1px); background-size: 20px 20px; }
                .quiz-container { max-width: 800px; margin: 0 auto; padding: 2rem; height: 100%; display: flex; flex-direction: column; overflow-y: auto; }
                .quiz-option-btn { padding: 1rem; text-align: left; background: #fff; border: 2px solid #efebe9; border-radius: 8px; font-family: 'Lato', sans-serif; color: #5d4037; cursor: pointer; transition: all 0.2s; margin-bottom: 1rem; position: relative; }
                .quiz-option-btn:hover { border-color: #8d6e63; background: #fafafa; }
                .quiz-option-btn.correct { background-color: #dcedc8 !important; border-color: #7cb342 !important; color: #33691e !important; }
                .quiz-option-btn.wrong { background-color: #ffcdd2 !important; border-color: #e57373 !important; color: #b71c1c !important; }
                .quiz-option-btn.disabled { pointer-events: none; opacity: 0.9; }

                /* Footer */
                .study-footer { 
                    background: #fff; border-top: 1px solid #efebe9; padding: 1rem 2rem; 
                    display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; box-shadow: 0 -2px 10px rgba(0,0,0,0.03);
                }
                .nav-btn { 
                    background: #3e2723; color: #fff; border: none; padding: 0.7rem 1.5rem; border-radius: 6px; 
                    font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: background 0.2s; box-shadow: 0 2px 5px rgba(62, 39, 35, 0.3);
                }
                .nav-btn:hover { background: #5d4037; transform: translateY(-1px); }
                .nav-btn:disabled { background: #e0e0e0; color: #9e9e9e; cursor: not-allowed; box-shadow: none; transform: none; }
                .nav-btn.secondary { background: #fff; border: 1px solid #d7ccc8; color: #5d4037; box-shadow: none; }
                .nav-btn.secondary:hover { background: #efebe9; border-color: #a1887f; }

                /* Search Overlay */
                .search-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(255,255,255,0.98); z-index: 50;
                    display: none; flex-direction: column; padding: 2rem; box-sizing: border-box;
                }
                .search-overlay.active { display: flex; animation: fadeIn 0.2s; }
                .search-header { display: flex; gap: 1rem; margin-bottom: 2rem; }
                .search-input { flex: 1; padding: 1rem; font-size: 1.2rem; border: 2px solid #8d6e63; border-radius: 8px; outline: none; }
                .close-search { background: none; border: none; font-size: 2rem; color: #5d4037; cursor: pointer; }
                .search-results { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; }
                .search-result-item { background: #fff; padding: 1rem; border: 1px solid #efebe9; border-radius: 8px; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
                .search-result-item:hover { border-color: #8d6e63; transform: translateX(5px); }
                .highlight { background-color: #fff59d; font-weight: bold; }

                @media (max-width: 600px) { 
                    .text-content { padding: 1.5rem; } 
                    .study-header { padding: 0.5rem 1rem; flex-direction: column; align-items: flex-start; gap: 10px; } 
                    .header-tabs { flex-direction: row; width: 100%; justify-content: space-between; align-items: center; }
                    .tab-btn { text-align: center; width: auto; flex: 1; }
                }
            </style>
        `;

        return `
            ${css}
            <div class="study-module-root" id="study-root">
                <header class="study-header">
                    <div class="header-left">
                        <img src="${ImageService.getUrl(philosopher.image, ImageService.Sizes.ICON_THUMB)}" class="header-avatar">
                        <div class="header-title">
                            <h3>${philosopher.name}</h3>
                            <span class="header-xp" id="header-xp">${percentage}% Concluído</span>
                        </div>
                    </div>
                    <div class="header-tabs">
                        <button class="tab-btn" data-tab="summary">Sumário</button>
                        <button class="tab-btn" data-tab="theory">Teoria</button>
                        <button class="tab-btn" data-tab="comic">HQ</button>
                        <button class="tab-btn" data-tab="flashcards">Flashcards</button>
                        <button class="tab-btn" data-tab="quiz">Quiz</button>
                    </div>
                </header>
                <div class="study-toolbar" id="study-toolbar"></div>
                <main class="study-viewport" id="study-viewport"></main>
                <footer class="study-footer" id="study-footer">
                    <button class="nav-btn secondary" id="btn-prev"><i class="fas fa-arrow-left"></i> Anterior</button>
                    <span id="page-indicator" style="font-family:'Cinzel', serif; font-weight:700; color:#5d4037; font-size: 0.9rem;">Página 1</span>
                    <button class="nav-btn" id="btn-next">Próxima <i class="fas fa-arrow-right"></i></button>
                </footer>
                
                <div class="search-overlay" id="search-overlay">
                    <div class="search-header">
                        <input type="text" class="search-input" id="search-input" placeholder="Digite para buscar...">
                        <button class="close-search" id="btn-close-search">&times;</button>
                    </div>
                    <div class="search-results" id="search-results"></div>
                </div>
            </div>
        `;
    },

    /**
     * Configura os event listeners para o popup.
     */
    setupListeners: (element, data, popupManager) => {
        const philosopherId = data.philosopherId;
        const root = element.querySelector('#study-root');
        if (!root) return;

        const studyData = STUDY_CONTENT_DATA[philosopherId];
        const viewport = root.querySelector('#study-viewport');
        const toolbar = root.querySelector('#study-toolbar');
        const footer = root.querySelector('#study-footer');
        const pageInd = root.querySelector('#page-indicator');
        const btnPrev = root.querySelector('#btn-prev');
        const btnNext = root.querySelector('#btn-next');
        const headerXp = root.querySelector('#header-xp');

        // Inicializa Ferramentas
        StudyTools.Tooltip.init();
        const searchTool = StudyTools.Search.setup(root, studyData, (pageNum) => {
            updateState({ tab: 'theory', textPage: pageNum });
        });

        // Listeners de Eventos Customizados (Comunicação entre módulos)
        document.addEventListener('study-search-toggle', (e) => {
            if (searchTool) searchTool.toggle(e.detail.show);
        });
        document.addEventListener('study-show-tooltip', (e) => {
            const explanation = studyData.explanation[e.detail.term];
            StudyTools.Tooltip.show(e.detail.target, e.detail.term, explanation);
        });

        // Estado Local (reativo)
        let state = StudyState.loadState(philosopherId);

        // Função de Atualização Centralizada
        const updateState = (updates, shouldRender = true) => {
            state = { ...state, ...updates };
            StudyState.saveState(philosopherId, state);
            if (shouldRender) render();
        };

        // Renderização Principal
        const render = () => {
            // Atualiza Header XP
            const percentage = StudyState.getProgressPercentage(philosopherId, studyData.totalPages);
            if (headerXp) headerXp.textContent = `${percentage}% Concluído`;

            // Atualiza Abas UI
            root.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
                if (b.dataset.tab === state.tab) b.classList.add('active');
            });

            // Limpa Viewport
            viewport.innerHTML = '';
            toolbar.innerHTML = ''; // Limpa toolbar para ser recriada pelo módulo
            toolbar.style.display = 'flex';
            footer.style.display = 'flex';

            try {
                switch (state.tab) {
                    case 'summary':
                        toolbar.style.display = 'none';
                        footer.style.display = 'none';
                        StudySummary.render(viewport, studyData, philosopherId);
                        StudySummary.setup(viewport, (pageNum) => {
                            updateState({ tab: 'theory', textPage: pageNum });
                        });
                        break;

                    case 'theory':
                        StudyTheory.render(viewport, studyData, state);
                        StudyTheory.renderToolbar(toolbar, state, updateState);
                        StudyTheory.setup(viewport);

                        // Atualiza Footer
                        pageInd.textContent = `PÁGINA ${state.textPage} / ${studyData.totalPages}`;
                        btnPrev.disabled = state.textPage === 1;
                        btnNext.innerHTML = state.textPage === studyData.totalPages ? 'Concluir' : 'Próxima <i class="fas fa-arrow-right"></i>';

                        // Marca como visto
                        StudyState.markPageAsViewed(philosopherId, state.textPage);
                        StudyState.saveState(philosopherId, state); // Salva progresso
                        break;

                    case 'comic':
                        toolbar.style.display = 'none'; // Toolbar interna do comic já é flutuante
                        footer.style.display = 'none'; // Oculta footer externo (botões antigos)

                        StudyComic.render(viewport, studyData, state, updateState);
                        StudyComic.renderToolbar(toolbar, state, updateState);
                        StudyComic.setup(viewport);
                        break;

                    case 'quiz':
                        toolbar.style.display = 'none';
                        footer.style.display = 'none';

                        // Verifica desbloqueio
                        const viewedCount = gameState.studyProgress[philosopherId]?.pagesViewed?.size || 0;
                        const isUnlocked = viewedCount >= studyData.totalPages;
                        const quizStateWithUnlock = { ...state, quizUnlocked: isUnlocked };

                        StudyQuiz.render(viewport, studyData, quizStateWithUnlock, philosopherId);
                        StudyQuiz.setup(viewport, studyData, quizStateWithUnlock, updateState);
                        break;

                    case 'flashcards':
                        toolbar.style.display = 'none';
                        footer.style.display = 'none';
                        FlashcardReviewModule.getHTML({ philosopherId }); // Just to get styles if needed, but we render directly
                        // The module structure is slightly different, let's adapt:
                        viewport.innerHTML = FlashcardReviewModule.getHTML({ philosopherId });
                        FlashcardReviewModule.setupListeners(root, { philosopherId }, popupManager);
                        break;
                }
            } catch (error) {
                console.error("Erro ao renderizar módulo:", error);
                viewport.innerHTML = `<div style="padding:2rem; color:red;">Erro ao carregar conteúdo: ${error.message}</div>`;
            }
        };

        // Listeners Globais (Abas)
        root.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                updateState({ tab: btn.dataset.tab });
            });
        });

        // Listeners Globais (Navegação Footer)
        btnPrev.onclick = () => {
            if (state.tab === 'theory' && state.textPage > 1) {
                updateState({ textPage: state.textPage - 1 });
            } else if (state.tab === 'comic' && state.comicIndex > 0) {
                updateState({ comicIndex: state.comicIndex - 1 });
            }
        };

        btnNext.onclick = () => {
            if (state.tab === 'theory') {
                if (state.textPage < studyData.totalPages) {
                    updateState({ textPage: state.textPage + 1 });
                } else {
                    // Fim da teoria -> Vai para Quiz? Ou só avisa?
                    // Vamos sugerir Quiz ou marcar concluído
                    updateState({ tab: 'quiz' });
                }
            } else if (state.tab === 'comic') {
                const comics = studyData.comic || [];
                if (state.comicIndex < comics.length - 1) {
                    updateState({ comicIndex: state.comicIndex + 1 });
                }
            }
        };

        // Renderização Inicial
        render();
    }
};