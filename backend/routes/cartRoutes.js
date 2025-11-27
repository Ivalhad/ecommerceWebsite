const express = require('express');
const router = express.Router();
const {
  addToCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addToCart)   // add product to cart 

module.exports = router;