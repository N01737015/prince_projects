const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    name: {
      type: String,
      required: true
    },
    brand: {
      type: String
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
