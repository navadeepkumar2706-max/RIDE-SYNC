import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Search, 
  PlusCircle, 
  Calendar, 
  Users, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Bell, 
  AlertCircle,
  Loader2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../lib/api';

export function DashboardPage() {
  const { user } = useAuth();
  const { notifications } = useNotifications();

  const [publishedRides, setPublishedRides] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState(null);

  // Load user data
  const loadDashboardData = async () => {
    try {
      const [ridesRes, bookingsRes] = await Promise.all([
        api.rides.getPublished().catch(() => ({ rides: [] })),
        api.bookings.getMyBookings().catch(() => ({ bookings: [] })),
      ]);
      setPublishedRides(ridesRes.rides || []);
      setMyBookings(bookingsRes.bookings || []);
    } catch (err) {
      console.warn('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Collect incoming pending requests from published rides
  const incomingRequests = [];
  publishedRides.forEach((ride) => {
    if (ride.bookings && ride.bookings.length > 0) {
      ride.bookings.forEach((b) => {
        if (b.status === 'pending') {
          incomingRequests.push({ ...b, rideTitle: `${ride.source?.name} → ${ride.destination?.name}`, rideId: ride._id });
        }
      });
    }
  });

  // Handle Driver Approving or Rejecting a booking directly from dashboard
  const handleBookingAction = async (bookingId, newStatus) => {
    setActionLoading(bookingId);
    setMessage(null);
    try {
      await api.bookings.updateStatus(bookingId, { status: newStatus });
      setMessage({
        type: 'success',
        text: `Booking request ${newStatus === 'confirmed' ? 'approved & seats atomically reserved!' : 'declined.'}`,
      });
      await loadDashboardData();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message || 'Action failed. Seat capacity may have changed.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const activeRides = publishedRides.filter((r) => r.status === 'scheduled' || r.status === 'active');
  const confirmedBookings = myBookings.filter((b) => b.status === 'confirmed');
  const pendingBookings = myBookings.filter((b) => b.status === 'pending');

  // Estimate commuter metrics
  const totalTripsShared = confirmedBookings.length + publishedRides.length;
  const estimatedSavings = (totalTripsShared * 120); // approx ₹120 saved per shared commute
  const estimatedCO2 = (totalTripsShared * 3.8).toFixed(1); // approx 3.8 kg CO2 offset per ride

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. WELCOME BANNER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            {['verified', 'institution_verified', 'demo_verified'].includes(user?.verificationStatus) && (
              <span className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Verified Campus Commuter
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            {typeof user?.institution === 'object' ? (user?.institution?.name || 'Hyderabad Campus Network') : (user?.institution || 'Hyderabad Campus Network')} • {user?.email}
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/offer-ride"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish New Ride</span>
          </Link>
          <Link
            to="/find-rides"
            className="px-4 py-2.5 bg-slate-700/80 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-600 transition-all flex items-center space-x-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Search Rides</span>
          </Link>
        </div>
      </div>

      {/* Action Notification Message */}
      {message && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="font-bold text-slate-500 hover:text-slate-900 ml-4">✕</button>
        </div>
      )}

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Published Rides</span>
            <Car className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{activeRides.length}</p>
          <p className="text-[11px] text-slate-500">Active upcoming trips</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Confirmed Bookings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{confirmedBookings.length}</p>
          <p className="text-[11px] text-slate-500">Reserved passenger seats</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Pending Requests</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{incomingRequests.length + pendingBookings.length}</p>
          <p className="text-[11px] text-slate-500">Awaiting response</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Est. Fuel Savings</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600">₹{estimatedSavings}</p>
          <p className="text-[11px] text-slate-500">~{estimatedCO2} kg CO₂ saved</p>
        </div>
      </div>

      {/* 3. INCOMING BOOKING REQUESTS (FOR DRIVERS) */}
      {incomingRequests.length > 0 && (
        <div className="bg-amber-50/50 rounded-3xl border border-amber-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></span>
              <h2 className="text-base font-bold text-amber-950">
                Action Required: {incomingRequests.length} Pending Booking {incomingRequests.length === 1 ? 'Request' : 'Requests'}
              </h2>
            </div>
            <span className="text-xs text-amber-800 font-medium">Review to reserve seats atomically</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incomingRequests.map((req) => (
              <div key={req._id} className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                      {req.passenger?.name ? req.passenger.name.charAt(0).toUpperCase() : 'P'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{req.passenger?.name}</p>
                      <p className="text-[11px] text-slate-500">{typeof req.passenger?.institution === 'object' ? (req.passenger?.institution?.name || 'Student') : (req.passenger?.institution || 'Student')}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {req.seatsRequested} {req.seatsRequested === 1 ? 'seat' : 'seats'}
                  </span>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="font-semibold text-slate-800 truncate">{req.rideTitle}</p>
                  {req.pickupNote && (
                    <p className="text-[11px] text-slate-500 mt-1 italic">
                      Note: "{req.pickupNote}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-2 pt-1">
                  <button
                    disabled={actionLoading === req._id}
                    onClick={() => handleBookingAction(req._id, 'rejected')}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
                  >
                    Decline
                  </button>
                  <button
                    disabled={actionLoading === req._id}
                    onClick={() => handleBookingAction(req._id, 'confirmed')}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors flex items-center space-x-1"
                  >
                    {actionLoading === req._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Request</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MAIN SPLIT: MY RIDES & MY BOOKINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: My Published Rides */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Car className="w-5 h-5 text-emerald-600" />
              <span>Rides You Are Offering</span>
            </h2>
            <Link to="/my-rides" className="text-xs font-semibold text-emerald-600 hover:underline">
              View all ({publishedRides.length}) →
            </Link>
          </div>

          {activeRides.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 text-center space-y-3">
              <Car className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">No active rides published right now</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Have empty car seats on your campus route? Share fuel expenses and earn verified commuter ratings.
              </p>
              <Link
                to="/offer-ride"
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publish a Ride Now</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeRides.slice(0, 3).map((ride) => (
                <div key={ride._id} className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center">
                      <Clock className="w-3 h-3 text-emerald-600 mr-1" />
                      {new Date(ride.departureAt).toLocaleDateString()} at {new Date(ride.departureAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      {ride.availableSeats} of {ride.totalSeats} seats left
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 space-y-1">
                    <p className="truncate">🟢 {ride.source?.name}</p>
                    <p className="truncate">🏁 {ride.destination?.name}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">₹{ride.costContribution} / seat</span>
                    <Link
                      to={`/rides/${ride._id}`}
                      className="text-xs font-semibold text-emerald-600 hover:underline flex items-center space-x-1"
                    >
                      <span>Manage trip</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: My Bookings (Passenger) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>Your Passenger Bookings</span>
            </h2>
            <Link to="/my-bookings" className="text-xs font-semibold text-emerald-600 hover:underline">
              View all ({myBookings.length}) →
            </Link>
          </div>

          {myBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 text-center space-y-3">
              <Search className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">No active bookings yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Need a ride to IIT Hyderabad, BITS Pilani, or HITEC City? Find high-compatibility rides on your route.
              </p>
              <Link
                to="/find-rides"
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Commutes</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myBookings.slice(0, 3).map((booking) => {
                const ride = booking.ride || {};
                return (
                  <div key={booking._id} className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">
                        {ride.departureAt ? new Date(ride.departureAt).toLocaleDateString() : 'Upcoming'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        booking.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : booking.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900 space-y-1">
                      <p className="truncate">🟢 {ride.source?.name}</p>
                      <p className="truncate">🏁 {ride.destination?.name}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">{booking.seatsRequested} seats reserved</span>
                      <Link
                        to="/my-bookings"
                        className="text-xs font-semibold text-emerald-600 hover:underline"
                      >
                        View ticket & contacts →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
