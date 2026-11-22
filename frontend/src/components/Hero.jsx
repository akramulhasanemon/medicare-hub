import React from 'react';
import { useData } from '../context/DataContext';
import { 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Award, 
  Users, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Pill,
  FlaskConical,
  Bot,
  Activity,
  Siren
} from 'lucide-react';

const Hero = ({ setActivePage }) => {
  const { openBookingModal, openEmergencyModal } = useData();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-cyan-50/60 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-cyan-200/40 via-blue-200/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100/80 border border-cyan-200 text-cyan-800 text-xs font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              <span>Smart Hospital, Diagnostics & E-Pharmacy Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Compassionate Care, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                World-Class Healthcare.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Book certified specialist doctor slots, order genuine medicines online, schedule home sample collection for lab tests, or evaluate your symptoms with our AI health assistant.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => openBookingModal()}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-cyan-600/25 hover:shadow-cyan-600/35 transition-all transform hover:-translate-y-0.5"
              >
                <Calendar className="w-5 h-5" />
                Book Doctor Slot
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setActivePage('pharmacy')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/25 transition-all"
              >
                <Pill className="w-4 h-4" />
                Online Pharmacy
              </button>

              <button
                onClick={() => openEmergencyModal()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-5 py-3.5 rounded-2xl border border-rose-200 transition-all"
              >
                <Siren className="w-4 h-4 text-rose-600" />
                24/7 Ambulance SOS
              </button>
            </div>

            {/* Quick feature shortcuts */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs font-bold">
              <button
                onClick={() => setActivePage('symptom-checker')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 hover:bg-cyan-100 transition-colors border border-cyan-100"
              >
                <Bot className="w-3.5 h-3.5 text-cyan-600" />
                <span>AI Symptom Triage</span>
              </button>
              <button
                onClick={() => setActivePage('lab-tests')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors border border-blue-100"
              >
                <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                <span>Pathology & Lab Packages</span>
              </button>
              <button
                onClick={() => setActivePage('health-tools')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 transition-colors border border-purple-100"
              >
                <Activity className="w-3.5 h-3.5 text-purple-600" />
                <span>BMI & Vitals Tools</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-tr from-cyan-600 to-blue-700">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80"
                  alt="Doctor with patient"
                  className="w-full h-96 lg:h-[480px] object-cover object-top opacity-95 hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating emergency badge */}
                <div 
                  onClick={openEmergencyModal}
                  className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-lg flex items-center gap-3 border border-white/50 cursor-pointer hover:bg-white"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Siren className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Ambulance Service</p>
                    <p className="text-xs font-bold text-rose-600">Call SOS Now</p>
                  </div>
                </div>

                {/* Floating doctor stats badge */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl flex items-center gap-3.5 border border-white/50">
                  <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-base font-black text-slate-900">4.9</span>
                      <span className="text-amber-500 text-xs">★★★★★</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">99.2% Patient Satisfaction</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl -z-10" />
              <div className="absolute -top-6 -right-6 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl -z-10" />
            </div>
          </div>

        </div>

        {/* Highlight Stats Row */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">12,500+</p>
              <p className="text-xs text-slate-500 font-medium">Happy Patients</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">45+</p>
              <p className="text-xs text-slate-500 font-medium">Expert Doctors</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">5,000+</p>
              <p className="text-xs text-slate-500 font-medium">Medicines Delivered</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">15 min</p>
              <p className="text-xs text-slate-500 font-medium">Emergency Response</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
