import express from 'express';
import { Ride } from '../models/Ride.js';
import { Booking } from '../models/Booking.js';
import { Notification } from '../models/Notification.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.js';
import { scoreRideMatch } from '../utils/smartMatch.js';

export const ridesRouter = express.Router();

// POST /api/rides (Offer a Ride)
ridesRouter.post('/', requireAuth, async (req, res) => {
  try {
    const {
      source,
      destination,
      waypoints = [],
      departureAt,
      totalSeats,
      costContribution,
      vehicle,
      notes,
      preferences,
    } = req.body;

    // Validations
    if (!source?.name || !source?.coordinates?.lat || !source?.coordinates?.lng) {
      return res.status(400).json({ message: 'Valid pickup location with coordinates is required.' });
    }
    if (!destination?.name || !destination?.coordinates?.lat || !destination?.coordinates?.lng) {
      return res.status(400).json({ message: 'Valid destination with coordinates is required.' });
    }
    if (!departureAt) {
      return res.status(400).json({ message: 'Departure date and time are required.' });
    }

    const departureDate = new Date(departureAt);
    if (isNaN(departureDate.getTime())) {
      return res.status(400).json({ message: 'Invalid departure date format.' });
    }
    if (departureDate < new Date()) {
      return res.status(400).json({ message: 'Departure time cannot be in the past.' });
    }

    const parsedSeats = parseInt(totalSeats, 10);
    if (!parsedSeats || parsedSeats < 1 || parsedSeats > 6) {
      return res.status(400).json({ message: 'Seats available must be between 1 and 6.' });
    }

    const parsedCost = parseFloat(costContribution);
    if (isNaN(parsedCost) || parsedCost < 0) {
      return res.status(400).json({ message: 'Cost contribution cannot be negative.' });
    }

    // Default vehicle from user profile if not provided
    const vehicleInfo = vehicle?.make
      ? {
          make: vehicle.make,
          model: vehicle.model,
          color: vehicle.color,
          plateNumber: vehicle.plateNumber || vehicle.licensePlate || 'TS 09 XY 1234',
        }
      : req.user.vehicle?.make
      ? {
          make: req.user.vehicle.make,
          model: req.user.vehicle.model,
          color: req.user.vehicle.color,
          plateNumber: req.user.vehicle.plateNumber || req.user.vehicle.licensePlate || 'TS 09 XY 1234',
        }
      : { make: 'Standard', model: 'Sedan', color: 'Silver', plateNumber: 'TS 09 XY 1234' };

    const ride = await Ride.create({
      driver: req.user._id,
      source,
      destination,
      waypoints,
      departureAt: departureDate,
      totalSeats: parsedSeats,
      availableSeats: parsedSeats,
      costContribution: parsedCost,
      vehicle: vehicleInfo,
      notes: notes || '',
      preferences: preferences || req.user.preferences || {},
      status: 'scheduled',
    });

    const populatedRide = await Ride.findById(ride._id).populate('driver', 'name email institution rating verificationStatus avatar vehicle');

    return res.status(201).json({
      message: 'Ride published successfully.',
      ride: populatedRide,
    });
  } catch (error) {
    console.error('Error creating ride:', error);
    return res.status(500).json({ message: 'Failed to publish ride.' });
  }
});

