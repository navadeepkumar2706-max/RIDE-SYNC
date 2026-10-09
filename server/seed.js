import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Ride } from './models/Ride.js';
import { Booking } from './models/Booking.js';
import { Notification } from './models/Notification.js';

dotenv.config();

const HYDERABAD_HUBS = {
  iith: { name: 'IIT Hyderabad (Kandi Campus)', lat: 17.5947, lng: 78.123 },
  iiit: { name: 'IIIT Hyderabad (Gachibowli)', lat: 17.4455, lng: 78.3489 },
  bits: { name: 'BITS Pilani Hyderabad Campus', lat: 17.5449, lng: 78.5718 },
  osmania: { name: 'Osmania University (Arts College)', lat: 17.4138, lng: 78.5283 },
  hitec: { name: 'HITEC City Cyber Towers', lat: 17.4504, lng: 78.3808 },
  financial: { name: 'Financial District (WaveRock / Gachibowli)', lat: 17.4168, lng: 78.334 },
  jubilee: { name: 'Jubilee Hills Road No. 36', lat: 17.4319, lng: 78.4073 },
  secunderabad: { name: 'Secunderabad Junction', lat: 17.4334, lng: 78.5015 },
  airport: { name: 'RGIA Shamshabad Airport', lat: 17.2403, lng: 78.4294 },
};

