const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const { requireUser } = require("../middleware/authMiddleware");
const { attachCartCount } = require("../middleware/cartCount");

router.get("/", homeController.renderIndexPage);
router.get(
  "/homepage",
  requireUser,
  attachCartCount,
  homeController.renderHomePage,
);

module.exports = router;
