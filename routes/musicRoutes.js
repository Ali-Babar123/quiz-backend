const express = require("express");
const router = express.Router();
const { uploadMusic } = require("../middleware/cloudinary");
const { uploadMusicFiles } = require("../controller/musicController");

// POST route — upload up to 14 music files
router.post("/upload", uploadMusic.array("music", 14), uploadMusicFiles);

module.exports = router;
