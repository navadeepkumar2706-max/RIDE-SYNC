import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.js';

export const authRouter = express.Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function generateToken(userId) {
  const secret = process.env.JWT_SECRET || 'ridesync_hyderabad_smart_carpooling_jwt_secret_key_2026';
  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
}

// POST /api/auth/register
authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password, institution, phone, vehicle, role, isDriver } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // Determine verification status:
    // If university domain (.ac.in, .edu), mark as institution_verified
    const isInstitutional =
      email.endsWith('.ac.in') ||
      email.endsWith('.edu') ||
      email.includes('@iith.') ||
      email.includes('@iiit.') ||
      email.includes('@pilani.bits-pilani.ac.in');

    const verificationStatus = isInstitutional ? 'institution_verified' : 'unverified';

    const passwordHash = await User.hashPassword(password);

    const instName = typeof institution === 'object' && institution !== null
      ? (institution.name?.trim() || (isInstitutional ? 'Campus Student' : 'General Commuter'))
      : (institution && typeof institution === 'string' ? institution.trim() : (isInstitutional ? 'Campus Student' : 'General Commuter'));
    const instType = typeof institution === 'object' && institution?.type ? institution.type : 'college';

    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      institution: { name: instName, type: instType },
      phone: phone ? phone.trim() : '',
      verificationStatus,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    };

    if (role) userData.role = role;
    if (isDriver !== undefined) userData.isDriver = isDriver;
    if (vehicle) {
      userData.vehicle = {
        make: vehicle.make || '',
        model: vehicle.model || '',
        color: vehicle.color || '',
        plateNumber: vehicle.licensePlate || vehicle.plateNumber || '',
        licensePlate: vehicle.licensePlate || vehicle.plateNumber || '',
        capacity: vehicle.capacity || 4,
      };
    }

    const user = await User.create(userData);

    const token = generateToken(user._id);
    res.cookie('token', token, COOKIE_OPTIONS);

    return res.status(201).json({
      message: 'Account created successfully.',
      user: user.toSafeObject(),
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Failed to create account. Please try again.' });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isValid = await user.isValidPassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);
    res.cookie('token', token, COOKIE_OPTIONS);

    return res.json({
      message: 'Logged in successfully.',
      user: user.toSafeObject(),
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  return res.json({ message: 'Logged out successfully.' });
});

// GET /api/auth/me
authRouter.get('/me', optionalAuth, (req, res) => {
  if (!req.user) {
    return res.json({ user: null });
  }
  return res.json({ user: req.user.toSafeObject() });
});
