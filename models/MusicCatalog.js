const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  filename: String,
  sub_category: String,
  size_mb: String,
  url: String,
});

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  tracks: [trackSchema],
});

const musicCatalogSchema = new mongoose.Schema({
  categories: [categorySchema],
});

module.exports = mongoose.model("MusicCatalog", musicCatalogSchema);
