// This controller serves static or dynamic game content
// In the future, this could fetch from a CMS or Firestore

exports.getPhilosophers = (req, res) => {
    // Mock data - in production this would come from DB
    const philosophers = [
        { id: 'socrates', name: 'Sócrates', school: 'Clássica', rarity: 'Legendary' },
        { id: 'plato', name: 'Platão', school: 'Clássica', rarity: 'Epic' },
        { id: 'aristotle', name: 'Aristóteles', school: 'Clássica', rarity: 'Epic' },
        { id: 'seneca', name: 'Sêneca', school: 'Estoicismo', rarity: 'Rare' }
    ];
    res.json(philosophers);
};

exports.getCards = (req, res) => {
    const cards = [
        { id: 'dialectic_strike', name: 'Golpe Dialético', damage: 20, cost: 3 },
        { id: 'irony_shield', name: 'Escudo da Ironia', defense: 15, cost: 2 }
    ];
    res.json(cards);
};
