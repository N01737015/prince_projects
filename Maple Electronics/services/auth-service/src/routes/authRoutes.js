const express = require('express');
const router = express.Router();

const {
  login,
  getMe,
  getVendors,
  approveVendor
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/vendors', protect, authorize('ADMIN'), getVendors);
router.patch('/vendors/:id/approve', protect, authorize('ADMIN'), approveVendor);

module.exports = router;