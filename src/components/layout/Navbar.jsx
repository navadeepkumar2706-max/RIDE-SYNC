import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Car, 
  MapPin, 
  PlusCircle, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  LayoutDashboard, 
  Calendar,
  CheckCircle2,
  Clock,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  
  const userDropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNotifDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">Ride<span className="text-emerald-600">Sync</span></span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 tracking-wider uppercase">HYD</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">Smarter Campus Commute</p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/find-rides"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/find-rides')
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Find Rides</span>
            </Link>

            <Link
              to="/offer-ride"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/offer-ride')
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Offer a Ride</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/my-bookings"
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/my-bookings')
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>My Bookings</span>
                </Link>

                <Link
                  to="/my-rides"
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/my-rides')
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>My Published Rides</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {isAuthenticated ? (
              <>
                {/* Notifications Bell */}
                <div className="relative" ref={notifDropdownRef}>
                  <button
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors"
                    aria-label="View notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown Popover */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center px-4">
                            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs text-slate-500">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.slice(0, 8).map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => {
                                if (!notif.read) markRead(notif._id);
                              }}
                              className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer flex items-start space-x-3 ${
                                !notif.read ? 'bg-emerald-50/40' : ''
                              }`}
                            >
                              <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                                notif.type === 'booking_confirmed'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : notif.type === 'booking_rejected' || notif.type === 'booking_cancelled'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs ${!notif.read ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                                  {notif.message}
                                </p>
                                <span className="text-[10px] text-slate-400 mt-1 flex items-center">
                                  <Clock className="w-2.5 h-2.5 mr-1" />
                                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200/60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-left hidden lg:block pr-1">
                      <p className="text-xs font-semibold text-slate-900 leading-tight flex items-center">
                        {user?.name?.split(' ')[0]}
                        {['verified', 'institution_verified', 'demo_verified'].includes(user?.verificationStatus) && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-1 inline" />
                        )}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[100px]">
                        {typeof user?.institution === 'object' ? (user?.institution?.name || 'Commuter') : (user?.institution || 'Commuter')}
                      </p>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                          {typeof user?.institution === 'object' ? (user?.institution?.name || 'Verified Member') : (user?.institution || 'Verified Member')}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 mr-2.5 text-slate-400" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <User className="w-3.5 h-3.5 mr-2.5 text-slate-400" />
                          Profile & Vehicle
                        </Link>
                        <Link
                          to="/my-bookings"
                          className="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <Calendar className="w-3.5 h-3.5 mr-2.5 text-slate-400" />
                          My Bookings
                        </Link>
                        <Link
                          to="/my-rides"
                          className="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <Car className="w-3.5 h-3.5 mr-2.5 text-slate-400" />
                          Published Rides
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2 text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 font-medium"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 mr-2.5 text-purple-600" />
                            Admin Console
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-xs text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut className="w-3.5 h-3.5 mr-2.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all hover:shadow"
                >
                  Join RideSync
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/find-rides"
            className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            <Search className="w-4 h-4 text-emerald-600" />
            <span>Find Rides</span>
          </Link>
          <Link
            to="/offer-ride"
            className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Offer a Ride</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/my-bookings"
                className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>My Bookings</span>
              </Link>
              <Link
                to="/my-rides"
                className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                <Car className="w-4 h-4 text-slate-500" />
                <span>My Published Rides</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Profile & Vehicle</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium text-purple-700 bg-purple-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Console</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                to="/login"
                className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-emerald-600 rounded-xl shadow-sm"
              >
                Join RideSync
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
