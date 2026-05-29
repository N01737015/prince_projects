const express = require('express');
const router = express.Router();

const { getCategories, createCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.get('/', getCategories);
router.post('/', protect, authorize('ADMIN'), createCategory);

module.exports = router;
