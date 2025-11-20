/**
 * Stores all static game data and constants.
 * @module GameConstants
 */

export const ELIXIR_TICK_RATE = 280;
export const OPPONENT_PLAY_DELAY = 1500;
export const MAX_ELIXIR = 10;
export const ELIXIR_PER_TICK = 0.1;

/**
 * Enum for Card Colors.
 * @readonly
 * @enum {string}
 */
export const CardColors = { RED: 'red', GREEN: 'green', BLUE: 'blue', YELLOW: 'yellow', WILD: 'wild' };

/**
 * SVG Icons for special cards.
 * @readonly
 * @enum {string}
 */
export const CardIcons = {
    SKIP: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>`,
    REVERSE: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
    DRAW_TWO: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M6 2h12v5H6z"></path><text x="12" y="17" font-size="8" text-anchor="middle" fill="currentColor">+2</text></svg>`,
    WILD: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 00-10 10h20a10 10 0 00-10-10z" fill-opacity="0.2"></path></svg>`,
    WILD_DRAW_FOUR: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><text x="12" y="17" font-size="8" text-anchor="middle" fill="currentColor">+4</text></svg>`
};

/**
 * Base deck configuration.
 * Contains the definitions for special cards.
 * @type {Array<{value: string, color: string, cost: number, icon: string, description: string}>}
 */
export const CARD_DECK_BASE = [
    { value: 'Skip', color: CardColors.RED, cost: 5, icon: CardIcons.SKIP, description: 'O próximo jogador perde a vez.' },
    { value: 'Reverse', color: CardColors.GREEN, cost: 5, icon: CardIcons.REVERSE, description: 'Inverte a direção do jogo.' },
    { value: '+2', color: CardColors.BLUE, cost: 6, icon: CardIcons.DRAW_TWO, description: 'O próximo jogador compra 2 cartas.' },
    { value: 'Wild', color: CardColors.WILD, cost: 8, icon: CardIcons.WILD, description: 'Muda a cor atual para a de sua escolha.' },
    { value: 'Wild+4', color: CardColors.WILD, cost: 10, icon: CardIcons.WILD_DRAW_FOUR, description: 'Muda a cor e força o próximo a comprar 4 cartas.' }
];
['1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach(num => {
    [CardColors.RED, CardColors.GREEN, CardColors.BLUE, CardColors.YELLOW].forEach(color => {
        CARD_DECK_BASE.push({ value: num, color: color, cost: parseInt(num), description: `Uma carta ${color} com valor ${num}.` });
    });
});

/**
 * Player profile data.
 * Includes names and avatar SVGs.
 * @type {Object.<string, {name: string, avatarSVG: string}>}
 */
export const PLAYER_DATA = {
    'player-main': { name: 'Você', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path></svg>' },
    'player-nietzsche': { name: 'Nietzsche', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
    'player-hipatia': { name: 'Hipátia', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' },
    'player-confucio': { name: 'Confúcio', avatarSVG: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' }
};