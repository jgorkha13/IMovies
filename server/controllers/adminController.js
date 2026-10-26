const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const User = require('../models/User');
const Show = require('../models/Show');

// @desc    Get system stats for Admin dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments();
    const totalShows = await Show.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Calculate revenue from active bookings
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
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
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

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching all bookings' });
  }
};

module.exports = {
  getAdminStats,
  getAllBookings,
};
