export class PlayerInfo {
    constructor(playerInfoEl) {
        this.playerInfoEl = playerInfoEl;
    }

    render(player, currentPlayerId) {
        this.playerInfoEl.innerHTML = `
            <div class="player-details">
                <div class="player-name">${player.name}</div>
                <div class="card-count">${player.hand.length} Cartas</div>
                ${!player.isAI ? `<div id="player-score">Pontos: ${player.score}</div>` : ''}
            </div>
        `;
        if (currentPlayerId === player.id) {
            this.playerInfoEl.classList.add('active');
        } else {
            this.playerInfoEl.classList.remove('active');
        }
    }
}