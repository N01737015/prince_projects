const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendorId: { type: String, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  price: {
    type: Number,
    required: true,
    min: [0.01, 'Price must be greater than 0']
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  description: { type: String, default: '' },
  specs: { type: mongoose.Schema.Types.Mixed, default: {} },
  images: [{ type: String }],
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'INACTIVE'],
    default: 'PENDING'
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