export async function seedDatabase(force = false) {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0 && !force) {
      console.log(`[RideSync Seed] Database already contains ${userCount} users. Skipping seed.`);
      return;
    }

    console.log('[RideSync Seed] Clearing old sample data...');
    await User.deleteMany({});
    await Ride.deleteMany({});
    await Booking.deleteMany({});
    await Notification.deleteMany({});

    console.log('[RideSync Seed] Creating campus commuters and demo users...');
    const defaultPassword = 'Password123!';
    const passwordHash = await User.hashPassword(defaultPassword);

    const users = await User.create([
      {
        name: 'Arjun Sharma',
        email: 'arjun.sharma@iith.ac.in',
        passwordHash,
        institution: 'IIT Hyderabad',
        phone: '+91 98765 43210',
        role: 'user',
        verificationStatus: 'institution_verified',
        isDriver: true,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        bio: 'CS student at IIT Hyderabad. Daily commuter from Gachibowli to Kandi campus. Calm driver, playlist enthusiast.',
        vehicle: {
          make: 'Honda',
          model: 'City (White)',
          color: 'White',
          plateNumber: 'TS 08 FA 4521',
          capacity: 4,
        },
        preferences: { smokeFree: true, ac: true, music: true, womenOnly: false },
        rating: { average: 4.9, count: 28 },
      },
      {
        name: 'Priya Reddy',
        email: 'priya.reddy@iiit.ac.in',
        passwordHash,
        institution: 'IIIT Hyderabad',
        phone: '+91 98451 23456',
        role: 'user',
        verificationStatus: 'institution_verified',
        isDriver: true,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        bio: 'AI researcher at IIIT-H. Commutes from Jubilee Hills to Financial District & IIIT-H. Women-preferred carpool available.',
        vehicle: {
          make: 'Hyundai',
          model: 'i20 Asta',
          color: 'Metallic Grey',
          plateNumber: 'TS 09 EQ 7890',
          capacity: 4,
        },
        preferences: { smokeFree: true, ac: true, music: true, womenOnly: true },
        rating: { average: 5.0, count: 42 },
      },
      {
        name: 'Vikram BITS',
        email: 'vikram.k@pilani.bits-pilani.ac.in',
        passwordHash,
        institution: 'BITS Pilani Hyderabad',
        phone: '+91 97123 45678',
        role: 'user',
        verificationStatus: 'institution_verified',
        isDriver: true,
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
        bio: 'Electrical Engg @ BITS Hyderabad. Weekly weekend trips from campus to Secunderabad and HITEC City.',
        vehicle: {
          make: 'Tata',
          model: 'Nexon EV',
          color: 'Teal Blue',
          plateNumber: 'TS 10 EV 1122',
          capacity: 4,
        },
        preferences: { smokeFree: true, ac: true, music: true, womenOnly: false },
        rating: { average: 4.8, count: 19 },
      },
      {
        name: 'Ananya Deshmukh',
        email: 'ananya.d@osmania.ac.in',
        passwordHash,
        institution: 'Osmania University',
        phone: '+91 91234 56789',
        role: 'user',
        verificationStatus: 'institution_verified',
        isDriver: false,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
        bio: 'Economics postgraduate student at Osmania University. Looking for daily morning rides to HITEC City internships.',
        preferences: { smokeFree: true, ac: true, music: false, womenOnly: true },
        rating: { average: 4.9, count: 14 },
      },
      {
        name: 'Campus Admin',
        email: 'admin@ridesync.in',
        passwordHash,
        institution: 'RideSync Operations HQ',
        phone: '+91 90000 00001',
        role: 'admin',
        verificationStatus: 'institution_verified',
        isDriver: false,
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin',
        bio: 'RideSync Platform Moderator & Institutional Verifier.',
      },
    ]);

    const [arjun, priya, vikram, ananya] = users;

    console.log('[RideSync Seed] Publishing realistic Hyderabad rides...');
    const now = new Date();

    // Helper for tomorrow / future dates
    const makeFutureDate = (hoursFromNow) => {
      const d = new Date(now.getTime() + hoursFromNow * 60 * 60 * 1000);
      return d;
    };

    const rides = await Ride.create([
      {
        driver: arjun._id,
        source: {
          name: HYDERABAD_HUBS.hitec.name,
          address: 'Near Cyber Towers, Madhapur',
          coordinates: { lat: HYDERABAD_HUBS.hitec.lat, lng: HYDERABAD_HUBS.hitec.lng },
        },
        destination: {
          name: HYDERABAD_HUBS.iith.name,
          address: 'Kandi, Sangareddy, NH65',
          coordinates: { lat: HYDERABAD_HUBS.iith.lat, lng: HYDERABAD_HUBS.iith.lng },
        },
        waypoints: [
          { name: 'Miyapur Metro Station', coordinates: { lat: 17.4968, lng: 78.3614 } },
          { name: 'Patancheru Bus Station', coordinates: { lat: 17.5287, lng: 78.2642 } },
        ],
        departureAt: makeFutureDate(3), // In 3 hours
        totalSeats: 3,
        availableSeats: 2, // 1 confirmed booking
        costContribution: 120,
        vehicle: arjun.vehicle,
        preferences: { ac: true, smokeFree: true, womenOnly: false },
        notes: 'Heading to lab session. Can pick up passengers near Miyapur Metro crossroad.',
        status: 'scheduled',
      },
      {
        driver: priya._id,
        source: {
          name: HYDERABAD_HUBS.jubilee.name,
          address: 'Road No. 36 Metro Pillar 1650',
          coordinates: { lat: HYDERABAD_HUBS.jubilee.lat, lng: HYDERABAD_HUBS.jubilee.lng },
        },
        destination: {
          name: HYDERABAD_HUBS.financial.name,
          address: 'WaveRock SEZ, Nanakramguda',
          coordinates: { lat: HYDERABAD_HUBS.financial.lat, lng: HYDERABAD_HUBS.financial.lng },
        },
        waypoints: [
          { name: 'Gachibowli Stadium Junction', coordinates: { lat: 17.4431, lng: 78.3496 } },
        ],
        departureAt: makeFutureDate(8), // Tomorrow morning
        totalSeats: 3,
        availableSeats: 3,
        costContribution: 80,
        vehicle: priya.vehicle,
        preferences: { ac: true, smokeFree: true, womenOnly: true },
        notes: 'Women commuters preferred. Clean car, on-time departure.',
        status: 'scheduled',
      },
      {
        driver: vikram._id,
        source: {
          name: HYDERABAD_HUBS.bits.name,
          address: 'BITS Pilani Hyderabad Main Gate',
          coordinates: { lat: HYDERABAD_HUBS.bits.lat, lng: HYDERABAD_HUBS.bits.lng },
        },
        destination: {
          name: HYDERABAD_HUBS.secunderabad.name,
          address: 'Secunderabad Railway Station Platform 1',
          coordinates: { lat: HYDERABAD_HUBS.secunderabad.lat, lng: HYDERABAD_HUBS.secunderabad.lng },
        },
        waypoints: [
          { name: 'ECIL Crossroads', coordinates: { lat: 17.4764, lng: 78.5714 } },
        ],
        departureAt: makeFutureDate(24), // Tomorrow afternoon
        totalSeats: 3,
        availableSeats: 3,
        costContribution: 90,
        vehicle: vikram.vehicle,
        preferences: { ac: true, smokeFree: true, womenOnly: false },
        notes: 'Zero emissions electric Nexon. Enough boot space for small backpacks.',
        status: 'scheduled',
      },
      {
        driver: arjun._id,
        source: {
          name: HYDERABAD_HUBS.iiit.name,
          address: 'IIIT Hyderabad Main Gate, Gachibowli',
          coordinates: { lat: HYDERABAD_HUBS.iiit.lat, lng: HYDERABAD_HUBS.iiit.lng },
        },
        destination: {
          name: HYDERABAD_HUBS.airport.name,
          address: 'Departures Terminal, RGIA Shamshabad',
          coordinates: { lat: HYDERABAD_HUBS.airport.lat, lng: HYDERABAD_HUBS.airport.lng },
        },
        waypoints: [
          { name: 'ORR Gachibowli Toll Plaza', coordinates: { lat: 17.4241, lng: 78.3392 } },
        ],
        departureAt: makeFutureDate(36), // Day after tomorrow
        totalSeats: 3,
        availableSeats: 3,
        costContribution: 180,
        vehicle: arjun.vehicle,
        preferences: { ac: true, smokeFree: true, womenOnly: false },
        notes: 'Direct via Outer Ring Road (ORR). Fast and comfortable.',
        status: 'scheduled',
      },
    ]);

    console.log('[RideSync Seed] Creating initial sample booking...');
    const booking = await Booking.create({
      ride: rides[0]._id,
      passenger: ananya._id,
      seatsRequested: 1,
      totalAmount: 120,
      pickupPoint: 'Miyapur Metro Station',
      dropPoint: HYDERABAD_HUBS.iith.name,
      status: 'confirmed',
      passengerNotes: 'Will be at Miyapur exit gate 2 at departure time.',
    });

    console.log('[RideSync Seed] Creating initial in-app notifications...');
    await Notification.create([
      {
        recipient: ananya._id,
        sender: arjun._id,
        type: 'booking_confirmed',
        title: 'Booking Confirmed!',
        message: `Arjun confirmed your seat for the ride to ${HYDERABAD_HUBS.iith.name}.`,
        relatedRide: rides[0]._id,
        relatedBooking: booking._id,
        read: false,
      },
      {
        recipient: arjun._id,
        sender: ananya._id,
        type: 'booking_request',
        title: 'Seat Reserved',
        message: `Ananya joined your ride to ${HYDERABAD_HUBS.iith.name}.`,
        relatedRide: rides[0]._id,
        relatedBooking: booking._id,
        read: true,
      },
    ]);

    console.log('[RideSync Seed] Database successfully populated!');
    console.log('--- TEST ACCOUNTS ---');
    console.log('Driver: arjun.sharma@iith.ac.in (Password: Password123!)');
    console.log('Passenger: ananya.d@osmania.ac.in (Password: Password123!)');
    console.log('Admin: admin@ridesync.in (Password: Password123!)');
  } catch (err) {
    console.error('[RideSync Seed] Error seeding database:', err);
  }
}

// If run directly: node server/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ridesync';
  mongoose.connect(uri).then(async () => {
    await seedDatabase(true);
    await mongoose.disconnect();
    process.exit(0);
  });
}
