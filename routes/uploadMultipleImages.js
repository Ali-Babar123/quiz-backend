const express = require("express");
const { uploadMultipleImages, getAllMultipleImages, deleteImage, deleteAllImages } = require("../controller/uploadMultipleImages");
const router = express.Router();

// POST /uploadMultipleImages
router.post("/uploadMultipleImages", uploadMultipleImages);
router.get('/getAllMultipleImages', getAllMultipleImages);
router.delete("/deleteImage/:id", deleteImage);
router.delete("/deleteAllImages", deleteAllImages);

module.exports = router;
