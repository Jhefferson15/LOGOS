import { PHILOSOPHERS_DATA } from '../../../data/philosophers.js';
import { gameState } from '../../../data/gameState.js';
import { toast } from '../../Toast.js';
import { SoundManager } from '../../../game/modules/audio.js';

const MAX_DECK_SIZE = 8;
const MIN_DECK_SIZE = 4;

export const DeckBuilderPopup = {
    title: 'Monte seu Time',

    getHTML: (data) => {
        const ownedPhilosopherIds = Object.keys(PHILOSOPHERS_DATA);
        const currentDeck = gameState.playerDeck || [];

        // Gera a grade de coleção
        const philosopherCardsHTML = ownedPhilosopherIds.map(id => {
            const philosopher = PHILOSOPHERS_DATA[id];
            // Verifica se está no deck para aplicar estilo visual (ex: opacity)
            const isSelected = currentDeck.includes(parseInt(id));

            return `
                <div class="philosopher-card-wrapper ${isSelected ? 'in-deck' : ''}" data-philosopher-id="${id}">
                    <div class="philosopher-card-inner">
                        <div class="card-img" style="background-image: url('${philosopher.image}')"></div>
                        <div class="card-info">
                            <span class="card-name">${philosopher.name}</span>
                        </div>
                        ${isSelected ? '<div class="selected-badge">✓</div>' : ''}
                    </div>
                </div>
            `;
        }).join('');

        // Gera os slots do rodapé (Deck Tray)
        const deckSlotsHTML = Array(MAX_DECK_SIZE).fill(0).map((_, index) => {
            const philosopherId = currentDeck[index];
            const philosopher = philosopherId ? PHILOSOPHERS_DATA[philosopherId] : null;

            return `
                <div class="deck-slot ${philosopher ? 'filled' : 'empty'}" data-slot-index="${index}" data-id="${philosopherId || ''}">
                    ${philosopher ? `
                        <div class="mini-card-img" style="background-image: url('${philosopher.image}')"></div>
                        <button class="remove-btn" aria-label="Remover">&times;</button>
                    ` : '<span class="plus-icon">+</span>'}
                </div>
            `;
        }).join('');

        return `
            <div class="deck-builder-container">
                <!-- Área Superior: Coleção (Scroll Vertical) -->
                <div class="collection-area">
                    <div class="collection-header">
                        <h3>Coleção Disponível</h3>
                        <p class="hint-text">Toque para adicionar</p>
                    </div>
                    <div class="philosopher-grid">
                        ${philosopherCardsHTML}
                    </div>
                </div>

                <!-- Área Inferior: Deck (Fixo/Sticky) -->
                <div class="deck-tray-area">
                    <div class="deck-header-info">
                        <span class="deck-count-label">Seu Time: <b id="deck-count">${currentDeck.length}/${MAX_DECK_SIZE}</b></span>
                        <span class="deck-validation-msg">Min: ${MIN_DECK_SIZE}</span>
                    </div>
                    
                    <div class="deck-slots-scroll">
                        ${deckSlotsHTML}
                    </div>

                    <div class="action-area">
                        <button id="confirm-deck-btn" class="btn-confirm" disabled>SALVAR TIME</button>
                    </div>
                </div>
            </div>
            <!-- Sugestão: Mova esse CSS para um arquivo separado na produção -->
            <style>${MOBILE_CSS}</style> 
        `;
    },

    setupListeners: (element, data, popupManager) => {
        let currentDeck = [...(gameState.playerDeck || [])];

        const philosopherGrid = element.querySelector('.philosopher-grid');
        const deckSlotsContainer = element.querySelector('.deck-slots-scroll');
        const deckCountSpan = element.querySelector('#deck-count');
        const confirmDeckBtn = element.querySelector('#confirm-deck-btn');
        const validationMsg = element.querySelector('.deck-validation-msg');

        const updateUI = () => {
            // 1. Atualiza visual da coleção (marca quem já foi escolhido)
            philosopherGrid.querySelectorAll('.philosopher-card-wrapper').forEach(card => {
                const id = parseInt(card.dataset.philosopherId);
                const isSelected = currentDeck.includes(id);

                card.classList.toggle('in-deck', isSelected);

                // Atualiza o badge visualmente se necessário
                const existingBadge = card.querySelector('.selected-badge');
                if (isSelected && !existingBadge) {
                    card.querySelector('.philosopher-card-inner').insertAdjacentHTML('beforeend', '<div class="selected-badge">✓</div>');
                } else if (!isSelected && existingBadge) {
                    existingBadge.remove();
                }
            });

            // 2. Atualiza os slots do rodapé
            deckSlotsContainer.innerHTML = Array(MAX_DECK_SIZE).fill(0).map((_, index) => {
                const philosopherId = currentDeck[index];
                const philosopher = philosopherId ? PHILOSOPHERS_DATA[philosopherId] : null;
                return `
                    <div class="deck-slot ${philosopher ? 'filled' : 'empty'}" data-slot-index="${index}" data-id="${philosopherId || ''}">
                        ${philosopher ? `
                            <div class="mini-card-img" style="background-image: url('${philosopher.image}')"></div>
                            <button class="remove-btn">&times;</button>
                        ` : '<span class="plus-icon">+</span>'}
                    </div>
                `;
            }).join('');

            // 3. Validação e Botão
            const count = currentDeck.length;
            deckCountSpan.textContent = `${count}/${MAX_DECK_SIZE}`;

            const isValid = count >= MIN_DECK_SIZE && count <= MAX_DECK_SIZE;
            confirmDeckBtn.disabled = !isValid;
            confirmDeckBtn.classList.toggle('btn-active', isValid);

            validationMsg.style.color = isValid ? '#4caf50' : '#ff5252';
            validationMsg.textContent = isValid ? 'Pronto!' : `Mínimo: ${MIN_DECK_SIZE}`;
        };

        // Listener: Adicionar da Coleção
        philosopherGrid.addEventListener('click', e => {
            const card = e.target.closest('.philosopher-card-wrapper');
            if (!card) return;

            const id = parseInt(card.dataset.philosopherId);
            const indexInDeck = currentDeck.indexOf(id);

            if (indexInDeck > -1) {
                // Já está no deck, removemos
                currentDeck.splice(indexInDeck, 1);
                SoundManager.play('error'); // ou som de remover
            } else {
                // Adiciona
                if (currentDeck.length < MAX_DECK_SIZE) {
                    currentDeck.push(id);
                    SoundManager.play('button_click');

                    // Pequena animação de feedback visual poderia entrar aqui
                } else {
                    toast.show(`Máximo de ${MAX_DECK_SIZE} filósofos atingido.`, 'error');
                    return;
                }
            }
            updateUI();
        });

        // Listener: Remover do Deck Tray (clicando no slot ou no botão x)
        deckSlotsContainer.addEventListener('click', e => {
            const slot = e.target.closest('.deck-slot');
            if (!slot || !slot.classList.contains('filled')) return;

            const id = parseInt(slot.dataset.id);
            const indexInDeck = currentDeck.indexOf(id);

            if (indexInDeck > -1) {
                currentDeck.splice(indexInDeck, 1);
                SoundManager.play('error');
                updateUI();
            }
        });

        confirmDeckBtn.addEventListener('click', () => {
            gameState.playerDeck = [...currentDeck];
            toast.show('Time salvo!', 'success');
            popupManager.close();
            document.dispatchEvent(new CustomEvent('deck-updated'));
        });

        updateUI();
    }
};

