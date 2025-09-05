const express = require("express");
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationsByJobId,
  getApplicationsByUserId
} = require("../controller/applicationController");
const {verifyToken} = require('../middleware/authmiddleware')
const {upload} = require('../middleware/cloudinary')


const router = express.Router();

router.post("/createApplication", verifyToken,upload.single("resume"), createApplication);          // Apply to job
router.get("/getAllApplications",verifyToken,  getApplications);             // Get all applications
router.get("/getSingleApplication/:id", verifyToken, getApplicationById);       // Get application by ID
router.put("/updateApplication/:id", verifyToken, updateApplication);        // Update application
router.delete("/deleteApplication/:id", verifyToken, deleteApplication);     // Delete application
router.get('/getApplicationsByJob/:jobId', verifyToken, getApplicationsByJobId);


router.get("/getApplicationsByUser/:userId", verifyToken, getApplicationsByUserId);
module.exports = router;
