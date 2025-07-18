const express = require('express');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getBookStats,
  searchBooks
} = require('../controllers/book');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getBooks);
router.get('/search', searchBooks);
router.get('/:id', getBook);

// Protected routes
router.use(protect);

// Admin/Librarian routes
router.post('/', authorize('admin', 'librarian'), createBook);
router.put('/:id', authorize('admin', 'librarian'), updateBook);
router.delete('/:id', authorize('admin'), deleteBook);
router.get('/stats', authorize('admin', 'librarian'), getBookStats);

// Admin book management endpoints
router.get('/admin/books', protect, authorize('admin'), getBooks);
router.get('/admin/books/popular', protect, authorize('admin'), async (req, res) => {
  try {
    // Example: Top 5 books by borrow count (rating.count)
    const popularBooks = await Book.find().sort({ 'rating.count': -1 }).limit(5);
    res.json({ success: true, data: popularBooks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch popular books.' });
  }
});
router.post('/admin/books', protect, authorize('admin'), createBook);
router.put('/admin/books/:id', protect, authorize('admin'), updateBook);
router.delete('/admin/books/:id', protect, authorize('admin'), deleteBook);

module.exports = router; 