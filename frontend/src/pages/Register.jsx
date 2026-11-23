import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  sendRegistrationSMS, 
  sendRegistrationEmail, 
  formatRegistrationSMS, 
  formatRegistrationEmail 
} from '../services/notificationService';
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
  EyeOff,
  Smartphone,
  MessageSquare,
  RefreshCw,
  X,
  Send
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
  const [isResendingSms, setIsResendingSms] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [notificationAlert, setNotificationAlert] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

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

  const handleResendSMS = async () => {
    if (!registeredUser) return;
    setIsResendingSms(true);
    await new Promise(r => setTimeout(r, 600));
    await sendRegistrationSMS(registeredUser);
    setIsResendingSms(false);
    setNotificationAlert(`✓ SMS পুনরায় সফলভাবে ${registeredUser.phone} নম্বরে পাঠানো হয়েছে!`);
    setTimeout(() => setNotificationAlert(''), 4500);
  };

  const handleResendEmail = async () => {
    if (!registeredUser) return;
    setIsResendingEmail(true);
    await new Promise(r => setTimeout(r, 600));
    await sendRegistrationEmail(registeredUser);
    setIsResendingEmail(false);
    setNotificationAlert(`✓ ইমেইল পুনরায় সফলভাবে ${registeredUser.email} ঠিকানায় পাঠানো হয়েছে!`);
    setTimeout(() => setNotificationAlert(''), 4500);
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

  // If successfully registered, show Success Card with the Auto-Incremented ID, SMS & Email confirmations
  if (registeredUser) {
    const roleInfo = getRoleBadge(registeredUser.role);
    const smsContent = formatRegistrationSMS(registeredUser);
    const emailData = formatRegistrationEmail(registeredUser);

    return (
      <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-2xl w-full bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-300">
          
          {/* Success Icon */}
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              {roleInfo.label} রেজিস্ট্রেশন সম্পন্ন
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Registration Successful!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              আপনার একাউন্ট সফলভাবে তৈরি হয়েছে এবং স্বয়ংক্রিয়ভাবে ইমেইল ও মোবাইল নম্বরে কনফার্মেশন পাঠানো হয়েছে।
            </p>
          </div>

          {/* Toast Notification Alert */}
          {notificationAlert && (
            <div className="p-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-md animate-in fade-in duration-200 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{notificationAlert}</span>
            </div>
          )}

          {/* ID Highlight Box */}
          <div className={`bg-gradient-to-br ${roleInfo.bg} border-2 ${roleInfo.border} p-6 rounded-2xl text-center relative shadow-inner`}>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${roleInfo.text} block mb-1`}>
              Your Auto-Generated Permanent ID
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className={`text-4xl sm:text-5xl font-black ${roleInfo.text} font-mono tracking-wider`}>
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

          {/* DUAL NOTIFICATION STATUS: SMS & EMAIL DISPATCH CARDS */}
          <div className="space-y-3 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dispatched Notifications (প্রেরিত নোটিফিকেশন)</span>
              </h3>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Gateway Active
              </span>
            </div>

            {/* 1. Mobile Phone SMS Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">মোবাইল এসএমএস (SMS) নিশ্চিতকরণ</span>
                    <span className="text-[11px] text-slate-500 font-mono">নম্বর: {registeredUser.phone || '017XXXXXXXX'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Delivered
                  </span>
                  <button
                    type="button"
                    onClick={handleResendSMS}
                    disabled={isResendingSms}
                    className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 text-[10px] font-bold flex items-center gap-1 transition-all"
                    title="Resend SMS"
                  >
                    <RefreshCw className={`w-3 h-3 ${isResendingSms ? 'animate-spin text-emerald-600' : ''}`} />
                    <span className="hidden sm:inline">Resend</span>
                  </button>
                </div>
              </div>

              {/* SMS Message Bubble */}
              <div className="bg-white border border-slate-200/80 p-3 rounded-xl text-slate-700 text-xs font-medium space-y-1 shadow-inner">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold border-b border-slate-100 pb-1">
                  <span>Sender: MEDIHUB-SMS</span>
                  <span>Just now</span>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed pt-0.5">
                  {smsContent}
                </p>
              </div>
            </div>

            {/* 2. Official Email Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">অফিসিয়াল ইমেইল (Email) নোটিফিকেশন</span>
                    <span className="text-[11px] text-slate-500 font-mono">প্রেরিত: {registeredUser.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Inbox
                  </span>
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    disabled={isResendingEmail}
                    className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 text-[10px] font-bold flex items-center gap-1 transition-all"
                    title="Resend Email"
                  >
                    <RefreshCw className={`w-3 h-3 ${isResendingEmail ? 'animate-spin text-blue-600' : ''}`} />
                    <span className="hidden sm:inline">Resend</span>
                  </button>
                </div>
              </div>

              {/* Email Summary & Preview Action */}
              <div className="bg-white border border-slate-200/80 p-3 rounded-xl text-slate-700 text-xs font-medium space-y-2 shadow-inner flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subject Line:</span>
                  <p className="text-slate-800 font-semibold text-xs">{emailData.subject}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(true)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl border border-blue-200 transition-all text-xs flex items-center gap-1.5 shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Official Email</span>
                </button>
              </div>
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

        {/* MODAL: OFFICIAL EMAIL PREVIEW MODAL */}
        {showEmailModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              {/* Email Window Header */}
              <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-600 flex items-center justify-center text-white">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">MediCare Hub Official Email Notice</h4>
                    <p className="text-[10px] text-slate-400">no-reply@medicare-hub.com &bull; To: {registeredUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Email Body */}
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-left text-xs">
                {/* Hospital Letterhead */}
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-slate-900">MediCare Hub Hospital</h2>
                    <p className="text-[10px] text-slate-500">Dhanmondi HQ, Dhaka-1205 | 24/7 Hotline: 10666</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Verified Account
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-sm">Welcome to MediCare Hub, {registeredUser.name}!</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Your registration has been completed successfully. Your hospital credentials have been registered in our centralized database.
                  </p>
                </div>

                {/* Account Details Table */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 font-sans">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Your Account Credentials:
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Permanent Login ID:</span>
                    <span className="font-mono font-black text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      {registeredUser.patient_id}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Assigned Role:</span>
                    <span className="font-bold text-slate-800 uppercase">{registeredUser.role}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">Registered Phone:</span>
                    <span className="font-medium text-slate-800">{registeredUser.phone}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Portal Login URL:</span>
                    <span className="font-mono text-cyan-600">http://localhost:3000</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed">
                  🔒 <strong>Security Advice:</strong> Please keep your login ID and password private. If you notice any suspicious activity, immediately call our 24/7 security desk at <strong>10666</strong>.
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between items-center">
                  <span>MediCare Hub IT & Communications</span>
                  <span>System Timestamp: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

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
