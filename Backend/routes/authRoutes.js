const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middleware/validationMiddleware");
const {
  register,
  login,
  getMe,
} = require("../controllers/authController");

// Register
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  register
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);
const verifyToken = require("../middleware/authMiddleware");

router.get(
  "/me",
  verifyToken,
  getMe
);

module.exports = router;