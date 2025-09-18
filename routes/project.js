const express = require("express");
const router = express.Router();
const projectController = require("../controller/project");
const {verifyToken} = require('../middleware/authmiddleware')

// Create
router.post("/addProject", verifyToken, projectController.addProject);

// Read all
router.get("/getAllProjects", verifyToken, projectController.getProjects);

// Read one by ID
router.get("/SingleProject/:id", verifyToken, projectController.getProjectById);

// Update
router.put("/updateProject/:id", verifyToken, projectController.updateProject);

// Delete
router.delete("/deleteProject/:id", verifyToken, projectController.deleteProject);

module.exports = router;
