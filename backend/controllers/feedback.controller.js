const Feedback = require("../models/Feedback");

/**
 * @desc    Submit new feedback (public)
 * @route   POST /api/feedback
 * @access  Public
 */
const createFeedback = async (req, res, next) => {
  try {
    const { userName, userEmail, category, rating, comment } = req.body;

    const feedback = await Feedback.create({
      userName,
      userEmail,
      category,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Create feedback error:", error);
    next(error);
  }
};

/**
 * @desc    Get all feedback with filters, search, pagination
 * @route   GET /api/feedback
 * @access  Protected
 */
const getAllFeedback = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      search,
      sortBy = "createdAt",
    } = req.query;

    // Build filter query
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: "i" } },
        { userEmail: { $regex: search, $options: "i" } },
        { comment: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object (always sort descending for recent entries first)
    const sort = {};
    sort[sortBy] = -1;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [feedbacks, total] = await Promise.all([
      Feedback.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
      Feedback.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: feedbacks,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error("Get all feedback error:", error);
    next(error);
  }
};

/**
 * @desc    Get single feedback by ID
 * @route   GET /api/feedback/:id
 * @access  Protected
 */
const getFeedbackById = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error("Get feedback by ID error:", error);
    next(error);
  }
};

/**
 * @desc    Update feedback status
 * @route   PATCH /api/feedback/:id
 * @access  Protected
 */
const updateFeedback = async (req, res, next) => {
  try {
    const { status } = req.body;

    const existingFeedback = await Feedback.findById(req.params.id);
    if (!existingFeedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    // Prevent reverting status to 'New' once updated
    if (existingFeedback.status !== "New" && status === "New") {
      return res.status(400).json({
        success: false,
        message: "Status cannot be reverted to 'New' once updated",
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback status updated",
      data: feedback,
    });
  } catch (error) {
    console.error("Update feedback error:", error);
    next(error);
  }
};

/**
 * @desc    Delete feedback
 * @route   DELETE /api/feedback/:id
 * @access  Protected
 */
const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Delete feedback error:", error);
    next(error);
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
};
