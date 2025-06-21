const express = require('express');
const connectDB = require('./config/db');
const applyMiddleware = require('./middlewares/globalMiddleware');
const routes = require('./routes'); // <- Chỉ cần import một file
require('dotenv').config();

const app = express();

// Middleware
applyMiddleware(app);

// Sử dụng tất cả các route
app.use('/api', routes);

// Khởi động server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
