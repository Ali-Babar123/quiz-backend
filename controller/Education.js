const Education = require("../models/Education");

// Add new education
exports.addEducation = async (req, res) => {
  try {
    const education = new Education(req.body);
    await education.save();
    res.status(201).json({ message: "Education added successfully", education });
  } catch (error) {
    res.status(400).json({ message: "Error adding education", error });
  }
};

// Get all education records
exports.getEducations = async (req, res) => {
  try {
    const educations = await Education.find();
    res.status(200).json(educations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching education records", error });
  }
};

// Get education by ID
exports.getEducationById = async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);
    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }
    res.status(200).json(education);
  } catch (error) {
    res.status(500).json({ message: "Error fetching education", error });
  }
};

// Update education
exports.updateEducation = async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }
    res.status(200).json({ message: "Education updated successfully", education });
  } catch (error) {
    res.status(400).json({ message: "Error updating education", error });
  }
};

// Delete education
exports.deleteEducation = async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }
    res.status(200).json({ message: "Education deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting education", error });
  }
};
