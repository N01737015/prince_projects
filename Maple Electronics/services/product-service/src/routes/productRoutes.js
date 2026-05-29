const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProducts,
  getAdminProducts,
  getProductById,
  getRecommendations,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  getMyProducts
} = require('../controllers/productController');

const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', getProducts);
router.get('/admin', protect, authorize('ADMIN'), getAdminProducts);
router.get('/vendor/myproducts', protect, authorize('VENDOR'), getMyProducts);
router.get('/:id/recommendations', getRecommendations);
router.get('/:id', getProductById);

router.post('/', protect, authorize('VENDOR', 'ADMIN'), createProduct);
router.put('/:id', protect, authorize('VENDOR', 'ADMIN'), updateProduct);
router.patch('/:id/status', protect, authorize('ADMIN'), updateProductStatus);
router.delete('/:id', protect, authorize('VENDOR', 'ADMIN'), deleteProduct);

module.exports = router;
