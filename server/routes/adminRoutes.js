const express = require('express');
const router = express.Router();
const { getAdminStats, getAllBookings } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getAdminStats);
router.get('/bookings', protect, admin, getAllBookings);

module.exports = router;
