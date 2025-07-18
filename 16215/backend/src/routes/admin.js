const express = require('express');
const router = express.Router();

// Import User model (assume it exists)
const User = require('../models/User');

// GET /api/admin/count - return total number of users
router.get('/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user count' });
  }
});

module.exports = router; 