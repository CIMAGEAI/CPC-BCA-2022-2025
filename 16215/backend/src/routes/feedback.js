const express = require('express');
const router = express.Router();

// Import Feedback model (assume it exists)
const Feedback = require('../models/Feedback');

// GET /api/feedback/count - return total number of feedback entries
router.get('/count', async (req, res) => {
  try {
    const count = await Feedback.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get feedback count' });
  }
});

module.exports = router; 