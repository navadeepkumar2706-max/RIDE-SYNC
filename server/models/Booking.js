import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
      index: true,
    },
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    seatsRequested: {
      type: Number,
      required: true,
      min: [1, 'Must request at least 1 seat'],
      default: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    pickupPoint: {
      type: String,
      default: '',
    },
    dropPoint: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
      index: true,
    },
    passengerNotes: {
      type: String,
      default: '',
      maxlength: 250,
    },
    driverNotes: {
      type: String,
      default: '',
      maxlength: 250,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent multiple pending/confirmed requests by the same passenger for the same ride
bookingSchema.index({ ride: 1, passenger: 1, status: 1 });

export const Booking = mongoose.model('Booking', bookingSchema);
