import React from 'react';
import { Mail, Phone, MapPin, Heart, Siren, Pill, FlaskConical, Bot, Shield, Globe } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

const Footer = ({ setActivePage }) => {
  const { openEmergencyModal } = useData();
  const { isBn } = useLanguage();

  return (
    <footer className="bg-slate-900 dark:bg-[#050811] text-slate-400 pt-16 pb-10 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-600 flex items-center justify-center text-white shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h4.28" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight font-en">
                  Shastho<span className="text-teal-400">Pulse</span>
                </span>
                <p className="text-[10px] text-teal-400 font-bn">স্বাস্থ্য পালস বাংলাদেশ</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {isBn 
                ? 'আপনার নির্ভরযোগ্য স্মার্ট ডিজিটাল স্বাস্থ্যসেবা পার্টনার: বিশেষজ্ঞ ডাক্তার পরামর্শ, অনলাইন জেনুইন ফার্মেসি, ডায়াগনস্টিক ল্যাব টেস্ট এবং ২৪/৭ জাতীয় জরুরি সহায়তা।'
                : 'Your comprehensive digital healthcare partner: specialist consultations, online authentic pharmacy, diagnostic lab packages, and 24/7 national emergency care.'
              }
            </p>
            <button
              onClick={openEmergencyModal}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              <Siren className="w-4 h-4 animate-pulse" /> 
              <span>{isBn ? '২৪/৭ অ্যাম্বুলেন্স হটলাইন' : '24/7 Ambulance Hotline'}</span>
            </button>
          </div>

          {/* Patient Services */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              {isBn ? 'স্বাস্থ্য ও রোগী সেবা' : 'Patient Services'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActivePage('doctors')} className="hover:text-teal-400 transition-colors">
                  {isBn ? 'BMDC বিশেষজ্ঞ ডাক্তারগণ' : 'BMDC Specialist Doctors'}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('pharmacy')} className="hover:text-teal-400 transition-colors">
                  {isBn ? 'অনলাইন প্রেসক্রিপশন ফার্মেসি' : 'Online Pharmacy Store'}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('lab-tests')} className="hover:text-teal-400 transition-colors">
                  {isBn ? 'ল্যাব টেস্ট ও হোম স্যাম্পল' : 'Lab Tests & Diagnostics'}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('symptom-checker')} className="hover:text-teal-400 transition-colors">
                  {isBn ? 'এআই সিম্পটম চেকার' : 'AI Symptom Checker'}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('health-tools')} className="hover:text-teal-400 transition-colors">
                  {isBn ? 'বিএমআই ও স্বাস্থ্য টুলস' : 'BMI & Health Calculators'}
                </button>
              </li>
            </ul>
          </div>

          {/* Portals & Accounts */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              {isBn ? 'পোর্টাল ও প্রশাসন' : 'Portals & Admin'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setActivePage('login')} className="hover:text-teal-400 transition-colors">
                  {isBn ? 'রোগী / ডাক্তার সাইন ইন' : 'Portal Account Sign In'}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('register')} className="hover:text-teal-400 transition-colors">
                  {isBn ? 'নতুন অ্যাকাউন্ট খুলুন (PID)' : 'Create Patient Account (PID)'}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('patient-dashboard')} className="hover:text-teal-400 transition-colors">
                  {isBn ? 'মেডিকেল ভল্ট ও প্রেসক্রিপশন' : 'My Health Vault & Records'}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('admin')} className="hover:text-purple-400 transition-colors font-semibold text-purple-300">
                  {isBn ? 'হসপিটাল অ্যাডমিন কনসোল' : 'Hospital Command Center'}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & BD Compliance */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-2">
              {isBn ? 'যোগাযোগ ও অনুমোদন' : 'Contact & Compliance'}
            </h4>
            <p className="text-xs text-slate-400 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>House 42, Road 11, Dhanmondi, Dhaka-1209, Bangladesh</span>
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="font-en">+880 1700-000000 / 999</span>
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="font-en">support@shasthopulse.com</span>
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-teal-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>{isBn ? 'স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রণালয় অনুমোদিত' : 'Ministry of Health & Family Welfare Approved'}</span>
            </div>
          </div>
        </div>

        {/* Bottom Payment Badges & Copyright */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 ShasthoPulse (স্বাস্থ্য পালস). {isBn ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-500">{isBn ? 'পেমেন্ট গেটওয়ে:' : 'Accepted Payments:'}</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-pink-400 border border-slate-700 text-[11px] font-bold">bKash</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-orange-400 border border-slate-700 text-[11px] font-bold">Nagad</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-400 border border-slate-700 text-[11px] font-bold">Rocket</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700 text-[11px] font-bold font-en">VISA / MC</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 text-[11px] font-bold">{isBn ? 'ক্যাশ' : 'Cash'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
