export const FlashcardHomeScreen = {
    render: () => {
        return `
            <style>
                /* --- MODE SELECTION GRID --- */
                .fc-modes-container {
                    max-width: 1000px; margin: 0 auto;
                    display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 2rem; padding-top: 1rem;
                }
                .fc-mode-card {
                    background: var(--fc-card); border-radius: var(--radius);
                    padding: 2rem; text-align: center;
                    box-shadow: var(--shadow-sm); border: 2px solid transparent;
                    cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex; flex-direction: column; align-items: center; gap: 1rem;
                }
                .fc-mode-card:hover {
                    transform: translateY(-5px); box-shadow: var(--shadow-lg);
                    border-color: var(--fc-secondary);
                }
                .fc-mode-icon {
                    width: 70px; height: 70px; border-radius: 50%;
                    background: var(--fc-bg); color: var(--fc-primary);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 2rem; transition: 0.3s;
                }
                .fc-mode-card:hover .fc-mode-icon { background: var(--fc-primary); color: white; }
                .fc-mode-title { font-size: 1.2rem; font-weight: 800; color: var(--fc-primary); }
                .fc-mode-desc { font-size: 0.9rem; color: var(--fc-secondary); line-height: 1.4; }
                .fc-mode-badge {
                    background: var(--fc-accent); color: var(--fc-primary);
                    padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;
                }
            </style>
            <div class="fc-modes-container">
                <div class="fc-mode-card" data-mode="normal">
                    <div class="fc-mode-icon"><i class="fas fa-layer-group"></i></div>
                    <div class="fc-mode-title">Revisão Espaçada</div>
                    <div class="fc-mode-desc">O método clássico. Revise cards baseados na curva de esquecimento.</div>
                    <div class="fc-mode-badge">Recomendado</div>
                </div>
                <div class="fc-mode-card" data-mode="quiz">
                    <div class="fc-mode-icon"><i class="fas fa-question"></i></div>
                    <div class="fc-mode-title">Quiz Rápido</div>
                    <div class="fc-mode-desc">Múltipla escolha para testar seus conhecimentos agilmente.</div>
                </div>
                <div class="fc-mode-card" data-mode="match">
                    <div class="fc-mode-icon"><i class="fas fa-link"></i></div>
                    <div class="fc-mode-title">Associação</div>
                    <div class="fc-mode-desc">Conecte conceitos aos seus significados. Ótimo para vocabulário.</div>
                </div>
                <div class="fc-mode-card" data-mode="write">
                    <div class="fc-mode-icon"><i class="fas fa-pen-nib"></i></div>
                    <div class="fc-mode-title">Escrita</div>
                    <div class="fc-mode-desc">Digite a resposta exata. O teste definitivo de memória.</div>
                </div>
            </div>
        `;
    },

    setupListeners: (root, onModeSelect) => {
        root.querySelectorAll('.fc-mode-card').forEach(card => {
            card.onclick = () => {
                const mode = card.dataset.mode;
                if (onModeSelect) onModeSelect(mode);
            };
        });
    }
};
