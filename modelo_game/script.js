'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // --- CONSTANTES DE CONFIGURAÇÃO ---
    const ELIXIR_TICK_RATE = 280;
    const OPPONENT_UPDATE_RATE = 3500;
    const OPPONENT_PLAY_DELAY = 1500; // Delay para o oponente "pensar"
    const MAX_ELIXIR = 10;
    const ELIXIR_PER_TICK = 0.1;

    // Definição de Cores e Tipos de Carta como um enum
    const CardColors = {
        RED: 'red',
        GREEN: 'green',
        BLUE: 'blue',
        YELLOW: 'yellow',
        WILD: 'wild'
    };

    // Baralho de cartas reestruturado com cores, valores e descrições
    const CARD_DECK_BASE = [
        { value: 'Skip', color: CardColors.RED, cost: 5, description: 'O próximo jogador perde a vez.' },
        { value: 'Reverse', color: CardColors.GREEN, cost: 5, description: 'Inverte a direção do jogo.' },
        { value: '+2', color: CardColors.BLUE, cost: 6, description: 'O próximo jogador compra 2 cartas e perde a vez.' },
        { value: 'Wild', color: CardColors.WILD, cost: 8, description: 'Muda a cor atual para a de sua escolha.' },
        { value: 'Wild+4', color: CardColors.WILD, cost: 10, description: 'Muda a cor e força o próximo jogador a comprar 4 cartas.' }
    ];
    // Adiciona cartas numéricas programaticamente
    ['1','2','3','4','5','6','7','8','9'].forEach(num => {
        ['red','green','blue','yellow'].forEach(color => {
            CARD_DECK_BASE.push({ value: num, color: color, cost: parseInt(num), description: `Uma carta ${color} com valor ${num}.` });
        });
    });

    // Dados dos Jogadores/Oponentes
    const PLAYER_DATA = {
        'player-main': { name: 'Você', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path></svg>' },
        'player-nietzsche': { name: 'Nietzsche', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
        'player-hipatia': { name: 'Hipátia', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
        'player-confucio': { name: 'Confúcio', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' }
    };

    // --- MÓDULO DA UI DO JOGO ---
    const GameUI = {
        state: {},
        elements: {},

        init() {
            this.initializeState();
            this.cacheDOMElements();
            this.renderPlayers(); // Configura nomes/avatares estáticos
            this.bindEventListeners();
            this.render(); // Renderiza o estado inicial do jogo
            this.startDynamicUpdates();
        },

        initializeState() {
            const playerIds = ['player-main', 'player-hipatia', 'player-nietzsche', 'player-confucio'];
            
            const gameDeck = this.shuffleArray([...CARD_DECK_BASE, ...CARD_DECK_BASE]); // Deck de jogo
            
            // Distribuindo cartas iniciais
            const initialHand = gameDeck.splice(0, 4);
            const nextCard = gameDeck.pop();
            const firstCardOnPile = gameDeck.pop();

            this.state = {
                isAnimating: false,
                elements: {
                    // Posições e tamanhos dos elementos do tabuleiro
                    "player-main": { "left": { "value": 50, "unit": "%" }, "top": { "value": 88, "unit": "%" }, "width": { "value": 70, "unit": "px" }, "height": { "value": 100, "unit": "px" }, "translateX": { "value": -50, "unit": "%" }, "translateY": { "value": -50, "unit": "%" }, "scale": { "value": 1 }, "rotate": { "value": 0 }, "zIndex": { "value": 1 } },
                    "player-nietzsche": { "left": { "value": 50, "unit": "%" }, "top": { "value": 15, "unit": "%" }, "width": { "value": 60, "unit": "px" }, "height": { "value": 100, "unit": "px" }, "translateX": { "value": -50, "unit": "%" }, "translateY": { "value": -50, "unit": "%" }, "scale": { "value": 1 }, "rotate": { "value": 0 }, "zIndex": { "value": 1 } },
                    "player-hipatia": { "left": { "value": 15, "unit": "%" }, "top": { "value": 35, "unit": "%" }, "width": { "value": 60, "unit": "px" }, "height": { "value": 100, "unit": "px" }, "translateX": { "value": -50, "unit": "%" }, "translateY": { "value": -50, "unit": "%" }, "scale": { "value": 1 }, "rotate": { "value": 0 }, "zIndex": { "value": 1 } },
                    "player-confucio": { "left": { "value": 85, "unit": "%" }, "top": { "value": 35, "unit": "%" }, "width": { "value": 60, "unit": "px" }, "height": { "value": 100, "unit": "px" }, "translateX": { "value": -50, "unit": "%" }, "translateY": { "value": -50, "unit": "%" }, "scale": { "value": 1 }, "rotate": { "value": 0 }, "zIndex": { "value": 1 } },
                    "bottom-hud": { "left": { "value": 0, "unit": "px" }, "top": { "value": 100, "unit": "%" }, "width": { "value": 100, "unit": "%" }, "height": { "value": 20, "unit": "%" }, "translateX": { "value": 0, "unit": "px" }, "translateY": { "value": -100, "unit": "%" }, "scale": { "value": 1 }, "rotate": { "value": 0 }, "zIndex": { "value": 100 } },
                    "curved-hand-container": { "left": { "value": 50, "unit": "%" }, "top": { "value": 75, "unit": "%" }, "width": { "value": 10, "unit": "%" }, "height": { "value": 10, "unit": "%" }, "translateX": { "value": -50, "unit": "%" }, "translateY": { "value": -50, "unit": "%" }, "scale": { "value": 1 }, "rotate": { "value": 0 }, "zIndex": { "value": 50 } },
                    "cr-hand": { "left": { "value": 57, "unit": "%" }, "top": { "value": 50, "unit": "%" }, "width": { "value": 80, "unit": "%" }, "height": { "value": 90, "unit": "%" }, "translateX": { "value": -50, "unit": "%" }, "translateY": { "value": -50, "unit": "%" }, "scale": { "value": 1 }, "rotate": { "value": 0 }, "zIndex": { "value": 102 } },
                    "next-card-preview": { "left": { "value": 10, "unit": "%" }, "top": { "value": 65, "unit": "%" }, "width": { "value": 70, "unit": "px" }, "height": { "value": 85, "unit": "px" }, "translateX": { "value": -50, "unit": "%" }, "translateY": { "value": -50, "unit": "%" }, "scale": { "value": 1 }, "rotate": { "value": 0 }, "zIndex": { "value": 103 } },
                    "elixir-bar-container": { "left": { "value": 50, "unit": "%" }, "top": { "value": 95, "unit": "%" }, "width": { "value": 85, "unit": "%" }, "height": { "value": 2.5, "unit": "%" }, "translateX": { "value": -50, "unit": "%" }, "translateY": { "value": -50, "unit": "%" }, "scale": { "value": 1 }, "rotate": { "value": 0 }, "zIndex": { "value": 101 } }
                },
                game: {
                    lastPlayedCard: firstCardOnPile,
                    drawDeck: gameDeck,
                    playerOrder: playerIds,
                    currentPlayerIndex: 0,
                    get currentPlayerId() {
                        return this.playerOrder[this.currentPlayerIndex];
                    }
                },
                curvedHand: { "cardCount": 7, "pivotX": 50, "pivotY": 150, "angularSpread": 15, "cards": gameDeck.slice(-7) }, // Apenas visual
                bottomHud: {
                    collapsed: false,
                    elixir: 0,
                    cardWidth: 70,
                    cardHeight: 85,
                    cardSpacing: 10,
                    handCards: initialHand,
                    nextCard: nextCard,
                },
                opponents: {
                    'player-nietzsche': { handSize: 7 },
                    'player-hipatia': { handSize: 7 },
                    'player-confucio': { handSize: 7 }
                }
            };
        },

        cacheDOMElements() {
            this.elements = {
                hudToggle: document.getElementById('hud-toggle'),
                bottomHud: document.getElementById('bottom-hud'),
                curvedHandContainer: document.getElementById('curved-hand-container'),
                nextCardContainer: document.querySelector('#next-card'),
                crHandContainer: document.querySelector('#cr-hand'),
                elixirBarFill: document.getElementById('elixir-bar-fill'),
                elixirText: document.getElementById('elixir-text'),
                centerArea: document.getElementById('center-area'),
                playerAreas: document.querySelectorAll('.player-area'),
                deckCount: document.getElementById('deck-count'),
                drawDeck: document.getElementById('draw-deck'),
                tooltip: document.getElementById('card-tooltip'),
                tooltipTitle: document.getElementById('tooltip-title'),
                tooltipDescription: document.getElementById('tooltip-description')
            };
            for (const id in this.state.elements) {
                this.elements[id] = document.getElementById(id);
            }
        },

        bindEventListeners() {
            this.elements.hudToggle.addEventListener('click', () => {
                this.state.bottomHud.collapsed = !this.state.bottomHud.collapsed;
                this.renderBottomHud();
            });
            this.elements.drawDeck.addEventListener('click', () => {
                if (this.state.game.currentPlayerId === 'player-main' && !this.state.isAnimating) {
                    this.playerDrawsCard();
                }
            });
        },
        
        // --- FUNÇÕES UTILITÁRIAS ---
        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },

        drawCard() {
            const game = this.state.game;
            if (game.drawDeck.length === 0) {
                console.warn("Deck vazio!");
                // TODO: Lógica para reembaralhar o descarte
                return null;
            }
            return game.drawDeck.pop();
        },

        // --- LÓGICA DE JOGO ---
        isCardPlayable(card) {
            const lastPlayed = this.state.game.lastPlayedCard;
            if (!lastPlayed) return true;
            if (card.color === CardColors.WILD) return true;
            return card.color === lastPlayed.color || card.value === lastPlayed.value;
        },

        async playCard(cardIndex) {
            if (this.state.isAnimating) return;
            if (this.state.game.currentPlayerId !== 'player-main') return;

            const hand = this.state.bottomHud.handCards;
            const cardToPlay = hand[cardIndex];

            if (!this.isCardPlayable(cardToPlay)) {
                this.elements.crHandContainer.children[cardIndex].classList.add('invalid-shake');
                setTimeout(() => {
                    this.elements.crHandContainer.children[cardIndex].classList.remove('invalid-shake');
                }, 500);
                return;
            }

            this.state.isAnimating = true;
            this.hideTooltip(); // Esconde o tooltip ao iniciar a jogada

            const cardEl = this.elements.crHandContainer.children[cardIndex];
            const startRect = cardEl.getBoundingClientRect();
            const endRect = this.elements.centerArea.getBoundingClientRect();
            
            const animatedCard = cardEl.cloneNode(true);
            animatedCard.classList.remove('playable');
            document.body.appendChild(animatedCard);
            Object.assign(animatedCard.style, {
                position: 'fixed', left: `${startRect.left}px`, top: `${startRect.top}px`,
                width: `${startRect.width}px`, height: `${startRect.height}px`,
                zIndex: 2000, margin: 0, pointerEvents: 'none', transition: 'none'
            });

            cardEl.style.opacity = '0';

            const animation = animatedCard.animate([
                { transform: `translate(0, 0) rotate(0deg) scale(1.1)` },
                { transform: `translate(${endRect.left - startRect.left + (endRect.width - startRect.width)/2}px, ${endRect.top - startRect.top + (endRect.height - startRect.height)/2}px) rotate(360deg) scale(1)` }
            ], { duration: 600, easing: 'cubic-bezier(0.5, 0, 0.25, 1)' });

            await animation.finished;
            
            animatedCard.remove();
            
            this.state.game.lastPlayedCard = hand.splice(cardIndex, 1)[0];
            hand.push(this.state.bottomHud.nextCard);
            const newNextCard = this.drawCard();
            if (newNextCard) this.state.bottomHud.nextCard = newNextCard;

            this.render();
            this.state.isAnimating = false;
            this.advanceTurn();
        },

        playerDrawsCard() {
            const newCard = this.drawCard();
            if (newCard) {
                this.state.bottomHud.handCards.push(newCard);
                this.render();
            }
        },

        advanceTurn() {
            const game = this.state.game;
            game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.playerOrder.length;
            
            this.renderTurnIndicator();

            if (game.currentPlayerId !== 'player-main') {
                setTimeout(() => this.simulateOpponentTurn(), OPPONENT_PLAY_DELAY);
            }
        },
        
        simulateOpponentTurn() {
            console.log(`${this.state.game.currentPlayerId} está jogando...`);
            this.state.game.lastPlayedCard = this.drawCard(); // Simplesmente joga uma carta do topo do deck
            this.renderDiscardPile();
            this.advanceTurn();
        },

        // --- FUNÇÕES DE RENDERIZAÇÃO ---
        applyElementState(el, state) {
            Object.assign(el.style, {
                left: `${state.left.value}${state.left.unit}`,
                top: `${state.top.value}${state.top.unit}`,
                width: `${state.width.value}${state.width.unit}`,
                height: `${state.height.value}${state.height.unit}`,
                transform: `translateX(${state.translateX.value}${state.translateX.unit}) translateY(${state.translateY.value}${state.translateY.unit}) scale(${state.scale.value}) rotate(${state.rotate.value}deg)`,
                zIndex: state.zIndex.value
            });
        },
        
        render() {
            Object.keys(this.state.elements).forEach(id => {
                if (this.elements[id]) {
                    this.applyElementState(this.elements[id], this.state.elements[id]);
                }
            });
            this.renderCurvedHand();
            this.renderBottomHud();
            this.renderDiscardPile();
            this.renderTurnIndicator();
            this.renderOpponentHands();
            this.renderDeckCount();
            this.renderElixir();
        },

        renderPlayers() {
            const playerIds = this.state.game.playerOrder;
            playerIds.forEach(id => {
                const playerData = PLAYER_DATA[id];
                const playerElement = document.getElementById(id);
                if (playerData && playerElement) {
                    const avatarEl = playerElement.querySelector('.avatar');
                    const nameEl = playerElement.querySelector('.player-name');
                    if (avatarEl) avatarEl.innerHTML = playerData.avatarSVG;
                    if (nameEl) nameEl.textContent = playerData.name;
                }
            });
        },

        renderOpponentHands() {
            Object.keys(this.state.opponents).forEach(opponentId => {
                const opponentElement = document.getElementById(opponentId);
                if (opponentElement) {
                    const handEl = opponentElement.querySelector('.opponent-hand');
                    if (handEl) handEl.textContent = this.state.opponents[opponentId].handSize;
                }
            });
        },

        renderTurnIndicator() {
            const currentPlayerId = this.state.game.currentPlayerId;
            this.elements.playerAreas.forEach(area => {
                area.classList.toggle('active-turn', area.id === currentPlayerId);
            });
        },

        renderDiscardPile() {
            const container = this.elements.centerArea;
            const cardData = this.state.game.lastPlayedCard;
            if (cardData) {
                container.classList.add('has-card');
                container.innerHTML = `
                    <div class="cr-card" data-color="${cardData.color}" data-value="${cardData.value}">
                        <span class="card-value">${cardData.value}</span>
                        <div class.card-cost">${cardData.cost}</div>
                    </div>
                `;
            } else {
                container.classList.remove('has-card');
                container.innerHTML = '';
            }
        },

        renderCurvedHand() {
            const container = this.elements.curvedHandContainer;
            container.innerHTML = '';
            const { cardCount, pivotX, pivotY, angularSpread, cards } = this.state.curvedHand;
            const middleIndex = Math.floor(cardCount / 2);

            for (let i = 0; i < cardCount; i++) {
                const cardData = cards[i] || { value: '?', color: 'wild', cost: '?' };
                const cardEl = document.createElement('div');
                cardEl.className = 'curved-card';
                cardEl.dataset.color = cardData.color;
                cardEl.innerHTML = `<span class="card-value">${cardData.value.charAt(0)}</span><div class="card-cost">${cardData.cost}</div>`;
                const angle = (i - middleIndex) * angularSpread;
                const transform = `rotate(${angle}deg) translateY(-${pivotY}px)`;
                cardEl.style.transform = transform;
                cardEl.style.setProperty('--transform-original', transform);
                cardEl.style.transformOrigin = `${pivotX}% ${pivotY}px`;
                container.appendChild(cardEl);
            }
        },

        renderBottomHud() {
            this.elements.bottomHud.classList.toggle('collapsed', this.state.bottomHud.collapsed);
            const { nextCard, handCards, cardWidth, cardHeight, cardSpacing } = this.state.bottomHud;
            
            const nextCardContainer = this.elements.nextCardContainer;
            nextCardContainer.dataset.color = nextCard.color;
            nextCardContainer.innerHTML = `<span class="card-value">${nextCard.value}</span><div class="card-cost">${nextCard.cost}</div>`;

            const handContainer = this.elements.crHandContainer;
            handContainer.innerHTML = '';
            handContainer.style.gap = `${cardSpacing}px`;
            
            handCards.forEach((cardData, index) => {
                const cardEl = document.createElement('div');
                cardEl.className = 'cr-card';
                cardEl.style.width = `${cardWidth}px`;
                cardEl.style.height = `${cardHeight}px`;
                cardEl.dataset.color = cardData.color;
                cardEl.dataset.value = cardData.value;
                cardEl.innerHTML = `<span class="card-value">${cardData.value}</span><div class="card-cost">${cardData.cost}</div>`;

                if (this.state.game.currentPlayerId === 'player-main' && this.isCardPlayable(cardData)) {
                    cardEl.classList.add('playable');
                }

                cardEl.addEventListener('mouseenter', () => this.showTooltip(cardData, cardEl));
                cardEl.addEventListener('mouseleave', () => this.hideTooltip());
                cardEl.addEventListener('click', () => this.playCard(index));
                
                handContainer.appendChild(cardEl);
            });
        },

        renderDeckCount() {
            this.elements.deckCount.textContent = this.state.game.drawDeck.length;
            const cardBack = this.elements.drawDeck.querySelector('.card-back');
            if (cardBack) cardBack.innerHTML = this.state.game.drawDeck.length > 0 ? 'UNO' : '';
        },

        renderElixir() {
            const currentElixir = this.state.bottomHud.elixir;
            const elixirPercentage = (currentElixir / MAX_ELIXIR) * 100;
            this.elements.elixirBarFill.style.width = `${elixirPercentage}%`;
            this.elements.elixirText.textContent = `${Math.floor(currentElixir)} / ${MAX_ELIXIR}`;
        },

        showTooltip(cardData, targetElement) {
            if (!cardData.description) return;
            
            const rect = targetElement.getBoundingClientRect();
            this.elements.tooltipTitle.textContent = cardData.value;
            this.elements.tooltipDescription.textContent = cardData.description;

            const tooltipEl = this.elements.tooltip;
            tooltipEl.classList.remove('hidden'); // Mostra para calcular o tamanho
            const tooltipRect = tooltipEl.getBoundingClientRect();

            tooltipEl.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
            tooltipEl.style.top = `${rect.top - tooltipRect.height - 10}px`;
        },

        hideTooltip() {
            this.elements.tooltip.classList.add('hidden');
        },
        
        startDynamicUpdates() {
            setInterval(() => {
                const hudState = this.state.bottomHud;
                if (hudState.elixir < MAX_ELIXIR) {
                    hudState.elixir = Math.min(MAX_ELIXIR, hudState.elixir + ELIXIR_PER_TICK);
                    this.renderElixir();
                }
            }, ELIXIR_TICK_RATE);

            setInterval(() => {
                Object.keys(this.state.opponents).forEach(id => {
                    this.state.opponents[id].handSize = Math.max(1, this.state.opponents[id].handSize + (Math.random() > 0.8 ? 1 : 0));
                });
                this.renderOpponentHands();
            }, OPPONENT_UPDATE_RATE);
        }
    };

    // --- INICIALIZAÇÃO ---
    GameUI.init();
});