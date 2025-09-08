const express = require("express");
const { uploadMultipleImages } = require("../controller/uploadMultipleImages");
const router = express.Router();

// POST /uploadMultipleImages
router.post("/uploadMultipleImages", uploadMultipleImages);

module.exports = router;
