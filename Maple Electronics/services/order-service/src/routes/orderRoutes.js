const express = require('express');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/admin/all', protect, authorize('ADMIN'), getAllOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, authorize('ADMIN', 'VENDOR'), updateOrderStatus);

module.exports = router;
