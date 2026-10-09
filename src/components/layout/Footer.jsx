import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ShieldCheck, Heart, MapPin, Mail, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
                <Car className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">Ride<span className="text-emerald-400">Sync</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Same Route. Shared Ride. Smarter Commute.
            </p>
            <p className="text-xs text-slate-400">
              The verified, community-first carpooling network built for college students and tech commuters across Hyderabad.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Campus Domain Verified Platform</span>
            </div>
          </div>

          {/* Quick Hubs */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Hyderabad Hubs</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/find-rides?origin=IIT+Hyderabad" className="hover:text-emerald-400 transition-colors">IIT Hyderabad (Kandi)</Link></li>
              <li><Link to="/find-rides?origin=BITS+Pilani+Hyderabad" className="hover:text-emerald-400 transition-colors">BITS Pilani Hyderabad (Shamirpet)</Link></li>
              <li><Link to="/find-rides?origin=IIIT+Hyderabad" className="hover:text-emerald-400 transition-colors">IIIT Hyderabad (Gachibowli)</Link></li>
              <li><Link to="/find-rides?destination=HITEC+City" className="hover:text-emerald-400 transition-colors">HITEC City & Cyber Towers</Link></li>
              <li><Link to="/find-rides?destination=Financial+District" className="hover:text-emerald-400 transition-colors">Financial District (Nanakramguda)</Link></li>
              <li><Link to="/find-rides?origin=Osmania+University" className="hover:text-emerald-400 transition-colors">Osmania University & Tarnaka</Link></li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/find-rides" className="hover:text-emerald-400 transition-colors">Find a Ride</Link></li>
              <li><Link to="/offer-ride" className="hover:text-emerald-400 transition-colors">Offer Empty Seats</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Join With Campus Email</Link></li>
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Commuter Dashboard</Link></li>
              <li><a href="#how-it-works" className="hover:text-emerald-400 transition-colors">Deterministic Smart Match</a></li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Trust & Safety</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="text-slate-300 font-medium">Verified Identity:</span> Institutional emails required for student driver badges.</li>
              <li><span className="text-slate-300 font-medium">Concurrency-Safe:</span> Zero double bookings with atomic seat allocation.</li>
              <li><span className="text-slate-300 font-medium">Fair Cost Contribution:</span> Shared fuel costs only; strictly non-commercial.</li>
              <li className="pt-2">
                <span className="inline-flex items-center text-[11px] px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Hackathon Ready Demo Edition
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} RideSync Inc. All rights reserved. Hyderabad, India.</p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <span>Built with React, Express, MongoDB & Leaflet</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
