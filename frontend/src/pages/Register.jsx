import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Droplet, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck,
  LogIn,
  Stethoscope,
  FlaskConical,
  Landmark,
  MapPin,
  Eye,
  EyeOff
} from 'lucide-react';

const Register = ({ setActivePage }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    blood_group: 'A+',
    role: 'patient', // 'patient' | 'doctor' | 'lab_staff' | 'accountant'
    specialty: '',
    password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirm_password) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      setRegisteredUser(res.user);
    } else {
      setErrorMsg(res.message || 'Registration failed');
    }
  };

  const handleCopyId = () => {
    if (registeredUser?.patient_id) {
      navigator.clipboard.writeText(registeredUser.patient_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'doctor':
        return { label: 'Doctor Specialist Account', prefix: 'D10X', color: 'from-purple-600 to-indigo-600', text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' };
      case 'lab_staff':
        return { label: 'Lab Employee / Technologist Account', prefix: 'L10X', color: 'from-blue-600 to-cyan-600', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' };
      case 'accountant':
        return { label: 'Accounts Section Account', prefix: 'A10X', color: 'from-emerald-600 to-teal-600', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
      default:
        return { label: 'Patient Medical Account', prefix: 'P0X', color: 'from-cyan-600 to-blue-600', text: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-200' };
    }
  };

  const currentRoleInfo = getRoleBadge(formData.role);

  // If successfully registered, show Success Card with the Auto-Incremented ID
  if (registeredUser) {
    const roleInfo = getRoleBadge(registeredUser.role);
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-300">
          
          {/* Success Icon */}
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              {roleInfo.label} রেজিস্ট্রেশন সফল হয়েছে
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Registration Successful!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              আপনার একাউন্ট তৈরি সম্পন্ন হয়েছে। নিচে আপনার স্বয়ংক্রিয়ভাবে তৈরি হওয়া ইউনিক আইডিটি দেওয়া হলো:
            </p>
          </div>

          {/* ID Highlight Box */}
          <div className={`bg-gradient-to-br ${roleInfo.bg} border-2 ${roleInfo.border} p-6 rounded-2xl text-center relative shadow-inner`}>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${roleInfo.text} block mb-1`}>
              Your Auto-Generated Login ID
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className={`text-5xl font-black ${roleInfo.text} font-mono tracking-wider`}>
                {registeredUser.patient_id}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                title="Copy ID"
                className="p-2.5 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-700 shadow-sm transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && (
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                ✓ Login ID copied to clipboard!
              </span>
            )}
            <p className="text-[11px] text-slate-600 font-medium mt-3 bg-white/80 py-2 px-3 rounded-xl border border-slate-200">
              💡 <strong>লগইন করার নিয়ম:</strong> পরবর্তীতে লগইন করার সময় আপনার আইডি (<strong className={`font-mono ${roleInfo.text}`}>{registeredUser.patient_id}</strong>) এবং পাসওয়ার্ড ব্যবহার করবেন।
            </p>
          </div>

          {/* User Info Summary */}
          <div className="bg-slate-50 p-4 rounded-xl text-xs text-left space-y-2 text-slate-600 border border-slate-100">
            <div className="flex justify-between">
              <span className="font-medium text-slate-400">Assigned Role:</span>
              <span className="font-bold text-slate-800 capitalize">{registeredUser.role.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-400">Full Name:</span>
              <span className="font-bold text-slate-800">{registeredUser.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-400">Email:</span>
              <span className="font-medium text-slate-800">{registeredUser.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-400">Phone:</span>
              <span className="font-medium text-slate-800">{registeredUser.phone}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                if (registeredUser.role === 'doctor') {
                  setActivePage('doctor-portal');
                } else if (registeredUser.role === 'lab_staff') {
                  setActivePage('lab-portal');
                } else if (registeredUser.role === 'accountant') {
                  setActivePage('accounts-portal');
                } else if (registeredUser.role === 'admin') {
                  setActivePage('admin');
                } else {
                  setActivePage('patient-dashboard');
                }
              }}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-600/25 transition-all text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActivePage('login')}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 rounded-xl border border-slate-200 transition-all text-xs flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with ID ({registeredUser.patient_id})</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-xl w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-cyan-600/25">
            <HeartPulse className="w-8 h-8" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">
            MediCare Portal Registration
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Create an account for Patient, Doctor (D101+), Lab Employee (L101+), or Accounts Section (A101+)
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Select Your Account Type / ভূমিকা নির্বাচন করুন:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'patient' })}
              className={`p-3 rounded-2xl border text-center transition-all ${
                formData.role === 'patient'
                  ? 'border-cyan-500 bg-cyan-50/80 text-cyan-800 shadow-sm font-bold ring-2 ring-cyan-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4 mx-auto mb-1 text-cyan-600" />
              <div className="text-xs font-bold">Patient</div>
              <span className="text-[10px] font-mono text-cyan-600 block">P01+</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'doctor' })}
              className={`p-3 rounded-2xl border text-center transition-all ${
                formData.role === 'doctor'
                  ? 'border-purple-500 bg-purple-50/80 text-purple-800 shadow-sm font-bold ring-2 ring-purple-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Stethoscope className="w-4 h-4 mx-auto mb-1 text-purple-600" />
              <div className="text-xs font-bold">Doctor</div>
              <span className="text-[10px] font-mono text-purple-600 block">D101+</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'lab_staff' })}
              className={`p-3 rounded-2xl border text-center transition-all ${
                formData.role === 'lab_staff'
                  ? 'border-blue-500 bg-blue-50/80 text-blue-800 shadow-sm font-bold ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FlaskConical className="w-4 h-4 mx-auto mb-1 text-blue-600" />
              <div className="text-xs font-bold">Lab Staff</div>
              <span className="text-[10px] font-mono text-blue-600 block">L101+</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'accountant' })}
              className={`p-3 rounded-2xl border text-center transition-all ${
                formData.role === 'accountant'
                  ? 'border-emerald-500 bg-emerald-50/80 text-emerald-800 shadow-sm font-bold ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Landmark className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
              <div className="text-xs font-bold">Accounts</div>
              <span className="text-[10px] font-mono text-emerald-600 block">A101+</span>
            </button>
          </div>

          <div className="mt-2 text-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${currentRoleInfo.bg} ${currentRoleInfo.text} border ${currentRoleInfo.border}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>স্বয়ংক্রিয় আইডি জেনারেট হবে: <strong>{currentRoleInfo.prefix}</strong> ফরম্যাটে</span>
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" /> Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={formData.role === 'doctor' ? 'e.g. Dr. Sabrina Zaman' : 'e.g. Tanvir Hassan'}
              className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@medicare.com"
                className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="017xxxxxxxx"
                className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Present Address (বর্তমান ঠিকানা) *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. House 14, Road 5, Dhanmondi, Dhaka"
              className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
            />
          </div>

          {formData.role === 'patient' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-slate-400" /> Blood Group
              </label>
              <select
                value={formData.blood_group}
                onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
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

          {formData.role === 'doctor' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-purple-600" /> Medical Specialty
              </label>
              <input
                type="text"
                placeholder="e.g. Cardiologist / Neurologist"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
          )}

          {formData.role === 'lab_staff' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-blue-600" /> Lab Specialization / Unit
              </label>
              <input
                type="text"
                placeholder="e.g. Pathology & Sample Analyst"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          )}

          {formData.role === 'accountant' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-emerald-600" /> Finance Designation / Section
              </label>
              <input
                type="text"
                placeholder="e.g. Hospital Billing & Cashier"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full text-xs sm:text-sm pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full text-xs sm:text-sm pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-600/25 transition-all text-sm flex items-center justify-center gap-2 mt-4"
          >
            <span>{loading ? 'Creating Account & Allocating ID...' : `Register & Generate ID (${currentRoleInfo.prefix})`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an ID?{' '}
          <button
            onClick={() => setActivePage('login')}
            className="text-cyan-600 hover:text-cyan-700 font-bold underline ml-1"
          >
            Sign In with ID (P01, D101, L101, A101)
          </button>
        </div>

      </div>
    </div>
  );
};

export default Register;
