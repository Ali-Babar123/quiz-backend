const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },   // User who bookmarked
    jobId: { type: String, required: true },    // Job that is bookmarked
  },
  { timestamps: true } // Auto adds createdAt & updatedAt
);

module.exports = mongoose.model("Bookmark", BookmarkSchema);
