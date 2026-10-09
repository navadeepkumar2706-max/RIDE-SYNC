import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Car, 
  Clock, 
  MapPin, 
  Users, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Star,
  Search,
  ArrowRight
} from 'lucide-react';
import { api } from '../lib/api';

export function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // Review modal state
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.bookings.getMyBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Cancel booking (atomic seat restoration)
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This will restore the seat to the ride inventory.')) {
      return;
    }

    setCancellingId(bookingId);
    setFeedback(null);
    try {
      await api.bookings.cancel(bookingId);
      setFeedback({ type: 'success', text: 'Booking cancelled. Seat inventory restored successfully.' });
      await fetchBookings();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to cancel booking.' });
    } finally {
      setCancellingId(null);
    }
  };

  // Submit Driver Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewBooking) return;
    setReviewSubmitting(true);
    try {
      await api.reviews.create({
        ride: reviewBooking.ride?._id,
        reviewee: reviewBooking.ride?.driver?._id,
        rating: Number(reviewRating),
        comment: reviewComment,
      });
      setFeedback({ type: 'success', text: 'Review submitted successfully! Thank you for rating your driver.' });
      setReviewBooking(null);
      setReviewComment('');
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Calendar className="w-7 h-7 text-emerald-600" />
            <span>My Bookings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your reserved seats, connect with verified drivers, and manage commute tickets.
          </p>
        </div>

        <Link
          to="/find-rides"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Search className="w-4 h-4" />
          <span>Find More Rides</span>
        </Link>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="font-bold text-slate-500 hover:text-slate-900 ml-4">✕</button>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200/90 text-center space-y-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No active bookings yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't requested any rides yet. Search compatible routes to travel with verified campus peers!
          </p>
          <Link
            to="/find-rides"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find a Ride Now</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => {
            const ride = booking.ride || {};
            const driver = ride.driver || {};
            const isConfirmed = booking.status === 'confirmed';
            const isPending = booking.status === 'pending';
            const isCancelled = booking.status === 'cancelled';
            const isRejected = booking.status === 'rejected';

            const departureDate = ride.departureAt ? new Date(ride.departureAt) : new Date();

            return (
              <div
                key={booking._id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  
                  {/* Status Banner */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 flex items-center">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                      {departureDate.toLocaleDateString()} at {departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isConfirmed
                        ? 'bg-emerald-100 text-emerald-800'
                        : isPending
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : isRejected
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="relative pl-5 space-y-2 text-xs">
                    <div className="absolute left-2 top-1.5 bottom-1.5 w-0.5 bg-slate-200"></div>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                      <p className="font-bold text-slate-900">{ride.source?.name}</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-slate-900"></div>
                      <p className="font-bold text-slate-900">{ride.destination?.name}</p>
                    </div>
                  </div>

                  {/* Driver Profile */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                        {driver.name ? driver.name.charAt(0).toUpperCase() : 'D'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 flex items-center">
                          {driver.name}
                          {['verified', 'institution_verified', 'demo_verified'].includes(driver.verificationStatus) && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-1" />
                          )}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {typeof driver.institution === 'object' ? (driver.institution?.name || 'Verified Commuter') : (driver.institution || 'Verified Commuter')}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900">₹{booking.seatsRequested * (ride.costContribution || 0)}</span>
                      <span className="text-[10px] text-slate-500 block">{booking.seatsRequested} {booking.seatsRequested === 1 ? 'seat' : 'seats'}</span>
                    </div>
                  </div>

                  {/* If Confirmed: Driver Contact & Pickup Instructions */}
                  {isConfirmed && (
                    <div className="bg-emerald-50/70 rounded-2xl p-3 border border-emerald-200/70 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-emerald-950">
                        <span className="flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                          Booking Confirmed!
                        </span>
                        <span className="text-[11px] text-emerald-700">Vehicle: {ride.vehicle?.model} ({ride.vehicle?.color})</span>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        Plate: <strong className="font-mono">{ride.vehicle?.licensePlate || ride.vehicle?.plateNumber || 'Registered'}</strong>
                      </p>
                      {driver.phone && (
                        <p className="text-[11px] text-emerald-900 font-semibold flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          Driver Contact: {driver.phone}
                        </p>
                      )}
                    </div>
                  )}

                  {/* If Pending */}
                  {isPending && (
                    <div className="bg-amber-50/70 rounded-2xl p-3 border border-amber-200/70 text-xs text-amber-900 space-y-1">
                      <p className="font-semibold">Waiting for Driver Approval</p>
                      <p className="text-[11px] text-amber-800">
                        The driver has been notified of your request for {booking.seatsRequested} {booking.seatsRequested === 1 ? 'seat' : 'seats'}.
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/rides/${ride._id}`}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    View Ride Map →
                  </Link>

                  <div className="flex items-center space-x-2">
                    {/* Rate Driver button */}
                    {isConfirmed && (
                      <button
                        onClick={() => setReviewBooking(booking)}
                        className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors flex items-center space-x-1"
                      >
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>Rate Driver</span>
                      </button>
                    )}

                    {/* Cancel button */}
                    {(isConfirmed || isPending) && (
                      <button
                        disabled={cancellingId === booking._id}
                        onClick={() => handleCancelBooking(booking._id)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors"
                      >
                        {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Driver Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Rate Driver: {reviewBooking.ride?.driver?.name}</h3>
            <p className="text-xs text-slate-500">
              Share your commute experience to help maintain trust in the RideSync community.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">{reviewRating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Feedback Comment</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Great music, punctual pickup, very safe driving!"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewBooking(null)}
                  className="px-3 py-2 text-xs text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
