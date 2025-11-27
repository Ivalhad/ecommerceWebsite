const express = require('express');
const router = express.Router();
const {
  addToCart,
  getMyCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addToCart) // add product to cart
  .get(protect, getMyCart ) // get product in cart

module.exports = router;