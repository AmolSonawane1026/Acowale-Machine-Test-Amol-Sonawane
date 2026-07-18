const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Generate JWT and set it as an httpOnly cookie.
 */
const sendTokenCookie = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

/**
 * @desc    Register admin user
 * @route   POST /api/auth/register
 * @access  Public (can be restricted)
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check against authorized admin emails list in .env
    const allowedEmails = (process.env.ALLOWED_ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    if (!allowedEmails.includes(email.trim().toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: "Registration failed: This email address is not authorized to register as an administrator. Please contact your organization administrator to authorize this email.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const user = await User.create({ name, email, password });
    sendTokenCookie(user, 201, res);
  } catch (error) {
    console.error("Register error:", error);
    next(error);
  }
};

/**
 * @desc    Login admin user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check against authorized admin emails list in .env
    const allowedEmails = (process.env.ALLOWED_ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    if (!allowedEmails.includes(email.trim().toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: "Access denied: This email address is not authorized to access the admin panel. Please contact your organization administrator.",
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    sendTokenCookie(user, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

/**
 * @desc    Logout admin user (clear cookie)
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      expires: new Date(0),
      path: "/",
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

/**
 * @desc    Get current logged-in admin
 * @route   GET /api/auth/me
 * @access  Protected
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    next(error);
  }
};

module.exports = { register, login, logout, getMe };
