const express = require('express');
const router = express.Router();
const { createBooking, getBookingsByUser } = require('../controllers/bookingController');

// POST /api/bookings
router.post('/', createBooking); 

// GET /api/bookings
router.get('/user/:userId', getBookingsByUser);

module.exports = router;
