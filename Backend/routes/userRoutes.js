const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Get Users
router.get(
  "/",
  verifyToken,
  authorizeRoles("super_admin", "admin"),
  getUsers
);

// Create User
router.post(
  "/",
  verifyToken,
  authorizeRoles("super_admin"),
  createUser
);

// Update User
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("super_admin"),
  updateUser
);

// Delete User
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("super_admin"),
  deleteUser
);

module.exports = router;