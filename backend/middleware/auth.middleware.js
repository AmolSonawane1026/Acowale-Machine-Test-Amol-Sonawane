const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to protect routes.
 * Reads JWT from httpOnly cookie, verifies it, and attaches user to req.
 */
const protect = async (req, res, next) => {
  try {
    // Read token from httpOnly cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized — no token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and attach to request
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized — user not found",
      });
    }

    // Verify that user's email is still whitelisted
    const allowedEmails = (process.env.ALLOWED_ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    if (!allowedEmails.includes(user.email.toLowerCase())) {
      // Clear cookie immediately to log them out
      res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        expires: new Date(0),
        path: "/",
      });

      return res.status(403).json({
        success: false,
        message: "Access denied: Your email is no longer whitelisted.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Not authorized — invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Not authorized — token expired",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { protect };
