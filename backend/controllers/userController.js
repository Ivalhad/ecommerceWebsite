const asyncHandler = require('express-async-handler');
const User = require('./../models/userModel');
const generateToken = require('./../utils/generateToken');

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
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});


module.exports = {
    registerUser,
}