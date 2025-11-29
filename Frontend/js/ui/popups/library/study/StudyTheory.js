/**
 * StudyTheory.js
 * Módulo responsável pela aba de Teoria (Texto).
 */
import { StudyState } from './StudyState.js';
import { StudyTools } from './StudyTools.js';

export const StudyTheory = {
    /**
     * Renderiza o texto da teoria.
     */
    render: (container, data, state) => {
        const pageContent = data.pages[state.textPage];
        const processedHtml = StudyTheory._processTextWithExplanations(pageContent, data.explanation);

        container.innerHTML = `
            <div class="text-scroll-area">
                <div class="text-content-wrapper">
                    <div class="text-content animate__animated animate__fadeIn">
                        ${processedHtml}
                    </div>
                </div>
            </div>`;

        StudyTheory._applyStyles(container, state);
    },

    /**
     * Renderiza a toolbar específica de teoria.
     */
    renderToolbar: (container, state, onUpdate) => {
        container.innerHTML = `
            <div class="tool-group">
                <span class="tool-label">Fonte</span>
                <button class="tool-btn" id="cmd-font-serif" title="Serifa" style="font-family:'Merriweather', serif; font-weight:bold;">T</button>
                <button class="tool-btn" id="cmd-font-sans" title="Sem Serifa" style="font-family:'Lato', sans-serif;">T</button>
            </div>
            <div class="tool-group" style="margin-left: 0px; border-left: 1px solid #eee; padding-left: 0px;">
                <span class="tool-label">Tamanho</span>
                <button class="tool-btn" id="cmd-size-down"><i class="fas fa-minus"></i></button>
                <span class="tool-label" id="lbl-size" style="min-width: 0px; text-align: center;">${state.textSize}px</span>
                <button class="tool-btn" id="cmd-size-up"><i class="fas fa-plus"></i></button>
            </div>
            <div class="tool-group" style="margin-left: auto;">
                <button class="tool-btn" id="cmd-search-toolbar" title="Pesquisar Texto">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        `;

        // Event Listeners da Toolbar
        container.querySelector('#cmd-font-serif').onclick = () => onUpdate({ fontFamily: 'serif' });
        container.querySelector('#cmd-font-sans').onclick = () => onUpdate({ fontFamily: 'sans' });
        container.querySelector('#cmd-size-up').onclick = () => {
            if (state.textSize < 28) onUpdate({ textSize: state.textSize + 2 });
        };
        container.querySelector('#cmd-size-down').onclick = () => {
            if (state.textSize > 14) onUpdate({ textSize: state.textSize - 2 });
        };

        // O botão de search é tratado externamente ou via evento customizado se preferir,
        // mas aqui vamos assumir que o orquestrador lida com a abertura do search overlay
        // ou disparamos um evento.
        container.querySelector('#cmd-search-toolbar').onclick = () => {
            document.dispatchEvent(new CustomEvent('study-search-toggle', { detail: { show: true } }));
        };

        StudyTheory._updateToolbarStyles(container, state);
    },

    setup: (container) => {
        // Tooltips
        container.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('explainable')) {
                // Precisamos da explicação. Como não temos 'data' aqui direto no evento,
                // pegamos do DOM ou usamos o StudyTools globalmente se ele tiver acesso.
                // Melhor: O render já injetou o termo. O StudyTools.show precisa da explicação.
                // Vamos assumir que o orquestrador injetou a explicação no dataset ou temos acesso.
                // Simplificação: O render pode injetar a explicação no title ou data-explanation se for curta,
                // ou buscamos no data global.
                // Vamos usar um evento customizado para pedir a explicação ao pai, ou acessar via window/global se necessário.
                // Mas o ideal é o StudyTools ter sido inicializado.

                // HACK: Para manter simples, vamos disparar evento para o pai mostrar tooltip
                const term = e.target.dataset.term;
                document.dispatchEvent(new CustomEvent('study-show-tooltip', {
                    detail: { target: e.target, term: term }
                }));
            }
        });
        container.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('explainable')) {
                StudyTools.Tooltip.hide();
            }
        });
    },

    _processTextWithExplanations: (text, explanations) => {
        if (!text || !explanations) return text || "";
        let processedText = text;
        const terms = Object.keys(explanations).sort((a, b) => b.length - a.length);
        terms.forEach(term => {
            const regex = new RegExp(`(?<!<[^>]*)\\b(${term})\\b`, 'gi');
            processedText = processedText.replace(regex, `<span class="explainable" data-term="${term}" style="border-bottom: 2px dotted #8d6e63; cursor: help;">$&</span>`);
        });
        return processedText;
    },

    _applyStyles: (container, state) => {
        const textContent = container.querySelector('.text-content');
        if (textContent) {
            textContent.style.fontSize = `${state.textSize}px`;
            textContent.style.fontFamily = state.fontFamily === 'serif' ? "'Merriweather', serif" : "'Lato', sans-serif";
        }
    },

    _updateToolbarStyles: (container, state) => {
        const btnSerif = container.querySelector('#cmd-font-serif');
        const btnSans = container.querySelector('#cmd-font-sans');
        if (btnSerif && btnSans) {
            btnSerif.style.background = state.fontFamily === 'serif' ? '#efebe9' : 'transparent';
            btnSans.style.background = state.fontFamily === 'sans' ? '#efebe9' : 'transparent';
        }
    }
};
