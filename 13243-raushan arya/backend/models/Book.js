const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters']
  },
  isbn: {
    type: String,
    required: [true, 'Please provide an ISBN'],
    unique: true,
    trim: true,
    match: [/^(?:\d{10}|\d{13})$/, 'Please provide a valid 10 or 13 digit ISBN']
  },
  genre: {
    type: String,
    required: [true, 'Please provide a genre'],
    enum: [
      'Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Romance', 
      'Thriller', 'Horror', 'Fantasy', 'Biography', 'History', 'Science', 
      'Technology', 'Philosophy', 'Religion', 'Self-Help', 'Business', 
      'Economics', 'Politics', 'Education', 'Literature', 'Poetry', 
      'Drama', 'Comics', 'Children', 'Young Adult', 'Academic', 'Reference', 'Mythology'
    ]
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  publisher: {
    type: String,
    trim: true,
    maxlength: [100, 'Publisher name cannot be more than 100 characters']
  },
  publicationYear: {
    type: Number,
    min: [1000, 'Publication year must be after 1000'],
    max: [new Date().getFullYear(), 'Publication year cannot be in the future']
  },
  edition: {
    type: String,
    default: '1st Edition'
  },
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1']
  },
  language: {
    type: String,
    default: 'English',
    enum: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Other']
  },
  coverImage: {
    type: String,
    default: 'default-cover.jpg'
  },
  totalCopies: {
    type: Number,
    required: [true, 'Please provide the total number of copies'],
    min: [1, 'Total copies must be at least 1']
  },
  availableCopies: {
    type: Number,
    required: [true, 'Please provide the number of available copies'],
    min: [0, 'Available copies cannot be negative']
  },
  location: {
    shelf: {
      type: String,
      required: [true, 'Please provide shelf location']
    },
    row: {
      type: String,
      required: [true, 'Please provide row location']
    },
    section: {
      type: String,
      required: [true, 'Please provide section location']
    }
  },
  qrCode: {
    type: String,
    unique: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'lost'],
    default: 'active'
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for availability status
bookSchema.virtual('isAvailable').get(function() {
  return this.availableCopies > 0 && this.status === 'active';
});

// Virtual for availability percentage
bookSchema.virtual('availabilityPercentage').get(function() {
  if (this.totalCopies === 0) return 0;
  return Math.round((this.availableCopies / this.totalCopies) * 100);
});

// Index for search functionality
bookSchema.index({ title: 'text', author: 'text', description: 'text', tags: 'text' });

// Ensure available copies don't exceed total copies
bookSchema.pre('save', function(next) {
  if (this.availableCopies > this.totalCopies) {
    this.availableCopies = this.totalCopies;
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema); 