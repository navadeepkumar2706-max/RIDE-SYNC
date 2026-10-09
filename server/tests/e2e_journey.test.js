import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Ride } from '../models/Ride.js';
import { Booking } from '../models/Booking.js';
import { scoreRideMatch } from '../utils/smartMatch.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ridesync';

async function runE2EAcceptanceTest() {
  console.log('\n======================================================');
  console.log('  RideSync Complete Driver-to-Passenger Journey Test  ');
  console.log('======================================================\n');

  await mongoose.connect(MONGO_URI);
  console.log(' Connected to MongoDB at:', MONGO_URI);

  try {
    // 1. Verify User Accounts
    const driver = await User.findOne({ email: 'arjun.sharma@iith.ac.in' });
    const passenger = await User.findOne({ email: 'ananya.d@osmania.ac.in' });
    const admin = await User.findOne({ email: 'admin@ridesync.in' });

    if (!driver || !passenger || !admin) {
      throw new Error('Seed accounts missing! Please run npm run seed first.');
    }
    console.log('✓ Found seeded Driver (Arjun - IIT-H), Passenger (Ananya - OU), and Admin');

    // 2. Publish a new test ride as Driver
    const departureTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow
    const testRide = await Ride.create({
      driver: driver._id,
      source: {
        name: 'IIT Hyderabad (Kandi Campus)',
        coordinates: { lat: 17.5947, lng: 78.1230 },
      },
      destination: {
        name: 'HITEC City (Cyber Towers)',
        coordinates: { lat: 17.4504, lng: 78.3808 },
      },
      waypoints: [
        { name: 'Miyapur Metro Station', coordinates: { lat: 17.4968, lng: 78.3614 } }
      ],
      departureAt: departureTime,
      totalSeats: 3,
      availableSeats: 3,
      costContribution: 100,
      vehicle: {
        make: 'Honda',
        model: 'City',
        color: 'White',
        plateNumber: 'TS 08 FA 4521',
      },
      status: 'scheduled',
    });
    console.log(`✓ Driver published ride: ${testRide._id} with 3 available seats at ₹100/seat`);

    // 3. Test Deterministic Smart Match Scoring
    const searchOrigin = { lat: 17.5940, lng: 78.1235 }; // Near IIT-H
    const searchDest = { lat: 17.4500, lng: 78.3800 };   // Near HITEC City
    const score = scoreRideMatch(testRide, {
      pickupCoords: searchOrigin,
      dropCoords: searchDest,
      preferredTime: departureTime,
    });
    console.log(`✓ Smart Match Algorithm computed match score: ${score}% (Expected high match > 80%)`);
    if (score < 80) throw new Error(`Smart match score was ${score}%, expected >= 80%`);

    // 4. Passenger requests 2 seats
    const booking = await Booking.create({
      ride: testRide._id,
      passenger: passenger._id,
      seatsRequested: 2,
      totalAmount: 2 * testRide.costContribution,
      pickupNote: 'Will wait at Miyapur Metro pillar 114',
      status: 'pending',
    });
    console.log(`✓ Passenger created booking request for 2 seats (Status: ${booking.status})`);

    // 5. Driver accepts request -> Atomic MongoDB Conditional Update
    const updatedRide = await Ride.findOneAndUpdate(
      {
        _id: testRide._id,
        availableSeats: { $gte: booking.seatsRequested },
      },
      {
        $inc: { availableSeats: -booking.seatsRequested },
      },
      { new: true }
    );

    if (!updatedRide) {
      throw new Error('Atomic seat decrement failed: Over capacity or invalid condition!');
    }
    booking.status = 'confirmed';
    await booking.save();

    console.log(`✓ Driver accepted request: Ride availableSeats atomically decremented to ${updatedRide.availableSeats} of 3`);
    if (updatedRide.availableSeats !== 1) {
      throw new Error(`Expected 1 available seat, got ${updatedRide.availableSeats}`);
    }

    // 6. Test Overbooking Prevention
    console.log('\n--- Testing Overbooking Attempt ---');
    const secondBookingAttempt = await Ride.findOneAndUpdate(
      {
        _id: testRide._id,
        availableSeats: { $gte: 2 }, // Trying to request 2 seats when only 1 is left
      },
      {
        $inc: { availableSeats: -2 },
      },
      { new: true }
    );

    if (secondBookingAttempt) {
      throw new Error('CRITICAL FAILURE: Overbooking succeeded when it should have been rejected!');
    }
    console.log('✓ Overbooking attempt correctly REJECTED by MongoDB atomic $gte constraint!');

    // 7. Test Booking Cancellation & Atomic Seat Restoration
    console.log('\n--- Testing Passenger Cancellation & Atomic Seat Restoration ---');
    const restoredRide = await Ride.findOneAndUpdate(
      { _id: testRide._id },
      { $inc: { availableSeats: booking.seatsRequested } },
      { new: true }
    );
    booking.status = 'cancelled';
    await booking.save();

    console.log(`✓ Passenger cancelled booking: Ride availableSeats atomically restored to ${restoredRide.availableSeats} of 3`);
    if (restoredRide.availableSeats !== 3) {
      throw new Error(`Expected seats restored to 3, got ${restoredRide.availableSeats}`);
    }

    // Clean up test ride & booking
    await Booking.deleteOne({ _id: booking._id });
    await Ride.deleteOne({ _id: testRide._id });
    console.log('✓ Cleaned up test ride & booking');

    console.log('\n======================================================');
    console.log(' ALL 7 ACCEPTANCE CRITERIA PASSED SUCCESSFULLY!       ');
    console.log('======================================================\n');
  } finally {
    await mongoose.disconnect();
  }
}

runE2EAcceptanceTest().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
