const Theater = require('../models/Theater');
const { getIsConnected } = require('../config/db');
const mockStore = require('../config/mockStore');

// @desc    Get all theaters
// @route   GET /api/theaters
const getTheaters = async (req, res) => {
  try {
    const { city } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (city) query.city = { $regex: city, $options: 'i' };
      const theaters = await Theater.find(query).sort({ name: 1 });
      return res.json(theaters);
    }

    let filtered = mockStore.theaters;
    if (city) {
      filtered = filtered.filter((t) => t.city.toLowerCase().includes(city.toLowerCase()));
    }
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching theaters' });
  }
};

// @desc    Create new theater
// @route   POST /api/theaters
const createTheater = async (req, res) => {
  try {
    const { name, city, location, screens } = req.body;
    const theaterData = {
      name,
      city: city || 'Metropolis',
      location,
      screens: screens || [{ name: 'Screen 1', totalSeats: 80 }],
    };

    if (getIsConnected()) {
      const theater = new Theater(theaterData);
      const created = await theater.save();
      return res.status(201).json(created);
    }

    const created = { _id: `theater_${Date.now()}`, ...theaterData };
    mockStore.theaters.push(created);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to create theater' });
  }
};

module.exports = {
  getTheaters,
  createTheater,
};
