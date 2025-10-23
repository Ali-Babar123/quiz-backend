const express = require("express");
const router = express.Router();
const {
  uploadWriterQuotes,
  getWriterQuotes,
  deleteWriterQuotes,
} = require("../controller/WriterQuotesController");

// POST - upload writer quotes
router.post("/upload", uploadWriterQuotes);

// GET - fetch all writer quotes
router.get("/getAll", getWriterQuotes);

// DELETE - remove all writer quotes
router.delete("/", deleteWriterQuotes);

module.exports = router;
