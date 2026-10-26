const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: true,
    },
    screenName: {
      type: String,
      default: 'Audi 1',
    },
    date: {
      type: String, // Stored as YYYY-MM-DD for easy querying
      required: true,
    },
    time: {
      type: String, // e.g. "10:30 AM", "02:15 PM", "06:30 PM", "09:45 PM"
      required: true,
    },
    ticketPrice: {
      type: Number,
      required: true,
      default: 250,
    },
    vipPrice: {
      type: Number,
      required: true,
      default: 450,
    },
    totalSeats: {
      type: Number,
      default: 80, // 8 rows (A-H) x 10 cols (1-10)
    },
    bookedSeats: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Show', showSchema);
