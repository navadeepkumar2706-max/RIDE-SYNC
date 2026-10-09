import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Car, 
  Calendar, 
  AlertTriangle, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Search,
  Filter,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { api } from '../lib/api';

export function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [userSearch, setUserSearch] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, reportsData] = await Promise.all([
        api.admin.getStats().catch(() => ({ stats: {} })),
        api.admin.getUsers().catch(() => ({ users: [] })),
        api.admin.getReports().catch(() => ({ reports: [] })),
      ]);

      setStats(statsData.stats || statsData);
      setUsers(usersData.users || []);
      setReports(reportsData.reports || []);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to load admin telemetry.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Update user verification or account status
  const handleUserStatusUpdate = async (userId, updatePayload) => {
    setActionLoading(userId);
    try {
      await api.admin.updateUserStatus(userId, updatePayload);
      setFeedback({ type: 'success', text: 'User status successfully modified.' });
      await loadAdminData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Action failed.' });
    } finally {
      setActionLoading(null);
    }
  };

  // Update report status
  const handleReportStatus = async (reportId, status) => {
    setActionLoading(reportId);
    try {
      await api.admin.updateReportStatus(reportId, { status });
      setFeedback({ type: 'success', text: `Report marked as ${status}.` });
      await loadAdminData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Action failed.' });
    } finally {
      setActionLoading(null);
    }
  };

  // Reseed database
  const handleReseed = async () => {
    if (!window.confirm('Reset database to clean Hyderabad seed state? (IIT-H, BITS, IIIT users and rides will be restored)')) {
      return;
    }
    setActionLoading('reseed');
    try {
      await api.demo.reseed();
      setFeedback({ type: 'success', text: 'Database successfully re-seeded with Hyderabad sample data!' });
      await loadAdminData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Re-seed failed.' });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const instName = typeof u.institution === 'object' ? u.institution?.name : u.institution;
    return (
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      (instName && instName.toLowerCase().includes(userSearch.toLowerCase()))
    );
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              RideSync Administrator Console
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            System metrics, user verification moderation, safety queues, and test database controls.
          </p>
        </div>

        <button
          onClick={handleReseed}
          disabled={actionLoading === 'reseed'}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-2 self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${actionLoading === 'reseed' ? 'animate-spin' : ''}`} />
          <span>Reset / Reseed Demo Data</span>
        </button>
      </div>

      {feedback && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="font-bold text-slate-500 hover:text-slate-900 ml-4">✕</button>
        </div>
      )}

      {/* 1. PLATFORM TELEMETRY STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Total Users</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalUsers || 0}</p>
          <p className="text-[11px] text-slate-500">{stats?.verifiedUsers || 0} campus verified</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Active Rides</span>
            <Car className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.activeRides || 0}</p>
          <p className="text-[11px] text-slate-500">{stats?.totalRides || 0} lifetime rides</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Confirmed Bookings</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.confirmedBookings || 0}</p>
          <p className="text-[11px] text-slate-500">{stats?.totalBookings || 0} total requests</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Safety Reports</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600">{reports.length}</p>
          <p className="text-[11px] text-slate-500">User moderation items</p>
        </div>
      </div>

      {/* 2. USER MODERATION TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">User Account Management</h2>
            <p className="text-xs text-slate-500">Toggle campus verification and manage account permissions</p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const isVerified = ['verified', 'institution_verified', 'demo_verified'].includes(u.verificationStatus);
                const isSuspended = u.status === 'suspended';

                return (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>{u.name}</div>
                      <div className="text-[11px] font-normal text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {(typeof u.institution === 'object' ? u.institution?.name : u.institution) || 'Unspecified'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded ${
                        isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isVerified && <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />}
                        {(u.verificationStatus || 'unverified').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isSuspended ? 'bg-rose-100 text-rose-800' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {(u.status || 'active').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        disabled={actionLoading === u._id}
                        onClick={() => handleUserStatusUpdate(u._id, {
                          verificationStatus: isVerified ? 'unverified' : 'institution_verified'
                        })}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          isVerified ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {isVerified ? 'Revoke Verify' : 'Approve Verify'}
                      </button>

                      <button
                        disabled={actionLoading === u._id}
                        onClick={() => handleUserStatusUpdate(u._id, {
                          status: isSuspended ? 'active' : 'suspended'
                        })}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          isSuspended ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {isSuspended ? 'Unsuspend' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. SAFETY REPORTS QUEUE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          <span>Safety Reports Queue ({reports.length})</span>
        </h2>

        {reports.length === 0 ? (
          <p className="text-xs text-slate-500">No active reports. The community is healthy and safe!</p>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">Reporter: {report.reporter?.name || 'Anonymous'}</span>
                    <span className="text-slate-400">→</span>
                    <span className="font-bold text-rose-700">Reported: {report.reportedUser?.name || 'User'}</span>
                  </div>
                  <p className="text-slate-700 font-medium">Reason: "{report.reason}"</p>
                  <p className="text-[10px] text-slate-400">Logged on {new Date(report.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    disabled={actionLoading === report._id}
                    onClick={() => handleReportStatus(report._id, 'dismissed')}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-[11px]"
                  >
                    Dismiss
                  </button>
                  <button
                    disabled={actionLoading === report._id}
                    onClick={() => handleReportStatus(report._id, 'resolved')}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-[11px]"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
