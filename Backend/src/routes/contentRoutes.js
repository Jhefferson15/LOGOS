const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// Content routes might be public or protected. Let's make them public for now.
router.get('/philosophers', contentController.getPhilosophers);
router.get('/cards', contentController.getCards);

module.exports = router;
