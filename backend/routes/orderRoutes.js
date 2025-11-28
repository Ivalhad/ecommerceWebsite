const express = require('express');
const router = express.Router();
const { 
  addOrderItems, 
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getOrderSummary
} = require ('../controllers/orderController');
const { protect, admin } = require ('../middleware/authMiddleware');

router.route('/')
  .post(protect, addOrderItems) // user create order
  .get(protect, admin, getOrders); // admin get all order user

router.route('/summary').get(protect, admin, getOrderSummary); // get summary order

router.route('/myorders').get(protect, getMyOrders); // get history order (user)

router.route('/:id').get(protect, getOrderById); // get order by id

// router update status
router.route('/:id/pay').put(protect, admin, updateOrderToPaid); // update status to paid
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered); // update status to deliveres

module.exports = router;