const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          min: 1,
          required: true
        },
        priceAtAdd: {
          type: Number,
          required: true
        }
      }
    ],
    totalAmount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', CartSchema);