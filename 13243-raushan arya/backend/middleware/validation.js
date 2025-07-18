const { body, param, query } = require('express-validator');

// User validation
exports.validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .isIn(['admin', 'librarian', 'student', 'faculty', 'staff'])
    .withMessage('Invalid role'),
  body('studentId')
    .optional()
    .isString()
    .withMessage('Student ID must be a string'),
  body('department')
    .optional()
    .isString()
    .withMessage('Department must be a string'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('address')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Address cannot be more than 200 characters')
];

exports.validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

exports.validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('address')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Address cannot be more than 200 characters')
];

// Book validation
exports.validateBookCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('author')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author must be between 1 and 100 characters'),
  body('isbn')
    .matches(/^(?:\d{10}|\d{13})$/)
    .withMessage('Please provide a valid 10 or 13 digit ISBN'),
  body('genre')
    .isIn([
      'Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Romance', 
      'Thriller', 'Horror', 'Fantasy', 'Biography', 'History', 'Science', 
      'Technology', 'Philosophy', 'Religion', 'Self-Help', 'Business', 
      'Economics', 'Politics', 'Education', 'Literature', 'Poetry', 
      'Drama', 'Comics', 'Children', 'Young Adult', 'Academic', 'Reference'
    ])
    .withMessage('Invalid genre'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot be more than 1000 characters'),
  body('publisher')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Publisher name cannot be more than 100 characters'),
  body('publicationYear')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Publication year must be between 1000 and current year'),
  body('pages')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Pages must be at least 1'),
  body('totalCopies')
    .isInt({ min: 1 })
    .withMessage('Total copies must be at least 1'),
  body('availableCopies')
    .isInt({ min: 0 })
    .withMessage('Available copies cannot be negative'),
  body('location.shelf')
    .notEmpty()
    .withMessage('Shelf location is required'),
  body('location.row')
    .notEmpty()
    .withMessage('Row location is required'),
  body('location.section')
    .notEmpty()
    .withMessage('Section location is required')
];

exports.validateBookUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('author')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author must be between 1 and 100 characters'),
  body('isbn')
    .optional()
    .matches(/^(?:\d{10}|\d{13})$/)
    .withMessage('Please provide a valid 10 or 13 digit ISBN'),
  body('genre')
    .optional()
    .isIn([
      'Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Romance', 
      'Thriller', 'Horror', 'Fantasy', 'Biography', 'History', 'Science', 
      'Technology', 'Philosophy', 'Religion', 'Self-Help', 'Business', 
      'Economics', 'Politics', 'Education', 'Literature', 'Poetry', 
      'Drama', 'Comics', 'Children', 'Young Adult', 'Academic', 'Reference'
    ])
    .withMessage('Invalid genre'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot be more than 1000 characters'),
  body('publisher')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Publisher name cannot be more than 100 characters'),
  body('publicationYear')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Publication year must be between 1000 and current year'),
  body('pages')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Pages must be at least 1'),
  body('totalCopies')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Total copies must be at least 1'),
  body('availableCopies')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Available copies cannot be negative')
];

// Transaction validation
exports.validateBorrowBook = [
  body('bookId')
    .isMongoId()
    .withMessage('Invalid book ID'),
  body('borrowDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid borrow date'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid due date')
];

// Query validation
exports.validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isString()
    .withMessage('Sort must be a string'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be either asc or desc')
];

// Parameter validation
exports.validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format')
];

exports.validateBookId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid book ID format')
];

exports.validateUserId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID format')
];

exports.validateTransactionId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid transaction ID format')
]; 