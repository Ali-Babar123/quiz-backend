const express = require('express');
const { uploadImage } = require('../controller/uploadImageController');
const router = express.Router();

router.post('/uploadImage', uploadImage);

module.exports = router;
