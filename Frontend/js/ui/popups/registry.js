import { FullProfilePopup } from './profile/FullProfile.js';
import { LevelXpPopup } from './profile/LevelXpPopup.js';
import { LevelUpPopup } from './profile/LevelUpPopup.js';
import { ArenaTimelinePopup } from './arena/ArenaTimeline.js';
import { ChestInfoPopup } from './arena/ChestInfo.js';
import { TimedChestInfoPopup } from './arena/TimedChestInfo.js';
import { ChestRewardsPopup } from './arena/ChestRewards.js';
import { ChestOpeningPopup } from './arena/ChestOpeningPopup.js';
import { PhilosopherStudyModulePopup } from './library/PhilosopherStudyModule.js';
import { PhilosopherDetailsPopup } from './philosophers/PhilosopherDetails.js';
import { ReelsSettingsPopup } from './reels/ReelsSettings.js';
import { SettingsPopup } from './shared/Settings.js';
import { GameModeSelectionPopup } from './shared/GameModeSelection.js';
import { MatchmakingPopup } from './play/MatchmakingPopup.js';
import { DeckBuilderPopup } from './play/DeckBuilderPopup.js';
import { EndGamePopup } from './game/EndGamePopup.js';

import { FlashcardReviewModule } from './library/FlashcardReviewModule.js';

/**
 * Mapeia os IDs de popup (com namespace) para seus respectivos módulos de implementação.
 * Cada módulo deve exportar no mínimo os métodos `getHTML(data)` e `setupListeners(element, data)`.
 * 
 * Exemplo de chave: 'tela:nome-do-popup'
 * Exemplo de valor: o módulo importado.
 * 
 * @namespace Popups
 */
export const popupRegistry = {
    'profile:full': FullProfilePopup,
    'profile:level-xp': LevelXpPopup,
    'profile:level-up': LevelUpPopup,
    'arena:timeline': ArenaTimelinePopup,
    'arena:chest-info': ChestInfoPopup,
    'arena:timed-chest-info': TimedChestInfoPopup,
    'arena:chest-rewards': ChestRewardsPopup,
    'arena:chest-opening': ChestOpeningPopup,
    'library:philosopher-study-module': PhilosopherStudyModulePopup,
    'library:flashcard-review': FlashcardReviewModule,
    'philosophers:details': PhilosopherDetailsPopup,
    'reels:settings': ReelsSettingsPopup,
    'shared:settings': SettingsPopup,
    'shared:game-mode-selection': GameModeSelectionPopup,
    'play:matchmaking': MatchmakingPopup,
    'play:deck-builder': DeckBuilderPopup,
    'game:end-game': EndGamePopup,
    // Outros popups serão adicionados aqui no futuro.
};
