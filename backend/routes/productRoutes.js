const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts) // public
  .post(protect, admin, createProduct); // admin only

router.route('/:id')
  .get(getProductById) // public
  .put(protect, admin, updateProduct) // admin only
  .delete(protect, admin, deleteProduct); // admin only

module.exports = router;