const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const verifyToken = require('../middleware/auth');

router.get('/', shopController.getShop);
router.post('/buy', verifyToken, shopController.buyItem);

module.exports = router;
