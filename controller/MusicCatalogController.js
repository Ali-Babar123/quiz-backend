// controller/musicCatalogController.js



// controllers/musicCatalogController.js
const MusicCatalog = require("../models/MusicCatalog");

exports.uploadMusicCatalog = async (req, res) => {
  try {
    const { music_catalog } = req.body;

    if (!music_catalog || !music_catalog.categories) {
      return res.status(400).json({ message: "Invalid music catalog data" });
    }

    // ✅ Save to MongoDB
    const savedCatalog = new MusicCatalog({
      categories: music_catalog.categories,
    });

    await savedCatalog.save();

    res.status(200).json({
      message: "Music catalog uploaded successfully",
      data: savedCatalog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading music catalog",
      error: error.message,
    });
  }
};

// ✅ GET: Fetch all Music Catalogs
exports.getMusicCatalog = async (req, res) => {
  try {
    const catalogs = await MusicCatalog.find();

    if (!catalogs || catalogs.length === 0) {
      return res.status(404).json({ message: "No music catalogs found" });
    }

    res.status(200).json({
      message: "Music catalogs retrieved successfully",
      data: catalogs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching music catalogs",
      error: error.message,
    });
  }
};