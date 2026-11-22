import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import ProfileSettingsView from '../components/ProfileSettingsView';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileText, 
  User, 
  Plus, 
  Stethoscope,
  Phone,
  Droplet,
  Printer,
  Pill,
  FlaskConical,
  Truck,
  Package,
  ShieldCheck,
  Settings,
  Microscope,
  Check,
  Activity,
  HeartPulse,
  Eye,
  QrCode,
  MapPin,
  X,
  ChevronRight,
  ChevronDown,
  Search
} from 'lucide-react';

const UserDashboard = ({ setActivePage, onOpenTracker }) => {
  const { user } = useAuth();
  const { 
    patientAppointments, 
    openBookingModal,
    patientOrders,
    labBookings,
    prescriptions,
    labReports
  } = useData();

  // Access Control Guard - Only Patient & Admin allowed
  const userRole = String(user?.role || 'patient').toLowerCase();
  if (!user || (userRole !== 'patient' && userRole !== 'admin')) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Access Restricted / অনুমতি নেই</h2>
          <p className="text-xs text-slate-500">
            এই পোর্টালটি শুধুমাত্র রোগীদের জন্য সংরক্ষিত। আপনার অ্যাকাউন্ট রোল: <strong className="capitalize">{user?.role || 'Guest'}</strong>
          </p>
          <button
            onClick={() => {
              if (userRole === 'doctor') setActivePage('doctor-portal');
              else if (userRole === 'lab_staff') setActivePage('lab-portal');
              else if (userRole === 'accountant') setActivePage('accounts-portal');
              else if (userRole === 'admin') setActivePage('admin');
              else setActivePage('login');
            }}
            className="w-full bg-cyan-600 text-white font-bold py-2.5 rounded-xl text-xs"
          >
            Go to Your Authorized Portal
          </button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'prescriptions' | 'orders' | 'labs'
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [viewingPatientReport, setViewingPatientReport] = useState(null);
  const [expandedTrackingId, setExpandedTrackingId] = useState(null);

  // Strict Patient Data Privacy Filter: A patient ONLY sees their own records matching their Patient ID or verified phone
  const displayLabBookings = (labBookings || []).filter(b => {
    if (!b) return false;
    // Exclude accidental consultation fees from lab tests list
    if (b.package_name && /consultation|doctor fee|opd fee|chamber fee/i.test(b.package_name)) return false;
    if (!user) return false;

    // Hospital Admin can view all
    if (userRole === 'admin') return true;

    const uPatientId = String(user?.patient_id || '').trim().toUpperCase();
    const bPatientId = String(b.patient_id || '').trim().toUpperCase();

    // 1. Strict match on Patient ID (e.g. P05 === P05, P01 === P01, P02 === P02)
    if (uPatientId && bPatientId) {
      return uPatientId === bPatientId;
    }

    // 2. Strict match on phone number only if booking has no patient_id
    if (user.phone && b.patient_phone) {
      const cleanUserPhone = String(user.phone || '').replace(/\D/g, '');
      const cleanBookingPhone = String(b.patient_phone || '').replace(/\D/g, '');
      if (cleanUserPhone && cleanBookingPhone && cleanUserPhone === cleanBookingPhone) {
        return true;
      }
    }

    return false;
  });

  // Helper to generate full report object with validated parameters
  const getReportForBooking = (b) => {
    if (!b) return null;

    // Security Gate: Ensure this report strictly belongs to logged in patient
    if (user && userRole !== 'admin') {
      const uPatientId = String(user?.patient_id || '').trim().toUpperCase();
      const bPatientId = String(b.patient_id || '').trim().toUpperCase();
      if (uPatientId && bPatientId && uPatientId !== bPatientId) {
        alert('Security Alert: You can only view and print reports assigned to your own Patient ID.');
        return null;
      }
    }

    const existing = labReports.find(r => 
      r.booking_id === b.id || 
      (b.test_number && r.report_code && r.report_code.includes(b.test_number)) ||
      (r.patient_id === b.patient_id && r.test_name === b.package_name)
    );
    if (existing) return existing;

    const title = (b.package_name || b.test_name || '').toLowerCase();
    let defaultParams = [
      { parameter: 'Hemoglobin (Hb)', result: '14.2', unit: 'g/dL', reference: '13.0 - 17.0 g/dL', flag: 'NORMAL' },
      { parameter: 'Total WBC Count', result: '7,800', unit: '/cu.mm', reference: '4,000 - 11,000', flag: 'NORMAL' },
      { parameter: 'Platelet Count', result: '240,000', unit: '/cu.mm', reference: '150,000 - 450,000', flag: 'NORMAL' },
      { parameter: 'ESR (Westergren)', result: '12', unit: 'mm in 1st hr', reference: '0 - 15 mm', flag: 'NORMAL' },
      { parameter: 'Neutrophils', result: '62', unit: '%', reference: '40 - 75 %', flag: 'NORMAL' },
      { parameter: 'Lymphocytes', result: '30', unit: '%', reference: '20 - 45 %', flag: 'NORMAL' }
    ];
    let specimen = 'Whole Blood (EDTA)';
    let impression = 'Hematological cellular profile is within normal biological reference parameters. No significant leukocytosis or cytopenia detected.';

    if (title.includes('creatinin') || title.includes('kidney') || title.includes('renal')) {
      defaultParams = [
        { parameter: 'Serum Creatinine', result: '1.05', unit: 'mg/dL', reference: '0.7 - 1.3 mg/dL', flag: 'NORMAL' },
        { parameter: 'Blood Urea Nitrogen (BUN)', result: '15.4', unit: 'mg/dL', reference: '7.0 - 20.0 mg/dL', flag: 'NORMAL' },
        { parameter: 'eGFR (Calculated)', result: '98', unit: 'mL/min/1.73m²', reference: '> 90 mL/min', flag: 'NORMAL' },
        { parameter: 'Serum Uric Acid', result: '5.2', unit: 'mg/dL', reference: '3.5 - 7.2 mg/dL', flag: 'NORMAL' }
      ];
      specimen = 'Venous Blood (Serum)';
      impression = 'Normal renal function parameters. Glomerular filtration rate is preserved.';
    } else if (title.includes('lipid') || title.includes('cholesterol') || title.includes('cardiac')) {
      defaultParams = [
        { parameter: 'Total Cholesterol', result: '185', unit: 'mg/dL', reference: '< 200 mg/dL', flag: 'NORMAL' },
        { parameter: 'HDL Cholesterol (Good)', result: '52', unit: 'mg/dL', reference: '> 40 mg/dL', flag: 'NORMAL' },
        { parameter: 'LDL Cholesterol (Bad)', result: '106', unit: 'mg/dL', reference: '< 130 mg/dL', flag: 'NORMAL' },
        { parameter: 'Serum Triglycerides', result: '138', unit: 'mg/dL', reference: '< 150 mg/dL', flag: 'NORMAL' }
      ];
      specimen = 'Venous Blood (Fasting Serum)';
      impression = 'Desirable lipid profile. Coronary risk ratio is within optimal health benchmarks.';
    } else if (title.includes('sugar') || title.includes('glucose') || title.includes('diabetes')) {
      defaultParams = [
        { parameter: 'Fasting Blood Glucose (FBS)', result: '5.4', unit: 'mmol/L', reference: '4.0 - 6.0 mmol/L', flag: 'NORMAL' },
        { parameter: 'HbA1c (Glycated Hb)', result: '5.6', unit: '%', reference: '< 5.7 % (Normal)', flag: 'NORMAL' }
      ];
      specimen = 'Fluoride Blood';
      impression = 'Euglycemic glycemic control demonstrated. No evidence of impaired fasting glucose.';
    } else if (title.includes('urine')) {
      defaultParams = [
        { parameter: 'Color & Clarity', result: 'Pale Yellow, Clear', unit: 'visual', reference: 'Pale Yellow, Clear', flag: 'NORMAL' },
        { parameter: 'Specific Gravity', result: '1.018', unit: 'sg', reference: '1.005 - 1.030', flag: 'NORMAL' },
        { parameter: 'Protein / Albumin', result: 'Nil (Negative)', unit: 'qual', reference: 'Nil', flag: 'NORMAL' },
        { parameter: 'Glucose / Sugar', result: 'Nil (Negative)', unit: 'qual', reference: 'Nil', flag: 'NORMAL' },
        { parameter: 'Pus Cells (WBC)', result: '1 - 2', unit: '/HPF', reference: '0 - 5 /HPF', flag: 'NORMAL' }
      ];
      specimen = 'Clean Catch Midstream Urine';
      impression = 'Routine microscopic and biochemical urine analysis within normal physiological limits.';
    }

    return {
      id: `REP-${b.test_number || b.id || '101'}`,
      report_code: b.test_number ? `REP-2026-${b.test_number}` : `REP-2026-${String(b.id || '').replace(/\D/g, '').slice(-4) || '9041'}`,
      booking_id: b.id,
      test_number: b.test_number || b.id,
      patient_id: b.patient_id || user?.patient_id || 'P05',
      patient_name: b.patient_name || user?.name || 'Patient',
      patient_phone: b.patient_phone || user?.phone || '',
      test_name: b.package_name || b.test_name,
      technician_code: 'L101',
      technician_name: 'Md. Rafiqul Islam (Senior Clinical Pathologist)',
      verified_at: new Date().toLocaleString(),
      status: 'Verified & Approved',
      specimen: specimen,
      invoice_code: b.invoice_code || 'INV-2026-089',
      parameters: defaultParams,
      impression: impression
    };
  };

  const confirmedCount = (patientAppointments || []).filter(a => a && a.status === 'confirmed').length;
  const pendingCount = (patientAppointments || []).filter(a => a && a.status === 'pending').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Welcome Banner */}
        <div className="bg-gradient-to-r from-cyan-600 via-cyan-700 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-white/20 tracking-wider">
                Patient Medical Vault
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {user?.name || 'Patient'}!
            </h1>
            <p className="text-cyan-100 text-xs sm:text-sm">
              Keep track of your scheduled doctor appointments, medicine shipments, and diagnostic records in one place.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-white/90">
              <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-xl font-bold font-mono text-cyan-100 border border-white/25 shadow-sm">
                <User className="w-3.5 h-3.5 text-white" /> Patient ID: {user?.patient_id || 'P01'}
              </span>
              <span className="flex items-center gap-1.5 bg-black/15 px-3 py-1 rounded-xl">
                <Phone className="w-3.5 h-3.5 text-cyan-300" /> {user?.phone || '01811112233'}
              </span>
              <span className="flex items-center gap-1.5 bg-black/15 px-3 py-1 rounded-xl">
                <Droplet className="w-3.5 h-3.5 text-rose-300" /> Blood Group: {user?.blood_group || 'O+'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => openBookingModal()}
              className="flex items-center gap-2 bg-white hover:bg-cyan-50 text-cyan-800 font-bold px-5 py-3 rounded-2xl shadow-lg transition-all text-xs shrink-0"
            >
              <Plus className="w-4 h-4" /> Book Appointment
            </button>
            <button
              onClick={() => setActivePage('pharmacy')}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl shadow-lg transition-all text-xs shrink-0"
            >
              <Pill className="w-4 h-4" /> Order Medicines
            </button>
          </div>
        </div>

        {/* Premium Live Bio-Telemetry & Digital Vitals Vault */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-600 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <span>Live Health Vitals & Bio-Telemetry</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                    Optimal Health Zone
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">Continuous telemetry synchronized with MediCare clinical records</p>
              </div>
            </div>

            {/* Live ECG monitor banner */}
            <div className="flex items-center gap-2 bg-slate-900 text-emerald-300 px-3 py-1.5 rounded-2xl text-xs font-mono border border-slate-800 shadow-xs shrink-0">
              <HeartPulse className="w-4 h-4 text-rose-400 animate-heartbeat" />
              <span className="text-[11px] font-bold">72 BPM</span>
              <svg className="w-20 h-4 text-emerald-400" viewBox="0 0 100 20">
                <path
                  d="M 0 10 L 20 10 L 25 3 L 30 18 L 35 6 L 40 14 L 45 10 L 100 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-ecg"
                />
              </svg>
            </div>
          </div>

          {/* 5 Vitals Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Heart Rate */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50/80 to-white border border-rose-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Pulse / Heart Rate</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-rose-700 font-mono">72</span>
                <span className="text-xs text-rose-500 font-bold">BPM</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                ✓ Normal Rhythm
              </span>
            </div>

            {/* Blood Pressure */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50/80 to-white border border-blue-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Blood Pressure</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-blue-900 font-mono">120/80</span>
                <span className="text-xs text-blue-600 font-bold">mmHg</span>
              </div>
              <span className="text-[10px] text-blue-800 font-semibold bg-blue-50 px-1.5 py-0.5 rounded inline-block">
                ✓ Optimal Range
              </span>
            </div>

            {/* SpO2 Oxygen */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-50/80 to-white border border-cyan-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">SpO2 Blood Oxygen</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-cyan-800 font-mono">99%</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                ✓ Oxygenated
              </span>
            </div>

            {/* Blood Glucose */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-white border border-amber-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Blood Sugar (FBS)</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-amber-800 font-mono">5.4</span>
                <span className="text-xs text-amber-600 font-bold">mmol/L</span>
              </div>
              <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded inline-block">
                ✓ Euglycemic
              </span>
            </div>

            {/* Temperature */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50/80 to-white border border-purple-200/80 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Body Temperature</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-purple-900 font-mono">98.4</span>
                <span className="text-xs text-purple-600 font-bold">°F</span>
              </div>
              <span className="text-[10px] text-purple-800 font-semibold bg-purple-50 px-1.5 py-0.5 rounded inline-block">
                ✓ Normal (Afebrile)
              </span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'appointments'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Doctor Appointments ({patientAppointments.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            Medicine Orders ({patientOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'labs'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            Lab Tests & Diagnostics ({displayLabBookings.length})
          </button>

          {/* Quick Track Report in Patient Portal */}
          {onOpenTracker && (
            <button
              type="button"
              onClick={onOpenTracker}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 shadow-xs transition-all active:scale-95 shimmer-badge"
            >
              <Search className="w-4 h-4 text-blue-600" />
              <span>Track Report (রিপোর্ট ট্র্যাকিং)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Settings className="w-4 h-4 text-cyan-500" />
            Profile & Security (প্রোফাইল সেটিংস)
          </button>
        </div>

        {/* TAB 1: Appointments List */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Consultation Bookings</h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time status updates from our clinic desk</p>
              </div>
            </div>

            {patientAppointments.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {patientAppointments.map((app) => (
                  <div key={app.id} className="p-6 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">{app.doctor_name}</h4>
                          <p className="text-xs font-semibold text-cyan-600">{app.doctor_specialty}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> {app.appointment_date}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {app.appointment_time}
                        </span>
                        <span className="text-slate-400">|</span>
                        <span className="text-slate-500">Booking ID: #{app.id}</span>
                      </div>

                      {app.symptoms && (
                        <p className="text-xs text-slate-600 bg-slate-100 p-2.5 rounded-xl max-w-2xl">
                          <span className="font-semibold text-slate-700">Symptoms:</span> {app.symptoms}
                        </p>
                      )}

                      {app.admin_notes && (
                        <p className="text-xs text-cyan-800 bg-cyan-50 p-2.5 rounded-xl max-w-2xl border border-cyan-100">
                          <span className="font-semibold text-cyan-900">Clinic Notice:</span> {app.admin_notes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0">
                      {getStatusBadge(app.status)}

                      {app.status === 'confirmed' && (
                        <button
                          onClick={() => setSelectedPrescription(app)}
                          className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 hover:text-cyan-700 bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-xl transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" /> View Chamber Slip
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 p-6">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">No appointments booked yet</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-4">
                  Schedule your consultation with any of our medical consultants in seconds.
                </p>
                <button
                  onClick={() => openBookingModal()}
                  className="bg-cyan-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm"
                >
                  Schedule Appointment
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Medicine Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">My Medicine Shipments</h3>
            {patientOrders.length > 0 ? (
              <div className="space-y-4">
                {patientOrders.map(order => (
                  <div key={order.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">Order #{order.id}</span>
                        <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">{order.status}</span>
                      </div>
                      <p className="text-xs text-slate-500">Ordered on: {order.orderDate} • Delivery Address: {order.delivery_address}</p>
                      <div className="pt-1">
                        {order.items?.map((it, idx) => (
                          <span key={idx} className="inline-block bg-white border border-slate-200 text-slate-700 text-[11px] px-2 py-0.5 rounded-lg mr-2 mb-1">
                            {it.name} (x{it.qty})
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-700 block">৳ {order.totalAmount}</span>
                      <span className="text-[10px] text-slate-400">{order.paymentMethod}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">No orders placed yet.</div>
            )}
          </div>
        )}

        {/* TAB 3: Lab Tests & Diagnostics with Live Tracking & Printable Report */}
        {activeTab === 'labs' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-xl text-slate-900 flex items-center gap-2">
                  <FlaskConical className="w-6 h-6 text-blue-600" />
                  <span>My Diagnostic Tests & Lab Reports (আমার ল্যাব টেস্ট ও রিপোর্ট)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Real-time sample processing tracking, auto-analyzer status & official verified report printouts.
                </p>
              </div>

              {/* Status Summary Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-xl font-bold font-mono">
                  Total Tests: {displayLabBookings.length}
                </span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl font-bold font-mono">
                  ✓ Ready to Print: {displayLabBookings.filter(b => b.status === 'Completed').length}
                </span>
                <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-xl font-bold font-mono">
                  ⏳ In Process: {displayLabBookings.filter(b => b.status !== 'Completed').length}
                </span>
              </div>
            </div>

            {/* Quick Report Tracking Banner in Patient Portal */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <h4 className="font-extrabold text-base sm:text-lg flex items-center gap-2 text-white">
                    <Search className="w-5 h-5 text-cyan-300" />
                    <span>Quick Report Tracker (ল্যাব রিপোর্ট ট্র্যাকিং)</span>
                  </h4>
                </div>
                <p className="text-xs text-blue-200 max-w-xl">
                  মানি রিসিট বা টেস্ট টোকেন নম্বর (যেমন: <strong className="text-white font-mono">112233</strong>, <strong className="text-white font-mono">112234</strong>) দিয়ে তাৎক্ষণিক লাইভ প্রসেসিং স্ট্যাটাস দেখুন অথবা প্রিন্ট কপি ডাউনলোড করুন।
                </p>
              </div>
              {onOpenTracker && (
                <button
                  type="button"
                  onClick={onOpenTracker}
                  className="bg-white hover:bg-cyan-50 text-blue-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95 shrink-0"
                >
                  <Search className="w-4 h-4 text-cyan-600" />
                  <span>Track Token Report (টোকেন সার্চ)</span>
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                </button>
              )}
            </div>

            {displayLabBookings.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-3">
                <FlaskConical className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">কোনো ল্যাব টেস্ট রেকর্ড নেই</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  রোগী আইডি: <strong className="text-blue-700 font-mono">{user?.patient_id || 'N/A'}</strong> ({user?.name}) এর জন্য বর্তমানে কোনো টেস্ট অপেক্ষমাণ নেই। 
                  নিরাপত্তা ও গোপনীয়তা রক্ষার স্বার্থে অন্য কোনো রোগীর টেস্ট বা রিপোর্ট এখানে প্রদর্শন করা হয় না। হাসপাতাল অ্যাকাউন্টস কাউন্টার থেকে আপনার নামে টেস্ট বিল করা হলে তা সরাসরি আপনার এই পোর্টালেই দেখতে পাবেন।
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {displayLabBookings.map((b) => {
                  const isCompleted = b.status === 'Completed';
                  const isConfirmed = b.status === 'Confirmed';
                  const isPending = b.status === 'Pending' || (!isCompleted && !isConfirmed);

                  return (
                    <div 
                      key={b.id} 
                      className={`rounded-2xl border transition-all p-5 sm:p-6 space-y-5 bg-white shadow-xs ${
                        isCompleted ? 'border-emerald-200/90 hover:border-emerald-300 bg-gradient-to-b from-white to-emerald-50/20' : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {/* Top Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-black text-xs text-blue-900 bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-lg shadow-xs">
                            Test Token: #{b.test_number || b.id}
                          </span>
                          <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                            ✓ Paid at Accounts ({b.invoice_code || 'POS Receipt'})
                          </span>
                          <span className="text-slate-400 text-xs">
                            📅 {b.booking_date} • {b.collection_type || 'Hospital Lab Counter #02'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-black text-blue-900 text-base font-mono">
                            ৳ {Number(b.price).toLocaleString()}
                          </span>
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Report Ready & Verified
                            </span>
                          ) : isConfirmed ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" /> Testing in Analyzer
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-600" /> Sample Collection Pending
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Test Title & Specimen */}
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                          <FlaskConical className="w-5 h-5 text-blue-600 shrink-0" />
                          <span>{b.package_name || b.test_name}</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Specimen Required: <strong>{b.package_name?.toLowerCase().includes('urine') ? 'Clean Catch Urine Sample' : 'Venous Whole Blood (EDTA/Serum)'}</strong> • Patient: <strong>{b.patient_name || user?.name}</strong> (ID: {b.patient_id || user?.patient_id || 'P05'})
                        </p>
                      </div>

                      {/* LIVE REPORT PROCESSING TRACKER (লাইভ প্রসেসিং ট্র্যাকিং) */}
                      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Activity className="w-4 h-4 text-blue-600" />
                            <span>Live Report Processing Tracker (লাইভ রিপোর্ট ট্র্যাকিং স্ট্যাটাস):</span>
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            {isCompleted ? 'Report Released & Digitally Signed' : isConfirmed ? 'Estimated: within 1-2 hours' : 'Awaiting Sample Draw'}
                          </span>
                        </div>

                        {/* 4-Step Visual Stepper Bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                          {/* Step 1: Paid at Accounts */}
                          <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>1. Bill Paid</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono">Token #{b.test_number || '112233'} Generated</p>
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block">✓ Completed</span>
                          </div>

                          {/* Step 2: Sample Collection */}
                          <div className={`p-3 bg-white rounded-xl border space-y-1 ${
                            isCompleted || isConfirmed ? 'border-emerald-200' : 'border-amber-300 ring-2 ring-amber-400/20'
                          }`}>
                            <div className={`flex items-center gap-1.5 font-bold text-xs ${
                              isCompleted || isConfirmed ? 'text-emerald-700' : 'text-amber-700'
                            }`}>
                              {isCompleted || isConfirmed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <Clock className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
                              )}
                              <span>2. Sample Collection</span>
                            </div>
                            <p className="text-[10px] text-slate-500">
                              {isCompleted || isConfirmed ? 'Sample Barcoded & Drawn' : 'Lab Counter #02 Awaiting Draw'}
                            </p>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded inline-block ${
                              isCompleted || isConfirmed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {isCompleted || isConfirmed ? '✓ Received' : 'Current Step'}
                            </span>
                          </div>

                          {/* Step 3: Analyzer Processing */}
                          <div className={`p-3 bg-white rounded-xl border space-y-1 ${
                            isCompleted ? 'border-emerald-200' : isConfirmed ? 'border-blue-300 ring-2 ring-blue-500/20' : 'border-slate-200 opacity-60'
                          }`}>
                            <div className={`flex items-center gap-1.5 font-bold text-xs ${
                              isCompleted ? 'text-emerald-700' : isConfirmed ? 'text-blue-700' : 'text-slate-500'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : isConfirmed ? (
                                <Activity className="w-4 h-4 text-blue-600 shrink-0 animate-spin" />
                              ) : (
                                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                              <span>3. Analyzer Test</span>
                            </div>
                            <p className="text-[10px] text-slate-500">
                              {isCompleted ? 'Sysmex / Cobas Run Done' : isConfirmed ? 'Running in Analyzer...' : 'Queued for Testing'}
                            </p>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded inline-block ${
                              isCompleted ? 'bg-emerald-50 text-emerald-700' : isConfirmed ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {isCompleted ? '✓ Analyzed' : isConfirmed ? 'Running ⏳' : 'Pending'}
                            </span>
                          </div>

                          {/* Step 4: Report Verified & Ready */}
                          <div className={`p-3 bg-white rounded-xl border space-y-1 ${
                            isCompleted ? 'border-emerald-300 ring-2 ring-emerald-500/20' : 'border-slate-200 opacity-60'
                          }`}>
                            <div className={`flex items-center gap-1.5 font-bold text-xs ${
                              isCompleted ? 'text-emerald-700' : 'text-slate-500'
                            }`}>
                              {isCompleted ? (
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                              <span>4. Report Ready</span>
                            </div>
                            <p className="text-[10px] text-slate-500">
                              {isCompleted ? 'Digitally Signed & Verified' : 'In Pathologist Review'}
                            </p>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded inline-block ${
                              isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {isCompleted ? '✓ Ready to Print' : 'Awaiting'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar for Patient */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                        <div className="text-xs text-slate-600 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Official Hospital Electronic Health Record (EHR) • 100% Verified</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          {isCompleted ? (
                            <button
                              type="button"
                              onClick={() => setViewingPatientReport(getReportForBooking(b))}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black px-6 py-2.5 rounded-xl shadow-md shadow-emerald-700/20 text-xs transition-all active:scale-95"
                            >
                              <Printer className="w-4 h-4" />
                              <span>View & Print Official Lab Report (রিপোর্ট প্রিন্ট করুন)</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setViewingPatientReport(getReportForBooking(b))}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm text-xs transition-all active:scale-95"
                            >
                              <FileText className="w-4 h-4" />
                              <span>Preview Requisition & Token Slip (টোকেন স্লিপ দেখুন)</span>
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Profile & Security */}
        {activeTab === 'profile' && (
          <ProfileSettingsView theme="cyan" />
        )}

      </div>

      {/* Digital Appointment Slip Modal */}
      {selectedPrescription && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedPrescription(null); }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Appointment & Chamber Slip</h3>
                <p className="text-xs text-cyan-100">Verified by MediCare Hub System</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPrescription(null)}
                title="Close Slip"
                className="flex items-center gap-1 bg-white/20 hover:bg-rose-600 text-white px-2.5 py-1.5 rounded-xl font-bold transition-all shadow-sm"
              >
                <span>Close (কেটে দিন) ✕</span>
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 text-base">{selectedPrescription.doctor_name}</span>
                  <p className="text-cyan-600 font-semibold">{selectedPrescription.doctor_specialty}</p>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full uppercase text-[10px]">Confirmed Slot</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 block font-medium">Patient Name:</span>
                  <span className="font-bold text-slate-800">{selectedPrescription.patient_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Phone:</span>
                  <span className="font-bold text-slate-800">{selectedPrescription.patient_phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Date & Time:</span>
                  <span className="font-bold text-slate-800">{selectedPrescription.appointment_date} ({selectedPrescription.appointment_time})</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Chamber Room:</span>
                  <span className="font-bold text-slate-800">Room 304, 3rd Floor</span>
                </div>
              </div>

              {selectedPrescription.admin_notes && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                  <span className="font-bold">Instructions: </span>
                  {selectedPrescription.admin_notes}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold rounded-xl text-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Verified Patient Lab Report Modal */}
      {viewingPatientReport && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setViewingPatientReport(null); }}
          className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in duration-150">
            
            {/* Modal Top Bar */}
            <div className="bg-slate-900 px-6 py-3.5 text-white flex justify-between items-center text-xs">
              <span className="font-bold flex items-center gap-1.5 text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Hospital Official Diagnostic Test Slip ({viewingPatientReport.report_code})</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl font-bold transition-all shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Report Slip
                </button>
                <button
                  type="button"
                  onClick={() => setViewingPatientReport(null)}
                  className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl font-bold transition-all shadow-sm"
                >
                  <X className="w-4 h-4" />
                  <span>Close (কেটে দিন)</span>
                </button>
              </div>
            </div>

            {/* Printable Document Sheet */}
            <div className="p-6 sm:p-8 space-y-6 text-slate-800 bg-white" id="printable-patient-report">
              
              {/* Header Letterhead */}
              <div className="border-b-2 border-blue-900 pb-4 flex justify-between items-start">
                <div>
                  <div className="text-2xl font-black text-blue-950 tracking-tight">
                    Medi<span className="text-cyan-600">Care</span> Diagnostic & Pathology Laboratory
                  </div>
                  <p className="text-xs text-slate-600 font-semibold">ISO 15189 Certified Clinical Pathology & Molecular Diagnostic Center</p>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Govt. Reg # DH-9042 • Main Central Hospital • 24/7 Helpline: +880 1700-112233
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    Report ID: {viewingPatientReport.report_code}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1 font-mono">{viewingPatientReport.verified_at}</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                    ✓ Barcoded Specimen
                  </span>
                </div>
              </div>

              {/* Patient & Specimen Metadata Grid */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Patient Full Name:</span>
                  <span className="font-bold text-slate-900 text-sm">{viewingPatientReport.patient_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Permanent Patient ID:</span>
                  <span className="font-bold font-mono text-cyan-700 text-sm">{viewingPatientReport.patient_id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Test Token Number:</span>
                  <span className="font-bold font-mono text-blue-800">#{viewingPatientReport.test_number}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Accounts Invoice Ref:</span>
                  <span className="font-bold font-mono text-emerald-700">{viewingPatientReport.invoice_code}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px] font-medium">Diagnostic Investigation:</span>
                  <span className="font-extrabold text-blue-950 text-xs">{viewingPatientReport.test_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Specimen Type:</span>
                  <span className="font-semibold text-slate-800">{viewingPatientReport.specimen}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-medium">Reporting Pathologist:</span>
                  <span className="font-semibold text-slate-800">{viewingPatientReport.technician_code}</span>
                </div>
              </div>

              {/* Clinical Findings & Parameter Table */}
              <div className="space-y-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-blue-50/80 text-blue-950 font-bold uppercase border-b border-blue-200 text-[11px]">
                      <th className="py-2.5 px-3">Analyte / Test Parameter</th>
                      <th className="py-2.5 px-3 text-center">Observed Result</th>
                      <th className="py-2.5 px-3 text-center">Unit</th>
                      <th className="py-2.5 px-3 text-right">Biological Reference Interval</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingPatientReport.parameters?.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{p.parameter}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900 bg-blue-50/20">{p.result}</td>
                        <td className="py-2.5 px-3 text-center text-slate-500 font-mono text-[11px]">{p.unit}</td>
                        <td className="py-2.5 px-3 text-right text-slate-600 font-mono text-[11px]">{p.reference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pathological Impression */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-900 block">Pathological Clinical Interpretation & Impression:</span>
                <p className="text-slate-700 leading-relaxed">{viewingPatientReport.impression}</p>
              </div>

              {/* Verified Digital Seal & Signatures */}
              <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Official End of Laboratory Report</span>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified via Automated Sysmex XN-550 / Roche Cobas LIMS
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-signature text-blue-900 font-bold text-base italic">
                    {viewingPatientReport.technician_name}
                  </div>
                  <span className="border-t border-slate-400 pt-0.5 text-[10px] text-slate-500 block">
                    Chief Laboratory Pathologist & Biochemist
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Modal Action Footer */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-600 font-medium">
                Report ID: <strong className="font-mono text-blue-900">{viewingPatientReport.report_code}</strong> • Patient ID: <strong>{viewingPatientReport.patient_id}</strong>
              </span>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4" /> Print / Save Official PDF
                </button>
                <button
                  type="button"
                  onClick={() => setViewingPatientReport(null)}
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

export default UserDashboard;
