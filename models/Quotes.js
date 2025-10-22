const mongoose = require("mongoose");

const nestedQuoteSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.Mixed }, // ✅ can be Number or String
    title: { type: Object }, // multilingual titles
    text: { type: Object },  // multilingual text for quotes
    writer_translations: { type: Object },
    quotes: { type: Array }, // nested quotes inside categories
  },
  { _id: false }
);

const quoteCollectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: Object },
  quotes: [nestedQuoteSchema], // ✅ allow arrays of nested objects
});

module.exports = mongoose.model("QuoteCollection", quoteCollectionSchema);
