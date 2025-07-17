const express = require('express');
const router = express.Router();

// Import Borrow model (assume it exists)
const Borrow = require('../models/Borrow');

// GET /api/borrow/count - return total number of borrows
router.get('/count', async (req, res) => {
  try {
    const count = await Borrow.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get borrow count' });
  }
});

module.exports = router; 