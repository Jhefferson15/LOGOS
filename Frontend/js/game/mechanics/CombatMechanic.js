import { GameMechanic } from './GameMechanic.js';
import { PHILOSOPHERS_DATA, SCHOOL_RELATIONSHIPS } from '../../data/philosophers.js';
import { ERA_COLOR_MAP } from '../modules/constants.js';
import { SoundManager } from '../modules/audio.js';
import { popupManager } from '../../ui/PopupManager.js'; // Assuming we can use this for Draft

/**
 * Combat Mechanic (Debate Mode):
 * - 8 cards total per team.
 * - Draft Phase: Choose 3 Concepts (Buffs) before match.
 * - 2 slots in center (Arena).
 * - Highest Reputation wins (Base + Buffs + School Bonus).
 */
export class CombatMechanic extends GameMechanic {
    get id() { return 'combat'; }
    get name() { return 'Debate Filosófico'; }
    get description() { return 'Combate 1v1. Escolha 3 conceitos e vença os argumentos na arena.'; }

    getLayout() { return 'combat'; }

    getTheme() {
        return {
            id: 'combat',
            colors: {
                primary: '#2c3e50', // Dark Blue/Grey
                secondary: '#c0392b', // Red
                accent: '#d35400', // Orange
                text: '#ecf0f1'
            },
            background: 'linear-gradient(to bottom, #2c3e50 0%, #000000 100%)', // Dark, serious arena
            font: "'Oswald', sans-serif",
            music: 'battle_theme',
            sfx: {
                play_card: '../assets/game/audio/flipcard.mp3',
                clash: '../assets/game/audio/clash.mp3', // Need to ensure this exists or use fallback
                victory: '../assets/game/audio/victory.mp3'
            }
        };
    }

    getInitialHandSize() {
        return 4; // Hand size per round, total deck is 8
    }

    constructor() {
        super();
        this.teamBuffs = {
            'player-main': [],
            'opponent': [] // AI buffs
        };
        this.wins = {
            'player-main': 0,
            'opponent': 0
        };
        this.roundsPlayed = 0;
        this.maxRounds = 8;
    }

    /**
     * Called when the game initializes this mechanic.
     * Triggers the Draft Phase.
     */
    initializeState(engine, stateModule, utils) {
        // Reset state
        this.wins = { 'player-main': 0, 'opponent': 0 };
        this.roundsPlayed = 0;
        this.teamBuffs['player-main'] = [];
        this.teamBuffs['opponent'] = []; // AI gets random buffs later

        // Trigger Draft UI
        // Since we don't have a dedicated Draft UI class yet, we'll simulate or inject it.
        // For now, let's auto-assign for AI and show a simple alert/modal for Player if possible,
        // or just assign default buffs for MVP.

        console.log("Initializing Debate Mode - Draft Phase");
        this.assignAIBuffs();

        // TODO: Show actual Draft Popup. For now, giving default buffs to player to unblock.
        this.teamBuffs['player-main'] = [
            { name: 'Lógica Formal', effect: 'analytic_bonus', value: 10 },
            { name: 'Retórica', effect: 'flat_bonus', value: 5 },
            { name: 'Ad Hominem', effect: 'debuff_opponent', value: -5 }
        ];

        engine.logEvent("Fase de Preparação: Buffs definidos!", "system");
    }

    assignAIBuffs() {
        const possibleBuffs = [
            { name: 'Dogmatismo', effect: 'flat_bonus', value: 5 },
            { name: 'Ceticismo', effect: 'debuff_opponent', value: -5 },
            { name: 'Dialética', effect: 'school_bonus', value: 10 }
        ];
        // Randomly pick 3
        this.teamBuffs['opponent'] = possibleBuffs.slice(0, 3);
    }

    canPlayCard(gameState, playerId, cardIndex, cardData) {
        // In Debate, you can play any card from your hand into the slot
        return true;
    }

