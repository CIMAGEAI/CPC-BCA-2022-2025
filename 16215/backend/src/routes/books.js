const express = require('express');
const router = express.Router();

// Import Book model (assume it exists in ../models/Book.js)
const Book = require('../models/Book');

// GET /api/books/count - return total number of books
router.get('/count', async (req, res) => {
  try {
    const count = await Book.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get book count' });
  }
});

// (Optional) GET /api/books - return all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get books' });
  }
});

module.exports = router; 