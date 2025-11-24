const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

router.post('/guilds/create', socialController.createGuild);
router.post('/guilds/join', socialController.joinGuild);
router.get('/friends', socialController.listFriends);

module.exports = router;
