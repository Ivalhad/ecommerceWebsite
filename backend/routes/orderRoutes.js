const express = require('express');
const router = express.Router();
const { 
  addOrderItems, 
  getOrderById
} = require ('../controllers/orderController');
const { protect, admin } = require ('../middleware/authMiddleware');

router.route('/')
  .post(protect, addOrderItems) // user create order


router.route('/:id').get(protect, getOrderById); // get order by id

  module.exports = router;