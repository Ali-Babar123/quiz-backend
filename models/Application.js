const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    // Core
    jobId: { type: String, required: true },
    userId: { type: String, required: true },
    resumeUrl: { type: String, default: "" },
    coverLetter: { type: String, default: "" },
    status: { type: String, default: "Applied" },
    appliedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    rating: { type: Number, default: 0.0 },
    notes: { type: String, default: "" },

    // Suggested
    interviewScheduled: { type: Date },
    interviewType: { type: String, default: "" },
    interviewNotes: { type: String, default: "" },
    feedback: { type: String, default: "" },
    preferredSalary: { type: Object, default: {} },
    availabilityDate: { type: Date },
    referrals: [{ type: String }],
    source: { type: String, default: "" },
    documents: [{ type: Object }],
    isFlagged: { type: Boolean, default: false },

    // Advanced
    skillMatchScore: { type: Number, default: 0.0 },
    applicationStep: { type: String, default: "Applied" },
    offerDetails: { type: Object, default: {} },
    communicationLog: [{ type: Object }],

    // New
    location: { type: Object, default: {} },
    isViewed: { type: Boolean, default: false },
    viewedBy: { type: String, default: "" },
    viewedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);
