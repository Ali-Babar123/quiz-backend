const User = require("../models/User");

// ➕ Add new education for a user
exports.addEducation = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.education.push(req.body);
    await user.save();

    res.status(201).json({ message: "Education added successfully", education: user.education });
  } catch (error) {
    res.status(400).json({ message: "Error adding education", error });
  }
};

// 📖 Get all education records for a user
exports.getEducations = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("education");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.education);
  } catch (error) {
    res.status(500).json({ message: "Error fetching education records", error });
  }
};

// 📖 Get single education record
exports.getEducationById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const education = user.education.id(req.params.id); // ✅ match your route
    if (!education) return res.status(404).json({ message: "Education not found" });

    res.status(200).json(education);
  } catch (error) {
    res.status(500).json({ message: "Error fetching education", error });
  }
};

// ✏️ Update education
exports.updateEducation = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const education = user.education.id(req.params.id); // ✅ match your route
    if (!education) return res.status(404).json({ message: "Education not found" });

    Object.assign(education, req.body);
    await user.save();

    res.status(200).json({ message: "Education updated successfully", education });
  } catch (error) {
    res.status(400).json({ message: "Error updating education", error });
  }
};

// 🗑️ Delete education
exports.deleteEducation = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const education = user.education.id(req.params.id); // ✅ match your route
    if (!education) return res.status(404).json({ message: "Education not found" });

    education.deleteOne();
    await user.save();

    res.status(200).json({ message: "Education deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting education", error });
  }
};
