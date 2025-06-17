const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courtController');
const { getNearbyCourts, searchCourts } = require('../controllers/courtController');

// GET /api/courts/nearby
router.get('/nearby', getNearbyCourts);

// GET /api/courts/search
router.get('/search', searchCourts);

module.exports = router;
