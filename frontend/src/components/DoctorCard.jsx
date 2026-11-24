import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Star, 
  Calendar, 
  Clock, 
  Award, 
  ShieldCheck,
  Video,
  ArrowRight
} from 'lucide-react';

const DoctorCard = ({ doctor, setActivePage }) => {
  const { openBookingModal } = useData();
  const { user } = useAuth();
  const { isBn } = useLanguage();

  const handleBookingClick = () => {
    openBookingModal(doctor);
  };

  return (
    <div className="glass rounded-3xl p-5 flex flex-col justify-between group hover:scale-[1.02] transition-all border border-slate-200/90 dark:border-slate-800/80 shadow-sm hover:shadow-xl">
      
      {/* Top Image & BMDC Badges */}
      <div>
        <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
          <img
            src={doctor.image_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'}
            alt={doctor.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* BMDC Verified Badge */}
          <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm text-xs font-bold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>BMDC Verified</span>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-white border border-slate-700/60">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-en">{doctor.rating || '4.9'}</span>
          </div>

          {/* Specialty Overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <span className="text-[11px] uppercase font-bold tracking-wider text-teal-300 block mb-0.5">
              {doctor.specialty}
            </span>
            <h3 className="text-base font-black leading-snug drop-shadow-sm truncate">
              {doctor.name}
            </h3>
          </div>
        </div>

        {/* Doctor Qualifications & Experience */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium truncate max-w-[170px]">{doctor.qualification || 'MBBS, FCPS'}</span>
            <span className="font-en font-bold text-teal-600 dark:text-teal-400">
              {doctor.experience_years || 8}+ {isBn ? 'বছরের অভিজ্ঞতা' : 'Yrs Exp'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <span className="truncate">{doctor.available_days || 'Sat, Mon, Wed'} ({doctor.available_time || '05:00 PM - 09:00 PM'})</span>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isBn ? 'পরামর্শ ফি' : 'Consultation Fee'}
            </span>
            <span className="text-sm font-black text-teal-600 dark:text-teal-400 font-en">
              ৳{doctor.consultation_fee || '600'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleBookingClick}
          className="flex-1 py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{isBn ? 'অ্যাপয়েন্টমেন্ট বুক' : 'Book Appointment'}</span>
        </button>

        <button
          onClick={handleBookingClick}
          title="Video Consultation"
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
        >
          <Video className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        </button>
      </div>

    </div>
  );
};

export default DoctorCard;
