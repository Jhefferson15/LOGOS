// Verifica se o objeto principal do jogo já foi carregado (lógica de Single Page App).
if (window.GameUI && typeof window.GameUI.restartGame === 'function') {
    // 1. Re-busca todos os elementos da nova tela.
    window.GameUI.cacheDOMElements(); 
    // 2. Re-vincula os event listeners aos novos elementos.
    window.GameUI.bindEventListeners();
    // 3. Agora reinicia a lógica do jogo, que usará os elementos e listeners corretos.
    window.GameUI.restartGame();

} else {
    'use strict';

    // =================================================================================
    // --- MÓULO DE ÁUDIO ---
    // =================================================================================
    const SoundManager = {
        isMuted: false,
        sounds: {},
        soundFiles: {
            play_card: '/Frontend/assets/game/audio/flipcard.mp3',
            draw_card: '/Frontend/assets/game/audio/flipcard.mp3',
            button_click: '/Frontend/assets/game/audio/flipcard.mp3',
            shuffle: '/Frontend/assets/game/audio/flipcard.mp3',
            win: '/Frontend/assets/game/audio/game_start.mp3',
            lose: '/Frontend/assets/game/audio/flipcard.mp3',
            error: '/Frontend/assets/game/audio/flipcard.mp3',
            power_activate: '/Frontend/assets/game/audio/flipcard.mp3'
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
            const sound = this.sounds[soundName].cloneNode();
            sound.play().catch(e => console.error(`Erro ao tocar o som ${soundName}:`, e));
        }
    };
    SoundManager.init();

    // =================================================================================
    // --- CONSTANTES E DADOS DO JOGO ---
    // =================================================================================
    const PLAYER_COUNT = 4;
    const ELIXIR_TICK_RATE = 280;
    const OPPONENT_PLAY_DELAY = 1500;
    const MAX_ELIXIR = 10;
    const ELIXIR_PER_TICK = 0.1;
    const PLAYER_POWER_SLOTS = 4;

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

    const MAIN_PLAYER_DATA = {
        id: 'player-main',
        name: 'Você',
        avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path></svg>'
    };
    
    const OPPONENT_POOL = [
        { name: 'Nietzsche', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
        { name: 'Hipátia', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
        { name: 'Confúcio', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
        { name: 'S. Beauvoir', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
        { name: 'Aristóteles', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
        { name: 'Sun Tzu', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
        { name: 'Sêneca', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
        { name: 'Maquiavel', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
        { name: 'Platão', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' }
    ];

    const POWERS_DATA = {
        'clarividencia': {
            id: 'clarividencia', name: 'Clarividência', description: 'Espia a carta de maior custo na mão de um oponente aleatório.', cost: 3,
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path></svg>`,
            handler: function(gameUI) { gameUI.logEvent(`usou Clarividência!`, 'game-event', gameUI.state.playersData['player-main'].name); gameUI.triggerVFX(window.innerWidth / 2, window.innerHeight / 2, 'wild'); }
        },
        'barreira_filosofica': {
            id: 'barreira_filosofica', name: 'Barreira Filosófica', description: 'Anula o efeito da próxima carta de +2 ou +4 jogada contra você.', cost: 5,
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
            handler: function(gameUI) {
                gameUI.state.game.players['player-main'].statusEffects.push({ id: 'shielded' });
                gameUI.logEvent(`ergueu uma Barreira Filosófica!`, 'game-event', gameUI.state.playersData['player-main'].name);
                gameUI.renderStatusEffects();
                const playerEl = document.getElementById('player-main'); const rect = playerEl.getBoundingClientRect();
                gameUI.triggerVFX(rect.left + rect.width / 2, rect.top + rect.height / 2, 'blue');
            }
        },
        'troca_subita': {
            id: 'troca_subita', name: 'Troca Súbita', description: 'Troque uma de suas cartas com uma carta aleatória de um oponente.', cost: 7,
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>`,
            handler: function(gameUI) {
                gameUI.logEvent(`ativou a Troca Súbita!`, 'game-event', gameUI.state.playersData['player-main'].name);
                const playerEl = document.getElementById('player-main');
                const opponentEl = document.querySelector('.player-area.opponent'); 
                if (opponentEl) {
                    gameUI.animateCardFly(playerEl, opponentEl, {color: 'red'}, false);
                    gameUI.animateCardFly(opponentEl, playerEl, {color: 'blue'}, true);
                }
            }
        },
        'premonicao': { 
            id: 'premonicao', name: 'Premonição', description: 'Olhe a carta do topo do baralho de compra.', cost: 2,
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`,
            handler: function(gameUI) {
                const topCard = gameUI.state.game.drawDeck[gameUI.state.game.drawDeck.length - 1];
                gameUI.logEvent(`previu a próxima carta: um ${topCard.value} ${topCard.color}.`, 'game-event', gameUI.state.playersData['player-main'].name);
                gameUI.elements.drawDeck.classList.add('pulse-elixir-gain');
                setTimeout(() => gameUI.elements.drawDeck.classList.remove('pulse-elixir-gain'), 800);
            }
        },
        'reflexao_socratica': {
            id: 'reflexao_socratica', name: 'Reflexão Socrática', description: 'Pule sua vez para comprar duas cartas.', cost: 3,
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/></svg>`,
            handler: async function(gameUI) {
                gameUI.logEvent(`entrou em Reflexão Socrática...`, 'game-event', gameUI.state.playersData['player-main'].name);
                await gameUI.playerDrawsCard(false); // Draw without advancing turn
                await gameUI.playerDrawsCard(true); // Draw and advance turn
            }
        },
        'dilema_de_seneca': {
            id: 'dilema_de_seneca', name: 'Dilema de Sêneca', description: 'Escolha um oponente. Ele deverá jogar uma carta de valor 5 ou maior, ou comprará uma carta.', cost: 6,
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
            handler: function(gameUI) {
                const opponentId = gameUI.state.game.playerOrder.find(id => id !== 'player-main');
                if (opponentId) {
                    gameUI.logEvent(`impôs um dilema a ${gameUI.state.playersData[opponentId].name}.`, 'game-event', 'player-main');
                    document.getElementById(opponentId).classList.add('pulse-elixir-gain');
                    setTimeout(() => document.getElementById(opponentId).classList.remove('pulse-elixir-gain'), 800);
                }
            }
        },
        'furia_de_aquiles': {
            id: 'furia_de_aquiles', name: 'Fúria de Aquiles', description: 'O próximo jogador compra uma carta imediatamente.', cost: 4,
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
            handler: async function(gameUI) {
                 const nextPlayerIndex = (gameUI.state.game.currentPlayerIndex + 1) % gameUI.state.game.playerOrder.length;
                 const nextPlayerId = gameUI.state.game.playerOrder[nextPlayerIndex];
                 const card = await gameUI.drawCardFromDeck();
                 if(card){
                    gameUI.state.game.players[nextPlayerId].hand.push(card);
                    gameUI.logEvent(`forçou ${gameUI.state.playersData[nextPlayerId].name} a comprar uma carta!`, 'game-event', 'player-main');
                    gameUI.render();
                 }
            }
        },
        'paradoxo_de_zenon': {
            id: 'paradoxo_de_zenon', name: 'Paradoxo de Zenão', description: 'Embaralha a pilha de descarte de volta ao baralho de compra.', cost: 8,
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>`,
            handler: async function(gameUI) {
                 await gameUI.animateShuffle();
                 const discard = gameUI.state.game.discardPile;
                 const topCard = discard.pop();
                 gameUI.state.game.drawDeck = gameUI.shuffleArray([...gameUI.state.game.drawDeck, ...discard]);
                 gameUI.state.game.discardPile = [topCard];
                 gameUI.logEvent(`invocou o Paradoxo de Zenão, reiniciando o baralho!`, 'game-event', 'player-main');
                 gameUI.render();
            }
        }
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
            this.restartGame(); 
        },

        initializeState() {
            const opponentsToCreate = Math.max(1, Math.min(9, PLAYER_COUNT - 1));
            const opponentData = this.shuffleArray([...OPPONENT_POOL]).slice(0, opponentsToCreate);

            const playerIds = [MAIN_PLAYER_DATA.id];
            const playersData = { [MAIN_PLAYER_DATA.id]: { name: MAIN_PLAYER_DATA.name, avatarSVG: MAIN_PLAYER_DATA.avatarSVG } };

            opponentData.forEach((opponent, i) => {
                const opponentId = `opponent-${i}`;
                playerIds.push(opponentId);
                playersData[opponentId] = { name: opponent.name, avatarSVG: opponent.avatarSVG };
            });

            const gameDeck = this.shuffleArray([...CARD_DECK_BASE, ...CARD_DECK_BASE]);
            
            let firstCardOnPile;
            do { 
                firstCardOnPile = gameDeck.pop();
            } while (firstCardOnPile.color === CardColors.WILD);

            this.state = {
                isAnimating: false,
                isPaused: false,
                isGameOver: false,
                logMessages: [],
                dragState: { isDragging: false },
                roundSummary: {
                    isActive: false,
                    startPlayerId: null,
                    powersUsed: []
                },
                playersData: playersData,
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

            playerIds.forEach(id => {
                this.state.game.players[id] = {
                    hand: this.state.game.drawDeck.splice(0, 7),
                    statusEffects: [],
                    powers: [],
                    powerDeck: []
                };
            });
            
            const mainPlayer = this.state.game.players['player-main'];
            const allPowerIds = this.shuffleArray(Object.keys(POWERS_DATA));
            mainPlayer.powers = allPowerIds.splice(0, PLAYER_POWER_SLOTS).map(id => POWERS_DATA[id]);
            mainPlayer.powerDeck = allPowerIds.map(id => POWERS_DATA[id]);
            
            this.state.bottomHud.handCards = this.state.game.players['player-main'].hand;
        },

        cacheDOMElements() {
            this.elements = {
                gameScreen: document.getElementById('game-screen'),
                crHandContainer: document.getElementById('cr-hand'),
                drawDeck: document.getElementById('draw-deck'),
                discardPile: document.getElementById('discard-pile'),
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
                quitButton: document.getElementById('quit-button'), // Botão de sair adicionado
                gameOverOverlay: document.getElementById('game-over-overlay'),
                gameOverTitle: document.getElementById('game-over-title'),
                gameOverMessage: document.getElementById('game-over-message'),
                gameOverWinnerAvatar: document.getElementById('game-over-winner-avatar'),
                playAgainButton: document.getElementById('play-again-button'),
                colorPickerOverlay: document.getElementById('color-picker-overlay'),
                colorOptions: document.querySelector('.color-options'),
                powersContainer: document.getElementById('powers-container'),
                hudToggle: document.getElementById('hud-toggle'),
                gameLog: document.getElementById('game-log'),
                logToggle: document.getElementById('log-toggle'),
                nextPowerPreview: document.getElementById('next-power-preview'),
                nextPowerCard: document.getElementById('next-power-card')
            };
        },

        bindEventListeners() {
            this.elements.crHandContainer.addEventListener('mousedown', e => this.onDragStart(e));
            window.addEventListener('mousemove', e => this.onDragMove(e));
            window.addEventListener('mouseup', e => this.onDragEnd(e));
            
            this.elements.drawDeck.addEventListener('click', () => {
                SoundManager.play('button_click');
                if (this.state.game.currentPlayerId === 'player-main' && !this.state.isAnimating) {
                    this.playerDrawsCard(true);
                }
            });
            this.elements.pauseButton.addEventListener('click', () => { SoundManager.play('button_click'); this.togglePause(true); });
            this.elements.resumeButton.addEventListener('click', () => { SoundManager.play('button_click'); this.togglePause(false); });
            this.elements.restartButton.addEventListener('click', () => { SoundManager.play('button_click'); this.restartGame(); });
            this.elements.playAgainButton.addEventListener('click', () => { SoundManager.play('button_click'); this.restartGame(); });
            this.elements.soundToggle.addEventListener('change', e => SoundManager.toggleMute(!e.target.checked));
            
            // Funcionalidade do botão de sair
            this.elements.quitButton.addEventListener('click', () => {
                window.location.href = '/Frontend/index.html';
            });

            this.elements.colorOptions.addEventListener('click', e => {
                const colorOption = e.target.closest('.color-option');
                if (colorOption) {
                    SoundManager.play('button_click');
                    this.onColorPicked(colorOption.dataset.color);
                }
            });
            window.addEventListener('keydown', e => { if (e.key === 'Escape') this.togglePause(!this.state.isPaused); });
            const bottomHud = document.getElementById('bottom-hud');
            this.elements.hudToggle.addEventListener('click', () => { bottomHud.classList.toggle('collapsed'); });
            this.elements.logToggle.addEventListener('click', () => {
                this.elements.gameLog.classList.toggle('collapsed');
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
            if(this.state.game.drawDeck.length === 0) return null; 
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
            this.logEvent(`jogou um ${playedCard.value} ${playedCard.color}.`, 'play-card', playerId);

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
            this.logEvent(`escolheu a cor ${color}.`, 'game-event', this.state.game.currentPlayerId);
            this.state.game.isAwaitingColorChoice = false;
            this.elements.colorPickerOverlay.classList.add('hidden');
            this.render();
            this.advanceTurn();
        },

        async playerDrawsCard(shouldAdvanceTurn) {
            if (this.state.isAnimating) return;
            const newCard = await this.drawCardFromDeck();
            if (newCard) {
                SoundManager.play('draw_card');
                await this.animateCardFly(this.elements.drawDeck, this.elements.crHandContainer, newCard);
                this.state.game.players['player-main'].hand.push(newCard);
                this.logEvent(`comprou uma carta.`, 'draw-card', 'player-main');
                this.render();
                if (shouldAdvanceTurn) {
                    this.advanceTurn();
                }
            }
        },

        advanceTurn() {
            const game = this.state.game;
            let currentId = game.currentPlayerId;
            game.players[currentId].statusEffects = [];

            if (this.state.roundSummary.isActive && game.currentPlayerId === this.state.roundSummary.startPlayerId) {
                this.showRoundSummaryAndReset();
            }

            game.currentPlayerIndex = (game.currentPlayerIndex + 1) % game.playerOrder.length;
            let nextPlayerId = game.currentPlayerId;
            
            this.elements.playerAreas = document.querySelectorAll('.player-area');
            
            const skippedEffect = game.players[nextPlayerId].statusEffects.find(e => e.id === 'skipped');
            if (skippedEffect) {
                this.logEvent(`perdeu a vez.`, 'game-event', nextPlayerId);
                this.render();
                setTimeout(() => this.advanceTurn(), 1000);
                return;
            }

            this.render();
            if (game.currentPlayerId !== 'player-main' && !this.state.isGameOver) {
                setTimeout(() => this.simulateOpponentTurn(), OPPONENT_PLAY_DELAY);
            }
        },

        async simulateOpponentTurn() {
            if (this.state.isGameOver || this.state.isPaused) return;

            const opponentId = this.state.game.currentPlayerId;
            const opponent = this.state.game.players[opponentId];
            const playableCardIndex = opponent.hand.findIndex(card => this.isCardPlayable(card));

            if (playableCardIndex !== -1) {
                this.playCard(playableCardIndex, true, opponentId);
            } else {
                const newCard = await this.drawCardFromDeck();
                if (newCard) {
                    opponent.hand.push(newCard);
                    this.logEvent(`comprou uma carta.`, 'draw-card', opponentId);
                    this.render();
                }
                this.advanceTurn();
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
            const winnerData = this.state.playersData[winnerId];
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
            this.renderPlayerAreas();
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
        
        onActivatePower(power, powerEl) {
            if (this.state.isAnimating || this.state.isPaused) return;
            const elixir = this.state.bottomHud.elixir;
            if (elixir < power.cost) {
                SoundManager.play('error');
                powerEl.classList.add('invalid-shake');
                setTimeout(() => powerEl.classList.remove('invalid-shake'), 500);
                return;
            }

            if (!this.state.roundSummary.isActive) {
                this.state.roundSummary.isActive = true;
                this.state.roundSummary.startPlayerId = this.state.game.currentPlayerId;
            }
            this.state.roundSummary.powersUsed.push({
                playerId: 'player-main',
                powerId: power.id
            });

            this.state.bottomHud.elixir -= power.cost;
            SoundManager.play('power_activate');
            
            powerEl.classList.add('vanishing');
            if(power.handler) { power.handler(this); }
            
            setTimeout(() => {
                const player = this.state.game.players['player-main'];
                const powerIndex = player.powers.findIndex(p => p.id === power.id);

                if (player.powerDeck.length === 0) {
                    this.replenishPowerDeck();
                }

                const newPower = player.powerDeck.shift();
                if (powerIndex !== -1 && newPower) {
                    player.powers[powerIndex] = newPower;
                }
                
                this.render();
            }, 500);
        },
        
        replenishPowerDeck() {
            const player = this.state.game.players['player-main'];
            this.logEvent('Seu deck de poderes foi reembaralhado!', 'game-event');
            const currentPowerIds = new Set(player.powers.map(p => p.id));
            const allPowerIds = Object.keys(POWERS_DATA);
            const availablePowers = allPowerIds.filter(id => !currentPowerIds.has(id));
            
            player.powerDeck = this.shuffleArray(availablePowers).map(id => POWERS_DATA[id]);
        },

        onDragStart(e) {
            if (this.state.isAnimating || this.state.game.currentPlayerId !== 'player-main' || this.state.isPaused) return;
            const cardEl = e.target.closest('.cr-card');
            if (!cardEl || !this.elements.crHandContainer.contains(cardEl)) return;

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

            if (draggedElement) draggedElement.classList.remove('dragging');
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
        
        showRoundSummaryAndReset() {
            const summary = this.state.roundSummary;
            if (summary.powersUsed.length === 0) {
                this.state.roundSummary = { isActive: false, startPlayerId: null, powersUsed: [] };
                this.renderUsedPowerIndicators();
                return;
            }

            if (this.elements.gameLog.classList.contains('collapsed')) {
                this.elements.gameLog.classList.remove('collapsed');
            }

            const summaryHtml = `
                <div id="round-summary-card">
                    <h3>Poderes da Rodada</h3>
                    <ul>
                        ${summary.powersUsed.map(usage => {
                            const playerData = this.state.playersData[usage.playerId];
                            const powerData = POWERS_DATA[usage.powerId];
                            return `
                                <li>
                                    <div class="power-icon">${powerData.icon}</div>
                                    <span class="player-name">${playerData.name}:</span>
                                    <span>${powerData.name}</span>
                                </li>`;
                        }).join('')}
                    </ul>
                </div>
            `;
            
            this.elements.gameLog.insertAdjacentHTML('beforeend', summaryHtml);
            requestAnimationFrame(() => {
                this.elements.gameLog.classList.add('showing-summary');
            });

            setTimeout(() => {
                const summaryCard = document.getElementById('round-summary-card');
                this.elements.gameLog.classList.remove('showing-summary');

                if (summaryCard) {
                    summaryCard.addEventListener('transitionend', () => summaryCard.remove(), { once: true });
                }

                this.state.roundSummary = { isActive: false, startPlayerId: null, powersUsed: [] };
                this.renderUsedPowerIndicators();
            }, 3000);
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
            this.renderUsedPowerIndicators();
        },
        renderPlayerAreas() {
            const container = document.getElementById('game-board-container');
            container.querySelectorAll('.player-area.opponent').forEach(el => el.remove());

            const opponentIds = this.state.game.playerOrder.filter(id => id !== 'player-main');
            const numOpponents = opponentIds.length;

            const centerX = 50, centerY = 40, radiusX = 42, radiusY = 28;
            const startAngle = -160, endAngle = -20;
            const totalAngle = endAngle - startAngle;
            const angleStep = numOpponents > 1 ? totalAngle / (numOpponents - 1) : 0;

            opponentIds.forEach((id, i) => {
                const playerData = this.state.playersData[id];
                const el = document.createElement('div');
                el.id = id;
                el.className = 'player-area opponent pre-enter';
                el.innerHTML = `
                    <div class="status-effects-container"></div>
                    <div class="used-power-indicator"></div> 
                    <div class="avatar">${playerData.avatarSVG}</div>
                    <div class="player-name">${playerData.name}</div>
                    <div class="opponent-hand">7</div>`;
                
                let currentAngle = startAngle + (i * angleStep);
                if (numOpponents === 1) currentAngle = -90;

                const angleRad = currentAngle * (Math.PI / 180);
                el.style.left = `${centerX + Math.cos(angleRad) * radiusX}%`;
                el.style.top = `${centerY + Math.sin(angleRad) * radiusY}%`;

                container.appendChild(el);
            });
            this.elements.playerAreas = document.querySelectorAll('.player-area');
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
            if (this.elements.playerAreas) {
                this.elements.playerAreas.forEach(area => area.classList.toggle('active-turn', area.id === this.state.game.currentPlayerId));
            }
        },
        renderDiscardPile() {
            const cardData = this.state.game.lastPlayedCard;
            const discardPileEl = this.elements.discardPile;
            if (cardData) {
                discardPileEl.innerHTML = `<div class="cr-card" data-color="${cardData.color}" style="width:100%; height:100%;">${this.renderCardContent(cardData)}</div>`;
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
            this.renderPlayerHandArc();
            this.renderPowers();
            this.renderNextPowerPreview();
        },
        renderPlayerHandArc() {
            const handContainer = this.elements.crHandContainer;
            handContainer.innerHTML = '';
            const cards = this.state.bottomHud.handCards;
            const numCards = cards.length;
            const maxAngle = Math.min(numCards * 10, 80);
            const anglePerCard = numCards > 1 ? maxAngle / (numCards - 1) : 0;
            const startAngle = -maxAngle / 2;
            const liftDistance = 120;
            
            cards.forEach((cardData, index) => {
                const cardEl = document.createElement('div');
                cardEl.className = 'cr-card';
                cardEl.dataset.index = index;
                cardEl.dataset.color = cardData.color;
                cardEl.innerHTML = this.renderCardContent(cardData);
                if (this.state.game.currentPlayerId === 'player-main' && this.isCardPlayable(cardData)) {
                    cardEl.classList.add('playable');
                }
                const angle = startAngle + (index * anglePerCard);
                const transformValue = `rotate(${angle}deg) translateY(-${liftDistance}px)`;
                cardEl.style.transform = transformValue;
                cardEl.style.setProperty('--original-transform', transformValue);
                cardEl.addEventListener('mouseenter', () => this.showTooltip(cardData, cardEl));
                cardEl.addEventListener('mouseleave', () => this.hideTooltip());
                handContainer.appendChild(cardEl);
            });
        },
        renderPowers() {
            const powersContainer = this.elements.powersContainer;
            powersContainer.innerHTML = '';
            const playerPowers = this.state.game.players['player-main'].powers;
            playerPowers.forEach(power => {
                const powerEl = document.createElement('div');
                powerEl.className = 'cr-card power-card';
                powerEl.dataset.powerId = power.id;
                const elixir = this.state.bottomHud.elixir;
                if(elixir < power.cost) {
                    powerEl.classList.add('unaffordable');
                }
                powerEl.innerHTML = `<div class="card-icon">${power.icon}</div><div class="card-cost">${power.cost}</div>`;
                const transformValue = 'none';
                powerEl.style.transform = transformValue;
                powerEl.style.setProperty('--original-transform', transformValue);
                powerEl.addEventListener('dblclick', () => this.onActivatePower(power, powerEl));
                powerEl.addEventListener('mouseenter', () => this.showTooltip({ value: power.name, color: `Poder (Custo: ${power.cost})`, description: power.description }, powerEl));
                powerEl.addEventListener('mouseleave', () => this.hideTooltip());
                powersContainer.appendChild(powerEl);
            });
        },
        renderNextPowerPreview() {
            const nextPowerCardEl = this.elements.nextPowerCard;
            const nextPower = this.state.game.players['player-main'].powerDeck[0];
            if(nextPower) {
                nextPowerCardEl.innerHTML = `<div class="card-icon">${nextPower.icon}</div><div class="card-cost">${nextPower.cost}</div>`;
                 nextPowerCardEl.addEventListener('mouseenter', () => this.showTooltip({ value: nextPower.name, color: `Poder (Custo: ${nextPower.cost})`, description: nextPower.description }, nextPowerCardEl));
                 nextPowerCardEl.addEventListener('mouseleave', () => this.hideTooltip());
            } else {
                nextPowerCardEl.innerHTML = '';
            }
        },
        renderUsedPowerIndicators() {
            document.querySelectorAll('.player-area .used-power-indicator').forEach(el => {
                el.innerHTML = '';
                el.classList.remove('visible');
            });
            
            this.state.roundSummary.powersUsed.forEach(usage => {
                const playerEl = document.getElementById(usage.playerId);
                if (playerEl) {
                    const indicatorEl = playerEl.querySelector('.used-power-indicator');
                    const powerData = POWERS_DATA[usage.powerId];
                    if (indicatorEl && powerData) {
                        indicatorEl.innerHTML = powerData.icon;
                        indicatorEl.classList.add('visible');
                    }
                }
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
                const playerEl = document.getElementById(id);
                if (!playerEl) return;
                const container = playerEl.querySelector('.status-effects-container');
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
            tooltipEl.classList.add('visible');
            const tooltipRect = tooltipEl.getBoundingClientRect();
            tooltipEl.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
            tooltipEl.style.top = `${rect.top - tooltipRect.height - 10}px`;
        },
        hideTooltip() {
            this.elements.tooltip.classList.remove('visible');
        },
        logEvent(message, type = 'generic', playerId = '') {
            const playerName = playerId && this.state.playersData[playerId] ? this.state.playersData[playerId].name : '';
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

    window.GameUI = GameUI;

    // Garante que o init seja chamado apenas uma vez.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => GameUI.init());
    } else {
        GameUI.init();
    }
}
