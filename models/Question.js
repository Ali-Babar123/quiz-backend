const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  questionText: { type: String, required: true, unique: true },
  options: [{ type: String, required: true }],
  correctAnswerIndex: { type: Number, required: true }
});

module.exports = mongoose.model('Question', questionSchema);
