const mongoose = require('mongoose');

const ImageCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  coverImage: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
      name: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('ImageCategory', ImageCategorySchema);
