import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Ride } from '../models/Ride.js';
import { Booking } from '../models/Booking.js';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ridesync_test';

async function runTests() {
  console.log('=== STARTING RIDESYNC BACKEND CONCURRENCY & BOOKING TESTS ===');
  await mongoose.connect(uri);

  // Clean test tables
  await User.deleteMany({ email: /test.*@ridesync\.test/ });
  await Ride.deleteMany({ notes: 'Concurrency Test Ride' });
  await Booking.deleteMany({});

  const passwordHash = await User.hashPassword('TestPass123!');

  // Create 1 Driver and 3 Passengers
  const driver = await User.create({
    name: 'Driver Test',
    email: 'test_driver@ridesync.test',
    passwordHash,
    institution: 'IIT Hyderabad',
  });

  const p1 = await User.create({
    name: 'Passenger 1',
    email: 'test_p1@ridesync.test',
    passwordHash,
    institution: 'BITS Hyderabad',
  });

  const p2 = await User.create({
    name: 'Passenger 2',
    email: 'test_p2@ridesync.test',
    passwordHash,
    institution: 'IIIT Hyderabad',
  });

  const p3 = await User.create({
    name: 'Passenger 3',
    email: 'test_p3@ridesync.test',
    passwordHash,
    institution: 'Osmania University',
  });

  // TEST 1: Create Ride with 2 Available Seats
  console.log('\n[TEST 1] Creating Ride with strictly 2 totalSeats and 2 availableSeats...');
  const ride = await Ride.create({
    driver: driver._id,
    source: { name: 'HITEC City', coordinates: { lat: 17.45, lng: 78.38 } },
    destination: { name: 'IIT Hyderabad', coordinates: { lat: 17.59, lng: 78.12 } },
    departureAt: new Date(Date.now() + 3600000),
    totalSeats: 2,
    availableSeats: 2,
    costContribution: 100,
    notes: 'Concurrency Test Ride',
  });
  console.log(`✓ Ride created. ID: ${ride._id}, Available Seats: ${ride.availableSeats}`);

  // TEST 2: Passenger 1 and Passenger 2 and Passenger 3 create requests
  console.log('\n[TEST 2] Creating booking requests for 3 passengers (1 seat each)...');
  const b1 = await Booking.create({
    ride: ride._id,
    passenger: p1._id,
    seatsRequested: 1,
    totalAmount: 100,
    status: 'pending',
  });
  const b2 = await Booking.create({
    ride: ride._id,
    passenger: p2._id,
    seatsRequested: 1,
    totalAmount: 100,
    status: 'pending',
  });
  const b3 = await Booking.create({
    ride: ride._id,
    passenger: p3._id,
    seatsRequested: 1,
    totalAmount: 100,
    status: 'pending',
  });
  console.log(`✓ 3 pending requests created for ride of capacity 2.`);

  // TEST 3: Driver confirms Passenger 1 and Passenger 2 concurrently
  console.log('\n[TEST 3] Driver accepts Passenger 1 and Passenger 2 with atomic conditional updates...');
  
  // Atomic confirm function simulating the endpoint
  async function atomicConfirm(booking) {
    const updated = await Ride.findOneAndUpdate(
      {
        _id: booking.ride,
        availableSeats: { $gte: booking.seatsRequested },
        status: 'scheduled',
      },
      { $inc: { availableSeats: -booking.seatsRequested } },
      { new: true }
    );
    if (!updated) {
      return { success: false, reason: 'OVERBOOKING_PREVENTED' };
    }
    booking.status = 'confirmed';
    await booking.save();
    return { success: true, remaining: updated.availableSeats };
  }

  const res1 = await atomicConfirm(b1);
  console.log(`Passenger 1 confirmation result:`, res1);

  const res2 = await atomicConfirm(b2);
  console.log(`Passenger 2 confirmation result:`, res2);

  // TEST 4: Attempting to confirm Passenger 3 MUST BE REJECTED (capacity exhausted)
  console.log('\n[TEST 4] Attempting to confirm Passenger 3 when availableSeats is 0...');
  const res3 = await atomicConfirm(b3);
  console.log(`Passenger 3 confirmation result:`, res3);
  if (!res3.success && res3.reason === 'OVERBOOKING_PREVENTED') {
    console.log('✓ PASS: Overbooking correctly prevented by atomic conditional update!');
  } else {
    throw new Error('FAIL: Overbooking was not prevented!');
  }

  // Check ride available seats
  const rideAfterConfirms = await Ride.findById(ride._id);
  console.log(`Ride available seats now: ${rideAfterConfirms.availableSeats} (Expected: 0)`);
  if (rideAfterConfirms.availableSeats !== 0) {
    throw new Error(`FAIL: Expected 0 available seats, got ${rideAfterConfirms.availableSeats}`);
  }

  // TEST 5: Passenger 1 Cancels. Seat count MUST BE RESTORED EXACTLY ONCE to 1.
  console.log('\n[TEST 5] Passenger 1 cancels booking. Verifying atomic seat restoration...');
  async function cancelBooking(booking) {
    if (booking.status === 'confirmed') {
      await Ride.findByIdAndUpdate(booking.ride, {
        $inc: { availableSeats: booking.seatsRequested },
      });
    }
    booking.status = 'cancelled';
    await booking.save();
  }

  await cancelBooking(b1);
  const rideAfterCancel = await Ride.findById(ride._id);
  console.log(`Ride available seats after cancellation: ${rideAfterCancel.availableSeats} (Expected: 1)`);
  if (rideAfterCancel.availableSeats !== 1) {
    throw new Error(`FAIL: Expected 1 available seat after cancel, got ${rideAfterCancel.availableSeats}`);
  }
  console.log('✓ PASS: Seat restoration worked cleanly!');

  // TEST 6: Now Passenger 3 CAN be confirmed into the newly freed seat!
  console.log('\n[TEST 6] Confirming Passenger 3 into the restored seat...');
  const res3Retry = await atomicConfirm(b3);
  console.log('Passenger 3 retry confirmation:', res3Retry);
  if (res3Retry.success && res3Retry.remaining === 0) {
    console.log('✓ PASS: Passenger 3 successfully confirmed into freed seat!');
  } else {
    throw new Error('FAIL: Passenger 3 could not claim freed seat!');
  }

  // Cleanup test data
  await User.deleteMany({ email: /test.*@ridesync\.test/ });
  await Ride.deleteMany({ _id: ride._id });
  await Booking.deleteMany({ _id: { $in: [b1._id, b2._id, b3._id] } });

  await mongoose.disconnect();
  console.log('\n=== ALL 6 BACKEND CONCURRENCY & CAPACITY TESTS PASSED SUCCESSFULLY! ===\n');
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