    calculateScore(gameState, playedCardId) {
        return 0; // Score is calculated in resolveCombat
    }

    async playCard(engine, playerId, cardIndex, cardData) {
        const player = engine.state.game.players[playerId];

        engine.state.isAnimating = true;
        engine.hideTooltip();
        SoundManager.play('play_card');

        let startElement = null;
        if (playerId === 'player-main') {
            startElement = engine.elements.selectedCardSlot.querySelector('.cr-card') ||
                Array.from(engine.elements.crHandContainer.children).find(el => parseInt(el.dataset.index) === cardIndex);
            if (!startElement) startElement = Array.from(engine.elements.crHandContainer.children)[0];
        } else {
            startElement = document.getElementById(playerId);
        }

        // Target specific arena slots
        let targetElement = engine.elements.discardPile; // Fallback
        if (playerId === 'player-main') {
            targetElement = document.getElementById('arena-player-slot');
        } else {
            targetElement = document.getElementById('arena-opponent-slot');
        }

        await engine.animateCardFly(startElement, targetElement, cardData, playerId !== 'player-main');

        // Visual: Add card to the slot
        if (targetElement) {
            targetElement.innerHTML = ''; // Clear previous
            targetElement.classList.add('has-card');
            const cardEl = document.createElement('div');
            cardEl.className = 'cr-card';
            const color = ERA_COLOR_MAP[cardData.era] || 'wild';
            cardEl.dataset.color = color;
            cardEl.innerHTML = `<span class="card-value">${cardData.name}</span><div class="card-cost">${cardData.date}</div>`;
            cardEl.style.width = '100%';
            cardEl.style.height = '100%';
            targetElement.appendChild(cardEl);
        }

        const playedCardId = player.hand.splice(cardIndex, 1)[0];
        engine.state.game.discardPile.push(playedCardId);

        // Logic:
        // If discardPile has even number of cards (0, 2, 4...), this is the FIRST move of a bout.
        // If discardPile has odd number (1, 3...), this is the SECOND move.

        const pileSize = engine.state.game.discardPile.length;

        if (pileSize % 2 === 0) {
            // Second card played. Compare!
            const firstCardId = engine.state.game.discardPile[pileSize - 2];
            const secondCardId = playedCardId;

            await this.resolveCombat(engine, firstCardId, secondCardId, playerId);
        } else {
            engine.logEvent(`${cardData.name} sobe ao púlpito!`, 'play-card', playerId);
            // Wait for opponent
            if (playerId === 'player-main') {
                setTimeout(() => this.simulateOpponentTurn(engine, 'opponent'), 1000);
            }
        }

        engine.state.game.lastPlayedCard = playedCardId;
        engine.state.selectedCardIndex = null;
        engine.render();
    }

    async resolveCombat(engine, firstCardId, secondCardId, secondPlayerId) {
        const firstCard = PHILOSOPHERS_DATA[firstCardId];
        const secondCard = PHILOSOPHERS_DATA[secondCardId];

        // Determine who played first
        const playerOrder = engine.state.game.playerOrder;
        const secondPlayerIndex = playerOrder.indexOf(secondPlayerId);
        const firstPlayerIndex = (secondPlayerIndex - 1 + playerOrder.length) % playerOrder.length;
        const firstPlayerId = playerOrder[firstPlayerIndex];

        // Calculate Total Reputation
        const score1 = this.calculateCombatPower(firstCard, firstPlayerId, secondCard);
        const score2 = this.calculateCombatPower(secondCard, secondPlayerId, firstCard);

        let winnerId = null;
        let logMsg = "";

        if (score1 > score2) {
            winnerId = firstPlayerId;
            logMsg = `${firstCard.name} (${score1}) vence ${secondCard.name} (${score2})!`;
        } else if (score2 > score1) {
            winnerId = secondPlayerId;
            logMsg = `${secondCard.name} (${score2}) vence ${firstCard.name} (${score1})!`;
        } else {
            logMsg = "Empate retórico!";
        }

        await new Promise(r => setTimeout(r, 800)); // Suspense

        if (winnerId) {
            this.wins[winnerId]++;
            engine.logEvent(logMsg, 'game-event');
            engine.state.game.players[winnerId].score += 1; // Score tracks rounds won
            SoundManager.play('power_activate');
        } else {
            engine.logEvent(logMsg, 'game-event');
        }

        this.roundsPlayed++;

        // Check if we need to refill hands (if empty and deck has cards)
        // For Debate, we have a fixed deck of 8, hand of 4.
        // If hand is empty, draw 4 more.
        const p1 = engine.state.game.players[firstPlayerId];
        const p2 = engine.state.game.players[secondPlayerId];

        if (p1.hand.length === 0 && engine.state.game.drawDeck.length > 0) {
            await this.refillHands(engine);
        }
    }

