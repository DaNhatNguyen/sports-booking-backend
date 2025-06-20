const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');

router.post('/', createBooking); // POST /api/bookings

module.exports = router;
