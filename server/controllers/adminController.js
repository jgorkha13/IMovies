const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const User = require('../models/User');
const Show = require('../models/Show');
const { getIsConnected } = require('../config/db');
const mockStore = require('../config/mockStore');

// @desc    Get system stats for Admin dashboard
// @route   GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    if (getIsConnected()) {
      const totalMovies = await Movie.countDocuments({ isActive: true });
      const totalUsers = await User.countDocuments();
      const totalShows = await Show.countDocuments();
      const totalBookings = await Booking.countDocuments();

      const confirmedBookings = await Booking.find({ status: 'confirmed' });
      const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const totalTicketsSold = confirmedBookings.reduce((sum, b) => sum + (b.seats ? b.seats.length : 0), 0);

      const recentBookings = await Booking.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate('user', 'name email')
        .populate({
          path: 'show',
          populate: [
            { path: 'movie', select: 'title posterUrl' },
            { path: 'theater', select: 'name' },
          ],
        });

      return res.json({
        totalMovies,
        totalUsers,
        totalShows,
        totalBookings,
        totalTicketsSold,
        totalRevenue,
        recentBookings,
      });
    }

    // Mock store
    const totalMovies = mockStore.movies.filter((m) => m.isActive).length;
    const totalUsers = mockStore.users.length;
    const totalShows = mockStore.shows.length;
    const totalBookings = mockStore.bookings.length;

    const confirmed = mockStore.bookings.filter((b) => b.status === 'confirmed');
    const totalRevenue = confirmed.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalTicketsSold = confirmed.reduce((sum, b) => sum + (b.seats ? b.seats.length : 0), 0);

    const recentBookings = mockStore.bookings.slice(0, 8).map((b) => {
      const u = mockStore.users.find((user) => user._id === b.user) || {};
      const s = mockStore.shows.find((show) => show._id === b.show) || {};
      const m = mockStore.movies.find((movie) => movie._id === s.movie) || {};
      const t = mockStore.theaters.find((theater) => theater._id === s.theater) || {};
      return {
        ...b,
        user: { name: u.name, email: u.email },
        show: {
          ...s,
          movie: { title: m.title, posterUrl: m.posterUrl },
          theater: { name: t.name },
        },
      };
    });

    res.json({
      totalMovies,
      totalUsers,
      totalShows,
      totalBookings,
      totalTicketsSold,
      totalRevenue,
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching admin stats' });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/admin/bookings
const getAllBookings = async (req, res) => {
  try {
    if (getIsConnected()) {
      const bookings = await Booking.find()
        .populate('user', 'name email phone')
        .populate({
          path: 'show',
          populate: [
            { path: 'movie', select: 'title posterUrl duration' },
            { path: 'theater', select: 'name city location' },
          ],
        })
        .sort({ createdAt: -1 });
      return res.json(bookings);
    }

    // Mock store
    const all = mockStore.bookings.map((b) => {
      const u = mockStore.users.find((user) => user._id === b.user) || {};
      const s = mockStore.shows.find((show) => show._id === b.show) || {};
      const m = mockStore.movies.find((movie) => movie._id === s.movie) || {};
      const t = mockStore.theaters.find((theater) => theater._id === s.theater) || {};
      return {
        ...b,
        user: { name: u.name, email: u.email, phone: u.phone },
        show: {
          ...s,
          movie: { title: m.title, posterUrl: m.posterUrl, duration: m.duration },
          theater: { name: t.name, city: t.city, location: t.location },
        },
      };
    });

    res.json(all);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching all bookings' });
  }
};

module.exports = {
  getAdminStats,
  getAllBookings,
};
