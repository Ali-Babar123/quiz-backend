const Job = require("../models/Job");
const Application = require('../models/Application')
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
exports.getJobs = async (req, res) => { try { const jobs = await Job.find(); res.status(200).json({ success: true, jobs }); } catch (error) { res.status(500).json({ success: false, error: error.message }); } };


// ✅ Get Applied Jobs by User
exports.getAppliedJobs = async (req, res) => {
  try {
    const userId = req.query.userId; // frontend se ?userId= pass karna hoga
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Jobs jisme appliedUsers array me userId exist karta ho
    const jobs = await Job.find({ appliedUsers: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalJobs = await Job.countDocuments({ appliedUsers: userId });

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalJobs / limit),
      totalJobs,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error("❌ Get Applied Jobs Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get All Jobs
exports.getLimitedJobs = async (req, res) => {
  try {
    // Get page & limit from query params (default: page=1, limit=10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate how many to skip
    const skip = (page - 1) * limit;

    // Fetch jobs sorted by createdAt (newest first)
    const jobs = await Job.find()
      .sort({ createdAt: -1 }) // -1 = descending (newest first)
      .skip(skip)
      .limit(limit);

    // Total jobs in DB
    const totalCount = await Job.countDocuments();

    res.status(200).json({
      success: true,
      currentPage: page,
      totalJobs: totalCount,
      fetchedCount: jobs.length,
      jobs,
    });
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
// ✅ Get Applications by Multiple Job IDs with Pagination
exports.getApplicationsByJobIds = async (req, res) => {
  try {
    const jobIds = req.query.jobIds?.split(",");
    const page = parseInt(req.query.page) || 1;   // default page = 1
    const limit = parseInt(req.query.limit) || 10; // default limit = 10
    const skip = (page - 1) * limit;

    if (!jobIds || jobIds.length === 0) {
      return res.status(400).json({ success: false, message: "No job IDs provided" });
    }

    // Total count
    const totalApplications = await Application.countDocuments({
      jobId: { $in: jobIds },
    });

    // Paginated results
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalApplications / limit),
      totalApplications,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("❌ Get Applications By JobIds Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};




exports.filterJobs = async (req, res) => {
  try {
    const {
      workplaceType,
      jobType,
      positionLevel,
      locations,
      salaryRange,
      experience,
      specializations,
      companyIds,
      industries,
      keywords,
      educationLevel,
      languages,
      jobCategory,
      jobSubCategory,
      jobTitle,
      jobDescription,
      page = 1,
      limit = 10,
    } = req.body;

    let filter = {};

    if (workplaceType) {
      filter.workplaceType = { $regex: new RegExp(`^${workplaceType}$`, "i") };
    }

    if (jobType && jobType.length > 0) {
      filter.employmentTypes = {
        $in: jobType.map((jt) => new RegExp(`^${jt}$`, "i")),
      };
    }

    if (positionLevel && positionLevel.length > 0) {
      filter.positionLevel = {
        $in: positionLevel.map((pl) => new RegExp(`^${pl}$`, "i")),
      };
    }

    if (locations && locations.length > 0) {
      filter.$or = locations.map((loc) => ({
        "location.city": { $regex: new RegExp(`^${loc.city}$`, "i") },
        "location.state": { $regex: new RegExp(`^${loc.state}$`, "i") },
        "location.country": { $regex: new RegExp(`^${loc.country}$`, "i") },
      }));
    }

    if (salaryRange && (salaryRange.min || salaryRange.max)) {
      filter["salaryRange.min"] = { $gte: salaryRange.min || 0 };
      filter["salaryRange.max"] = {
        $lte: salaryRange.max || Number.MAX_VALUE,
      };
    }

    if (experience && experience.length > 0) {
      filter.experienceRequired = {
        $in: experience.map((ex) => new RegExp(`^${ex}$`, "i")),
      };
    }

    if (specializations && specializations.length > 0) {
      filter.specializations = {
        $in: specializations.map((sp) => new RegExp(sp, "i")),
      };
    }

    if (companyIds && companyIds.length > 0) {
      filter.companyId = { $in: companyIds };
    }

    if (industries && industries.length > 0) {
      filter.industry = {
        $in: industries.map((ind) => new RegExp(`^${ind}$`, "i")),
      };
    }

    if (keywords && keywords.length > 0) {
      filter.$or = [
        { jobTitle: { $regex: keywords.join("|"), $options: "i" } },
        { jobDescription: { $regex: keywords.join("|"), $options: "i" } },
      ];
    }

    if (educationLevel && educationLevel.length > 0) {
      filter.qualifications = {
        $in: educationLevel.map((edu) => new RegExp(`^${edu}$`, "i")),
      };
    }

    if (languages && languages.length > 0) {
      filter.requiredSkills = {
        $in: languages.map((lang) => new RegExp(`^${lang}$`, "i")),
      };
    }

    if (jobCategory) {
      filter.jobCategory = { $regex: new RegExp(`^${jobCategory}$`, "i") };
    }

    if (jobSubCategory) {
      filter.jobSubCategory = { $regex: new RegExp(`^${jobSubCategory}$`, "i") };
    }

    // ✅ NEW: strict word-by-word matching for title
   if (jobTitle) {
  const words = jobTitle.trim().split(/\s+/);
  filter.$or = [
    ...(filter.$or || []),
    ...words.map((word) => ({
      jobTitle: { $regex: word, $options: "i" },
    })),
  ];
}


    // ✅ NEW: strict word-by-word matching for description
   if (jobDescription) {
  const words = jobDescription.trim().split(/\s+/);
  filter.$or = [
    ...(filter.$or || []),
    ...words.map((word) => ({
      jobDescription: { $regex: word, $options: "i" },
    })),
  ];
}


    // ✅ Pagination
    const skip = (page - 1) * limit;

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalJobs = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      page: Number(page),
      totalPages: Math.ceil(totalJobs / limit),
      totalJobs,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};





// controller function
exports.getJobsCountByCategory = async (req, res) => {
  try {
    const { categories = [], subCategories = [] } = req.body; // list from frontend

    // match jobs based on category or subcategory
    const matchQuery = {
      $or: [
        { jobCategory: { $in: categories } },
        { jobSubCategory: { $in: subCategories } }
      ]
    };

    const jobs = await Job.aggregate([
      { $match: matchQuery },
      {
        $facet: {
          overallCount: [{ $count: "total" }],

          categoryCounts: [
            { $match: { jobCategory: { $in: categories } } },
            { $group: { _id: "$jobCategory", count: { $sum: 1 } } }
          ],

          subCategoryCounts: [
            { $match: { jobSubCategory: { $in: subCategories } } },
            { $group: { _id: "$jobSubCategory", count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      overallCount: jobs[0].overallCount[0]?.total || 0,
      categoryCounts: jobs[0].categoryCounts,
      subCategoryCounts: jobs[0].subCategoryCounts
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
