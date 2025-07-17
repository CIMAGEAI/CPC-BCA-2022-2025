const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  publishedYear: { type: Number, required: true },
  isbn: { type: String, required: true, unique: true },
  coverUrl: { type: String },
  totalCopies: { type: Number, required: true },
  availableCopies: { type: Number, required: true }
});

module.exports = mongoose.model('Book', bookSchema); 