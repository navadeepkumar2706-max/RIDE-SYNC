import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  MapPin, 
  Users, 
  Sparkles, 
  Car, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Compass, 
  Building2, 
  Leaf,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

const HYDERABAD_HUBS = [
  'IIT Hyderabad (Kandi)',
  'BITS Pilani Hyderabad (Shamirpet)',
  'IIIT Hyderabad (Gachibowli)',
  'HITEC City / Cyber Towers',
  'Financial District (Nanakramguda)',
  'Osmania University (Tarnaka)',
  'Secunderabad Railway Station',
  'Miyapur Metro Station'
];

export function LandingPage() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [seats, setSeats] = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (origin) params.append('origin', origin);
    if (destination) params.append('destination', destination);
    if (date) params.append('date', date);
    if (seats) params.append('seats', seats);
    navigate(`/find-rides?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 border-b border-slate-200/60">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shadow-2xs border border-emerald-200/60">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Campus & Tech Commute Network • Hyderabad</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Your Route. Their Ride. <br />
              <span className="text-emerald-600">Everyone Wins.</span>
            </h1>

            {/* Tagline & Subtext */}
            <p className="text-lg sm:text-xl font-medium text-slate-700">
              "Same Route. Shared Ride. Smarter Commute."
            </p>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Connect with verified students and tech professionals travelling your daily route across Hyderabad.
              Share empty car seats, split fuel costs equitably, cut carbon emissions, and eliminate daily transit stress.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/find-rides"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Find a Ride</span>
              </Link>
              <Link
                to="/offer-ride"
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border border-slate-200 shadow-xs transition-all hover:scale-[1.02] flex items-center space-x-2"
              >
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>Offer Empty Seats</span>
              </Link>
            </div>
          </div>

          {/* Search Box Card */}
          <div className="mt-12 max-w-4xl mx-auto bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200/90">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              
              {/* Pickup Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>Pickup</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. IIT Hyderabad / Gachibowli"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                />
              </div>

              {/* Destination Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-slate-900" />
                  <span>Destination</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. HITEC City / BITS Pilani"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
                />
              </div>

              {/* Date Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>Date</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Seats Selector */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                  <Users className="w-3 h-3 text-slate-500" />
                  <span>Seats</span>
                </label>
                <select
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                >
                  <option value={1}>1 Passenger</option>
                  <option value={2}>2 Passengers</option>
                  <option value={3}>3 Passengers</option>
                  <option value={4}>4 Passengers</option>
                </select>
              </div>

              {/* Submit CTA */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all hover:shadow flex items-center justify-center space-x-1.5 h-[38px]"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Matches</span>
                </button>
              </div>
            </form>

            {/* Quick Hub Chips */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Popular:</span>
              {HYDERABAD_HUBS.slice(0, 5).map((hub, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (!origin) setOrigin(hub);
                    else setDestination(hub);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-[11px] font-medium text-slate-600 transition-colors"
                >
                  {hub.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Social Proof Stats Counter */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/80 text-center">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">4,800+</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Shared Trips Completed</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/80 text-center">
              <p className="text-2xl sm:text-3xl font-black text-emerald-600">₹14.2 Lakh</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Commuter Fuel Saved</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/80 text-center">
              <p className="text-2xl sm:text-3xl font-black text-slate-900">38 Tons</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">CO₂ Offset in Hyd</p>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/80 text-center">
              <p className="text-2xl sm:text-3xl font-black text-emerald-600">100%</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Institutional Verification</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES (SMART MATCHING, TRUST, CONCURRENCY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Architecture & Design</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Engineered for Campus Trust & Route Precision
          </h2>
          <p className="text-sm text-slate-600">
            Not a generic cab board. RideSync is a tailored full-stack carpooling platform with deterministic matching and verified institutional identity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1: Deterministic Matching */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Deterministic Smart Match</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every route match is scored out of 100% using a deterministic algorithm:
            </p>
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Pickup Proximity</span>
                <span className="text-emerald-600">40% Weight</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[40%] h-full bg-emerald-500 rounded-full"></div>
              </div>

              <div className="flex justify-between font-semibold text-slate-700">
                <span>Departure Time Compatibility</span>
                <span className="text-emerald-600">35% Weight</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[35%] h-full bg-emerald-600 rounded-full"></div>
              </div>

              <div className="flex justify-between font-semibold text-slate-700">
                <span>Route & Detour Suitability</span>
                <span className="text-emerald-600">25% Weight</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[25%] h-full bg-slate-800 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Feature 2: Institutional Verification */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Verified Campus Networks</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No anonymous strangers. Users verify with their institutional email domains (e.g. <span className="font-mono text-slate-800">@iith.ac.in</span>, <span className="font-mono text-slate-800">@hyderabad.bits-pilani.ac.in</span>, <span className="font-mono text-slate-800">@iiit.ac.in</span>) or corporate company domains.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-600">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified student & faculty badges</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mutual ratings & commute guidelines</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ladies-only ride preferences supported</span>
              </li>
            </ul>
          </div>

          {/* Feature 3: Concurrency-Safe Booking */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Atomic Seat Concurrency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Engineered with atomic conditional updates in MongoDB. Prevents race conditions and double-booking when multiple students attempt to claim the last seat simultaneously.
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
              <div className="text-emerald-700 font-semibold">// Concurrency-safe backend</div>
              <div>availableSeats: &#123; $gte: seats &#125;</div>
              <div>$inc: &#123; availableSeats: -seats &#125;</div>
            </div>
            <p className="text-[11px] text-slate-500">
              Cancellations restore seat inventory exactly once without overbooking risk.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Simple 3-Step Flow
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">How RideSync Works</h2>
            <p className="text-sm text-slate-400">
              Seamlessly connect as a driver with empty seats or a passenger looking for an affordable ride.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-lg">
                1
              </div>
              <h3 className="text-base font-bold text-white">Publish or Search Routes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drivers list their origin, destination, intermediate waypoints, and available seats. Passengers enter their commute requirements.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-lg">
                2
              </div>
              <h3 className="text-base font-bold text-white">Request & Atomic Approval</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Passengers submit seat requests. The driver reviews profile credentials and approves the request with real-time seat lock.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-lg">
                3
              </div>
              <h3 className="text-base font-bold text-white">Travel Together & Split Fuel</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Meet at the agreed pickup point, travel safely using shared routes, and settle non-commercial fuel cost contributions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HYDERABAD CAMPUS HUB CORRIDORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Regional Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Popular Daily Commute Routes in Hyderabad
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Top routes travelled by student drivers and tech employees every weekday.
            </p>
          </div>
          <Link
            to="/find-rides"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
          >
            <span>Explore all available rides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Corridor 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Campus Corridor</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">~42 km</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900">IIT Hyderabad (Kandi)</p>
              <div className="text-slate-400 text-xs pl-2">↓ via Miyapur & Kukatpally</div>
              <p className="text-sm font-bold text-slate-900">HITEC City / Cyber Towers</p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">From ₹80 / seat</span>
              <Link
                to="/find-rides?origin=IIT+Hyderabad&destination=HITEC+City"
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Find Rides →
              </Link>
            </div>
          </div>

          {/* Corridor 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Campus Corridor</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">~35 km</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900">BITS Pilani Hyderabad (Shamirpet)</p>
              <div className="text-slate-400 text-xs pl-2">↓ via ECIL & Secunderabad</div>
              <p className="text-sm font-bold text-slate-900">Secunderabad Railway Station</p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">From ₹60 / seat</span>
              <Link
                to="/find-rides?origin=BITS+Pilani+Hyderabad&destination=Secunderabad"
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Find Rides →
              </Link>
            </div>
          </div>

          {/* Corridor 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Tech Corridor</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">~12 km</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900">IIIT Hyderabad (Gachibowli)</p>
              <div className="text-slate-400 text-xs pl-2">↓ via Wipro Circle</div>
              <p className="text-sm font-bold text-slate-900">Financial District (Nanakramguda)</p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">From ₹40 / seat</span>
              <Link
                to="/find-rides?origin=IIIT+Hyderabad&destination=Financial+District"
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Find Rides →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to Upgrade Your Daily Commute?
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Join hundreds of Hyderabad college students and tech commuters. Publish your empty seats in under 60 seconds or discover high-compatibility rides on your route.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/register"
              className="px-6 py-3.5 bg-white text-slate-950 font-extrabold rounded-2xl shadow-md hover:bg-emerald-50 transition-all text-center text-sm"
            >
              Get Started Free
            </Link>
            <Link
              to="/find-rides"
              className="px-6 py-3.5 bg-emerald-800/60 hover:bg-emerald-800 text-white font-bold rounded-2xl border border-emerald-400/30 transition-all text-center text-sm"
            >
              Browse Live Rides
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
