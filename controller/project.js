const User = require("../models/User");

// ➕ Add new project for a user
exports.addProject = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.projects.push(req.body);
    await user.save();

    res.status(201).json({ message: "Project added successfully", projects: user.projects });
  } catch (error) {
    res.status(400).json({ message: "Error adding project", error });
  }
};

// 📖 Get all projects for a user
exports.getProjects = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("projects");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};

// 📖 Get single project
exports.getProjectById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const project = user.projects.id(req.params.id); // match route
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project", error });
  }
};

// ✏️ Update project
exports.updateProject = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const project = user.projects.id(req.params.id); // match route
    if (!project) return res.status(404).json({ message: "Project not found" });

    Object.assign(project, req.body);
    await user.save();

    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    res.status(400).json({ message: "Error updating project", error });
  }
};

// 🗑️ Delete project
exports.deleteProject = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const project = user.projects.id(req.params.id); // match route
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.deleteOne();
    await user.save();

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
  }
};
