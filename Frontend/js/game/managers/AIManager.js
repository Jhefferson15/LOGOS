export class AIManager {
    constructor(gameInstance) {
        this.game = gameInstance; // Reference to the GameManager instance
    }

    executeAITurn(player) {
        this.game.showNotification(`${player.name} está pensando...`, 1000);

        setTimeout(() => {
            const playableCard = player.hand.find(card => this.game.isValidPlay(card));

            if (playableCard) {
                const cardIndex = player.hand.findIndex(c => c.id === playableCard.id);
                player.hand.splice(cardIndex, 1);
                this.game.discardPile.push(playableCard);
                this.game.topCard = playableCard;

                this.game.showNotification(`${player.name} jogou ${playableCard.name}.`, 1500);

                setTimeout(() => this.game.endTurn(), 1000);
            } else {
                this.game.drawCard(player);
                this.game.showNotification(`${player.name} comprou uma carta.`, 1500);
                setTimeout(() => this.game.endTurn(), 1000);
            }
        }, 2000); 
    }
}