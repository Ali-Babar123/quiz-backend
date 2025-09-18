const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  id: { type: String, required: true }, // you can also use unique: true if you want this as custom ID
  name: { type: String, required: true },
  description: { type: String },
  platform: { type: String },
  url: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
