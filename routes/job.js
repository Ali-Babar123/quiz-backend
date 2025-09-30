const express = require("express");
const router = express.Router();
const { createJob, getJobs, getJobById, filterJobs, getAppliedJobs, getLimitedJobs, getJobsCountByCategory, updateJob, deleteJob, getJobsByEmployer, getApplicationsByJobIds } = require("../controller/JobController");
const {verifyToken} = require('../middleware/authmiddleware');


// CRUD Routes
router.post("/createJob", verifyToken, createJob);       // Create Job
router.get("/getAllJobs", verifyToken, getJobs);  
router.get('/getAppliedJobs', verifyToken, getAppliedJobs);        // Get All Jobs
router.get("/getLimitedJobs", verifyToken, getLimitedJobs);          // Get All Jobs

router.post('/filterJobs', verifyToken, filterJobs);
router.post('/getJobsCountByCategory', verifyToken, getJobsCountByCategory);


router.get("/getSingleJob/:id", verifyToken, getJobById);    // Get Single Job
router.put("/updateJob/:id", verifyToken, updateJob);     // Update Job
router.delete("/deleteJob/:id", verifyToken, deleteJob);  // Delete Job
router.get('/getJobsByEmployer/:employerId', verifyToken, getJobsByEmployer)

router.get("/getApplicationsByJobs", verifyToken, getApplicationsByJobIds);
module.exports = router;
