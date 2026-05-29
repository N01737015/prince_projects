require('dotenv').config();

const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5003;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log('Cart service running on port ' + PORT);
  });
};

startServer();
