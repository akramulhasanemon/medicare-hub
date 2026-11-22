import React from 'react';
import { HeartPulse, Mail, Phone, MapPin, Heart, Siren, Pill, FlaskConical, Bot } from 'lucide-react';
import { useData } from '../context/DataContext';

const Footer = ({ setActivePage }) => {
  const { openEmergencyModal } = useData();

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">Medi<span className="text-cyan-400">Care</span></span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Your comprehensive healthcare partner: specialist consultations, online medicine pharmacy, certified diagnostic lab tests, and 24/7 emergency care.
            </p>
            <button
              onClick={openEmergencyModal}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
              <Siren className="w-4 h-4 animate-pulse" /> 24/7 Ambulance Hotline
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Patient Services</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActivePage('doctors')} className="hover:text-cyan-400 transition-colors">Specialist Doctors</button>
              </li>
              <li>
                <button onClick={() => setActivePage('pharmacy')} className="hover:text-cyan-400 transition-colors">Online Pharmacy Store</button>
              </li>
              <li>
                <button onClick={() => setActivePage('lab-tests')} className="hover:text-cyan-400 transition-colors">Lab Tests & Health Packages</button>
              </li>
              <li>
                <button onClick={() => setActivePage('symptom-checker')} className="hover:text-cyan-400 transition-colors">AI Symptom Checker</button>
              </li>
              <li>
                <button onClick={() => setActivePage('health-tools')} className="hover:text-cyan-400 transition-colors">BMI & Vitals Calculator</button>
              </li>
            </ul>
          </div>

          {/* Portals & Accounts */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Portals & Admin</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActivePage('login')} className="hover:text-cyan-400 transition-colors">Patient Account Sign In</button>
              </li>
              <li>
                <button onClick={() => setActivePage('register')} className="hover:text-cyan-400 transition-colors">Create Patient Account</button>
              </li>
              <li>
                <button onClick={() => setActivePage('patient-dashboard')} className="hover:text-cyan-400 transition-colors">My Medical Vault</button>
              </li>
              <li>
                <button onClick={() => setActivePage('admin')} className="hover:text-purple-400 transition-colors font-bold text-purple-300">Admin Control Center</button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Emergency & Chambers</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>House 42, Road 11, Block D, Banani, Dhaka-1213</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>+880 1700-112233 (24/7 Helpline)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>emergency@medicarehub.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MediCare Hub. Full-Stack Medical Portal with React, Tailwind CSS, PHP & MySQL.</p>
          <div className="flex items-center gap-1">
            <span>Built with care for public health</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
