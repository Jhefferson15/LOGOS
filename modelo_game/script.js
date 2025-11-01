'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // =================================================================================
    // --- MÓDULO DE ÁUDIO ---
    // =================================================================================
    const SoundManager = {
        isMuted: false,
        sounds: {},
        // NOTA: Você precisará criar uma pasta 'sfx' e adicionar estes arquivos de áudio.
        soundFiles: {
            play_card: 'sfx/play_card.wav',
            draw_card: 'sfx/draw_card.wav',
            button_click: 'sfx/button_click.wav',
            shuffle: 'sfx/shuffle.wav',
            win: 'sfx/win_game.mp3',
            lose: 'sfx/lose_game.mp3',
            error: 'sfx/error.wav'
        },
        init() {
            for (const key in this.soundFiles) {
                this.sounds[key] = new Audio(this.soundFiles[key]);
                this.sounds[key].volume = 0.6;
            }
        },
        toggleMute(isMuted) {
            this.isMuted = isMuted;
        },
        play(soundName) {
            if (this.isMuted || !this.sounds[soundName]) return;
            // Clona o nó de áudio para permitir que o mesmo som toque várias vezes rapidamente
            const sound = this.sounds[soundName].cloneNode();
            sound.play().catch(e => console.error(`Erro ao tocar o som ${soundName}:`, e));
        }
    };
    SoundManager.init();

    // =================================================================================
    // --- CONSTANTES E DADOS DO JOGO ---
    // =================================================================================
    const ELIXIR_TICK_RATE = 280;
    const OPPONENT_PLAY_DELAY = 1500;
    const MAX_ELIXIR = 10;
    const ELIXIR_PER_TICK = 0.1;

    const CardColors = { RED: 'red', GREEN: 'green', BLUE: 'blue', YELLOW: 'yellow', WILD: 'wild' };

    const CardIcons = {
        SKIP: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>`,
        REVERSE: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
        DRAW_TWO: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M6 2h12v5H6z"></path><text x="12" y="17" font-size="8" text-anchor="middle" fill="currentColor">+2</text></svg>`,
        WILD: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 00-10 10h20a10 10 0 00-10-10z" fill-opacity="0.2"></path></svg>`,
        WILD_DRAW_FOUR: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><text x="12" y="17" font-size="8" text-anchor="middle" fill="currentColor">+4</text></svg>`
    };
    
    const CARD_DECK_BASE = [
        { value: 'Skip', color: CardColors.RED, cost: 5, icon: CardIcons.SKIP, description: 'O próximo jogador perde a vez.' },
        { value: 'Reverse', color: CardColors.GREEN, cost: 5, icon: CardIcons.REVERSE, description: 'Inverte a direção do jogo.' },
        { value: '+2', color: CardColors.BLUE, cost: 6, icon: CardIcons.DRAW_TWO, description: 'O próximo jogador compra 2 cartas.' },
        { value: 'Wild', color: CardColors.WILD, cost: 8, icon: CardIcons.WILD, description: 'Muda a cor atual para a de sua escolha.' },
        { value: 'Wild+4', color: CardColors.WILD, cost: 10, icon: CardIcons.WILD_DRAW_FOUR, description: 'Muda a cor e força o próximo a comprar 4 cartas.' }
    ];
    ['1','2','3','4','5','6','7','8','9'].forEach(num => {
        [CardColors.RED, CardColors.GREEN, CardColors.BLUE, CardColors.YELLOW].forEach(color => {
            CARD_DECK_BASE.push({ value: num, color: color, cost: parseInt(num), description: `Uma carta ${color} com valor ${num}.` });
        });
    });

    const PLAYER_DATA = {
        'player-main': { name: 'Você', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path></svg>' },
        'player-nietzsche': { name: 'Nietzsche', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
        'player-hipatia': { name: 'Hipátia', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
        'player-confucio': { name: 'Confúcio', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' }
    };

    // =================================================================================
    // --- MÓDULO PRINCIPAL DO JOGO ---
    // =================================================================================
    const GameUI = {
        state: {},
        elements: {},
        timers: null,

        // --- INICIALIZAÇÃO ---
        init() {
            this.cacheDOMElements();
            this.bindEventListeners();
            this.restartGame(); // A inicialização agora é feita pelo restart
        },

        initializeState() {
            const playerIds = ['player-main', 'player-hipatia', 'player-nietzsche', 'player-confucio'];
            const gameDeck = this.shuffleArray([...CARD_DECK_BASE, ...CARD_DECK_BASE]);
            
            let firstCardOnPile;
            do { // Garante que a primeira carta não seja um Curinga
                firstCardOnPile = gameDeck.pop();
            } while (firstCardOnPile.color === CardColors.WILD);

            this.state = {
                isAnimating: false,
                isPaused: false,
                isGameOver: false,
                logMessages: [],
                dragState: { isDragging: false },
                game: {
                    lastPlayedCard: firstCardOnPile,
                    drawDeck: gameDeck,
                    discardPile: [firstCardOnPile],
                    playerOrder: playerIds,
                    currentPlayerIndex: 0,
                    isAwaitingColorChoice: false,
                    get currentPlayerId() { return this.playerOrder[this.currentPlayerIndex]; },
                    players: {}
                },
                bottomHud: { elixir: 0, lastWholeElixir: 0, handCards: [] }
            };

            // Distribui cartas e inicializa o estado de cada jogador
            playerIds.forEach(id => {
                this.state.game.players[id] = {
                    hand: this.state.game.drawDeck.splice(0, 7),
                    statusEffects: []
                };
            });
            this.state.bottomHud.handCards = this.state.game.players['player-main'].hand;
        },

        cacheDOMElements() {
            this.elements = {
                gameScreen: document.getElementById('game-screen'),
                crHandContainer: document.getElementById('cr-hand'),
                drawDeck: document.getElementById('draw-deck'),
                discardPile: document.getElementById('discard-pile'),
                playerAreas: document.querySelectorAll('.player-area'),
                
                elixirBarContainer: document.getElementById('elixir-bar-container'),
                elixirBarFill: document.getElementById('elixir-bar-fill'),
                elixirText: document.getElementById('elixir-text'),
                drawDeckCounter: document.getElementById('draw-deck-counter'),
                discardPileCounter: document.getElementById('discard-pile-counter'),
                
                tooltip: document.getElementById('card-tooltip'),
                tooltipTitle: document.getElementById('tooltip-title'),
                tooltipDescription: document.getElementById('tooltip-description'),
                logList: document.getElementById('log-list'),
                pauseButton: document.getElementById('pause-button'),
                pauseMenuOverlay: document.getElementById('pause-menu-overlay'),
                resumeButton: document.getElementById('resume-button'),
                restartButton: document.getElementById('restart-button'),
                soundToggle: document.getElementById('sound-toggle'),
                gameOverOverlay: document.getElementById('game-over-overlay'),
                gameOverTitle: document.getElementById('game-over-title'),
                gameOverMessage: document.getElementById('game-over-message'),
                gameOverWinnerAvatar: document.getElementById('game-over-winner-avatar'),
                playAgainButton: document.getElementById('play-again-button'),
                colorPickerOverlay: document.getElementById('color-picker-overlay'),
                colorOptions: document.querySelector('.color-options'),
                // Adicionamos elementos que não existiam antes para não quebrar o código
                hudToggle: document.getElementById('hud-toggle')
            };
        },

        bindEventListeners() {
            // Drag and Drop
            this.elements.crHandContainer.addEventListener('mousedown', e => this.onDragStart(e));
            window.addEventListener('mousemove', e => this.onDragMove(e));
            window.addEventListener('mouseup', e => this.onDragEnd(e));
            
            this.elements.drawDeck.addEventListener('click', () => {
                SoundManager.play('button_click');
                if (this.state.game.currentPlayerId === 'player-main' && !this.state.isAnimating) {
                    this.playerDrawsCard();
                }
            });
            this.elements.pauseButton.addEventListener('click', () => {
                SoundManager.play('button_click');
                this.togglePause(true);
            });
            this.elements.resumeButton.addEventListener('click', () => {
                SoundManager.play('button_click');
                this.togglePause(false);
            });
            this.elements.restartButton.addEventListener('click', () => {
                SoundManager.play('button_click');
                this.restartGame();
            });
            this.elements.playAgainButton.addEventListener('click', () => {
                SoundManager.play('button_click');
                this.restartGame();
            });
            this.elements.soundToggle.addEventListener('change', e => SoundManager.toggleMute(!e.target.checked));
            this.elements.colorOptions.addEventListener('click', e => {
                const colorOption = e.target.closest('.color-option');
                if (colorOption) {
                    SoundManager.play('button_click');
                    this.onColorPicked(colorOption.dataset.color);
                }
            });
            window.addEventListener('keydown', e => {
                if (e.key === 'Escape') this.togglePause(!this.state.isPaused);
            });

            // Lógica do botão de toggle do HUD
            const bottomHud = document.getElementById('bottom-hud');
            this.elements.hudToggle.addEventListener('click', () => {
                bottomHud.classList.toggle('collapsed');
            });
        },
        
        // --- UTILITÁRIOS E LÓGICA DE JOGO ---
        shuffleArray: (arr) => arr.sort(() => Math.random() - 0.5),
        
        isCardPlayable(card) {
            const lastPlayed = this.state.game.lastPlayedCard;
            if (!lastPlayed) return true;
            if (card.color === CardColors.WILD) return true;
            const activeColor = lastPlayed.chosenColor || lastPlayed.color;
            return card.color === activeColor || card.value === lastPlayed.value;
        },
        
        async drawCardFromDeck() {
            if (this.state.game.drawDeck.length === 0) {
                await this.animateShuffle();
                const discard = this.state.game.discardPile;
                const topCard = discard.pop();
                this.state.game.drawDeck = this.shuffleArray(discard);
                this.state.game.discardPile = [topCard];
                this.render();
            }
            if(this.state.game.drawDeck.length === 0) return null; // No cards left at all
            return this.state.game.drawDeck.pop();
        },

        async playCard(cardIndex, isOpponent = false, opponentId = '') {
            if (this.state.isAnimating || this.state.isGameOver) return;

            const playerId = isOpponent ? opponentId : 'player-main';
            const player = this.state.game.players[playerId];
            const cardToPlay = player.hand[cardIndex];

            if (!this.isCardPlayable(cardToPlay) && !isOpponent) {
                this.elements.crHandContainer.children[cardIndex].classList.add('invalid-shake');
                setTimeout(() => this.elements.crHandContainer.children[cardIndex].classList.remove('invalid-shake'), 500);
                SoundManager.play('error');
                return;
            }

            this.state.isAnimating = true;
            this.hideTooltip();
            SoundManager.play('play_card');

            let startElement = isOpponent ? document.getElementById(opponentId) : this.elements.crHandContainer.children[cardIndex];
            await this.animateCardFly(startElement, this.elements.discardPile, cardToPlay, isOpponent);

            const playedCard = player.hand.splice(cardIndex, 1)[0];
            this.state.game.discardPile.push(playedCard);
            this.state.game.lastPlayedCard = playedCard;
            this.logEvent(`jogou um ${playedCard.value} ${playedCard.color}.`, 'play-card', PLAYER_DATA[playerId].name);

            const discardRect = this.elements.discardPile.getBoundingClientRect();
            this.triggerVFX(discardRect.left + discardRect.width / 2, discardRect.top + discardRect.height / 2, playedCard.color === CardColors.WILD ? 'wild' : playedCard.color);

            this.render();
            
            this.checkForWinner();
            if (this.state.isGameOver) {
                this.state.isAnimating = false;
                return;
            }
            
            this.applyCardEffect(playedCard);

            if (playedCard.color === CardColors.WILD) {
                this.state.game.isAwaitingColorChoice = true;
                this.elements.colorPickerOverlay.classList.remove('hidden');
            } else {
                this.advanceTurn();
            }
            this.state.isAnimating = false;
        },

        onColorPicked(color) {
            if (!this.state.game.isAwaitingColorChoice) return;
            this.state.game.lastPlayedCard.chosenColor = color;
            this.logEvent(`escolheu a cor ${color}.`, 'game-event', PLAYER_DATA[this.state.game.currentPlayerId].name);
            this.state.game.isAwaitingColorChoice = false;
            this.elements.colorPickerOverlay.classList.add('hidden');
            this.render();
            this.advanceTurn();
        },

        async playerDrawsCard() {
            if (this.state.isAnimating) return;
            const newCard = await this.drawCardFromDeck();
            if (newCard) {
                SoundManager.play('draw_card');
                await this.animateCardFly(this.elements.drawDeck, this.elements.crHandContainer, newCard);
                this.state.game.players['player-main'].hand.push(newCard);
                this.logEvent(`comprou uma carta.`, 'draw-card', PLAYER_DATA['player-main'].name);
                this.render();
                this.advanceTurn();
            }
        },

        advanceTurn() {
            const game = this.state.game;
            let currentId = game.currentPlayerId;
            game.players[currentId].statusEffects = [];

            game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.playerOrder.length;
            let nextPlayerId = game.currentPlayerId;
            
            const skippedEffect = game.players[nextPlayerId].statusEffects.find(e => e.id === 'skipped');
            if (skippedEffect) {
                this.logEvent(`${PLAYER_DATA[nextPlayerId].name} perdeu a vez.`, 'game-event');
                this.render();
                setTimeout(() => this.advanceTurn(), 1000);
                return;
            }

            this.render();
            if (game.currentPlayerId !== 'player-main' && !this.state.isGameOver) {
                setTimeout(() => this.simulateOpponentTurn(), OPPONENT_PLAY_DELAY);
            }
        },

        simulateOpponentTurn() {
            if (this.state.isGameOver || this.state.isPaused) return;

            const opponentId = this.state.game.currentPlayerId;
            const opponent = this.state.game.players[opponentId];
            const playableCardIndex = opponent.hand.findIndex(card => this.isCardPlayable(card));

            if (playableCardIndex !== -1) {
                this.playCard(playableCardIndex, true, opponentId);
            } else {
                this.drawCardFromDeck().then(newCard => {
                    if (newCard) {
                        opponent.hand.push(newCard);
                        this.logEvent(`comprou uma carta.`, 'draw-card', PLAYER_DATA[opponentId].name);
                        this.render();
                    }
                    this.advanceTurn();
                });
            }
        },
        
        applyCardEffect(card) {
            const nextPlayerIndex = (this.state.game.currentPlayerIndex + 1) % this.state.game.playerOrder.length;
            const nextPlayerId = this.state.game.playerOrder[nextPlayerIndex];
            if (card.value === 'Skip') {
                this.state.game.players[nextPlayerId].statusEffects.push({ id: 'skipped' });
            }
        },
        
        checkForWinner() {
            const winnerId = this.state.game.playerOrder.find(id => this.state.game.players[id].hand.length === 0);
            if (winnerId) {
                this.endGame(winnerId);
            }
        },

        endGame(winnerId) {
            this.state.isGameOver = true;
            this.stopDynamicUpdates();
            const winnerData = PLAYER_DATA[winnerId];
            const isPlayerWinner = winnerId === 'player-main';
            SoundManager.play(isPlayerWinner ? 'win' : 'lose');
            
            this.elements.gameOverTitle.textContent = isPlayerWinner ? "Vitória!" : "Derrota!";
            this.elements.gameOverMessage.textContent = `${winnerData.name} venceu a partida!`;
            this.elements.gameOverWinnerAvatar.innerHTML = winnerData.avatarSVG;
            this.elements.gameOverOverlay.classList.remove('hidden');
            this.logEvent(`${winnerData.name} venceu a partida!`, 'game-event');
        },

        restartGame() {
            this.stopDynamicUpdates();
            this.initializeState();
            this.renderPlayers();
            this.render();
            document.getElementById('pause-menu-overlay').classList.add('hidden');
            document.getElementById('game-over-overlay').classList.add('hidden');
            this.logEvent('Partida iniciada. Boa sorte!', 'game-event');
            this.startDynamicUpdates();
            this.animatePlayerEntry();
        },

        togglePause(pauseState) {
            this.state.isPaused = pauseState;
            this.elements.pauseMenuOverlay.classList.toggle('hidden', !this.state.isPaused);
            if (this.state.isPaused) this.stopDynamicUpdates();
            else this.startDynamicUpdates();
        },

        onDragStart(e) {
            if (this.state.isAnimating || this.state.game.currentPlayerId !== 'player-main' || this.state.isPaused) return;
            const cardEl = e.target.closest('.cr-card');
            if (!cardEl) return;

            SoundManager.play('button_click');
            const cardIndex = parseInt(cardEl.dataset.index);
            const clone = cardEl.cloneNode(true);
            clone.classList.add('drag-clone');
            document.body.appendChild(clone);
            
            this.state.dragState = {
                isDragging: true, draggedCardIndex: cardIndex, draggedElement: cardEl, cloneElement: clone,
                offset: { x: e.clientX - cardEl.getBoundingClientRect().left, y: e.clientY - cardEl.getBoundingClientRect().top }
            };
            
            cardEl.classList.add('dragging');
            this.onDragMove(e);
        },
        onDragMove(e) {
            if (!this.state.dragState.isDragging) return;
            e.preventDefault();
            const { cloneElement, offset } = this.state.dragState;
            cloneElement.style.left = `${e.clientX - offset.x}px`;
            cloneElement.style.top = `${e.clientY - offset.y}px`;

            const discardRect = this.elements.discardPile.getBoundingClientRect();
            const isOverDiscard = e.clientX > discardRect.left && e.clientX < discardRect.right && e.clientY > discardRect.top && e.clientY < discardRect.bottom;

            if (isOverDiscard) {
                const cardData = this.state.bottomHud.handCards[this.state.dragState.draggedCardIndex];
                if (this.isCardPlayable(cardData)) {
                    this.elements.discardPile.classList.add('droppable');
                    this.elements.discardPile.classList.remove('invalid-drop');
                } else {
                    this.elements.discardPile.classList.add('invalid-drop');
                    this.elements.discardPile.classList.remove('droppable');
                }
            } else {
                this.elements.discardPile.classList.remove('droppable', 'invalid-drop');
            }
        },
        onDragEnd(e) {
            if (!this.state.dragState.isDragging) return;
            const { cloneElement, draggedElement, draggedCardIndex } = this.state.dragState;
            const discardRect = this.elements.discardPile.getBoundingClientRect();
            const isOverDiscard = e.clientX > discardRect.left && e.clientX < discardRect.right && e.clientY > discardRect.top && e.clientY < discardRect.bottom;
            const cardData = this.state.bottomHud.handCards[draggedCardIndex];

            if (isOverDiscard && this.isCardPlayable(cardData)) {
                this.playCard(draggedCardIndex);
            }

            draggedElement.classList.remove('dragging');
            if (cloneElement) cloneElement.remove();
            this.elements.discardPile.classList.remove('droppable', 'invalid-drop');
            this.state.dragState = { isDragging: false };
        },
        
        async animateCardFly(startElement, endElement, cardData, isOpponent = false) {
            const startRect = startElement.getBoundingClientRect();
            const endRect = endElement.getBoundingClientRect();
            const cardEl = document.createElement('div');
            cardEl.className = 'cr-card animated-card-fly';
            cardEl.dataset.color = cardData.color;
            if (isOpponent) cardEl.classList.add('back');
            else cardEl.innerHTML = this.renderCardContent(cardData);
            document.body.appendChild(cardEl);
            
            Object.assign(cardEl.style, {
                width: `${startRect.width}px`, height: `${startRect.height}px`,
                top: `${startRect.top}px`, left: `${startRect.left}px`
            });

            await new Promise(r => requestAnimationFrame(r));
            const targetLeft = endRect.left + (endRect.width / 2) - (startRect.width / 2);
            const targetTop = endRect.top + (endRect.height / 2) - (startRect.height / 2);
            cardEl.style.transform = 'scale(1)';
            cardEl.style.left = `${targetLeft}px`;
            cardEl.style.top = `${targetTop}px`;

            await new Promise(r => setTimeout(r, 600));
            cardEl.remove();
        },
        triggerVFX(x, y, color) {
            const particleColor = color === 'wild' ? '#ffffff' : `var(--card-${color})`;
            for (let i = 0; i < 12; i++) {
                const p = document.createElement('div');
                p.className = 'vfx-particle';
                p.style.backgroundColor = particleColor;
                document.body.appendChild(p);
                const angle = (i/12)*360, r = 50 + Math.random()*50;
                p.style.left = `${x}px`; p.style.top = `${y}px`;
                p.style.setProperty('--transform-end', `translate(${Math.cos(angle*Math.PI/180)*r}px, ${Math.sin(angle*Math.PI/180)*r}px)`);
                setTimeout(() => p.remove(), 700);
            }
        },
        async animateShuffle() {
            this.state.isAnimating = true;
            SoundManager.play('shuffle');
            this.logEvent("Embaralhando descarte...", 'game-event');
            const discardRect = this.elements.discardPile.getBoundingClientRect();
            const drawRect = this.elements.drawDeck.getBoundingClientRect();
            const cards = this.state.game.discardPile.slice(0, -1).map(cardData => {
                const card = document.createElement('div');
                card.className = 'cr-card shuffling-card';
                card.innerHTML = this.renderCardContent(cardData);
                Object.assign(card.style, { top: `${discardRect.top}px`, left: `${discardRect.left}px`, width: `${discardRect.width}px`, height: `${discardRect.height}px` });
                document.body.appendChild(card);
                return card;
            });

            await new Promise(r => requestAnimationFrame(r));
            cards.forEach((card, i) => {
                card.style.left = `${drawRect.left}px`;
                card.style.top = `${drawRect.top}px`;
                card.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            });

            await new Promise(r => setTimeout(r, 600));
            cards.forEach(card => card.remove());
            this.state.isAnimating = false;
        },
        animatePlayerEntry() {
            document.querySelectorAll('.player-area.pre-enter').forEach((el, i) => {
                setTimeout(() => el.classList.remove('pre-enter'), 200 * (i + 1));
            });
        },
        
        render() {
            this.renderOpponentHands();
            this.renderTurnIndicator();
            this.renderDiscardPile();
            this.renderBottomHud();
            this.renderDeckCounters();
            this.renderElixir();
            this.renderStatusEffects();
            this.renderLog();
        },
        renderPlayers() {
            Object.keys(PLAYER_DATA).forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.querySelector('.avatar').innerHTML = PLAYER_DATA[id].avatarSVG;
                    el.querySelector('.player-name').textContent = PLAYER_DATA[id].name;
                }
            });
        },
        renderOpponentHands() {
            Object.keys(this.state.game.players).forEach(id => {
                if (id !== 'player-main') {
                    const el = document.getElementById(id);
                    if (el) el.querySelector('.opponent-hand').textContent = this.state.game.players[id].hand.length;
                }
            });
        },
        renderTurnIndicator() {
            this.elements.playerAreas.forEach(area => area.classList.toggle('active-turn', area.id === this.state.game.currentPlayerId));
        },
        renderDiscardPile() {
            const cardData = this.state.game.lastPlayedCard;
            const discardPileEl = this.elements.discardPile;
            if (cardData) {
                discardPileEl.innerHTML = `<div class="cr-card" style="width:100%; height:100%;">${this.renderCardContent(cardData)}</div>`;
                if (cardData.chosenColor) {
                    const indicator = document.createElement('div');
                    indicator.className = 'chosen-color-indicator';
                    indicator.style.backgroundColor = `var(--card-${cardData.chosenColor})`;
                    discardPileEl.querySelector('.cr-card').appendChild(indicator);
                }
            } else {
                discardPileEl.innerHTML = '';
            }
        },
        renderBottomHud() {
            const handContainer = this.elements.crHandContainer;
            handContainer.innerHTML = '';
            this.state.bottomHud.handCards.forEach((cardData, index) => {
                const cardEl = document.createElement('div');
                cardEl.className = 'cr-card';
                cardEl.dataset.index = index;
                cardEl.dataset.color = cardData.color;
                cardEl.innerHTML = this.renderCardContent(cardData);
                if (this.state.game.currentPlayerId === 'player-main' && this.isCardPlayable(cardData)) {
                    cardEl.classList.add('playable');
                }
                cardEl.addEventListener('mouseenter', () => this.showTooltip(cardData, cardEl));
                cardEl.addEventListener('mouseleave', () => this.hideTooltip());
                handContainer.appendChild(cardEl);
            });
        },
        renderCardContent(cardData) {
            const content = cardData.icon ? `<div class="card-icon">${cardData.icon}</div>` : `<span class="card-value">${cardData.value}</span>`;
            return `${content}<div class="card-cost">${cardData.cost}</div>`;
        },
        renderDeckCounters() {
            this.elements.drawDeckCounter.textContent = this.state.game.drawDeck.length;
            this.elements.discardPileCounter.textContent = this.state.game.discardPile.length;
        },
        renderElixir() {
            const currentElixir = this.state.bottomHud.elixir;
            const elixirPercentage = (currentElixir / MAX_ELIXIR) * 100;
            this.elements.elixirBarFill.style.width = `${elixirPercentage}%`;
            this.elements.elixirText.textContent = `${Math.floor(currentElixir)} / ${MAX_ELIXIR}`;
        },
        renderStatusEffects() {
            this.state.game.playerOrder.forEach(id => {
                const container = document.getElementById(id).querySelector('.status-effects-container');
                container.innerHTML = '';
                this.state.game.players[id].statusEffects.forEach(effect => {
                    const el = document.createElement('div');
                    el.className = `status-effect effect-${effect.id}`;
                    container.appendChild(el);
                });
            });
        },
        renderLog() {
            this.elements.logList.innerHTML = this.state.logMessages.map(entry => {
                const playerNameHtml = entry.playerName ? `<span class="player-name">${entry.playerName}</span>` : '';
                return `<li data-event-type="${entry.type}">${playerNameHtml} ${entry.message}</li>`;
            }).join('');
        },
        showTooltip(cardData, targetElement) {
            if (!cardData.description) return;
            const rect = targetElement.getBoundingClientRect();
            this.elements.tooltipTitle.textContent = `${cardData.value} (${cardData.color})`;
            this.elements.tooltipDescription.textContent = cardData.description;

            const tooltipEl = this.elements.tooltip;
            tooltipEl.classList.add('visible'); // Usa a classe 'visible' para animar
            const tooltipRect = tooltipEl.getBoundingClientRect();

            tooltipEl.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
            tooltipEl.style.top = `${rect.top - tooltipRect.height - 10}px`;
        },
        hideTooltip() {
            this.elements.tooltip.classList.remove('visible');
        },
        logEvent(message, type = 'generic', playerName = '') {
            this.state.logMessages.unshift({ message, type, playerName });
            if (this.state.logMessages.length > 20) this.state.logMessages.pop();
            this.renderLog();
        },
        startDynamicUpdates() {
            this.stopDynamicUpdates();
            this.timers = {};
            this.timers.elixir = setInterval(() => {
                if (this.state.isPaused) return;
                const hudState = this.state.bottomHud;
                if (hudState.elixir < MAX_ELIXIR) {
                    hudState.elixir = Math.min(MAX_ELIXIR, hudState.elixir + ELIXIR_PER_TICK);
                    const currentWholeElixir = Math.floor(hudState.elixir);
                    if (currentWholeElixir > hudState.lastWholeElixir) {
                        hudState.lastWholeElixir = currentWholeElixir;
                        this.elements.elixirBarContainer.classList.add('pulse-elixir-gain');
                        setTimeout(() => this.elements.elixirBarContainer.classList.remove('pulse-elixir-gain'), 400);
                    }
                    this.renderElixir();
                }
            }, ELIXIR_TICK_RATE);
        },
        stopDynamicUpdates() {
            if (this.timers) {
                Object.values(this.timers).forEach(timerId => clearInterval(timerId));
            }
            this.timers = null;
        }
    };

    GameUI.init();
});