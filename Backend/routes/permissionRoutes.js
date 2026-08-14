const express = require("express");
const router = express.Router();

const {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} = require("../controllers/permissionController");

const verifyToken = require("../middleware/authMiddleware");
const authorizePermission = require("../middleware/permissionMiddleware");

// ===============================
// VIEW PERMISSIONS
// ===============================
router.get(
  "/",
  verifyToken,
  authorizePermission("permissions"),
  getPermissions
);

// ===============================
// CREATE PERMISSION
// ===============================
router.post(
  "/",
  verifyToken,
  authorizePermission("create_permission"),
  createPermission
);

// ===============================
// UPDATE PERMISSION
// ===============================
router.put(
  "/:id",
  verifyToken,
  authorizePermission("edit_permission"),
  updatePermission
);

// ===============================
// DELETE PERMISSION
// ===============================
router.delete(
  "/:id",
  verifyToken,
  authorizePermission("delete_permission"),
  deletePermission
);

module.exports = router;