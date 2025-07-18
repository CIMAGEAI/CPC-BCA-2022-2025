const Book = require('../models/Book');
const { validationResult } = require('express-validator');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Book.countDocuments();

    // Build query
    let query = Book.find();

    // Search functionality
    if (req.query.search) {
      query = query.find({
        $text: { $search: req.query.search }
      });
    }

    // Filter by genre
    if (req.query.genre) {
      query = query.find({ genre: req.query.genre });
    }

    // Filter by availability
    if (req.query.available === 'true') {
      query = query.find({ availableCopies: { $gt: 0 }, status: 'active' });
    }

    // Filter by status
    if (req.query.status) {
      query = query.find({ status: req.query.status });
    }

    // Sort
    if (req.query.sort) {
      const sortOrder = req.query.order === 'desc' ? -1 : 1;
      query = query.sort({ [req.query.sort]: sortOrder });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    // Pagination
    query = query.skip(startIndex).limit(limit);

    // Execute query
    const books = await query.populate('addedBy', 'name');

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
      count: books.length,
      pagination,
      data: books
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private (Admin/Librarian)
exports.createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Add the user who created the book
    req.body.addedBy = req.user.id;

    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Create book error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Book with this ISBN already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Admin/Librarian)
exports.updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Update book error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Book with this ISBN already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Admin only)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if book has active loans
    if (book.totalCopies !== book.availableCopies) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete book with active loans'
      });
    }

    await book.remove();

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get book statistics
// @route   GET /api/books/stats
// @access  Private (Admin/Librarian)
exports.getBookStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const availableBooks = await Book.countDocuments({ 
      availableCopies: { $gt: 0 }, 
      status: 'active' 
    });
    const borrowedBooks = await Book.aggregate([
      {
        $group: {
          _id: null,
          totalBorrowed: { $sum: { $subtract: ['$totalCopies', '$availableCopies'] } }
        }
      }
    ]);

    const genreStats = await Book.aggregate([
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 },
          totalCopies: { $sum: '$totalCopies' },
          availableCopies: { $sum: '$availableCopies' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const statusStats = await Book.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        availableBooks,
        borrowedBooks: borrowedBooks[0]?.totalBorrowed || 0,
        genreStats,
        statusStats
      }
    });
  } catch (error) {
    console.error('Get book stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Search books
// @route   GET /api/books/search
// @access  Public
exports.searchBooks = async (req, res) => {
  try {
    const { q, genre, available, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    let query = {
      $text: { $search: q }
    };

    if (genre) {
      query.genre = genre;
    }

    if (available === 'true') {
      query.availableCopies = { $gt: 0 };
      query.status = 'active';
    }

    const books = await Book.find(query)
      .limit(parseInt(limit))
      .populate('addedBy', 'name')
      .sort({ score: { $meta: 'textScore' } });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    console.error('Search books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 