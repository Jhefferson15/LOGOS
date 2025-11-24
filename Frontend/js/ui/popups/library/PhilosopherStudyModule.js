import { gameState } from '../../../data/gameState.js';
import { PHILOSOPHERS_DATA } from '../../../data/philosophers.js';
import { STUDY_CONTENT_DATA } from '../../../data/study_content.js';

/**
 * Módulo para o popup de estudo aprofundado do filósofo (tela cheia).
 */
export const PhilosopherStudyModulePopup = {
    title: null, // Sem título para este popup de tela cheia

    /**
     * Gera o HTML do conteúdo do popup.
     * @param {object} data - Dados para renderização, esperando data.philosopherId.
     * @returns {string} HTML do conteúdo do popup.
     */
    getHTML: (data) => {
        const philosopherId = data.philosopherId;
        const studyData = STUDY_CONTENT_DATA[philosopherId];
        const philosopher = PHILOSOPHERS_DATA[philosopherId];

        // Lógica de Progresso
        if (!gameState.studyProgress) gameState.studyProgress = {};
        if (!gameState.studyProgress[philosopherId]) gameState.studyProgress[philosopherId] = { pagesViewed: new Set() };
        const progress = gameState.studyProgress[philosopherId];
        const percentage = Math.floor((progress.pagesViewed.size / studyData.totalPages) * 100);

        const css = `
            <style>
                .study-module-root { display: flex; flex-direction: column; height: 100%; width: 100%; background: #f9f9f9; font-family: 'Lato', sans-serif; overflow: hidden; }
                .study-header { background: #fff; border-bottom: 1px solid #e0e0e0; padding: 0.8rem 1rem; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; z-index: 20; }
                .header-left { display: flex; align-items: center; gap: 10px; }
                .header-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #3e2723; }
                .header-title h3 { margin: 0; color: #3e2723; font-size: 1rem; font-weight: 700; }
                .header-xp { font-size: 0.75rem; color: #8d6e63; }
                .header-tabs { display: flex; gap: 5px; background: #f5f5f5; padding: 4px; border-radius: 8px; }
                .tab-btn { border: none; background: none; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; color: #757575; cursor: pointer; transition: 0.2s; }
                .tab-btn.active { background: #fff; color: #3e2723; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
                .study-toolbar { background: #fff; border-bottom: 1px solid #eee; padding: 0.5rem 1rem; display: flex; justify-content: center; gap: 1.5rem; flex-shrink: 0; align-items: center; height: 40px; }
                .tool-group { display: flex; align-items: center; gap: 10px; }
                .tool-btn { background: #f0f0f0; border: none; width: 28px; height: 28px; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #333; }
                .tool-btn:hover { background: #e0e0e0; }
                .study-viewport { flex: 1; position: relative; overflow: hidden; background: #f9f9f9; }
                .text-scroll-area { height: 100%; overflow-y: auto; padding: 2rem 1rem; display: flex; justify-content: center; }
                .text-content { max-width: 700px; width: 100%; background: #fff; padding: 3rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); transition: font-size 0.2s ease; }
                .comic-scroll-area { height: 100%; width: 100%; overflow: auto; background: #ffffff; display: flex; align-items: flex-start; justify-content: center; padding: 1rem; }
                .comic-img-wrapper { transition: transform 0.2s ease-out; transform-origin: top center; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                .comic-img { display: block; max-width: 100%; height: auto; }
                .study-footer { background: #fff; border-top: 1px solid #e0e0e0; padding: 0.8rem 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
                .nav-btn { background: #3e2723; color: #fff; border: none; padding: 0.6rem 1.2rem; border-radius: 4px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; }
                .nav-btn:disabled { background: #ccc; cursor: not-allowed; }
                .nav-btn.secondary { background: #fff; border: 1px solid #ccc; color: #555; }
                @media (max-width: 600px) { .text-content { padding: 1.5rem; } .study-header { flex-direction: column; gap: 10px; align-items: stretch; } .header-left { justify-content: center; } .header-tabs { justify-content: center; } }
            </style>
        `;

        return `
            ${css}
            <div class="study-module-root" id="study-root">
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
                <div class="study-toolbar" id="study-toolbar"></div>
                <main class="study-viewport" id="study-viewport"></main>
                <footer class="study-footer" id="study-footer">
                    <button class="nav-btn secondary" id="btn-prev">Anterior</button>
                    <span id="page-indicator" style="font-size:0.9rem; font-weight:600; color:#555;">Página 1</span>
                    <button class="nav-btn" id="btn-next">Próxima <i class="fas fa-arrow-right"></i></button>
                </footer>
            </div>
        `;
    },

    /**
     * Configura os event listeners para o popup.
     * @param {HTMLElement} element - O elemento do corpo do modal onde o HTML foi injetado.
     * @param {object} data - Dados para configuração, esperando data.philosopherId.
     */
    setupListeners: (element, data) => {
        const philosopherId = data.philosopherId;
        const root = element.querySelector('#study-root');
        if (!root) return;

        const studyData = STUDY_CONTENT_DATA[philosopherId];
        const viewport = root.querySelector('#study-viewport');
        const toolbar = root.querySelector('#study-toolbar');

        let state = {
            tab: 'theory',
            textPage: 1,
            comicIndex: 0,
            textSize: 16,
            fontFamily: 'serif',
            zoomLevel: 1.0
        };

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
            root.querySelector('#cmd-zoom-in').onclick = () => { if (state.zoomLevel < 2.5) state.zoomLevel += 0.25; updateComicZoom(); };
            root.querySelector('#cmd-zoom-out').onclick = () => { if (state.zoomLevel > 0.5) state.zoomLevel -= 0.25; updateComicZoom(); };
            root.querySelector('#cmd-zoom-reset').onclick = () => { state.zoomLevel = 1.0; updateComicZoom(); };
        };

        const updateTextStyle = () => {
            const textContent = root.querySelector('.text-content');
            const label = root.querySelector('#lbl-size');
            if (textContent && label) {
                textContent.style.fontSize = `${state.textSize}px`;
                textContent.style.fontFamily = state.fontFamily === 'serif' ? "'Merriweather', serif" : "'Lato', sans-serif";
                label.textContent = `${state.textSize}px`;
                root.querySelector('#cmd-font-serif').style.background = state.fontFamily === 'serif' ? '#d7ccc8' : '#f0f0f0';
                root.querySelector('#cmd-font-sans').style.background = state.fontFamily === 'sans' ? '#d7ccc8' : '#f0f0f0';
            }
        };

        const updateComicZoom = () => {
            const imgWrapper = root.querySelector('.comic-img-wrapper');
            const label = root.querySelector('#lbl-zoom');
            if (imgWrapper && label) {
                imgWrapper.style.transform = `scale(${state.zoomLevel})`;
                imgWrapper.style.margin = state.zoomLevel > 1 ? `${(state.zoomLevel - 1) * 10}rem` : '0';
                label.textContent = `${Math.round(state.zoomLevel * 100)}%`;
            }
        };

        const renderContent = () => {
            const footer = root.querySelector('#study-footer');
            const pageInd = root.querySelector('#page-indicator');
            const btnPrev = root.querySelector('#btn-prev');
            const btnNext = root.querySelector('#btn-next');

            if (state.tab === 'theory') {
                renderTheoryToolbar();
                footer.style.display = 'flex';
                const html = studyData.pages[state.textPage];
                viewport.innerHTML = `<div class="text-scroll-area"><div class="text-content animate__animated animate__fadeIn">${html}</div></div>`;
                updateTextStyle();
                pageInd.textContent = `Página ${state.textPage} de ${studyData.totalPages}`;
                btnPrev.disabled = state.textPage === 1;
                btnNext.innerHTML = state.textPage === studyData.totalPages ? 'Concluir' : 'Próxima <i class="fas fa-arrow-right"></i>';
                gameState.studyProgress[philosopherId].pagesViewed.add(state.textPage);
            } else if (state.tab === 'comic') {
                renderComicToolbar();
                footer.style.display = 'flex';
                const comics = studyData.comic || [];
                if (comics.length > 0) {
                    viewport.innerHTML = `<div class="comic-scroll-area"><div class="comic-img-wrapper"><img src="${comics[state.comicIndex]}" class="comic-img" alt="HQ"></div></div>`;
                    state.zoomLevel = 1.0;
                    updateComicZoom();
                } else {
                    viewport.innerHTML = '<div style="padding:2rem; text-align:center;">Sem HQ.</div>';
                }
                pageInd.textContent = `Quadro ${state.comicIndex + 1} de ${comics.length}`;
                btnPrev.disabled = state.comicIndex === 0;
                btnNext.innerHTML = state.comicIndex === comics.length - 1 ? 'Fim' : 'Próxima <i class="fas fa-arrow-right"></i>';
            } else {
                toolbar.innerHTML = '';
                footer.style.display = 'none';
                viewport.innerHTML = '<div style="display:flex; height:100%; align-items:center; justify-content:center; color:#aaa;">Quiz em breve</div>';
            }
        };

        root.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                root.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.tab = btn.dataset.tab;
                renderContent();
            });
        });

        root.querySelector('#btn-prev').addEventListener('click', () => {
            if (state.tab === 'theory' && state.textPage > 1) { state.textPage--; renderContent(); }
            else if (state.tab === 'comic' && state.comicIndex > 0) { state.comicIndex--; renderContent(); }
        });

        root.querySelector('#btn-next').addEventListener('click', () => {
            if (state.tab === 'theory') {
                if (state.textPage < studyData.totalPages) { 
                    state.textPage++; 
                    renderContent(); 
                } else { 
                    window.popupManager.close(); 
                }
            } else if (state.tab === 'comic') {
                const comics = studyData.comic || [];
                if (state.comicIndex < comics.length - 1) { 
                    state.comicIndex++; 
                    renderContent(); 
                }
            }
        });

        renderContent();
    }
};
