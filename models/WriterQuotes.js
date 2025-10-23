const mongoose = require("mongoose");

// Schema for multilingual fields
const multilingualSchema = new mongoose.Schema(
  {
    en: { type: String, default: "" },
    ar: { type: String, default: "" },
    zh: { type: String, default: "" },
    de: { type: String, default: "" },
    fr: { type: String, default: "" },
    id: { type: String, default: "" },
    ja: { type: String, default: "" },
    pt: { type: String, default: "" },
    ru: { type: String, default: "" },
    tr: { type: String, default: "" },
  },
  { _id: false }
);

// Each quote item
const writerQuoteSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: multilingualSchema, required: true }, // Writer’s name
    text: { type: multilingualSchema, required: true },  // Quote text
  },
  { _id: false }
);

// Main writer quotes collection
const writerQuotesCollectionSchema = new mongoose.Schema({
  id: { type: String, default: "quotes_by_writers" },
  title: { type: multilingualSchema, required: true },
  quotes: { type: [writerQuoteSchema], default: [] },
});

module.exports = mongoose.model("WriterQuotes", writerQuotesCollectionSchema);
