const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const { requireUser } = require("../middleware/authMiddleware");

router.get("/settings", requireUser, settingsController.renderSettingsPage);
router.post("/address", requireUser, settingsController.updateAddress);
router.post("/contact", requireUser, settingsController.updateContact);
router.post("/password", requireUser, settingsController.updatePassword);

module.exports = router;
