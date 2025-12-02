export const FlashcardQuizMode = {
    render: (card) => {
        return `
            <style>
                /* --- QUIZ MODE --- */
                .quiz-card {
                    background: var(--fc-card); padding: 2rem; border-radius: var(--radius);
                    box-shadow: var(--shadow-lg); width: 100%; text-align: center;
                }
                .quiz-question { font-size: 1.4rem; font-weight: 600; margin-bottom: 2rem; color: var(--fc-text); }
                .quiz-options { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .quiz-btn {
                    padding: 1rem; border: 2px solid var(--fc-accent); background: white;
                    border-radius: 10px; cursor: pointer; font-weight: 600; color: var(--fc-primary);
                    transition: 0.2s; text-align: left;
                }
                .quiz-btn:hover { border-color: var(--fc-secondary); background: var(--fc-bg); }
                .quiz-btn.correct { background: var(--fc-success); color: white; border-color: var(--fc-success); }
                .quiz-btn.wrong { background: var(--fc-danger); color: white; border-color: var(--fc-danger); }
                
                @media (max-width: 900px) {
                    .quiz-options { grid-template-columns: 1fr; }
                }
            </style>
            <div class="quiz-card">
                <div class="quiz-question">${card.front}</div>
                <div class="quiz-options">
                    ${card.options.map((opt, i) => `
                        <button class="quiz-btn" data-idx="${i}">${opt}</button>
                    `).join('')}
                </div>
            </div>
        `;
    },

    setupListeners: (card, onNext) => {
        const handleQuizAnswer = (btn) => {
            const idx = parseInt(btn.dataset.idx);
            const isCorrect = idx === card.answer;
            btn.classList.add(isCorrect ? 'correct' : 'wrong');
            if (!isCorrect) {
                const correctBtn = btn.parentElement.querySelector(`button[data-idx="${card.answer}"]`);
                if (correctBtn) correctBtn.classList.add('correct');
            }
            setTimeout(() => {
                if (onNext) onNext();
            }, 1500);
        };

        document.querySelectorAll('.quiz-btn').forEach(btn => {
            btn.onclick = () => handleQuizAnswer(btn);
        });
    }
};
