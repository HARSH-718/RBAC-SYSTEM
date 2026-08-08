const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create User
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status,
    });

    res.status(201).json({
      message: "User Created Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Update User
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, role, status } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        role,
        status,
      },
      {
        new: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User Updated Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Delete User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "User Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};