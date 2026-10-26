const Booking = require('../models/Booking');
const Show = require('../models/Show');
const { getIsConnected } = require('../config/db');
const mockStore = require('../config/mockStore');

const generateBookingId = () => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `IMOV-${randomDigits}`;
};

// @desc    Create new ticket booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { showId, seats, totalAmount, convenienceFee, paymentMethod } = req.body;

    if (!showId || !seats || !seats.length) {
      return res.status(400).json({ message: 'Show ID and at least one seat are required' });
    }

    if (getIsConnected()) {
      const show = await Show.findById(showId);
      if (!show) return res.status(404).json({ message: 'Show not found' });

      const alreadyBooked = seats.filter((seat) => show.bookedSeats.includes(seat));
      if (alreadyBooked.length > 0) {
        return res.status(400).json({
          message: `Seats already booked: ${alreadyBooked.join(', ')}. Please choose other seats.`,
        });
      }

      show.bookedSeats.push(...seats);
      await show.save();

      const booking = new Booking({
        bookingId: generateBookingId(),
        user: req.user._id,
        show: showId,
        seats,
        totalAmount,
        convenienceFee: convenienceFee || 30,
        status: 'confirmed',
        paymentDetails: {
          method: paymentMethod || 'Credit/Debit Card',
          transactionId: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'Completed',
        },
      });

      const savedBooking = await booking.save();
      const populated = await Booking.findById(savedBooking._id)
        .populate('user', 'name email phone')
        .populate({
          path: 'show',
          populate: [
            { path: 'movie', select: 'title posterUrl duration certificate language' },
            { path: 'theater', select: 'name city location' },
          ],
        });
      return res.status(201).json(populated);
    }

    // Mock store
    const show = mockStore.shows.find((s) => s._id === showId);
    if (!show) return res.status(404).json({ message: 'Show not found' });

    const alreadyBooked = seats.filter((seat) => show.bookedSeats.includes(seat));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        message: `Seats already booked: ${alreadyBooked.join(', ')}. Please choose other seats.`,
      });
    }

    show.bookedSeats.push(...seats);

    const newBooking = {
      _id: `booking_${Date.now()}`,
      bookingId: generateBookingId(),
      user: req.user._id,
      show: showId,
      seats,
      totalAmount,
      convenienceFee: convenienceFee || 30,
      status: 'confirmed',
      paymentDetails: {
        method: paymentMethod || 'Credit/Debit Card',
        transactionId: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Completed',
      },
      createdAt: new Date(),
    };
    mockStore.bookings.unshift(newBooking);

    const m = mockStore.movies.find((item) => item._id === show.movie) || {};
    const t = mockStore.theaters.find((item) => item._id === show.theater) || {};

    const populated = {
      ...newBooking,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
      },
      show: {
        ...show,
        movie: m,
        theater: t,
      },
    };

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error processing booking' });
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    if (getIsConnected()) {
      const bookings = await Booking.find({ user: req.user._id })
        .populate({
          path: 'show',
          populate: [
            { path: 'movie', select: 'title posterUrl duration certificate language' },
            { path: 'theater', select: 'name city location' },
          ],
        })
        .sort({ createdAt: -1 });
      return res.json(bookings);
    }

    // Mock store
    const userBookings = mockStore.bookings.filter((b) => b.user === req.user._id);
    const populated = userBookings.map((b) => {
      const show = mockStore.shows.find((s) => s._id === b.show) || {};
      const m = mockStore.movies.find((item) => item._id === show.movie) || {};
      const t = mockStore.theaters.find((item) => item._id === show.theater) || {};
      return {
        ...b,
        show: {
          ...show,
          movie: m,
          theater: t,
        },
      };
    });

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching user bookings' });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    if (getIsConnected()) {
      const booking = await Booking.findById(req.params.id)
        .populate('user', 'name email phone')
        .populate({
          path: 'show',
          populate: [{ path: 'movie' }, { path: 'theater' }],
        });

      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this booking' });
      }
      return res.json(booking);
    }

    const b = mockStore.bookings.find((item) => item._id === req.params.id);
    if (!b) return res.status(404).json({ message: 'Booking not found' });

    const show = mockStore.shows.find((s) => s._id === b.show) || {};
    const m = mockStore.movies.find((item) => item._id === show.movie) || {};
    const t = mockStore.theaters.find((item) => item._id === show.theater) || {};
    const u = mockStore.users.find((user) => user._id === b.user) || {};

    res.json({
      ...b,
      user: { _id: u._id, name: u.name, email: u.email, phone: u.phone },
      show: { ...show, movie: m, theater: t },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching booking' });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    if (getIsConnected()) {
      const booking = await Booking.findById(req.params.id);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }
      if (booking.status === 'cancelled') {
        return res.status(400).json({ message: 'Booking is already cancelled' });
      }

      booking.status = 'cancelled';
      await booking.save();

      const show = await Show.findById(booking.show);
      if (show) {
        show.bookedSeats = show.bookedSeats.filter((seat) => !booking.seats.includes(seat));
        await show.save();
      }
      return res.json({ message: 'Booking cancelled successfully', booking });
    }

    const booking = mockStore.bookings.find((item) => item._id === req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    const show = mockStore.shows.find((s) => s._id === booking.show);
    if (show) {
      show.bookedSeats = show.bookedSeats.filter((seat) => !booking.seats.includes(seat));
    }

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error cancelling booking' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
