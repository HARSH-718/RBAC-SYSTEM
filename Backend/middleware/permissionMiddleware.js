const Role = require("../models/Role");

const authorizePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const role = await Role.findOne({
        name: req.user.role,
      }).populate("permissions");

      if (!role) {
        return res.status(404).json({
          message: "Role not found",
        });
      }

      const hasPermission = role.permissions.some(
        (item) => item.name === permission
      );

      if (!hasPermission) {
        return res.status(403).json({
          message: "Permission Denied",
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
};

module.exports = authorizePermission;