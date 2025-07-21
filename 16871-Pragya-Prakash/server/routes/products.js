const express = require('express');
const Product = require('../models/Product');
const parser = require('../config/cloudinaryConfig');

const Category = require('../models/Category');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();

    // Build query
    let query = Product.find({ isActive: true })
      .populate('category', 'name slug')
      .populate('vendor', 'name');

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = query.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { shortDescription: searchRegex },
          { tags: searchRegex },
          { 'origin.region': searchRegex },
          { 'origin.state': searchRegex },
          { ingredients: searchRegex }
        ]
      });
    }

    // Category filter
    if (req.query.category) {
      query = query.find({ category: req.query.category });
    }

    // Price filter
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};
      if (req.query.minPrice) priceFilter.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.$lte = parseFloat(req.query.maxPrice);
      query = query.find({ price: priceFilter });
    }

    // Rating filter
    if (req.query.minRating) {
      query = query.find({ 'ratings.average': { $gte: parseFloat(req.query.minRating) } });
    }

    // Dietary filters
    if (req.query.dietary) {
      const dietaryFilters = req.query.dietary.split(',');
      query = query.find({ dietaryInfo: { $in: dietaryFilters } });
    }

    // Origin filter
    if (req.query.origin) {
      query = query.find({ 'origin.state': req.query.origin });
    }

    // Featured products
    if (req.query.featured === 'true') {
      query = query.find({ isFeatured: true });
    }

    // New arrivals
    if (req.query.newArrivals === 'true') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query = query.find({ 
        isNewArrival: true,
        createdAt: { $gte: thirtyDaysAgo }
      });
    }

    // Best sellers
    if (req.query.bestSellers === 'true') {
      query = query.find({ isBestSeller: true });
    }

    // On sale
    if (req.query.onSale === 'true') {
      query = query.find({ isOnSale: true });
    }

    // Sort
    let sort = {};
    if (req.query.sort) {
      const sortFields = req.query.sort.split(',');
      sortFields.forEach(field => {
        const order = field.startsWith('-') ? -1 : 1;
        const fieldName = field.startsWith('-') ? field.slice(1) : field;
        sort[fieldName] = order;
      });
    } else {
      sort = { createdAt: -1 };
    }

    query = query.sort(sort);

    // Pagination
    query = query.skip(startIndex).limit(limit);

    const products = await query.exec();

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

    // Update view count for authenticated users
    if (req.user) {
      products.forEach(product => {
        Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } }).exec();
      });
    }

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate('vendor', 'name')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      })
      .populate('relatedProducts', 'name price images ratings');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not available'
      });
    }

    // Update view count
    if (req.user) {
      await Product.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product'
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Vendor/Admin)
router.post('/upload', protect, authorize('admin', 'vendor'), parser.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const newProduct = new Product({
      name,
      price,
      description,
      mainImage: req.file.path, // Assuming your model uses 'mainImage'
      vendor: req.user.id
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    console.error('Product upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading product'
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Vendor/Admin)
router.put('/:id', protect, authorize('admin', 'vendor'), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Make sure user is product owner or admin
    if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product'
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Vendor/Admin)
router.delete('/:id', protect, authorize('admin', 'vendor'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Make sure user is product owner or admin
    if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product'
    });
  }
});

// @desc    Get products by category
// @route   GET /api/products/category/:slug
// @access  Public
router.get('/category/:slug', optionalAuth, async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const products = await Product.find({ 
      category: category._id,
      isActive: true 
    })
    .populate('category', 'name slug')
    .populate('vendor', 'name')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      category: {
        name: category.name,
        description: category.description,
        image: category.image
      },
      data: products
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category'
    });
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', optionalAuth, async (req, res) => {
  try {
    const products = await Product.find({ 
      isFeatured: true,
      isActive: true 
    })
    .populate('category', 'name slug')
    .populate('vendor', 'name')
    .limit(8)
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products'
    });
  }
});

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
router.get('/new-arrivals', optionalAuth, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const products = await Product.find({ 
      isNewArrival: true,
      isActive: true,
      createdAt: { $gte: thirtyDaysAgo }
    })
    .populate('category', 'name slug')
    .populate('vendor', 'name')
    .limit(8)
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get new arrivals error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching new arrivals'
    });
  }
});

// @desc    Get best sellers
// @route   GET /api/products/best-sellers
// @access  Public
router.get('/best-sellers', optionalAuth, async (req, res) => {
  try {
    const products = await Product.find({ 
      isBestSeller: true,
      isActive: true 
    })
    .populate('category', 'name slug')
    .populate('vendor', 'name')
    .limit(8)
    .sort({ purchaseCount: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get best sellers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching best sellers'
    });
  }
});

module.exports = router; 