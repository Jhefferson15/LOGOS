const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const verifyToken = require('../middleware/auth');

// All game routes require authentication
router.use(verifyToken);

router.post('/sync', gameController.sync);
router.post('/chests/unlock', gameController.unlockChest);
router.post('/chests/open', gameController.openChest);

module.exports = router;
