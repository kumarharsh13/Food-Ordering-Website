const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateBody, schemas } = require('../middleware/validate');

router.get('/signup', authController.renderSignUpPage);
router.post('/signup', validateBody(schemas.signUp), authController.signUp);
router.get('/signin', authController.renderSignInPage);
router.post('/signin', validateBody(schemas.signIn), authController.signIn);
router.get('/logout', authController.logout);

module.exports = router;
