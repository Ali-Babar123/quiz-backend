const express = require("express");
const router = express.Router();
const experienceController = require("../controller/experience");
const {verifyToken} = require('../middleware/authmiddleware')


// Create
router.post("/addExperience", verifyToken, experienceController.addExperience);

// Read all
router.get("/getAllExperience", verifyToken, experienceController.getExperiences);

// Read one by ID
router.get("/getSingleExperience/:id", verifyToken,  experienceController.getExperienceById);

// Update
router.put("/updateExperience/:id", verifyToken,  experienceController.updateExperience);

// Delete
router.delete("/deleteExperience/:id", verifyToken, experienceController.deleteExperience);

module.exports = router;
