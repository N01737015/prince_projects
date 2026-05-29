const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort('name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const existing = await Category.findOne({ name: new RegExp('^' + name + '$', 'i') });
    if (existing) return res.status(400).json({ message: 'Category already exists' });
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
