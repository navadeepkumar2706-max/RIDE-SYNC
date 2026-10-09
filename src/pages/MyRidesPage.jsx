import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  PlusCircle, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Phone, 
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../lib/api';

export function MyRidesPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [expandedRideId, setExpandedRideId] = useState(null);

  const fetchMyRides = async () => {
    setLoading(true);
    try {
      const data = await api.rides.getPublished();
      setRides(data.rides || []);
      if (data.rides && data.rides.length > 0 && !expandedRideId) {
        setExpandedRideId(data.rides[0]._id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your published rides.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRides();
  }, []);

  // Accept or reject a passenger booking request
  const handleBookingStatus = async (bookingId, status) => {
    setActionLoading(bookingId);
    setFeedback(null);
    try {
      await api.bookings.updateStatus(bookingId, { status });
      setFeedback({
        type: 'success',
        text: `Request ${status === 'confirmed' ? 'accepted! Seats updated atomically.' : 'rejected.'}`,
      });
      await fetchMyRides();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.message || 'Operation failed. Check remaining seat capacity.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Cancel ride
  const handleCancelRide = async (rideId) => {
    if (!window.confirm('Are you sure you want to cancel this entire ride? All passengers will be notified.')) {
      return;
    }
    setActionLoading(rideId);
    try {
      await api.rides.cancel(rideId);
      setFeedback({ type: 'success', text: 'Ride has been successfully cancelled.' });
      await fetchMyRides();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to cancel ride.' });
    } finally {
      setActionLoading(null);
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
            <Car className="w-7 h-7 text-emerald-600" />
            <span>My Published Rides</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your offered routes, approve incoming passenger seat requests, and coordinate pickups.
          </p>
        </div>

        <Link
          to="/offer-ride"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish Another Ride</span>
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

      {rides.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200/90 text-center space-y-4">
          <Car className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No published rides yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't offered any carpool trips. Share your daily commute to save on fuel and build campus trust!
          </p>
          <Link
            to="/offer-ride"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Offer a Ride Now</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {rides.map((ride) => {
            const isCancelled = ride.status === 'cancelled';
            const departureDate = new Date(ride.departureAt);
            const bookings = ride.bookings || [];
            const isExpanded = expandedRideId === ride._id;

            return (
              <div
                key={ride._id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden"
              >
                {/* Ride Summary Top Bar */}
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 border-b border-slate-100">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-bold text-slate-700 flex items-center">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                        {departureDate.toLocaleDateString()} at {departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isCancelled ? (
                        <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          Cancelled
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          Active Trip
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-bold text-slate-900 space-y-0.5">
                      <p>🟢 {ride.source?.name}</p>
                      <p>🏁 {ride.destination?.name}</p>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center space-x-4 pt-1">
                      <span>Vehicle: {ride.vehicle?.model} ({ride.vehicle?.licensePlate})</span>
                      <span>Price: <strong>₹{ride.costContribution}</strong> / seat</span>
                    </div>
                  </div>

                  {/* Seat availability and Action */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-xs">
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Capacity:</span>
                      <span className="font-black text-slate-900 text-sm">
                        {ride.availableSeats} of {ride.totalSeats} seats open
                      </span>
                    </div>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelRide(ride._id)}
                        disabled={actionLoading === ride._id}
                        className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors"
                      >
                        Cancel Ride
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedRideId(isExpanded ? null : ride._id)}
                      className="p-2 text-slate-500 hover:text-slate-800 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Bookings Management Section */}
                {isExpanded && (
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                        <Users className="w-4 h-4 text-emerald-600" />
                        <span>Passenger Booking Requests ({bookings.length})</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Approving immediately locks capacity via MongoDB atomic update
                      </span>
                    </div>

                    {bookings.length === 0 ? (
                      <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 border border-slate-100">
                        No seat requests received yet for this trip.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bookings.map((booking) => {
                          const passenger = booking.passenger || {};
                          const isConfirmed = booking.status === 'confirmed';
                          const isPending = booking.status === 'pending';
                          const isRejected = booking.status === 'rejected';

                          return (
                            <div
                              key={booking._id}
                              className={`p-4 rounded-2xl border transition-all ${
                                isConfirmed
                                  ? 'bg-emerald-50/40 border-emerald-200'
                                  : isPending
                                  ? 'bg-amber-50/40 border-amber-200'
                                  : 'bg-slate-50 border-slate-200 opacity-60'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                                    {passenger.name ? passenger.name.charAt(0).toUpperCase() : 'P'}
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-slate-900 flex items-center">
                                      {passenger.name}
                                      {['verified', 'institution_verified', 'demo_verified'].includes(passenger.verificationStatus) && (
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-1" />
                                      )}
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                      {typeof passenger.institution === 'object' ? (passenger.institution?.name || 'Verified Commuter') : (passenger.institution || 'Verified Commuter')}
                                    </p>
                                  </div>
                                </div>

                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  isConfirmed
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : isPending
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {booking.status.toUpperCase()}
                                </span>
                              </div>

                              <div className="mt-3 text-xs space-y-1 bg-white/80 p-2.5 rounded-xl border border-slate-100">
                                <p className="font-semibold text-slate-700">
                                  Requested: {booking.seatsRequested} {booking.seatsRequested === 1 ? 'seat' : 'seats'}
                                </p>
                                {booking.pickupNote && (
                                  <p className="text-[11px] text-slate-500 italic">
                                    Note: "{booking.pickupNote}"
                                  </p>
                                )}
                                {isConfirmed && passenger.phone && (
                                  <p className="text-[11px] font-semibold text-emerald-700 pt-1 flex items-center">
                                    <Phone className="w-3 h-3 mr-1" />
                                    Contact: {passenger.phone}
                                  </p>
                                )}
                              </div>

                              {/* Pending Decision Buttons */}
                              {isPending && !isCancelled && (
                                <div className="mt-3 flex items-center justify-end space-x-2">
                                  <button
                                    disabled={actionLoading === booking._id}
                                    onClick={() => handleBookingStatus(booking._id, 'rejected')}
                                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200"
                                  >
                                    Reject
                                  </button>
                                  <button
                                    disabled={actionLoading === booking._id}
                                    onClick={() => handleBookingStatus(booking._id, 'confirmed')}
                                    className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs flex items-center space-x-1"
                                  >
                                    {actionLoading === booking._id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <>
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Accept Booking</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