// GET /api/rides (Find Rides with Smart Match)
ridesRouter.get('/', optionalAuth, async (req, res) => {
  try {
    const pickupParam = req.query.pickup || req.query.origin;
    const destParam = req.query.destination || req.query.drop;
    const {
      date,
      seats,
      pickupLat,
      pickupLng,
      dropLat,
      dropLng,
      time,
    } = req.query;

    const query = {
      status: 'scheduled',
      availableSeats: { $gte: seats ? parseInt(seats, 10) : 1 },
      departureAt: { $gte: new Date() },
    };

    // Filter by date if provided
    if (date) {
      const searchDayStart = new Date(date);
      searchDayStart.setHours(0, 0, 0, 0);
      const searchDayEnd = new Date(date);
      searchDayEnd.setHours(23, 59, 59, 999);

      query.departureAt = {
        $gte: searchDayStart > new Date() ? searchDayStart : new Date(),
        $lte: searchDayEnd,
      };
    }

    // Text search query filtering
    if (pickupParam) {
      query['source.name'] = { $regex: pickupParam.trim(), $options: 'i' };
    }
    if (destParam) {
      query['destination.name'] = { $regex: destParam.trim(), $options: 'i' };
    }

    let rides = await Ride.find(query)
      .populate('driver', 'name email institution rating verificationStatus avatar phone vehicle')
      .sort({ departureAt: 1 })
      .limit(50);

    // Prepare search coordinates for smart match
    const searchParams = {
      pickupCoords:
        pickupLat && pickupLng
          ? { lat: parseFloat(pickupLat), lng: parseFloat(pickupLng) }
          : null,
      dropCoords:
        dropLat && dropLng
          ? { lat: parseFloat(dropLat), lng: parseFloat(dropLng) }
          : null,
      preferredTime: time || (date ? new Date(date) : null),
    };

    // Calculate smart match score and attach
    const scoredRides = rides.map((r) => {
      const rideObj = r.toObject();
      const matchScore = scoreRideMatch(rideObj, searchParams);
      return {
        ...rideObj,
        matchScore,
      };
    });

    // Sort by match score descending if coordinates/preferredTime provided
    if (searchParams.pickupCoords || searchParams.preferredTime) {
      scoredRides.sort((a, b) => b.matchScore - a.matchScore);
    }

    return res.json({ rides: scoredRides });
  } catch (error) {
    console.error('Error fetching rides:', error);
    return res.status(500).json({ message: 'Failed to search rides.' });
  }
});

// GET /api/rides/me/published (Driver's Published Rides)
ridesRouter.get('/me/published', requireAuth, async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id })
      .sort({ departureAt: -1 });

    // Fetch booking counts for each ride
    const ridesWithBookings = await Promise.all(
      rides.map(async (ride) => {
        const bookings = await Booking.find({ ride: ride._id })
          .populate('passenger', 'name email institution rating avatar phone');
        return {
          ...ride.toObject(),
          bookings,
        };
      })
    );

    return res.json({ rides: ridesWithBookings });
  } catch (error) {
    console.error('Error fetching user published rides:', error);
    return res.status(500).json({ message: 'Failed to fetch your rides.' });
  }
});

// GET /api/rides/:id (Ride Details)
ridesRouter.get('/:id', optionalAuth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate(
      'driver',
      'name email institution rating verificationStatus avatar phone vehicle preferences'
    );

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found.' });
    }

    // Also get confirmed passengers for this ride
    const bookings = await Booking.find({
      ride: ride._id,
      status: 'confirmed',
    }).populate('passenger', 'name avatar institution');

    return res.json({
      ride,
      passengers: bookings.map((b) => ({
        ...b.passenger.toObject(),
        seats: b.seatsRequested,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load ride details.' });
  }
});

// PATCH /api/rides/:id/cancel (Cancel Ride by Driver)
ridesRouter.patch('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found.' });
    }

    if (ride.driver.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Only the driver can cancel this ride.' });
    }

    ride.status = 'cancelled';
    await ride.save();

    // Cancel all pending and confirmed bookings
    const activeBookings = await Booking.find({
      ride: ride._id,
      status: { $in: ['pending', 'confirmed'] },
    });

    for (const b of activeBookings) {
      b.status = 'cancelled';
      await b.save();

      // Send in-app notification to passenger
      await Notification.create({
        recipient: b.passenger,
        sender: req.user._id,
        type: 'ride_cancelled',
        title: 'Ride Cancelled by Driver',
        message: `Your ride from ${ride.source.name} to ${ride.destination.name} was cancelled by the driver.`,
        relatedRide: ride._id,
        relatedBooking: b._id,
      });
    }

    return res.json({ message: 'Ride cancelled successfully.', ride });
  } catch (error) {
    console.error('Error cancelling ride:', error);
    return res.status(500).json({ message: 'Failed to cancel ride.' });
  }
});
