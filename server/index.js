import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed.js';

import { authRouter } from './routes/auth.js';
import { usersRouter } from './routes/users.js';
import { ridesRouter } from './routes/rides.js';
import { bookingsRouter } from './routes/bookings.js';
import { notificationsRouter } from './routes/notifications.js';
import { reviewsRouter } from './routes/reviews.js';
import { reportsRouter } from './routes/reports.js';
import { adminRouter } from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'RideSync API Server',
    city: 'Hyderabad, India',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/rides', ridesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api', bookingsRouter); // Allow /api/rides/:id/bookings syntax
app.use('/api/notifications', notificationsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/admin', adminRouter);

// Hackathon Demo: Reset & Reseed Endpoint
app.post('/api/seed', async (req, res) => {
  try {
    await seedDatabase(true);
    res.json({ message: 'Database reseeded successfully with Hyderabad campus commuter data.' });
  } catch (err) {
    res.status(500).json({ message: 'Seed failed', error: err.message });
  }
});

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error('[RideSync API Error]', err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal server error occurred.',
  });
});

// Start Server
async function start() {
  try {
    await connectDB();
    await seedDatabase(false);

    app.listen(PORT, () => {
      console.log(`[RideSync API] Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
