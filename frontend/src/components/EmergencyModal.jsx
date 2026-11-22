import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  X, 
  PhoneCall, 
  Siren, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ShieldAlert,
  ArrowRight 
} from 'lucide-react';

const EmergencyModal = () => {
  const { isEmergencyModalOpen, closeEmergencyModal, requestAmbulance } = useData();

  const [form, setForm] = useState({
    patient_name: '',
    phone: '',
    pickup_address: '',
    ambulance_type: 'ICU Ambulance with Ventilator & Oxygen'
  });

  const [dispatched, setDispatched] = useState(null);

  if (!isEmergencyModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.patient_name || !form.phone || !form.pickup_address) return;

    const res = requestAmbulance(form);
    if (res.success) {
      setDispatched(res.request);
    }
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) closeEmergencyModal(); }}
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-rose-200 overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
              <Siren className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">24/7 Emergency & Ambulance</h3>
              <p className="text-xs text-rose-200">Rapid response unit in Dhaka metropolitan</p>
            </div>
          </div>
          <button
            onClick={closeEmergencyModal}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {dispatched ? (
            /* Dispatched screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Siren className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-black text-slate-900">Ambulance Dispatched!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Emergency unit <span className="font-bold text-slate-900">#{dispatched.id}</span> is en route to your address. Our medical dispatcher is calling <span className="font-bold text-rose-600">{dispatched.phone}</span>.
              </p>

              <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold text-slate-800">{dispatched.ambulance_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[200px]">{dispatched.pickup_address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Arrival:</span>
                  <span className="font-bold text-rose-700 animate-pulse">10 - 15 Minutes</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => { setDispatched(null); closeEmergencyModal(); }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            /* Emergency Request Form */
            <div className="space-y-5">
              
              {/* Direct Hotline Banner */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-600 block">Direct Emergency Calling</span>
                  <span className="text-lg font-black text-slate-900">+880 1700-112233</span>
                </div>
                <a
                  href="tel:+8801700112233"
                  className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-rose-600/30 flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call Now
                </a>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Patient Name"
                    value={form.patient_name}
                    onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emergency Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exact Pickup Address / Landmark *</label>
                  <textarea
                    required
                    rows="2"
                    placeholder="House, Road, Area, Landmark in Dhaka..."
                    value={form.pickup_address}
                    onChange={(e) => setForm({ ...form, pickup_address: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ambulance Type</label>
                  <select
                    value={form.ambulance_type}
                    onChange={(e) => setForm({ ...form, ambulance_type: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white font-medium"
                  >
                    <option value="ICU Ambulance with Ventilator & Oxygen">ICU Ambulance (with Ventilator & Paramedic)</option>
                    <option value="Cardiac Ambulance (ECG & Defibrillator)">Cardiac Ambulance (with Defibrillator & Oxygen)</option>
                    <option value="Standard AC Patient Transport">Standard AC Patient Transport Ambulance</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3.5 rounded-xl shadow-lg shadow-rose-600/30 transition-all text-xs flex items-center justify-center gap-2 mt-2"
                >
                  <Siren className="w-4 h-4 animate-pulse" /> Dispatch Emergency Ambulance Now
                </button>
              </form>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EmergencyModal;
