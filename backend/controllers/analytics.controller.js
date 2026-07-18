const Feedback = require("../models/Feedback");

/**
 * @desc    Get dashboard counters stats
 * @route   GET /api/analytics/stats
 * @access  Protected
 */
const getStats = async (req, res, next) => {
  try {
    const [totalFeedback, newCount, resolvedCount] = await Promise.all([
      Feedback.countDocuments(),
      Feedback.countDocuments({ status: "New" }),
      Feedback.countDocuments({ status: "Resolved" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalFeedback,
        new: newCount,
        resolved: resolvedCount,
      },
    });
  } catch (error) {
    console.error("Analytics stats error:", error);
    next(error);
  }
};

/**
 * @desc    Get recent 5 feedback entries (decoupled)
 * @route   GET /api/analytics/recent
 * @access  Protected
 */
const getRecentFeedback = async (req, res, next) => {
  try {
    const recentFeedback = await Feedback.find()
      .select("userName userEmail category rating status createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      data: recentFeedback,
    });
  } catch (error) {
    console.error("Analytics recent feedback error:", error);
    next(error);
  }
};

/**
 * @desc    Get analytics summary for dashboard charts (without stats, recent feedback, and rating distribution)
 * @route   GET /api/analytics/summary
 * @access  Protected
 */
const getSummary = async (req, res, next) => {
  try {
    const [
      categoryDistribution,
      statusDistribution,
      monthlyTrend,
    ] = await Promise.all([
      // Category distribution
      Feedback.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Status distribution
      Feedback.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      // Monthly trend (last 12 months) with rounded average ratings
      Feedback.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date().setMonth(new Date().getMonth() - 12)
              ),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
            avgRating: { $avg: "$rating" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
          $project: {
            _id: 1,
            count: 1,
            avgRating: { $round: ["$avgRating", 1] },
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        categoryDistribution,
        statusDistribution,
        monthlyTrend,
      },
    });
  } catch (error) {
    console.error("Analytics summary error:", error);
    next(error);
  }
};

module.exports = { getStats, getRecentFeedback, getSummary };
