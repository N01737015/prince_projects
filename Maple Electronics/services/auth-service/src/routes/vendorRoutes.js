const express = require('express');
const router = express.Router();

const { getVendors, approveVendor } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', protect, authorize('ADMIN'), getVendors);
router.patch('/:id/approve', protect, authorize('ADMIN'), approveVendor);

module.exports = router;
