const Show = require('../models/Show');
const { getIsConnected } = require('../config/db');
const mockStore = require('../config/mockStore');

// @desc    Get shows with filtering by movie and date
// @route   GET /api/shows
const getShows = async (req, res) => {
  try {
    const { movie, date, theater } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (movie) query.movie = movie;
      if (date) query.date = date;
      if (theater) query.theater = theater;

      const shows = await Show.find(query)
        .populate('movie', 'title posterUrl duration certificate language')
        .populate('theater', 'name city location')
        .sort({ date: 1, time: 1 });
      return res.json(shows);
    }

    // Mock store
    let filtered = mockStore.shows;
    if (movie) filtered = filtered.filter((s) => s.movie === movie);
    if (date) filtered = filtered.filter((s) => s.date === date);
    if (theater) filtered = filtered.filter((s) => s.theater === theater);

    // Populate movie and theater
    const populated = filtered.map((s) => {
      const m = mockStore.movies.find((item) => item._id === s.movie) || {};
      const t = mockStore.theaters.find((item) => item._id === s.theater) || {};
      return {
        ...s,
        movie: {
          _id: m._id,
          title: m.title,
          posterUrl: m.posterUrl,
          duration: m.duration,
          certificate: m.certificate,
          language: m.language,
        },
        theater: {
          _id: t._id,
          name: t.name,
          city: t.city,
          location: t.location,
        },
      };
    });

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching shows' });
  }
};

// @desc    Get single show by ID
// @route   GET /api/shows/:id
const getShowById = async (req, res) => {
  try {
    if (getIsConnected()) {
      const show = await Show.findById(req.params.id)
        .populate('movie')
        .populate('theater');
      if (!show) return res.status(404).json({ message: 'Show not found' });
      return res.json(show);
    }

    const s = mockStore.shows.find((item) => item._id === req.params.id);
    if (!s) return res.status(404).json({ message: 'Show not found' });

    const m = mockStore.movies.find((item) => item._id === s.movie) || {};
    const t = mockStore.theaters.find((item) => item._id === s.theater) || {};

    res.json({
      ...s,
      movie: m,
      theater: t,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching show' });
  }
};

// @desc    Create show
// @route   POST /api/shows
const createShow = async (req, res) => {
  try {
    const { movie, theater, screenName, date, time, ticketPrice, vipPrice, totalSeats } = req.body;

    const showData = {
      movie,
      theater,
      screenName: screenName || 'Screen 1',
      date,
      time,
      ticketPrice: Number(ticketPrice) || 250,
      vipPrice: Number(vipPrice) || 450,
      totalSeats: Number(totalSeats) || 80,
      bookedSeats: [],
    };

    if (getIsConnected()) {
      const show = new Show(showData);
      const created = await show.save();
      const populated = await Show.findById(created._id).populate('movie').populate('theater');
      return res.status(201).json(populated);
    }

    const created = { _id: `show_${Date.now()}`, ...showData };
    mockStore.shows.push(created);

    const m = mockStore.movies.find((item) => item._id === movie) || {};
    const t = mockStore.theaters.find((item) => item._id === theater) || {};
    res.status(201).json({ ...created, movie: m, theater: t });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to create show' });
  }
};

// @desc    Delete show
// @route   DELETE /api/shows/:id
const deleteShow = async (req, res) => {
  try {
    if (getIsConnected()) {
      const show = await Show.findById(req.params.id);
      if (!show) return res.status(404).json({ message: 'Show not found' });
      await Show.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Show deleted successfully' });
    }

    const idx = mockStore.shows.findIndex((s) => s._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Show not found' });
    mockStore.shows.splice(idx, 1);
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
