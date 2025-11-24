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
const upload = require('../middleware/uploadMiddleware'); 

router.route('/')
  .get(getProducts) // public
  .post(protect, admin, upload.single('image'), createProduct); // admin

router.route('/:id')
  .get(getProductById) // public 
  .delete(protect, admin, deleteProduct) // admin
  .put(protect, admin, upload.single('image'), updateProduct); // admin

module.exports = router;