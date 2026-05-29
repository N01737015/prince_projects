const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    keycloakId: {
      type: String,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['ADMIN', 'VENDOR', 'CUSTOMER'],
      required: true
    },
    vendorStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    },
    storeName: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);