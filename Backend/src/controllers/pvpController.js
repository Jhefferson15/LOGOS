const matchmakingService = require('../services/matchmakingService');

exports.joinQueue = (req, res) => {
    const userId = req.user.uid;
    const result = matchmakingService.joinQueue(userId);
    res.json(result);
};

exports.leaveQueue = (req, res) => {
    const userId = req.user.uid;
    matchmakingService.leaveQueue(userId);
    res.json({ message: 'Left queue' });
};

exports.getStatus = (req, res) => {
    const userId = req.user.uid;
    const status = matchmakingService.getMatchStatus(userId);
    res.json(status);
};

exports.submitMove = (req, res) => {
    const userId = req.user.uid;
    const moveData = req.body;

    try {
        const matchState = matchmakingService.processMove(userId, moveData);
        res.json({ message: 'Move processed', match: matchState });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
