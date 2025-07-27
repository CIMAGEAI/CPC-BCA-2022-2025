const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  slug: {
    type: String,
    required: [true, 'Category slug is required'],
    unique: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  ancestors: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    name: String,
    slug: String
  }],
  level: {
    type: Number,
    default: 0
  },
  image: {
    public_id: String,
    url: String,
    alt: String
  },
  icon: {
    type: String,
    default: '🍽️'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  metadata: {
    productCount: {
      type: Number,
      default: 0
    },
    totalSales: {
      type: Number,
      default: 0
    }
  },
  attributes: [{
    name: String,
    type: {
      type: String,
      enum: ['text', 'number', 'boolean', 'select', 'multiselect'],
      default: 'text'
    },
    options: [String],
    required: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    }
  }],
  filters: [{
    name: String,
    type: {
      type: String,
      enum: ['price', 'rating', 'brand', 'origin', 'dietary', 'allergen'],
      default: 'price'
    },
    options: [String],
    min: Number,
    max: Number
  }],
  regionalInfo: {
    popularIn: [String], // States/regions where this category is popular
    seasonal: {
      isSeasonal: {
        type: Boolean,
        default: false
      },
      seasons: [{
        type: String,
        enum: ['spring', 'summer', 'autumn', 'winter', 'monsoon']
      }],
      months: [Number] // 1-12 for months
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
categorySchema.index({ parent: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ isActive: 1, sortOrder: 1 });

// Virtual for children categories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for full path
categorySchema.virtual('fullPath').get(function() {
  if (this.ancestors && this.ancestors.length > 0) {
    return this.ancestors.map(ancestor => ancestor.name).concat(this.name).join(' > ');
  }
  return this.name;
});

// Ensure virtuals are included when converting to JSON
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

// Pre-save middleware to update ancestors and level
categorySchema.pre('save', async function(next) {
  if (this.isModified('parent')) {
    if (this.parent) {
      const parent = await this.constructor.findById(this.parent);
      if (parent) {
        this.level = parent.level + 1;
        this.ancestors = [...parent.ancestors, {
          _id: parent._id,
          name: parent.name,
          slug: parent.slug
        }];
      }
    } else {
      this.level = 0;
      this.ancestors = [];
    }
  }
  next();
});

// Static method to get category tree
categorySchema.statics.getCategoryTree = async function() {
  const categories = await this.find({ isActive: true })
    .populate('children')
    .sort({ sortOrder: 1, name: 1 });
  
  return this.buildTree(categories);
};

// Static method to build tree structure
categorySchema.statics.buildTree = function(categories, parentId = null) {
  return categories
    .filter(category => 
      parentId === null ? !category.parent : category.parent.toString() === parentId.toString()
    )
    .map(category => ({
      ...category.toObject(),
      children: this.buildTree(categories, category._id)
    }));
};

module.exports = mongoose.model('Category', categorySchema); 