import express from 'express';
import { Notification } from '../models/Notification.js';
import { requireAuth } from '../middlewares/auth.js';

export const notificationsRouter = express.Router();

// GET /api/notifications
notificationsRouter.get('/', requireAuth, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    return res.json({ notifications, unreadCount });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
});

// PATCH /api/notifications/:id/read
notificationsRouter.patch('/:id/read', requireAuth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { $set: { read: true } },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    return res.json({ notification });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update notification.' });
  }
});

// PATCH /api/notifications/read-all
notificationsRouter.patch('/read-all', requireAuth, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );
    return res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to mark all as read.' });
  }
});
