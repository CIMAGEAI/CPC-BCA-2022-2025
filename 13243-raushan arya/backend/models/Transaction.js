const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  type: {
    type: String,
    enum: ['issue', 'return', 'renew'],
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: function() { return this.type === 'issue'; }
  },
  returnDate: {
    type: Date,
    required: function() { return this.type === 'return'; }
  },
  fine: {
    amount: {
      type: Number,
      default: 0,
      min: 0
    },
    reason: {
      type: String,
      enum: ['late_return', 'damage', 'lost', 'none'],
      default: 'none'
    },
    paid: {
      type: Boolean,
      default: false
    },
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['active', 'returned', 'overdue', 'cancelled'],
    default: 'active'
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  returnedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
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
transactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate fine amount
transactionSchema.methods.calculateFine = function() {
  if (this.type !== 'return' || !this.returnDate || !this.dueDate) {
    return 0;
  }

  const returnDate = new Date(this.returnDate);
  const dueDate = new Date(this.dueDate);
  
  if (returnDate <= dueDate) {
    return 0;
  }

  // Calculate days overdue
  const timeDiff = returnDate.getTime() - dueDate.getTime();
  const daysOverdue = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  // Fine rate: $1 per day (can be configured)
  const fineRate = 1;
  return daysOverdue * fineRate;
};

// Check if transaction is overdue
transactionSchema.methods.isOverdue = function() {
  if (this.type !== 'issue' || this.status === 'returned') {
    return false;
  }
  
  const now = new Date();
  const dueDate = new Date(this.dueDate);
  
  return now > dueDate;
};

// Get days overdue
transactionSchema.methods.getDaysOverdue = function() {
  if (!this.isOverdue()) {
    return 0;
  }
  
  const now = new Date();
  const dueDate = new Date(this.dueDate);
  const timeDiff = now.getTime() - dueDate.getTime();
  
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// Virtual for transaction duration
transactionSchema.virtual('duration').get(function() {
  if (this.type === 'issue' && this.status === 'active') {
    const now = new Date();
    const issueDate = new Date(this.issueDate);
    const timeDiff = now.getTime() - issueDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  
  if (this.type === 'return' && this.returnDate) {
    const returnDate = new Date(this.returnDate);
    const issueDate = new Date(this.issueDate);
    const timeDiff = returnDate.getTime() - issueDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  
  return 0;
});

// Index for efficient queries
transactionSchema.index({ user: 1, status: 1 });
transactionSchema.index({ book: 1, status: 1 });
transactionSchema.index({ dueDate: 1, status: 1 });
transactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema); 