const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats
} = require('../controllers/user');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Admin/Librarian routes
router.get('/', authorize('admin', 'librarian'), getUsers);
router.get('/stats', authorize('admin', 'librarian'), getUserStats);
router.post('/', authorize('admin'), createUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
router.patch('/:id/toggle-status', authorize('admin', 'librarian'), toggleUserStatus);

module.exports = router; 