import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, Lock, Mail, AlertCircle, Loader2, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login helper for hackathon demonstration
  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
    setLoading(true);

    try {
      await login({ email: demoEmail, password: demoPassword });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Demo login failed. Make sure server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/25">
            <Car className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign in to RideSync</h2>
          <p className="text-xs text-slate-500">
            Welcome back to your verified campus commute network
          </p>
        </div>

        {/* Demo Fast Login Panel */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Hackathon Quick-Login Demo Accounts:</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('arjun.sharma@iith.ac.in', 'Password123!')}
              className="w-full text-left px-3 py-1.5 bg-white hover:bg-emerald-100/50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between transition-colors group"
            >
              <div>
                <span className="font-bold text-slate-900">Arjun Sharma</span>
                <span className="text-[11px] text-slate-500 block">IIT-H Driver (Published Rides)</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                1-Click Login →
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('ananya.d@osmania.ac.in', 'Password123!')}
              className="w-full text-left px-3 py-1.5 bg-white hover:bg-emerald-100/50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between transition-colors group"
            >
              <div>
                <span className="font-bold text-slate-900">Ananya Deshmukh</span>
                <span className="text-[11px] text-slate-500 block">Osmania Commuter (Passenger)</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                1-Click Login →
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@ridesync.in', 'Password123!')}
              className="w-full text-left px-3 py-1.5 bg-white hover:bg-purple-100/50 rounded-xl border border-purple-200 text-xs flex items-center justify-between transition-colors group"
            >
              <div>
                <span className="font-bold text-purple-900">Campus Admin</span>
                <span className="text-[11px] text-slate-500 block">System Oversight & Moderation</span>
              </div>
              <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded group-hover:bg-purple-600 group-hover:text-white transition-colors">
                Admin Login →
              </span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@institution.ac.in"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <span className="text-[11px] text-slate-400">Demo pwd: Password123!</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to RideSync</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-emerald-600 hover:underline">
              Join RideSync
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
