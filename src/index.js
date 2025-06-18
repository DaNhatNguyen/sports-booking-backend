const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const courtRoutes = require('./routes/courtRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Sử dụng router
app.use('/api/auth', authRoutes);
app.use('/api/courts', courtRoutes);

// Connect DB & start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.error(err));
