const express = require('express');
const router = express.Router();
const {
  addToCart,
  getMyCart,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addToCart) // add product to cart
  .get(protect, getMyCart ) // get product in cart
  .delete(protect, clearCart ) // delete all product in cart

module.exports = router;