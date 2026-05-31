const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/signup", authController.renderSignUpPage);
router.post("/signup", authController.signUp);
router.get("/signin", authController.renderSignInPage);
router.post("/signin", authController.signIn);
router.get("/logout", authController.logout);

module.exports = router;
