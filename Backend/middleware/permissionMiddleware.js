const User = require("../models/User");

const authorizePermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      // ========================================
      // CHECK USER ID
      // ========================================

      if (!req.user || !req.user.id) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      // ========================================
      // GET USER WITH ROLE + PERMISSIONS
      // ========================================

      const user = await User.findById(req.user.id).populate({
        path: "role",
        populate: {
          path: "permissions",
        },
      });

      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      // ========================================
      // SUPER ADMIN
      // ========================================

      if (user.role?.name === "super_admin") {
        return next();
      }

      // ========================================
      // CHECK ROLE
      // ========================================

      if (!user.role) {
        return res.status(403).json({
          message: "User role not found",
        });
      }

      // ========================================
      // CHECK PERMISSION
      // ========================================

      const permissions = user.role.permissions || [];

      const hasPermission = permissions.some(
        (permission) => permission.name === permissionName
      );

      if (!hasPermission) {
        return res.status(403).json({
          message: `Permission denied: ${permissionName}`,
        });
      }

      // ========================================
      // ALLOWED
      // ========================================

      next();
    } catch (error) {
      console.log("Permission authorization error:", error);

      return res.status(500).json({
        message: "Authorization failed",
      });
    }
  };
};

module.exports = authorizePermission;