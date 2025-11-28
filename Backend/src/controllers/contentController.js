const { PHILOSOPHERS_DATA } = require('../data/philosophersData');
const { arenas } = require('../data/arenasData');
const { CONCEPTS_DATA_1 } = require('../data/conceptsData');

exports.getPhilosophers = (req, res) => {
    // Return the full philosophers object
    res.json(PHILOSOPHERS_DATA);
};

exports.getCards = (req, res) => {
    // In this game, philosophers ARE the cards.
    // If there are separate "Action Cards" (Concepts), we can return them too.
    res.json(CONCEPTS_DATA_1);
};

exports.getArenas = (req, res) => {
    res.json(arenas);
};

exports.getConcepts = (req, res) => {
    res.json(CONCEPTS_DATA_1);
};
