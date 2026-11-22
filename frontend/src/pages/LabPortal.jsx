import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import ProfileSettingsView from '../components/ProfileSettingsView';
import { 
  FlaskConical, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Printer, 
  Plus, 
  Eye, 
  FileText, 
  Activity, 
  Check, 
  Microscope, 
  ShieldCheck, 
  QrCode,
  Droplet,
  Trash2,
  Settings,
  User,
  X,
  MapPin,
  Phone,
  Stethoscope
} from 'lucide-react';

const LabPortal = ({ setActivePage }) => {
  const { user } = useAuth();
  const { labBookings, updateLabBookingStatus, labReports, issueLabReport, prescriptions } = useData();

  // Access Control Guard
  if (!user || (user.role !== 'lab_staff' && user.role !== 'admin')) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Access Restricted / অনুমতি নেই</h2>
          <p className="text-xs text-slate-500">
            এই পোর্টালটি শুধুমাত্র ল্যাব কর্মকর্তা ও প্যাথলজিস্টদের (L101+) জন্য সংরক্ষিত। আপনার বর্তমান রোল: <strong>{user?.role || 'Guest'}</strong>
          </p>
          <button
            onClick={() => setActivePage(user?.role === 'patient' ? 'patient-dashboard' : 'home')}
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs"
          >
            Go to Your Designated Portal
          </button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'reports' | 'patient-lookup' | 'equipment' | 'profile'
  const [searchTerm, setSearchTerm] = useState('');
  const [patientSearchId, setPatientSearchId] = useState('P01');
  const [selectedBookingForReport, setSelectedBookingForReport] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);

  // Gate: ONLY diagnostic tests submitted and paid from Accounts
  const accountsPaidBookings = labBookings.filter(b => b.created_from_accounts || b.invoice_code || b.paid);

  // Helper to fetch complete patient info across database & local cache
  const getPatientMasterInfo = (searchId) => {
    if (!searchId) return null;
    const query = searchId.trim().toUpperCase();

    // 1. Check if query is a Test Number (e.g. 112233)
    const testMatch = accountsPaidBookings.find(b => b.test_number && b.test_number.toUpperCase() === query);
    const resolvedId = testMatch ? (testMatch.patient_id || 'P01').toUpperCase() : query;

    const registered = JSON.parse(localStorage.getItem('medicare_registered_users') || '[]');
    let found = registered.find(u => u.patient_id && u.patient_id.toUpperCase() === resolvedId);
    
    if (!found && (resolvedId === 'P01' || resolvedId === 'JOHN DOE' || resolvedId.includes('01811112233'))) {
      found = {
        patient_id: 'P01',
        name: 'John Doe',
        phone: '01811112233',
        email: 'patient@medicare.com',
        address: 'House 14, Road 5, Dhanmondi, Dhaka',
        blood_group: 'B+',
        gender: 'Male',
        age: 45
      };
    }

    if (!found && (resolvedId === 'P02' || resolvedId.includes('AKRAMUL') || resolvedId.includes('TANVIR') || resolvedId.includes('01568812468') || resolvedId.includes('01712345678'))) {
      found = {
        patient_id: 'P02',
        name: 'Akramul Hasan',
        phone: '01568812468',
        email: 'akramul@medicare.com',
        address: 'Dhaka, Bangladesh',
        blood_group: 'A+',
        gender: 'Male',
        age: 32
      };
    }

    if (!found) {
      found = registered.find(u => 
        (u.name && u.name.toUpperCase().includes(resolvedId)) ||
        (u.phone && u.phone.includes(resolvedId)) ||
        (u.patient_id && u.patient_id.toUpperCase().includes(resolvedId))
      );
    }

    // Also check accounts bookings if user not found in registered
    if (!found && testMatch) {
      found = {
        patient_id: testMatch.patient_id || 'P01',
        name: testMatch.patient_name || 'Patient',
        phone: testMatch.patient_phone || '',
        email: '',
        address: 'Dhaka, Bangladesh',
        blood_group: 'A+',
        gender: 'Other',
        age: 35
      };
    }

    return found || null;
  };

  const currentLookupPatient = getPatientMasterInfo(patientSearchId);
  const patientPrescriptions = prescriptions.filter(p => 
    (currentLookupPatient && p.patient_id && p.patient_id.toUpperCase() === currentLookupPatient.patient_id.toUpperCase()) ||
    (currentLookupPatient && p.patient_name && p.patient_name.toLowerCase() === currentLookupPatient.name.toLowerCase())
  );
  const patientBookings = accountsPaidBookings.filter(b => 
    (currentLookupPatient && b.patient_id && b.patient_id.toUpperCase() === currentLookupPatient.patient_id.toUpperCase()) ||
    (currentLookupPatient && b.patient_name && b.patient_name.toLowerCase() === currentLookupPatient.name.toLowerCase())
  );

  // New Report Entry Form
  const [reportForm, setReportForm] = useState({
    testName: 'Complete Blood Count (CBC) with ESR',
    specimen: 'Whole Blood (EDTA)',
    parameters: [
      { parameter: 'Hemoglobin (Hb)', result: '14.2', unit: 'g/dL', reference: '13.0 - 17.0 g/dL', flag: 'NORMAL' },
      { parameter: 'Total WBC Count', result: '7,800', unit: '/cu.mm', reference: '4,000 - 11,000', flag: 'NORMAL' },
      { parameter: 'Platelet Count', result: '240,000', unit: '/cu.mm', reference: '150,000 - 450,000', flag: 'NORMAL' },
      { parameter: 'ESR (Westergren)', result: '12', unit: 'mm in 1st hr', reference: '0 - 15 mm', flag: 'NORMAL' }
    ],
    impression: 'Normal hematological profile. No significant cytopenia or leukocytosis noted.'
  });

  const staffName = user?.name || 'Md. Rafiqul Islam';
  const staffCode = user?.patient_id || user?.employee_code || 'L101';

  const pendingSamples = accountsPaidBookings.filter(b => b.status === 'Pending');
  const confirmedSamples = accountsPaidBookings.filter(b => b.status === 'Confirmed');
  const completedSamples = accountsPaidBookings.filter(b => b.status === 'Completed');

  const filteredBookings = accountsPaidBookings.filter(b => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    return (
      (b.test_number && b.test_number.toLowerCase().includes(q)) ||
      (b.patient_id && b.patient_id.toLowerCase().includes(q)) ||
      (b.patient_name && b.patient_name.toLowerCase().includes(q)) ||
      (b.package_name && b.package_name.toLowerCase().includes(q)) ||
      (b.invoice_code && b.invoice_code.toLowerCase().includes(q)) ||
      (b.id && b.id.toLowerCase().includes(q)) ||
      (b.patient_phone && b.patient_phone.includes(q))
    );
  });

  // Auto-Match detector for immediate highlight card in Requests tab
  const matchedTestOrPatient = (() => {
    if (!searchTerm.trim()) return null;
    const q = searchTerm.trim().toUpperCase();

    // Check match on test_number
    const testMatch = accountsPaidBookings.find(b => b.test_number && b.test_number.toUpperCase() === q);
    if (testMatch) {
      const allTestsForThisPatient = accountsPaidBookings.filter(b => 
        (testMatch.patient_id && b.patient_id && b.patient_id.toUpperCase() === testMatch.patient_id.toUpperCase()) ||
        (testMatch.invoice_code && b.invoice_code && b.invoice_code === testMatch.invoice_code)
      );
      return {
        matchType: 'test',
        highlightTestId: testMatch.test_number,
        patient_id: testMatch.patient_id,
        patient_name: testMatch.patient_name,
        patient_phone: testMatch.patient_phone,
        invoice_code: testMatch.invoice_code,
        tests: allTestsForThisPatient
      };
    }

    // Check match on patient_id
    const patientMatches = accountsPaidBookings.filter(b => b.patient_id && b.patient_id.toUpperCase() === q);
    if (patientMatches.length > 0) {
      return {
        matchType: 'patient',
        patient_id: patientMatches[0].patient_id,
        patient_name: patientMatches[0].patient_name,
        patient_phone: patientMatches[0].patient_phone,
        invoice_code: patientMatches[0].invoice_code,
        tests: patientMatches
      };
    }

    return null;
  })();

  const handleOpenReportModal = (booking) => {
    setSelectedBookingForReport(booking);
    setReportForm({
      testName: booking.package_name,
      specimen: booking.package_name.toLowerCase().includes('urine') ? 'Urine Sample' : 'Venous Blood (Serum)',
      parameters: [
        { parameter: 'Fasting Blood Glucose', result: '5.6', unit: 'mmol/L', reference: '4.0 - 6.0 mmol/L', flag: 'NORMAL' },
        { parameter: 'Total Cholesterol', result: '190', unit: 'mg/dL', reference: '< 200 mg/dL', flag: 'NORMAL' },
        { parameter: 'Serum Creatinine', result: '1.0', unit: 'mg/dL', reference: '0.7 - 1.3 mg/dL', flag: 'NORMAL' },
        { parameter: 'SGPT / ALT', result: '32', unit: 'U/L', reference: '< 45 U/L', flag: 'NORMAL' }
      ],
      impression: `Test findings for ${booking.package_name} are within acceptable physiological biological limits.`
    });
  };

  const handleParameterChange = (index, field, val) => {
    setReportForm(prev => {
      const updated = [...prev.parameters];
      updated[index][field] = val;
      return { ...prev, parameters: updated };
    });
  };

  const handleAddParameter = () => {
    setReportForm(prev => ({
      ...prev,
      parameters: [
        ...prev.parameters,
        { parameter: '', result: '', unit: '', reference: '', flag: 'NORMAL' }
      ]
    }));
  };

  const handleSaveReport = (e) => {
    e.preventDefault();
    if (!selectedBookingForReport) return;

    const reportData = {
      booking_id: selectedBookingForReport.id,
      patient_name: selectedBookingForReport.patient_name,
      patient_phone: selectedBookingForReport.patient_phone,
      patient_id: selectedBookingForReport.patient_id || 'P01',
      test_name: reportForm.testName,
      specimen: reportForm.specimen,
      technician_code: staffCode,
      technician_name: staffName,
      parameters: reportForm.parameters.filter(p => p.parameter.trim() !== ''),
      impression: reportForm.impression
    };

    const res = issueLabReport(reportData);
    setSelectedBookingForReport(null);
    setViewingReport(res.report);
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        
        {/* Lab Header Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-sky-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-blue-500/20">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black font-mono tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30">
                Lab Officer ID: {staffCode}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-cyan-300">
                Department: Pathology & Clinical Biochemistry
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <span>{staffName}</span>
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm max-w-xl">
              MediCare Laboratory Information Management System (LIMS) • Real-time Analyzer Sync
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-blue-200">
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                <Microscope className="w-3.5 h-3.5 text-cyan-400" /> Station: Diagnostic Lab Counter #02
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Shift: Morning & Midday
              </span>
            </div>
          </div>

          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15 space-y-1.5 text-right shrink-0">
            <span className="text-[11px] text-blue-200 block font-medium">Auto-Analyzer Link:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              All Analyzers Calibrated
            </span>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-1">
              <span>Pending Samples</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{pendingSamples.length}</div>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">Awaiting sample draw</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-1">
              <span>In Analyzer</span>
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{confirmedSamples.length}</div>
            <p className="text-[11px] text-blue-600 font-semibold mt-1">Under testing run</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-1">
              <span>Released Reports</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-slate-900">{labReports.length}</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Verified & signed</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-1">
              <span>Lab Billings</span>
              <FlaskConical className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">৳ {labBookings.reduce((s, b) => s + (b.price || 0), 0).toLocaleString()}</div>
            <p className="text-[11px] text-cyan-600 font-semibold mt-1">Total revenue processed</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'requests'
                ? 'bg-blue-800 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            Test Requests & Samples ({labBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'reports'
                ? 'bg-blue-800 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Verified Diagnostic Reports ({labReports.length})
          </button>

          <button
            onClick={() => setActiveTab('equipment')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'equipment'
                ? 'bg-blue-800 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Microscope className="w-4 h-4" />
            Analyzers & Equipment Health
          </button>

          <button
            onClick={() => setActiveTab('patient-lookup')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'patient-lookup'
                ? 'bg-blue-800 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            Patient Search by ID (রোগীর তথ্য ও প্রেসক্রিপশন)
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Settings className="w-4 h-4 text-cyan-400" />
            Profile & Security (প্রোফাইল সেটিংস)
          </button>
        </div>

        {/* TAB 1: Test Requests & Workflows */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Diagnostic Test Requests & Sample Flow</h3>
                <p className="text-xs text-slate-500">
                  Real-time synchronization with Accounts. Only tests paid at Accounts are shown here.
                </p>
              </div>

              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Patient ID (P02, P01) or Test # (112233)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Quick Select Patient / Test Number Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
              <span className="text-slate-400 font-bold text-[10px] uppercase">Quick Filter Patient / Test:</span>
              {Array.from(new Set(accountsPaidBookings.map(b => b.patient_id).filter(Boolean))).map(pid => {
                const sampleBooking = accountsPaidBookings.find(b => b.patient_id === pid);
                return (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => setSearchTerm(pid)}
                    className={`px-2.5 py-0.5 rounded-lg font-mono font-bold text-[11px] border transition-all ${
                      searchTerm.toUpperCase() === pid.toUpperCase()
                        ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    {pid} ({sampleBooking?.patient_name?.split(' ')[0]})
                  </button>
                );
              })}
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-[11px] font-bold text-rose-600 hover:underline px-1"
                >
                  Clear Filter
                </button>
              )}
            </div>

            {/* Auto-Matched Highlight Card when Patient ID or Test ID is searched */}
            {matchedTestOrPatient && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 p-5 rounded-2xl shadow-sm space-y-3 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-blue-200 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-600 text-white font-mono font-black text-xs px-2.5 py-0.5 rounded-md">
                        {matchedTestOrPatient.matchType === 'test' ? `Test Token Match: #${matchedTestOrPatient.highlightTestId}` : `Patient ID Match: ${matchedTestOrPatient.patient_id}`}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                        ✓ Paid at Accounts ({matchedTestOrPatient.invoice_code || 'Accounts POS'})
                      </span>
                    </div>
                    <h4 className="text-base font-black text-slate-900 mt-1">
                      {matchedTestOrPatient.patient_name} <span className="font-mono text-cyan-800 text-xs font-bold">(Patient ID: {matchedTestOrPatient.patient_id})</span>
                    </h4>
                    <p className="text-xs text-slate-600">📞 Phone: {matchedTestOrPatient.patient_phone || 'N/A'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1 rounded-xl shadow-xs"
                  >
                    View All Tests
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-blue-900">
                    Prescribed & Paid Diagnostic Tests for this Patient ({matchedTestOrPatient.tests.length}):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {matchedTestOrPatient.tests.map(test => (
                      <div 
                        key={test.id} 
                        className={`p-3.5 rounded-xl border bg-white flex flex-col justify-between gap-3 shadow-xs ${
                          matchedTestOrPatient.highlightTestId === test.test_number ? 'ring-2 ring-blue-500 border-blue-400 bg-blue-50/40' : 'border-blue-200'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-mono font-black text-xs text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                              Test ID: #{test.test_number || test.id}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              test.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                              test.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {test.status}
                            </span>
                          </div>
                          <h5 className="font-bold text-slate-900 text-sm mt-1.5">{test.package_name}</h5>
                          <p className="text-xs text-slate-500">Specimen: {test.package_name.toLowerCase().includes('urine') ? 'Urine Sample' : 'Venous Blood'}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="font-bold text-slate-900 text-xs">৳ {test.price} (Paid)</span>
                          <div className="flex items-center gap-2">
                            {test.status === 'Pending' && (
                              <button
                                type="button"
                                onClick={() => updateLabBookingStatus(test.id, 'Confirmed')}
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg border border-blue-200 text-xs"
                              >
                                Collect Sample
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenReportModal(test)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm"
                            >
                              <FileText className="w-3.5 h-3.5" /> Enter Findings
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                    <th className="py-3 px-4">Test Token & Date</th>
                    <th className="py-3 px-4">Patient Information</th>
                    <th className="py-3 px-4">Test Package & Specimen</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">LIMS Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400">
                        No lab tests found. Tests submitted from Accounts billing will appear here automatically.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-mono font-black text-xs text-blue-900 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded-md shadow-xs inline-block">
                            Test #{b.test_number || b.id}
                          </span>
                          <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold block mt-1">
                            ✓ Paid ({b.invoice_code || 'Accounts POS'})
                          </span>
                          <span className="text-slate-400 text-[10px] block mt-0.5">{b.booking_date} • {b.collection_type || 'Lab Counter #02'}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-900 block text-sm">{b.patient_name}</span>
                          <span className="text-slate-500 text-[11px]">{b.patient_phone}</span>
                          <span className="font-mono text-[10px] text-cyan-700 font-bold">ID: {b.patient_id || 'P01'}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-blue-900 block text-xs">{b.package_name}</span>
                          <span className="text-slate-500 text-[11px]">Fee: ৳ {b.price}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            b.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                            b.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {b.status === 'Pending' && (
                              <button
                                onClick={() => updateLabBookingStatus(b.id, 'Confirmed')}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl border border-blue-200 text-xs transition-colors"
                              >
                                Collect Sample
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenReportModal(b)}
                              className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white font-bold rounded-xl shadow-sm text-xs transition-all"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Enter Findings</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Verified Reports Archive */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Released Pathology & Diagnostic Reports</h3>
                <p className="text-xs text-slate-500">Official lab slips verified by {staffName} ({staffCode})</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {labReports.map(rep => (
                <div key={rep.id} className="p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono font-black text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-lg">
                        {rep.report_code}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-1">{rep.test_name}</h4>
                      <p className="text-xs text-slate-600 font-medium">Patient: {rep.patient_name} (ID: {rep.patient_id})</p>
                      <span className="text-[11px] text-slate-400 block font-mono">Released: {rep.verified_at}</span>
                    </div>

                    <button
                      onClick={() => setViewingReport(rep)}
                      className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 bg-white border border-blue-200 px-3 py-1.5 rounded-xl shadow-sm hover:bg-blue-50 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View & Print</span>
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200/70 text-xs">
                    <span className="font-bold text-slate-800 block mb-1">Impression:</span>
                    <p className="text-slate-600 line-clamp-2">{rep.impression}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Analyzers & Equipment Health */}
        {activeTab === 'equipment' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Laboratory Equipment & Analyzer Status</h3>
              <p className="text-xs text-slate-500">Live hardware calibration and diagnostic test capacities</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">Sysmex XN-550</span>
                  <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">Operational</span>
                </div>
                <p className="text-slate-500">Automated 5-Part Hematology Analyzer</p>
                <div className="pt-2 border-t border-emerald-200/60 text-slate-600 font-medium">
                  Calibration: Verified Today 07:00 AM
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">Roche Cobas c311</span>
                  <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">Operational</span>
                </div>
                <p className="text-slate-500">Clinical Chemistry & Electrolyte System</p>
                <div className="pt-2 border-t border-emerald-200/60 text-slate-600 font-medium">
                  QC Quality Control: Passed 100%
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">Bio-Rad D-10</span>
                  <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-blue-100 text-blue-800">Calibrated</span>
                </div>
                <p className="text-slate-500">HPLC Hemoglobin & HbA1c Analyzer</p>
                <div className="pt-2 border-t border-blue-200/60 text-slate-600 font-medium">
                  Reagent Buffer: 88% Full
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Patient Lookup by ID */}
        {activeTab === 'patient-lookup' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Patient ID Lookup & Diagnostic History (রোগীর তথ্য ও প্রেসক্রিপশন)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Search by permanent Patient ID (e.g. P01) to view contact details, doctor advice, and clinical lab investigations.
                </p>
              </div>

              {/* Patient Search Input */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={patientSearchId}
                    onChange={(e) => setPatientSearchId(e.target.value)}
                    placeholder="Enter Patient ID (P02, P01) or Test # (112233)..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Quick Demo Patient ID Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-semibold text-[11px]">Quick Patient Lookups:</span>
              <button
                type="button"
                onClick={() => setPatientSearchId('P01')}
                className={`px-3 py-1 rounded-xl font-mono text-xs font-bold transition-all ${
                  patientSearchId.toUpperCase() === 'P01'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                P01 (John Doe)
              </button>
              <button
                type="button"
                onClick={() => setPatientSearchId('P02')}
                className={`px-3 py-1 rounded-xl font-mono text-xs font-bold transition-all ${
                  patientSearchId.toUpperCase() === 'P02'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                P02 (Akramul Hasan)
              </button>
              {accountsPaidBookings.filter(b => b.test_number).slice(0, 2).map(b => (
                <button
                  key={b.test_number}
                  type="button"
                  onClick={() => setPatientSearchId(b.test_number)}
                  className={`px-3 py-1 rounded-xl font-mono text-xs font-bold transition-all ${
                    patientSearchId === b.test_number
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  Test #{b.test_number} ({b.patient_name.split(' ')[0]})
                </button>
              ))}
            </div>

            {currentLookupPatient ? (
              <div className="space-y-6">
                {/* Patient Profile Card */}
                <div className="bg-gradient-to-r from-blue-900 via-sky-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-black font-mono tracking-wider bg-white/20 text-cyan-200 border border-white/20">
                        Patient ID: {currentLookupPatient.patient_id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/30 text-emerald-300">
                        Verified Patient
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                      {currentLookupPatient.name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200 pt-1">
                      <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                        <Phone className="w-3.5 h-3.5 text-cyan-400" /> {currentLookupPatient.phone}
                      </span>
                      <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" /> {currentLookupPatient.address || 'Dhaka, Bangladesh'}
                      </span>
                      <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                        <Droplet className="w-3.5 h-3.5 text-rose-300" /> Blood: {currentLookupPatient.blood_group || 'B+'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/10 p-4 rounded-2xl border border-white/15 text-center shrink-0 min-w-[160px]">
                    <div className="text-xs text-slate-300">Prescriptions on File</div>
                    <div className="text-2xl font-black text-white">{patientPrescriptions.length}</div>
                    <div className="text-[10px] text-cyan-300 mt-0.5">Doctor Consultations</div>
                  </div>
                </div>

                {/* Section 1: Doctor Prescriptions & Advised Lab Tests */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-purple-600" />
                      <span>Doctor's Clinical Prescriptions & Advised Tests (ডাক্তারের টেস্ট নির্দেশিকা)</span>
                    </h4>
                    <span className="text-xs text-slate-500">{patientPrescriptions.length} record(s)</span>
                  </div>

                  {patientPrescriptions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {patientPrescriptions.map((rx) => (
                        <div key={rx.id} className="p-5 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-3">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                              <span className="text-xs font-mono font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                                {rx.prescription_code}
                              </span>
                              <h5 className="font-bold text-slate-900 text-sm mt-1">{rx.doctor_name}</h5>
                              <p className="text-xs text-purple-700">{rx.doctor_specialty}</p>
                            </div>
                            <span className="text-xs text-slate-500 font-mono">{rx.date}</span>
                          </div>

                          <div className="text-xs bg-white p-3 rounded-xl border border-purple-100">
                            <span className="font-bold text-slate-700 block mb-1">Clinical Diagnosis:</span>
                            <p className="text-slate-800">{rx.diagnosis}</p>
                          </div>

                          {/* Tests Advised By Doctor */}
                          {rx.tests_advised && rx.tests_advised.length > 0 && (
                            <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-200 space-y-2">
                              <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                                <FlaskConical className="w-4 h-4 text-blue-700" />
                                <span>Tests Advised by Doctor (ল্যাব টেস্ট করার পরামর্শ):</span>
                              </span>
                              <div className="flex flex-wrap gap-2 pt-1">
                                {rx.tests_advised.map((testName, i) => (
                                  <div key={i} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-blue-200 text-xs font-bold text-blue-900 shadow-sm">
                                    <span>• {testName}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenReportModal({
                                        id: `LAB-AUTO-${Date.now()}`,
                                        patient_name: currentLookupPatient.name,
                                        patient_id: currentLookupPatient.patient_id,
                                        package_name: testName,
                                        status: 'Pending'
                                      })}
                                      className="text-[10px] bg-blue-700 hover:bg-blue-800 text-white px-2 py-0.5 rounded font-medium ml-1"
                                    >
                                      Create Report
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                      No prescriptions found for this patient.
                    </div>
                  )}
                </div>

                {/* Section 2: Patient's Lab Samples History */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Microscope className="w-4 h-4 text-blue-600" />
                      <span>Lab Test Requests & Diagnostic History ({patientBookings.length})</span>
                    </h4>
                  </div>

                  {patientBookings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {patientBookings.map((b) => (
                        <div key={b.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-black text-xs text-blue-900 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded">
                              Test #{b.test_number || b.id}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                              b.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                              b.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {b.status}
                            </span>
                          </div>
                          <div className="font-bold text-slate-900 text-sm">{b.package_name}</div>
                          <div className="text-slate-500 flex flex-wrap items-center gap-2 text-[11px]">
                            <span>📅 {b.booking_date}</span>
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              ✓ Paid ({b.invoice_code || 'Accounts POS'})
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                            <span className="font-black text-blue-800">৳ {b.price}</span>
                            <button
                              type="button"
                              onClick={() => handleOpenReportModal(b)}
                              className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" /> Enter Findings / Release Report
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                      No prior lab bookings recorded for this patient.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-slate-50 rounded-3xl border border-slate-200 space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">No Patient Found</h4>
                <p className="text-xs text-slate-500">
                  Could not locate any patient with ID "{patientSearchId}". Please try searching with "P01" or patient mobile number.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Profile & Security */}
        {activeTab === 'profile' && (
          <ProfileSettingsView theme="blue" />
        )}

      </div>

      {/* MODAL 1: Enter Findings & Generate Report */}
      {selectedBookingForReport && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedBookingForReport(null); }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
            <div className="bg-gradient-to-r from-blue-800 via-sky-800 to-blue-900 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded uppercase">
                  LIMS Report Generator
                </span>
                <h3 className="text-xl font-bold mt-1">Enter Findings for: {selectedBookingForReport.package_name}</h3>
                <p className="text-xs text-blue-200">Patient: {selectedBookingForReport.patient_name} (ID: {selectedBookingForReport.patient_id || 'P01'})</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBookingForReport(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Test Title</label>
                  <input
                    type="text"
                    required
                    value={reportForm.testName}
                    onChange={(e) => setReportForm({ ...reportForm, testName: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Specimen Type</label>
                  <input
                    type="text"
                    value={reportForm.specimen}
                    onChange={(e) => setReportForm({ ...reportForm, specimen: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs"
                  />
                </div>
              </div>

              {/* Parameters Table */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-800 text-xs">
                    Laboratory Parameters & Findings:
                  </label>
                  <button
                    type="button"
                    onClick={handleAddParameter}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-100"
                  >
                    <Plus className="w-3 h-3" /> Add Parameter
                  </button>
                </div>

                <div className="space-y-2">
                  {reportForm.parameters.map((param, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 items-center">
                      <div className="col-span-4">
                        <input
                          type="text"
                          required
                          placeholder="Parameter Name"
                          value={param.parameter}
                          onChange={(e) => handleParameterChange(idx, 'parameter', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          required
                          placeholder="Result"
                          value={param.result}
                          onChange={(e) => handleParameterChange(idx, 'result', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs text-center font-bold"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          placeholder="Unit"
                          value={param.unit}
                          onChange={(e) => handleParameterChange(idx, 'unit', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs text-center"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="Normal Range"
                          value={param.reference}
                          onChange={(e) => handleParameterChange(idx, 'reference', e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setReportForm(prev => ({
                              ...prev,
                              parameters: prev.parameters.filter((_, i) => i !== idx)
                            }));
                          }}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impression */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Pathologist Clinical Impression & Comments</label>
                <textarea
                  rows={2}
                  required
                  value={reportForm.impression}
                  onChange={(e) => setReportForm({ ...reportForm, impression: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white font-bold py-3 rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify & Release Diagnostic Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBookingForReport(null)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: View / Print Official Lab Report */}
      {viewingReport && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setViewingReport(null); }}
          className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in duration-150">
            
            <div className="bg-slate-900 px-6 py-3.5 text-white flex justify-between items-center text-xs">
              <span className="font-bold flex items-center gap-1.5 text-cyan-300">
                <ShieldCheck className="w-4 h-4" /> Official Verified Laboratory Slip ({viewingReport.report_code})
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Report Slip
                </button>
                <button
                  type="button"
                  onClick={() => setViewingReport(null)}
                  className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm"
                >
                  <X className="w-4 h-4" />
                  <span>Close (কেটে দিন)</span>
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6 text-slate-800 bg-white" id="printable-lab">
              
              {/* Header */}
              <div className="border-b-2 border-blue-900 pb-4 flex justify-between items-start">
                <div>
                  <div className="text-2xl font-black text-blue-900 tracking-tight">Medi<span className="text-cyan-600">Care</span> Diagnostic Lab</div>
                  <p className="text-xs text-slate-600 font-semibold">ISO 15189 Certified Clinical Pathology & Molecular Lab</p>
                  <span className="text-[11px] text-slate-400">Main Lab Center • Dhanmondi, Dhaka</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    Report ID: {viewingReport.report_code}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1 font-mono">{viewingReport.verified_at}</span>
                </div>
              </div>

              {/* Patient and Specimen Meta */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Patient Name:</span>
                  <span className="font-bold text-slate-900">{viewingReport.patient_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Patient ID:</span>
                  <span className="font-bold font-mono text-cyan-700">{viewingReport.patient_id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Test Name:</span>
                  <span className="font-bold text-blue-900">{viewingReport.test_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Verified By:</span>
                  <span className="font-bold text-slate-900">{viewingReport.technician_code}</span>
                </div>
              </div>

              {/* Findings Table */}
              <div className="space-y-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-blue-50/80 text-blue-900 font-bold uppercase border-b border-blue-200 text-[11px]">
                      <th className="py-2.5 px-3">Test Parameter</th>
                      <th className="py-2.5 px-3 text-center">Observed Result</th>
                      <th className="py-2.5 px-3 text-center">Unit</th>
                      <th className="py-2.5 px-3 text-right">Biological Reference Interval</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingReport.parameters?.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{p.parameter}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900">{p.result}</td>
                        <td className="py-2.5 px-3 text-center text-slate-500 font-mono text-[11px]">{p.unit}</td>
                        <td className="py-2.5 px-3 text-right text-slate-600 font-mono text-[11px]">{p.reference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Impression */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block mb-1">Pathological Interpretation & Impression:</span>
                <p className="text-slate-700">{viewingReport.impression}</p>
              </div>

              {/* Footer Stamp */}
              <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">End of Laboratory Report</span>
                  <span className="text-[10px] text-emerald-700 font-bold">✓ Validated via Automatic Sysmex/Cobas LIMS</span>
                </div>
                <div className="text-right">
                  <div className="font-signature text-blue-900 font-bold text-base italic">
                    {viewingReport.technician_name}
                  </div>
                  <span className="border-t border-slate-400 pt-0.5 text-[10px] text-slate-500 block">
                    Chief Laboratory Technologist ({viewingReport.technician_code})
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Modal Action Footer */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-600 font-medium">
                Report ID: <strong className="font-mono text-blue-900">{viewingReport.report_code}</strong> • Patient: <strong>{viewingReport.patient_name}</strong> ({viewingReport.patient_id})
              </span>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
                <button
                  type="button"
                  onClick={() => setViewingReport(null)}
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

export default LabPortal;
