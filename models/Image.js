const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    customId: { type: String, required: true }, // ID you pass in body
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", ImageSchema);
