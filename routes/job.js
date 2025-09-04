const express = require("express");
const router = express.Router();
const { createJob, getJobs, getJobById, updateJob, deleteJob, getJobsByEmployer, getApplicationsByJobIds } = require("../controller/JobController");
const {verifyToken} = require('../middleware/authmiddleware')

// CRUD Routes
router.post("/createJob", verifyToken, createJob);       // Create Job
router.get("/getAllJobs", verifyToken, getJobs);          // Get All Jobs
router.get("/getSingleJob/:id", verifyToken, getJobById);    // Get Single Job
router.put("/updateJob/:id", verifyToken, updateJob);     // Update Job
router.delete("/deleteJob/:id", verifyToken, deleteJob);  // Delete Job
router.get('/getJobsByEmployer/:employerId', verifyToken, getJobsByEmployer)

router.get("/getApplicationsByJobs", verifyToken, getApplicationsByJobIds);
module.exports = router;
