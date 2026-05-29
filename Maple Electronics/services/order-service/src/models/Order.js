const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    priceAtPurchase: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    items: {
      type: [OrderItemSchema],
      required: true
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['PLACED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PLACED'
    },
    shippingAddress: {
      type: String,
      required: true,
      trim: true
    },
    trackingNumber: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);