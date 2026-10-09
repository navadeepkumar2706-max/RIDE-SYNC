import express from 'express';
import { User } from '../models/User.js';
import { Ride } from '../models/Ride.js';
import { Booking } from '../models/Booking.js';
import { Report } from '../models/Report.js';
import { requireAuth } from '../middlewares/auth.js';
import { requireAdmin } from '../middlewares/admin.js';

export const adminRouter = express.Router();

adminRouter.use(requireAuth);
adminRouter.use(requireAdmin);

// GET /api/admin/stats
adminRouter.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({
      verificationStatus: { $in: ['institution_verified', 'demo_verified'] },
    });
    const totalRides = await Ride.countDocuments();
    const scheduledRides = await Ride.countDocuments({ status: 'scheduled' });
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    // Calculate estimated CO2 saved (average 2.4kg CO2 saved per passenger carpool in Hyderabad)
    const estimatedCo2SavedKg = Math.round(confirmedBookings * 2.4 * 18); // ~18km avg trip

    return res.json({
      totalUsers,
      verifiedUsers,
      totalRides,
      scheduledRides,
      activeRides: scheduledRides,
      totalBookings,
      confirmedBookings,
      pendingReports,
      estimatedCo2SavedKg,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ message: 'Failed to fetch admin stats.' });
  }
});

// GET /api/admin/users
adminRouter.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 }).limit(100);
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load users.' });
  }
});

// PATCH /api/admin/users/:id/status
adminRouter.patch('/users/:id/status', async (req, res) => {
  try {
    let { verificationStatus, role } = req.body;
    const updates = {};
    if (verificationStatus) {
      if (verificationStatus === 'verified') verificationStatus = 'institution_verified';
      updates.verificationStatus = verificationStatus;
    }
    if (role) updates.role = role;

    const updated = await User.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).select('-passwordHash');
    return res.json({ message: 'User updated.', user: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update user.' });
  }
});

// GET /api/admin/reports
adminRouter.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name email')
      .populate('reportedUser', 'name email')
      .populate('relatedRide')
      .sort({ createdAt: -1 });
    return res.json({ reports });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load reports.' });
  }
});

// PATCH /api/admin/reports/:id/status
adminRouter.patch('/reports/:id/status', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { $set: { status, adminNotes } },
      { new: true }
    );
    return res.json({ message: 'Report updated.', report });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update report.' });
  }
});
