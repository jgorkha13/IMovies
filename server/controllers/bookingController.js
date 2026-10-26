const Booking = require('../models/Booking');
const Show = require('../models/Show');

// Generate distinct booking code e.g. IMOV-74921
const generateBookingId = () => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `IMOV-${randomDigits}`;
};

// @desc    Create new ticket booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { showId, seats, totalAmount, convenienceFee, paymentMethod } = req.body;

    if (!showId || !seats || !seats.length) {
      return res.status(400).json({ message: 'Show ID and at least one seat are required' });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Check for seat conflicts
    const alreadyBooked = seats.filter((seat) => show.bookedSeats.includes(seat));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        message: `Seats already booked: ${alreadyBooked.join(', ')}. Please choose other seats.`,
      });
    }

    // Reserve seats in show atomically
    show.bookedSeats.push(...seats);
    await show.save();

    // Create booking
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

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error processing booking' });
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'show',
        populate: [
          { path: 'movie', select: 'title posterUrl duration certificate language' },
          { path: 'theater', select: 'name city location' },
        ],
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching user bookings' });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate({
        path: 'show',
        populate: [
          { path: 'movie' },
          { path: 'theater' },
        ],
      });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure only the owner or an admin can view
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching booking' });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Release seats from show
    const show = await Show.findById(booking.show);
    if (show) {
      show.bookedSeats = show.bookedSeats.filter((seat) => !booking.seats.includes(seat));
      await show.save();
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
