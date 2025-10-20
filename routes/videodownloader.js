const express = require('express');
const router = express.Router();
const videoController = require('../controller/videoController');

// Correct function name
router.post('/video', videoController.videoHandler);

module.exports = router;
