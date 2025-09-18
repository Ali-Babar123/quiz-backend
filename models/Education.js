const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  id: { type: String, required: true }, 
  school: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number },
  grade: { type: Number },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Education", educationSchema);
