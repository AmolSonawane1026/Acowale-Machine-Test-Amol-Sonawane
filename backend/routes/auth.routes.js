const express = require("express");
const router = express.Router();
const { register, login, logout, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const { validateRegister, validateLogin } = require("../middleware/validate");
const methodNotAllowed = require("../middleware/methodNotAllowed");

// Public routes
router.route("/register")
  .post(validateRegister, register)
  .all(methodNotAllowed);

router.route("/login")
  .post(validateLogin, login)
  .all(methodNotAllowed);

router.route("/logout")
  .post(logout)
  .all(methodNotAllowed);

// Protected routes
router.route("/me")
  .get(protect, getMe)
  .all(methodNotAllowed);

module.exports = router;
