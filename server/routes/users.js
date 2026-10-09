import express from 'express';
import { User } from '../models/User.js';
import { requireAuth } from '../middlewares/auth.js';

export const usersRouter = express.Router();

// GET /api/users/me
usersRouter.get('/me', requireAuth, (req, res) => {
  return res.json({ user: req.user.toSafeObject() });
});

// PATCH /api/users/me
usersRouter.patch('/me', requireAuth, async (req, res) => {
  try {
    const allowedUpdates = [
      'name',
      'phone',
      'institution',
      'bio',
      'vehicle',
      'emergencyContact',
      'preferences',
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (req.body.profile?.bio !== undefined && updates.bio === undefined) {
      updates.bio = req.body.profile.bio;
    }

    if (updates.vehicle) {
      const plate = updates.vehicle.licensePlate || updates.vehicle.plateNumber || '';
      updates.vehicle.licensePlate = plate;
      updates.vehicle.plateNumber = plate;
    }

    if (updates.emergencyContact) {
      const rel = updates.emergencyContact.relationship || updates.emergencyContact.relation || '';
      updates.emergencyContact.relationship = rel;
      updates.emergencyContact.relation = rel;
    }

    if (updates.institution) {
      if (typeof updates.institution === 'string') {
        updates.institution = { name: updates.institution, type: 'college' };
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true });
    return res.json({
      message: 'Profile updated successfully.',
      user: updatedUser.toSafeObject(),
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Failed to update profile.' });
  }
});
