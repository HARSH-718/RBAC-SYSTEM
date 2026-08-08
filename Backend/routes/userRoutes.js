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

router.get(
  "/",
  verifyToken,
  authorizeRoles("super_admin", "admin"),
  getUsers
);
router.post(
  "/",
  verifyToken,
  authorizeRoles("super_admin"),
  createUser
);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("super_admin"),
  updateUser
);
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("super_admin"),
  deleteUser
);

module.exports = router;