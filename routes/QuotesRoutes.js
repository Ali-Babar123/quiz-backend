const express = require("express");
const router = express.Router();
const quoteController = require("../controller/QuotesController");

router.post("/upload", quoteController.uploadQuotes);     // POST JSON
router.get("/getAllQuotes", quoteController.getAllCollections);       // GET all

module.exports = router;
