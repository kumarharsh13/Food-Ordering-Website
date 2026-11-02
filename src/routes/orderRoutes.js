const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { requireUser } = require("../middleware/authMiddleware");
const { attachCartCount } = require("../middleware/cartCount");

router.get(
  "/confirmation",
  requireUser,
  attachCartCount,
  orderController.renderConfirmationPage,
);
router.get(
  "/myorders",
  requireUser,
  attachCartCount,
  orderController.renderMyOrdersPage,
);

module.exports = router;
