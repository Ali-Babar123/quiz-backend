const Application = require("../models/Application");

// ✅ Create Application (Apply Job)
exports.createApplication = async (req, res) => {
  try {
    console.log("📂 Uploaded file:", req.file);
    console.log("📝 Body data:", req.body);

    let resumeUrl = "";

    if (req.file && req.file.path) {
      resumeUrl = req.file.path; // ✅ Cloudinary URL
    }

    const applicationData = {
      ...req.body,
      resumeUrl,
    };

    const application = new Application(applicationData);
    await application.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error("❌ Error creating application:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// ✅ Get All Applications
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find();
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get Application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: "Application not found" });
    }
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error("❌ Error fetching application:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Update Application
exports.updateApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, error: "Application not found" });
    }

    res.status(200).json({
      success: true,
      message: "Application updated successfully",
      data: application,
    });
  } catch (error) {
    console.error("❌ Error updating application:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Delete Application
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: "Application not found" });
    }
    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting application:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
// ✅ Get Applications by Job ID
exports.getApplicationsByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ jobId });

    if (!applications || applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No applications found for this job",
      });
    }

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("❌ Error fetching applications by Job ID:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
