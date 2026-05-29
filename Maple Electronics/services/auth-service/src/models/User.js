const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    keycloakId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      trim: true,
      default: ''
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
      trim: true,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);