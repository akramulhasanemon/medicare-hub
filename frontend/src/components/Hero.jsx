import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Stethoscope, 
  ShieldCheck, 
  Clock, 
  Users, 
  CheckCircle,
  Siren,
  Pill,
  FlaskConical,
  Sparkles,
  ArrowRight,
  Video,
  CreditCard,
  Wallet,
  Zap
} from 'lucide-react';

const Hero = ({ setActivePage }) => {
  const { openBookingModal, openEmergencyModal, doctors } = useData();
  const { isBn } = useLanguage();
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handleSearch = () => {
    setActivePage('doctors');
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-20 transition-colors">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-tr from-teal-200/30 via-sky-200/20 to-transparent dark:from-teal-900/10 dark:via-sky-950/20 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tagline Pill */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-700/50 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>
              {isBn 
                ? 'বাংলাদেশের প্রথম সম্পূর্ণ ডিজিটাল স্বাস্থ্যসেবা প্ল্যাটফর্ম' 
                : "Bangladesh's First Complete Digital Healthcare Ecosystem"
              }
            </span>
          </span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-5 text-slate-900 dark:text-white">
            {isBn ? (
              <>আপনার স্বাস্থ্য সুরক্ষায় <br /><span className="gradient-text">ডিজিটাল স্পন্দন</span></>
            ) : (
              <>Smart Healthcare Reimagined for <br /><span className="gradient-text">Bangladesh</span></>
            )}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            {isBn 
              ? 'ঘরে বসেই পান বিএমডিসি নিবন্ধিত বিশেষজ্ঞ ডাক্তার, অনুমোদিত ল্যাব টেস্ট, ২ ঘণ্টায় ওষুধ ডেলিভারি এবং ২৪/৭ জাতীয় জরুরি অ্যাম্বুলেন্স সেবা।'
              : 'Access BMDC registered specialist doctors, certified diagnostic lab packages with home sample collection, express medicine delivery, and 24/7 ICU ambulance dispatch.'
            }
          </p>
        </div>

        {/* Live Search & Filter Bar (Dual-Theme Bento Container) */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 backdrop-blur-xl rounded-2xl p-2.5 sm:p-3 shadow-xl dark:shadow-slate-950/60 flex flex-col sm:flex-row items-center gap-2.5 transition-colors">
            
            {/* Department Select */}
            <div className="flex items-center gap-2.5 w-full sm:flex-1 px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="" className="dark:bg-slate-800">{isBn ? 'বিশেষজ্ঞ বিভাগ বেছে নিন' : 'Select Department'}</option>
                <option value="Medicine" className="dark:bg-slate-800">{isBn ? 'মেডিসিন ও ইন্টারনাল কেয়ার' : 'General Medicine'}</option>
                <option value="Cardiology" className="dark:bg-slate-800">{isBn ? 'কার্ডিওলজি (হৃদরোগ)' : 'Cardiology'}</option>
                <option value="Pediatrics" className="dark:bg-slate-800">{isBn ? 'শিশু রোগ বিশেষজ্ঞ (Pediatrics)' : 'Pediatrics (Child)'}</option>
                <option value="Gynecology" className="dark:bg-slate-800">{isBn ? 'গাইনি ও প্রসূতি রোগ' : 'Gynecology & Obstetrics'}</option>
                <option value="Neurology" className="dark:bg-slate-800">{isBn ? 'নিউরোমেডিসিন' : 'Neuromedicine'}</option>
              </select>
            </div>

            {/* Location Select */}
            <div className="flex items-center gap-2.5 w-full sm:flex-1 px-3 py-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              <MapPin className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="" className="dark:bg-slate-800">{isBn ? 'লোকেশন / জেলা' : 'Select City / District'}</option>
                <option value="Dhaka" className="dark:bg-slate-800">ঢাকা (Dhaka Metropolitan)</option>
                <option value="Chattogram" className="dark:bg-slate-800">চট্টগ্রাম (Chattogram)</option>
                <option value="Sylhet" className="dark:bg-slate-800">সিলেট (Sylhet)</option>
                <option value="Rajshahi" className="dark:bg-slate-800">রাজশাহী (Rajshahi)</option>
              </select>
            </div>

            {/* Search CTA Button */}
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-600/25 transition-all shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{isBn ? 'ডাক্তার খুঁজুন' : 'Find Doctor'}</span>
            </button>
          </div>
        </div>

        {/* 4 Bento Live Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
          
          <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:scale-105 shadow-md dark:shadow-slate-950/50">
            <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {isBn ? <span className="font-bn">৫০০+</span> : <span className="font-en">500+</span>}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {isBn ? 'বিএমডিসি নিবন্ধিত ডাক্তার' : 'BMDC Verified Doctors'}
              </div>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:scale-105 shadow-md dark:shadow-slate-950/50">
            <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {isBn ? <span className="font-bn">১৫ মিনিট</span> : <span className="font-en">15 min</span>}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {isBn ? 'জরুরি অ্যাম্বুলেন্স রেসপন্স' : 'Emergency Ambulance'}
              </div>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:scale-105 shadow-md dark:shadow-slate-950/50">
            <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {isBn ? <span className="font-bn">৫০,০০০+</span> : <span className="font-en">50,000+</span>}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {isBn ? 'সন্তুষ্ট সুস্থ রোগী' : 'Treated Patients'}
              </div>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:scale-105 shadow-md dark:shadow-slate-950/50">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {isBn ? <span className="font-bn">৬৪ জেলা</span> : <span className="font-en">64 Districts</span>}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {isBn ? 'সারাদেশে হোম ল্যাব সেবা' : 'Districts Covered'}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Badges (Clean Lucide Icons, Zero Emojis) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium mr-1">{isBn ? 'সমর্থিত পেমেন্ট মেথড:' : 'Accepted Payments:'}</span>
          
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/40 font-bold text-xs">
            <span className="text-sm font-black text-pink-600">b</span>bKash
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/40 font-bold text-xs">
            <Wallet className="w-3.5 h-3.5 text-orange-600" />Nagad
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 font-bold text-xs">
            <Zap className="w-3.5 h-3.5 text-purple-600" />Rocket
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 font-bold text-xs">
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />Card / COD
          </span>
        </div>

      </div>
    </section>
  );
};

export default Hero;
