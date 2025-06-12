const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { getCurrentUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

// GET /api/auth/me
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
