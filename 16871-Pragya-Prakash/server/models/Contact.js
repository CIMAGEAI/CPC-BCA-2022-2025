const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters long'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters long'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^(\+91[\-\s]?)?[789]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: {
      values: ['general', 'order', 'product', 'feedback', 'partnership', 'complaint', 'other'],
      message: 'Please select a valid subject'
    }
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Admin notes cannot exceed 500 characters']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better query performance
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ subject: 1 });

// Virtual for full name
contactSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for subject display name
contactSchema.virtual('subjectDisplay').get(function() {
  const subjectMap = {
    general: 'General Inquiry',
    order: 'Order Support',
    product: 'Product Information',
    feedback: 'Feedback',
    partnership: 'Partnership',
    complaint: 'Complaint',
    other: 'Other'
  };
  return subjectMap[this.subject] || this.subject;
});

// Method to mark as resolved
contactSchema.methods.markAsResolved = function(adminId) {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  this.resolvedBy = adminId;
  return this.save();
};

// Method to update status
contactSchema.methods.updateStatus = function(status, adminId) {
  this.status = status;
  if (status === 'resolved') {
    this.resolvedAt = new Date();
    this.resolvedBy = adminId;
  }
  return this.save();
};

// Static method to get statistics
contactSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const total = await this.countDocuments();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = await this.countDocuments({ createdAt: { $gte: today } });
  
  return {
    total,
    today: todayCount,
    byStatus: stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {})
  };
};

module.exports = mongoose.model('Contact', contactSchema); 