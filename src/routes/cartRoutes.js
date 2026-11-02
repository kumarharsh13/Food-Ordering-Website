const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { requireUser } = require('../middleware/authMiddleware');
const { attachCartCount } = require('../middleware/cartCount');

router.get('/cart', requireUser, attachCartCount, cartController.renderCart);
router.post('/cart', requireUser, cartController.updateCart);
router.post('/checkout', requireUser, cartController.checkout);

module.exports = router;
