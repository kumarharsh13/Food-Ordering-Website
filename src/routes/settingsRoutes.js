const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { requireUser } = require('../middleware/authMiddleware');
const { validateBody, schemas } = require('../middleware/validate');

router.get('/settings', requireUser, settingsController.renderSettingsPage);
router.post('/address', requireUser, validateBody(schemas.updateAddress), settingsController.updateAddress);
router.post('/contact', requireUser, validateBody(schemas.updateContact), settingsController.updateContact);
router.post('/password', requireUser, validateBody(schemas.updatePassword), settingsController.updatePassword);

module.exports = router;
