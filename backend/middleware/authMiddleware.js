const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Blacklist = require('../models/tokenBlacklist')

// cek user login
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // token blacklist check
      const isBlacklisted = await Blacklist.findOne({ token: token });
      
      if (isBlacklisted) {
        return res.status(401).json({ message: 'Not authorized, token has been logged out' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// cek apakah  admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { 
  protect, 
  admin 
};