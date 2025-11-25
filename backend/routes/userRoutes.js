const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');

// register
router.post('/register', registerUser);
router.post('/login', loginUser)

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;