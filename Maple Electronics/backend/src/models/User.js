const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  keycloakId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  role: { type: String, enum: ['ADMIN', 'VENDOR', 'CUSTOMER'], required: true },
  vendorStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
    default: 'PENDING'
  },
  storeName: { type: String, default: '' },
  storeDescription: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
