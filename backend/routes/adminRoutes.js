const express = require('express');
const router = express.Router();
const { authAdmin, getAdminProfile, updateAdminProfile, logoutAdmin } = require('../controllers/adminController');
const { protect, admin } = require ('../middleware/authMiddleware')

//route admin login
router.post('/login', authAdmin);

//route admin profile
router.route('/profile')
    .get(protect, admin, getAdminProfile)
    .put(protect, admin, updateAdminProfile);

//route admin logout
router.post('/logout', logoutAdmin);

module.exports = router;