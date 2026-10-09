import express from 'express';
import { Booking } from '../models/Booking.js';
import { Ride } from '../models/Ride.js';
import { Notification } from '../models/Notification.js';
import { requireAuth } from '../middlewares/auth.js';

export const bookingsRouter = express.Router();

// POST /api/rides/:id/bookings (Request Seat on Ride)
bookingsRouter.post('/rides/:id/bookings', requireAuth, async (req, res) => {
  try {
    const rideId = req.params.id;
    const { seatsRequested = 1, pickupPoint, dropPoint, passengerNotes } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found.' });
    }

    if (ride.status !== 'scheduled') {
      return res.status(400).json({ message: `Cannot book a ride that is ${ride.status}.` });
    }

    // Driver cannot book their own ride
    if (ride.driver.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot book seats on your own ride.' });
    }

    const seats = parseInt(seatsRequested, 10);
    if (!seats || seats < 1 || seats > 6) {
      return res.status(400).json({ message: 'Please request between 1 and 6 seats.' });
    }

    if (seats > ride.availableSeats) {
      return res.status(400).json({
        message: `Only ${ride.availableSeats} seat(s) currently available on this ride.`,
      });
    }

    // Check duplicate pending or confirmed booking by this user
    const existing = await Booking.findOne({
      ride: rideId,
      passenger: req.user._id,
      status: { $in: ['pending', 'confirmed'] },
    });
    if (existing) {
      return res.status(400).json({
        message: 'You already have an active booking request for this ride.',
      });
    }

    const totalAmount = seats * ride.costContribution;

    const booking = await Booking.create({
      ride: rideId,
      passenger: req.user._id,
      seatsRequested: seats,
      totalAmount,
      pickupPoint: pickupPoint || ride.source.name,
      dropPoint: dropPoint || ride.destination.name,
      passengerNotes: passengerNotes || req.body.pickupNote || '',
      status: 'pending',
    });

    // Notify Driver
    await Notification.create({
      recipient: ride.driver,
      sender: req.user._id,
      type: 'booking_request',
      title: 'New Booking Request',
      message: `${req.user.name} requested ${seats} seat(s) for your trip to ${ride.destination.name}.`,
      relatedRide: ride._id,
      relatedBooking: booking._id,
    });

    const populated = await Booking.findById(booking._id)
      .populate('ride')
      .populate('passenger', 'name email institution rating avatar phone');

    return res.status(201).json({
      message: 'Seat request submitted. Awaiting driver confirmation.',
      booking: populated,
    });
  } catch (error) {
    console.error('Error creating booking request:', error);
    return res.status(500).json({ message: 'Failed to request seat.' });
  }
});

// GET /api/bookings/me (Passenger's My Bookings)
bookingsRouter.get('/me', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ passenger: req.user._id })
      .populate({
        path: 'ride',
        populate: {
          path: 'driver',
          select: 'name email institution rating avatar phone vehicle',
        },
      })
      .sort({ createdAt: -1 });

    return res.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ message: 'Failed to fetch bookings.' });
  }
});

// GET /api/rides/:id/bookings (Driver Inspects Requests for a Ride)
bookingsRouter.get('/rides/:id/bookings', requireAuth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found.' });
    }

    if (ride.driver.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Only the driver can inspect requests.' });
    }

    const bookings = await Booking.find({ ride: ride._id })
      .populate('passenger', 'name email institution rating avatar phone')
      .sort({ createdAt: -1 });

    return res.json({ bookings });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch ride booking requests.' });
  }
});

// PATCH /api/bookings/:id/status (Driver Confirms or Rejects Request)
// CRITICAL: Atomic MongoDB Conditional Update Prevents Overbooking Concurrency!
bookingsRouter.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status, driverNotes } = req.body;

    if (!['confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Status must be 'confirmed' or 'rejected'." });
    }

    const booking = await Booking.findById(req.params.id).populate('ride');
    if (!booking) {
      return res.status(404).json({ message: 'Booking request not found.' });
    }

    const ride = booking.ride;
    if (ride.driver.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Only the driver can approve/reject bookings.' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: `Cannot change status of a booking that is already ${booking.status}.` });
    }

    if (status === 'confirmed') {
      // ATOMIC CONDITIONAL UPDATE:
      // Guarantees availableSeats >= seatsRequested at the exact instant of decrement
      const updatedRide = await Ride.findOneAndUpdate(
        {
          _id: ride._id,
          availableSeats: { $gte: booking.seatsRequested },
          status: 'scheduled',
        },
        {
          $inc: { availableSeats: -booking.seatsRequested },
        },
        { new: true }
      );

      if (!updatedRide) {
        return res.status(409).json({
          message: 'Overbooking prevented: Insufficient seats remaining on this ride.',
        });
      }

      booking.status = 'confirmed';
      if (driverNotes) booking.driverNotes = driverNotes;
      await booking.save();

      // Notify Passenger
      await Notification.create({
        recipient: booking.passenger,
        sender: req.user._id,
        type: 'booking_confirmed',
        title: 'Booking Confirmed!',
        message: `Your booking for ${ride.source.name} → ${ride.destination.name} is confirmed by the driver.`,
        relatedRide: ride._id,
        relatedBooking: booking._id,
      });

      return res.json({
        message: 'Booking confirmed successfully.',
        booking,
        availableSeats: updatedRide.availableSeats,
      });
    } else {
      // Rejection
      booking.status = 'rejected';
      if (driverNotes) booking.driverNotes = driverNotes;
      await booking.save();

      // Notify Passenger
      await Notification.create({
        recipient: booking.passenger,
        sender: req.user._id,
        type: 'booking_rejected',
        title: 'Booking Request Declined',
        message: `The driver was unable to accept your booking request for ${ride.destination.name}.`,
        relatedRide: ride._id,
        relatedBooking: booking._id,
      });

      return res.json({ message: 'Booking request rejected.', booking });
    }
  } catch (error) {
    console.error('Error updating booking status:', error);
    return res.status(500).json({ message: 'Failed to update booking status.' });
  }
});

// PATCH /api/bookings/:id/cancel (Passenger Cancels Their Booking)
// CRITICAL: Atomic Restoration of Seats
bookingsRouter.patch('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('ride');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.passenger.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to cancel this booking.' });
    }

    if (['cancelled', 'completed', 'rejected'].includes(booking.status)) {
      return res.status(400).json({ message: `Cannot cancel a booking that is already ${booking.status}.` });
    }

    const wasConfirmed = booking.status === 'confirmed';

    booking.status = 'cancelled';
    await booking.save();

    // If it was confirmed, atomically restore the reserved seats to the ride
    if (wasConfirmed && booking.ride) {
      await Ride.findByIdAndUpdate(booking.ride._id, {
        $inc: { availableSeats: booking.seatsRequested },
      });
    }

    // Notify Driver
    if (booking.ride) {
      await Notification.create({
        recipient: booking.ride.driver,
        sender: req.user._id,
        type: 'booking_cancelled',
        title: 'Booking Cancelled by Passenger',
        message: `${req.user.name} cancelled their booking for ${booking.ride.destination.name}.`,
        relatedRide: booking.ride._id,
        relatedBooking: booking._id,
      });
    }

    return res.json({ message: 'Booking cancelled successfully.', booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({ message: 'Failed to cancel booking.' });
  }
});
