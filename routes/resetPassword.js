const express = require("express");
const router = express.Router();
const { resetPassword } = require("../controller/resetPassword");

router.post("/reset-password", resetPassword);

module.exports = router;
