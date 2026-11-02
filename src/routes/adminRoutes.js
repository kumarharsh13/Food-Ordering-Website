const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/authMiddleware');
const { validateBody, schemas } = require('../middleware/validate');

router.get('/admin_signin', adminController.renderAdminSignInPage);
router.post('/admin_signin', validateBody(schemas.adminSignIn), adminController.adminSignIn);
router.get('/adminHomepage', requireAdmin, adminController.renderAdminHomepage);
router.get('/admin_addFood', requireAdmin, adminController.renderAddFoodPage);
router.post('/admin_addFood', requireAdmin, validateBody(schemas.addFood), adminController.addFood);
router.get('/admin_view_dispatch_orders', requireAdmin, adminController.renderViewDispatchOrdersPage);
router.post('/admin_view_dispatch_orders', requireAdmin, adminController.dispatchOrders);
router.get('/admin_change_price', requireAdmin, adminController.renderChangePricePage);
router.post('/admin_change_price', requireAdmin, validateBody(schemas.changePrice), adminController.changePrice);

module.exports = router;
