import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Users, 
  Car, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export function RideCard({ ride, onRequestSeat, showRequestButton = true }) {
  if (!ride) return null;

  const departureDate = new Date(ride.departureAt);
  const formattedDate = departureDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = departureDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const isFull = ride.availableSeats <= 0;
  const isCompleted = ride.status === 'completed';
  const isCancelled = ride.status === 'cancelled';

  // Driver details
  const driver = ride.driver || {};
  const isVerified = ['verified', 'institution_verified', 'demo_verified'].includes(driver.verificationStatus);
  const ratingValue = typeof driver.rating === 'object' && driver.rating !== null
    ? (driver.rating.average ?? 5.0)
    : (typeof driver.rating === 'number' ? driver.rating : 5.0);
  const institutionName = typeof driver.institution === 'object' && driver.institution !== null
    ? (driver.institution.name || 'Hyderabad Commuter')
    : (driver.institution || 'Hyderabad Commuter');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      
      {/* Top Banner: Date/Time + Match Score */}
      <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-slate-700 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>{formattedDate} • {formattedTime}</span>
        </div>

        {/* Match Score Badge (if smart match returned score) */}
        {ride.matchScore !== undefined && (
          <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>{ride.matchScore}% Match</span>
          </div>
        )}

        {/* Status Badge if not active */}
        {isCancelled && (
          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-xs font-bold">
            Cancelled
          </span>
        )}
        {isCompleted && (
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
            Completed
          </span>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-5 space-y-4 flex-1">
        
        {/* Route Details */}
        <div className="relative pl-6 space-y-3">
          {/* Vertical connecting line */}
          <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-slate-200"></div>

          {/* Pickup */}
          <div className="relative">
            <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white shadow-xs"></div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pickup</p>
            <p className="text-sm font-bold text-slate-900 line-clamp-1">{ride.source?.name}</p>
          </div>

          {/* Intermediate Waypoints (if any) */}
          {ride.waypoints && ride.waypoints.length > 0 && (
            <div className="relative text-xs text-slate-500 flex items-center space-x-1.5 py-0.5">
              <div className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-amber-500 border border-white"></div>
              <span className="text-[11px] font-medium bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200/50">
                Via: {ride.waypoints.map((w) => w.name).join(', ')}
              </span>
            </div>
          )}

          {/* Destination */}
          <div className="relative">
            <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-slate-900 border-2 border-white shadow-xs"></div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Destination</p>
            <p className="text-sm font-bold text-slate-900 line-clamp-1">{ride.destination?.name}</p>
          </div>
        </div>

        {/* Driver Profile & Vehicle Snippet */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-inner">
              {driver.name ? driver.name.charAt(0).toUpperCase() : 'D'}
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-bold text-slate-900">{driver.name || 'Verified Driver'}</span>
                {isVerified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verified Campus Driver" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {institutionName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-amber-50 text-amber-800 px-2 py-1 rounded-lg text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{ratingValue.toFixed(1)}</span>
          </div>
        </div>

        {/* Vehicle & Preference Pill */}
        <div className="bg-slate-50 rounded-xl p-2.5 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <Car className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-slate-800">
              {ride.vehicle?.model || 'Vehicle'} • {ride.vehicle?.color || ''}
            </span>
          </div>
          {ride.preferences?.ladiesOnly && (
            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold">
              Ladies Only
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer: Price, Seats Left & Action Button */}
      <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline space-x-1">
            <span className="text-lg font-black text-slate-900">₹{ride.costContribution}</span>
            <span className="text-xs text-slate-500">/ seat</span>
          </div>
          <div className="flex items-center space-x-1.5 mt-0.5">
            <Users className="w-3 h-3 text-slate-400" />
            <span className={`text-xs font-semibold ${ride.availableSeats <= 1 ? 'text-amber-600' : 'text-slate-600'}`}>
              {isFull ? (
                <span className="text-rose-600 font-bold">Full (0 seats)</span>
              ) : (
                `${ride.availableSeats} of ${ride.totalSeats} seats left`
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/rides/${ride._id}`}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors shadow-2xs"
          >
            Details
          </Link>

          {showRequestButton && !isFull && !isCancelled && !isCompleted && (
            <button
              onClick={() => onRequestSeat(ride)}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all hover:shadow"
            >
              Request Seat
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
