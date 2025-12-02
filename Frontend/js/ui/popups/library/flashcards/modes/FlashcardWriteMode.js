export const FlashcardWriteMode = {
    render: (card) => {
        return `
            <style>
                /* --- WRITE MODE --- */
                .write-container { width: 100%; max-width: 600px; display: flex; flex-direction: column; gap: 1.5rem; }
                .write-input {
                    padding: 1rem; font-size: 1.2rem; border: 2px solid var(--fc-accent);
                    border-radius: 10px; outline: none; font-family: 'Outfit', sans-serif;
                }
                .write-input:focus { border-color: var(--fc-secondary); }
                .write-feedback { padding: 1rem; border-radius: 10px; display: none; }
                .write-feedback.correct { background: #e8f5e9; color: #2e7d32; display: block; }
                .write-feedback.wrong { background: #ffebee; color: #c62828; display: block; }
            </style>
            <div class="quiz-card">
                <div class="quiz-question">${card.front}</div>
                <div class="write-container" style="margin: 0 auto;">
                    <input type="text" class="write-input" placeholder="Digite sua resposta..." id="write-input">
                    <button class="fc-btn-toggle" id="btn-check-write" style="justify-content:center;">Verificar</button>
                    <div class="write-feedback" id="write-feedback"></div>
                </div>
            </div>
        `;
    },

    setupListeners: (card, onNext) => {
        const checkBtn = document.getElementById('btn-check-write');
        const input = document.getElementById('write-input');

        const check = () => {
            const val = input.value.trim().toLowerCase();
            const answers = Array.isArray(card.answer) ? card.answer.map(a => a.toLowerCase()) : [card.answer.toLowerCase()];
            if (!card.answer && card.back) answers.push(card.back.toLowerCase());

            const isCorrect = answers.some(a => val === a || (val.length > 5 && a.includes(val)));

            const fb = document.getElementById('write-feedback');
            fb.innerHTML = isCorrect ?
                `<strong>Correto!</strong><br>${card.back || ''}` :
                `<strong>Incorreto.</strong><br>Resposta: ${answers[0]}<br>${card.back || ''}`;
            fb.className = `write-feedback ${isCorrect ? 'correct' : 'wrong'}`;

            checkBtn.textContent = 'Próximo';
            checkBtn.onclick = () => {
                if (onNext) onNext();
            };
        };

        checkBtn.onclick = check;
        input.onkeypress = (e) => { if (e.key === 'Enter') check(); };
    }
};
