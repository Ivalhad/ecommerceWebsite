const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// create new product
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, brand, category, countInStock } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload an image');
  }

  // get path image
  const imagePath = `/${req.file.path.replace(/\\/g, '/')}`;

  const product = new Product({
    user: req.user._id, 
    name,
    price,
    image: imagePath,
    brand,
    category,
    countInStock,
    description,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// get all products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// get product by id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// update procuct
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, brand, category, countInStock } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;
    
    if (req.file) {
      product.image = `/${req.file.path.replace(/\\/g, '/')}`;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};