const Show = require('../models/Show');

// @desc    Get shows with filtering by movie and date
// @route   GET /api/shows
// @access  Public
const getShows = async (req, res) => {
  try {
    const { movie, date, theater } = req.query;
    let query = {};

    if (movie) query.movie = movie;
    if (date) query.date = date;
    if (theater) query.theater = theater;

    const shows = await Show.find(query)
      .populate('movie', 'title posterUrl duration certificate language')
      .populate('theater', 'name city location')
      .sort({ date: 1, time: 1 });

    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching shows' });
  }
};

// @desc    Get single show by ID
// @route   GET /api/shows/:id
// @access  Public
const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theater');

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching show' });
  }
};

// @desc    Create show
// @route   POST /api/shows
// @access  Private/Admin
const createShow = async (req, res) => {
  try {
    const { movie, theater, screenName, date, time, ticketPrice, vipPrice, totalSeats } = req.body;

    const show = new Show({
      movie,
      theater,
      screenName: screenName || 'Screen 1',
      date,
      time,
      ticketPrice: Number(ticketPrice) || 250,
      vipPrice: Number(vipPrice) || 450,
      totalSeats: Number(totalSeats) || 80,
      bookedSeats: [],
    });

    const created = await show.save();
    const populated = await Show.findById(created._id).populate('movie').populate('theater');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to create show' });
  }
};

// @desc    Delete show
// @route   DELETE /api/shows/:id
// @access  Private/Admin
const deleteShow = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }
    await Show.findByIdAndDelete(req.params.id);
    res.json({ message: 'Show deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete show' });
  }
};

module.exports = {
  getShows,
  getShowById,
  createShow,
  deleteShow,
};
