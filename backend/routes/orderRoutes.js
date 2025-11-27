const express = require('express');
const router = express.Router();
const { 
  addOrderItems, 
  getOrderById,
  updateOrderToPaid
} = require ('../controllers/orderController');
const { protect, admin } = require ('../middleware/authMiddleware');

router.route('/')
  .post(protect, addOrderItems) // user create order


router.route('/:id').get(protect, getOrderById); // get order by id


// router update status
router.route('/:id/pay').put(protect, admin, updateOrderToPaid);

module.exports = router;