// PhilosopherStudyModule.js
import { gameState } from '../../../data/gameState.js';
import { PHILOSOPHERS_DATA } from '../../../data/philosophers.js';
import { STUDY_CONTENT_DATA } from '../../../data/study_content.js';

/**
 * Módulo para o popup de estudo aprofundado do filósofo (tela cheia).
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

        // Lógica de Progresso
        if (!gameState.studyProgress) gameState.studyProgress = {};
        if (!gameState.studyProgress[philosopherId]) gameState.studyProgress[philosopherId] = { pagesViewed: new Set() };
        const progress = gameState.studyProgress[philosopherId];
        const percentage = Math.floor((progress.pagesViewed.size / studyData.totalPages) * 100);

        // --- CSS REFINADO ---
        const css = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Lato:wght@400;700&display=swap');

                /* Reset e Base */
                .study-module-root { 
                    display: flex; flex-direction: column; height: 100%; width: 100%; 
                    background: #fdfbf7; /* Bege muito suave, papel */
                    font-family: 'Lato', sans-serif; 
                    overflow: hidden; 
                    color: #3e2723;
                }

                /* Scrollbar Customizada (Resolve o problema visual da barra cinza) */
                .study-module-root ::-webkit-scrollbar { width: 8px; height: 8px; }
                .study-module-root ::-webkit-scrollbar-track { background: transparent; }
                .study-module-root ::-webkit-scrollbar-thumb { 
                    background-color: #d7ccc8; 
                    border-radius: 10px; 
                    border: 2px solid transparent; 
                    background-clip: content-box; 
                }
                .study-module-root ::-webkit-scrollbar-thumb:hover { background-color: #a1887f; }

                /* Header Elegante */
                .study-header { 
                    background: #fff; 
                    border-bottom: 1px solid #efebe9; 
                    padding: 1rem 2rem; 
                    display: flex; align-items: center; justify-content: space-between; 
                    flex-shrink: 0; z-index: 20;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
                }
                .header-left { display: flex; align-items: center; gap: 15px; }
                .header-avatar { 
                    width: 48px; height: 48px; 
                    border-radius: 50%; object-fit: cover; 
                    border: 2px solid #8d6e63; 
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                .header-title h3 { 
                    margin: 0; color: #3e2723; 
                    font-family: 'Cinzel', serif; /* Fonte clássica para títulos */
                    font-size: 1.2rem; font-weight: 700; 
                }
                .header-xp { 
                    font-size: 0.7rem; color: #fff; 
                    background: #8d6e63; padding: 2px 8px; border-radius: 10px;
                    display: inline-block; margin-top: 4px;
                }

                /* Abas Refinadas */
                .header-tabs { 
                    display: flex; gap: 8px; 
                    background: #f5f5f5; padding: 4px; border-radius: 12px; 
                }
                .tab-btn { 
                    border: none; background: transparent; 
                    padding: 8px 16px; border-radius: 8px; 
                    font-size: 0.85rem; font-weight: 600; 
                    color: #757575; cursor: pointer; transition: all 0.2s ease; 
                }
                .tab-btn:hover { color: #3e2723; background: rgba(0,0,0,0.03); }
                .tab-btn.active { 
                    background: #fff; color: #3e2723; 
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08); 
                    transform: scale(1.02);
                }

                /* Toolbar */
                .study-toolbar { 
                    background: #fff; border-bottom: 1px solid #f0f0f0; 
                    padding: 0.5rem 1rem; height: 50px;
                    display: flex; justify-content: center; align-items: center; gap: 2rem; 
                    flex-shrink: 0; 
                }
                .tool-group { display: flex; align-items: center; gap: 8px; }
                .tool-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #9e9e9e; font-weight: bold; margin-right: 5px; }
                .tool-btn { 
                    background: transparent; border: 1px solid #e0e0e0; 
                    width: 32px; height: 32px; border-radius: 6px; 
                    display: flex; align-items: center; justify-content: center; 
                    cursor: pointer; color: #5d4037; transition: 0.2s;
                }
                .tool-btn:hover { background: #efebe9; border-color: #d7ccc8; color: #3e2723; }
                .tool-btn:active { transform: translateY(1px); }

                /* Viewport Principal */
                .study-viewport { flex: 1; position: relative; overflow: hidden; background: #fdfbf7; }
                
                /* Área de Texto (Melhoria de Leitura) */
                .text-scroll-area { 
                    height: 100%; overflow-y: auto; 
                    padding: 0; /* Remove padding do container scrollável para a barra ficar na borda */
                    display: flex; justify-content: center;
                }
                .text-content-wrapper {
                    padding: 3rem 2rem 5rem 2rem; /* Padding interno generoso */
                    width: 100%; display: flex; justify-content: center;
                }
                .text-content { 
                    max-width: 800px; /* Largura ideal de leitura */
                    width: 100%; 
                    background: #fff; 
                    padding: 4rem; /* Respiro interno do papel */
                    box-shadow: 0 4px 20px rgba(0,0,0,0.06); 
                    border-radius: 4px;
                    transition: font-size 0.2s ease; 
                    color: #2c2c2c;
                    line-height: 1.8; /* Entrelinha confortável */
                }
                
                /* Tipografia interna do Texto */
                .text-content h1 { font-family: 'Cinzel', serif; color: #3e2723; border-bottom: 2px solid #efebe9; padding-bottom: 1rem; margin-bottom: 1.5rem; }
                .text-content h2 { font-family: 'Merriweather', serif; color: #5d4037; margin-top: 2rem; font-size: 1.4em; }
                .text-content p { margin-bottom: 1.2rem; text-align: justify; }
                .text-content blockquote { border-left: 4px solid #8d6e63; margin: 1.5rem 0; padding-left: 1rem; color: #555; font-style: italic; background: #fafafa; padding: 1rem; }

                /* Área de HQ (Correção do Espaço Branco) */
                .comic-scroll-area { 
                    height: 100%; width: 100%; overflow: auto; 
                    background: #212121; /* Fundo escuro para destacar a imagem */
                    display: flex; 
                    /* Centraliza se a imagem for menor, deixa scrollar se for maior */
                    align-items: center; 
                    justify-content: center;
                }
                .comic-img-wrapper { 
                    transition: transform 0.2s ease-out; 
                    transform-origin: center center; /* Zoom a partir do centro */
                    box-shadow: 0 0 30px rgba(0,0,0,0.5); 
                    line-height: 0; /* Remove espaço extra abaixo da imagem */
                }
                .comic-img { 
                    display: block; 
                    max-width: 90vw; /* Garante que caiba na tela inicialmente */
                    max-height: 90vh;
                    height: auto; width: auto; 
                }
                /* Classe para permitir zoom além da tela */
                .comic-zoomed .comic-img {
                    max-width: none;
                    max-height: none;
                }

                /* Quiz Placeholder */
                .quiz-placeholder {
                    display: flex; flex-direction: column; align-items: center; justify-content: center; 
                    height: 100%; color: #8d6e63; gap: 1rem;
                    background-image: radial-gradient(#efebe9 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                .quiz-placeholder i { font-size: 3rem; opacity: 0.5; }

                /* Footer */
                .study-footer { 
                    background: #fff; 
                    border-top: 1px solid #efebe9; 
                    padding: 1rem 2rem; 
                    display: flex; justify-content: space-between; align-items: center; 
                    flex-shrink: 0; 
                    box-shadow: 0 -2px 10px rgba(0,0,0,0.03);
                }
                .nav-btn { 
                    background: #3e2723; color: #fff; border: none; 
                    padding: 0.7rem 1.5rem; border-radius: 6px; 
                    font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 10px; 
                    transition: background 0.2s;
                    box-shadow: 0 2px 5px rgba(62, 39, 35, 0.3);
                }
                .nav-btn:hover { background: #5d4037; transform: translateY(-1px); }
                .nav-btn:disabled { background: #e0e0e0; color: #9e9e9e; cursor: not-allowed; box-shadow: none; transform: none; }
                
                .nav-btn.secondary { 
                    background: #fff; border: 1px solid #d7ccc8; color: #5d4037; 
                    box-shadow: none;
                }
                .nav-btn.secondary:hover { background: #efebe9; border-color: #a1887f; }

                @media (max-width: 600px) { 
                    .text-content { padding: 1.5rem; } 
                    .study-header { padding: 0.5rem 1rem; flex-direction: column; gap: 10px; } 
                    .header-left { width: 100%; justify-content: flex-start; } 
                    .header-tabs { width: 100%; justify-content: space-between; }
                    .tab-btn { flex: 1; text-align: center; }
                    .study-toolbar { gap: 1rem; overflow-x: auto; justify-content: flex-start; }
                }
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
                    <button class="nav-btn secondary" id="btn-prev"><i class="fas fa-arrow-left"></i> Anterior</button>
                    <span id="page-indicator" style="font-family:'Cinzel', serif; font-weight:700; color:#5d4037; font-size: 0.9rem;">Página 1</span>
                    <button class="nav-btn" id="btn-next">Próxima <i class="fas fa-arrow-right"></i></button>
                </footer>
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

        let state = {
            tab: 'theory',
            textPage: 1,
            comicIndex: 0,
            textSize: 18, // Tamanho base aumentado para melhor leitura
            fontFamily: 'serif',
            zoomLevel: 1.0
        };

        const renderTheoryToolbar = () => {
            toolbar.innerHTML = `
                <div class="tool-group">
                    <span class="tool-label">Fonte</span>
                    <button class="tool-btn" id="cmd-font-serif" title="Serifa" style="font-family:'Merriweather', serif; font-weight:bold;">T</button>
                    <button class="tool-btn" id="cmd-font-sans" title="Sem Serifa" style="font-family:'Lato', sans-serif;">T</button>
                </div>
                <div class="tool-group" style="margin-left: 15px; border-left: 1px solid #eee; padding-left: 15px;">
                    <span class="tool-label">Tamanho</span>
                    <button class="tool-btn" id="cmd-size-down"><i class="fas fa-minus"></i></button>
                    <span class="tool-label" id="lbl-size" style="min-width: 40px; text-align: center;">${state.textSize}px</span>
                    <button class="tool-btn" id="cmd-size-up"><i class="fas fa-plus"></i></button>
                </div>
            `;
            root.querySelector('#cmd-font-serif').onclick = () => { state.fontFamily = 'serif'; updateTextStyle(); };
            root.querySelector('#cmd-font-sans').onclick = () => { state.fontFamily = 'sans'; updateTextStyle(); };
            root.querySelector('#cmd-size-up').onclick = () => { if (state.textSize < 28) state.textSize += 2; updateTextStyle(); };
            root.querySelector('#cmd-size-down').onclick = () => { if (state.textSize > 14) state.textSize -= 2; updateTextStyle(); };
            updateTextStyle(); // Aplica o estado visual aos botões
        };

        const renderComicToolbar = () => {
            toolbar.innerHTML = `
                <div class="tool-group">
                    <span class="tool-label">Zoom</span>
                    <button class="tool-btn" id="cmd-zoom-out"><i class="fas fa-search-minus"></i></button>
                    <span class="tool-label" id="lbl-zoom" style="min-width: 50px; text-align: center;">${Math.round(state.zoomLevel * 100)}%</span>
                    <button class="tool-btn" id="cmd-zoom-in"><i class="fas fa-search-plus"></i></button>
                    <button class="tool-btn" id="cmd-zoom-reset" title="Ajustar à Tela" style="margin-left: 10px;"><i class="fas fa-expand"></i></button>
                </div>
            `;
            root.querySelector('#cmd-zoom-in').onclick = () => { if (state.zoomLevel < 3.0) state.zoomLevel += 0.25; updateComicZoom(); };
            root.querySelector('#cmd-zoom-out').onclick = () => { if (state.zoomLevel > 0.5) state.zoomLevel -= 0.25; updateComicZoom(); };
            root.querySelector('#cmd-zoom-reset').onclick = () => { state.zoomLevel = 1.0; updateComicZoom(); };
        };

        const updateTextStyle = () => {
            const textContent = root.querySelector('.text-content');
            const label = root.querySelector('#lbl-size');
            const btnSerif = root.querySelector('#cmd-font-serif');
            const btnSans = root.querySelector('#cmd-font-sans');

            if (textContent && label) {
                textContent.style.fontSize = `${state.textSize}px`;
                textContent.style.fontFamily = state.fontFamily === 'serif' ? "'Merriweather', serif" : "'Lato', sans-serif";
                label.textContent = `${state.textSize}px`;

                // Visual feedback nos botões
                if (btnSerif && btnSans) {
                    btnSerif.style.background = state.fontFamily === 'serif' ? '#efebe9' : 'transparent';
                    btnSerif.style.borderColor = state.fontFamily === 'serif' ? '#d7ccc8' : '#e0e0e0';
                    btnSans.style.background = state.fontFamily === 'sans' ? '#efebe9' : 'transparent';
                    btnSans.style.borderColor = state.fontFamily === 'sans' ? '#d7ccc8' : '#e0e0e0';
                }
            }
        };

        const updateComicZoom = () => {
            const imgWrapper = root.querySelector('.comic-img-wrapper');
            const img = root.querySelector('.comic-img');
            const label = root.querySelector('#lbl-zoom');

            if (imgWrapper && label && img) {
                if (state.zoomLevel === 1.0) {
                    imgWrapper.classList.remove('comic-zoomed');
                    imgWrapper.style.transform = `scale(1)`;
                    // Volta ao alinhamento centralizado e resetado
                    imgWrapper.parentElement.style.alignItems = 'center';
                    imgWrapper.parentElement.style.justifyContent = 'center';
                } else {
                    imgWrapper.classList.add('comic-zoomed');
                    imgWrapper.style.transform = `scale(${state.zoomLevel})`;

                    // Se estiver com muito zoom, muda o alinhamento para permitir scrollar tudo
                    if (state.zoomLevel > 1) {
                        imgWrapper.parentElement.style.alignItems = 'flex-start';
                        imgWrapper.parentElement.style.justifyContent = 'flex-start';
                        // Margem para compensar o scale origin que pode cortar o topo
                        const offset = (state.zoomLevel - 1) * 10;
                        imgWrapper.style.margin = `${offset}rem auto`;
                    }
                }
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
                toolbar.style.display = 'flex';
                const html = studyData.pages[state.textPage];
                // Wrapper adicionado para centralizar o texto e dar margem
                viewport.innerHTML = `
                    <div class="text-scroll-area">
                        <div class="text-content-wrapper">
                            <div class="text-content animate__animated animate__fadeIn">
                                ${html}
                            </div>
                        </div>
                    </div>`;
                updateTextStyle();
                pageInd.textContent = `PÁGINA ${state.textPage} / ${studyData.totalPages}`;
                btnPrev.disabled = state.textPage === 1;
                btnNext.innerHTML = state.textPage === studyData.totalPages ? 'Concluir' : 'Próxima <i class="fas fa-arrow-right"></i>';
                gameState.studyProgress[philosopherId].pagesViewed.add(state.textPage);

            } else if (state.tab === 'comic') {
                renderComicToolbar();
                footer.style.display = 'flex';
                toolbar.style.display = 'flex';
                const comics = studyData.comic || [];
                if (comics.length > 0) {
                    viewport.innerHTML = `
                        <div class="comic-scroll-area">
                            <div class="comic-img-wrapper animate__animated animate__fadeIn">
                                <img src="${comics[state.comicIndex]}" class="comic-img" alt="HQ">
                            </div>
                        </div>`;
                    state.zoomLevel = 1.0;
                    // updateComicZoom não é necessário chamar aqui pois o render reseta o HTML,
                    // mas podemos chamar para garantir estado inicial
                } else {
                    viewport.innerHTML = '<div style="padding:2rem; text-align:center; color:#fff;">Nenhuma HQ disponível.</div>';
                }
                pageInd.textContent = `QUADRO ${state.comicIndex + 1} / ${comics.length}`;
                btnPrev.disabled = state.comicIndex === 0;
                btnNext.innerHTML = state.comicIndex === comics.length - 1 ? 'Fim' : 'Próxima <i class="fas fa-arrow-right"></i>';

            } else {
                // Quiz Placeholder mais bonito
                toolbar.style.display = 'none';
                footer.style.display = 'none';
                viewport.innerHTML = `
                    <div class="quiz-placeholder animate__animated animate__fadeIn">
                        <i class="fas fa-scroll"></i>
                        <h3>O Teste do Conhecimento</h3>
                        <p>O quiz estará disponível após a leitura completa.</p>
                        <span style="font-size: 0.8rem; background: #e0e0e0; padding: 4px 10px; border-radius: 4px;">Em Breve</span>
                    </div>`;
            }
        };

        // Tab Navigation
        root.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                root.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.tab = btn.dataset.tab;
                renderContent();
            });
        });

        // Navigation Footer
        root.querySelector('#btn-prev').addEventListener('click', () => {
            if (state.tab === 'theory' && state.textPage > 1) {
                state.textPage--; renderContent();
                // Scroll to top
                const scrollArea = root.querySelector('.text-scroll-area');
                if (scrollArea) scrollArea.scrollTop = 0;
            }
            else if (state.tab === 'comic' && state.comicIndex > 0) { state.comicIndex--; renderContent(); }
        });

        root.querySelector('#btn-next').addEventListener('click', () => {
            if (state.tab === 'theory') {
                if (state.textPage < studyData.totalPages) {
                    state.textPage++;
                    renderContent();
                    const scrollArea = root.querySelector('.text-scroll-area');
                    if (scrollArea) scrollArea.scrollTop = 0;
                } else {
                    // Se tiver manager global, fecha
                    if (popupManager) popupManager.close();
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