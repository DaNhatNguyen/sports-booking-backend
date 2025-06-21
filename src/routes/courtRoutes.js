const express = require('express');
const router = express.Router();
const { getCourtsByGroupId, getAvailableTimeSlots, getCourtGroupsByFilter,
    getNearbyCourtGroups, searchCourtGroups, getCourtGroupById } = require('../controllers/courtController');

// GET /api/courts/nearby
router.get('/nearby', getNearbyCourtGroups);

// GET /api/courts/search
router.get('/search', searchCourtGroups);

// GET /api/courts/filter
router.get('/filter', getCourtGroupsByFilter);

// GET /api/courts/:groupId
router.get('/:groupId', getCourtGroupById);

// Lấy ra giờ trống của sân nhỏ
router.get('/:courtId/available-time-slots', getAvailableTimeSlots);

// Lấy ra sân nhỏ theo id sân lớn
router.get('/', getCourtsByGroupId);

module.exports = router;
