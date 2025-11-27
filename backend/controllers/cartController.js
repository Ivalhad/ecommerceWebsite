const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// add items to cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;

  // validate product
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // find user cart
  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    // check product in cart
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      
      cart.cartItems[itemIndex].qty = qty;
    } else {
      
      cart.cartItems.push({
        product: productId,
        name: product.name,
        qty: qty,
        image: product.image,
        price: product.price,
      });
    }
    
    const updatedCart = await cart.save();
    res.json(updatedCart);

  } else {
    // make new cart user
    const newCart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          name: product.name,
          qty: qty,
          image: product.image,
          price: product.price,
        },
      ],
    });
    res.status(201).json(newCart);
  }
});

// get product in cart
const getMyCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.json({ cartItems: [] });
  }
  res.json(cart);
})

// delete product in cart
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.cartItems = [];
    await cart.save();
    res.json({ message: 'Cart cleared' });
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

module.exports= { addToCart, getMyCart, clearCart };