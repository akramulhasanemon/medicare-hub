import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  sendRegistrationSMS, 
  sendRegistrationEmail, 
  formatRegistrationSMS, 
  formatRegistrationEmail,
  getGmailComposeUrl,
  getMailtoUrl,
  getWhatsAppShareUrl,
  getMobileSmsUrl,
  getSmsGatewayConfig,
  setSmsGatewayConfig
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
  Send,
  ExternalLink,
  Settings,
  Key
} from 'lucide-react';

const Register = ({ setActivePage }) => {
  const { register } = useAuth();
  const { isBn } = useLanguage();
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
  const [showSmsConfigModal, setShowSmsConfigModal] = useState(false);
  const [smsGatewayConfig, setSmsGatewayConfigState] = useState(() => getSmsGatewayConfig());

  const handleSaveSmsGateway = (e) => {
    e.preventDefault();
    setSmsGatewayConfig(smsGatewayConfig);
    setShowSmsConfigModal(false);
    setNotificationAlert('✓ SMS Gateway API Key সফলভাবে সেভ করা হয়েছে! এখন থেকে বাস্তব ফোনে অটোমেটিক SMS যাবে।');
    setTimeout(() => setNotificationAlert(''), 5000);
  };

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
        return { label: isBn ? 'ডাক্তার বিশেষজ্ঞ অ্যাকাউন্ট' : 'Doctor Specialist Account', prefix: 'D10X', color: 'from-purple-600 to-indigo-600', text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40', border: 'border-purple-200 dark:border-purple-800' };
      case 'lab_staff':
        return { label: isBn ? 'ল্যাব টেকনোলজিস্ট অ্যাকাউন্ট' : 'Lab Technologist Account', prefix: 'L10X', color: 'from-sky-600 to-teal-600', text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/40', border: 'border-sky-200 dark:border-sky-800' };
      case 'accountant':
        return { label: isBn ? 'অ্যাকাউন্টস সেকশন অ্যাকাউন্ট' : 'Accounts Section Account', prefix: 'A10X', color: 'from-emerald-600 to-teal-600', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800' };
      default:
        return { label: isBn ? 'রোগী মেডিকেল অ্যাকাউন্ট (PID)' : 'Patient Medical Vault (PID)', prefix: 'P0X', color: 'from-teal-600 to-sky-600', text: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/40', border: 'border-teal-200 dark:border-teal-800' };
    }
  };

  const currentRoleInfo = getRoleBadge(formData.role);

  // If successfully registered, show Success Card with the Auto-Incremented ID, SMS & Email confirmations
  if (registeredUser) {
    const roleInfo = getRoleBadge(registeredUser.role);
    const smsContent = formatRegistrationSMS(registeredUser);
    const emailData = formatRegistrationEmail(registeredUser);

    return (
      <div className="min-h-[92vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#080C14] transition-colors">
        <div className="max-w-2xl w-full bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl text-center space-y-6">
          
          {/* Success Icon */}
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2 font-bn">
              {roleInfo.label} {isBn ? 'রেজিস্ট্রেশন সম্পন্ন' : 'Registration Completed'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-bn">
              {isBn ? 'রেজিস্ট্রেশন সফল হয়েছে!' : 'Registration Successful!'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bn">
              {isBn 
                ? 'আপনার একাউন্ট সফলভাবে তৈরি হয়েছে এবং স্বয়ংক্রিয়ভাবে ইমেইল ও মোবাইল নম্বরে কনফার্মেশন পাঠানো হয়েছে।'
                : 'Your account has been created. Instant credentials sent to your phone and email.'}
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
            <span className={`text-[11px] font-bold uppercase tracking-wider ${roleInfo.text} block mb-1 font-bn`}>
              {isBn ? 'আপনার অটো-জেনারেটেড পার্মানেন্ট আইডি' : 'Your Auto-Generated Permanent ID'}
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className={`text-4xl sm:text-5xl font-black ${roleInfo.text} font-mono tracking-wider`}>
                {registeredUser.patient_id}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                title="Copy ID"
                className="p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">
                ✓ Login ID copied to clipboard!
              </span>
            )}
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-3 bg-white/80 dark:bg-slate-900/80 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bn">
              💡 <strong>{isBn ? 'লগইন করার নিয়ম:' : 'How to sign in:'}</strong> {isBn ? 'পরবর্তীতে লগইন করার সময় আপনার আইডি' : 'Use your assigned ID'} (<strong className={`font-mono ${roleInfo.text}`}>{registeredUser.patient_id}</strong>) {isBn ? 'এবং পাসওয়ার্ড ব্যবহার করবেন।' : 'and password on the login screen.'}
            </p>
          </div>

          {/* DUAL NOTIFICATION STATUS: SMS & EMAIL DISPATCH CARDS */}
          <div className="space-y-3 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5 font-bn">
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
                <div className="flex items-center gap-1.5">
                  {smsGatewayConfig.apiKey ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Auto Cellular Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                      Queue Mode
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowSmsConfigModal(true)}
                    className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-[10px] font-bold flex items-center gap-1 transition-all"
                    title="SMS Gateway API Key Setup"
                  >
                    <Key className="w-3 h-3 text-amber-600" />
                    <span className="hidden sm:inline">Gateway Key</span>
                  </button>
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
              <div className="bg-white border border-slate-200/80 p-3 rounded-xl text-slate-700 text-xs font-medium space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold border-b border-slate-100 pb-1">
                  <span>Sender: MEDIHUB-SMS</span>
                  <span>Just now</span>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {smsContent}
                </p>

                {/* 1-Click Mobile Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                  <a
                    href={getMobileSmsUrl(registeredUser)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-xl text-[11px] transition-all shadow-sm"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Open in Mobile SMS App</span>
                  </a>

                  <a
                    href={getWhatsAppShareUrl(registeredUser)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-[11px] transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-white" />
                    <span>Send to WhatsApp</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                </div>
              </div>
            </div>

            {/* 2. Official Email Card with Real Gmail Integration */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 hover:border-red-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 text-red-700 rounded-xl">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">অফিসিয়াল ইমেইল (Gmail) নোটিফিকেশন</span>
                    <span className="text-[11px] text-slate-500 font-mono">প্রেরিত: {registeredUser.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Sent to Inbox
                  </span>
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    disabled={isResendingEmail}
                    className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 text-[10px] font-bold flex items-center gap-1 transition-all"
                    title="Resend Email"
                  >
                    <RefreshCw className={`w-3 h-3 ${isResendingEmail ? 'animate-spin text-red-600' : ''}`} />
                    <span className="hidden sm:inline">Resend</span>
                  </button>
                </div>
              </div>

              {/* Email Summary & 1-Click Gmail Action Bar */}
              <div className="bg-white border border-slate-200/80 p-3 rounded-xl text-slate-700 text-xs font-medium space-y-2.5 shadow-inner">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subject Line:</span>
                    <p className="text-slate-800 font-semibold text-xs">{emailData.subject}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(true)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all text-xs flex items-center gap-1.5 shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Letterhead</span>
                  </button>
                </div>

                {/* 1-Click Real Gmail Direct Launch Button */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <a
                    href={getGmailComposeUrl(registeredUser)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all text-xs"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Open in Gmail (সরাসরি জিমেইলে পাঠান ও দেখুন)</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  <a
                    href={getMailtoUrl(registeredUser)}
                    className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-3 rounded-xl border border-slate-200 transition-all text-xs shrink-0"
                    title="Open native mail client"
                  >
                    <span>Mail App</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
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

        {/* MODAL: SMS GATEWAY API KEY SETUP (FOR REAL AUTOMATED MOBILE SMS) */}
        {showSmsConfigModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold">Cellular SMS Gateway Setup (অটোমেটিক SMS)</h4>
                </div>
                <button
                  onClick={() => setShowSmsConfigModal(false)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveSmsGateway} className="p-6 space-y-4 text-left text-xs">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed">
                  📢 <strong>টেলিকম গেটওয়ে তথ্য:</strong> আপনার দেওয়া ফোন নম্বরে (যেমন: <strong>{registeredUser.phone}</strong>) কোনো বাটন ক্লিক ছাড়া সরাসরি অটোমেটিক এসএমএস পাঠাতে একটি SMS গেটওয়ে API Key প্রয়োজন।
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Gateway Provider</label>
                  <select
                    value={smsGatewayConfig.provider || 'bulksmsbd'}
                    onChange={(e) => setSmsGatewayConfigState({ ...smsGatewayConfig, provider: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="bulksmsbd">BulkSMSBD (www.bulksmsbd.com) - রিকমেন্ডেড</option>
                    <option value="greenweb">Greenweb BD (api.greenweb.com.bd)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">API Key / Token *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. gDkX4... আপনার গেটওয়ে API Key"
                    value={smsGatewayConfig.apiKey || ''}
                    onChange={(e) => setSmsGatewayConfigState({ ...smsGatewayConfig, apiKey: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-cyan-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    BulkSMSBD বা Greenweb-এ সাইনআপ করে রিচার্জ করলে তারা সাথে সাথে একটি API Key দেয়।
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sender ID (ঐচ্ছিক / Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 8809612443880 or MediCare"
                    value={smsGatewayConfig.senderId || ''}
                    onChange={(e) => setSmsGatewayConfigState({ ...smsGatewayConfig, senderId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowSmsConfigModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md"
                  >
                    Save & Enable Auto SMS
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="min-h-[92vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#080C14] transition-colors">
      <div className="max-w-xl w-full space-y-6 bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl">
        
        {/* Header with Bespoke ShasthoPulse Logo */}
        <div className="text-center">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 via-teal-400 to-sky-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-teal-500/30 mb-3">
            <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 6C16 4.89543 16.8954 4 18 4H22C23.1046 4 24 4.89543 24 6V14H32C33.1046 14 34 14.8954 34 16V20C34 21.1046 33.1046 22 32 22H24V32C24 33.1046 23.1046 34 22 34H18C16.8954 34 16 33.1046 16 32V22H8C6.89543 22 6 21.1046 6 20V16C6 14.8954 6.89543 14 8 14H16V6Z" fill="white" fillOpacity="0.22" />
              <path d="M5 20H13L16 11L21 28L25 15L28 22H35" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="28" cy="22" r="2.2" fill="#5EEAD4" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-bn">
            {isBn ? 'স্বাস্থ্যপালস পোর্টাল রেজিস্ট্রেশন' : 'ShasthoPulse Portal Registration'}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-bn">
            {isBn 
              ? 'রোগী (PID), ডাক্তার (D101+), ল্যাব স্টাফ (L101+), অথবা অ্যাকাউন্টস সেকশন (A101+) অ্যাকাউন্ট তৈরি করুন' 
              : 'Create an account for Patient (PID), Doctor, Lab Technologist, or Hospital Billing'}
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 font-bn">
            {isBn ? 'ভূমিকা বা অ্যাকাউন্ট টাইপ নির্বাচন করুন:' : 'Select Your Account Type:'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'patient' })}
              className={`p-3 rounded-2xl border text-center transition-all ${
                formData.role === 'patient'
                  ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 shadow-sm font-bold ring-2 ring-teal-500/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <User className="w-4 h-4 mx-auto mb-1 text-teal-600 dark:text-teal-400" />
              <div className="text-xs font-bold font-bn">{isBn ? 'রোগী' : 'Patient'}</div>
              <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 block font-bold">P01+</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'doctor' })}
              className={`p-3 rounded-2xl border text-center transition-all ${
                formData.role === 'doctor'
                  ? 'border-purple-500 bg-purple-50/80 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 shadow-sm font-bold ring-2 ring-purple-500/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Stethoscope className="w-4 h-4 mx-auto mb-1 text-purple-600 dark:text-purple-400" />
              <div className="text-xs font-bold font-bn">{isBn ? 'ডাক্তার' : 'Doctor'}</div>
              <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 block font-bold">D101+</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'lab_staff' })}
              className={`p-3 rounded-2xl border text-center transition-all ${
                formData.role === 'lab_staff'
                  ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 shadow-sm font-bold ring-2 ring-sky-500/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <FlaskConical className="w-4 h-4 mx-auto mb-1 text-sky-600 dark:text-sky-400" />
              <div className="text-xs font-bold font-bn">{isBn ? 'ল্যাব স্টাফ' : 'Lab Staff'}</div>
              <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 block font-bold">L101+</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'accountant' })}
              className={`p-3 rounded-2xl border text-center transition-all ${
                formData.role === 'accountant'
                  ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 shadow-sm font-bold ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Landmark className="w-4 h-4 mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
              <div className="text-xs font-bold font-bn">{isBn ? 'অ্যাকাউন্টস' : 'Accounts'}</div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block font-bold">A101+</span>
            </button>
          </div>

          <div className="mt-2 text-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${currentRoleInfo.bg} ${currentRoleInfo.text} border ${currentRoleInfo.border} font-bn`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isBn ? 'স্বয়ংক্রিয় আইডি বরাদ্দ হবে:' : 'Auto-allocated ID Format:'} <strong className="font-mono">{currentRoleInfo.prefix}</strong></span>
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 font-bn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5 font-bn">
              <User className="w-3.5 h-3.5 text-slate-400" /> {isBn ? 'পুরো নাম *' : 'Full Name *'}
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={formData.role === 'doctor' ? (isBn ? 'যেমন: ডা. সাবরিনা জামান' : 'e.g. Dr. Sabrina Zaman') : (isBn ? 'যেমন: তানভীর হাসান' : 'e.g. Tanvir Hassan')}
              className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5 font-bn">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {isBn ? 'ইমেইল ঠিকানা *' : 'Email Address *'}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@medicare.com"
                className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5 font-bn">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {isBn ? 'ফোন নম্বর *' : 'Phone Number *'}
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="017xxxxxxxx"
                className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5 font-bn">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {isBn ? 'বর্তমান ঠিকানা *' : 'Present Address *'}
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder={isBn ? 'যেমন: বাড়ি ১৪, রোড ৫, ধানমন্ডি, ঢাকা' : 'e.g. House 14, Road 5, Dhanmondi, Dhaka'}
              className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800 dark:text-slate-100"
            />
          </div>

          {formData.role === 'patient' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5 font-bn">
                <Droplet className="w-3.5 h-3.5 text-slate-400" /> {isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}
              </label>
              <select
                value={formData.blood_group}
                onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800 dark:text-slate-100"
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
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5 font-bn">
                <Stethoscope className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> {isBn ? 'মেডিকেল স্পেশালিটি' : 'Medical Specialty'}
              </label>
              <input
                type="text"
                placeholder={isBn ? 'যেমন: হৃদরোগ বিশেষজ্ঞ / মেডিসিন' : 'e.g. Cardiologist / Neurologist'}
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-slate-800 dark:text-slate-100"
              />
            </div>
          )}

          {formData.role === 'lab_staff' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5 font-bn">
                <FlaskConical className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> {isBn ? 'ল্যাব স্পেশালাইজেশন / বিভাগ' : 'Lab Unit'}
              </label>
              <input
                type="text"
                placeholder={isBn ? 'যেমন: প্যাথলজি ও স্যাম্পল অ্যানালিস্ট' : 'e.g. Pathology & Sample Analyst'}
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-800 dark:text-slate-100"
              />
            </div>
          )}

          {formData.role === 'accountant' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5 font-bn">
                <Landmark className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {isBn ? 'ফিন্যান্স পদবি / শাখা' : 'Finance Section'}
              </label>
              <input
                type="text"
                placeholder={isBn ? 'যেমন: বিলিং অফিসার ও ক্যাশিয়ার' : 'e.g. Hospital Billing & Cashier'}
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 dark:text-slate-100"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5 font-bn">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> {isBn ? 'পাসওয়ার্ড *' : 'Password *'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full text-xs sm:text-sm pl-4 pr-11 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5 font-bn">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> {isBn ? 'পাসওয়ার্ড নিশ্চিতকরণ *' : 'Confirm Password *'}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full text-xs sm:text-sm pl-4 pr-11 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-500/25 transition-all text-sm flex items-center justify-center gap-2 mt-4 font-bn"
          >
            <span>{loading ? (isBn ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'Creating Account...') : (isBn ? `রেজিস্ট্রেশন করুন ও আইডি নিন (${currentRoleInfo.prefix})` : `Register & Generate ID (${currentRoleInfo.prefix})`)}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 font-bn">
          {isBn ? 'পূর্বেই একাউন্ট রয়েছে?' : 'Already have an ID?'}
          <button
            onClick={() => setActivePage('login')}
            className="text-teal-600 dark:text-teal-400 hover:text-teal-700 font-bold underline ml-1"
          >
            {isBn ? 'সরাসরি আইডি দিয়ে সাইন ইন করুন' : 'Sign In with ID'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Register;
