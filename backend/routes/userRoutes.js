const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  logoutUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// register and login
router.post('/', registerUser);
router.post('/login', authUser);

// get, update, delete profile
router.post('/logout', protect, logoutUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserAccount);

module.exports = router;