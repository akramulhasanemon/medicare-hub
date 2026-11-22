import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Search, 
  Filter, 
  ShieldAlert, 
  Stethoscope, 
  AlertCircle,
  FileCheck,
  Building2,
  DollarSign,
  Pill,
  FlaskConical,
  Siren,
  ShoppingBag,
  Truck,
  Landmark,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  ShieldCheck,
  BadgePercent,
  Droplet,
  MapPin,
  User
} from 'lucide-react';

const AdminDashboard = ({ setActivePage }) => {
  const { user } = useAuth();
  const { 
    appointments, 
    updateAppointmentStatus, 
    doctors, 
    departments, 
    addDoctor,
    deleteDoctor,
    getNextDoctorCode,
    labEmployees,
    addLabEmployee,
    deleteLabEmployee,
    getNextLabCode,
    accountsStaff,
    addAccountsStaff,
    deleteAccountsStaff,
    getNextAccountsCode,
    pharmacyOrders,
    updatePharmacyOrderStatus,
    labBookings,
    updateLabBookingStatus,
    ambulanceRequests,
    updateAmbulanceStatus
  } = useData();

  // Strict Access Control Guard - Only Admin allowed
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Admin Clearance Required</h2>
          <p className="text-xs text-slate-500">
            এই কমান্ড সেন্টারটি শুধুমাত্র প্রধান অ্যাডমিনের জন্য সংরক্ষিত। আপনার বর্তমান অ্যাকাউন্ট রোল: <strong className="capitalize text-slate-800">{user?.role || 'Guest'}</strong>
          </p>
          <button
            onClick={() => {
              if (user?.role === 'doctor') setActivePage('doctor-portal');
              else if (user?.role === 'lab_staff') setActivePage('lab-portal');
              else if (user?.role === 'accountant') setActivePage('accounts-portal');
              else if (user?.role === 'patient') setActivePage('patient-dashboard');
              else setActivePage('login');
            }}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
          >
            Go to Your Designated Portal
          </button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'doctors' | 'pharmacy' | 'lab' | 'ambulance' | 'lab_employees' | 'accounts_section'
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Note editing state for an appointment
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [customNote, setCustomNote] = useState('');

  // Modals state
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [isAddLabModalOpen, setIsAddLabModalOpen] = useState(false);
  const [isAddAccountsModalOpen, setIsAddAccountsModalOpen] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

  // Patients Directory State across database & registered users
  const getRegisteredPatients = () => {
    const list = [
      {
        id: 1,
        patient_id: 'P01',
        name: 'John Doe',
        phone: '01811112233',
        email: 'patient@medicare.com',
        address: 'House 14, Road 5, Dhanmondi, Dhaka',
        blood_group: 'B+',
        gender: 'Male',
        created_at: '2026-11-20'
      },
      {
        id: 2,
        patient_id: 'P02',
        name: 'Tanvir Hassan',
        phone: '01712345678',
        email: 'tanvir@medicare.com',
        address: 'Mirpur-10, Dhaka',
        blood_group: 'A+',
        gender: 'Male',
        created_at: '2026-11-21'
      }
    ];

    try {
      const reg = JSON.parse(localStorage.getItem('medicare_registered_users') || '[]');
      reg.filter(u => u.role === 'patient' || !u.role || (u.patient_id && u.patient_id.startsWith('P'))).forEach(u => {
        const existingIdx = list.findIndex(p => p.patient_id?.toUpperCase() === u.patient_id?.toUpperCase());
        const patObj = {
          id: u.id || Date.now(),
          patient_id: u.patient_id || 'P03',
          name: u.name || 'Patient',
          phone: u.phone || '01700000000',
          email: u.email || 'patient@medicare.com',
          address: u.address || 'Dhaka, Bangladesh',
          blood_group: u.blood_group || 'O+',
          gender: u.gender || 'Male',
          created_at: u.created_at || '2026-11-22'
        };
        if (existingIdx >= 0) {
          list[existingIdx] = patObj;
        } else {
          list.push(patObj);
        }
      });
    } catch (e) {
      console.error(e);
    }

    return list;
  };

  const [patientsList, setPatientsList] = useState(() => getRegisteredPatients());
  const [patientSearchTerm, setPatientSearchTerm] = useState('');

  const getNextPatientCode = () => {
    let max = 0;
    patientsList.forEach(p => {
      const m = (p.patient_id || '').match(/^P(\d+)$/i);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n > max) max = n;
      }
    });
    return `P${String(max + 1).padStart(2, '0')}`;
  };

  const [patientForm, setPatientForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: 'Dhaka, Bangladesh',
    blood_group: 'A+',
    gender: 'Male',
    password: 'password123'
  });

  const handleAddPatientSubmit = (e) => {
    e.preventDefault();
    if (!patientForm.name) return;
    const nextCode = getNextPatientCode();
    const newPatient = {
      id: Date.now(),
      patient_id: nextCode,
      name: patientForm.name,
      email: patientForm.email || `${nextCode.toLowerCase()}@medicare.com`,
      phone: patientForm.phone || '01700000000',
      address: patientForm.address || 'Dhaka, Bangladesh',
      blood_group: patientForm.blood_group || 'O+',
      gender: patientForm.gender || 'Male',
      created_at: new Date().toISOString().split('T')[0],
      role: 'patient',
      password: patientForm.password || 'password123'
    };

    const updated = [newPatient, ...patientsList];
    setPatientsList(updated);

    const registered = JSON.parse(localStorage.getItem('medicare_registered_users') || '[]');
    registered.push(newPatient);
    localStorage.setItem('medicare_registered_users', JSON.stringify(registered));

    setIsAddPatientModalOpen(false);
    setPatientForm({
      name: '',
      email: '',
      phone: '',
      address: 'Dhaka, Bangladesh',
      blood_group: 'A+',
      gender: 'Male',
      password: 'password123'
    });
  };

  const handleDeletePatient = (patientId) => {
    if (window.confirm(`Are you sure you want to delete patient ${patientId}?`)) {
      setPatientsList(prev => prev.filter(p => p.patient_id !== patientId));
      const registered = JSON.parse(localStorage.getItem('medicare_registered_users') || '[]');
      const filtered = registered.filter(u => u.patient_id !== patientId);
      localStorage.setItem('medicare_registered_users', JSON.stringify(filtered));
    }
  };

  const filteredPatientsList = patientsList.filter(p => {
    if (!patientSearchTerm.trim()) return true;
    const q = patientSearchTerm.trim().toLowerCase();
    return (
      (p.patient_id && p.patient_id.toLowerCase().includes(q)) ||
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.phone && p.phone.includes(q)) ||
      (p.blood_group && p.blood_group.toLowerCase().includes(q)) ||
      (p.address && p.address.toLowerCase().includes(q))
    );
  });

  // Forms
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialty: '',
    phone: '',
    address: '',
    department_id: 1,
    qualification: '',
    experience_years: 5,
    consultation_fee: 800,
    available_days: 'Sat, Mon, Wed',
    available_time: '05:00 PM - 09:00 PM',
    bio: '',
    image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    email: '',
    password: 'doctor123'
  });

  const [labForm, setLabForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialization: 'Pathologist & Lab Technologist',
    department: 'Pathology & Diagnostic Lab',
    password: 'lab123'
  });

  const [accountsForm, setAccountsForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    designation: 'Accounts & Billing Officer',
    section: 'Hospital Billing & Cash Counter',
    password: 'account123'
  });

  // Calculate Metrics
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
  
  const totalPharmacySales = pharmacyOrders.reduce((sum, o) => sum + (o.total_amount || o.totalAmount || 0), 0);
  const totalLabRevenue = labBookings.reduce((sum, l) => sum + (l.price || 0), 0);
  const totalDoctorRevenue = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'completed')
    .reduce((sum, a) => {
      const doc = doctors.find(d => d.id === a.doctor_id);
      return sum + (doc ? Number(doc.consultation_fee) : 500);
    }, 0);

  const grandRevenue = totalDoctorRevenue + totalPharmacySales + totalLabRevenue;

  // Filtered Appointments
  const filteredAppointments = appointments.filter(app => {
    const matchStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchSearch = searchTerm.trim() === '' ||
      app.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.patient_phone.includes(searchTerm) ||
      String(app.id).includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const handleStatusChange = (id, newStatus) => {
    let note = '';
    if (newStatus === 'confirmed') note = 'Slot confirmed. Room 304. Please visit 15 mins prior to time.';
    if (newStatus === 'cancelled') note = 'Sorry, doctor is unavailable at this slot.';
    if (newStatus === 'completed') note = 'Consultation successfully completed.';
    updateAppointmentStatus(id, newStatus, note);
  };

  const handleSaveNote = (id) => {
    const app = appointments.find(a => a.id === id);
    if (app) {
      updateAppointmentStatus(id, app.status, customNote);
    }
    setEditingNoteId(null);
    setCustomNote('');
  };

  const handleAddDoctorSubmit = (e) => {
    e.preventDefault();
    if (!doctorForm.name || !doctorForm.specialty) return;
    addDoctor(doctorForm);
    setIsAddDoctorModalOpen(false);
    setDoctorForm({
      name: '',
      specialty: '',
      phone: '',
      address: '',
      department_id: 1,
      qualification: '',
      experience_years: 5,
      consultation_fee: 800,
      available_days: 'Sat, Mon, Wed',
      available_time: '05:00 PM - 09:00 PM',
      bio: '',
      image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
      email: '',
      password: 'doctor123'
    });
  };

  const handleAddLabSubmit = (e) => {
    e.preventDefault();
    if (!labForm.name) return;
    addLabEmployee(labForm);
    setIsAddLabModalOpen(false);
    setLabForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      specialization: 'Pathologist & Lab Technologist',
      department: 'Pathology & Diagnostic Lab',
      password: 'lab123'
    });
  };

  const handleAddAccountsSubmit = (e) => {
    e.preventDefault();
    if (!accountsForm.name) return;
    addAccountsStaff(accountsForm);
    setIsAddAccountsModalOpen(false);
    setAccountsForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      designation: 'Accounts & Billing Officer',
      section: 'Hospital Billing & Cash Counter',
      password: 'account123'
    });
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Clinic Administration
              </span>
              <span className="text-xs text-slate-400">Live Hospital & Staff Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              MediCare Command Center
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              Real-time monitoring for doctor appointments, staff accounts (D101, L101, A101), lab tests, and hospital pharmacy.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setIsAddDoctorModalOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 transition-all text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Doctor (D10X)
            </button>
            <button
              onClick={() => setIsAddLabModalOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Lab Staff (L10X)
            </button>
            <button
              onClick={() => setIsAddAccountsModalOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Account (A10X)
            </button>
            <button
              onClick={() => setIsAddPatientModalOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-600/30 transition-all text-xs"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add Patient ({getNextPatientCode()})
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Appointments</span>
              <Calendar className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{totalAppointments}</div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">
              {pendingAppointments.length} pending review
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Patients (P01+)</span>
              <Users className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{patientsList.length}</div>
            <div className="text-[11px] text-cyan-600 font-semibold mt-1">
              Registered Patients
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Doctors (D101+)</span>
              <Stethoscope className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{doctors.length}</div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1">
              Active Specialists
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Lab Staff (L101+)</span>
              <FlaskConical className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{labEmployees.length}</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">
              Technicians & Pathologists
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Accounts (A101+)</span>
              <Landmark className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{accountsStaff.length}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              Finance & Billing
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">৳ {grandRevenue.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              Live Combined Billing
            </div>
          </div>
        </div>

        {/* Tab Selection Bar matching user screenshot */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'appointments'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Appointments ({appointments.length})
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'patients'
                ? 'bg-cyan-700 text-white shadow-md shadow-cyan-700/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-cyan-600" />
            Patients ({patientsList.length})
          </button>

          <button
            onClick={() => setActiveTab('pharmacy')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'pharmacy'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Pill className="w-4 h-4" />
            Pharmacy Orders ({pharmacyOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('lab')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'lab'
                ? 'bg-blue-700 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            Lab Tests ({labBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('ambulance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'ambulance'
                ? 'bg-rose-700 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Siren className="w-4 h-4" />
            Ambulance Dispatches ({ambulanceRequests.length})
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'doctors'
                ? 'bg-purple-800 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Doctors Roster ({doctors.length})
          </button>

          {/* New Tab 1: Lab Employees */}
          <button
            onClick={() => setActiveTab('lab_employees')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'lab_employees'
                ? 'bg-cyan-700 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            Lab Employees ({labEmployees.length})
          </button>

          {/* New Tab 2: Accounts Section */}
          <button
            onClick={() => setActiveTab('accounts_section')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'accounts_section'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Landmark className="w-4 h-4" />
            Accounts Section ({accountsStaff.length})
          </button>
        </div>

        {/* TAB 1: Appointments Management */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by patient name, phone, or doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Status filter buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                      filterStatus === status
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4">ID & Patient</th>
                    <th className="py-3 px-4">Doctor & Specialty</th>
                    <th className="py-3 px-4">Date & Slot</th>
                    <th className="py-3 px-4">Symptoms / Clinic Notice</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(app => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] text-slate-400 font-mono">#{app.id}</span>
                            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
                              ID: {app.patient_code || (typeof app.patient_id === 'string' && app.patient_id.startsWith('P') ? app.patient_id : 'P01')}
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 block text-sm">{app.patient_name}</span>
                          <span className="text-slate-500 text-[11px]">{app.patient_phone}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-800 block">{app.doctor_name}</span>
                          <span className="text-cyan-600 font-semibold text-[11px]">{app.doctor_specialty}</span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-800 block">{app.appointment_date}</span>
                          <span className="text-slate-500 text-[11px]">{app.appointment_time}</span>
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          {app.symptoms && (
                            <p className="text-slate-600 truncate mb-1" title={app.symptoms}>
                              <span className="font-semibold text-slate-800">Symp:</span> {app.symptoms}
                            </p>
                          )}
                          {editingNoteId === app.id ? (
                            <div className="flex gap-1.5 mt-1">
                              <input
                                type="text"
                                value={customNote}
                                onChange={(e) => setCustomNote(e.target.value)}
                                placeholder="Add instruction/room..."
                                className="border border-slate-300 rounded px-2 py-0.5 text-[11px] w-full"
                              />
                              <button
                                onClick={() => handleSaveNote(app.id)}
                                className="bg-cyan-600 text-white px-2 py-0.5 rounded text-[10px] font-bold"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <span className="text-cyan-700 font-medium italic truncate">
                                {app.admin_notes || 'No instructions added'}
                              </span>
                              <button
                                onClick={() => { setEditingNoteId(app.id); setCustomNote(app.admin_notes || ''); }}
                                className="text-cyan-600 hover:underline text-[10px] font-bold shrink-0"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            app.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            app.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {app.status !== 'confirmed' && (
                              <button
                                onClick={() => handleStatusChange(app.id, 'confirmed')}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg border border-emerald-200 transition-colors"
                              >
                                Confirm
                              </button>
                            )}
                            {app.status !== 'completed' && (
                              <button
                                onClick={() => handleStatusChange(app.id, 'completed')}
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg border border-blue-200 transition-colors"
                              >
                                Complete
                              </button>
                            )}
                            {app.status !== 'cancelled' && (
                              <button
                                onClick={() => handleStatusChange(app.id, 'cancelled')}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-200 transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        No appointments found matching this criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Pharmacy Orders */}
        {activeTab === 'pharmacy' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Hospital E-Pharmacy Orders</h3>
                <p className="text-xs text-slate-500">Live order fulfillment and prescription deliveries</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Revenue: ৳ {totalPharmacySales.toLocaleString()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                    <th className="py-3 px-4">Order ID & Customer</th>
                    <th className="py-3 px-4">Delivery Address</th>
                    <th className="py-3 px-4">Items Count</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {pharmacyOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block font-mono">{order.id}</span>
                        <span className="text-slate-600">{order.customer_name}</span>
                        <span className="text-slate-400 block text-[11px]">{order.customer_phone}</span>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate">{order.delivery_address}</td>
                      <td className="py-3 px-4 font-semibold">{order.items ? order.items.length : 1} items</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">৳ {order.total_amount || order.totalAmount}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => updatePharmacyOrderStatus(order.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Lab Tests */}
        {activeTab === 'lab' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Lab Diagnostic & Pathology Requests</h3>
                <p className="text-xs text-slate-500">Home sample collection and hospital walk-in tests</p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Lab Revenue: ৳ {totalLabRevenue.toLocaleString()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                    <th className="py-3 px-4">ID & Patient</th>
                    <th className="py-3 px-4">Test Package</th>
                    <th className="py-3 px-4">Booking Date</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {labBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block font-mono">{b.id}</span>
                        <span className="text-slate-700">{b.patient_name}</span>
                        <span className="text-slate-400 block text-[11px]">{b.patient_phone}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-blue-700">{b.package_name}</td>
                      <td className="py-3 px-4">{b.booking_date}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">৳ {b.price}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          b.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          b.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                          b.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={b.status}
                          onChange={(e) => updateLabBookingStatus(b.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Ambulance Requests */}
        {activeTab === 'ambulance' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">24/7 Emergency Ambulance Dispatches</h3>
                <p className="text-xs text-slate-500">Live GPS dispatch records for ICU & AC Ambulances</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                    <th className="py-3 px-4">Emergency ID</th>
                    <th className="py-3 px-4">Caller / Patient</th>
                    <th className="py-3 px-4">Pickup Address</th>
                    <th className="py-3 px-4">Ambulance Type</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Dispatch Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {ambulanceRequests.map(amb => (
                    <tr key={amb.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-rose-700">{amb.id}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{amb.patient_name}</span>
                        <span className="text-slate-500">{amb.phone}</span>
                      </td>
                      <td className="py-3 px-4 max-w-xs">{amb.pickup_address}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{amb.ambulance_type}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          {amb.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={amb.status}
                          onChange={(e) => updateAmbulanceStatus(amb.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold"
                        >
                          <option value="Dispatched">Dispatched</option>
                          <option value="En Route">En Route</option>
                          <option value="Arrived">Arrived</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: Doctors Roster with D101, D102 and Delete action */}
        {activeTab === 'doctors' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Hospital Medical Faculty (Doctors)</h3>
                <p className="text-xs text-slate-500">Each doctor has an auto-incremented ID (e.g. D101, D102...). Admin can add & delete doctors.</p>
              </div>
              <button
                onClick={() => setIsAddDoctorModalOpen(true)}
                className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Add Doctor ({getNextDoctorCode()})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map(doc => (
                <div key={doc.id} className="p-4 rounded-2xl border border-slate-200/80 hover:border-purple-300 transition-all flex gap-3.5 bg-slate-50/50 relative group">
                  <img
                    src={doc.image_url}
                    alt={doc.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                        {doc.doctor_code || `D${100 + doc.id}`}
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete doctor ${doc.name}?`)) {
                            deleteDoctor(doc.id);
                          }
                        }}
                        title="Delete Doctor"
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h4>
                    <span className="text-xs text-cyan-600 font-semibold block">{doc.specialty}</span>
                    <p className="text-[11px] text-slate-500 mt-1">{doc.available_days}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-xs">
                      <span className="font-bold text-slate-800">৳ {doc.consultation_fee}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Lab Employees Management with L101, L102, Add & Delete */}
        {activeTab === 'lab_employees' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">Lab Employees & Technicians</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-100 text-cyan-800">
                    ID Prefix: L101+
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Admin can Add and Delete lab staff. Each employee gets an auto-incremented ID (e.g. L101, L102...) to login.
                </p>
              </div>
              <button
                onClick={() => setIsAddLabModalOpen(true)}
                className="flex items-center gap-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
              >
                <UserPlus className="w-4 h-4" /> Add Lab Employee ({getNextLabCode()})
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                    <th className="py-3 px-4">Employee ID</th>
                    <th className="py-3 px-4">Employee Name & Role</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Department / Unit</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Delete Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {labEmployees.length > 0 ? (
                    labEmployees.map(emp => (
                      <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-black text-cyan-700 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-lg text-xs">
                            {emp.employee_code}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block text-sm">{emp.name}</span>
                          <span className="text-slate-500 text-[11px]">{emp.specialization}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="flex items-center gap-1.5 text-slate-700">
                            <Mail className="w-3 h-3 text-slate-400" /> {emp.email}
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400" /> {emp.phone}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {emp.department}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to remove Lab Employee ${emp.name} (${emp.employee_code})?`)) {
                                deleteLabEmployee(emp.id);
                              }
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition-colors text-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        No lab employees registered yet. Click "Add Lab Employee" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: Accounts Section Management with A101, A102, Add & Delete */}
        {activeTab === 'accounts_section' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">Hospital Accounts & Finance Section</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    ID Prefix: A101+
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Admin can Add and Delete account officers. Each staff member gets an auto-incremented ID (e.g. A101, A102...) to login.
                </p>
              </div>
              <button
                onClick={() => setIsAddAccountsModalOpen(true)}
                className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
              >
                <UserPlus className="w-4 h-4" /> Add Account Officer ({getNextAccountsCode()})
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                    <th className="py-3 px-4">Account ID</th>
                    <th className="py-3 px-4">Staff Name & Designation</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Assigned Section</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Delete Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {accountsStaff.length > 0 ? (
                    accountsStaff.map(staff => (
                      <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs">
                            {staff.account_code}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block text-sm">{staff.name}</span>
                          <span className="text-slate-500 text-[11px]">{staff.designation}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="flex items-center gap-1.5 text-slate-700">
                            <Mail className="w-3 h-3 text-slate-400" /> {staff.email}
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400" /> {staff.phone}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {staff.section}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to remove Account Officer ${staff.name} (${staff.account_code})?`)) {
                                deleteAccountsStaff(staff.id);
                              }
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition-colors text-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        No accounts staff registered yet. Click "Add Account Officer" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: Patients Management */}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">Hospital Registered Patients Directory</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-100 text-cyan-800">
                    ID Prefix: P01+
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Admin can view all registered patients in the hospital system, search by ID or name, add new patient accounts, and manage profiles.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search patient ID (P01), name..."
                    value={patientSearchTerm}
                    onChange={(e) => setPatientSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  />
                </div>

                <button
                  onClick={() => setIsAddPatientModalOpen(true)}
                  className="flex items-center gap-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm shrink-0"
                >
                  <UserPlus className="w-4 h-4" /> Add Patient ({getNextPatientCode()})
                </button>
              </div>
            </div>

            {/* Patients List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                    <th className="py-3 px-4">Patient ID</th>
                    <th className="py-3 px-4">Patient Full Name</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Residential Address</th>
                    <th className="py-3 px-4 text-center">Blood Group</th>
                    <th className="py-3 px-4 text-center">Registered Date</th>
                    <th className="py-3 px-4 text-right">Delete Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredPatientsList.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400">
                        No registered patients found matching your search. Click "Add Patient" to register one.
                      </td>
                    </tr>
                  ) : (
                    filteredPatientsList.map((pat) => (
                      <tr key={pat.id || pat.patient_id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4 font-mono font-black text-cyan-800">
                          <span className="bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-lg">
                            {pat.patient_id}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-cyan-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                              {pat.name ? pat.name.charAt(0).toUpperCase() : 'P'}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{pat.name}</span>
                              <span className="text-[10px] text-slate-400 capitalize">{pat.gender || 'Patient'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{pat.phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{pat.email || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600 font-medium">
                          {pat.address || 'Dhaka, Bangladesh'}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200 text-[11px]">
                            <Droplet className="w-3 h-3 text-rose-500" /> {pat.blood_group || 'O+'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center font-mono text-[11px] text-slate-500">
                          {pat.created_at || '2026-11-20'}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeletePatient(pat.patient_id)}
                            className="inline-flex items-center gap-1 text-rose-600 hover:text-white hover:bg-rose-600 px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-bold transition-all shadow-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: Add Doctor Modal */}
      {isAddDoctorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded uppercase">
                  Auto ID: {getNextDoctorCode()}
                </span>
                <h3 className="text-lg font-bold mt-1">Add Specialist Doctor</h3>
                <p className="text-xs text-purple-200">New doctor will be assigned ID {getNextDoctorCode()}</p>
              </div>
              <button
                onClick={() => setIsAddDoctorModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDoctorSubmit} className="p-6 space-y-3.5 text-xs">
              <div className="bg-purple-50 border border-purple-200 p-3 rounded-2xl flex items-center gap-2 text-purple-900 font-medium">
                <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
                <span>
                  <strong>স্থায়ী আইডি:</strong> তৈরি হওয়ার পর এই ডাক্তারের আইডি (<strong>{getNextDoctorCode()}</strong>) স্থায়ী ও অপরিবর্তনশীল থাকবে।
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sabrina Zaman"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialty / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gynecologist"
                    value={doctorForm.specialty}
                    onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={doctorForm.department_id}
                    onChange={(e) => setDoctorForm({ ...doctorForm, department_id: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number (মোবাইল নম্বর) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={doctorForm.phone}
                    onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Doctor Email</label>
                  <input
                    type="email"
                    placeholder="doctor@medicare.com"
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Present Address (বর্তমান ঠিকানা) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House 24, Road 7, Banani, Dhaka"
                  value={doctorForm.address}
                  onChange={(e) => setDoctorForm({ ...doctorForm, address: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Degrees & Qualifications *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MBBS, FCPS (Obs & Gynae)"
                  value={doctorForm.qualification}
                  onChange={(e) => setDoctorForm({ ...doctorForm, qualification: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Login Password *</label>
                  <input
                    type="text"
                    required
                    value={doctorForm.password}
                    onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Consultation Fee (৳)</label>
                  <input
                    type="number"
                    value={doctorForm.consultation_fee}
                    onChange={(e) => setDoctorForm({ ...doctorForm, consultation_fee: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Save & Assign ID ({getNextDoctorCode()})
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddDoctorModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Lab Employee Modal */}
      {isAddLabModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="bg-gradient-to-r from-cyan-700 to-blue-700 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded uppercase">
                  Auto ID: {getNextLabCode()}
                </span>
                <h3 className="text-lg font-bold mt-1">Add Laboratory Employee</h3>
                <p className="text-xs text-cyan-200">Will be assigned ID {getNextLabCode()} for login</p>
              </div>
              <button
                onClick={() => setIsAddLabModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLabSubmit} className="p-6 space-y-3.5 text-xs">
              <div className="bg-cyan-50 border border-cyan-200 p-3 rounded-2xl flex items-center gap-2 text-cyan-900 font-medium">
                <ShieldCheck className="w-4 h-4 text-cyan-700 shrink-0" />
                <span>
                  <strong>স্থায়ী আইডি:</strong> তৈরি হওয়ার পর এই ল্যাব কর্মীর আইডি (<strong>{getNextLabCode()}</strong>) স্থায়ী ও অপরিবর্তনশীল থাকবে।
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Employee Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Md. Jahangir Alam"
                  value={labForm.name}
                  onChange={(e) => setLabForm({ ...labForm, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name.lab@medicare.com"
                    value={labForm.email}
                    onChange={(e) => setLabForm({ ...labForm, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number (মোবাইল নম্বর) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={labForm.phone}
                    onChange={(e) => setLabForm({ ...labForm, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Present Address (বর্তমান ঠিকানা) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House 12, Road 4, Mirpur 10, Dhaka"
                  value={labForm.address}
                  onChange={(e) => setLabForm({ ...labForm, address: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Specialization / Role</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Hematologist & Lab Analyst"
                  value={labForm.specialization}
                  onChange={(e) => setLabForm({ ...labForm, specialization: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={labForm.department}
                    onChange={(e) => setLabForm({ ...labForm, department: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Password *</label>
                  <input
                    type="text"
                    required
                    value={labForm.password}
                    onChange={(e) => setLabForm({ ...labForm, password: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Create Lab Employee ({getNextLabCode()})
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddLabModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Accounts Staff Modal */}
      {isAddAccountsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded uppercase">
                  Auto ID: {getNextAccountsCode()}
                </span>
                <h3 className="text-lg font-bold mt-1">Add Accounts & Finance Officer</h3>
                <p className="text-xs text-emerald-200">Will be assigned ID {getNextAccountsCode()} for login</p>
              </div>
              <button
                onClick={() => setIsAddAccountsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAccountsSubmit} className="p-6 space-y-3.5 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2 text-emerald-900 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>স্থায়ী আইডি:</strong> তৈরি হওয়ার পর এই হিসাব কর্মকর্তার আইডি (<strong>{getNextAccountsCode()}</strong>) স্থায়ী ও অপরিবর্তনশীল থাকবে।
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Officer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahbubul Haque"
                  value={accountsForm.name}
                  onChange={(e) => setAccountsForm({ ...accountsForm, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name.accounts@medicare.com"
                    value={accountsForm.email}
                    onChange={(e) => setAccountsForm({ ...accountsForm, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number (মোবাইল নম্বর) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={accountsForm.phone}
                    onChange={(e) => setAccountsForm({ ...accountsForm, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Present Address (বর্তমান ঠিকানা) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 7, Uttara, Dhaka"
                  value={accountsForm.address}
                  onChange={(e) => setAccountsForm({ ...accountsForm, address: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Designation / Role Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Billing Executive & Cashier"
                  value={accountsForm.designation}
                  onChange={(e) => setAccountsForm({ ...accountsForm, designation: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Section / Desk</label>
                  <input
                    type="text"
                    value={accountsForm.section}
                    onChange={(e) => setAccountsForm({ ...accountsForm, section: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Password *</label>
                  <input
                    type="text"
                    required
                    value={accountsForm.password}
                    onChange={(e) => setAccountsForm({ ...accountsForm, password: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Create Account Officer ({getNextAccountsCode()})
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddAccountsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Add Patient Modal */}
      {isAddPatientModalOpen && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsAddPatientModalOpen(false); }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-150 my-6">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded uppercase">
                  Auto Patient ID: {getNextPatientCode()}
                </span>
                <h3 className="text-lg font-bold mt-1">Register New Hospital Patient</h3>
                <p className="text-xs text-cyan-100">Patient will be permanently assigned ID {getNextPatientCode()}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPatientModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPatientSubmit} className="p-6 space-y-3.5 text-xs">
              <div className="bg-cyan-50 border border-cyan-200 p-3 rounded-2xl flex items-center gap-2 text-cyan-900 font-medium">
                <ShieldCheck className="w-4 h-4 text-cyan-700 shrink-0" />
                <span>
                  <strong>স্থায়ী রোগী আইডি:</strong> নিবন্ধনের পর এই রোগীর সিস্টেম আইডি (<strong>{getNextPatientCode()}</strong>) স্থায়ী ও অপরিবর্তনশীল থাকবে।
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Akramul Hasan"
                  value={patientForm.name}
                  onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="patient@medicare.com"
                    value={patientForm.email}
                    onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={patientForm.phone}
                    onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="e.g. House 14, Road 5, Dhanmondi, Dhaka"
                  value={patientForm.address}
                  onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={patientForm.blood_group}
                    onChange={(e) => setPatientForm({ ...patientForm, blood_group: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={patientForm.gender}
                    onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Password *</label>
                <input
                  type="text"
                  required
                  value={patientForm.password}
                  onChange={(e) => setPatientForm({ ...patientForm, password: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white font-mono"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  Register Patient ({getNextPatientCode()})
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddPatientModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
