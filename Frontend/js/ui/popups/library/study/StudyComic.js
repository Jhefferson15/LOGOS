/**
 * StudyComic.js
 * Módulo responsável pela aba de HQ (Moderno).
 */

export const StudyComic = {
    // Estado local de visualização (Zoom/Pan não precisa ser persistido globalmente com tanta precisão, 
    // mas o índice da página sim)
    _viewState: {
        zoom: 1,
        panX: 0,
        panY: 0,
        isDragging: false,
        startX: 0,
        startY: 0,
        hideTimer: null
    },

    render: (container, data, state, onUpdate) => {
        const comics = data.comic || [];
        if (!comics.length) {
            container.innerHTML = '<div style="padding:2rem;text-align:center; color: #fff;">Nenhuma HQ disponível.</div>';
            return;
        }

        // Reset view state ao mudar de página (opcional, mas bom UX)
        // Se quisermos manter zoom ao trocar de página, removemos isso.
        // StudyComic._viewState.zoom = 1; 
        // StudyComic._viewState.panX = 0; 
        // StudyComic._viewState.panY = 0;

        const currentImage = comics[state.comicIndex];
        const progress = ((state.comicIndex + 1) / comics.length) * 100;

        const css = `
            <style>
                .comic-modern-root {
                    --primary-color: #8d6e63;
                    --glass: rgba(255, 255, 255, 0.8); /* Vidro mais claro para fundo branco */
                    --glass-border: rgba(0, 0, 0, 0.1);
                    --text-color: #3e2723; /* Texto escuro */
                    width: 100%; height: 100%;
                    background-color: #ffffff; /* Fundo Branco */
                    color: var(--text-color);
                    overflow: hidden;
                    position: relative;
                    user-select: none;
                    font-family: 'Lato', sans-serif;
                }

                .comic-viewer {
                    width: 100%; height: 100%;
                    display: flex; justify-content: center; align-items: center;
                    cursor: grab; position: relative;
                    overflow: hidden;
                }
                .comic-viewer:active { cursor: grabbing; }

                .comic-image {
                    max-width: 100%; max-height: 100%;
                    object-fit: contain;
                    transition: transform 0.1s linear;
                    box-shadow: 0 5px 30px rgba(0,0,0,0.15); /* Sombra mais suave */
                    will-change: transform;
                }

                /* UI Overlay */
                .comic-ui-layer {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    pointer-events: none;
                    transition: opacity 0.4s ease;
                    display: flex; flex-direction: column; justify-content: space-between;
                    z-index: 10;
                }
                .comic-ui-layer.hidden { opacity: 0; }

                /* Top Bar */
                .comic-top-bar {
                    padding: 15px 25px;
                    display: flex; justify-content: space-between; align-items: center;
                    background: linear-gradient(to bottom, rgba(255,255,255,0.9), transparent);
                    pointer-events: auto;
                }
                .comic-title-group h1 { font-size: 1.1rem; font-weight: 500; opacity: 0.9; margin: 0; color: #3e2723; }
                .comic-title-group span { font-size: 0.8rem; opacity: 0.7; display: block; color: #5d4037; }

                /* Controls Bottom */
                .comic-controls-container {
                    display: flex; justify-content: center;
                    margin-bottom: 30px; pointer-events: auto;
                }
                .comic-glass-panel {
                    background: var(--glass);
                    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                    border: 1px solid var(--glass-border);
                    padding: 10px 20px; border-radius: 50px;
                    display: flex; align-items: center; gap: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                .comic-control-btn {
                    background: transparent; border: none; color: #5d4037;
                    padding: 8px; border-radius: 50%; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: background 0.2s, transform 0.1s;
                }
                .comic-control-btn:hover { background: rgba(141, 110, 99, 0.1); }
                .comic-control-btn:active { transform: scale(0.9); }
                .comic-control-btn svg { width: 24px; height: 24px; stroke-width: 2; }
                
                .comic-divider { width: 1px; height: 24px; background: rgba(0,0,0,0.1); }

                /* Nav Arrows */
                .comic-nav-zone {
                    position: absolute; top: 50%; transform: translateY(-50%);
                    padding: 20px; pointer-events: auto; cursor: pointer;
                    opacity: 0.5; transition: opacity 0.2s, transform 0.2s;
                }
                .comic-nav-zone:hover { opacity: 1; transform: translateY(-50%) scale(1.1); }
                .comic-nav-left { left: 10px; }
                .comic-nav-right { right: 10px; }
                .comic-nav-arrow {
                    width: 50px; height: 50px;
                    background: rgba(255,255,255,0.8); border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    backdrop-filter: blur(4px);
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    color: #3e2723;
                }
                .comic-nav-arrow svg { stroke: #3e2723; }

                /* Progress Bar */
                .comic-progress-container {
                    position: absolute; bottom: 0; left: 0; width: 100%; height: 4px;
                    background: rgba(0,0,0,0.05);
                }
                .comic-progress-bar {
                    height: 100%; background: var(--primary-color);
                    width: ${progress}%; transition: width 0.3s ease;
                }

                /* Toast */
                .comic-toast {
                    position: absolute; top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0,0,0,0.8); color: white;
                    padding: 15px 30px; border-radius: 30px;
                    opacity: 0; pointer-events: none;
                    transition: opacity 0.3s; backdrop-filter: blur(5px);
                    z-index: 20;
                }

                @media (max-width: 768px) {
                    .comic-nav-zone { display: none; }
                    .comic-glass-panel { padding: 8px 15px; gap: 10px; width: 90%; justify-content: space-between; }
                }
            </style>
        `;

        container.innerHTML = `
            ${css}
            <div class="comic-modern-root" id="comic-root">
                <div class="comic-viewer" id="comic-viewer">
                    <img src="${currentImage}" class="comic-image" id="comic-image" draggable="false">
                    <div id="comic-toast" class="comic-toast">Zoom Resetado</div>
                </div>

                <div class="comic-ui-layer" id="comic-ui">
                    <div class="comic-top-bar">
                        <div class="comic-title-group">
                            <h1>${data.name || 'HQ'}</h1>
                            <span>Página ${state.comicIndex + 1} / ${comics.length}</span>
                        </div>
                    </div>

                    <!-- Nav Zones -->
                    <div class="comic-nav-zone comic-nav-left" id="btn-prev-page">
                        <div class="comic-nav-arrow">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3e2723" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </div>
                    </div>
                    <div class="comic-nav-zone comic-nav-right" id="btn-next-page">
                        <div class="comic-nav-arrow">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3e2723" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                    </div>

                    <div class="comic-controls-container">
                        <div class="comic-glass-panel">
                            <button class="comic-control-btn" id="ctrl-prev">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>
                            <div class="comic-divider"></div>
                            <button class="comic-control-btn" id="ctrl-zoom-out">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                            </button>
                            <button class="comic-control-btn" id="ctrl-reset">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                            </button>
                            <button class="comic-control-btn" id="ctrl-zoom-in">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                            </button>
                            <div class="comic-divider"></div>
                            <button class="comic-control-btn" id="ctrl-next">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                            <div class="comic-divider"></div>
                            <button class="comic-control-btn" id="ctrl-fullscreen" title="Tela Cheia">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                            </button>
                        </div>
                    </div>

                    <div class="comic-progress-container">
                        <div class="comic-progress-bar"></div>
                    </div>
                </div>
            </div>
        `;

        // Inicializa interações
        StudyComic._setupInteractions(container, comics, state, onUpdate);
    },

    renderToolbar: (container, state, onUpdate) => {
        // O novo design tem sua própria toolbar flutuante.
        // Vamos esconder a toolbar principal do popup para dar imersão.
        container.style.display = 'none';
    },

    _setupInteractions: (container, comics, state, onUpdate) => {
        const root = container.querySelector('#comic-root');
        const viewer = container.querySelector('#comic-viewer');
        const img = container.querySelector('#comic-image');
        const ui = container.querySelector('#comic-ui');
        const toast = container.querySelector('#comic-toast');

        // State local refs
        let { zoom, panX, panY, isDragging, startX, startY } = StudyComic._viewState;

        // Helper: Update Transform
        const updateTransform = () => {
            img.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
            // Atualiza ref global
            StudyComic._viewState.zoom = zoom;
            StudyComic._viewState.panX = panX;
            StudyComic._viewState.panY = panY;
        };

        // Helper: Toast
        const showToast = (msg) => {
            toast.textContent = msg;
            toast.style.opacity = 1;
            setTimeout(() => { toast.style.opacity = 0; }, 1500);
        };

        // Helper: Zoom
        const adjustZoom = (delta) => {
            const newZoom = zoom + delta;
            if (newZoom >= 0.8 && newZoom <= 4) {
                zoom = newZoom;
                updateTransform();
                resetHideTimer();
                showToast(`${Math.round(zoom * 100)}%`);
            }
        };

        const resetZoom = () => {
            zoom = 1; panX = 0; panY = 0;
            updateTransform();
            showToast("100%");
        };

        // Helper: Fullscreen
        const toggleFullScreen = () => {
            if (!document.fullscreenElement) {
                container.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else {
                document.exitFullscreen();
            }
        };

        // Helper: UI Visibility
        let hideTimer;
        let isUIHidden = false;

        const showUI = () => {
            ui.classList.remove('hidden');
            root.style.cursor = 'default';
            isUIHidden = false;
        };
        const hideUI = () => {
            ui.classList.add('hidden');
            // root.style.cursor = 'none'; // Opcional
            isUIHidden = true;
        };
        const toggleUI = () => {
            if (isUIHidden) {
                showUI();
                resetHideTimer();
            } else {
                hideUI();
                clearTimeout(hideTimer);
            }
        };
        const resetHideTimer = () => {
            if (isUIHidden) return; // Se estiver oculto manualmente, não reativa auto-hide
            showUI();
            clearTimeout(hideTimer);
            hideTimer = setTimeout(hideUI, 3000);
        };

        // --- Event Listeners ---

        // Mouse Wheel Zoom
        viewer.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            adjustZoom(delta);
        }, { passive: false });

        // Drag & Click Logic
        let dragStartX = 0;
        let dragStartY = 0;
        let isClick = true;

        viewer.addEventListener('mousedown', (e) => {
            isClick = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;

            if (zoom > 1) {
                isDragging = true;
                startX = e.clientX - panX;
                startY = e.clientY - panY;
                viewer.style.cursor = 'grabbing';
            }
        });

        window.addEventListener('mouseup', (e) => {
            if (isDragging) {
                isDragging = false;
                viewer.style.cursor = zoom > 1 ? 'grab' : 'default';
            }

            // Verifica se foi um clique (pouco movimento)
            const dist = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);
            if (dist < 5 && isClick) {
                // É um clique
                toggleUI();
            }
        });

        window.addEventListener('mousemove', (e) => {
            const dist = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);
            if (dist > 5) isClick = false; // Se moveu muito, não é clique

            resetHideTimer();
            if (!isDragging) return;
            e.preventDefault();
            panX = e.clientX - startX;
            panY = e.clientY - startY;
            updateTransform();
        });

        // Navigation Logic
        const goNext = () => {
            if (state.comicIndex < comics.length - 1) {
                // Manter zoom, resetar pan para o centro (0,0)
                // StudyComic._viewState.zoom = StudyComic._viewState.zoom; // Mantém
                StudyComic._viewState.panX = 0;
                StudyComic._viewState.panY = 0;
                onUpdate({ comicIndex: state.comicIndex + 1 });
            } else {
                showToast("Fim da HQ");
            }
        };
        const goPrev = () => {
            if (state.comicIndex > 0) {
                // Manter zoom, resetar pan
                StudyComic._viewState.panX = 0;
                StudyComic._viewState.panY = 0;
                onUpdate({ comicIndex: state.comicIndex - 1 });
            }
        };

        container.querySelector('#btn-next-page').onclick = goNext;
        container.querySelector('#btn-prev-page').onclick = goPrev;
        container.querySelector('#ctrl-next').onclick = goNext;
        container.querySelector('#ctrl-prev').onclick = goPrev;

        // Control Buttons
        container.querySelector('#ctrl-zoom-in').onclick = () => adjustZoom(0.2);
        container.querySelector('#ctrl-zoom-out').onclick = () => adjustZoom(-0.2);
        container.querySelector('#ctrl-reset').onclick = resetZoom;
        container.querySelector('#ctrl-fullscreen').onclick = toggleFullScreen;

        // Keyboard Support
        const keyHandler = (e) => {
            if (!document.contains(root)) {
                window.removeEventListener('keydown', keyHandler);
                return;
            }
            // Apenas se o mouse estiver sobre o viewer ou for focado
            resetHideTimer();
            switch (e.key) {
                case 'ArrowRight': goNext(); break;
                case 'ArrowLeft': goPrev(); break;
                case '+': adjustZoom(0.2); break;
                case '-': adjustZoom(-0.2); break;
                case 'Escape':
                    if (document.fullscreenElement) document.exitFullscreen();
                    else resetZoom();
                    break;
                case 'f': toggleFullScreen(); break;
            }
        };
        window.addEventListener('keydown', keyHandler);

        // Init
        resetHideTimer();
        updateTransform(); // Aplica estado inicial (útil se voltar de outra aba e quisermos manter zoom, mas aqui resetamos no render)
    },

    setup: (container) => {
        // Setup já feito no render para garantir acesso aos elementos criados
    }
};
