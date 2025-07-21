const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');
const parser = require('../config/cloudinaryConfig');

const router = express.Router();

// All routes require admin role
router.use(protect, authorize('admin'));

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Current period stats
    const currentStats = await Promise.all([
      User.countDocuments({ createdAt: { $gte: startDate } }),
      Product.countDocuments({ createdAt: { $gte: startDate } }),
      Order.countDocuments({ createdAt: { $gte: startDate } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    // Previous period stats for comparison
    const previousStartDate = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const previousStats = await Promise.all([
      User.countDocuments({ createdAt: { $gte: previousStartDate, $lt: startDate } }),
      Product.countDocuments({ createdAt: { $gte: previousStartDate, $lt: startDate } }),
      Order.countDocuments({ createdAt: { $gte: previousStartDate, $lt: startDate } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: previousStartDate, $lt: startDate } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    // Calculate percentage changes
    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const revenue = currentStats[3][0]?.total || 0;
    const previousRevenue = previousStats[3][0]?.total || 0;

    res.status(200).json({
      success: true,
      data: {
        revenue,
        revenueChange: calculateChange(revenue, previousRevenue),
        orders: currentStats[2],
        ordersChange: calculateChange(currentStats[2], previousStats[2]),
        products: currentStats[1],
        productsChange: calculateChange(currentStats[1], previousStats[1]),
        customers: currentStats[0],
        customersChange: calculateChange(currentStats[0], previousStats[0])
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// @desc    Get all products (admin)
// @route   GET /api/admin/products
// @access  Private (Admin)
router.get('/products', async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    // Build query
    let query = Product.find()
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .populate('vendor', 'name');

    // Search
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query = query.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { sku: searchRegex }
        ]
      });
    }

    // Category filter
    if (category) {
      query = query.find({ category });
    }

    // Status filter
    if (status) {
      if (status === 'active') query = query.find({ isActive: true });
      else if (status === 'inactive') query = query.find({ isActive: false });
      else if (status === 'featured') query = query.find({ isFeatured: true });
      else if (status === 'onSale') query = query.find({ isOnSale: true });
    }

    // Low stock filter
    if (req.query.lowStock === 'true') {
      query = query.find({ stock: { $lte: 10 } });
    }

    // Sort
    const sortFields = sort.split(',').reduce((acc, field) => {
      const order = field.startsWith('-') ? -1 : 1;
      const fieldName = field.startsWith('-') ? field.slice(1) : field;
      acc[fieldName] = order;
      return acc;
    }, {});

    query = query.sort(sortFields);

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query = query.skip(skip).limit(parseInt(limit));

    const products = await query.exec();
    const total = await Product.countDocuments(query.getQuery());

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: products
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

// @desc    Create new product (admin)
// @route   POST /api/admin/products
// @access  Private (Admin)
router.post('/products', async (req, res) => {
  try {
    const productData = {
      ...req.body,
      vendor: req.user._id // Set current admin as vendor
    };

    const product = await Product.create(productData);
    
    await product.populate('category', 'name slug');
    await product.populate('vendor', 'name');

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Update product (admin)
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .populate('vendor', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Delete product (admin)
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

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

// @desc    Bulk update products (admin)
// @route   PUT /api/admin/products/bulk
// @access  Private (Admin)
router.put('/products/bulk', async (req, res) => {
  try {
    const { productIds, updates } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs are required'
      });
    }

    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      updates
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} products updated successfully`
    });
  } catch (error) {
    console.error('Bulk update products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating products'
    });
  }
});

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private (Admin)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private (Admin)
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

// @desc    Update order status (admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin)
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status'
    });
  }
});

// @desc    Get payment verification orders
// @route   GET /api/admin/payment-verification
// @access  Private/Admin
router.get('/payment-verification', authorize('admin'), async (req, res) => {
  try {
    const { status, paymentMethod, dateRange, search } = req.query;
    
    // Build query
    let query = {};
    
    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Payment method filter
    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }
    
    // Date range filter
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (dateRange) {
        case '1d':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }
      
      query.createdAt = { $gte: startDate };
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } },
        { 'payment.transactionNumber': { $regex: search, $options: 'i' } }
      ];
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment verification orders'
    });
  }
});

// Image upload endpoint
router.post('/products/upload', parser.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No image file provided' 
      });
    }

    // Upload to Cloudinary
    const cloudinary = require('../config/cloudinary');
    
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'parampara-foods/products',
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    // Delete the temporary file
    const fs = require('fs');
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Image upload error:', error);
    
    // Clean up temporary file if it exists
    if (req.file && req.file.path) {
      const fs = require('fs');
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting temporary file:', unlinkError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Image upload failed'
    });
  }
});

module.exports = router; 