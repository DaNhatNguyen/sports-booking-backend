const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courtController');
const { getCourtsByFilter, getNearbyCourts, searchCourts } = require('../controllers/courtController');

// GET /api/courts/nearby
router.get('/nearby', getNearbyCourts);

// GET /api/courts/search
router.get('/search', searchCourts);

// GET /api/courts/filter
router.get('/filter', getCourtsByFilter);

module.exports = router;
