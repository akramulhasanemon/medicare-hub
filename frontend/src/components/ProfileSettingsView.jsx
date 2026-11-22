import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  KeyRound, 
  Save,
  Droplet,
  Stethoscope,
  FlaskConical,
  Landmark,
  Eye,
  EyeOff
} from 'lucide-react';

const ProfileSettingsView = ({ theme = 'cyan' }) => {
  const { user, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    blood_group: user?.blood_group || 'O+',
    specialty: user?.specialty || user?.designation || '',
    new_password: '',
    confirm_password: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const getThemeStyles = () => {
    switch (theme) {
      case 'purple':
        return {
          accent: 'purple',
          btnBg: 'bg-purple-700 hover:bg-purple-800 text-white shadow-purple-700/25',
          bannerBg: 'from-purple-900 to-indigo-950 text-white',
          idBadge: 'bg-purple-50 text-purple-800 border-purple-200',
          ring: 'focus:ring-purple-500'
        };
      case 'blue':
        return {
          accent: 'blue',
          btnBg: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25',
          bannerBg: 'from-blue-900 to-slate-900 text-white',
          idBadge: 'bg-blue-50 text-blue-800 border-blue-200',
          ring: 'focus:ring-blue-500'
        };
      case 'emerald':
        return {
          accent: 'emerald',
          btnBg: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/25',
          bannerBg: 'from-emerald-900 to-teal-950 text-white',
          idBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          ring: 'focus:ring-emerald-500'
        };
      default:
        return {
          accent: 'cyan',
          btnBg: 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/25',
          bannerBg: 'from-cyan-900 to-slate-900 text-white',
          idBadge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          ring: 'focus:ring-cyan-500'
        };
    }
  };

  const currentTheme = getThemeStyles();
  const permanentId = user?.patient_id || user?.doctor_code || user?.employee_code || user?.account_code || 'P01';

  const handleCopyId = () => {
    navigator.clipboard.writeText(permanentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (formData.new_password) {
      if (formData.new_password !== formData.confirm_password) {
        setErrorMsg('New password and confirm password do not match!');
        return;
      }
      if (formData.new_password.length < 4) {
        setErrorMsg('Password should be at least 4 characters long.');
        return;
      }
    }

    setSaving(true);

    const updatePayload = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      blood_group: formData.blood_group,
      specialty: formData.specialty
    };

    if (formData.new_password) {
      updatePayload.password = formData.new_password;
    }

    const res = await updateUserProfile(updatePayload);
    setSaving(false);

    if (res.success) {
      setSuccessMsg(`Profile information updated successfully! Your permanent ID (${permanentId}) remains securely locked.`);
      setFormData(prev => ({ ...prev, new_password: '', confirm_password: '' }));
      setTimeout(() => setSuccessMsg(''), 5000);
    } else {
      setErrorMsg(res.message || 'Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Permanent Locked ID Card */}
      <div className={`bg-gradient-to-r ${currentTheme.bannerBg} rounded-3xl p-6 sm:p-7 shadow-xl border border-white/10 text-white relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-200 border border-rose-500/30 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-rose-300" />
                <span>Permanent & Locked System ID (অপরিবর্তনশীল)</span>
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/10 text-slate-200 capitalize">
                Role: {user?.role ? user.role.replace('_', ' ') : 'User'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
              <span className="font-mono text-cyan-300">{permanentId}</span>
              <button
                type="button"
                onClick={handleCopyId}
                title="Copy ID to Clipboard"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all text-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </h2>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              🔒 <strong>আইডি সুরক্ষা নিয়ম:</strong> এই আইডিটি হাসপাতাল কেন্দ্রীয় ডেটাবেসে স্থায়ীভাবে সংরক্ষিত। অ্যাডমিন অথবা সিস্টেম কর্তৃক রেজিস্ট্রেশনের সময় প্রদানকৃত এই আইডি কখনো পরিবর্তনযোগ্য নয়। আপনি নাম, ফোন নম্বর, ঠিকানা এবং পাসওয়ার্ড যেকোনো সময় পরিবর্তন করতে পারবেন।
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center shrink-0 sm:min-w-[180px]">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
            <div className="text-xs font-bold text-white">ID Status: Verified</div>
            <div className="text-[10px] text-emerald-300 font-mono mt-0.5">LOCKED & IMMUTABLE</div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 animate-in fade-in duration-200 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3 animate-in fade-in duration-200 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Profile Edit Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Personal & Contact Details</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your contact telephone, residential address, or profile details below
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* System ID (Disabled/Locked) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-500" />
                <span>System Permanent ID (আইডি পরিবর্তনযোগ্য নয়)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  readOnly
                  value={permanentId}
                  className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-100/80 border border-slate-200 rounded-xl text-slate-600 font-mono font-bold cursor-not-allowed select-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded">
                  Locked
                </span>
              </div>
            </div>

            {/* Email (Read-Only) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address (Primary Account Email)</span>
              </label>
              <input
                type="email"
                disabled
                readOnly
                value={formData.email}
                className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-100/80 border border-slate-200 rounded-xl text-slate-600 font-medium cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full official name"
                className={`w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${currentTheme.ring} font-medium`}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Phone Number (মোবাইল নম্বর) *</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="017xxxxxxxx"
                className={`w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${currentTheme.ring} font-medium`}
              />
            </div>
          </div>

          {/* Present Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Present Address (বর্তমান ঠিকানা) *</span>
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="House, Road, Area, City (e.g. House 14, Road 5, Dhanmondi, Dhaka)"
              className={`w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${currentTheme.ring} font-medium`}
            />
          </div>

          {/* Role-Specific Field */}
          {user?.role === 'patient' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-rose-500" />
                <span>Blood Group (রক্তের গ্রুপ)</span>
              </label>
              <select
                value={formData.blood_group}
                onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                className={`w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${currentTheme.ring} font-medium`}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          )}

          {user?.role === 'doctor' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
                <span>Medical Specialty & Degree</span>
              </label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                placeholder="e.g. Cardiologist & Internal Medicine Specialist"
                className={`w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${currentTheme.ring} font-medium`}
              />
            </div>
          )}

          {user?.role === 'lab_staff' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                <span>Laboratory Unit / Diagnostic Specialization</span>
              </label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                placeholder="e.g. Clinical Pathology & Hematology Analyst"
                className={`w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${currentTheme.ring} font-medium`}
              />
            </div>
          )}

          {user?.role === 'accountant' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-emerald-600" />
                <span>Finance Role / Billing Counter Designation</span>
              </label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                placeholder="e.g. Senior Billing Executive & Cashier"
                className={`w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${currentTheme.ring} font-medium`}
              />
            </div>
          )}

          {/* Password Security Section */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-slate-600" />
                <span>Change Password (পাসওয়ার্ড পরিবর্তন)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Leave these fields blank if you want to keep your existing password.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>New Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.new_password}
                    onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                    placeholder="Enter new password (optional)"
                    className={`w-full text-xs sm:text-sm pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${currentTheme.ring} font-medium`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Confirm New Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                    placeholder="Re-enter new password"
                    className={`w-full text-xs sm:text-sm pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 ${currentTheme.ring} font-medium`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 font-bold px-8 py-3.5 rounded-2xl shadow-lg transition-all text-xs sm:text-sm ${currentTheme.btnBg}`}
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Updating Profile...' : 'Save Profile Changes (সংরক্ষণ করুন)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsView;
