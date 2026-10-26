const express = require('express');
const router = express.Router();
const { getTheaters, createTheater } = require('../controllers/theaterController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTheaters)
  .post(protect, admin, createTheater);

module.exports = router;
