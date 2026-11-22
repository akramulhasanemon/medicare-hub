import React, { useState } from 'react';
import { 
  HeartPulse, 
  Siren, 
  Search, 
  Stethoscope, 
  Bot, 
  PhoneCall, 
  X, 
  ChevronUp, 
  Activity,
  Plus
} from 'lucide-react';
import { useData } from '../context/DataContext';

const FloatingQuickActionDial = ({ setActivePage, onOpenTracker }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { openBookingModal, openEmergencyModal } = useData();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 select-none">
      
      {/* Expanded Quick Action Items */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2.5 animate-in slide-in-from-bottom-6 fade-in duration-200">
          
          {/* Action 1: 24/7 Ambulance SOS */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              openEmergencyModal();
            }}
            className="flex items-center gap-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2.5 rounded-2xl shadow-xl shadow-rose-600/30 text-xs transition-all hover:scale-105 group"
          >
            <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">SOS</span>
            <span>24/7 Ambulance Dispatch</span>
            <Siren className="w-4 h-4 text-rose-200 group-hover:rotate-12 transition-transform" />
          </button>

          {/* Action 2: Track Lab Test Report */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onOpenTracker();
            }}
            className="flex items-center gap-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2.5 rounded-2xl shadow-xl shadow-blue-700/30 text-xs transition-all hover:scale-105 group"
          >
            <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px] font-black uppercase">Token</span>
            <span>Track Lab Test Report</span>
            <Search className="w-4 h-4 text-cyan-200 group-hover:scale-110 transition-transform" />
          </button>

          {/* Action 3: Book Specialist Doctor */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              openBookingModal();
            }}
            className="flex items-center gap-2.5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold px-4 py-2.5 rounded-2xl shadow-xl shadow-cyan-700/30 text-xs transition-all hover:scale-105 group"
          >
            <span>Doctor Consultation</span>
            <Stethoscope className="w-4 h-4 text-cyan-200" />
          </button>

          {/* Action 4: AI Symptom Checker */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setActivePage('symptom-checker');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-2xl shadow-xl text-xs transition-all hover:scale-105 group border border-slate-700"
          >
            <span className="text-emerald-400 font-mono text-[10px]">AI</span>
            <span>AI Symptom Checker</span>
            <Bot className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Action 5: Direct Hotline Call */}
          <a
            href="tel:+8801700112233"
            className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-2xl shadow-xl shadow-emerald-600/30 text-xs transition-all hover:scale-105 group"
          >
            <span>Helpline: +880 1700-112233</span>
            <PhoneCall className="w-4 h-4 text-emerald-200 animate-bounce" />
          </a>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="relative group">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Quick Action Medical Dial"
          className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${
            isOpen 
              ? 'bg-slate-900 rotate-90 scale-105' 
              : 'bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 hover:scale-110 animate-pulse-glow'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative flex items-center justify-center">
              <HeartPulse className="w-7 h-7 text-white animate-heartbeat" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white animate-ping"></span>
            </div>
          )}
        </button>

        {!isOpen && (
          <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg border border-slate-700 pointer-events-none transition-all animate-in fade-in slide-in-from-right-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>24/7 Quick Medical Services</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default FloatingQuickActionDial;
