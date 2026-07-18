const express = require("express");
const router = express.Router();
const { getStats, getRecentFeedback, getSummary } = require("../controllers/analytics.controller");
const { protect } = require("../middleware/auth.middleware");
const methodNotAllowed = require("../middleware/methodNotAllowed");

// Protected routes — admin only
router.route("/stats")
  .get(protect, getStats)
  .all(methodNotAllowed);

router.route("/recent")
  .get(protect, getRecentFeedback)
  .all(methodNotAllowed);

router.route("/summary")
  .get(protect, getSummary)
  .all(methodNotAllowed);

module.exports = router;
