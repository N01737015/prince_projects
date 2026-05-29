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
const { protect, authorize } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/admin', protect, authorize('ADMIN'), getAdminProducts);
router.get('/vendor/myproducts', protect, authorize('VENDOR', 'ADMIN'), getMyProducts);
router.get('/:id/recommendations', getRecommendations);
router.get('/:id', getProductById);
router.post('/', protect, authorize('VENDOR', 'ADMIN'), createProduct);
router.put('/:id', protect, authorize('VENDOR', 'ADMIN'), updateProduct);
router.patch('/:id/status', protect, authorize('ADMIN'), updateProductStatus);
router.delete('/:id', protect, authorize('VENDOR', 'ADMIN'), deleteProduct);

module.exports = router;
