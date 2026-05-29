const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const vendors = await User.find({ role: 'VENDOR' }).select('-__v').sort('-createdAt');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/approve', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const { vendorStatus } = req.body;
    const vendor = await User.findByIdAndUpdate(
      req.params.id,
      { vendorStatus },
      { new: true }
    );
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor status updated', vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
