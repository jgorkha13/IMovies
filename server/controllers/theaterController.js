const Theater = require('../models/Theater');

// @desc    Get all theaters
// @route   GET /api/theaters
// @access  Public
const getTheaters = async (req, res) => {
  try {
    const { city } = req.query;
    let query = {};
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    const theaters = await Theater.find(query).sort({ name: 1 });
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching theaters' });
  }
};

// @desc    Create new theater
// @route   POST /api/theaters
// @access  Private/Admin
const createTheater = async (req, res) => {
  try {
    const { name, city, location, screens } = req.body;
    const theater = new Theater({
      name,
      city: city || 'Metropolis',
      location,
      screens: screens || [{ name: 'Screen 1', totalSeats: 80 }],
    });
    const created = await theater.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to create theater' });
  }
};

module.exports = {
  getTheaters,
  createTheater,
};
