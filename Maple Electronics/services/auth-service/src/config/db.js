const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Auth service connected to MongoDB');
  } catch (error) {
    console.error('Auth service MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
