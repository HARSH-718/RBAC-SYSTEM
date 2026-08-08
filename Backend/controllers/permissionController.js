const Permission = require("../models/Permission");

// Get All Permissions
const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();

    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createPermission = async (req, res) => {
  try {
    // Multiple permissions
    if (Array.isArray(req.body)) {
      const permissions = await Permission.insertMany(req.body, {
        ordered: false,
      });

      return res.status(201).json({
        message: "Permissions Created Successfully",
        permissions,
      });
    }

    // Single permission
    const { name, description } = req.body;

    const exists = await Permission.findOne({ name });

    if (exists) {
      return res.status(400).json({
        message: "Permission already exists",
      });
    }

    const permission = await Permission.create({
      name,
      description,
    });

    res.status(201).json({
      message: "Permission Created Successfully",
      permission,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Update Permission
const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const permission = await Permission.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!permission) {
      return res.status(404).json({
        message: "Permission not found",
      });
    }

    res.status(200).json({
      message: "Permission Updated Successfully",
      permission,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Permission
const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findById(id);

    if (!permission) {
      return res.status(404).json({
        message: "Permission not found",
      });
    }

    await Permission.findByIdAndDelete(id);

    res.status(200).json({
      message: "Permission Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
};