const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// create new order
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // get real product data from DB
    const orderItemsWithRealData = await Promise.all(
      orderItems.map(async (item) => {
        // search by id
        const product = await Product.findById(item.product);

        if (!product) {
          res.status(404);
          throw new Error(`Product not found with id: ${item.product}`);
        }
        return {
          qty: item.qty,
          product: item.product,
          name: product.name,
          image: product.image, 
          price: product.price,
        };
      })
    );
    // calculate prices
    const itemsPrice = orderItemsWithRealData.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
    // shipping price fixed
    const shippingPrice = 20000; 
    // total price
    const totalPrice = itemsPrice + shippingPrice;

    const order = new Order({
      orderItems: orderItemsWithRealData,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});


module.exports = {
    addOrderItems,
};