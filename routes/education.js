const express = require("express");
const router = express.Router();
const educationController = require("../controller/Education");
const {verifyToken} = require('../middleware/authmiddleware')


// Create
router.post("/addEducation/:userId", verifyToken, educationController.addEducation);

// Read all
router.get("/getAllEducation/:userId", verifyToken, educationController.getEducations);

// Read one by ID
router.get("/getSingleEducation/:userId/:id", verifyToken, educationController.getEducationById);

// Update
router.put("/updateEducation/:userId/:id", verifyToken, educationController.updateEducation);

// Delete
router.delete("/deleteEducation/:userId/:id", verifyToken, educationController.deleteEducation);

module.exports = router;