    calculateCombatPower(card, playerId, opponentCard) {
        let power = card.reputation || 50; // Base
        const buffs = this.teamBuffs[playerId] || [];

        // Apply Buffs
        buffs.forEach(buff => {
            if (buff.effect === 'flat_bonus') power += buff.value;
            // Add more buff logic here
        });

        // Apply School Advantage (Rock-Paper-Scissors)
        if (SCHOOL_RELATIONSHIPS[card.school] && SCHOOL_RELATIONSHIPS[card.school].includes(opponentCard.school)) {
            power += 15; // Significant bonus
            console.log(`${card.name} gets School Bonus against ${opponentCard.name}`);
        }

        return power;
    }

    async refillHands(engine) {
        engine.logEvent("Nova rodada de argumentos!", "system");
        // Draw up to 4 cards for each player
        for (let i = 0; i < 4; i++) {
            await engine.drawCardFromDeck('player-main');
            await engine.drawCardFromDeck('opponent');
        }
        engine.render();
    }

    checkWinCondition(gameState) {
        // End after 8 rounds (or when deck and hands are empty)
        const p1 = gameState.game.players['player-main'];
        const p2 = gameState.game.players['opponent'];

        if (p1.hand.length === 0 && gameState.game.drawDeck.length === 0) {
            // Game Over
            if (this.wins['player-main'] > this.wins['opponent']) return 'player-main';
            if (this.wins['opponent'] > this.wins['player-main']) return 'opponent';
            return 'draw'; // Handle draw?
        }
        return null;
    }

    async simulateOpponentTurn(engine, opponentId) {
        const opponent = engine.state.game.players[opponentId];

        // AI Logic: Play highest power card (simplified)
        // In a real debate, you might want to counter the opponent's played card.
        // If opponent played first (discardPile odd), we see what they played.

        const pileSize = engine.state.game.discardPile.length;
        let bestCardIndex = 0;

        if (pileSize % 2 !== 0) {
            // Counter-play!
            const opponentCardId = engine.state.game.discardPile[pileSize - 1];
            const opponentCard = PHILOSOPHERS_DATA[opponentCardId];

            // Find card that beats opponentCard or has highest raw power
            let bestPower = -1;

            opponent.hand.forEach((cardId, index) => {
                const myCard = PHILOSOPHERS_DATA[cardId];
                const power = this.calculateCombatPower(myCard, opponentId, opponentCard);
                if (power > bestPower) {
                    bestPower = power;
                    bestCardIndex = index;
                }
            });
        } else {
            // Opening move: Play strongest raw card
            // We don't know opponent card, so assume neutral
            let maxRep = -1;
            opponent.hand.forEach((cardId, index) => {
                const rep = PHILOSOPHERS_DATA[cardId].reputation || 0;
                if (rep > maxRep) {
                    maxRep = rep;
                    bestCardIndex = index;
                }
            });
        }

        await this.playCard(engine, opponentId, bestCardIndex, PHILOSOPHERS_DATA[opponent.hand[bestCardIndex]]);
    }
}
