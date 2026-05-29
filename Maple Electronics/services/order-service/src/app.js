const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Order service is running' });
});

app.use('/api/orders', require('./routes/orderRoutes'));

app.use((err, req, res, next) => {
  console.error('Order service error:', err.message);
  res.status(500).json({
    message: 'Something went wrong in order service',
    error: err.message
  });
});

module.exports = app;
