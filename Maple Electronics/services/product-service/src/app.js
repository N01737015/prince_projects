const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Product service is running' });
});

app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

app.use((err, req, res, next) => {
  console.error('Product service error:', err.message);
  res.status(500).json({
    message: 'Something went wrong in product service',
    error: err.message
  });
});

module.exports = app;
