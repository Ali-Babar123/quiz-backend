const User = require('../models/User');
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all users  
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
 try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password"); // hide password
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User fetched successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Prevent duplicate email update
    if (updates.email) {
      const existingUser = await User.findOne({ email: updates.email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User updated successfully", data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change Password (for logged-in users)
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 🔒 Check if user has a password set
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "You do not have a password set. Please set a new password directly."
      });
    }

    // ✅ Check if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Previous password is incorrect" });
    }

    // 🔐 Hash and set new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getMultipleUsers = async (req, res) => {
  try {
    const ids = req.query.ids ? req.query.ids.split(",") : [];

    if (!ids.length) {
      return res.status(400).json({ message: "Please provide user IDs in query params" });
    }

    const users = await User.find({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
