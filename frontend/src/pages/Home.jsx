import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import DoctorCard from '../components/DoctorCard';
import { useData } from '../context/DataContext';
import { ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react';

const Home = ({ setActivePage }) => {
  const { doctors, openBookingModal } = useData();
  const featuredDoctors = doctors.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <Hero setActivePage={setActivePage} />

      {/* Services / Departments */}
      <Services setActivePage={setActivePage} />

      {/* Featured Doctors Section */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 bg-cyan-100/60 px-3 py-1 rounded-full border border-cyan-200">
                Top Rated
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Our Specialist Consultants
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
                Book immediate chamber consultations with senior professors and certified consultants.
              </p>
            </div>

            <button
              onClick={() => setActivePage('doctors')}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
            >
              <span>View All Doctors ({doctors.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} setActivePage={setActivePage} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose MediCare Banner */}
      <section className="py-16 bg-gradient-to-tr from-slate-900 to-slate-800 text-white relative overflow-hidden" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800">
                The MediCare Advantage
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Modern Healthcare Designed Around Your Comfort
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                We eliminate the stress of traditional clinic visits. With streamlined digital appointments, patient portals, and experienced specialists, get treated with dignity and precision.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">100% Board Certified Doctors</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Every specialist undergoes rigorous credential verification.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Guaranteed Slot Scheduling</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Real-time slot confirmation to save your precious hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Digital Health Portal</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Access your past appointments and advice securely from any phone or PC.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Consultation CTA Box */}
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
              <h3 className="text-2xl font-black text-white">Need an urgent consultation?</h3>
              <p className="text-slate-300 text-sm">
                Our emergency and on-call specialist doctors are available throughout the day.
              </p>
              
              <div className="p-4 rounded-2xl bg-cyan-600/30 border border-cyan-400/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-cyan-200 uppercase font-semibold block">Emergency Hotline</span>
                  <span className="text-xl font-bold text-white">+880 1700-112233</span>
                </div>
                <button
                  onClick={() => openBookingModal()}
                  className="bg-white text-slate-900 hover:bg-cyan-50 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
                >
                  Book Instant
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
