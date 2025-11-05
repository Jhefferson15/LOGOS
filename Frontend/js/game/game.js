// --- REFACTOR ---
// Importa os novos bancos de dados do jogo
import { PHILOSOPHERS_DATA } from './../data/philosophers.js';
import { CONCEPTS_DATA } from './../data/concepts.js';

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
            play_card: './../assets/game/audio/flipcard.mp3',
            draw_card: './../assets/game/audio/flipcard.mp3',
            button_click: './../assets/game/audio/flipcard.mp3',
            shuffle: './../assets/game/audio/flipcard.mp3',
            win: './../assets/game/audio/game_start.mp3',
            lose: './../assets/game/audio/flipcard.mp3',
            error: './../assets/game/audio/flipcard.mp3',
            power_activate: './../assets/game/audio/flipcard.mp3'
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
    const OPPONENT_PLAY_DELAY = 1500;
    const PLAYER_CONCEPT_SLOTS = 4;

    // Mapeamento de Eras para Cores Visuais
    const ERA_COLOR_MAP = {
        'Antiga': 'red',
        'Medieval': 'blue',
        'Moderna': 'yellow',
        'Contemporânea': 'green'
    };

    const MAIN_PLAYER_DATA = {
        id: 'player-main',
        name: 'Você',
        avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path></svg>'
    };
    
    const OPPONENT_POOL = [
        { name: 'Nietzsche', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
        { name: 'Hipátia', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
        { name: 'S. Beauvoir', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
        { name: 'Aristóteles', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
    ];
    
    // =================================================================================
    // --- MÓDULO PRINCIPAL DO JOGO ---
    // =================================================================================
    const GameUI = {
        state: {},
        elements: {},

        // --- INICIALIZAÇÃO ---
        init() {
            this.cacheDOMElements();
            this.restartGame(); 
        },

        initializeState() {
            const opponentData = this.shuffleArray([...OPPONENT_POOL]).slice(0, 3);
            const playerIds = [MAIN_PLAYER_DATA.id];
            const playersData = { [MAIN_PLAYER_DATA.id]: { name: MAIN_PLAYER_DATA.name, avatarSVG: MAIN_PLAYER_DATA.avatarSVG } };

            opponentData.forEach((opponent, i) => {
                const opponentId = `opponent-${i}`;
                playerIds.push(opponentId);
                playersData[opponentId] = { name: opponent.name, avatarSVG: opponent.avatarSVG };
            });

            const allPhilosopherIds = Object.keys(PHILOSOPHERS_DATA);
            const philosopherDeck = this.shuffleArray(allPhilosopherIds);
            
            const orderedPhilosophers = Object.keys(PHILOSOPHERS_DATA)
                .map(id => ({ id, ...PHILOSOPHERS_DATA[id] }))
                .sort((a, b) => a.date - b.date)
                .map(p => p.id);

            const firstCardOnPile = philosopherDeck.pop();

            this.state = {
                isAnimating: false,
                isPaused: false,
                isGameOver: false,
                logMessages: [],
                dragState: { isDragging: false },
                selectedCardIndex: null, // -1 represents no card selected
                roundSummary: { isActive: false, startPlayerId: null, powersUsed: [] },
                playersData: playersData,
                game: {
                    orderedPhilosophers: orderedPhilosophers,
                    lastPlayedCard: firstCardOnPile,
                    drawDeck: philosopherDeck,
                    discardPile: [firstCardOnPile],
                    playerOrder: playerIds,
                    currentPlayerIndex: 0,
                    get currentPlayerId() { return this.playerOrder[this.currentPlayerIndex]; },
                    players: {}
                }
            };

            playerIds.forEach(id => {
                this.state.game.players[id] = {
                    score: 0,
                    hand: this.state.game.drawDeck.splice(0, 5),
                    statusEffects: [],
                    concepts: [],
                    conceptDeck: []
                };
            });
            
            const mainPlayer = this.state.game.players['player-main'];
            const allConceptIds = this.shuffleArray(Object.keys(CONCEPTS_DATA));
            mainPlayer.concepts = allConceptIds.splice(0, PLAYER_CONCEPT_SLOTS).map(id => CONCEPTS_DATA[id]);
            mainPlayer.conceptDeck = allConceptIds.map(id => CONCEPTS_DATA[id]);
        },

        cacheDOMElements() {
            this.elements = {
                gameScreen: document.getElementById('game-screen'),
                crHandContainer: document.getElementById('cr-hand'),
                drawDeck: document.getElementById('draw-deck'),
                discardPile: document.getElementById('discard-pile'),
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
                quitButton: document.getElementById('quit-button'),
                gameOverOverlay: document.getElementById('game-over-overlay'),
                gameOverTitle: document.getElementById('game-over-title'),
                gameOverMessage: document.getElementById('game-over-message'),
                gameOverWinnerAvatar: document.getElementById('game-over-winner-avatar'),
                playAgainButton: document.getElementById('play-again-button'),
                powersContainer: document.getElementById('powers-container'),
                hudToggle: document.getElementById('hud-toggle'),
                gameLog: document.getElementById('game-log'),
                logToggle: document.getElementById('log-toggle'),
                nextPowerPreview: document.getElementById('next-power-preview'),
                nextPowerCard: document.getElementById('next-power-card'),
                selectedCardSlot: document.getElementById('selected-card-slot') // Add this line
            };
        },

        bindEventListeners() {
            this.elements.crHandContainer.addEventListener('mousedown', e => this.onDragStart(e));
            this.elements.crHandContainer.addEventListener('touchstart', e => this.onDragStart(e), { passive: false });
            window.addEventListener('mousemove', e => this.onDragMove(e));
            window.addEventListener('touchmove', e => this.onDragMove(e), { passive: false });
            window.addEventListener('mouseup', e => this.onDragEnd(e));
            window.addEventListener('touchend', e => this.onDragEnd(e));
            
            this.elements.drawDeck.addEventListener('click', () => {
                if (this.state.game.currentPlayerId === 'player-main' && !this.state.isAnimating) {
                    SoundManager.play('button_click');
                    this.playerDrawsCard(true);
                }
            });

            this.elements.pauseButton.addEventListener('click', () => { SoundManager.play('button_click'); this.togglePause(true); });
            this.elements.resumeButton.addEventListener('click', () => { SoundManager.play('button_click'); this.togglePause(false); });
            this.elements.restartButton.addEventListener('click', () => { SoundManager.play('button_click'); this.restartGame(); });
            this.elements.playAgainButton.addEventListener('click', () => { SoundManager.play('button_click'); this.restartGame(); });
            this.elements.soundToggle.addEventListener('change', e => SoundManager.toggleMute(!e.target.checked));
            this.elements.quitButton.addEventListener('click', () => { window.location.href = './../index.html'; });
            window.addEventListener('keydown', e => { if (e.key === 'Escape') this.togglePause(!this.state.isPaused); });
            
            this.elements.hudToggle.addEventListener('click', () => document.getElementById('bottom-hud').classList.toggle('collapsed'));
            this.elements.logToggle.addEventListener('click', () => this.elements.gameLog.classList.toggle('collapsed'));
        },
        
        // --- UTILITÁRIOS E LÓGICA DE JOGO ---
        shuffleArray: (arr) => arr.sort(() => Math.random() - 0.5),
        
        async drawCardFromDeck() {
            if (this.state.game.drawDeck.length === 0) {
                if (this.state.game.discardPile.length <= 1) {
                    this.logEvent("O baralho de compra acabou!", 'game-event');
                    return null;
                }
                await this.animateShuffle();
                const pile = this.state.game.discardPile;
                const topCard = pile.pop();
                this.state.game.drawDeck = this.shuffleArray(pile);
                this.state.game.discardPile = [topCard];
                this.render();
            }
            if(this.state.game.drawDeck.length === 0) return null; 
            return this.state.game.drawDeck.pop();
        },

        async playCard(cardIndex) {
            if (this.state.isAnimating || this.state.isGameOver) return;

            const player = this.state.game.players['player-main'];
            const cardToPlayId = player.hand[cardIndex];
            
            const points = this.calculateChronologicalScore(cardToPlayId);
            player.score += points;

            this.state.isAnimating = true;
            this.hideTooltip();
            SoundManager.play('play_card');

            let startElement;
            if (this.state.selectedCardIndex !== null && this.state.selectedCardIndex === cardIndex) {
                startElement = this.elements.selectedCardSlot.firstChild;
            } else {
                startElement = Array.from(this.elements.crHandContainer.children).find(el => parseInt(el.dataset.index) === cardIndex);
            }

            await this.animateCardFly(startElement, this.elements.discardPile, PHILOSOPHERS_DATA[cardToPlayId]);

            const playedCardId = player.hand.splice(cardIndex, 1)[0];
            this.state.game.discardPile.push(playedCardId);
            this.state.game.lastPlayedCard = playedCardId;
            this.logEvent(`jogou ${PHILOSOPHERS_DATA[playedCardId].name} e ganhou ${points} Pontos de Sabedoria!`, 'play-card', 'player-main');

            const cardData = PHILOSOPHERS_DATA[playedCardId];
            const color = ERA_COLOR_MAP[cardData.era] || 'wild';
            const discardRect = this.elements.discardPile.getBoundingClientRect();
            this.triggerVFX(discardRect.left + discardRect.width / 2, discardRect.top + discardRect.height / 2, color);
            
            const newCard = await this.drawCardFromDeck();
            if (newCard) player.hand.push(newCard);

            this.state.selectedCardIndex = null; // Deselect card after playing
            this.render();
            
            this.checkForWinner();
            if (this.state.isGameOver) {
                this.state.isAnimating = false;
                return;
            }
            
            this.applyCardEffect(cardData); 

            this.advanceTurn();
            this.state.isAnimating = false;
        },

        calculateChronologicalScore(playedPhilosopherId) {
            const topOfPileId = this.state.game.lastPlayedCard;
            const orderedList = this.state.game.orderedPhilosophers;

            const playedIndex = orderedList.indexOf(playedPhilosopherId);
            const topOfPileIndex = orderedList.indexOf(topOfPileId);

            if (playedIndex === -1 || topOfPileIndex === -1) return 0;

            const indexDiff = Math.abs(playedIndex - topOfPileIndex);

            if (indexDiff === 0) return 0;
            if (indexDiff === 1) return 10;

            const points = 10 - 2 * (indexDiff - 1);
            return Math.max(0, points);
        },

        async playerDrawsCard(shouldAdvanceTurn) {
            if (this.state.isAnimating) return;
            const newCard = await this.drawCardFromDeck();
            if (newCard) {
                SoundManager.play('draw_card');
                await this.animateCardFly(this.elements.drawDeck, this.elements.crHandContainer, PHILOSOPHERS_DATA[newCard]);
                this.state.game.players['player-main'].hand.push(newCard);
                this.logEvent(`comprou uma carta.`, 'draw-card', 'player-main');
                this.render();
                if (shouldAdvanceTurn) this.advanceTurn();
            } else if (shouldAdvanceTurn) {
                this.logEvent(`não pôde comprar, o baralho está vazio.`, 'draw-card', 'player-main');
                this.advanceTurn();
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

            let bestCardIndex = -1;
            let maxScore = -1;

            if (opponent.hand.length > 0) {
                opponent.hand.forEach((cardId, index) => {
                    const score = this.calculateChronologicalScore(cardId);
                    if (score > maxScore) {
                        maxScore = score;
                        bestCardIndex = index;
                    }
                });
            }

            if (bestCardIndex === -1 || (maxScore <= 2 && Math.random() < 0.5)) {
                const newCard = await this.drawCardFromDeck();
                if (newCard) {
                    opponent.hand.push(newCard);
                    this.logEvent(`comprou uma carta.`, 'draw-card', opponentId);
                    this.render();
                } else {
                    this.logEvent(`tentou comprar mas o baralho está vazio.`, 'draw-card', opponentId);
                }
                this.advanceTurn();
                return;
            }

            const cardToPlayId = opponent.hand[bestCardIndex];
            opponent.score += maxScore;

            this.state.isAnimating = true;
            SoundManager.play('play_card');
            await this.animateCardFly(document.getElementById(opponentId), this.elements.discardPile, PHILOSOPHERS_DATA[cardToPlayId], true);

            const playedCardId = opponent.hand.splice(bestCardIndex, 1)[0];
            this.state.game.discardPile.push(playedCardId);
            this.state.game.lastPlayedCard = playedCardId;
            this.logEvent(`jogou ${PHILOSOPHERS_DATA[playedCardId].name} e ganhou ${maxScore} pts!`, 'play-card', opponentId);

            const newCard = await this.drawCardFromDeck();
            if (newCard) opponent.hand.push(newCard);
            
            this.render();
            this.checkForWinner();
            if(this.state.isGameOver) { this.state.isAnimating = false; return; }

            this.advanceTurn();
            this.state.isAnimating = false;
        },
        
        applyCardEffect(card) {
            // Função placeholder para futuras expansões
        },
        
        checkForWinner() {
            if (this.state.game.drawDeck.length === 0 && this.state.game.playerOrder.every(id => this.state.game.players[id].hand.length === 0)) {
                let winnerId = this.state.game.playerOrder[0];
                let highScore = -1;
                this.state.game.playerOrder.forEach(id => {
                    const playerScore = this.state.game.players[id].score;
                    if (playerScore > highScore) {
                        highScore = playerScore;
                        winnerId = id;
                    }
                });
                this.endGame(winnerId);
            }
        },

        endGame(winnerId) {
            this.state.isGameOver = true;
            const winnerData = this.state.playersData[winnerId];
            const isPlayerWinner = winnerId === 'player-main';
            SoundManager.play(isPlayerWinner ? 'win' : 'lose');
            
            this.elements.gameOverTitle.textContent = isPlayerWinner ? "Vitória!" : "Derrota!";
            this.elements.gameOverMessage.textContent = `${winnerData.name} venceu a partida com ${this.state.game.players[winnerId].score} pontos!`;
            this.elements.gameOverWinnerAvatar.innerHTML = winnerData.avatarSVG;
            this.elements.gameOverOverlay.classList.remove('hidden');
            this.logEvent(`${winnerData.name} venceu a partida!`, 'game-event');
        },

        restartGame() {
            this.initializeState();
            this.renderPlayerAreas();
            this.render();
            document.getElementById('pause-menu-overlay').classList.add('hidden');
            document.getElementById('game-over-overlay').classList.add('hidden');
            this.logEvent('Partida iniciada. Boa sorte!', 'game-event');
            this.animatePlayerEntry();
        },

        togglePause(pauseState) {
            this.state.isPaused = pauseState;
            this.elements.pauseMenuOverlay.classList.toggle('hidden', !this.state.isPaused);
        },
        
        onActivateConcept(concept, conceptEl) {
            if (this.state.isAnimating || this.state.isPaused) return;
            const player = this.state.game.players['player-main'];
            
            if (player.score < concept.cost) {
                SoundManager.play('error');
                conceptEl.classList.add('invalid-shake');
                setTimeout(() => conceptEl.classList.remove('invalid-shake'), 500);
                return;
            }

            if (!this.state.roundSummary.isActive) {
                this.state.roundSummary.isActive = true;
                this.state.roundSummary.startPlayerId = this.state.game.currentPlayerId;
            }
            this.state.roundSummary.powersUsed.push({ playerId: 'player-main', powerId: concept.id });

            player.score -= concept.cost;
            SoundManager.play('power_activate');
            
            conceptEl.classList.add('vanishing');
            if(concept.handler) { concept.handler(this); }
            
            setTimeout(() => {
                const conceptIndex = player.concepts.findIndex(c => c.id === concept.id);
                if (player.conceptDeck.length === 0) this.replenishConceptDeck();

                const newConcept = player.conceptDeck.shift();
                if (conceptIndex !== -1 && newConcept) player.concepts[conceptIndex] = newConcept;
                
                this.render();
            }, 500);
        },
        
        replenishConceptDeck() {
            const player = this.state.game.players['player-main'];
            this.logEvent('Seu deck de conceitos foi reembaralhado!', 'game-event');
            const currentConceptIds = new Set(player.concepts.map(p => p.id));
            const allConceptIds = Object.keys(CONCEPTS_DATA);
            const availableConcepts = allConceptIds.filter(id => !currentConceptIds.has(id));
            player.conceptDeck = this.shuffleArray(availableConcepts).map(id => CONCEPTS_DATA[id]);
        },

        // --- Drag and Drop ---
        onDragStart(e) {
            if (this.state.isAnimating || this.state.game.currentPlayerId !== 'player-main' || this.state.isPaused) return;
            const touch = e.touches ? e.touches[0] : e;
            const cardEl = touch.target.closest('.cr-card');

            if (!cardEl) return;

            if (this.elements.crHandContainer.contains(cardEl)) {
                const cardIndex = parseInt(cardEl.dataset.index);
                
                if (this.state.selectedCardIndex === cardIndex) {
                    this.state.selectedCardIndex = null;
                } else {
                    this.state.selectedCardIndex = cardIndex;
                }
                this.render();

                // Inicia o drag
                SoundManager.play('button_click');
                const clone = cardEl.cloneNode(true);
                clone.classList.add('drag-clone');
                document.body.appendChild(clone);
                
                this.state.dragState = {
                    isDragging: true, draggedCardIndex: cardIndex, draggedElement: cardEl, cloneElement: clone,
                    offset: { x: touch.clientX - cardEl.getBoundingClientRect().left, y: touch.clientY - cardEl.getBoundingClientRect().top }
                };
                cardEl.classList.add('dragging');
                this.onDragMove(e);
            } else if (this.elements.selectedCardSlot.contains(cardEl)) {
                this.state.selectedCardIndex = null;
                this.render();
            }
        },
        onDragMove(e) {
            if (!this.state.dragState || !this.state.dragState.isDragging) return;
            if (e.cancelable) e.preventDefault();
            const touch = e.touches ? e.touches[0] : e;
            const { cloneElement, offset } = this.state.dragState;
            cloneElement.style.left = `${touch.clientX - offset.x}px`;
            cloneElement.style.top = `${touch.clientY - offset.y}px`;

            const discardRect = this.elements.discardPile.getBoundingClientRect();
            const isOverDiscard = touch.clientX > discardRect.left && touch.clientX < discardRect.right && touch.clientY > discardRect.top && touch.clientY < discardRect.bottom;
            this.elements.discardPile.classList.toggle('droppable', isOverDiscard);
        },
        onDragEnd(e) {
            if (!this.state.dragState.isDragging) return;
            const touch = e.changedTouches ? e.changedTouches[0] : e;
            const { cloneElement, draggedElement, draggedCardIndex } = this.state.dragState;
            const discardRect = this.elements.discardPile.getBoundingClientRect();
            const isOverDiscard = touch.clientX > discardRect.left && touch.clientX < discardRect.right && touch.clientY > discardRect.top && touch.clientY < discardRect.bottom;

            if (isOverDiscard) this.playCard(draggedCardIndex);

            if (draggedElement) draggedElement.classList.remove('dragging');
            if (cloneElement) cloneElement.remove();
            this.elements.discardPile.classList.remove('droppable', 'invalid-drop');
            this.state.dragState = { isDragging: false };
        },


        
        // --- Animações e VFX ---
        async animateCardFly(startElement, endElement, cardData, isOpponent = false) {
            const startRect = startElement.getBoundingClientRect();
            const endRect = endElement.getBoundingClientRect();
            const cardEl = document.createElement('div');
            cardEl.className = 'cr-card animated-card-fly';
            const color = ERA_COLOR_MAP[cardData.era] || 'wild';
            cardEl.dataset.color = color;
            if (isOpponent) cardEl.classList.add('back');
            else cardEl.innerHTML = this.renderCardContent(cardData);
            document.body.appendChild(cardEl);
            
            Object.assign(cardEl.style, { width: `${startRect.width}px`, height: `${startRect.height}px`, top: `${startRect.top}px`, left: `${startRect.left}px` });
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
            const cardsToShuffle = this.state.game.discardPile.slice(0, -1);

            if (cardsToShuffle.length === 0) {
                this.state.isAnimating = false;
                return;
            }

            const cards = cardsToShuffle.map(cardId => {
                const cardData = PHILOSOPHERS_DATA[cardId];
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
                    <h3>Conceitos da Rodada</h3>
                    <ul>
                        ${summary.powersUsed.map(usage => {
                            const playerData = this.state.playersData[usage.playerId];
                            const powerData = CONCEPTS_DATA[usage.powerId];
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

        // --- Funções de Renderização ---
        render() {
            this.renderOpponentHands();
            this.renderTurnIndicator();
            this.renderDiscardPile();
            this.renderBottomHud();
            this.renderDeckCounters();
            this.renderScores();
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
                    <div class="player-score">0</div>
                    <div class="avatar">${playerData.avatarSVG}</div>
                    <div class="player-name">${playerData.name}</div>
                    <div class="opponent-hand">5</div>`;
                
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
            const cardId = this.state.game.lastPlayedCard;
            const discardPileEl = this.elements.discardPile;
            if (cardId) {
                const cardData = PHILOSOPHERS_DATA[cardId];
                const color = ERA_COLOR_MAP[cardData.era] || 'wild';
                discardPileEl.innerHTML = `<div class="cr-card" data-color="${color}" style="width:100%; height:100%;">${this.renderCardContent(cardData)}</div>`;
            } else {
                discardPileEl.innerHTML = '';
            }
        },
        renderBottomHud() {
            this.renderPlayerHandArc();
            this.renderConcepts();
            this.renderNextConceptPreview();
        },
        renderPlayerHandArc() {
            const handContainer = this.elements.crHandContainer;
            const selectedCardSlot = this.elements.selectedCardSlot;
            handContainer.innerHTML = '';
            selectedCardSlot.innerHTML = '';

            const cards = this.state.game.players['player-main'].hand;
            const numCards = cards.length - (this.state.selectedCardIndex !== null ? 1 : 0);
            const maxAngle = Math.min(numCards * 10, 80);
            const anglePerCard = numCards > 1 ? maxAngle / (numCards - 1) : 0;
            const startAngle = -maxAngle / 2;
            const liftDistance = 120;
            
            let handCardIndex = 0;
            cards.forEach((cardId, index) => {
                if (index === this.state.selectedCardIndex) {
                    // Render the selected card in its slot
                    const cardData = PHILOSOPHERS_DATA[cardId];
                    const cardEl = document.createElement('div');
                    cardEl.className = 'cr-card';
                    const color = ERA_COLOR_MAP[cardData.era] || 'wild';
                    cardEl.dataset.color = color;
                    cardEl.innerHTML = this.renderCardContent(cardData);
                    selectedCardSlot.appendChild(cardEl);
                    return; // Skip rendering in hand
                }

                const cardData = PHILOSOPHERS_DATA[cardId];
                const cardEl = document.createElement('div');
                cardEl.className = 'cr-card';
                cardEl.dataset.index = index;
                const color = ERA_COLOR_MAP[cardData.era] || 'wild';
                cardEl.dataset.color = color;
                cardEl.innerHTML = this.renderCardContent(cardData);
                if (this.state.game.currentPlayerId === 'player-main') {
                    cardEl.classList.add('playable');
                }
                const angle = startAngle + (handCardIndex * anglePerCard);
                const transformValue = `rotate(${angle}deg) translateY(-${liftDistance}px)`;
                cardEl.style.transform = transformValue;
                cardEl.style.setProperty('--original-transform', transformValue);
                cardEl.addEventListener('mouseenter', () => this.showTooltip(cardData, cardEl));
                cardEl.addEventListener('mouseleave', () => this.hideTooltip());
                handContainer.appendChild(cardEl);
                handCardIndex++;
            });
        },
        renderConcepts() {
            const powersContainer = this.elements.powersContainer;
            powersContainer.innerHTML = '';
            const playerConcepts = this.state.game.players['player-main'].concepts;
            const playerScore = this.state.game.players['player-main'].score;
            playerConcepts.forEach(concept => {
                const conceptEl = document.createElement('div');
                conceptEl.className = 'cr-card power-card';
                conceptEl.dataset.powerId = concept.id;
                if (playerScore < concept.cost) {
                    conceptEl.classList.add('unaffordable');
                }
                conceptEl.innerHTML = `<div class="card-icon">${concept.icon}</div><div class="card-cost">${concept.cost}</div>`;
                const transformValue = 'none';
                conceptEl.style.transform = transformValue;
                conceptEl.style.setProperty('--original-transform', transformValue);
                conceptEl.addEventListener('dblclick', () => this.onActivateConcept(concept, conceptEl));
                conceptEl.addEventListener('mouseenter', () => this.showTooltip({ name: concept.name, date: `Custo: ${concept.cost}`, description: concept.description }, conceptEl));
                conceptEl.addEventListener('mouseleave', () => this.hideTooltip());
                powersContainer.appendChild(conceptEl);
            });
        },
        renderNextConceptPreview() {
            const nextPowerCardEl = this.elements.nextPowerCard;
            const nextConcept = this.state.game.players['player-main'].conceptDeck[0];
            if(nextConcept) {
                nextPowerCardEl.innerHTML = `<div class="card-icon">${nextConcept.icon}</div><div class="card-cost">${nextConcept.cost}</div>`;
                 nextPowerCardEl.addEventListener('mouseenter', () => this.showTooltip({ name: nextConcept.name, date: `Custo: ${nextConcept.cost}`, description: nextConcept.description }, nextPowerCardEl));
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
                    const powerData = CONCEPTS_DATA[usage.powerId];
                    if (indicatorEl && powerData) {
                        indicatorEl.innerHTML = powerData.icon;
                        indicatorEl.classList.add('visible');
                    }
                }
            });
        },
        renderCardContent(cardData) {
            return `<span class="card-value">${cardData.name}</span><div class="card-cost">${cardData.date}</div>`;
        },
        renderDeckCounters() {
            this.elements.drawDeckCounter.textContent = this.state.game.drawDeck.length;
            this.elements.discardPileCounter.textContent = this.state.game.discardPile.length;
        },
        renderScores() {
            this.state.game.playerOrder.forEach(id => {
                const playerEl = document.getElementById(id);
                const scoreEl = playerEl ? playerEl.querySelector('.player-score') : null;
                if (scoreEl) {
                    scoreEl.textContent = this.state.game.players[id].score;
                }
            });
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
            this.elements.logList.scrollTop = 0; // Auto-scroll to top
        },
        showTooltip(cardData, targetElement) {
            if (!cardData.description) return;
            const rect = targetElement.getBoundingClientRect();
            this.elements.tooltipTitle.textContent = `${cardData.name} (${cardData.era || cardData.date})`;
            this.elements.tooltipDescription.textContent = cardData.description;
            const tooltipEl = this.elements.tooltip;
            tooltipEl.classList.add('visible');
            const tooltipRect = tooltipEl.getBoundingClientRect();

            let top = rect.top - tooltipRect.height - 10;
            // Adjust if tooltip goes off-screen
            if (top < 10) {
                top = rect.bottom + 10;
            }

            tooltipEl.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
            tooltipEl.style.top = `${top}px`;
        },
        hideTooltip() {
            this.elements.tooltip.classList.remove('visible');
        },
        logEvent(message, type = 'generic', playerId = '') {
            const playerName = playerId && this.state.playersData[playerId] ? this.state.playersData[playerId].name : '';
            this.state.logMessages.unshift({ message, type, playerName });
            if (this.state.logMessages.length > 30) this.state.logMessages.pop();
            this.renderLog();
        },
    };

    window.GameUI = GameUI;

    // Garante que o init seja chamado apenas uma vez.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { GameUI.init(); GameUI.bindEventListeners(); });
    } else {
        GameUI.init();
        GameUI.bindEventListeners();
    }
}