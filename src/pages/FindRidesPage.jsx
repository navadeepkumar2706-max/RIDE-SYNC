import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Filter, 
  Sparkles, 
  Car, 
  Loader2, 
  AlertCircle,
  SlidersHorizontal,
  Map as MapIcon,
  ListFilter
} from 'lucide-react';
import { api } from '../lib/api';
import { RideCard } from '../components/rides/RideCard';
import { SeatRequestModal } from '../components/rides/SeatRequestModal';
import { RouteMap } from '../components/map/RouteMap';

const HYDERABAD_HUBS = [
  'IIT Hyderabad',
  'BITS Pilani Hyderabad',
  'IIIT Hyderabad',
  'HITEC City',
  'Financial District',
  'Secunderabad',
  'Osmania University',
];

export function FindRidesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search filter states initialized from URL params
  const [origin, setOrigin] = useState(searchParams.get('origin') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [date, setDate] = useState(searchParams.get('date') || '');
  const [seats, setSeats] = useState(Number(searchParams.get('seats')) || 1);
  const [timeFlexibility, setTimeFlexibility] = useState(searchParams.get('timeFlexibility') || '120');

  // Results & UI states
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRide, setSelectedRide] = useState(null);
  const [requestModalRide, setRequestModalRide] = useState(null);
  const [viewMode, setViewMode] = useState('both'); // 'both', 'cards', 'map'

  // Fetch matching rides
  const fetchRides = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        origin,
        destination,
        date,
        seats,
        timeFlexibility,
      };
      const res = await api.rides.list(params);
      const fetchedRides = res.rides || [];
      setRides(fetchedRides);
      if (fetchedRides.length > 0 && !selectedRide) {
        setSelectedRide(fetchedRides[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to search rides. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (origin) query.set('origin', origin);
    if (destination) query.set('destination', destination);
    if (date) query.set('date', date);
    if (seats) query.set('seats', seats);
    if (timeFlexibility) query.set('timeFlexibility', timeFlexibility);
    setSearchParams(query);
  };

  const handleResetFilters = () => {
    setOrigin('');
    setDestination('');
    setDate('');
    setSeats(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Search Header & Filter Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <Search className="w-5 h-5 text-emerald-600" />
              <span>Find Campus & Tech Commute Rides</span>
            </h1>
            <p className="text-xs text-slate-500">
              Deterministic smart matching ranks available trips by pickup proximity (40%), time (35%), and route (25%)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'map' ? 'both' : 'map')}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                viewMode === 'map' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Map View</span>
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'cards' ? 'both' : 'cards')}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                viewMode === 'cards' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span className="hidden sm:inline">List View</span>
            </button>
          </div>
        </div>

        {/* Inputs */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Origin */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>Pickup Location</span>
            </label>
            <input
              type="text"
              placeholder="e.g. IIT Hyderabad"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Destination */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-slate-900" />
              <span>Destination</span>
            </label>
            <input
              type="text"
              placeholder="e.g. HITEC City"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-emerald-600" />
              <span>Date</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Seats & Time Flexibility */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <Users className="w-3 h-3 text-slate-500" />
              <span>Seats Required</span>
            </label>
            <select
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value={1}>1 Seat</option>
              <option value={2}>2 Seats</option>
              <option value={3}>3 Seats</option>
              <option value={4}>4 Seats</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all h-[36px] flex items-center justify-center space-x-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-xl transition-all h-[36px]"
              title="Reset"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Quick Hub Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick Select Hub:</span>
          {HYDERABAD_HUBS.map((hub, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (!origin) setOrigin(hub);
                else setDestination(hub);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100/60 hover:text-emerald-800 text-[11px] font-medium text-slate-600 transition-colors"
            >
              {hub}
            </button>
          ))}
        </div>
      </div>

      {/* Main Results Display */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Calculating smart match rankings...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <p className="text-sm font-bold text-rose-800">{error}</p>
        </div>
      ) : rides.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200/90 text-center space-y-4">
          <Car className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No matching rides found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your pickup/drop points, expanding date range, or be the first to publish a ride on this route!
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
          >
            Show All Available Hyderabad Rides
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Ride Cards */}
          {(viewMode === 'both' || viewMode === 'cards') && (
            <div className={`${viewMode === 'both' ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Found <strong>{rides.length}</strong> available {rides.length === 1 ? 'ride' : 'rides'}</span>
                <span className="flex items-center text-emerald-700 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Sorted by deterministic match score
                </span>
              </div>

              <div className="space-y-4">
                {rides.map((ride) => (
                  <div
                    key={ride._id}
                    onClick={() => setSelectedRide(ride)}
                    className={`cursor-pointer rounded-2xl transition-all ${
                      selectedRide?._id === ride._id ? 'ring-2 ring-emerald-500 shadow-md' : ''
                    }`}
                  >
                    <RideCard
                      ride={ride}
                      onRequestSeat={(r) => setRequestModalRide(r)}
                      showRequestButton={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Right Column: Route Map Preview */}
          {(viewMode === 'both' || viewMode === 'map') && (
            <div className={`${viewMode === 'both' ? 'lg:col-span-5' : 'lg:col-span-12'} sticky top-24 space-y-3`}>
              <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-md space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 px-1">
                  <span>Route Map: {selectedRide?.source?.name} → {selectedRide?.destination?.name}</span>
                  <span className="text-[11px] text-emerald-600 font-semibold">OpenStreetMap</span>
                </div>

                <RouteMap
                  sourceCoords={selectedRide?.source?.coordinates}
                  destCoords={selectedRide?.destination?.coordinates}
                  waypoints={selectedRide?.waypoints || []}
                  sourceName={selectedRide?.source?.name}
                  destName={selectedRide?.destination?.name}
                  height={viewMode === 'map' ? '520px' : '380px'}
                />

                {selectedRide && (
                  <div className="bg-slate-50 rounded-2xl p-3 text-xs text-slate-600 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{selectedRide.driver?.name}</p>
                      <p className="text-[11px] text-slate-500">{selectedRide.vehicle?.model} • ₹{selectedRide.costContribution}/seat</p>
                    </div>
                    <button
                      onClick={() => setRequestModalRide(selectedRide)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                    >
                      Request Seat
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Seat Request Modal */}
      {requestModalRide && (
        <SeatRequestModal
          ride={requestModalRide}
          isOpen={!!requestModalRide}
          onClose={() => setRequestModalRide(null)}
          onSuccess={() => {
            fetchRides();
          }}
        />
      )}

    </div>
  );
}
