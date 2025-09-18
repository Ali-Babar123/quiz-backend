const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  id: { type: String, required: true }, // you can also make this unique if needed
  title: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String },
  description: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String },
  isCurrent: { type: Boolean, default: false },
  location: { type: String },
  jobType: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Experience", experienceSchema);
