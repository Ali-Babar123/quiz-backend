const Job = require("../models/Job");

// ✅ Create Job
exports.createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({ success: true, message: "Job created successfully!", job });
  } catch (error) {
    console.error("❌ Create Job Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get All Jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get Single Job
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Update Job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, message: "Job updated successfully!", job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Delete Job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, message: "Job deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// ✅ Get Jobs by Employer ID
exports.getJobsByEmployer = async (req, res) => {
  try {
    const { employerId } = req.params;
    console.log(employerId)

    const jobs = await Job.find({ employerId });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ success: false, message: "No jobs found for this employer" });
    }

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("❌ Get Jobs by Employer Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
