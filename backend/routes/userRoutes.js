const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  deleteUserAccount
} = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

// register
router.post('/register', registerUser);
router.post('/login', loginUser)

// logout
router.post('/logout', protect, logoutUser);

// user profile
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserAccount);

module.exports = router;