const express = require('express')
const router = express.Router();
const {googleLogin} = require('../controller/googleLogin')
const {verifyToken} = require('../middleware/authmiddleware')


router.post("/google-login", googleLogin);

module.exports = router;