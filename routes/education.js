const express = require("express");
const router = express.Router();
const educationController = require("../controller/Education");
const {verifyToken} = require('../middleware/authmiddleware')


// Create
router.post("/addEducation", verifyToken, educationController.addEducation);

// Read all
router.get("/getEducation", verifyToken, educationController.getEducations);

// Read one by ID
router.get("/getSingleEducation/:id", verifyToken, educationController.getEducationById);

// Update
router.put("/updateEducation/:id", verifyToken, educationController.updateEducation);

// Delete
router.delete("/deleteEducation/:id", verifyToken, educationController.deleteEducation);

module.exports = router;
