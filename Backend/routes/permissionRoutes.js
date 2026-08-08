const express = require("express");
const router = express.Router();

const {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} = require("../controllers/permissionController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get(
  "/",
  verifyToken,
  authorizeRoles("super_admin", "admin"),
  getPermissions
);

router.post(
  "/",
  verifyToken,
  authorizeRoles("super_admin"),
  createPermission
);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("super_admin"),
  updatePermission
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("super_admin"),
  deletePermission
);

module.exports = router;