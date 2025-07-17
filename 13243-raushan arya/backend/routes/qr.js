const express = require('express');
const QRCode = require('qrcode');
const Book = require('../models/Book');
const crypto = require('crypto');

const router = express.Router();

// @desc    Generate QR code for a book
// @route   GET /api/qr/generate/:bookId
// @access  Private
router.get('/generate/:bookId', async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const qrData = {
      bookId: book.qrCode,
      isbn: book.isbn,
      title: book.title
    };

    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

    res.status(200).json({
      success: true,
      data: {
        qrCode,
        bookInfo: {
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          qrCode: book.qrCode
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating QR code'
    });
  }
});

// @desc    Scan QR code and get book info
// @route   POST /api/qr/scan
// @access  Public
router.post('/scan', async (req, res) => {
  try {
    const { qrData } = req.body;
    
    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: 'QR data is required'
      });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR code data'
      });
    }

    const book = await Book.findOne({ qrCode: parsedData.bookId });

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
    res.status(500).json({
      success: false,
      message: 'Error scanning QR code'
    });
  }
});

// @desc    Generate QR code for bulk books
// @route   POST /api/qr/bulk-generate
// @access  Private
router.post('/bulk-generate', async (req, res) => {
  try {
    const { bookIds } = req.body;
    
    if (!bookIds || !Array.isArray(bookIds)) {
      return res.status(400).json({
        success: false,
        message: 'Book IDs array is required'
      });
    }

    const books = await Book.find({ _id: { $in: bookIds } });
    const qrCodes = [];

    for (const book of books) {
      const qrData = {
        bookId: book.qrCode,
        isbn: book.isbn,
        title: book.title
      };

      const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
      
      qrCodes.push({
        bookId: book._id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        qrCode: qrCode,
        qrData: book.qrCode
      });
    }

    res.status(200).json({
      success: true,
      count: qrCodes.length,
      data: qrCodes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating bulk QR codes'
    });
  }
});

module.exports = router; 