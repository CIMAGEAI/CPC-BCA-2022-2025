const express = require('express');
const {
  getTransactions,
  getTransaction,
  borrowBook,
  returnBook,
  getMyTransactions,
  getTransactionStats
} = require('../controllers/transaction');

const { protect, authorize, canBorrow } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// User routes
router.get('/my-transactions', getMyTransactions);
router.post('/borrow', canBorrow, borrowBook);
router.put('/:id/return', returnBook);

// Admin/Librarian routes
router.get('/', authorize('admin', 'librarian'), getTransactions);
router.get('/stats', authorize('admin', 'librarian'), getTransactionStats);
router.get('/:id', getTransaction);

module.exports = router; 