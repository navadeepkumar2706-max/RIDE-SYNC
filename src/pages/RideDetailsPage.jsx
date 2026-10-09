import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  ShieldCheck, 
  Star, 
  Phone, 
  Mail, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  Sparkles,
  Flag,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { RouteMap } from '../components/map/RouteMap';
import { SeatRequestModal } from '../components/rides/SeatRequestModal';

export function RideDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const fetchRide = async () => {
    setLoading(true);
    try {
      const data = await api.rides.get(id);
      setRide(data.ride);
    } catch (err) {
      setError(err.message || 'Ride not found or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRide();
  }, [id]);

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportReason) return;
    try {
      await api.reports.create({
        reportedUser: ride.driver?._id,
        relatedRide: ride._id,
        reason: reportReason,
      });
      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
        setReportReason('');
      }, 2000);
    } catch (err) {
      alert(err.message || 'Failed to submit report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Ride Unavailable</h2>
        <p className="text-xs text-slate-500">{error || 'This ride could not be loaded.'}</p>
        <Link
          to="/find-rides"
          className="inline-flex items-center space-x-1 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to All Rides</span>
        </Link>
      </div>
    );
  }

  const driver = ride.driver || {};
  const isDriver = user?._id === driver._id;
  const isFull = ride.availableSeats <= 0;

  const departureDate = new Date(ride.departureAt);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center space-x-1 text-xs text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report Ride</span>
          </button>
        </div>
      </div>

      {/* Main Split: Itinerary & Map on Left, Booking & Driver on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Route & Leaflet Map */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Hyderabad Campus Corridor
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
                  {ride.source?.name} → {ride.destination?.name}
                </h1>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">₹{ride.costContribution}</span>
                <span className="text-xs text-slate-500 block">per passenger</span>
              </div>
            </div>

            {/* Timeline Route View */}
            <div className="relative pl-6 space-y-4">
              <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-slate-200"></div>

              {/* Origin */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-xs"></div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pickup Point</p>
                <p className="text-sm font-bold text-slate-900">{ride.source?.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Departure: {departureDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })} at{' '}
                  <strong className="text-slate-900">{departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                </p>
              </div>

              {/* Intermediate Stops */}
              {ride.waypoints && ride.waypoints.map((w, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white"></div>
                  <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Stop #{idx + 1}</p>
                  <p className="text-xs font-bold text-slate-800">{w.name}</p>
                </div>
              ))}

              {/* Destination */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-white shadow-xs"></div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Final Destination</p>
                <p className="text-sm font-bold text-slate-900">{ride.destination?.name}</p>
              </div>
            </div>

            {/* Ride Notes & Guidelines */}
            {ride.notes && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">Driver Notes & Instructions:</p>
                <p className="text-slate-600">{ride.notes}</p>
              </div>
            )}
          </div>

          {/* Interactive Route Map */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Interactive Leaflet Route Geometry</span>
              <span className="text-[11px] font-semibold text-emerald-600">OpenStreetMap</span>
            </h3>

            <RouteMap
              sourceCoords={ride.source?.coordinates}
              destCoords={ride.destination?.coordinates}
              waypoints={ride.waypoints || []}
              sourceName={ride.source?.name}
              destName={ride.destination?.name}
              height="400px"
            />
          </div>

        </div>

        {/* Right Column (5 cols): Driver Profile & Seat Booking Card */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          
          {/* Booking Action Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Reserve Your Seat
            </h3>

            {/* Seat Availability Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Available Seats:</span>
                <span className={isFull ? 'text-rose-600 font-bold' : 'text-emerald-700'}>
                  {isFull ? 'Full (0 available)' : `${ride.availableSeats} of ${ride.totalSeats} seats open`}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                {[...Array(ride.totalSeats)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-full border-r border-white ${
                      i < (ride.totalSeats - ride.availableSeats)
                        ? 'bg-slate-300'
                        : 'bg-emerald-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Pricing breakdown */}
            <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/70 text-xs space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Fuel Cost Contribution:</span>
                <span className="text-emerald-800">₹{ride.costContribution} / seat</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Non-commercial shared fuel expense. Settle with driver directly upon boarding.
              </p>
            </div>

            {/* Action Buttons */}
            {isDriver ? (
              <div className="p-3 bg-slate-100 rounded-xl text-center text-xs font-bold text-slate-700">
                You are the driver of this ride. Manage requests in your Dashboard.
              </div>
            ) : isFull ? (
              <button
                disabled
                className="w-full py-3 bg-slate-200 text-slate-500 font-bold text-xs rounded-xl cursor-not-allowed"
              >
                Ride Fully Booked
              </button>
            ) : (
              <button
                onClick={() => setShowRequestModal(true)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/25 hover:shadow-lg transition-all"
              >
                Request a Seat Now
              </button>
            )}

            <p className="text-[11px] text-center text-slate-400">
              ⚡ Atomic seat allocation guarantees zero double-booking
            </p>
          </div>

          {/* Driver Profile Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Driver Details
            </h3>

            {(() => {
              const isVerified = ['verified', 'institution_verified', 'demo_verified'].includes(driver.verificationStatus);
              const ratingVal = typeof driver.rating === 'object' && driver.rating !== null
                ? (driver.rating.average ?? 5.0)
                : (typeof driver.rating === 'number' ? driver.rating : 5.0);
              const institutionName = typeof driver.institution === 'object' && driver.institution !== null
                ? (driver.institution.name || 'Hyderabad Campus Network')
                : (driver.institution || 'Hyderabad Campus Network');

              return (
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-bold text-base flex items-center justify-center shadow-md">
                    {driver.name ? driver.name.charAt(0).toUpperCase() : 'D'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm flex items-center">
                      {driver.name}
                      {isVerified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 ml-1.5 shrink-0" title="Verified Campus Driver" />
                      )}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {institutionName}
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-amber-700 font-bold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{ratingVal.toFixed(1)} Driver Rating</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Vehicle info */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/70 text-xs space-y-1">
              <p className="font-semibold text-slate-800 flex items-center">
                <Car className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                {ride.vehicle?.model} ({ride.vehicle?.color})
              </p>
              <p className="text-slate-500 font-mono text-[11px]">
                Registration: {ride.vehicle?.licensePlate || ride.vehicle?.plateNumber || 'Verified with RideSync'}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Seat Request Modal */}
      {showRequestModal && (
        <SeatRequestModal
          ride={ride}
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => fetchRide()}
        />
      )}

      {/* Safety Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Report Ride or Driver</h3>
            <p className="text-xs text-slate-500">
              Our safety and moderation team reviews every report. Please describe the issue.
            </p>

            {reportSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold text-center">
                Report submitted successfully. Thank you for keeping RideSync safe.
              </div>
            ) : (
              <form onSubmit={handleReport} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your concern (e.g. wrong route, suspicious behavior, inappropriate pricing)..."
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-3 py-2 text-xs text-slate-600 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
