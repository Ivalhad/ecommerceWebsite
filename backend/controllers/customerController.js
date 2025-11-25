const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const Blacklist = require('./../models/tokenBlacklist')

// user register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  // validate user
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // create user role
  const user = await User.create({
    name,
    email,
    password,
    phoneNumber,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

//login 
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
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

//get user profile
const getUserProfile = asyncHandler(async (req, res) => {
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
    throw new Error('user not found');
  }
});

//update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
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
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//logotu user
const logoutUser = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    res.status(400);
    throw new Error('Token not found');
  }

  const blacklistedToken = new Blacklist({
    token: token,
  });

  await blacklistedToken.save();

  res.status(200).json({ message: 'User logged out successfully' });
});

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    logoutUser,
}