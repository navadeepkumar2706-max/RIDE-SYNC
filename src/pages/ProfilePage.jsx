import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Building2, 
  Phone, 
  Car, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Save,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.profile?.bio || user?.bio || '',
    institutionName: typeof user?.institution === 'object' ? (user?.institution?.name || '') : (user?.institution || ''),
    institutionType: typeof user?.institution === 'object' ? (user?.institution?.type || 'college') : 'college',
    vehicleMake: user?.vehicle?.make || '',
    vehicleModel: user?.vehicle?.model || '',
    vehicleColor: user?.vehicle?.color || '',
    vehiclePlate: user?.vehicle?.licensePlate || user?.vehicle?.plateNumber || '',
    emergencyName: user?.emergencyContact?.name || '',
    emergencyRelationship: user?.emergencyContact?.relationship || user?.emergencyContact?.relation || '',
    emergencyPhone: user?.emergencyContact?.phone || '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const isVerified = ['verified', 'institution_verified', 'demo_verified'].includes(user?.verificationStatus);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        profile: {
          bio: formData.bio,
        },
        institution: {
          name: formData.institutionName,
          type: formData.institutionType,
        },
        vehicle: {
          make: formData.vehicleMake,
          model: formData.vehicleModel,
          color: formData.vehicleColor,
          licensePlate: formData.vehiclePlate,
          plateNumber: formData.vehiclePlate,
        },
        emergencyContact: {
          name: formData.emergencyName,
          relation: formData.emergencyRelationship,
          relationship: formData.emergencyRelationship,
          phone: formData.emergencyPhone,
        },
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Verification Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-slate-900">{user?.name}</h1>
                {isVerified && (
                  <span className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Verified Member
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">
                {typeof user?.institution === 'object' ? (user?.institution?.name || 'Hyderabad Network') : (user?.institution || 'Hyderabad Network')}
              </p>
            </div>
          </div>

          <div className="text-right sm:self-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Role</span>
            <span className="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-lg uppercase">
              {user?.role || 'User'}
            </span>
          </div>
        </div>

        {/* Verification Status Explainer */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start space-x-2.5">
          <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${isVerified ? 'text-emerald-600' : 'text-slate-400'}`} />
          <div>
            <span className="font-bold text-slate-800">
              {isVerified ? 'Verified Campus Identity' : 'Institutional Verification'}
            </span>
            <p className="text-[11px] mt-0.5 leading-relaxed">
              {isVerified 
                ? 'Your account has verified student or employee status. Your profile displays the trusted campus shield on all published rides.'
                : 'Accounts using student/faculty email domains (.ac.in or .edu) or approved demo accounts receive verified status.'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile and vehicle information updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Personal Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Personal Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">College or Company</label>
              <input
                type="text"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleChange}
                placeholder="e.g. IIT Hyderabad / Google"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Bio</label>
              <input
                type="text"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="e.g. 3rd year CS student commuting daily from Miyapur"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Car className="w-4 h-4 text-emerald-600" />
            <span>Driver Vehicle Details</span>
          </h2>
          <p className="text-xs text-slate-500 -mt-2">
            These details are displayed to confirmed passengers to identify your car at pickup.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Make</label>
              <input
                type="text"
                name="vehicleMake"
                value={formData.vehicleMake}
                onChange={handleChange}
                placeholder="e.g. Honda"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Model</label>
              <input
                type="text"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                placeholder="e.g. City"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Color</label>
              <input
                type="text"
                name="vehicleColor"
                value={formData.vehicleColor}
                onChange={handleChange}
                placeholder="e.g. Pearl White"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">License Plate</label>
              <input
                type="text"
                name="vehiclePlate"
                value={formData.vehiclePlate}
                onChange={handleChange}
                placeholder="e.g. TS 09 EA 4321"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>Emergency Contact</span>
          </h2>
          <p className="text-xs text-slate-500 -mt-2">
            Stored securely with privacy controls for safety verification.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
              <input
                type="text"
                name="emergencyName"
                value={formData.emergencyName}
                onChange={handleChange}
                placeholder="e.g. Rajesh Sharma"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Relationship</label>
              <input
                type="text"
                name="emergencyRelationship"
                value={formData.emergencyRelationship}
                onChange={handleChange}
                placeholder="e.g. Parent / Sibling"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Phone</label>
              <input
                type="tel"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                placeholder="+91 98765 00000"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
