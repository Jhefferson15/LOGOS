/**
 * StudyTools.js
 * Ferramentas compartilhadas: Tooltip e Search.
 */

export const StudyTools = {
    /**
     * Gerenciador de Tooltips (Balões de explicação)
     */
    Tooltip: {
        element: null,
        activeTerm: null,

        init: () => {
            if (document.getElementById('global-study-tooltip')) {
                StudyTools.Tooltip.element = document.getElementById('global-study-tooltip');
                return;
            }

            const tooltip = document.createElement('div');
            tooltip.id = 'global-study-tooltip';
            tooltip.style.cssText = `
                position: fixed;
                background: #3e2723;
                color: #fff;
                padding: 1rem;
                border-radius: 8px;
                font-size: 0.9rem;
                line-height: 1.4;
                width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                z-index: 99999;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.2s, visibility 0.2s;
                pointer-events: none;
                font-family: 'Lato', sans-serif;
                text-align: left;
            `;

            // Seta
            const arrow = document.createElement('div');
            arrow.className = 'tooltip-arrow';
            arrow.style.cssText = `
                position: absolute; bottom: -8px; left: 50%; margin-left: -8px;
                width: 0; height: 0; 
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 8px solid #3e2723;
            `;
            tooltip.appendChild(arrow);
            document.body.appendChild(tooltip);
            StudyTools.Tooltip.element = tooltip;
        },

        show: (target, term, explanation) => {
            const tooltip = StudyTools.Tooltip.element;
            if (!tooltip || !explanation) return;

            // Conteúdo
            tooltip.innerHTML = `<strong>${term.charAt(0).toUpperCase() + term.slice(1)}:</strong> ${explanation}`;

            // Recria seta (pois innerHTML limpa)
            const arrow = document.createElement('div');
            arrow.style.cssText = `
                position: absolute; bottom: -8px; left: 50%; margin-left: -8px;
                width: 0; height: 0; 
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 8px solid #3e2723;
            `;
            tooltip.appendChild(arrow);

            // Posicionamento
            const rect = target.getBoundingClientRect();
            const tooltipWidth = 300;
            const tooltipHeight = tooltip.offsetHeight || 100;

            let top = rect.top - tooltipHeight - 12;
            let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);

            // Limites da tela
            if (left < 10) left = 10;
            if (left + tooltipWidth > window.innerWidth - 10) left = window.innerWidth - tooltipWidth - 10;

            // Inverte se não couber em cima
            if (top < 10) {
                top = rect.bottom + 12;
                arrow.style.top = '-8px';
                arrow.style.bottom = 'auto';
                arrow.style.borderTop = 'none';
                arrow.style.borderBottom = '8px solid #3e2723';
            }

            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        },

        hide: () => {
            const tooltip = StudyTools.Tooltip.element;
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            }
        }
    },

    /**
     * Overlay de Pesquisa
     */
    Search: {
        setup: (rootElement, studyData, onNavigate) => {
            const searchOverlay = rootElement.querySelector('#search-overlay');
            const searchInput = rootElement.querySelector('#search-input');
            const searchResults = rootElement.querySelector('#search-results');
            const btnCloseSearch = rootElement.querySelector('#btn-close-search');

            if (!searchOverlay || !searchInput) return;

            const toggle = (show) => {
                if (show) {
                    searchOverlay.classList.add('active');
                    searchInput.focus();
                } else {
                    searchOverlay.classList.remove('active');
                    searchInput.value = '';
                    searchResults.innerHTML = '';
                }
            };

            btnCloseSearch.onclick = () => toggle(false);

            searchInput.oninput = (e) => {
                const query = e.target.value.toLowerCase();
                if (query.length < 3) return;

                const results = [];
                Object.entries(studyData.pages).forEach(([pageNum, content]) => {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = content;
                    const text = tempDiv.textContent || tempDiv.innerText || "";

                    if (text.toLowerCase().includes(query)) {
                        const index = text.toLowerCase().indexOf(query);
                        const start = Math.max(0, index - 40);
                        const end = Math.min(text.length, index + query.length + 40);
                        let snippet = text.substring(start, end);
                        const regex = new RegExp(query, 'gi');
                        snippet = snippet.replace(regex, match => `<span class="highlight">${match}</span>`);

                        results.push({ page: pageNum, snippet: `...${snippet}...` });
                    }
                });

                searchResults.innerHTML = results.length ? results.map(r => `
                    <div class="search-result-item" data-page="${r.page}">
                        <div class="result-page" style="color:#8d6e63; font-weight:bold;">Página ${r.page}</div>
                        <div class="result-snippet" style="color:#5d4037;">${r.snippet}</div>
                    </div>
                `).join('') : '<div style="text-align:center">Nenhum resultado.</div>';

                searchResults.querySelectorAll('.search-result-item').forEach(item => {
                    item.onclick = () => {
                        onNavigate(parseInt(item.dataset.page));
                        toggle(false);
                    };
                });
            };

            return { toggle };
        }
    }
};
