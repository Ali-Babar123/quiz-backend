// routes/musicCatalogRoutes.js
const express = require("express");
const router = express.Router();
const { uploadMusicCatalog , getMusicCatalog} = require("../controller/MusicCatalogController");

// POST route for uploading music catalog JSON
router.post("/upload-catalog", uploadMusicCatalog);
router.get("/getAllCatalogMusic", getMusicCatalog);
module.exports = router;
