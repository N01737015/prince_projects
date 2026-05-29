const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'maple-electronics-backend' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vendors', require('./routes/vendorRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: 'Something went wrong' });
});

module.exports = app;
