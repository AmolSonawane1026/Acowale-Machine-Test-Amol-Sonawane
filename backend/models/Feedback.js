const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    userEmail: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Product Features",
          "Bug Report",
          "UI/UX",
          "Performance",
          "Customer Service",
          "Other",
        ],
        message: "{VALUE} is not a valid category",
      },
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must not exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      minlength: [10, "Comment must be at least 10 characters"],
      maxlength: [1000, "Comment must not exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["New", "In Review", "Resolved"],
        message: "{VALUE} is not a valid status",
      },
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for dashboard queries
feedbackSchema.index({ category: 1 });
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ userName: "text", userEmail: "text", comment: "text" });

module.exports = mongoose.model("Feedback", feedbackSchema);
