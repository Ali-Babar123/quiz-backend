const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: { type: String, required: true },
  website: { type: String },
  headOffice: { type: Map, of: String, default: {} },
  employeeSize: { type: Number, default: 0 },
  logoUrl: { type: String, default: "" },
  galleryImages: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  companyCreatedByUserId: { type: String, required: true },

  // Suggested fields
  about: { type: String },
  foundingYear: { type: Number },
  ceoName: { type: String },
  headcountGrowth: { type: Map, of: Number, default: {} },
  socialLinks: { type: Map, of: String, default: {} },
  benefits: { type: [String], default: [] },
  ratings: { type: Map, of: Number, default: {} },
  jobOpeningsCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  locations: { type: [Map], default: [] },
  awards: { type: [String], default: [] },
  specializations: { type: [String], default: [] },
  cultureTags: { type: [String], default: [] },
  isFeatured: { type: Boolean, default: false },
  videoIntroduction: { type: String },

  // Advanced / optional
  parentCompanyId: { type: String },
  subsidiaries: { type: [String] },
  remoteFriendly: { type: Boolean, default: false },
  diversityStats: { type: Map, of: Number, default: {} },
  missionStatement: { type: String },
  coreValues: { type: [String] },
});

module.exports = mongoose.model("Company", companySchema);
