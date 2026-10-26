const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theater name is required'],
      trim: true,
    },
    city: {
      type: String,
      required: true,
      default: 'Metropolis',
    },
    location: {
      type: String,
      required: true,
    },
    screens: [
      {
        name: { type: String, default: 'Screen 1' },
        totalSeats: { type: Number, default: 80 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Theater', theaterSchema);
