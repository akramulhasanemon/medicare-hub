import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Star, 
  Calendar, 
  Clock, 
  Award, 
  CheckCircle,
  Banknote,
  Lock
} from 'lucide-react';

const DoctorCard = ({ doctor, setActivePage }) => {
  const { openBookingModal } = useData();
  const { user } = useAuth();

  const handleBookingClick = () => {
    if (!user) {
      if (setActivePage) {
        // Direct to login with notice or open auth guard modal
        openBookingModal(doctor);
      } else {
        openBookingModal(doctor);
      }
    } else {
      openBookingModal(doctor);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      
      {/* Top Image + Badges */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-100">
        <img
          src={doctor.image_url}
          alt={doctor.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

        {/* Verified Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm text-xs font-semibold text-slate-800">
          <CheckCircle className="w-3.5 h-3.5 text-cyan-600" />
          <span>Verified</span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold text-white">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{doctor.rating}</span>
        </div>

        {/* Doctor Name & Specialty overlay */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <span className="text-xs uppercase font-bold tracking-wider text-cyan-300 block mb-0.5">
            {doctor.specialty}
          </span>
          <h3 className="text-lg font-bold leading-snug drop-shadow-sm">
            {doctor.name}
          </h3>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Qualification */}
          <div className="flex items-start gap-2 text-xs text-slate-600">
            <Award className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
            <span className="line-clamp-2 font-medium">{doctor.qualification}</span>
          </div>

          {/* Schedule */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{doctor.available_days}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{doctor.available_time}</span>
          </div>
        </div>

        {/* Bottom Section: Fee & Booking Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Consultation Fee</span>
            <div className="flex items-center text-slate-900 font-extrabold text-base">
              ৳ {doctor.consultation_fee}
            </div>
          </div>

          <button
            onClick={handleBookingClick}
            className="flex-1 max-w-[140px] bg-cyan-600 hover:bg-cyan-700 active:scale-95 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md shadow-cyan-600/20 transition-all text-center flex items-center justify-center gap-1.5"
          >
            {!user && <Lock className="w-3 h-3 text-cyan-200" />}
            <span>Book Slot</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default DoctorCard;
