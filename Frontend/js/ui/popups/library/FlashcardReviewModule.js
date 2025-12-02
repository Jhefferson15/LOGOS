/**
 * FlashcardReviewModule.js
 * Módulo de revisão com flashcards, SRS e Dashboard Avançado.
 * Refatorado para usar submódulos.
 */

import { PHILOSOPHERS_DATA } from '../../../data/philosophers.js';
import { FlashcardState } from './study/FlashcardState.js';
import { talesCards } from '../../../data/study_content/tales_cards.js';

// Sub-modules
import { FlashcardHomeScreen } from './flashcards/screens/FlashcardHomeScreen.js';
import { FlashcardAnalyticsScreen } from './flashcards/screens/FlashcardAnalyticsScreen.js';
import { FlashcardReviewMode } from './flashcards/modes/FlashcardReviewMode.js';
import { FlashcardQuizMode } from './flashcards/modes/FlashcardQuizMode.js';
import { FlashcardMatchMode } from './flashcards/modes/FlashcardMatchMode.js';
import { FlashcardWriteMode } from './flashcards/modes/FlashcardWriteMode.js';

export const FlashcardReviewModule = {

    getHTML: (data) => {
        return `
            <div id="flashcard-root" class="fc-root">
                <!-- Conteúdo injetado via JS -->
            </div>
            
            <!-- Chart.js CDN -->
            <script>
                if (typeof Chart === 'undefined') {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
                    document.head.appendChild(script);
                }
            </script>

            <style>
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Cinzel:wght@700&display=swap');
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

                :root {
                    --fc-bg: #fdfbf7;
                    --fc-card: #ffffff;
                    --fc-primary: #5d4037;
                    --fc-secondary: #8d6e63;
                    --fc-accent: #d7ccc8;
                    --fc-text: #3e2723;
                    --fc-success: #66bb6a;
                    --fc-warning: #ffa726;
                    --fc-danger: #ef5350;
                    --fc-info: #42a5f5;
                    --shadow-sm: 0 4px 6px rgba(62, 39, 35, 0.05);
                    --shadow-lg: 0 10px 30px rgba(62, 39, 35, 0.1);
                    --radius: 16px;
                }

                .fc-root {
                    width: 100%; height: 100%;
                    background-color: var(--fc-bg);
                    color: var(--fc-text);
                    font-family: 'Outfit', sans-serif;
                    overflow: hidden;
                    display: flex; flex-direction: column;
                }

                /* --- HEADER --- */
                .fc-header {
                    padding: 1rem 2rem;
                    background: var(--fc-card);
                    border-bottom: 1px solid rgba(141, 110, 99, 0.1);
                    display: flex; justify-content: space-between; align-items: center;
                    box-shadow: var(--shadow-sm); z-index: 10;
                }
                .fc-brand h1 { font-family: 'Cinzel', serif; font-size: 1.5rem; margin: 0; color: var(--fc-primary); }
                .fc-brand span { font-size: 0.8rem; color: var(--fc-secondary); letter-spacing: 1px; text-transform: uppercase; }
                
                .fc-header-actions { display: flex; gap: 15px; align-items: center; }
                .fc-stat-pill {
                    background: var(--fc-bg); padding: 5px 12px; border-radius: 20px;
                    font-size: 0.85rem; font-weight: 600; color: var(--fc-secondary);
                    border: 1px solid var(--fc-accent); display: flex; align-items: center; gap: 8px;
                }
                .fc-btn-toggle {
                    background: var(--fc-primary); color: white; border: none;
                    padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer;
                    transition: 0.2s; display: flex; align-items: center; gap: 8px;
                }
                .fc-btn-toggle:hover { background: var(--fc-secondary); transform: translateY(-1px); }

                /* --- MAIN CONTENT AREA --- */
                .fc-content { flex: 1; overflow-y: auto; padding: 2rem; position: relative; }

                /* --- GAME AREA (Generic) --- */
                .fc-game-view { 
                    display: none; flex-direction: column; align-items: center; 
                    max-width: 800px; margin: 0 auto; height: 100%;
                }
                .fc-game-view.active { display: flex; animation: slideUp 0.3s; }
                
                .fc-game-header { width: 100%; display: flex; justify-content: space-between; margin-bottom: 2rem; }
                .fc-btn-back { background: none; border: none; font-size: 1.1rem; color: var(--fc-secondary); cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; }
                .fc-btn-back:hover { color: var(--fc-primary); }

                /* --- ANIMATIONS --- */
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            </style>
        `;
    },

    setupListeners: (element, data, popupManager) => {
        const root = element.querySelector('#flashcard-root');
        const philosopherId = data.philosopherId;
        const philosopher = PHILOSOPHERS_DATA[philosopherId];
        const deck = talesCards;
        const state = FlashcardState.loadState(philosopherId);

        // --- STATE ---
        let currentView = 'home'; // home, analytics, game
        let activeMode = null;
        let sessionData = { cards: [], index: 0, correct: 0 };

        // Prepare Cards Data for Analytics
        const cardsData = deck.map(card => {
            const cardState = state.cards[card.id] || {
                level: 0, interval: 0, easeFactor: 2.5, nextReview: 0, lastReview: 0, history: []
            };
            return {
                id: card.id,
                cat: "Filosofia",
                q: card.front,
                interval: cardState.interval,
                reps: cardState.level,
                lastReview: cardState.lastReview ? new Date(cardState.lastReview) : null,
                nextReview: cardState.nextReview,
                history: cardState.history || []
            };
        });

        // --- RENDERERS ---

        const renderHeader = () => {
            const stats = FlashcardState.getStats(philosopherId);
            return `
                <header class="fc-header">
                    <div class="fc-brand">
                        <h1>${philosopher.name}</h1>
                        <span>Estudo Mnemônico</span>
                    </div>
                    <div class="fc-header-actions">
                        <div class="fc-stat-pill"><i class="fas fa-fire"></i> ${stats.streak} Dias</div>
                        <div class="fc-stat-pill"><i class="fas fa-star"></i> ${stats.xp} XP</div>
                        <button class="fc-btn-toggle" id="btn-toggle-analytics">
                            <i class="fas fa-chart-pie"></i> ${currentView === 'analytics' ? 'Modos de Jogo' : 'Análise'}
                        </button>
                    </div>
                </header>
            `;
        };

        const renderMain = () => {
            root.innerHTML = renderHeader() + '<div class="fc-content" id="fc-content"></div>';
            const content = document.getElementById('fc-content');

            if (currentView === 'home') {
                content.innerHTML = FlashcardHomeScreen.render();
                FlashcardHomeScreen.setupListeners(content, (mode) => {
                    activeMode = mode;
                    currentView = 'game';
                    renderMain();
                });
            } else if (currentView === 'analytics') {
                content.innerHTML = FlashcardAnalyticsScreen.render();
                FlashcardAnalyticsScreen.initCharts(cardsData);
            } else if (currentView === 'game') {
                content.innerHTML = `<div class="fc-game-view active" id="fc-game-container"></div>`;
                startGame(activeMode);
            }

            document.getElementById('btn-toggle-analytics').onclick = () => {
                currentView = currentView === 'analytics' ? 'home' : 'analytics';
                renderMain();
            };
        };

        // --- GAME LOGIC ---

        const startGame = (mode) => {
            const container = document.getElementById('fc-game-container');

            let cards = [];
            if (mode === 'normal') cards = deck;
            else if (mode === 'quiz') cards = deck.filter(c => c.type === 'quiz' || (c.options && c.options.length > 0));
            else if (mode === 'match') cards = deck.filter(c => c.type === 'match' || c.pairs);
            else if (mode === 'write') cards = deck.filter(c => c.type === 'write' || c.type === 'normal');

            if (cards.length === 0) {
                container.innerHTML = `
                    <div style="text-align:center; padding:3rem;">
                        <h2>Modo Indisponível</h2>
                        <p>Não há cards compatíveis com este modo para este filósofo.</p>
                        <button class="fc-btn-toggle" onclick="document.getElementById('btn-back').click()">Voltar</button>
                    </div>
                `;
                // Add hidden back button for logic consistency or handle differently
                // But better to just render the header with back button even for empty state?
                // For now, keeping simple as per original logic, but adding the back button logic
                // Actually, the original code had a button that clicked a non-existent btn-back if not rendered.
                // Let's fix that slightly by rendering the header first.

                // Re-implementing structure to be safe
                container.innerHTML = `
                    <div class="fc-game-header">
                        <button class="fc-btn-back" id="btn-back"><i class="fas fa-arrow-left"></i> Sair</button>
                        <span style="font-weight:bold; color:var(--fc-secondary)">${mode.toUpperCase()}</span>
                        <span></span>
                    </div>
                    <div style="text-align:center; padding:3rem;">
                        <h2>Modo Indisponível</h2>
                        <p>Não há cards compatíveis com este modo para este filósofo.</p>
                    </div>
                `;
                document.getElementById('btn-back').onclick = () => {
                    currentView = 'home';
                    renderMain();
                };
                return;
            }

            sessionData = { cards: cards, index: 0, correct: 0 };

            container.innerHTML = `
                <div class="fc-game-header">
                    <button class="fc-btn-back" id="btn-back"><i class="fas fa-arrow-left"></i> Sair</button>
                    <span style="font-weight:bold; color:var(--fc-secondary)">${mode.toUpperCase()}</span>
                    <span id="game-progress">1 / ${cards.length}</span>
                </div>
                <div id="game-stage" style="width:100%;"></div>
            `;

            document.getElementById('btn-back').onclick = () => {
                currentView = 'home';
                renderMain();
            };

            renderGameStage(mode);
        };

        const renderGameStage = (mode) => {
            const stage = document.getElementById('game-stage');
            const card = sessionData.cards[sessionData.index];
            document.getElementById('game-progress').textContent = `${sessionData.index + 1} / ${sessionData.cards.length}`;

            if (!card) {
                stage.innerHTML = `
                    <div style="text-align:center; padding:3rem;">
                        <i class="fas fa-trophy" style="font-size:3rem; color:var(--fc-warning); margin-bottom:1rem;"></i>
                        <h2>Sessão Concluída!</h2>
                        <p>Você revisou ${sessionData.cards.length} cards.</p>
                        <button class="fc-btn-toggle" style="margin: 0 auto;" id="btn-finish">Voltar ao Menu</button>
                    </div>
                `;
                document.getElementById('btn-finish').onclick = () => { currentView = 'home'; renderMain(); };
                return;
            }

            const onNext = () => {
                sessionData.index++;
                renderGameStage(mode);
            };

            if (mode === 'quiz') {
                stage.innerHTML = FlashcardQuizMode.render(card);
                FlashcardQuizMode.setupListeners(card, onNext);
            } else if (mode === 'match') {
                stage.innerHTML = FlashcardMatchMode.render(card);
                FlashcardMatchMode.setupListeners(card, onNext);
            } else if (mode === 'write') {
                stage.innerHTML = FlashcardWriteMode.render(card);
                FlashcardWriteMode.setupListeners(card, onNext);
            } else if (mode === 'normal') {
                stage.innerHTML = FlashcardReviewMode.render(card, philosopherId);
                FlashcardReviewMode.setupListeners(card, philosopherId, onNext);
            }
        };

        // --- INIT ---
        renderMain();
    }
};
