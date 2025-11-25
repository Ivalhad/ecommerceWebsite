const express = require('express');
const router = express.Router();
const {
  registerUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// register
router.post('/register', registerUser);

module.exports = router;