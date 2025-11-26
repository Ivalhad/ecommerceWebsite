const express = require('express');
const router = express.Router();
const { addOrderItems} = require ('../controllers/orderController');
const { protect, admin } = require ('../middleware/authMiddleware');

router.route('/')
  .post(protect, addOrderItems) // user create order

  module.exports = router;