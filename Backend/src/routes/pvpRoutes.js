const express = require('express');
const router = express.Router();
const pvpController = require('../controllers/pvpController');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

router.post('/queue/join', pvpController.joinQueue);
router.post('/queue/leave', pvpController.leaveQueue);
router.get('/status', pvpController.getStatus);
router.post('/move', pvpController.submitMove);

module.exports = router;
