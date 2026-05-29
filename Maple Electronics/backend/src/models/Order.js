const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  vendorId: { type: String },
  quantity: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['PLACED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'],
    default: 'PLACED'
  },
  trackingNumber: { type: String },
  shippingAddress: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
