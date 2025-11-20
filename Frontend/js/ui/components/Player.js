/**
 * Component for updating Player UI.
 */
export class Player {
    /**
     * Updates the player info display.
     * @param {object} player - The player data.
     * @param {object} currentPlayer - The current active player.
     */
    static create(player, currentPlayer) {
        const infoEl = document.getElementById(`player-info-${player.id}`);
        const avatarSeed = player.name === 'Você' ? 'Human' : player.name;
        infoEl.innerHTML = `
            <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=${avatarSeed}" class="avatar">
            <span>${player.name} (${player.score} pts)</span>
            <div class="card-count">${player.hand.length}</div>
        `;
        if (currentPlayer.id === player.id) {
            infoEl.classList.add('active');
        } else {
            infoEl.classList.remove('active');
        }
    }
}