import React from 'react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  Siren, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

const Services = ({ setActivePage }) => {
  const { openBookingModal, openEmergencyModal } = useData();
  const { isBn } = useLanguage();

  return (
    <section id="services" className="py-16 sm:py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-700/50 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBn ? 'প্রধান ডিজিটাল সেবাসমূহ' : 'Core Healthcare Pillars'}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            {isBn ? (
              <>এক প্ল্যাটফর্মে সম্পূর্ণ <span className="gradient-text">চিকিৎসা সমাধান</span></>
            ) : (
              <>Complete Care on a <span className="gradient-text">Single Platform</span></>
            )}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            {isBn 
              ? 'ডাক্তার অ্যাপয়েন্টমেন্ট থেকে শুরু করে ডায়াগনস্টিক রিপোর্ট এবং জরুরি অ্যাম্বুলেন্স — প্রতিটি সেবা পরিচালিত হয় সর্বোচ্চ প্রফেশনালিজমে।'
              : 'From specialist chamber bookings to certified diagnostic lab tests and express ambulance dispatch — all managed seamlessly.'
            }
          </p>
        </div>

        {/* 4 Core Bento Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Doctor Consultation */}
          <div className="glass rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-all group border border-slate-200 dark:border-slate-800">
            <div>
              <div className="w-13 h-13 w-12 h-12 rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {isBn ? 'ডাক্তার অ্যাপয়েন্টমেন্ট' : 'Doctor Consultation'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {isBn 
                  ? 'চেম্বার ও ভিডিও কনসালটেশন। বিএমডিসি নিবন্ধিত অধ্যাপক ও বিশেষজ্ঞ ডাক্তারদের সরাসরি অ্যাপয়েন্টমেন্ট।'
                  : 'OPD chamber and online telemedicine with BMDC certified professors and consultants.'
                }
              </p>
              <div className="text-xs font-bold text-teal-600 dark:text-teal-400 font-en mb-4">
                {isBn ? 'ফি শুরু ৳৫০০ থেকে' : 'Consultation fee from ৳500'}
              </div>
            </div>
            
            <button
              onClick={() => openBookingModal()}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span>{isBn ? 'বুক অ্যাপয়েন্টমেন্ট' : 'Book Appointment'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Diagnostic & Pathology */}
          <div className="glass rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-all group border border-slate-200 dark:border-slate-800">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 dark:bg-sky-400/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-5 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {isBn ? 'ডায়াগনস্টিক ও ল্যাব টেস্ট' : 'Diagnostic & Lab Tests'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {isBn 
                  ? 'বাসায় বসে নমুনা সংগ্রহের সুবিধা। স্বয়ংক্রিয় ল্যাব আইডি ট্র্যাকিং এবং অনলাইনে ৪ ঘণ্টায় ভেরিফাইড রিপোর্ট।'
                  : 'Home sample collection across districts. Sequential Lab ID tracking with verified digital report download.'
                }
              </p>
              <div className="text-xs font-bold text-sky-600 dark:text-sky-400 font-en mb-4">
                {isBn ? 'টেস্ট প্যাকেজ ৳৩০০ থেকে' : 'Test packages from ৳300'}
              </div>
            </div>
            
            <button
              onClick={() => setActivePage('lab-tests')}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span>{isBn ? 'ল্যাব টেস্ট দেখুন' : 'Explore Tests'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Medicine Express */}
          <div className="glass rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-all group border border-slate-200 dark:border-slate-800">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {isBn ? 'অনলাইন ফার্মেসি এক্সপ্রেস' : 'Medicine Express'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {isBn 
                  ? '১০০% অরিজিনাল ওষুধ ও প্রেসক্রিপশন ডেলিভারি। ঢাকা শহরে ২ ঘণ্টার মধ্যে ক্যাশ অন ডেলিভারি বা বিকাশে পেমেন্ট।'
                  : '100% genuine pharmaceutical drugs delivered to your doorstep within 2 hours with bKash/Nagad.'
                }
              </p>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-en mb-4">
                {isBn ? 'ফ্রি ডেলিভারি ৳১০০০+ অর্ডারে' : 'Free delivery on ৳1000+'}
              </div>
            </div>
            
            <button
              onClick={() => setActivePage('pharmacy')}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span>{isBn ? 'ফার্মেসি অর্ডার' : 'Order Medicine'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Emergency ICU Ambulance */}
          <div className="glass rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-all group border border-rose-200/60 dark:border-rose-900/40">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 dark:bg-rose-400/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Siren className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {isBn ? 'জরুরি আইসিইউ অ্যাম্বুলেন্স' : 'Emergency Ambulance'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {isBn 
                  ? 'অক্সিজেন, এসি ও আইসিইউ/সিসিইউ সুবিধাযুক্ত অ্যাম্বুলেন্স। জাতীয় জরুরি ৯৯৯ ইন্টিগ্রেশন ও লাইভ ড্রাইভার ট্র্যাকিং।'
                  : 'Oxygen, AC and critical ICU/CCU ambulances. Direct 999 hotline dispatch across Dhaka and districts.'
                }
              </p>
              <div className="text-xs font-bold text-rose-600 dark:text-rose-400 font-en mb-4">
                {isBn ? '১৫ মিনিটে ইনস্ট্যান্ট ডিসপ্যাচ' : '15-min Rapid Dispatch'}
              </div>
            </div>
            
            <button
              onClick={() => openEmergencyModal()}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{isBn ? 'অ্যাম্বুলেন্স কল করুন' : 'Dispatch Ambulance'}</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Services;
