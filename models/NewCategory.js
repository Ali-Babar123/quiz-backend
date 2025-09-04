const mongoose = require('mongoose');

const newCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  desc: {
    type: String,
    default: ''
  },
  icon: {
    type: String
  }
});


module.exports = mongoose.model('NewCategory', newCategorySchema);
