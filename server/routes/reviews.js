import express from 'express';
import { Review } from '../models/Review.js';
import { User } from '../models/User.js';
import { Ride } from '../models/Ride.js';
import { requireAuth } from '../middlewares/auth.js';

export const reviewsRouter = express.Router();

// POST /api/reviews
reviewsRouter.post('/', requireAuth, async (req, res) => {
  try {
    const targetRideId = req.body.rideId || req.body.ride;
    const targetRevieweeId = req.body.revieweeId || req.body.reviewee;
    const { rating, comment } = req.body;

    if (!targetRideId || !targetRevieweeId || !rating) {
      return res.status(400).json({ message: 'Ride ID, reviewee ID, and rating (1-5) are required.' });
    }

    const parsedRating = parseInt(rating, 10);
    if (parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5 stars.' });
    }

    if (targetRevieweeId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot review yourself.' });
    }

    const review = await Review.create({
      ride: targetRideId,
      reviewer: req.user._id,
      reviewee: targetRevieweeId,
      rating: parsedRating,
      comment: comment || '',
    });

    // Update target user's average rating
    const allReviews = await Review.find({ reviewee: revieweeId });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await User.findByIdAndUpdate(revieweeId, {
      'rating.average': parseFloat(avg.toFixed(1)),
      'rating.count': allReviews.length,
    });

    return res.status(201).json({ message: 'Review submitted successfully.', review });
  } catch (error) {
    console.error('Error creating review:', error);
    return res.status(500).json({ message: 'Failed to submit review.' });
  }
});
