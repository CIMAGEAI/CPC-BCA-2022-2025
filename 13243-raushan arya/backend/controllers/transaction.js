const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private (Admin/Librarian)
exports.getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Transaction.countDocuments();

    // Build query
    let query = Transaction.find();

    // Filter by status
    if (req.query.status) {
      query = query.find({ status: req.query.status });
    }

    // Filter by user
    if (req.query.userId) {
      query = query.find({ user: req.query.userId });
    }

    // Filter by book
    if (req.query.bookId) {
      query = query.find({ book: req.query.bookId });
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query = query.find({
        borrowDate: {
          $gte: new Date(req.query.startDate),
          $lte: new Date(req.query.endDate)
        }
      });
    }

    // Sort
    if (req.query.sort) {
      const sortOrder = req.query.order === 'desc' ? -1 : 1;
      query = query.sort({ [req.query.sort]: sortOrder });
    } else {
      query = query.sort({ borrowDate: -1 });
    }

    // Pagination
    query = query.skip(startIndex).limit(limit);

    // Execute query with populated fields
    const transactions = await query
      .populate('user', 'name email role studentId')
      .populate('book', 'title author isbn');

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: transactions.length,
      pagination,
      data: transactions
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private (Admin/Librarian or transaction owner)
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('user', 'name email role studentId')
      .populate('book', 'title author isbn genre');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if user is accessing their own transaction or is admin/librarian
    if (req.user.id !== transaction.user._id.toString() && !['admin', 'librarian'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this transaction'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Borrow a book
// @route   POST /api/transactions/borrow
// @access  Private (Students, Faculty, Staff)
exports.borrowBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { bookId, borrowDate, dueDate } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing'
      });
    }

    if (book.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing'
      });
    }

    // Check if user already has this book borrowed
    const existingBorrow = await Transaction.findOne({
      user: req.user.id,
      book: bookId,
      status: 'borrowed'
    });

    if (existingBorrow) {
      return res.status(400).json({
        success: false,
        message: 'You have already borrowed this book'
      });
    }

    // Check user's borrowing limit based on role
    const userBorrowingLimit = {
      student: 3,
      faculty: 5,
      staff: 4
    };

    const currentBorrows = await Transaction.countDocuments({
      user: req.user.id,
      status: 'borrowed'
    });

    if (currentBorrows >= userBorrowingLimit[req.user.role]) {
      return res.status(400).json({
        success: false,
        message: `You have reached your borrowing limit of ${userBorrowingLimit[req.user.role]} books`
      });
    }

    // Check for overdue books
    const overdueBooks = await Transaction.countDocuments({
      user: req.user.id,
      status: 'borrowed',
      dueDate: { $lt: new Date() }
    });

    if (overdueBooks > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have overdue books. Please return them before borrowing new ones.'
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      user: req.user.id,
      book: bookId,
      borrowDate: borrowDate || new Date(),
      dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days default
      status: 'borrowed'
    });

    // Update book availability
    book.availableCopies -= 1;
    await book.save();

    // Populate transaction data
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('user', 'name email role studentId')
      .populate('book', 'title author isbn');

    res.status(201).json({
      success: true,
      data: populatedTransaction,
      message: 'Book borrowed successfully'
    });
  } catch (error) {
    console.error('Borrow book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Return a book
// @route   PUT /api/transactions/:id/return
// @access  Private (Admin/Librarian or transaction owner)
exports.returnBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if user is authorized to return this book
    if (req.user.id !== transaction.user.toString() && !['admin', 'librarian'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to return this book'
      });
    }

    if (transaction.status !== 'borrowed') {
      return res.status(400).json({
        success: false,
        message: 'Book is not currently borrowed'
      });
    }

    // Update transaction
    transaction.status = 'returned';
    transaction.returnDate = new Date();
    
    // Calculate fine if overdue
    if (transaction.dueDate < new Date()) {
      const daysOverdue = Math.ceil((new Date() - transaction.dueDate) / (1000 * 60 * 60 * 24));
      transaction.fine = daysOverdue * 1; // $1 per day
    }

    await transaction.save();

    // Update book availability
    const book = await Book.findById(transaction.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    // Populate transaction data
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('user', 'name email role studentId')
      .populate('book', 'title author isbn');

    res.status(200).json({
      success: true,
      data: populatedTransaction,
      message: 'Book returned successfully'
    });
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's transactions
// @route   GET /api/transactions/my-transactions
// @access  Private
exports.getMyTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Transaction.countDocuments({ user: req.user.id });

    let query = Transaction.find({ user: req.user.id });

    // Filter by status
    if (req.query.status) {
      query = query.find({ status: req.query.status });
    }

    // Sort
    if (req.query.sort) {
      const sortOrder = req.query.order === 'desc' ? -1 : 1;
      query = query.sort({ [req.query.sort]: sortOrder });
    } else {
      query = query.sort({ borrowDate: -1 });
    }

    // Pagination
    query = query.skip(startIndex).limit(limit);

    // Execute query
    const transactions = await query
      .populate('book', 'title author isbn genre coverImage');

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: transactions.length,
      pagination,
      data: transactions
    });
  } catch (error) {
    console.error('Get my transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get transaction statistics
// @route   GET /api/transactions/stats
// @access  Private (Admin/Librarian)
exports.getTransactionStats = async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();
    const borrowedTransactions = await Transaction.countDocuments({ status: 'borrowed' });
    const returnedTransactions = await Transaction.countDocuments({ status: 'returned' });
    const overdueTransactions = await Transaction.countDocuments({
      status: 'borrowed',
      dueDate: { $lt: new Date() }
    });

    // Monthly statistics for the last 12 months
    const monthlyStats = await Transaction.aggregate([
      {
        $match: {
          borrowDate: {
            $gte: new Date(new Date().getFullYear(), 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$borrowDate' },
          count: { $sum: 1 },
          borrowed: {
            $sum: { $cond: [{ $eq: ['$status', 'borrowed'] }, 1, 0] }
          },
          returned: {
            $sum: { $cond: [{ $eq: ['$status', 'returned'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Top borrowed books
    const topBooks = await Transaction.aggregate([
      {
        $group: {
          _id: '$book',
          borrowCount: { $sum: 1 }
        }
      },
      {
        $sort: { borrowCount: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookInfo'
        }
      },
      {
        $unwind: '$bookInfo'
      },
      {
        $project: {
          bookId: '$_id',
          title: '$bookInfo.title',
          author: '$bookInfo.author',
          borrowCount: 1
        }
      }
    ]);

    // Overdue fines
    const totalFines = await Transaction.aggregate([
      {
        $match: { fine: { $gt: 0 } }
      },
      {
        $group: {
          _id: null,
          totalFines: { $sum: '$fine' },
          paidFines: { $sum: { $cond: ['$finePaid', '$fine', 0] } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalTransactions,
        borrowedTransactions,
        returnedTransactions,
        overdueTransactions,
        monthlyStats,
        topBooks,
        fines: totalFines[0] || { totalFines: 0, paidFines: 0 }
      }
    });
  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 