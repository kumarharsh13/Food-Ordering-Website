const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { requireUser } = require("../middleware/authMiddleware");

router.get("/confirmation", requireUser, orderController.renderConfirmationPage);
router.get("/myorders", requireUser, orderController.renderMyOrdersPage);

module.exports = router;
