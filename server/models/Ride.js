import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, default: '' },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  { _id: false }
);

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    source: {
      type: locationSchema,
      required: true,
    },
    destination: {
      type: locationSchema,
      required: true,
    },
    waypoints: [
      {
        name: { type: String, required: true },
        coordinates: {
          lat: { type: Number, required: true },
          lng: { type: Number, required: true },
        },
      },
    ],
    departureAt: {
      type: Date,
      required: true,
      index: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: [1, 'Must offer at least 1 seat'],
      max: [6, 'Maximum 6 passenger seats'],
    },
    availableSeats: {
      type: Number,
      required: true,
      min: [0, 'Available seats cannot be negative'],
    },
    costContribution: {
      type: Number,
      required: true,
      min: [0, 'Cost contribution cannot be negative'],
    },
    vehicle: {
      make: { type: String, default: 'Car' },
      model: { type: String, default: 'Standard' },
      color: { type: String, default: 'Silver' },
      plateNumber: { type: String, default: '' },
    },
    preferences: {
      ac: { type: Boolean, default: true },
      smokeFree: { type: Boolean, default: true },
      womenOnly: { type: Boolean, default: false },
    },
    notes: {
      type: String,
      default: '',
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for searching
rideSchema.index({ status: 1, departureAt: 1, availableSeats: 1 });

export const Ride = mongoose.model('Ride', rideSchema);
