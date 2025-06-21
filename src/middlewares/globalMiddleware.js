const express = require('express');
const cors = require('cors');

// Cấu hình middleware dùng chung
const applyMiddleware = (app) => {
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

  app.use(express.json());
};

module.exports = applyMiddleware;
