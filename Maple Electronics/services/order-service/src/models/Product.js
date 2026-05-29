const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
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
    images: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);