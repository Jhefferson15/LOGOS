export const FlashcardMatchMode = {
    render: (card) => {
        const pairs = card.pairs || [];
        let items = [];
        pairs.forEach((p, i) => {
            items.push({ id: i, text: p.term, type: 'term' });
            items.push({ id: i, text: p.def, type: 'def' });
        });
        items.sort(() => Math.random() - 0.5);

        return `
            <style>
                /* --- MATCH MODE --- */
                .match-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; width: 100%; }
                .match-item {
                    padding: 1.5rem; background: var(--fc-card); border: 2px solid var(--fc-accent);
                    border-radius: 10px; cursor: pointer; text-align: center; font-weight: 600;
                    transition: 0.2s; display: flex; align-items: center; justify-content: center; min-height: 80px;
                }
                .match-item:hover { border-color: var(--fc-secondary); transform: translateY(-2px); }
                .match-item.selected { border-color: var(--fc-info); background: #e3f2fd; }
                .match-item.matched { border-color: var(--fc-success); background: #e8f5e9; opacity: 0.5; pointer-events: none; }
            </style>
            <div class="quiz-card">
                <div class="quiz-question">${card.front}</div>
                <div class="match-grid">
                    ${items.map((item, i) => `
                        <div class="match-item" data-id="${item.id}" data-idx="${i}">${item.text}</div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    setupListeners: (card, onNext) => {
        const totalPairs = card.pairs ? card.pairs.length : 0;
        let selected = null;
        let matches = 0;

        document.querySelectorAll('.match-item').forEach(item => {
            item.onclick = () => {
                if (item.classList.contains('matched')) return;
                if (!selected) {
                    selected = item;
                    item.classList.add('selected');
                } else {
                    if (selected === item) {
                        selected.classList.remove('selected');
                        selected = null;
                        return;
                    }
                    const id1 = selected.dataset.id;
                    const id2 = item.dataset.id;
                    if (id1 === id2) {
                        selected.classList.remove('selected');
                        selected.classList.add('matched');
                        item.classList.add('matched');
                        selected = null;
                        matches++;
                        if (matches === totalPairs) {
                            setTimeout(() => {
                                if (onNext) onNext();
                            }, 1000);
                        }
                    } else {
                        selected.classList.add('wrong');
                        item.classList.add('wrong');
                        setTimeout(() => {
                            selected.classList.remove('selected', 'wrong');
                            item.classList.remove('wrong');
                            selected = null;
                        }, 500);
                    }
                }
            };
        });
    }
};
