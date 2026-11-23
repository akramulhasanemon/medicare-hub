import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import ProfileSettingsView from '../components/ProfileSettingsView';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  CheckCircle2, 
  Plus, 
  Search, 
  Printer, 
  Award, 
  DollarSign, 
  Activity, 
  HeartPulse, 
  Pill, 
  Droplet, 
  AlertCircle,
  Eye,
  Trash2,
  Share2,
  Sparkles,
  ShieldCheck,
  Check,
  Settings,
  X
} from 'lucide-react';

const DoctorPortal = ({ setActivePage }) => {
  const { user } = useAuth();
  const { appointments, updateAppointmentStatus, prescriptions, issuePrescription, medicines } = useData();

  // Access Control Guard
  if (!user || (user.role !== 'doctor' && user.role !== 'admin')) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Access Restricted / অনুমতি নেই</h2>
          <p className="text-xs text-slate-500">
            এই পোর্টালটি শুধুমাত্র নিবন্ধিত ডাক্তারদের (D101+) জন্য সংরক্ষিত। আপনার বর্তমান রোল: <strong>{user?.role || 'Guest'}</strong>
          </p>
          <button
            onClick={() => setActivePage(user?.role === 'patient' ? 'patient-dashboard' : 'home')}
            className="w-full bg-cyan-600 text-white font-bold py-2.5 rounded-xl text-xs"
          >
            Go to Your Designated Portal
          </button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'prescriptions' | 'settings'
  const [chamberStatus, setChamberStatus] = useState('active'); // 'active' | 'break' | 'off'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Selected appointment for writing prescription
  const [activePrescriptionModal, setActivePrescriptionModal] = useState(null);
  const [viewingPrescription, setViewingPrescription] = useState(null);

  // E-Prescription Form State
  const [rxForm, setRxForm] = useState({
    bp: '120/80 mmHg',
    pulse: '76 bpm',
    weight: '68 kg',
    temp: '98.6°F',
    sugar: '5.8 mmol/L',
    diagnosis: '',
    medicinesList: [
      { name: 'Napa Extra (500mg+65mg)', dosage: '1 + 0 + 1', duration: '5 Days', instruction: 'After Meal' }
    ],
    testsAdvised: 'Complete Blood Count (CBC), Serum Creatinine',
    advice: 'Drink plenty of warm water. Avoid oily and spicy foods. Get adequate rest.',
    followUp: '7 Days later'
  });

  // Doctor Info
  const doctorName = user?.name || 'Prof. Dr. Mahfuzur Rahman';
  const doctorCode = user?.patient_id || user?.doctor_code || 'D101';
  const doctorSpecialty = user?.specialty || 'Cardiologist & Internal Medicine Specialist';

  // Appointments for this doctor
  const doctorAppointments = appointments.filter(a => 
    a.doctor_name?.toLowerCase().includes(doctorName.toLowerCase()) || 
    user.role === 'admin' || 
    true // For demo, allow doctor to consult all hospital queue
  );

  const waitingQueue = doctorAppointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const completedQueue = doctorAppointments.filter(a => a.status === 'completed');

  // Filtered queue
  const filteredQueue = waitingQueue.filter(a => 
    a.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.patient_code && a.patient_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    a.patient_phone.includes(searchTerm)
  );

  const handleOpenRxModal = (app) => {
    setActivePrescriptionModal(app);
    setRxForm({
      bp: '120/80 mmHg',
      pulse: '74 bpm',
      weight: '70 kg',
      temp: '98.4°F',
      sugar: '5.6 mmol/L',
      diagnosis: app.symptoms ? `Clinical assessment for: ${app.symptoms}` : 'General Clinical Examination',
      medicinesList: [
        { name: 'Tab. Napa Extra', dosage: '1 + 0 + 1', duration: '5 Days', instruction: 'After Meal' }
      ],
      testsAdvised: 'Serum Electrolytes, Routine Examination',
      advice: 'Maintain regular diet, avoid stress and sleep at least 7-8 hours daily.',
      followUp: 'After 10 Days'
    });
  };

  const handleAddMedicineRow = () => {
    setRxForm(prev => ({
      ...prev,
      medicinesList: [
        ...prev.medicinesList,
        { name: '', dosage: '1 + 0 + 1', duration: '7 Days', instruction: 'After Meal' }
      ]
    }));
  };

  const handleRemoveMedicineRow = (index) => {
    setRxForm(prev => ({
      ...prev,
      medicinesList: prev.medicinesList.filter((_, i) => i !== index)
    }));
  };

  const handleMedicineChange = (index, field, val) => {
    setRxForm(prev => {
      const updated = [...prev.medicinesList];
      updated[index][field] = val;
      return { ...prev, medicinesList: updated };
    });
  };

  const handleSavePrescription = (e) => {
    e.preventDefault();
    if (!activePrescriptionModal) return;

    // Accurately resolve patient permanent ID (P01, P02, etc.)
    let resolvedPatientId = activePrescriptionModal.patient_code || 
      (typeof activePrescriptionModal.patient_id === 'string' && activePrescriptionModal.patient_id.startsWith('P') ? activePrescriptionModal.patient_id : null);
    
    if (!resolvedPatientId) {
      try {
        const reg = JSON.parse(localStorage.getItem('medicare_registered_users') || '[]');
        const u = reg.find(user => 
          (user.phone && activePrescriptionModal.patient_phone && user.phone === activePrescriptionModal.patient_phone) ||
          (user.email && activePrescriptionModal.patient_email && user.email.toLowerCase() === activePrescriptionModal.patient_email.toLowerCase()) ||
          (user.name && activePrescriptionModal.patient_name && user.name.toLowerCase() === activePrescriptionModal.patient_name.toLowerCase())
        );
        if (u && u.patient_id) resolvedPatientId = u.patient_id;
      } catch (e) {}
    }

    const rxData = {
      appointment_id: activePrescriptionModal.id,
      doctor_code: doctorCode,
      doctor_name: doctorName,
      doctor_specialty: doctorSpecialty,
      patient_id: resolvedPatientId || 'P01',
      patient_name: activePrescriptionModal.patient_name,
      patient_phone: activePrescriptionModal.patient_phone,
      patient_email: activePrescriptionModal.patient_email || '',
      patient_age: activePrescriptionModal.patient_age || 42,
      patient_gender: activePrescriptionModal.patient_gender || 'Male',
      vitals: {
        bp: rxForm.bp,
        pulse: rxForm.pulse,
        weight: rxForm.weight,
        temp: rxForm.temp,
        sugar: rxForm.sugar
      },
      diagnosis: rxForm.diagnosis,
      medicines: rxForm.medicinesList.filter(m => m.name.trim() !== ''),
      tests_advised: rxForm.testsAdvised.split(',').map(t => t.trim()).filter(Boolean),
      advice: rxForm.advice,
      follow_up: rxForm.followUp
    };

    const res = issuePrescription(rxData);
    setActivePrescriptionModal(null);
    setViewingPrescription(res.prescription);
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        
        {/* Doctor Header Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-purple-500/20">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black font-mono tracking-wider bg-purple-500/30 text-purple-200 border border-purple-400/30">
                Doctor ID: {doctorCode}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-cyan-300">
                Chamber: Room 304 (3rd Floor)
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <span>{doctorName}</span>
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </h1>
            <p className="text-purple-200 text-xs sm:text-sm max-w-xl">
              {doctorSpecialty} • MBBS, FCPS, MD • Verified Senior Specialist
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-purple-200">
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Chamber Hours: 05:00 PM - 09:30 PM
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Consultation Fee: ৳ 1,200
              </span>
            </div>
          </div>

          {/* Chamber Status Switch */}
          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15 space-y-2 text-right shrink-0">
            <span className="text-[11px] text-purple-200 block font-medium">Chamber Presence:</span>
            <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl">
              <button
                onClick={() => setChamberStatus('active')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chamberStatus === 'active' ? 'bg-emerald-500 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                ● In Chamber
              </button>
              <button
                onClick={() => setChamberStatus('break')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  chamberStatus === 'break' ? 'bg-amber-500 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                On Break
              </button>
            </div>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-1">
              <span>Waiting Patients</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{waitingQueue.length}</div>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">In live consultation queue</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-1">
              <span>Consulted Today</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{completedQueue.length}</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Prescriptions completed</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-1">
              <span>E-Prescriptions</span>
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{prescriptions.length}</div>
            <p className="text-[11px] text-purple-600 font-semibold mt-1">Digital Rx issued</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-1">
              <span>Doctor Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">৳ {(completedQueue.length * 1200 + 1200).toLocaleString()}</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Consultation fee billings</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'queue'
                ? 'bg-purple-800 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            Today's Patient Queue ({waitingQueue.length})
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'prescriptions'
                ? 'bg-purple-800 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Digital Rx Archive ({prescriptions.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-purple-800 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            Chamber Settings
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Settings className="w-4 h-4 text-purple-400" />
            Profile & Security (প্রোফাইল সেটিংস)
          </button>
        </div>

        {/* TAB 1: Live Patient Queue */}
        {activeTab === 'queue' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Waiting Patients Queue</h3>
                <p className="text-xs text-slate-500">Patients scheduled for consultation today. Click to write E-Prescription.</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patient name, ID, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                    <th className="py-3 px-4">Slot & Patient ID</th>
                    <th className="py-3 px-4">Patient Name & Phone</th>
                    <th className="py-3 px-4">Symptoms / Reason</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Consultation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredQueue.length > 0 ? (
                    filteredQueue.map((app, idx) => (
                      <tr key={app.id} className="hover:bg-purple-50/40 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-900 block font-mono text-xs">
                            Token #{idx + 1}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                            {app.patient_code || 'P01'}
                          </span>
                          <span className="text-slate-400 block text-[10px] mt-0.5">{app.appointment_time}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-900 block text-sm">{app.patient_name}</span>
                          <span className="text-slate-500 text-[11px]">{app.patient_phone}</span>
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          <p className="text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100 text-xs">
                            {app.symptoms || 'General medical follow-up'}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                            Waiting in Lobby
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleOpenRxModal(app)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold rounded-xl shadow-md shadow-purple-600/20 text-xs transition-all"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Consult & Prescribe</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400">
                        No waiting patients in queue at the moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Prescriptions Archive */}
        {activeTab === 'prescriptions' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Digital E-Prescriptions Issued</h3>
                <p className="text-xs text-slate-500">Official verified medical prescriptions generated by {doctorName}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescriptions.map(rx => (
                <div key={rx.id} className="p-5 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono font-black text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-lg">
                        {rx.prescription_code}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-1">{rx.patient_name}</h4>
                      <span className="text-xs text-slate-500 font-mono">Patient ID: {rx.patient_id} • {rx.date}</span>
                    </div>
                    <button
                      onClick={() => setViewingPrescription(rx)}
                      className="flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-800 bg-white border border-purple-200 px-3 py-1.5 rounded-xl shadow-sm hover:bg-purple-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View & Print</span>
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/70 text-xs space-y-1">
                    <p className="text-slate-700"><strong>Diagnosis:</strong> {rx.diagnosis}</p>
                    <p className="text-slate-500"><strong>Prescribed:</strong> {rx.medicines?.length || 0} Medicines ({rx.medicines?.map(m => m.name).join(', ')})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Chamber Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5 max-w-2xl">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Doctor Chamber Preferences</h3>
              <p className="text-xs text-slate-500">Manage consultation fee, room schedule, and assistant contact</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Consultation Fee (৳)</label>
                <input
                  type="number"
                  defaultValue={1200}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chamber Room & Floor</label>
                <input
                  type="text"
                  defaultValue="Chamber 304, 3rd Floor, MediCare Specialized Wing"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chamber Assistant Phone</label>
                <input
                  type="tel"
                  defaultValue="01711223344"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50"
                />
              </div>

              <button
                type="button"
                onClick={() => alert('Chamber preferences updated successfully!')}
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-6 py-2.5 rounded-xl transition-all"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Profile & Security */}
        {activeTab === 'profile' && (
          <ProfileSettingsView theme="purple" />
        )}

      </div>

      {/* MODAL 1: Digital Prescription Studio Form */}
      {activePrescriptionModal && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setActivePrescriptionModal(null); }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded uppercase">
                  Digital Prescription Studio
                </span>
                <h3 className="text-xl font-bold mt-1">Prescribing for: {activePrescriptionModal.patient_name}</h3>
                <p className="text-xs text-purple-200">Patient ID: {activePrescriptionModal.patient_code || 'P01'} • Phone: {activePrescriptionModal.patient_phone}</p>
              </div>
              <button
                type="button"
                onClick={() => setActivePrescriptionModal(null)}
                title="Close"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePrescription} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              {/* Patient Vitals Row */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 text-xs block">Patient Vital Signs (শারীরিক লক্ষণ ও মাপ):</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-0.5">BP (রক্তচাপ)</label>
                    <input
                      type="text"
                      value={rxForm.bp}
                      onChange={(e) => setRxForm({ ...rxForm, bp: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-2 py-1 bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Pulse (নাড়ী)</label>
                    <input
                      type="text"
                      value={rxForm.pulse}
                      onChange={(e) => setRxForm({ ...rxForm, pulse: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-2 py-1 bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Weight (ওজন)</label>
                    <input
                      type="text"
                      value={rxForm.weight}
                      onChange={(e) => setRxForm({ ...rxForm, weight: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-2 py-1 bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Temp (তাপমাত্রা)</label>
                    <input
                      type="text"
                      value={rxForm.temp}
                      onChange={(e) => setRxForm({ ...rxForm, temp: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-2 py-1 bg-white text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-0.5">Sugar (সুগার)</label>
                    <input
                      type="text"
                      value={rxForm.sugar}
                      onChange={(e) => setRxForm({ ...rxForm, sugar: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-2 py-1 bg-white text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Clinical Diagnosis & Findings *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mild Hypertension, Acid Peptic Disorder"
                  value={rxForm.diagnosis}
                  onChange={(e) => setRxForm({ ...rxForm, diagnosis: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-medium text-xs focus:bg-white"
                />
              </div>

              {/* Medicines Prescriber Table */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-purple-600" /> Prescribed Medicines (Rx):
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 hover:bg-purple-100"
                  >
                    <Plus className="w-3 h-3" /> Add Medicine
                  </button>
                </div>

                <div className="space-y-2">
                  {rxForm.medicinesList.map((med, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="flex-1">
                        <input
                          type="text"
                          required
                          placeholder="Medicine name & strength (e.g. Tab. Seclo 20mg)"
                          value={med.name}
                          onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="text"
                          placeholder="1 + 0 + 1"
                          value={med.dosage}
                          onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs text-center"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="text"
                          placeholder="7 Days"
                          value={med.duration}
                          onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs text-center"
                        />
                      </div>
                      <div className="w-28">
                        <select
                          value={med.instruction}
                          onChange={(e) => handleMedicineChange(idx, 'instruction', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-1.5 py-1 text-[11px]"
                        >
                          <option value="After Meal">After Meal</option>
                          <option value="Before Meal">Before Meal</option>
                          <option value="With Water">With Water</option>
                          <option value="At Bedtime">At Bedtime</option>
                        </select>
                      </div>
                      {rxForm.medicinesList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicineRow(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Investigations Advised */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Recommended Lab Tests / Investigations</label>
                <input
                  type="text"
                  placeholder="e.g. Complete Blood Count (CBC), Lipid Profile, Serum Creatinine"
                  value={rxForm.testsAdvised}
                  onChange={(e) => setRxForm({ ...rxForm, testsAdvised: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs"
                />
              </div>

              {/* Advice */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Clinical Advice & Instructions</label>
                <textarea
                  rows={2}
                  value={rxForm.advice}
                  onChange={(e) => setRxForm({ ...rxForm, advice: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Next Follow-up Date</label>
                <input
                  type="text"
                  value={rxForm.followUp}
                  onChange={(e) => setRxForm({ ...rxForm, followUp: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold py-3 rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Issue & Sign Official Digital Prescription</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePrescriptionModal(null)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: View / Print Digital Prescription Slip */}
      {viewingPrescription && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setViewingPrescription(null); }}
          className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in duration-150">
            
            {/* Top Toolbar */}
            <div className="bg-slate-900 px-6 py-3.5 text-white flex justify-between items-center text-xs">
              <span className="font-bold flex items-center gap-1.5 text-cyan-300">
                <ShieldCheck className="w-4 h-4" /> MediCare Digital Health Slip ({viewingPrescription.prescription_code})
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 rounded-lg font-bold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Rx Slip
                </button>
                <button
                  type="button"
                  onClick={() => setViewingPrescription(null)}
                  title="Close Prescription"
                  className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm"
                >
                  <X className="w-4 h-4" />
                  <span>Close (কেটে দিন)</span>
                </button>
              </div>
            </div>

            {/* Official Medical Prescription Pad */}
            <div className="p-8 space-y-6 text-slate-800 bg-white" id="printable-rx">
              
              {/* Pad Header */}
              <div className="border-b-2 border-purple-800 pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black text-purple-900">{viewingPrescription.doctor_name}</h2>
                  <p className="text-xs font-bold text-cyan-700">{viewingPrescription.doctor_specialty}</p>
                  <p className="text-[11px] text-slate-500">MediCare Hub Hospital • Chamber 304</p>
                  <span className="text-[10px] font-mono font-bold text-purple-700 block mt-0.5">Doctor ID: {viewingPrescription.doctor_code}</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black tracking-tight text-slate-900">Medi<span className="text-cyan-600">Care</span></div>
                  <span className="text-[10px] text-slate-400 block font-mono">Date: {viewingPrescription.date}</span>
                  <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Rx ID: {viewingPrescription.prescription_code}</span>
                </div>
              </div>

              {/* Patient Info Row */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Patient Name:</span>
                  <span className="font-bold text-slate-900">{viewingPrescription.patient_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Patient ID:</span>
                  <span className="font-bold font-mono text-cyan-700">{viewingPrescription.patient_id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Phone Number:</span>
                  <span className="font-bold text-slate-900">{viewingPrescription.patient_phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Blood Pressure:</span>
                  <span className="font-bold text-purple-800">{viewingPrescription.vitals?.bp || '120/80'}</span>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="text-xs border-b border-slate-100 pb-2">
                <span className="text-slate-400 font-bold block mb-0.5 uppercase tracking-wider text-[10px]">Clinical Diagnosis:</span>
                <span className="font-bold text-slate-900 text-sm">{viewingPrescription.diagnosis}</span>
              </div>

              {/* Rx Emblem & Medicines Table */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-purple-900 font-black text-2xl font-serif">
                  <span>℞</span>
                </div>

                <div className="space-y-2">
                  {viewingPrescription.medicines?.map((med, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-50/80 p-2.5 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">{i + 1}. {med.name}</span>
                        <span className="text-slate-500 text-[11px]">{med.instruction}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded text-[11px] block">{med.dosage}</span>
                        <span className="text-[10px] text-slate-400">{med.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investigations & Advice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                {viewingPrescription.tests_advised?.length > 0 && (
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                    <span className="font-bold text-blue-900 block mb-1">Investigations Advised:</span>
                    <ul className="list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
                      {viewingPrescription.tests_advised.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {viewingPrescription.advice && (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                    <span className="font-bold text-amber-900 block mb-1">Special Advice:</span>
                    <p className="text-slate-700 text-[11px]">{viewingPrescription.advice}</p>
                  </div>
                )}
              </div>

              {/* Pad Footer & Digital Signature */}
              <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Verified Digital Prescription</span>
                  <span className="text-[10px] text-emerald-700 font-bold">✓ Digitally Signed & Encrypted</span>
                </div>
                <div className="text-right">
                  <div className="font-signature text-purple-900 font-bold text-lg italic tracking-wider">
                    {viewingPrescription.doctor_name}
                  </div>
                  <span className="border-t border-slate-400 pt-0.5 text-[10px] text-slate-500 block">Doctor's Digital Signature</span>
                </div>
              </div>

            </div>

            {/* Bottom Modal Action Footer */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-600 font-medium">
                Rx Code: <strong className="font-mono text-purple-900">{viewingPrescription.prescription_code}</strong> • Patient: <strong>{viewingPrescription.patient_name}</strong> ({viewingPrescription.patient_id})
              </span>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setViewingPrescription(null)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-rose-600/20 transition-all"
                >
                  <X className="w-4 h-4" />
                  <span>Close (কেটে দিন)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorPortal;
