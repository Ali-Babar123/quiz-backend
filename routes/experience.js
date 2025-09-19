const express = require("express");
const router = express.Router();
const experienceController = require("../controller/experience");
const { verifyToken } = require("../middleware/authmiddleware");

// Create
router.post("/addExperience/:userId", verifyToken, experienceController.addExperience);

// Read all
router.get("/getExperiences/:userId", verifyToken, experienceController.getExperiences);

// Read one by ID
router.get("/getSingleExperience/:userId/:id", verifyToken, experienceController.getExperienceById);

// Update
router.put("/updateExperience/:userId/:id", verifyToken, experienceController.updateExperience);

// Delete
router.delete("/deleteExperience/:userId/:id", verifyToken, experienceController.deleteExperience);

module.exports = router;
