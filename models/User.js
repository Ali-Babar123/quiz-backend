const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: "" },
  userType: { type: String, enum: ["JobSeeker", "HiringManager"], default: "JobSeeker" },
  phoneNumber: { type: String },
  isOnboarding: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },

  yearsOfExpirerence: { type: Number },
  portfolio: { type: String },

  websiteUrl: { type: String },
  industry: { type: String },
  companySize: { type: String },

  dateOfBirth: { type: String, default: "" },
  gender: { type: String, default: "" },

  deviceToken: { type: String, default: "" },
  isNotifications: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  headline: { type: String, default: "" },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  country: { type: String, default: "" },
  city: { type: String, default: "" },
  profileImageUrl: { type: String, default: "" },
  resumeUrl: { type: String, default: "" },
  websiteUrl: { type: String, default: "" },
  linkedinUrl: { type: String, default: "" },
  githubUrl: { type: String, default: "" },

  skills: { type: [String], default: [] },

  // ✅ Updated Experience
  experience: [
    {
      title: String,
      company: String,
      role: String,
      description: String,
      startDate: String,
      endDate: String,
      isCurrent: Boolean,
      location: String,
      jobType: String,
    },
  ],

  // ✅ Updated Education
  education: [
    {
      school: String,
      degree: String,
      fieldOfStudy: String,
      startYear: Number,
      endYear: Number,
      grade: String,
      description: String,
    },
  ],

  // ✅ Updated Projects
  projects: [
    {
      name: String,
      description: String,
      platform: String,
      url: String,
    },
  ],

  languages: [
    {
      name: String,
      proficiency: String,
    },
  ],

  workAuthorization: {
    visaStatus: { type: String, default: "" },
    relocationWillingness: { type: Boolean, default: false },
    remoteAvailability: { type: Boolean, default: false },
    availabilityDate: { type: String, default: "" },
  },

  verification: {
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    idCardVerified: { type: Boolean, default: false },
  },

  profileCompletion: { type: Number, default: 0 },

  alerts: {
    isJobAlertEnabled: { type: Boolean, default: false },
    alertKeywords: { type: [String], default: [] },
  },

  status: {
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    lastSeen: { type: Date },
  },

  stats: {
    appliedJobsCount: { type: Number, default: 0 },
    savedJobsCount: { type: Number, default: 0 },
    profileViewsCount: { type: Number, default: 0 },
  },

  badges: { type: [String], default: [] },

  notificationPreferences: {
    jobRecommendations: { type: Boolean, default: true },
    applicationUpdates: { type: Boolean, default: true },
    chatMessages: { type: Boolean, default: true },
  },

  safety: {
    blockedUsers: { type: [String], default: [] },
    reportedJobs: { type: [String], default: [] },
  },

  activityLog: { type: [Object], default: [] },
});

module.exports = mongoose.model("User", signupSchema);
