import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  IndianRupee, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { RouteMap } from '../components/map/RouteMap';

// Preset locations in Hyderabad with real GeoJSON coordinates
const HYD_LOCATIONS = [
  { name: 'IIT Hyderabad (Kandi Campus)', lat: 17.5947, lng: 78.1230 },
  { name: 'BITS Pilani Hyderabad (Shamirpet)', lat: 17.5449, lng: 78.5718 },
  { name: 'IIIT Hyderabad (Gachibowli)', lat: 17.4455, lng: 78.3489 },
  { name: 'HITEC City (Cyber Towers)', lat: 17.4504, lng: 78.3808 },
  { name: 'Financial District (Nanakramguda)', lat: 17.4156, lng: 78.3427 },
  { name: 'Osmania University (Tarnaka)', lat: 17.4138, lng: 78.5285 },
  { name: 'Secunderabad Railway Station', lat: 17.4334, lng: 78.5015 },
  { name: 'Miyapur Metro Station', lat: 17.4968, lng: 78.3614 },
  { name: 'Kukatpally Housing Board (KPHB)', lat: 17.4933, lng: 78.3995 },
  { name: 'Gachibowli Stadium', lat: 17.4435, lng: 78.3484 }
];

export function OfferRidePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [sourceName, setSourceName] = useState(HYD_LOCATIONS[0].name);
  const [sourceCoords, setSourceCoords] = useState({ lat: HYD_LOCATIONS[0].lat, lng: HYD_LOCATIONS[0].lng });

  const [destName, setDestName] = useState(HYD_LOCATIONS[3].name);
  const [destCoords, setDestCoords] = useState({ lat: HYD_LOCATIONS[3].lat, lng: HYD_LOCATIONS[3].lng });

  const [waypoints, setWaypoints] = useState([]);
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [totalSeats, setTotalSeats] = useState(3);
  const [costContribution, setCostContribution] = useState(80);

  // Vehicle info (pre-filled from user profile if available)
  const [vehicle, setVehicle] = useState({
    make: user?.vehicle?.make || 'Honda',
    model: user?.vehicle?.model || 'City',
    color: user?.vehicle?.color || 'White',
    licensePlate: user?.vehicle?.licensePlate || 'TS 09 EA 4321',
  });

  const [preferences, setPreferences] = useState({
    ladiesOnly: false,
    smokingAllowed: false,
    musicAllowed: true,
    acAvailable: true,
  });

  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle source preset change
  const handleSourceSelect = (name) => {
    setSourceName(name);
    const loc = HYD_LOCATIONS.find((l) => l.name === name);
    if (loc) setSourceCoords({ lat: loc.lat, lng: loc.lng });
  };

  // Handle destination preset change
  const handleDestSelect = (name) => {
    setDestName(name);
    const loc = HYD_LOCATIONS.find((l) => l.name === name);
    if (loc) setDestCoords({ lat: loc.lat, lng: loc.lng });
  };

  // Add waypoint
  const addWaypoint = (locName) => {
    if (!locName) return;
    const loc = HYD_LOCATIONS.find((l) => l.name === locName);
    if (loc && !waypoints.some((w) => w.name === locName)) {
      setWaypoints([...waypoints, { name: loc.name, coordinates: { lat: loc.lat, lng: loc.lng } }]);
    }
  };

  const removeWaypoint = (index) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!departureDate || !departureTime) {
      setError('Please select departure date and time.');
      return;
    }

    const departureDateTime = new Date(`${departureDate}T${departureTime}`);
    if (isNaN(departureDateTime.getTime())) {
      setError('Invalid departure date or time.');
      return;
    }

    if (departureDateTime < new Date()) {
      setError('Departure time cannot be in the past. Please select a future time.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        source: {
          name: sourceName,
          coordinates: sourceCoords,
        },
        destination: {
          name: destName,
          coordinates: destCoords,
        },
        waypoints,
        departureAt: departureDateTime.toISOString(),
        totalSeats: Number(totalSeats),
        costContribution: Number(costContribution),
        vehicle,
        preferences,
        notes,
      };

      await api.rides.create(payload);
      navigate('/my-rides');
    } catch (err) {
      setError(err.message || 'Failed to publish ride. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
          <Car className="w-7 h-7 text-emerald-600" />
          <span>Offer Empty Seats on Your Route</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Publish your upcoming commute across Hyderabad. Share fuel costs and help fellow verified students or coworkers.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Details */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-md space-y-6">
          
          {/* 1. Route Origins & Destinations */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Route Origin & Destination</span>
            </h3>

            {/* Source */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pickup Origin (Hyderabad Hub)
              </label>
              <select
                value={sourceName}
                onChange={(e) => handleSourceSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {HYD_LOCATIONS.map((loc, i) => (
                  <option key={i} value={loc.name}>{loc.name}</option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Drop Destination (Hyderabad Hub)
              </label>
              <select
                value={destName}
                onChange={(e) => handleDestSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {HYD_LOCATIONS.map((loc, i) => (
                  <option key={i} value={loc.name}>{loc.name}</option>
                ))}
              </select>
            </div>

            {/* Intermediate Waypoints */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Optional Intermediate Pickup Stops
              </label>
              <div className="flex items-center space-x-2">
                <select
                  id="waypointSelector"
                  defaultValue=""
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="" disabled>Select stop to add...</option>
                  {HYD_LOCATIONS.filter((l) => l.name !== sourceName && l.name !== destName).map((loc, i) => (
                    <option key={i} value={loc.name}>{loc.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const sel = document.getElementById('waypointSelector');
                    if (sel.value) {
                      addWaypoint(sel.value);
                      sel.value = '';
                    }
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stop</span>
                </button>
              </div>

              {waypoints.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {waypoints.map((w, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium"
                    >
                      <span className="mr-1.5 font-bold">#{idx + 1}</span> {w.name}
                      <button
                        type="button"
                        onClick={() => removeWaypoint(idx)}
                        className="ml-2 text-amber-700 hover:text-rose-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2. Schedule & Seat Capacity */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Schedule & Seat Inventory</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Departure Date
                </label>
                <input
                  type="date"
                  required
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Departure Time
                </label>
                <input
                  type="time"
                  required
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Empty Seats to Offer (1 - 6)
                </label>
                <select
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-bold"
                >
                  <option value={1}>1 Seat</option>
                  <option value={2}>2 Seats</option>
                  <option value={3}>3 Seats</option>
                  <option value={4}>4 Seats</option>
                  <option value={5}>5 Seats</option>
                  <option value={6}>6 Seats</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fuel Share / Passenger (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    min={20}
                    max={500}
                    value={costContribution}
                    onChange={(e) => setCostContribution(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Vehicle Information */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Car className="w-4 h-4 text-emerald-600" />
              <span>Vehicle Details</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Make (e.g. Honda / Hyundai)"
                value={vehicle.make}
                onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                placeholder="Model (e.g. City / i20)"
                value={vehicle.model}
                onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                placeholder="Color (e.g. White / Silver)"
                value={vehicle.color}
                onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                placeholder="Number Plate (e.g. TS 09 EA 4321)"
                value={vehicle.licensePlate}
                onChange={(e) => setVehicle({ ...vehicle, licensePlate: e.target.value })}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* 4. Ride Preferences & Notes */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Ride Preferences & Safety
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  checked={preferences.ladiesOnly}
                  onChange={(e) => setPreferences({ ...preferences, ladiesOnly: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-semibold text-purple-700">Ladies Only Ride</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  checked={preferences.acAvailable}
                  onChange={(e) => setPreferences({ ...preferences, acAvailable: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-700">AC Enabled</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pickup Notes (e.g. Waiting point, luggage allowance)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Starting from IIT-H Main Gate, can stop at Miyapur Metro. Light backpacks only."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              ></textarea>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Route...</span>
                </>
              ) : (
                <>
                  <span>Publish Ride & Open Seats</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Preview: Interactive Route Map */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Interactive Route Preview</span>
              <span className="text-emerald-600 text-[11px] font-semibold">Leaflet + OSM</span>
            </h3>

            <RouteMap
              sourceCoords={sourceCoords}
              destCoords={destCoords}
              waypoints={waypoints}
              sourceName={sourceName}
              destName={destName}
              height="380px"
            />

            <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1 text-slate-600">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Trip Summary</span>
                <span className="text-emerald-700">₹{costContribution} / seat</span>
              </div>
              <p className="text-[11px]">🟢 Origin: {sourceName}</p>
              {waypoints.map((w, i) => (
                <p key={i} className="text-[11px] text-amber-700">🟡 Stop #{i + 1}: {w.name}</p>
              ))}
              <p className="text-[11px]">🏁 Destination: {destName}</p>
              <p className="text-[11px] pt-1 text-slate-500">
                Seats: <strong>{totalSeats} available</strong> • Vehicle: {vehicle.make} {vehicle.model}
              </p>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
