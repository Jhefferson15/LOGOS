const express = require('express');
const router = express.Router();
const seedController = require('../controllers/seedController');
const verifyToken = require('../middleware/auth');

// Protect this route in production!
// For now, we allow authenticated users to seed (dev mode)
router.post('/', verifyToken, seedController.seedDatabase);

module.exports = router;
