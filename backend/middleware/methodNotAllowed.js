/**
 * Middleware to reject unsupported HTTP methods with 405 Method Not Allowed.
 */
const methodNotAllowed = (req, res) => {
  res.status(405).json({
    success: false,
    message: `Method ${req.method} is not allowed on this endpoint`,
  });
};

module.exports = methodNotAllowed;
