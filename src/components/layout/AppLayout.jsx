import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export function AppLayout() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased font-sans">
      {/* Top Hyderabad Demo Mode Notice Banner */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-emerald-400">RideSync Live:</span>
            <span>Connecting IIT Hyderabad, BITS Pilani, IIIT, HITEC City & Financial District</span>
          </div>
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <span className="text-[11px] text-slate-400">
                Demo Accounts Available in <Link to="/login" className="text-emerald-400 hover:underline font-medium">Login Screen</Link>
              </span>
            ) : (
              <span className="text-[11px] text-emerald-300 font-medium flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Active Session: {user?.name} ({user?.role})
              </span>
            )}
          </div>
        </div>
      </div>

      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
