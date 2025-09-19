const express = require("express");
const router = express.Router();
const projectController = require("../controller/project");
const { verifyToken } = require("../middleware/authmiddleware");

// Create
router.post("/addProject/:userId", verifyToken, projectController.addProject);

// Read all
router.get("/getProjects/:userId", verifyToken, projectController.getProjects);

// Read one by ID
router.get("/getSingleProject/:userId/:id", verifyToken, projectController.getProjectById);

// Update
router.put("/updateProject/:userId/:id", verifyToken, projectController.updateProject);

// Delete
router.delete("/deleteProject/:userId/:id", verifyToken, projectController.deleteProject);

module.exports = router;
