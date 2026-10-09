import express from 'express';
import { Report } from '../models/Report.js';
import { requireAuth } from '../middlewares/auth.js';

export const reportsRouter = express.Router();

// POST /api/reports
reportsRouter.post('/', requireAuth, async (req, res) => {
  try {
    const targetUserId = req.body.reportedUserId || req.body.reportedUser || null;
    const targetRideId = req.body.rideId || req.body.relatedRide || null;
    const { reason } = req.body;

    if (!reason || reason.trim().length < 5) {
      return res.status(400).json({ message: 'A detailed reason is required.' });
    }

    const report = await Report.create({
      reporter: req.user._id,
      reportedUser: targetUserId,
      relatedRide: targetRideId,
      reason: reason.trim(),
      status: 'pending',
    });

    return res.status(201).json({
      message: 'Report submitted. Our trust & safety team will review it.',
      report,
    });
  } catch (error) {
    console.error('Error submitting report:', error);
    return res.status(500).json({ message: 'Failed to submit report.' });
  }
});
