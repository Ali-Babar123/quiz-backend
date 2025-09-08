const express = require("express");
const { uploadMultipleImages, getAllMultipleImages } = require("../controller/uploadMultipleImages");
const router = express.Router();

// POST /uploadMultipleImages
router.post("/uploadMultipleImages", uploadMultipleImages);
router.get('/getAllMultipleImages', getAllMultipleImages)

module.exports = router;
