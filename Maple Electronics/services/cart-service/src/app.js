const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Cart service is running' });
});

app.use('/api/cart', require('./routes/cartRoutes'));

app.use((err, req, res, next) => {
  console.error('Cart service error:', err.message);
  res.status(500).json({
    message: 'Something went wrong in cart service',
    error: err.message
  });
});

module.exports = app;
