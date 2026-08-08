const User = require("../models/User");
const Role = require("../models/Role");
const Permission = require("../models/Permission");

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRoles = await Role.countDocuments();
    const totalPermissions = await Permission.countDocuments();
    const activeUsers = await User.countDocuments({
      status: "Active",
    });

    res.status(200).json({
      totalUsers,
      totalRoles,
      totalPermissions,
      activeUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};