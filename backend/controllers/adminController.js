// File: backend/controllers/adminController.js
const asyncHandler = require('express-async-handler'); // Import library tadi
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const Blacklist = require('../models/tokenBlacklist');

// admin auth
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password)) && user.role === 'admin') {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// get admin profile
const getAdminProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
    });
  } else {
    res.status(404);
    throw new Error('Admin not found');
  }
});

// update admin profile
const updateAdminProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phoneNumber: updatedUser.phoneNumber,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('Admin not found');
  }
});

// admin logout
const logoutAdmin = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    res.status(400);
    throw new Error('Token not found');
  }

  const blacklistedToken = new Blacklist({
    token: token,
  });

  await blacklistedToken.save();

  res.status(200).json({ message: 'Admin logged out successfully' });
});

module.exports = { 
  authAdmin, 
  getAdminProfile, 
  updateAdminProfile, 
  logoutAdmin,
};