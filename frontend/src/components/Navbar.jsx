import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
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
  ShoppingCart,
  Stethoscope,
  Landmark,
  Search
} from 'lucide-react';

const Navbar = ({ activePage, setActivePage, onOpenTracker }) => {
  const { user, logout, isAdmin, isStaffOrAdmin } = useAuth();
  const { openBookingModal, openEmergencyModal, cart } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const navigateTo = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      {/* Top emergency bar with Live Animated ECG Pulse Monitor */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline">24/7 Medical Care, Diagnostics & Online Pharmacy</span>
            <span className="sm:hidden">24/7 MediCare Support</span>

            {/* Live ECG Waveform Monitor (Hospital Bio-Telemetry) */}
            <div className="hidden lg:flex items-center gap-2 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-800/80 text-[11px] font-mono text-emerald-300">
              <HeartPulse className="w-3.5 h-3.5 text-emerald-400 animate-heartbeat" />
              <span>72 BPM • Sinus Rhythm</span>
              <svg className="w-16 h-3.5 text-emerald-400" viewBox="0 0 100 20">
                <path
                  d="M 0 10 L 25 10 L 30 2 L 35 18 L 40 5 L 45 15 L 50 10 L 100 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-ecg"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={openEmergencyModal}
              className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-bold bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-800 transition-colors animate-pulse"
            >
              <Siren className="w-3.5 h-3.5" /> 24/7 Ambulance SOS
            </button>
            <span className="hidden md:flex items-center gap-1 text-cyan-400 font-semibold">
              <PhoneCall className="w-3 h-3" /> +880 1700-112233
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black tracking-tight text-slate-900">Medi<span className="text-cyan-600">Care</span></span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded">Hub</span>
            </div>
            <p className="text-[10px] text-slate-500 tracking-wide font-medium">Smart Healthcare Portal</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6">
          <button 
            onClick={() => navigateTo('home')} 
            className={`text-xs font-bold transition-colors ${activePage === 'home' ? 'text-cyan-600' : 'text-slate-600 hover:text-cyan-600'}`}
          >
            Home
          </button>
          <button 
            onClick={() => navigateTo('doctors')} 
            className={`text-xs font-bold transition-colors ${activePage === 'doctors' ? 'text-cyan-600' : 'text-slate-600 hover:text-cyan-600'}`}
          >
            Doctors
          </button>
          <button 
            onClick={() => navigateTo('pharmacy')} 
            className={`text-xs font-bold transition-colors flex items-center gap-1.5 ${activePage === 'pharmacy' ? 'text-emerald-600 font-extrabold' : 'text-slate-600 hover:text-emerald-600'}`}
          >
            <Pill className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pharmacy</span>
            {cartCount > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => navigateTo('lab-tests')} 
            className={`text-xs font-bold transition-colors flex items-center gap-1.5 ${activePage === 'lab-tests' ? 'text-blue-600 font-extrabold' : 'text-slate-600 hover:text-blue-600'}`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
            <span>Lab Tests</span>
          </button>
          <button 
            onClick={() => navigateTo('symptom-checker')} 
            className={`text-xs font-bold transition-colors flex items-center gap-1.5 ${activePage === 'symptom-checker' ? 'text-cyan-600 font-extrabold' : 'text-slate-600 hover:text-cyan-600'}`}
          >
            <Bot className="w-3.5 h-3.5 text-cyan-600" />
            <span>AI Symptom Checker</span>
          </button>
          <button 
            onClick={() => navigateTo('health-tools')} 
            className={`text-xs font-bold transition-colors flex items-center gap-1.5 ${activePage === 'health-tools' ? 'text-purple-600 font-extrabold' : 'text-slate-600 hover:text-purple-600'}`}
          >
            <Activity className="w-3.5 h-3.5 text-purple-600" />
            <span>Health Tools</span>
          </button>
        </nav>

        {/* User Account / CTA Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              {user.role === 'admin' ? (
                <button
                  onClick={() => navigateTo('admin')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePage === 'admin'
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                  Admin Console
                </button>
              ) : user.role === 'doctor' ? (
                <button
                  onClick={() => navigateTo('doctor-portal')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePage === 'doctor-portal'
                      ? 'bg-purple-700 text-white shadow-md shadow-purple-600/20'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-purple-600" />
                  Doctor Chamber
                </button>
              ) : user.role === 'lab_staff' ? (
                <button
                  onClick={() => navigateTo('lab-portal')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePage === 'lab-portal'
                      ? 'bg-blue-700 text-white shadow-md shadow-blue-600/20'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  <FlaskConical className="w-4 h-4 text-blue-600" />
                  Lab LIMS Portal
                </button>
              ) : user.role === 'accountant' ? (
                <button
                  onClick={() => navigateTo('accounts-portal')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePage === 'accounts-portal'
                      ? 'bg-emerald-800 text-white shadow-md shadow-emerald-700/20'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-emerald-600" />
                  Accounts & Billing
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('patient-dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    activePage === 'patient-dashboard'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  My Health Vault
                </button>
              )}

              {/* User greeting badge */}
              <div className="flex items-center gap-2 bg-slate-100 py-1 px-2.5 rounded-xl border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-cyan-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left text-xs leading-tight">
                  <span className="font-semibold text-slate-800 block truncate max-w-[140px] sm:max-w-[180px]">{user.name}</span>
                  {user.patient_id ? (
                    <span className="text-[10px] text-cyan-700 font-mono font-bold block">ID: {user.patient_id}</span>
                  ) : (
                    <span className="text-[10px] text-purple-600 font-bold block capitalize">{user.role}</span>
                  )}
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateTo('login')}
                className="flex items-center gap-1.5 text-slate-700 hover:text-cyan-600 font-bold text-xs px-3 py-2 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                onClick={() => {
                  if (!user) {
                    navigateTo('login');
                  } else {
                    openBookingModal();
                  }
                }}
                className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-cyan-500/20 transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                Book Slot
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <div className="xl:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl">
          <button
            onClick={() => navigateTo('home')}
            className="block w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Home
          </button>
          <button
            onClick={() => navigateTo('doctors')}
            className="block w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Doctors Directory
          </button>
          <button
            onClick={() => navigateTo('pharmacy')}
            className="flex items-center justify-between w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-emerald-700 hover:bg-emerald-50"
          >
            <span className="flex items-center gap-2"><Pill className="w-4 h-4" /> Online Pharmacy</span>
            {cartCount > 0 && <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px]">{cartCount}</span>}
          </button>
          <button
            onClick={() => navigateTo('lab-tests')}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-blue-700 hover:bg-blue-50"
          >
            <FlaskConical className="w-4 h-4" /> Lab Tests & Diagnostics
          </button>
          <button
            onClick={() => navigateTo('symptom-checker')}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-cyan-700 hover:bg-cyan-50"
          >
            <Bot className="w-4 h-4" /> AI Symptom Checker
          </button>
          <button
            onClick={() => navigateTo('health-tools')}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-purple-700 hover:bg-purple-50"
          >
            <Activity className="w-4 h-4" /> Health & BMI Tools
          </button>
          <button
            onClick={() => { openEmergencyModal(); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-50"
          >
            <Siren className="w-4 h-4 text-rose-600" /> 24/7 Ambulance SOS
          </button>

          {user ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="px-3 py-1 text-xs text-slate-400">Signed in as <span className="font-semibold text-slate-700">{user.name}</span></div>
              {user.role === 'admin' ? (
                <button
                  onClick={() => navigateTo('admin')}
                  className="w-full flex items-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold bg-slate-900 text-white"
                >
                  <ShieldAlert className="w-4 h-4" /> Admin Console
                </button>
              ) : user.role === 'doctor' ? (
                <button
                  onClick={() => navigateTo('doctor-portal')}
                  className="w-full flex items-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold bg-purple-700 text-white"
                >
                  <Stethoscope className="w-4 h-4" /> Doctor Chamber
                </button>
              ) : user.role === 'lab_staff' ? (
                <button
                  onClick={() => navigateTo('lab-portal')}
                  className="w-full flex items-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold bg-blue-700 text-white"
                >
                  <FlaskConical className="w-4 h-4" /> Lab LIMS Portal
                </button>
              ) : user.role === 'accountant' ? (
                <button
                  onClick={() => navigateTo('accounts-portal')}
                  className="w-full flex items-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold bg-emerald-800 text-white"
                >
                  <Landmark className="w-4 h-4" /> Accounts & Billing
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('patient-dashboard')}
                  className="w-full flex items-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold bg-cyan-600 text-white"
                >
                  <LayoutDashboard className="w-4 h-4" /> My Health Vault
                </button>
              )}
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => navigateTo('login')}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => { 
                  setMobileMenuOpen(false); 
                  if (!user) navigateTo('login');
                  else openBookingModal();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-cyan-600 text-white text-xs font-bold text-center shadow-md shadow-cyan-500/20"
              >
                Book Appointment
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
