const express = require("express");
const router = express.Router();
const {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedback.controller");
const { protect } = require("../middleware/auth.middleware");
const { validateFeedback, validateStatusUpdate } = require("../middleware/validate");
const methodNotAllowed = require("../middleware/methodNotAllowed");

// Public route — submit feedback & Protected route — list all feedbacks
router.route("/")
  .post(validateFeedback, createFeedback)
  .get(protect, getAllFeedback)
  .all(methodNotAllowed);

// Protected routes — details, status update, delete
router.route("/:id")
  .get(protect, getFeedbackById)
  .patch(protect, validateStatusUpdate, updateFeedback)
  .delete(protect, deleteFeedback)
  .all(methodNotAllowed);

module.exports = router;
