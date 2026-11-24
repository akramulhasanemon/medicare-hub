import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  HeartPulse, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Calendar, 
  Menu, 
  X, 
  PhoneCall,
  ShieldAlert,
  Pill,
  FlaskConical,
  Bot,
  Activity,
  Siren,
  Stethoscope,
  Landmark,
  Search,
  Sun,
  Moon,
  Globe,
  FileSearch
} from 'lucide-react';

const Navbar = ({ activePage, setActivePage, onOpenTracker }) => {
  const { user, logout } = useAuth();
  const { openBookingModal, openEmergencyModal, cart } = useData();
  const { isDark, toggleTheme } = useTheme();
  const { isBn, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const navigateTo = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 glass dark:bg-[#080C14]/95 border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors duration-300">
      
      {/* ========================================================
          1. Top Emergency SOS Bar (Zero AI Emojis)
         ======================================================== */}
      <div className="bg-rose-600 dark:bg-rose-700 text-white text-xs py-1.5 px-4 sm:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-2">
          
          <div className="flex items-center gap-2.5">
            <Siren className="w-4 h-4 text-white animate-pulse shrink-0" />
            <span className="font-medium">
              {isBn ? (
                <>জাতীয় জরুরি সেবা: <strong className="font-bold underline">999</strong> &nbsp;|&nbsp; ২৪/৭ অ্যাম্বুলেন্স ও ডাক্তার সহায়তা:</>
              ) : (
                <>National Emergency: <strong className="font-bold underline">999</strong> &nbsp;|&nbsp; 24/7 Ambulance & Doctor Helpline:</>
              )}
            </span>
            <a href="tel:+8801700000000" className="font-bold tracking-wider hover:underline text-rose-100 font-en">
              +880 1700-000000
            </a>
            <span className="hidden sm:inline-flex items-center gap-1.5 ml-2">
              <span className="pulse-dot"></span>
              <span className="text-[11px] font-semibold text-rose-100 ml-1">
                {isBn ? 'সক্রিয়' : 'Live'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={openEmergencyModal}
              className="flex items-center gap-1.5 text-xs font-bold bg-white text-rose-700 hover:bg-rose-50 px-3 py-1 rounded-full shadow-sm transition-all"
            >
              <Siren className="w-3.5 h-3.5 text-rose-600" />
              <span>{isBn ? 'জরুরি অ্যাম্বুলেন্স কল' : 'Instant Ambulance SOS'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. Main Navigation Bar
         ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo (ShasthoPulse | স্বাস্থ্যপালস) */}
        <div 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3.5 cursor-pointer group shrink-0"
        >
          {/* Bespoke HealthTech SVG Icon */}
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/30 group-hover:scale-105 transition-transform shrink-0">
            <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 6C16 4.89543 16.8954 4 18 4H22C23.1046 4 24 4.89543 24 6V14H32C33.1046 14 34 14.8954 34 16V20C34 21.1046 33.1046 22 32 22H24V32C24 33.1046 23.1046 34 22 34H18C16.8954 34 16 33.1046 16 32V22H8C6.89543 22 6 21.1046 6 20V16C6 14.8954 6.89543 14 8 14H16V6Z" fill="white" fillOpacity="0.22" />
              <path d="M5 20H13L16 11L21 28L25 15L28 22H35" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="28" cy="22" r="2.2" fill="#5EEAD4" />
            </svg>
          </div>
          <div className="leading-tight">
            {isBn ? (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-bn tracking-tight">
                    স্বাস্থ্য<span className="text-teal-600 dark:text-teal-400">পালস</span>
                  </span>
                  <span className="text-[10px] font-bold bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-700/50">
                    BD
                  </span>
                </div>
                <div className="text-[11px] text-teal-700 dark:text-teal-400 font-medium font-bn">
                  ডিজিটাল স্মার্ট স্বাস্থ্যসেবা
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-en tracking-tight">
                    Shastho<span className="text-teal-600 dark:text-teal-400">Pulse</span>
                  </span>
                  <span className="text-[10px] font-bold bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-700/50">
                    BD
                  </span>
                </div>
                <div className="text-[11px] text-teal-700 dark:text-teal-400 font-medium font-en">
                  Smart Digital Healthcare
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6">
          <button 
            onClick={() => navigateTo('home')} 
            className={`text-xs font-bold transition-colors ${
              activePage === 'home' 
                ? 'text-teal-600 dark:text-teal-400 font-extrabold' 
                : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
            }`}
          >
            {isBn ? 'হোম' : 'Home'}
          </button>
          
          <button 
            onClick={() => navigateTo('doctors')} 
            className={`text-xs font-bold transition-colors ${
              activePage === 'doctors' 
                ? 'text-teal-600 dark:text-teal-400 font-extrabold' 
                : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
            }`}
          >
            {isBn ? 'ডাক্তারগণ' : 'Doctors'}
          </button>

          <button 
            onClick={() => navigateTo('pharmacy')} 
            className={`text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activePage === 'pharmacy' 
                ? 'text-teal-600 dark:text-teal-400 font-extrabold' 
                : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-teal-500" />
            <span>{isBn ? 'ফার্মেসি' : 'Pharmacy'}</span>
            {cartCount > 0 && (
              <span className="bg-teal-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => navigateTo('lab-tests')} 
            className={`text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activePage === 'lab-tests' 
                ? 'text-teal-600 dark:text-teal-400 font-extrabold' 
                : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-sky-500" />
            <span>{isBn ? 'ল্যাব টেস্ট' : 'Lab Tests'}</span>
          </button>

          <button 
            onClick={() => navigateTo('symptom-checker')} 
            className={`text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activePage === 'symptom-checker' 
                ? 'text-teal-600 dark:text-teal-400 font-extrabold' 
                : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-cyan-500" />
            <span>{isBn ? 'সিম্পটম চেকার' : 'Symptom AI'}</span>
          </button>

          <button 
            onClick={() => navigateTo('health-tools')} 
            className={`text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activePage === 'health-tools' 
                ? 'text-teal-600 dark:text-teal-400 font-extrabold' 
                : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-purple-500" />
            <span>{isBn ? 'টুলস ও ক্যালকুলেটর' : 'Health Tools'}</span>
          </button>

          {/* Quick Lab Report Tracker Trigger */}
          {onOpenTracker && (
            <button
              onClick={onOpenTracker}
              title="Track Lab Report by Lab ID"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-dashed border-slate-300 dark:border-slate-700"
            >
              <FileSearch className="w-3.5 h-3.5 text-teal-500" />
              <span>{isBn ? 'রিপোর্ট ট্র্যাকার' : 'Report Tracker'}</span>
            </button>
          )}
        </nav>

        {/* ========================================================
            3. Right Actions: Language, Theme & User Auth
           ======================================================== */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Language Switcher (EN | বাংলা) */}
          <button
            onClick={toggleLanguage}
            title="Switch Language (ইংরেজি / বাংলা)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className={isBn ? 'font-en text-[11px]' : 'font-bn text-[11px]'}>
              {isBn ? 'EN' : 'বাংলা'}
            </span>
          </button>

          {/* Theme Switcher (Animated Sun/Moon) */}
          <button
            onClick={toggleTheme}
            title={isDark ? (isBn ? 'লাইট মোড চালু করুন (Switch to Light Mode)' : 'Switch to Light Mode') : (isBn ? 'ডার্ক মোড চালু করুন (Switch to Dark Mode)' : 'Switch to Dark Mode')}
            className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
          >
            {isDark ? (
              <Moon className="w-4 h-4 text-teal-400 hover:-rotate-12 transition-transform" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500 hover:rotate-45 transition-transform" />
            )}
          </button>

          {/* User Account / Role Buttons */}
          {user ? (
            <div className="flex items-center gap-2.5">
              {user.role === 'admin' ? (
                <button
                  onClick={() => navigateTo('admin')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePage === 'admin'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-purple-500" />
                  {isBn ? 'অ্যাডমিন কনসোল' : 'Admin Console'}
                </button>
              ) : user.role === 'doctor' ? (
                <button
                  onClick={() => navigateTo('doctor-portal')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePage === 'doctor-portal'
                      ? 'bg-purple-700 text-white shadow-md'
                      : 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-purple-500" />
                  {isBn ? 'ডাক্তার চেম্বার' : 'Doctor Chamber'}
                </button>
              ) : user.role === 'lab_staff' ? (
                <button
                  onClick={() => navigateTo('lab-portal')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePage === 'lab-portal'
                      ? 'bg-sky-700 text-white shadow-md'
                      : 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 hover:bg-sky-100'
                  }`}
                >
                  <FlaskConical className="w-4 h-4 text-sky-500" />
                  {isBn ? 'ল্যাব পোর্টাল' : 'Lab LIMS'}
                </button>
              ) : user.role === 'accountant' ? (
                <button
                  onClick={() => navigateTo('accounts-portal')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePage === 'accounts-portal'
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-emerald-500" />
                  {isBn ? 'অ্যাকাউন্টস ও বিলিং' : 'Billing & Accounts'}
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('patient-dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePage === 'patient-dashboard'
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                      : 'bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 hover:bg-teal-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {isBn ? 'মেডিকেল ভল্ট (PID)' : 'Patient Vault (PID)'}
                </button>
              )}

              {/* User greeting badge */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 py-1 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left text-xs leading-tight">
                  <span className="font-semibold text-slate-800 dark:text-slate-100 block truncate max-w-[130px] sm:max-w-[160px]">
                    {user.name}
                  </span>
                  {user.patient_id ? (
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono font-bold block">
                      ID: {user.patient_id}
                    </span>
                  ) : (
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block capitalize">
                      {user.role}
                    </span>
                  )}
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                title={isBn ? 'লগআউট' : 'Logout'}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateTo('login')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-teal-500/30 bg-teal-50/70 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold text-xs transition-colors shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>{isBn ? 'সাইন ইন / লগইন' : 'Sign In / Login'}</span>
              </button>
              <button
                onClick={() => {
                  if (!user) {
                    navigateTo('login');
                  } else {
                    openBookingModal();
                  }
                }}
                className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-teal-500/20 transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{isBn ? 'অ্যাপয়েন্টমেন্ট' : 'Appointment'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <div className="xl:hidden flex items-center gap-2">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? (isBn ? 'লাইট মোড চালু করুন (Switch to Light Mode)' : 'Switch to Light Mode') : (isBn ? 'ডার্ক মোড চালু করুন (Switch to Dark Mode)' : 'Switch to Dark Mode')}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200"
          >
            {isDark ? <Moon className="w-4 h-4 text-teal-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
          {/* Mobile Lang Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200"
          >
            {isBn ? 'EN' : 'বাং'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ========================================================
          4. Mobile Responsive Menu
         ======================================================== */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-[#0c101c] border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2 shadow-xl">
          <button
            onClick={() => navigateTo('home')}
            className="block w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {isBn ? 'হোম' : 'Home'}
          </button>
          <button
            onClick={() => navigateTo('doctors')}
            className="block w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {isBn ? 'ডাক্তারগণ' : 'Doctors Directory'}
          </button>
          <button
            onClick={() => navigateTo('pharmacy')}
            className="flex items-center justify-between w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20"
          >
            <span className="flex items-center gap-2"><Pill className="w-4 h-4" /> {isBn ? 'অনলাইন ফার্মেসি' : 'Online Pharmacy'}</span>
            {cartCount > 0 && <span className="bg-teal-600 text-white px-2 py-0.5 rounded-full text-[10px]">{cartCount}</span>}
          </button>
          <button
            onClick={() => navigateTo('lab-tests')}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-sky-700 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20"
          >
            <FlaskConical className="w-4 h-4" /> {isBn ? 'ল্যাব টেস্ট ও ডায়াগনস্টিক' : 'Lab Tests & Diagnostics'}
          </button>
          <button
            onClick={() => navigateTo('symptom-checker')}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
          >
            <Bot className="w-4 h-4" /> {isBn ? 'এআই সিম্পটম চেকার' : 'AI Symptom Checker'}
          </button>
          <button
            onClick={() => navigateTo('health-tools')}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <Activity className="w-4 h-4" /> {isBn ? 'হেলথ ও বিএমআই টুলস' : 'Health & BMI Tools'}
          </button>
          <button
            onClick={() => { openEmergencyModal(); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <Siren className="w-4 h-4 text-rose-600" /> {isBn ? '২৪/৭ অ্যাম্বুলেন্স এসওএস' : '24/7 Ambulance SOS'}
          </button>

          {user ? (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="px-3 py-1 text-xs text-slate-400">
                {isBn ? 'সাইন ইন আছেন: ' : 'Signed in as '} 
                <span className="font-semibold text-slate-700 dark:text-slate-200">{user.name}</span>
              </div>
              <button
                onClick={() => navigateTo(
                  user.role === 'admin' ? 'admin' :
                  user.role === 'doctor' ? 'doctor-portal' :
                  user.role === 'lab_staff' ? 'lab-portal' :
                  user.role === 'accountant' ? 'accounts-portal' : 'patient-dashboard'
                )}
                className="w-full flex items-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold bg-teal-600 text-white"
              >
                <LayoutDashboard className="w-4 h-4" />
                {isBn ? 'আমার ড্যাশবোর্ড ও রেকর্ডস' : 'My Dashboard & Records'}
              </button>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <LogOut className="w-4 h-4" /> {isBn ? 'সাইন আউট' : 'Sign Out'}
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => navigateTo('login')}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 text-center"
              >
                {isBn ? 'সাইন ইন' : 'Sign In'}
              </button>
              <button
                onClick={() => { 
                  setMobileMenuOpen(false); 
                  if (!user) navigateTo('login');
                  else openBookingModal();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-teal-600 text-white text-xs font-bold text-center shadow-md shadow-teal-500/20"
              >
                {isBn ? 'অ্যাপয়েন্টমেন্ট বুকিং' : 'Book Appointment'}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
