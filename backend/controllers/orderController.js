const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// create new order (user)
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // validate data from DB
    const orderItemsWithRealData = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product);

        if (!product) {
          res.status(404);
          throw new Error(`Product not found with id: ${item.product}`);
        }

        if (product.countInStock < item.qty) {
           res.status(400);
           throw new Error(`Stok tidak cukup untuk produk: ${product.name}. Sisa: ${product.countInStock}`);
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

    const itemsPrice = orderItemsWithRealData.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
    const shippingPrice = 20000; 
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

    // update stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      product.countInStock = product.countInStock - item.qty;
      await product.save();
    }

    // generate wa link
    const adminPhoneNumber = '6287874261026'; 

    let message = `Halo Admin Simply Shop! 👋\n`;
    message += `Saya ingin konfirmasi pesanan baru.\n\n`;
    message += `🆔 *ID Order:* ${createdOrder._id}\n`;
    message += `👤 *Nama:* ${req.user.name}\n`; 
    message += `📦 *Detail Pesanan:*\n`;

    createdOrder.orderItems.forEach(item => {
      message += `- ${item.name} (${item.qty}x) : Rp ${item.price.toLocaleString('id-ID')}\n`;
    });

    message += `\n🚚 *Ongkir:* Rp ${shippingPrice.toLocaleString('id-ID')}`;
    message += `\n💰 *TOTAL BAYAR:* Rp ${totalPrice.toLocaleString('id-ID')}\n\n`;
    message += `📍 *Alamat Kirim:*\n`;
    message += `${createdOrder.shippingAddress.address}, ${createdOrder.shippingAddress.city}, ${createdOrder.shippingAddress.postalCode}\n`;
    
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${adminPhoneNumber}?text=${encodedMessage}`;

    res.status(201).json({
      order: createdOrder,
      whatsAppUrl: waUrl 
    });
  }
});

// get detail order by id (admin and user)
const getOrderById = asyncHandler(async(req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if(order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }

});

// update status to paid (admin)
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'Paid';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// update status to delivered (admin)
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'Shipped';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// get history oder (user)
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// get all order user (admin)
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

//get order status
const getOrderSummary = asyncHandler(async (req, res) => {
  // total order
  const ordersCount = await Order.countDocuments();
  const usersCount = await User.countDocuments();
  const productsCount = await Product.countDocuments();

  // total paid
  const totalSalesData = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  const totalSales = totalSalesData.length === 0 ? 0 : totalSalesData[0].total;

  // grafis
  const dailyOrders = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        orders: { $sum: 1 },
        sales: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } }, //sort by day
  ]);

  res.json({
    usersCount,
    productsCount,
    ordersCount,
    totalSales,
    dailyOrders,
  });
});

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    getOrderSummary
};