const User = require("../models/User");

// ➕ Add new experience for a user
exports.addExperience = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.experience.push(req.body);
    await user.save();

    res.status(201).json({ message: "Experience added successfully", experience: user.experience });
  } catch (error) {
    res.status(400).json({ message: "Error adding experience", error });
  }
};

// 📖 Get all experiences for a user
exports.getExperiences = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("experience");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.experience);
  } catch (error) {
    res.status(500).json({ message: "Error fetching experiences", error });
  }
};

// 📖 Get single experience record
exports.getExperienceById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const experience = user.experience.id(req.params.id); // match route param
    if (!experience) return res.status(404).json({ message: "Experience not found" });

    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({ message: "Error fetching experience", error });
  }
};

// ✏️ Update experience
exports.updateExperience = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const experience = user.experience.id(req.params.id);
    if (!experience) return res.status(404).json({ message: "Experience not found" });

    Object.assign(experience, req.body);
    await user.save();

    res.status(200).json({ message: "Experience updated successfully", experience });
  } catch (error) {
    res.status(400).json({ message: "Error updating experience", error });
  }
};

// 🗑️ Delete experience
exports.deleteExperience = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const experience = user.experience.id(req.params.id);
    if (!experience) return res.status(404).json({ message: "Experience not found" });

    experience.deleteOne();
    await user.save();

    res.status(200).json({ message: "Experience deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting experience", error });
  }
};
