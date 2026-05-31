const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const { requireUser } = require("../middleware/authMiddleware");

router.get("/", homeController.renderIndexPage);
router.get("/homepage", requireUser, homeController.renderHomePage);

module.exports = router;