// CSS INLINE PARA FACILITAR A IMPLEMENTAÇÃO (Copie para seu arquivo .css se preferir)
const MOBILE_CSS = `
    .deck-builder-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        max-height: 80vh; /* Garante que caiba na tela sem estourar o modal */
        background: #f5f5f5;
        color: #333;
        border-radius: 8px;
        overflow: hidden;
        font-family: sans-serif;
    }

    /* --- ÁREA DA COLEÇÃO (Topo) --- */
    .collection-area {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        background: #fff;
    }

    .collection-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .collection-header h3 { margin: 0; font-size: 1rem; }
    .hint-text { font-size: 0.75rem; color: #888; margin: 0; }

    .philosopher-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); /* Cards responsivos */
        gap: 10px;
        padding-bottom: 20px;
    }

    /* Card na Coleção */
    .philosopher-card-wrapper {
        aspect-ratio: 3/4;
        position: relative;
        cursor: pointer;
        transition: transform 0.1s;
    }
    
    .philosopher-card-wrapper:active { transform: scale(0.95); }

    .philosopher-card-inner {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        background: #eee;
        border: 2px solid transparent;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .card-img {
        flex: 1;
        background-size: cover;
        background-position: center top;
    }

    .card-info {
        height: 24px;
        background: rgba(0,0,0,0.8);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        text-align: center;
        line-height: 1;
    }

    /* Estado Selecionado */
    .philosopher-card-wrapper.in-deck .philosopher-card-inner {
        border-color: #4caf50;
        filter: brightness(0.9);
    }
    
    .selected-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #4caf50;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        z-index: 2;
    }

    /* --- ÁREA DO DECK (Rodapé) --- */
    .deck-tray-area {
        flex: 0 0 auto; /* Não estica, altura baseada no conteúdo */
        background: #2c3e50;
        color: white;
        padding: 10px;
        box-shadow: 0 -4px 10px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        gap: 8px;
        z-index: 10;
    }

    .deck-header-info {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
    }
    
    .deck-validation-msg { font-size: 0.75rem; font-weight: bold; }

    /* Scroll Horizontal dos Slots */
    .deck-slots-scroll {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding-bottom: 5px;
        -webkit-overflow-scrolling: touch; /* Smooth scroll no iOS */
    }

    /* Esconde a barra de rolagem mas mantém funcional */
    .deck-slots-scroll::-webkit-scrollbar { height: 4px; }
    .deck-slots-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }

    .deck-slot {
        flex: 0 0 60px; /* Largura fixa para mobile */
        height: 60px;
        background: rgba(0,0,0,0.3);
        border: 1px dashed rgba(255,255,255,0.3);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .deck-slot.filled {
        border: 1px solid #4caf50;
        background: #fff;
        overflow: hidden;
    }

    .mini-card-img {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center top;
    }

    .plus-icon { font-size: 1.5rem; color: rgba(255,255,255,0.5); }

    .remove-btn {
        position: absolute;
        top: 0;
        right: 0;
        background: rgba(255,0,0,0.8);
        color: white;
        border: none;
        width: 20px;
        height: 20px;
        line-height: 1;
        cursor: pointer;
        font-size: 14px;
        border-bottom-left-radius: 4px;
    }

    .action-area { margin-top: 5px; }

    .btn-confirm {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 6px;
        background: #555;
        color: #ccc;
        font-weight: bold;
        text-transform: uppercase;
        cursor: not-allowed;
        transition: all 0.3s;
    }

    .btn-confirm.btn-active {
        background: #4caf50;
        color: white;
        cursor: pointer;
        box-shadow: 0 4px 0 #388e3c;
    }
    
    .btn-confirm.btn-active:active {
        transform: translateY(2px);
        box-shadow: 0 2px 0 #388e3c;
    }
`;