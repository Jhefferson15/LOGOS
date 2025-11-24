import { SoundManager } from '../../../game/modules/audio.js';

export const MatchmakingPopup = {
    title: null, // No title for a full-screen experience

    getHTML: (data) => {
        return `
            <div class="matchmaking-popup">
                <div class="matchmaking-container">
                    <div class="player-side">
                        <img src="assets/game/avatars/player-avatar.png" alt="Your Avatar" class="avatar your-avatar">
                        <span class="player-name">Você</span>
                    </div>
                    <div class="vs-anim">
                        <span class="vs-text">VS</span>
                        <div class="spinner-grow-matchmaking">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div class="opponent-side">
                        <img src="assets/game/avatars/opponent-avatar-placeholder.png" alt="Opponent Avatar" class="avatar opponent-avatar spinning">
                        <span class="player-name searching">Procurando...</span>
                    </div>
                </div>
                <p class="matchmaking-message">Buscando um digno adversário no reino da filosofia...</p>
            </div>
            <link rel="stylesheet" href="css/components/matchmaking.css">
        `;
    },

    setupListeners: (element, data, popupManager) => {
        SoundManager.init(); // Ensure sounds are loaded
        SoundManager.play('matchmaking_start'); // Assuming a sound for matchmaking start

        // Simulate matchmaking process
        setTimeout(() => {
            // After some time, "find" an opponent
            element.querySelector('.opponent-avatar').classList.remove('spinning');
            element.querySelector('.opponent-avatar').src = 'assets/game/avatars/opponent-found.png'; // Placeholder for actual opponent avatar
            element.querySelector('.player-name.searching').textContent = 'Sócrates'; // Placeholder for opponent name
            element.querySelector('.vs-text').style.display = 'block'; // Ensure VS text is visible
            element.querySelector('.spinner-grow-matchmaking').style.display = 'none'; // Hide spinner

            element.querySelector('.matchmaking-message').textContent = 'Adversário encontrado! Preparando o debate...';
            SoundManager.play('match_found'); // Sound for match found

            // Delay before navigating to game
            setTimeout(() => {
                console.log('Matchmaking: Tentando fechar popup e navegar para o jogo...');
                popupManager.close(() => {
                    console.log('Matchmaking: Popup fechado, navegando para:', 'views/game.html');
                    console.log('Current location:', window.location.href);
                    window.location.href = 'views/game.html';
                });
            }, 2000); // Wait 2 seconds before closing popup and navigating
        }, 3000); // Simulate 3 seconds of searching
    }
};
