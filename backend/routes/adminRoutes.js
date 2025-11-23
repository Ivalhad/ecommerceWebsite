const express = require('express');
const router = express.Router();
const {authAdmin, getAdminProfile} = require('../controllers/adminController');
const { protect, admin } = require ('../middleware/authMiddleware')

//route admin login
router.post('/login', authAdmin);
//route admin profile
router.get('/profile', protect, admin, getAdminProfile)

module.exports = router;