import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Search, 
  FlaskConical, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Printer, 
  X, 
  ShieldCheck, 
  FileText,
  AlertCircle
} from 'lucide-react';

const QuickReportTrackerModal = ({ isOpen, onClose, initialToken = '' }) => {
  const { labBookings, labReports } = useData();
  const [query, setQuery] = useState(initialToken);
  const [matchedBooking, setMatchedBooking] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setHasSearched(true);
    const q = query.trim().toUpperCase();

    // 1. Search by Test Number (e.g. 112233, 112234)
    let found = labBookings.find(b => b.test_number && b.test_number.toUpperCase() === q);

    // 2. Search by Token or Lab ID (e.g. LAB-112233)
    if (!found) {
      found = labBookings.find(b => b.id && b.id.toUpperCase().includes(q));
    }

    // 3. Search by Patient ID (e.g. P05, P01)
    if (!found) {
      found = labBookings.find(b => b.patient_id && b.patient_id.toUpperCase() === q);
    }

    setMatchedBooking(found || null);
  };

  const isCompleted = matchedBooking?.status === 'Completed';
  const isConfirmed = matchedBooking?.status === 'Confirmed';

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-sky-900 to-slate-900 p-6 text-white flex justify-between items-start">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/30 text-cyan-200 border border-blue-400/30">
              <FlaskConical className="w-3.5 h-3.5" /> Live LIMS Diagnostic Gateway
            </div>
            <h3 className="text-xl font-black tracking-tight text-white">
              Instant Lab Report & Token Tracker
            </h3>
            <p className="text-xs text-blue-200">
              Enter your 6-digit test token (e.g. 112233) or Patient ID to inspect live specimen progress.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Test Token (e.g. 112233) or Patient ID (P05)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5 shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Now</span>
            </button>
          </form>

          {/* Quick Demo Token Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold text-[11px]">Recent Tests:</span>
            {labBookings.filter(b => b.test_number).slice(0, 3).map(b => (
              <button
                key={b.test_number}
                type="button"
                onClick={() => {
                  setQuery(b.test_number);
                  setMatchedBooking(b);
                  setHasSearched(true);
                }}
                className="px-2.5 py-0.5 rounded-lg font-mono font-bold text-[11px] bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-all"
              >
                #{b.test_number} ({b.package_name.split(' ')[0]})
              </button>
            ))}
          </div>

          {/* Search Result */}
          {matchedBooking ? (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-blue-200 space-y-4 animate-in fade-in duration-200">
              <div className="flex justify-between items-start gap-3 border-b border-blue-200/60 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-blue-900 bg-blue-100 border border-blue-300 px-2.5 py-0.5 rounded-md shadow-xs">
                      Test Token: #{matchedBooking.test_number || matchedBooking.id}
                    </span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                      ✓ Paid at Accounts
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base mt-2">
                    {matchedBooking.package_name || matchedBooking.test_name}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Patient: <strong>{matchedBooking.patient_name}</strong> (ID: {matchedBooking.patient_id || 'P01'})
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-black text-blue-900 text-base block">৳ {matchedBooking.price}</span>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full inline-block mt-1 ${
                    isCompleted ? 'bg-emerald-100 text-emerald-800' :
                    isConfirmed ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {matchedBooking.status}
                  </span>
                </div>
              </div>

              {/* 4-Step Progress Stepper */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600" /> Live Specimen Pipeline Status:
                </span>
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                  <div className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 mx-auto text-emerald-600 mb-0.5" />
                    <span>1. Bill Paid</span>
                  </div>
                  <div className={`p-2 rounded-xl bg-white border font-bold ${
                    isCompleted || isConfirmed ? 'border-emerald-200 text-emerald-800' : 'border-amber-300 text-amber-800'
                  }`}>
                    {isCompleted || isConfirmed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 mx-auto text-emerald-600 mb-0.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 mx-auto text-amber-600 mb-0.5 animate-pulse" />
                    )}
                    <span>2. Specimen</span>
                  </div>
                  <div className={`p-2 rounded-xl bg-white border font-bold ${
                    isCompleted ? 'border-emerald-200 text-emerald-800' : isConfirmed ? 'border-blue-300 text-blue-800' : 'border-slate-200 text-slate-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 mx-auto text-emerald-600 mb-0.5" />
                    ) : isConfirmed ? (
                      <Activity className="w-3.5 h-3.5 mx-auto text-blue-600 mb-0.5 animate-spin" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 mx-auto text-slate-300 mb-0.5" />
                    )}
                    <span>3. Analyzer</span>
                  </div>
                  <div className={`p-2 rounded-xl bg-white border font-bold ${
                    isCompleted ? 'border-emerald-300 text-emerald-800 bg-emerald-50/50' : 'border-slate-200 text-slate-400'
                  }`}>
                    {isCompleted ? (
                      <ShieldCheck className="w-3.5 h-3.5 mx-auto text-emerald-600 mb-0.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 mx-auto text-slate-300 mb-0.5" />
                    )}
                    <span>4. Verified</span>
                  </div>
                </div>
              </div>

              {/* Status Note & Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-blue-200/60">
                <span className="text-[11px] text-slate-500 font-medium">
                  {isCompleted ? 'Report released and certified by Pathologist.' : 'Estimated release: today within 2 to 4 hours.'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isCompleted ? 'Print Official Report Slip' : 'Print Sample Token Slip'}</span>
                </button>
              </div>
            </div>
          ) : hasSearched ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-700 text-xs">No matching test found for "{query}"</h4>
              <p className="text-[11px] text-slate-400">
                Please verify the 6-digit test token printed on your Accounts Money Receipt.
              </p>
            </div>
          ) : null}

        </div>

      </div>
    </div>
  );
};

export default QuickReportTrackerModal;
