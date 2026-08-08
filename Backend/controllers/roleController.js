const Role = require("../models/Role");

// Get All Roles
const getRoles = async (req, res) => {
  try {
const roles = await Role.find().populate("permissions");

    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create Role
const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    const roleExists = await Role.findOne({ name });

    if (roleExists) {
      return res.status(400).json({
        message: "Role already exists",
      });
    }

const role = await Role.create({
  name,
  permissions,
});

await role.populate("permissions");

    res.status(201).json({
      message: "Role Created Successfully",
      role,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Update Role
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;

  const role = await Role.findByIdAndUpdate(
  id,
  { name, permissions },
  { new: true }
).populate("permissions");

    if (!role) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    res.status(200).json({
      message: "Role Updated Successfully",
      role,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Role
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    await Role.findByIdAndDelete(id);

    res.status(200).json({
      message: "Role Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Assign Permissions to Role
const assignPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const role = await Role.findByIdAndUpdate(
      id,
      { permissions },
      { new: true }
    ).populate("permissions");

    if (!role) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    res.status(200).json({
      message: "Permissions Assigned Successfully",
      role,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  assignPermissions,
};