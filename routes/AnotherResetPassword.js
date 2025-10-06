const express = require("express");
const router = express.Router();
const { AnotherResetPassword } = require("../controller/AnotherResetPassword");

router.post("/another/reset-password", AnotherResetPassword);

module.exports = router;
