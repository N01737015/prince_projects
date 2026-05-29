const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  priceAtAdd: { type: Number, required: true }
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [cartItemSchema],
  totalAmount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
