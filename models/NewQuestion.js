const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  Newcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'NewCategory', required: true },
  NewquestionText: { type: String, required: true, unique: true },
  Newoptions: [{ type: String, required: true }],
  NewcorrectAnswerIndex: { type: Number, required: true }
});

module.exports = mongoose.model('NewQuestion', questionSchema);
