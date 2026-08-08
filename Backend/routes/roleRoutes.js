const express = require("express");
const router = express.Router();

const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  assignPermissions,
} = require("../controllers/roleController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Get All Roles
router.get(
  "/",
  verifyToken,
  authorizeRoles("super_admin", "admin"),
  getRoles
);

// Create Role
router.post(
  "/",
  verifyToken,
  authorizeRoles("super_admin"),
  createRole
);

// Update Role
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("super_admin"),
  updateRole
);

// Delete Role
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("super_admin"),
  deleteRole
);

// Assign Permissions to Role
router.put(
  "/:id/permissions",
  verifyToken,
  authorizeRoles("super_admin"),
  assignPermissions
);

module.exports = router;