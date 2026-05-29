const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Auth service is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vendors', require('./routes/vendorRoutes'));

app.use((err, req, res, next) => {
  console.error('Auth service error:', err.message);
  res.status(500).json({
    message: 'Something went wrong in auth service',
    error: err.message
  });
});

module.exports = app;
