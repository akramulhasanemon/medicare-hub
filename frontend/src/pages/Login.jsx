import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  User, 
  Lock, 
  LogIn, 
  AlertCircle, 
  Sparkles, 
  KeyRound, 
  ShieldCheck,
  Stethoscope,
  FlaskConical,
  Landmark,
  Eye,
  EyeOff,
  ArrowRight,
  HeartPulse,
  PhoneCall,
  CheckCircle2,
  FileText,
  Ambulance,
  ChevronRight
} from 'lucide-react';

const Login = ({ setActivePage }) => {
  const { login } = useAuth();
  const { isBn } = useLanguage();

  const [activeRole, setActiveRole] = useState('patient'); // patient | doctor | lab | accounts | admin
  const [identifier, setIdentifier] = useState('P01');
  const [password, setPassword] = useState('patient123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-configured demo credentials for instantaneous testing
  const demoAccounts = {
    patient: {
      role: 'patient',
      id: 'P01',
      pass: 'patient123',
      nameBn: 'রোগী পোর্টাল',
      nameEn: 'Patient Vault',
      badgeBn: 'PID: P01',
      badgeEn: 'PID: P01',
      color: 'teal',
      icon: User,
      descBn: 'প্রেসক্রিপশন, ল্যাব টেস্ট রিপোর্ট ও ডাক্তার অ্যাপয়েন্টমেন্ট হিস্ট্রি',
      descEn: 'Prescriptions, lab test reports and appointment history'
    },
    doctor: {
      role: 'doctor',
      id: 'D101',
      pass: 'password123',
      nameBn: 'ডাক্তার চেম্বার',
      nameEn: 'Doctor Chamber',
      badgeBn: 'BMDC Reg: D101',
      badgeEn: 'BMDC Reg: D101',
      color: 'purple',
      icon: Stethoscope,
      descBn: 'দৈনিক রোগীর সিরিয়াল, ই-প্রেসক্রিপশন রাইটার ও ক্লিনিকাল নোটস',
      descEn: 'Daily patient queue, e-prescription writer and clinical notes'
    },
    lab: {
      role: 'lab',
      id: 'L101',
      pass: 'password123',
      nameBn: 'ডায়াগনস্টিক ল্যাব',
      nameEn: 'Diagnostic LIMS',
      badgeBn: 'Lab ID: L101',
      badgeEn: 'Lab ID: L101',
      color: 'sky',
      icon: FlaskConical,
      descBn: 'প্যারামিটার এন্ট্রি, বারকোড ভেরিফিকেশন ও টেস্ট রেজাল্ট অনুমোদন',
      descEn: 'Test parameter entry, barcode scan & pathology report sign-off'
    },
    accounts: {
      role: 'accounts',
      id: 'A101',
      pass: 'password123',
      nameBn: 'অ্যাকাউন্টস সেকশন',
      nameEn: 'Hospital Billing',
      badgeBn: 'Desk: A101',
      badgeEn: 'Desk: A101',
      color: 'emerald',
      icon: Landmark,
      descBn: 'ইনভয়েস জেনারেশন, বিকাশ/নগদ পেমেন্ট রিকনসিলিয়েশন ও ক্যাশ কাউন্টার',
      descEn: 'Invoice generation, bKash/Nagad verification and billing'
    },
    admin: {
      role: 'admin',
      id: 'admin@medicare.com',
      pass: 'admin123',
      nameBn: 'সেন্ট্রাল অ্যাডমিন',
      nameEn: 'System Command',
      badgeBn: 'Root Access',
      badgeEn: 'Root Access',
      color: 'rose',
      icon: ShieldCheck,
      descBn: 'হাসপাতাল ম্যানেজমেন্ট, ইউজার রোল পারমিশন, ডাক্তার ও ল্যাব কন্ট্রোল',
      descEn: 'Hospital command center, audit logs, staff credentials control'
    }
  };

  const selectRole = (roleKey) => {
    setActiveRole(roleKey);
    setErrorMsg('');
    const acc = demoAccounts[roleKey];
    if (acc) {
      setIdentifier(acc.id);
      setPassword(acc.pass);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(identifier, password);
    setLoading(false);

    if (res.success) {
      const role = String(res.user?.role || '').toLowerCase();
      if (role === 'doctor') {
        setActivePage('doctor-portal');
      } else if (role === 'lab_staff') {
        setActivePage('lab-portal');
      } else if (role === 'accountant') {
        setActivePage('accounts-portal');
      } else if (role === 'admin') {
        setActivePage('admin');
      } else {
        setActivePage('patient-dashboard');
      }
    } else {
      setErrorMsg(
        res.message || 
        (isBn 
          ? 'লগইন ব্যর্থ হয়েছে। আপনার আইডি নম্বর অথবা পাসওয়ার্ড পুনরায় পরীক্ষা করুন।' 
          : 'Login failed. Please verify your ID or password.')
      );
    }
  };

  const currentAcc = demoAccounts[activeRole] || demoAccounts.patient;
  const RoleIcon = currentAcc.icon;

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#080C14] transition-colors overflow-hidden">
      
      {/* Ambient background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* ========================================================
            LEFT COLUMN: BRAND SHOWCASE & TRUST HIGHLIGHTS (DESKTOP)
           ======================================================== */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-teal-50/90 via-sky-50/70 to-emerald-50/80 dark:from-[#0B1526] dark:via-[#080F1E] dark:to-[#040811] border border-teal-200/80 dark:border-slate-800 shadow-xl dark:shadow-2xl relative overflow-hidden backdrop-blur-xl transition-colors">
          
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.08] dark:opacity-10 pointer-events-none"></div>

          <div>
            {/* Bespoke Medical Cross + ECG Pulse Logo */}
            <div className="flex items-center gap-3.5 mb-8">
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 via-teal-400 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/30 shrink-0">
                <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 6C16 4.89543 16.8954 4 18 4H22C23.1046 4 24 4.89543 24 6V14H32C33.1046 14 34 14.8954 34 16V20C34 21.1046 33.1046 22 32 22H24V32C24 33.1046 23.1046 34 22 34H18C16.8954 34 16 33.1046 16 32V22H8C6.89543 22 6 21.1046 6 20V16C6 14.8954 6.89543 14 8 14H16V6Z" fill="white" fillOpacity="0.22" />
                  <path d="M5 20H13L16 11L21 28L25 15L28 22H35" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="28" cy="22" r="2.2" fill="#5EEAD4" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
                    Shastho<span className="text-teal-600 dark:text-teal-400">Pulse</span>
                  </span>
                  <span className="text-[10px] font-bold bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-500/30">
                    BD HEALTH
                  </span>
                </div>
                <div className="text-xs text-teal-700 dark:text-teal-200/80 font-medium font-bn">
                  {isBn ? 'ডিজিটাল স্মার্ট স্বাস্থ্যসেবা ও পেশেন্ট ভল্ট' : 'Digital Smart Healthcare & Patient Vault'}
                </div>
              </div>
            </div>

            {/* Hero Heading & Value Proposition */}
            <div className="space-y-3 mb-8">
              <h1 className="text-3xl xl:text-4xl font-black text-slate-900 dark:text-white leading-tight font-bn">
                {isBn ? (
                  <>
                    আপনার স্বাস্থ্য সুরক্ষায় <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-sky-600 to-teal-500 dark:from-teal-400 dark:via-sky-300 dark:to-teal-200">
                      ডিজিটাল সমন্বিত স্পন্দন
                    </span>
                  </>
                ) : (
                  <>
                    Connected Digital Healthcare <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-sky-600 to-teal-500 dark:from-teal-400 dark:via-sky-300 dark:to-teal-200">
                      At Your Fingertips
                    </span>
                  </>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-bn">
                {isBn 
                  ? 'এক প্ল্যাটফর্মেই বিএমডিসি ভেরিফাইড ডাক্তার কনসালটেশন, প্রেসক্রিপশন হিস্ট্রি, অনলাইন ডায়াগনস্টিক রিপোর্ট এবং ২৪/৭ জরুরি অ্যাম্বুলেন্স সেবা।'
                  : 'All-in-one portal for BMDC-registered doctors, encrypted patient health vault, accredited laboratory diagnostics, and 24/7 emergency dispatch.'}
              </p>
            </div>

            {/* 3 Interactive Feature Pills */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-teal-100 dark:border-white/10 shadow-sm backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {isBn ? '১০০% বিএমডিসি ও ডিজিএইচএস ভেরিফাইড' : 'BMDC & DGHS Verified Doctors'}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 font-bn">
                    {isBn ? 'প্রত্যেক চিকিৎসকের পেশাগত লাইসেন্স সরাসরি ডাটাবেসে ভেরিফাইড।' : 'All medical specialists are authenticated against national medical registries.'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-sky-100 dark:border-white/10 shadow-sm backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {isBn ? 'আজীবন এনক্রিপ্টেড পেশেন্ট রেকর্ড (PID)' : 'Encrypted Lifetime Patient Vault (PID)'}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 font-bn">
                    {isBn ? 'আপনার প্রেসক্রিপশন ও টেস্ট রিপোর্ট সুরক্ষিত থাকবে সবসময়।' : 'Prescriptions and lab records secured with end-to-end 256-bit encryption.'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/80 dark:bg-white/5 border border-rose-100 dark:border-white/10 shadow-sm backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0">
                  <Ambulance className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {isBn ? '১৫ মিনিটে ইমার্জেন্সি রেসপন্স' : '15-Minute Emergency Network'}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 font-bn">
                    {isBn ? 'জাতীয় জরুরি সেবা ৯৯৯ ও হাসপাতাল অ্যাম্বুলেন্স কন্ট্রোল কানেক্টেড।' : 'Fastest emergency ambulance dispatch with live GPS tracking across 64 districts.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Compliance & Security Assurance */}
          <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span>256-Bit SSL Encrypted Vault</span>
            </div>
            <div className="text-teal-700 dark:text-teal-300 font-bold">
              DGHS Approved Platform
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: INTERACTIVE AUTH & ROLE-SWITCHER CARD
           ======================================================== */}
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-center">
          <div className="bg-white/95 dark:bg-[#0F172A]/90 backdrop-blur-2xl p-6 sm:p-9 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl dark:shadow-2xl transition-all">
            
            {/* Header: Title & Language Hint */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>{isBn ? 'স্বাস্থ্যপালস অথেন্টিকেশন' : 'ShasthoPulse Authentication'}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">v2.4 Live</span>
              </div>

              <h2 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-bn">
                {isBn ? 'অ্যাকাউন্টে সাইন ইন করুন' : 'Sign In to Your Portal'}
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-bn">
                {isBn 
                  ? 'আপনার নির্দিষ্ট ভূমিকা সিলেক্ট করুন এবং দ্রুত ড্যাশবোর্ডে প্রবেশ করুন।' 
                  : 'Select your role below or enter your registered medical credentials.'}
              </p>
            </div>

            {/* 1-Click Role Switcher Segmented Tabs */}
            <div className="mb-6">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                <span>{isBn ? 'রোল নির্বাচন করুন (১-ক্লিকে অটোফিল):' : 'Select Portal Role (1-Click Fill):'}</span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">{isBn ? 'সরাসরি টেস্ট করুন' : 'Instant Demo Test'}</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                
                {/* 1. Patient */}
                <button
                  type="button"
                  onClick={() => selectRole('patient')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all ${
                    activeRole === 'patient'
                      ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-md border border-teal-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4 mb-1" />
                  <span className="text-[11px] font-bold leading-none">{isBn ? 'রোগী' : 'Patient'}</span>
                </button>

                {/* 2. Doctor */}
                <button
                  type="button"
                  onClick={() => selectRole('doctor')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all ${
                    activeRole === 'doctor'
                      ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-md border border-purple-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 mb-1" />
                  <span className="text-[11px] font-bold leading-none">{isBn ? 'ডাক্তার' : 'Doctor'}</span>
                </button>

                {/* 3. Lab */}
                <button
                  type="button"
                  onClick={() => selectRole('lab')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all ${
                    activeRole === 'lab'
                      ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-md border border-sky-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FlaskConical className="w-4 h-4 mb-1" />
                  <span className="text-[11px] font-bold leading-none">{isBn ? 'ল্যাব' : 'Lab'}</span>
                </button>

                {/* 4. Accounts */}
                <button
                  type="button"
                  onClick={() => selectRole('accounts')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all ${
                    activeRole === 'accounts'
                      ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-md border border-emerald-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Landmark className="w-4 h-4 mb-1" />
                  <span className="text-[11px] font-bold leading-none">{isBn ? 'বিলিং' : 'Billing'}</span>
                </button>

                {/* 5. Admin */}
                <button
                  type="button"
                  onClick={() => selectRole('admin')}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all ${
                    activeRole === 'admin'
                      ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-md border border-rose-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 mb-1" />
                  <span className="text-[11px] font-bold leading-none">{isBn ? 'অ্যাডমিন' : 'Admin'}</span>
                </button>
              </div>

              {/* Active Role Quick Context Card */}
              <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <RoleIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <span>{isBn ? currentAcc.nameBn : currentAcc.nameEn}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {isBn ? currentAcc.badgeBn : currentAcc.badgeEn}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 font-bn">
                      {isBn ? currentAcc.descBn : currentAcc.descEn}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => selectRole(activeRole)}
                  className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold shrink-0 transition-colors"
                >
                  {isBn ? 'ফিল করুন' : 'Auto Fill'}
                </button>
              </div>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-bn">{errorMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Field 1: Identifier */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between font-bn">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>{isBn ? 'ইউজার আইডি / ইমেইল ঠিকানা *' : 'User ID / Email Address *'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">P01, D101, L101</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={isBn ? 'যেমন: P01 অথবা doctor@medicare.com' : 'e.g. P01 or doctor@medicare.com'}
                    className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all font-mono text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between font-bn">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isBn ? 'গোপন পাসওয়ার্ড *' : 'Account Password *'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">patient123 / password123</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs sm:text-sm pl-4 pr-11 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all font-mono text-slate-800 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs pt-1 font-bn">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700" 
                  />
                  <span>{isBn ? 'ডিভাইসে মনে রাখুন' : 'Remember this session'}</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    alert(
                      isBn 
                        ? 'পাসওয়ার্ড রিসেটের জন্য অ্যাডমিন হটলাইনে কল দিন: +880 1700-000000 অথবা সাপোর্ট ডেস্কে যোগাযোগ করুন।' 
                        : 'Contact IT Admin helpline at +880 1700-000000 to reset your portal password.'
                    );
                  }}
                  className="text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                >
                  {isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                </button>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 via-teal-500 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 active:scale-[0.99] transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="font-bn">{isBn ? 'যাচাই করা হচ্ছে...' : 'Verifying credentials...'}</span>
                    </div>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span className="font-bn">{isBn ? 'সরাসরি সাইন ইন করুন' : 'Sign In to Portal'}</span>
                      <ArrowRight className="w-4 h-4 ml-1 opacity-75" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Bottom New Patient Registration Link */}
            <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bn">
                {isBn ? 'নতুন রোগী হিসেবে অ্যাকাউন্ট নেই?' : "Don't have a Patient Account?"}
              </span>
              <button
                type="button"
                onClick={() => setActivePage('register')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-500/30 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 font-bold transition-colors font-bn"
              >
                <span>{isBn ? 'নতুন পেশেন্ট আইডি (PID) তৈরি করুন' : 'Create Patient PID'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
