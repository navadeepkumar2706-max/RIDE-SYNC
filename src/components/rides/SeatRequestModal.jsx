import React, { useState } from 'react';
import { 
  X, 
  Car, 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  ArrowRight
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export function SeatRequestModal({ ride, isOpen, onClose, onSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [seatsRequested, setSeatsRequested] = useState(1);
  const [pickupNote, setPickupNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !ride) return null;

  const totalCost = seatsRequested * (ride.costContribution || 0);
  const maxSeats = Math.max(1, ride.availableSeats || 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (ride.driver?._id === user?._id || ride.driver === user?._id) {
      setError('You cannot request a booking on your own published ride.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.bookings.request(ride._id, {
        seatsRequested,
        pickupNote,
      });

      setSuccess(true);
      if (onSuccess) onSuccess(res.booking);

      // Auto close after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit booking request. The seats may no longer be available.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Request Ride Seat</h3>
              <p className="text-xs text-slate-500">Atomic reservation workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg">Booking Request Sent!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Driver <span className="font-semibold text-slate-900">{ride.driver?.name}</span> has been notified. You can track this trip in your Bookings tab.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Route Summary */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-700">Driver: {ride.driver?.name}</span>
                  <span className="flex items-center text-emerald-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    {(typeof ride.driver?.institution === 'object' ? ride.driver?.institution?.name : ride.driver?.institution) || 'Verified Campus Commuter'}
                  </span>
                </div>

                <div className="text-xs space-y-1 pt-1">
                  <div className="flex items-center text-slate-900 font-semibold truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mr-2 shrink-0"></span>
                    <span className="truncate">{ride.source?.name}</span>
                  </div>
                  <div className="flex items-center text-slate-900 font-semibold truncate">
                    <span className="w-2 h-2 rounded-full bg-slate-900 mr-2 shrink-0"></span>
                    <span className="truncate">{ride.destination?.name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Departure: {new Date(ride.departureAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>Vehicle: {ride.vehicle?.model} ({ride.vehicle?.color})</span>
                </div>
              </div>

              {/* Number of Seats Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Number of Seats (Max: {maxSeats})
                </label>
                <div className="flex items-center space-x-3">
                  {[...Array(maxSeats)].map((_, i) => {
                    const num = i + 1;
                    return (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setSeatsRequested(num)}
                        className={`flex-1 py-2.5 rounded-xl border font-bold text-sm transition-all ${
                          seatsRequested === num
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {num} {num === 1 ? 'Seat' : 'Seats'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cost Calculation */}
              <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/60 text-xs">
                <div>
                  <span className="text-slate-600 block">Estimated Cost Contribution:</span>
                  <span className="text-[11px] text-slate-500">₹{ride.costContribution} × {seatsRequested} {seatsRequested === 1 ? 'passenger' : 'passengers'}</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-emerald-800">₹{totalCost}</span>
                  <span className="text-[10px] text-emerald-600 block">Fuel share (non-commercial)</span>
                </div>
              </div>

              {/* Pickup Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pickup Landmark Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Waiting near Main Gate 2 / Metro Pillar 114"
                  value={pickupNote}
                  onChange={(e) => setPickupNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Trust & Safety Notice */}
              <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Seats are only locked once the driver confirms. In case of multiple simultaneous requests, atomic validation guarantees no overbooking.
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm hover:shadow transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
