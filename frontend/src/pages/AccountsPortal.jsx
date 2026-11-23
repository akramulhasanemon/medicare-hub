import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { hospitalStandardTests } from '../data/mockData';
import ProfileSettingsView from '../components/ProfileSettingsView';
import { 
  Landmark, 
  DollarSign, 
  Receipt, 
  Search, 
  Plus, 
  Printer, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  ShieldCheck, 
  FileText, 
  TrendingUp, 
  ShoppingBag, 
  Stethoscope, 
  FlaskConical, 
  Siren, 
  Trash2,
  Calendar,
  Settings,
  User,
  X,
  MapPin,
  Phone,
  Droplet
} from 'lucide-react';

const AccountsPortal = ({ setActivePage }) => {
  const { user } = useAuth();
  const { 
    invoices, 
    issueInvoice, 
    appointments, 
    labBookings, 
    pharmacyOrders, 
    doctors, 
    labEmployees,
    accountsStaff,
    prescriptions, 
    getNextTestNumber 
  } = useData();

  // Access Control Guard
  if (!user || (user.role !== 'accountant' && user.role !== 'admin')) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Access Restricted / অনুমতি নেই</h2>
          <p className="text-xs text-slate-500">
            এই পোর্টালটি শুধুমাত্র হাসপাতালের হিসাব ও বিলিং কর্মকর্তাদের (A101+) জন্য সংরক্ষিত। আপনার বর্তমান রোল: <strong>{user?.role || 'Guest'}</strong>
          </p>
          <button
            onClick={() => setActivePage(user?.role === 'patient' ? 'patient-dashboard' : 'home')}
            className="w-full bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs"
          >
            Go to Your Designated Portal
          </button>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('billing'); // 'billing' | 'ledger' | 'patient-statement' | 'closing' | 'profile'
  const [searchTerm, setSearchTerm] = useState('');
  const [patientLookupId, setPatientLookupId] = useState('P01');
  const [viewingInvoice, setViewingInvoice] = useState(null);

  // Quick Select & Live Patient ID Search in POS
  const [posSearchQuery, setPosSearchQuery] = useState('');
  const [showPosDropdown, setShowPosDropdown] = useState(false);

  // Dynamic Master Patient Directory across seed data, registered users, prescriptions & bookings
  const getAllPatientList = () => {
    const defaultList = [
      {
        patient_id: 'P01',
        name: 'John Doe',
        phone: '01811112233',
        email: 'patient@medicare.com',
        address: 'House 14, Road 5, Dhanmondi, Dhaka',
        blood_group: 'B+',
        gender: 'Male'
      },
      {
        patient_id: 'P02',
        name: 'Akramul Hasan',
        phone: '01568812468',
        email: 'akramul@medicare.com',
        address: 'Dhaka, Bangladesh',
        blood_group: 'A+',
        gender: 'Male'
      }
    ];

    try {
      // 1. Registered accounts from localStorage
      const registered = JSON.parse(localStorage.getItem('medicare_registered_users') || '[]');
      registered.forEach(u => {
        const pId = (u.patient_id || '').toUpperCase();
        // Strictly exclude doctors, lab staff, and accounts staff from patient directory
        const isStaff = pId.startsWith('A') || pId.startsWith('D') || pId.startsWith('L') || (u.role && u.role !== 'patient');
        if (u.patient_id && !isStaff) {
          const idx = defaultList.findIndex(p => p.patient_id.toUpperCase() === u.patient_id.toUpperCase());
          const patObj = {
            patient_id: u.patient_id,
            name: u.name || 'Registered Patient',
            phone: u.phone || '',
            email: u.email || '',
            address: u.address || 'Dhaka, Bangladesh',
            blood_group: u.blood_group || 'O+',
            gender: u.gender || 'Other'
          };
          if (idx >= 0) defaultList[idx] = patObj;
          else defaultList.push(patObj);
        }
      });

      // 2. Prescriptions patients
      if (Array.isArray(prescriptions)) {
        prescriptions.forEach(rx => {
          if (rx.patient_id && !defaultList.some(p => p.patient_id.toUpperCase() === rx.patient_id.toUpperCase())) {
            defaultList.push({
              patient_id: rx.patient_id,
              name: rx.patient_name || 'Patient',
              phone: rx.patient_phone || '',
              email: '',
              address: 'Dhaka, Bangladesh',
              blood_group: 'A+',
              gender: 'Other'
            });
          }
        });
      }

      // 3. Appointments patients
      if (Array.isArray(appointments)) {
        appointments.forEach(apt => {
          if (apt.patient_id && !defaultList.some(p => p.patient_id.toUpperCase() === apt.patient_id.toUpperCase())) {
            defaultList.push({
              patient_id: apt.patient_id,
              name: apt.patient_name || 'Patient',
              phone: apt.patient_phone || '',
              email: apt.patient_email || '',
              address: 'Dhaka, Bangladesh',
              blood_group: 'B+',
              gender: 'Other'
            });
          }
        });
      }
    } catch (e) {
      console.error(e);
    }

    return defaultList;
  };

  const allPatientsList = getAllPatientList();

  // Comprehensive Master Entity Directory: Searches across Patients (PID), Doctors (DID), Lab Staff (LID), and Accounts Staff (AID)
  const getUniversalEntityMasterInfo = (searchId) => {
    if (!searchId) return null;
    const query = String(searchId).trim().toUpperCase();

    // Accounts Staff (AID)
    const accList = (accountsStaff && accountsStaff.length > 0 ? accountsStaff : [
      { account_code: 'A101', name: 'Kamal Hossain', designation: 'Chief Accounts & Billing Officer', phone: '01733445566', address: 'Sector 7, Road 14, Uttara, Dhaka' },
      { account_code: 'A102', name: 'Nusrat Jahan', designation: 'Billing Executive', phone: '01899223344', address: 'Mirpur, Dhaka' },
      { account_code: 'A103', name: 'Akramul Hasan', designation: 'Accounts Specialist', phone: '01568812468', address: 'Dhaka, Bangladesh' }
    ]);

    // Doctors (DID)
    const docList = doctors || [];

    // Lab Staff / Technologists (LID)
    const labList = (labEmployees && labEmployees.length > 0 ? labEmployees : [
      { employee_code: 'L101', name: 'Md. Rafiqul Islam', specialization: 'Senior Pathologist & Lab Technologist', phone: '01711223344', department: 'Pathology & Diagnostic Lab', address: 'Plot 18, Block D, Mirpur-10, Dhaka' }
    ]);

    // Patients (PID)
    const patList = getAllPatientList();

    // Helper formatter for Accounts Staff
    const formatAcc = (acc) => {
      const code = acc.account_code || `A${acc.id}`;
      return {
        ...acc,
        entityType: 'AID',
        badge: 'AID',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        roleLabel: 'Accounts & Billing Staff (হিসাব কর্মকর্তা)',
        id: code,
        name: acc.name,
        phone: acc.phone || '01733445566',
        address: acc.address || 'MediCare Hospital, Dhaka',
        detailPrimary: `Designation: ${acc.designation || 'Accounts Officer'}`,
        detailSecondary: `Section: ${acc.section || 'General Billing & Counter'}`
      };
    };

    // Helper formatter for Doctors
    const formatDoc = (doc) => {
      const code = doc.doctor_code || `D${doc.id}`;
      return {
        ...doc,
        entityType: 'DID',
        badge: 'DID',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
        roleLabel: 'Specialist Doctor (বিশেষজ্ঞ চিকিৎসক)',
        id: code,
        name: doc.name,
        phone: doc.phone || '01711000000',
        address: doc.address || 'MediCare Hospital Chambers, Dhaka',
        detailPrimary: `Specialty: ${doc.specialty || 'Consultant'}`,
        detailSecondary: `Fee: ৳${doc.consultation_fee || 1200}`
      };
    };

    // Helper formatter for Lab Staff
    const formatLab = (lab) => {
      const code = lab.employee_code || `L${lab.id}`;
      return {
        ...lab,
        entityType: 'LID',
        badge: 'LID',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
        roleLabel: 'Pathology Lab Staff (ক্লিনিক্যাল ল্যাব কর্মী)',
        id: code,
        name: lab.name,
        phone: lab.phone || '01711223344',
        address: lab.address || 'MediCare Hospital, Dhaka',
        detailPrimary: `Specialization: ${lab.specialization || 'Lab Technologist'}`,
        detailSecondary: `Dept: ${lab.department || 'Diagnostic Lab'}`
      };
    };

    // Helper formatter for Patients
    const formatPat = (pat) => ({
      ...pat,
      entityType: 'PID',
      badge: 'PID',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      roleLabel: 'Registered Patient (সাধারণ রোগী)',
      id: pat.patient_id,
      name: pat.name,
      phone: pat.phone || '',
      address: pat.address || 'Dhaka, Bangladesh',
      detailPrimary: `Blood Group: ${pat.blood_group || 'O+'}`,
      detailSecondary: `Gender: ${pat.gender || 'N/A'}`
    });

    // 1. Prioritize by Prefix
    if (query.startsWith('A')) {
      const acc = accList.find(a => (a.account_code || `A${a.id}`).toUpperCase() === query);
      if (acc) return formatAcc(acc);
    }
    if (query.startsWith('D')) {
      const doc = docList.find(d => (d.doctor_code || `D${d.id}`).toUpperCase() === query);
      if (doc) return formatDoc(doc);
    }
    if (query.startsWith('L')) {
      const lab = labList.find(l => (l.employee_code || `L${l.id}`).toUpperCase() === query);
      if (lab) return formatLab(lab);
    }
    if (query.startsWith('P')) {
      const pat = patList.find(p => p.patient_id && p.patient_id.toUpperCase() === query);
      if (pat) return formatPat(pat);
    }

    // 2. Exact match by ID across non-prefixed or different types
    const accMatch = accList.find(a => (a.account_code || `A${a.id}`).toUpperCase() === query);
    if (accMatch) return formatAcc(accMatch);

    const docMatch = docList.find(d => (d.doctor_code || `D${d.id}`).toUpperCase() === query);
    if (docMatch) return formatDoc(docMatch);

    const labMatch = labList.find(l => (l.employee_code || `L${l.id}`).toUpperCase() === query);
    if (labMatch) return formatLab(labMatch);

    const patMatch = patList.find(p => p.patient_id && p.patient_id.toUpperCase() === query);
    if (patMatch) return formatPat(patMatch);

    // 3. Exact match by Name or Phone
    const accByName = accList.find(a => (a.name && a.name.toUpperCase() === query) || (a.phone && a.phone === query));
    if (accByName) return formatAcc(accByName);

    const docByName = docList.find(d => (d.name && d.name.toUpperCase() === query) || (d.phone && d.phone === query));
    if (docByName) return formatDoc(docByName);

    const labByName = labList.find(l => (l.name && l.name.toUpperCase() === query) || (l.phone && l.phone === query));
    if (labByName) return formatLab(labByName);

    const patByName = patList.find(p => (p.name && p.name.toUpperCase() === query) || (p.phone && p.phone === query));
    if (patByName) return formatPat(patByName);

    // 4. Partial substring match
    const all = [
      ...accList.map(a => ({ ...a, entityType: 'AID', id: a.account_code || `A${a.id}` })),
      ...docList.map(d => ({ ...d, entityType: 'DID', id: d.doctor_code || `D${d.id}` })),
      ...labList.map(l => ({ ...l, entityType: 'LID', id: l.employee_code || `L${l.id}` })),
      ...patList.map(p => ({ ...p, entityType: 'PID', id: p.patient_id }))
    ];
    const partial = all.find(item => 
      (item.id && item.id.toUpperCase().includes(query)) ||
      (item.name && item.name.toUpperCase().includes(query))
    );
    if (partial && partial.id) {
      return getUniversalEntityMasterInfo(partial.id);
    }

    return null;
  };

  // Backward compatible wrapper
  const getPatientMasterInfo = (searchId) => getUniversalEntityMasterInfo(searchId);

  // Universal Multi-Entity ID Search State: PID (Patient), DID (Doctor), LID (Lab), AID (Accounts Staff) - Excludes Tests
  const [idFilterCategory, setIdFilterCategory] = useState('ALL'); // 'ALL' | 'PID' | 'DID' | 'LID' | 'AID'

  const currentStatementPatient = getPatientMasterInfo(patientLookupId);
  const patientInvoices = invoices.filter(inv => 
    (currentStatementPatient && inv.patient_id && inv.patient_id.toUpperCase() === currentStatementPatient.patient_id.toUpperCase()) ||
    (currentStatementPatient && inv.patient_name && inv.patient_name.toLowerCase() === currentStatementPatient.name.toLowerCase())
  );

  // New Invoice POS State
  const [patientName, setPatientName] = useState('Akramul Hasan');
  const [patientId, setPatientId] = useState('P02');
  const [patientPhone, setPatientPhone] = useState('01568812468');
  const [paymentMethod, setPaymentMethod] = useState('Cash Counter');
  const [discountPercent, setDiscountPercent] = useState(0); // Discount in Percentage (ছাড় %)
  const [testSearchQuery, setTestSearchQuery] = useState('');
  const [showTestDropdown, setShowTestDropdown] = useState(false);

  // Referred Doctor (রেফার্ড ডাক্তার) State & Logic
  const [referredDoctor, setReferredDoctor] = useState({
    id: 1,
    doctor_code: 'D101',
    name: 'Prof. Dr. Mahfuzur Rahman',
    specialty: 'Cardiologist & Internal Medicine',
    degrees: 'MBBS, FCPS (Cardiology), FACC (USA)',
    consultation_fee: 1200
  });
  const [refDocSearchQuery, setRefDocSearchQuery] = useState('');
  const [showRefDocDropdown, setShowRefDocDropdown] = useState(false);

  const allReferredDoctorsList = [
    {
      id: 'OPD',
      doctor_code: 'OPD',
      name: 'Hospital General OPD / Self (সাধারণ বহির্বিভাগ)',
      specialty: 'General Duty Consultation & Medical Officer',
      degrees: 'MediCare Hospital RMO / OPD',
      consultation_fee: 500
    },
    ...(doctors || [])
  ];

  const filteredReferredDoctors = allReferredDoctorsList.filter(d => {
    if (!refDocSearchQuery.trim()) return true;
    const q = refDocSearchQuery.trim().toLowerCase();
    const code = (d.doctor_code || `D${d.id}`).toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      code.includes(q) ||
      (d.specialty && d.specialty.toLowerCase().includes(q)) ||
      (d.degrees && d.degrees.toLowerCase().includes(q))
    );
  });

  const handleSelectReferredDoctor = (doc) => {
    setReferredDoctor(doc);
    setRefDocSearchQuery('');
    setShowRefDocDropdown(false);
  };

  // Auto-sync POS when any Entity ID (PID, DID, LID, AID) is typed or selected
  const handleSelectPatientForPOS = (id) => {
    if (!id) return;
    setPatientId(id);
    const entity = getUniversalEntityMasterInfo(id);
    if (entity) {
      setPatientName(entity.name);
      if (entity.phone) setPatientPhone(entity.phone);
    }
  };

  // Quick Add Standard Hospital Test to Invoice Items
  const handleQuickAddTest = (test) => {
    setInvoiceItems(prev => {
      const isFirstEmpty = prev.length === 1 && (!prev[0].description || prev[0].description.trim() === '');
      if (isFirstEmpty) {
        return [{ description: test.name, amount: test.price, is_test: true }];
      }
      return [
        ...prev,
        { description: test.name, amount: test.price, is_test: true }
      ];
    });
    setTestSearchQuery('');
    setShowTestDropdown(false);
  };

  // Comprehensive Multi-Entity Directory Lookup (PID, DID, LID, AID) - STRICTLY EXCLUDES TESTS
  const getUniversalDirectoryItems = () => {
    const q = posSearchQuery.trim().toUpperCase();

    // 1. PID - Patients
    const patients = allPatientsList
      .filter(p => !q || (p.patient_id && p.patient_id.toUpperCase().includes(q)) || (p.name && p.name.toUpperCase().includes(q)) || (p.phone && p.phone.includes(q)))
      .map(p => ({
        entityType: 'PID',
        badge: 'PID',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        id: p.patient_id,
        title: p.name,
        subtitle: `📞 ${p.phone || 'N/A'} • 🩸 ${p.blood_group || 'N/A'}`,
        actionLabel: 'Select Patient',
        onSelect: () => {
          handleSelectPatientForPOS(p.patient_id);
          setPosSearchQuery('');
          setShowPosDropdown(false);
        }
      }));

    // 2. DID - Doctors
    const doctorsList = (doctors || [])
      .filter(d => {
        if (!q) return true;
        const code = (d.doctor_code || `D${d.id}`).toUpperCase();
        return code.includes(q) || (d.name && d.name.toUpperCase().includes(q)) || (d.specialty && d.specialty.toUpperCase().includes(q));
      })
      .map(d => ({
        entityType: 'DID',
        badge: 'DID',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
        id: d.doctor_code || `D${d.id}`,
        title: d.name,
        subtitle: `${d.specialty || 'Specialist Consultant'} • Fee: ৳${d.consultation_fee || 1200}`,
        actionLabel: 'Select Doctor',
        onSelect: () => {
          const docCode = d.doctor_code || `D${d.id}`;
          handleSelectPatientForPOS(docCode);
          setInvoiceItems(prev => [
            ...prev,
            { description: `Specialist Doctor Consultation (${d.name} - ${docCode})`, amount: Number(d.consultation_fee) || 1200, is_test: false }
          ]);
          setPosSearchQuery('');
          setShowPosDropdown(false);
        }
      }));

    // 3. LID - Lab Employees / Technologists
    const labStaffList = (labEmployees && labEmployees.length > 0 ? labEmployees : [
      { employee_code: 'L101', name: 'Md. Rafiqul Islam', specialization: 'Senior Pathologist & Lab Technologist', phone: '01711223344', department: 'Pathology & Diagnostic Lab' }
    ])
      .filter(l => {
        if (!q) return true;
        const code = (l.employee_code || l.id || '').toUpperCase();
        return code.includes(q) || (l.name && l.name.toUpperCase().includes(q)) || (l.specialization && l.specialization.toUpperCase().includes(q));
      })
      .map(l => ({
        entityType: 'LID',
        badge: 'LID',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
        id: l.employee_code || l.id || 'L101',
        title: l.name,
        subtitle: `${l.specialization || 'Clinical Technologist'} • 📞 ${l.phone || '01711223344'}`,
        actionLabel: 'Select Lab Staff',
        onSelect: () => {
          const labCode = l.employee_code || l.id || 'L101';
          handleSelectPatientForPOS(labCode);
          setPosSearchQuery('');
          setShowPosDropdown(false);
        }
      }));

    // 4. AID - Accounts Staff
    const accountsList = (accountsStaff && accountsStaff.length > 0 ? accountsStaff : [
      { account_code: 'A101', name: 'Kamal Hossain', designation: 'Chief Accounts Officer', phone: '01733445566' },
      { account_code: 'A102', name: 'Nusrat Jahan', designation: 'Billing Executive', phone: '01899223344' },
      { account_code: 'A103', name: 'Akramul Hasan', designation: 'Accounts Specialist', phone: '01568812468' }
    ])
      .filter(a => {
        if (!q) return true;
        const code = (a.account_code || a.id || '').toUpperCase();
        return code.includes(q) || (a.name && a.name.toUpperCase().includes(q)) || (a.designation && a.designation.toUpperCase().includes(q));
      })
      .map(a => ({
        entityType: 'AID',
        badge: 'AID',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        id: a.account_code || a.id || 'A101',
        title: a.name,
        subtitle: `${a.designation || 'Accounts Officer'} • 📞 ${a.phone || a.contact || '01733445566'}`,
        actionLabel: 'Select Accounts',
        onSelect: () => {
          const accCode = a.account_code || a.id || 'A101';
          handleSelectPatientForPOS(accCode);
          setPosSearchQuery('');
          setShowPosDropdown(false);
        }
      }));

    let allItems = [];
    if (idFilterCategory === 'ALL') {
      allItems = [...patients, ...doctorsList, ...labStaffList, ...accountsList];
    } else if (idFilterCategory === 'PID') {
      allItems = patients;
    } else if (idFilterCategory === 'DID') {
      allItems = doctorsList;
    } else if (idFilterCategory === 'LID') {
      allItems = labStaffList;
    } else if (idFilterCategory === 'AID') {
      allItems = accountsList;
    }

    return allItems;
  };

  const universalDirectoryItems = getUniversalDirectoryItems();

  // Helper to detect if an item is a diagnostic lab test
  const isDiagnosticTest = (item) => {
    if (typeof item.is_test === 'boolean') return item.is_test;
    const d = (item.description || '').toLowerCase();
    return /test|cbc|creatinin|blood|profile|lipid|sugar|glucose|ecg|echo|panel|investigation|urine|electrolytes|lft|kft|hba1c|thyroid|serum|x-ray|ultrasound/i.test(d);
  };

  // Auto-load Prescribed Items for this patient
  const handleAutoLoadPrescribedServices = () => {
    const patRx = prescriptions.find(p => 
      (p.patient_id && p.patient_id.toUpperCase() === patientId.toUpperCase()) ||
      (p.patient_name && p.patient_name.toLowerCase() === patientName.toLowerCase())
    );

    const newItems = [];
    if (patRx) {
      newItems.push({
        description: `Doctor Specialist Consultation (${patRx.doctor_name} - ${patRx.doctor_specialty})`,
        amount: 1200,
        is_test: false
      });
      if (patRx.tests_advised && patRx.tests_advised.length > 0) {
        patRx.tests_advised.forEach(t => {
          newItems.push({
            description: `Diagnostic Investigation: ${t}`,
            amount: 800,
            is_test: true
          });
        });
      }
    } else {
      newItems.push(
        { description: 'OPD Specialist Consultation Fee', amount: 1000, is_test: false },
        { description: 'Routine Clinical Diagnostic Package (CBC & Urine R/E)', amount: 1200, is_test: true }
      );
    }

    setInvoiceItems(newItems);
  };

  const [invoiceItems, setInvoiceItems] = useState([
    { description: 'Specialist Doctor Consultation (Prof. Dr. Mahfuzur Rahman)', amount: 1200, is_test: false },
    { description: 'Complete Blood Count (CBC) with ESR Test Fee', amount: 800, is_test: true }
  ]);

  const staffName = user?.name || 'Kamal Hossain';
  const staffCode = user?.patient_id || user?.account_code || 'A101';

  // Financial Calculations (with Percentage Discount)
  const subtotal = invoiceItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const calculatedDiscount = Math.round((subtotal * (Number(discountPercent) || 0)) / 100);
  const netTotal = Math.max(0, subtotal - calculatedDiscount);

  // Filtered standard diagnostic tests from hospital catalog
  const filteredStandardTests = (hospitalStandardTests || []).filter(t => {
    if (!testSearchQuery.trim()) return true;
    const q = testSearchQuery.trim().toLowerCase();
    return (
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.category && t.category.toLowerCase().includes(q)) ||
      (t.code && t.code.toLowerCase().includes(q)) ||
      (t.tid && t.tid.toLowerCase().includes(q))
    );
  });
  const filteredTests = filteredStandardTests;

  const totalDoctorRevenue = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'completed')
    .reduce((sum, a) => {
      const doc = doctors.find(d => d.id === a.doctor_id);
      return sum + (doc ? Number(doc.consultation_fee) : 500);
    }, 0);

  const totalLabRevenue = labBookings.reduce((sum, l) => sum + (Number(l.price) || 0), 0);
  const totalPharmacyRevenue = pharmacyOrders.reduce((sum, p) => sum + (Number(p.total_amount || p.totalAmount) || 0), 0);
  const totalInvoicedRevenue = invoices.reduce((sum, inv) => sum + (Number(inv.total_amount) || 0), 0);

  const grandHospitalCollection = totalDoctorRevenue + totalLabRevenue + totalPharmacyRevenue;

  const handleAddItem = () => {
    setInvoiceItems(prev => [
      ...prev,
      { description: 'Hospital OPD Investigation Charge', amount: 500, is_test: true }
    ]);
  };

  const handleRemoveItem = (index) => {
    setInvoiceItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, val) => {
    setInvoiceItems(prev => {
      const updated = [...prev];
      updated[index][field] = val;
      if (field === 'description') {
        const matched = hospitalStandardTests?.find(t => t.name.toLowerCase() === (val || '').trim().toLowerCase());
        if (matched) {
          updated[index].amount = matched.price;
          updated[index].is_test = true;
        }
      }
      return updated;
    });
  };

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const validItems = invoiceItems.filter(i => i.description.trim() !== '');
    if (validItems.length === 0) {
      alert('Please add at least one line item to the bill.');
      return;
    }

    // Assign sequential auto-incremented Test Numbers to all diagnostic lab items
    const processedItems = validItems.map(item => {
      if (isDiagnosticTest(item)) {
        const testNo = item.test_number || (getNextTestNumber ? getNextTestNumber() : '112233');
        return {
          ...item,
          is_test: true,
          test_number: testNo
        };
      }
      return {
        ...item,
        is_test: false
      };
    });

    const newInvData = {
      patient_name: patientName,
      patient_id: patientId,
      patient_phone: patientPhone,
      cashier_code: staffCode,
      cashier_name: staffName,
      counter: 'Billing Counter #01',
      items: processedItems,
      subtotal: subtotal,
      discount_percent: Number(discountPercent) || 0,
      discount: calculatedDiscount,
      vat: 0,
      total_amount: netTotal,
      payment_method: paymentMethod,
      referred_doctor: referredDoctor ? referredDoctor.name : 'Hospital OPD / Self',
      referred_doctor_code: referredDoctor ? (referredDoctor.doctor_code || `D${referredDoctor.id}`) : 'OPD',
      referred_doctor_specialty: referredDoctor ? referredDoctor.specialty : 'General OPD'
    };

    const res = issueInvoice(newInvData);
    setViewingInvoice(res.invoice);

    // Reset Form
    setInvoiceItems([
      { description: 'OPD Specialist Consultation Fee', amount: 1000, is_test: false },
      { description: 'Complete Blood Count (CBC) with ESR', amount: 800, is_test: true }
    ]);
    setDiscountPercent(0);
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.invoice_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.patient_id && inv.patient_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        
        {/* Accounts Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-emerald-500/20">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black font-mono tracking-wider bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                Accounts Officer ID: {staffCode}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-emerald-300">
                Billing Desk: Counter #01 (OPD Cashier)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <span>{staffName}</span>
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </h1>
            <p className="text-emerald-200 text-xs sm:text-sm max-w-xl">
              MediCare Hospital Revenue & Central Billing Gateway • Live Cash Registry
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-emerald-200">
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                <Landmark className="w-3.5 h-3.5 text-emerald-400" /> Department: Accounts, Finance & Audit
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Counter Shift: 08:00 AM - 04:00 PM
              </span>
            </div>
          </div>

          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15 space-y-1.5 text-right shrink-0">
            <span className="text-[11px] text-emerald-200 block font-medium">Drawer Cash Status:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm font-mono">
              ৳ {grandHospitalCollection.toLocaleString()} Reconciled
            </span>
          </div>
        </div>

        {/* Live Financial Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-1">
              <span>Total Collections</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">৳ {grandHospitalCollection.toLocaleString()}</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Hospital gross billings</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-1">
              <span>Doctor Fees</span>
              <Stethoscope className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">৳ {totalDoctorRevenue.toLocaleString()}</div>
            <p className="text-[11px] text-purple-600 font-semibold mt-1">Consultation receipts</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-1">
              <span>Lab Diagnostics</span>
              <FlaskConical className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">৳ {totalLabRevenue.toLocaleString()}</div>
            <p className="text-[11px] text-blue-600 font-semibold mt-1">Pathology collections</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase mb-1">
              <span>Pharmacy Sales</span>
              <ShoppingBag className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">৳ {totalPharmacyRevenue.toLocaleString()}</div>
            <p className="text-[11px] text-teal-600 font-semibold mt-1">Medicine counter orders</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'billing'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Receipt className="w-4 h-4" />
            Counter POS & Invoice Studio
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'ledger'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Receipts Ledger Archive ({invoices.length})
          </button>

          <button
            onClick={() => setActiveTab('closing')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'closing'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Day-End Cash Reconciliation
          </button>

          <button
            onClick={() => setActiveTab('patient-statement')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'patient-statement'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            Patient Billing by ID (রোগীর হিসাব ও বিল)
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Settings className="w-4 h-4 text-emerald-400" />
            Profile & Security (প্রোফাইল সেটিংস)
          </button>
        </div>

        {/* TAB 1: POS Invoice Generator */}
        {activeTab === 'billing' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6 max-w-4xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Instant Patient Billing & Money Receipt</h3>
                <p className="text-xs text-slate-500">Collect consultation fees, test charges, medicine bills and generate official invoice</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                Cashier: {staffCode}
              </span>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-5 text-xs">
              
              {/* Patient Meta */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <span className="font-bold text-slate-800 text-xs">Patient Identification & Billing Record:</span>
                  
                  {/* Quick Select & Patient ID Live Search Bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-bold whitespace-nowrap">Quick Select / Search ID:</span>

                    {/* Live Search Input across ALL IDs: PID, DID, TID, AID */}
                    <div className="relative">
                      <div className="flex items-center bg-white border border-slate-300 hover:border-emerald-500 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 rounded-xl px-2.5 py-1.5 transition-all shadow-xs">
                        <Search className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                        <input
                          type="text"
                          value={posSearchQuery}
                          onChange={(e) => {
                            setPosSearchQuery(e.target.value);
                            setShowPosDropdown(true);
                          }}
                          onFocus={() => setShowPosDropdown(true)}
                          placeholder="Search ID (PID, DID, LID, AID)..."
                          className="w-48 sm:w-64 bg-transparent text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none"
                        />
                        {posSearchQuery && (
                          <button
                            type="button"
                            onClick={() => {
                              setPosSearchQuery('');
                              setShowPosDropdown(false);
                            }}
                            className="text-slate-400 hover:text-slate-600 p-0.5 ml-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Dropdown with live search results across all IDs */}
                      {showPosDropdown && (
                        <>
                          <div 
                            className="fixed inset-0 z-20" 
                            onClick={() => setShowPosDropdown(false)} 
                          />
                          <div className="absolute right-0 mt-1.5 w-80 sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-30 max-h-80 overflow-y-auto space-y-2 animate-in fade-in zoom-in-95 duration-100">
                            {/* Category Filter Pills (PID, DID, LID, AID - Strictly Excludes Tests) */}
                            <div className="flex items-center gap-1 border-b border-slate-100 pb-2 overflow-x-auto no-scrollbar">
                              {[
                                { key: 'ALL', label: 'All IDs' },
                                { key: 'PID', label: 'PID (Patient)' },
                                { key: 'DID', label: 'DID (Doctor)' },
                                { key: 'LID', label: 'LID (Lab)' },
                                { key: 'AID', label: 'AID (Accounts)' }
                              ].map(cat => (
                                <button
                                  key={cat.key}
                                  type="button"
                                  onClick={() => setIdFilterCategory(cat.key)}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition-all shrink-0 ${
                                    idFilterCategory === cat.key
                                      ? 'bg-slate-900 text-white shadow-2xs'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {cat.label}
                                </button>
                              ))}
                            </div>

                            <div className="px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                              <span>Directory Results ({universalDirectoryItems.length})</span>
                              <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">PID • DID • LID • AID</span>
                            </div>

                            {universalDirectoryItems.length === 0 ? (
                              <div className="p-4 text-center text-xs text-slate-500">
                                No person found for "{posSearchQuery}". Try PID (P01), DID (D101), LID (L101), or AID (A101).
                              </div>
                            ) : (
                              universalDirectoryItems.map((item, idx) => (
                                <button
                                  key={`${item.entityType}-${item.id}-${idx}`}
                                  type="button"
                                  onClick={item.onSelect}
                                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group border hover:bg-slate-50 border-transparent hover:border-slate-200`}
                                >
                                  <div className="space-y-0.5 max-w-[280px]">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`font-mono font-black text-[10px] px-1.5 py-0.2 rounded border ${item.badgeColor}`}>
                                        {item.badge}
                                      </span>
                                      <span className="font-mono font-black text-xs text-slate-900">
                                        {item.id}
                                      </span>
                                      <span className="font-bold text-slate-800 text-xs truncate group-hover:text-emerald-900">
                                        {item.title}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 truncate">
                                      {item.subtitle}
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-bold text-emerald-700 bg-white border border-emerald-200 px-2.5 py-1 rounded-lg group-hover:bg-emerald-700 group-hover:text-white transition-all shadow-xs shrink-0">
                                    {item.actionLabel}
                                  </span>
                                </button>
                              ))
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Quick Multi-Entity One-Click Badges (Patient, Doctor, Lab, Accounts) */}
                    <div className="flex items-center gap-1.5 overflow-x-auto max-w-sm sm:max-w-md no-scrollbar">
                      {[
                        { id: 'P01', label: 'P01 (John)' },
                        { id: 'P02', label: 'P02 (Akramul)' },
                        { id: 'D101', label: 'D101 (Dr. Rahman)' },
                        { id: 'L101', label: 'L101 (Rafiqul - Lab)' },
                        { id: 'A101', label: 'A101 (Kamal)' },
                        { id: 'A103', label: 'A103 (Akramul - Acc)' }
                      ].map(chip => {
                        const isSelected = patientId && patientId.toUpperCase() === chip.id.toUpperCase();
                        return (
                          <button
                            key={chip.id}
                            type="button"
                            onClick={() => handleSelectPatientForPOS(chip.id)}
                            className={`px-2.5 py-1 rounded-lg font-mono font-bold text-[10px] transition-all border shrink-0 ${
                              isSelected
                                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                                : 'bg-white border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-800'
                            }`}
                          >
                            {chip.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {(() => {
                        const ent = getUniversalEntityMasterInfo(patientId);
                        if (!ent) return 'ID (PID, DID, LID, AID) *';
                        if (ent.entityType === 'DID') return 'Doctor ID (চিকিৎসকের আইডি) *';
                        if (ent.entityType === 'LID') return 'Lab Staff ID (ল্যাব কর্মীর আইডি) *';
                        if (ent.entityType === 'AID') return 'Accounts Staff ID (হিসাব কর্মকর্তার আইডি) *';
                        return 'Patient ID (রোগীর আইডি) *';
                      })()}
                    </label>
                    <input
                      type="text"
                      list="pos-patient-datalist"
                      required
                      value={patientId}
                      onChange={(e) => handleSelectPatientForPOS(e.target.value)}
                      placeholder="e.g. P01, D101, L101, A101..."
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white font-mono font-bold text-xs focus:ring-2 focus:ring-emerald-500 uppercase"
                    />
                    <datalist id="pos-patient-datalist">
                      {allPatientsList.map(pat => (
                        <option key={`pid-${pat.patient_id}`} value={pat.patient_id}>
                          [PID] {pat.patient_id} - {pat.name} ({pat.phone})
                        </option>
                      ))}
                      {(doctors || []).map(doc => (
                        <option key={`did-${doc.id}`} value={doc.doctor_code || `D${doc.id}`}>
                          [DID] {doc.doctor_code || `D${doc.id}`} - {doc.name} ({doc.specialty})
                        </option>
                      ))}
                      {(labEmployees && labEmployees.length > 0 ? labEmployees : [
                        { employee_code: 'L101', name: 'Md. Rafiqul Islam', specialization: 'Senior Pathologist' }
                      ]).map(lab => (
                        <option key={`lid-${lab.employee_code || lab.id}`} value={lab.employee_code || lab.id}>
                          [LID] {lab.employee_code || lab.id} - {lab.name} ({lab.specialization || 'Lab Technologist'})
                        </option>
                      ))}
                      {(accountsStaff && accountsStaff.length > 0 ? accountsStaff : [
                        { account_code: 'A101', name: 'Kamal Hossain', designation: 'Chief Accounts Officer' },
                        { account_code: 'A103', name: 'Akramul Hasan', designation: 'Accounts Specialist' }
                      ]).map(a => (
                        <option key={`aid-${a.account_code || a.id}`} value={a.account_code || a.id}>
                          [AID] {a.account_code || a.id} - {a.name} ({a.designation})
                        </option>
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {(() => {
                        const ent = getUniversalEntityMasterInfo(patientId);
                        if (!ent) return 'Full Name (নাম) *';
                        if (ent.entityType === 'DID') return 'Doctor Full Name (চিকিৎসকের নাম) *';
                        if (ent.entityType === 'LID') return 'Lab Staff Full Name (ল্যাব কর্মীর নাম) *';
                        if (ent.entityType === 'AID') return 'Staff Full Name (কর্মকর্তার নাম) *';
                        return 'Patient Full Name (রোগীর নাম) *';
                      })()}
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white font-medium text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Auto-detected Universal Entity Information & Details Card */}
                {getUniversalEntityMasterInfo(patientId) && (() => {
                  const entity = getUniversalEntityMasterInfo(patientId);
                  return (
                    <div className={`p-3.5 rounded-2xl border shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                      entity.entityType === 'DID'
                        ? 'bg-purple-50/80 border-purple-200'
                        : entity.entityType === 'LID'
                        ? 'bg-blue-50/80 border-blue-200'
                        : entity.entityType === 'AID'
                        ? 'bg-amber-50/80 border-amber-200'
                        : 'bg-emerald-50/80 border-emerald-200'
                    }`}>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] border ${entity.badgeColor}`}>
                            {entity.badge}
                          </span>
                          <span className="font-extrabold text-slate-900 text-sm">
                            {entity.name}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            ({entity.roleLabel})
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-slate-600 text-[11px]">
                          <span className="flex items-center gap-1 font-medium">
                            <Phone className="w-3.5 h-3.5 text-slate-400" /> {entity.phone || 'N/A'}
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {entity.address || 'Dhaka, Bangladesh'}
                          </span>
                          {entity.detailPrimary && (
                            <span className="font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded border border-slate-200/80">
                              {entity.detailPrimary}
                            </span>
                          )}
                          {entity.detailSecondary && (
                            <span className="font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded border border-slate-200/80">
                              {entity.detailSecondary}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {entity.entityType === 'PID' && (
                          <button
                            type="button"
                            onClick={handleAutoLoadPrescribedServices}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-sm transition-all flex items-center gap-1.5"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Auto-Load Doctor & Lab Fees</span>
                          </button>
                        )}
                        {entity.entityType === 'DID' && (
                          <button
                            type="button"
                            onClick={() => {
                              setInvoiceItems(prev => [
                                ...prev,
                                { description: `Specialist Doctor Consultation (${entity.name} - ${entity.id})`, amount: Number(entity.consultation_fee) || 1200, is_test: false }
                              ]);
                            }}
                            className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-sm transition-all flex items-center gap-1.5"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>+ Add Doctor Consultancy (৳{entity.consultation_fee || 1200})</span>
                          </button>
                        )}
                        {entity.entityType === 'LID' && (
                          <button
                            type="button"
                            onClick={() => {
                              setInvoiceItems(prev => [
                                ...prev,
                                { description: `Pathology Lab Investigation Processing Voucher (${entity.name} - ${entity.id})`, amount: 1000, is_test: false }
                              ]);
                            }}
                            className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-sm transition-all flex items-center gap-1.5"
                          >
                            <FlaskConical className="w-3.5 h-3.5" />
                            <span>+ Add Lab Duty / Voucher</span>
                          </button>
                        )}
                        {entity.entityType === 'AID' && (
                          <button
                            type="button"
                            onClick={() => {
                              setInvoiceItems(prev => [
                                ...prev,
                                { description: `Accounts Billing Counter Settlement Voucher (${entity.name} - ${entity.id})`, amount: 1500, is_test: false }
                              ]);
                            }}
                            className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-sm transition-all flex items-center gap-1.5"
                          >
                            <Landmark className="w-3.5 h-3.5" />
                            <span>+ Add Accounts Voucher</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* REFERRED DOCTOR (রেফার্ড ডাক্তার) SEARCH & SELECTION SYSTEM */}
              <div className="bg-gradient-to-r from-purple-50/90 via-slate-50 to-indigo-50/70 p-4 rounded-2xl border border-purple-200/90 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center font-bold">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                        <span>Referred Doctor / Consultant (রেফার্ড ডাক্তার / পরামর্শক)</span>
                        <span className="text-[10px] bg-purple-100 text-purple-800 font-mono px-2 py-0.5 rounded-full border border-purple-200">
                          Invoice Tag
                        </span>
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        রোগীর প্রেসক্রিপশন বা রেফারেল অনুযায়ী ডাক্তার সার্চ করে সিলেক্ট করুন (রিসিপ্টে প্রিন্ট হবে)
                      </p>
                    </div>
                  </div>

                  {/* Active Selected Doctor Badge (Display Only - No Extra Fee Added) */}
                  {referredDoctor && (
                    <div className="flex items-center gap-1.5 bg-white border border-purple-200 px-3 py-1 rounded-xl shadow-2xs">
                      <span className="text-[10px] text-slate-500 font-medium">Referred By:</span>
                      <span className="text-xs font-bold text-purple-900 truncate max-w-[180px]">
                        {referredDoctor.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Doctor Search Bar & Live Dropdown */}
                <div className="relative">
                  <div className="flex items-center bg-white border border-purple-300 hover:border-purple-500 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-500/20 rounded-xl px-3 py-2 shadow-xs transition-all">
                    <Search className="w-4 h-4 text-purple-600 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={refDocSearchQuery}
                      onChange={(e) => {
                        setRefDocSearchQuery(e.target.value);
                        setShowRefDocDropdown(true);
                      }}
                      onFocus={() => setShowRefDocDropdown(true)}
                      placeholder="Search Doctor by Name, DID (e.g. D101), Specialty (Cardiology, Neuro...)..."
                      className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                    {refDocSearchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setRefDocSearchQuery('');
                          setShowRefDocDropdown(false);
                        }}
                        className="text-slate-400 hover:text-slate-600 p-0.5 ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Dropdown with filtered doctors (Doctor Name & Specialty Only - No Fee) */}
                  {showRefDocDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-20" 
                        onClick={() => setShowRefDocDropdown(false)} 
                      />
                      <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-30 max-h-72 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center border-b border-slate-100 pb-1.5">
                          <span>Doctors Directory ({filteredReferredDoctors.length})</span>
                          <span className="text-[9px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-mono">Click to Select</span>
                        </div>
                        {filteredReferredDoctors.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500">
                            No doctor found for "{refDocSearchQuery}". Try doctor name (e.g. Mahfuzur) or code (D101).
                          </div>
                        ) : (
                          filteredReferredDoctors.map((doc) => {
                            const code = doc.doctor_code || `D${doc.id}`;
                            const isCurrent = referredDoctor && (referredDoctor.doctor_code === code || referredDoctor.id === doc.id);
                            return (
                              <button
                                key={`ref-doc-${doc.id}`}
                                type="button"
                                onClick={() => handleSelectReferredDoctor(doc)}
                                className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between group ${
                                  isCurrent
                                    ? 'bg-purple-50 border-purple-300'
                                    : 'hover:bg-slate-50 border-transparent hover:border-slate-200'
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-black text-[10px] text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200">
                                      {code}
                                    </span>
                                    <span className="font-bold text-slate-900 text-xs group-hover:text-purple-900">
                                      {doc.name}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-500 flex items-center gap-2">
                                    <span>🩺 {doc.specialty}</span>
                                    {doc.degrees && <span>• 🎓 {doc.degrees}</span>}
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                                    isCurrent ? 'bg-purple-700 text-white shadow-2xs' : 'text-purple-700 bg-purple-100 group-hover:bg-purple-700 group-hover:text-white'
                                  }`}>
                                    {isCurrent ? '✓ Selected' : 'Select'}
                                  </span>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Currently Selected Referred Doctor Card (Name & Specialty Only) */}
                {referredDoctor && (
                  <div className="bg-white p-3 rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs shrink-0">
                        👨‍⚕️
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-xs">{referredDoctor.name}</span>
                          <span className="font-mono font-bold text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded border border-purple-200">
                            {referredDoctor.doctor_code || `D${referredDoctor.id}`}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {referredDoctor.specialty} {referredDoctor.degrees ? `• ${referredDoctor.degrees}` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelectReferredDoctor({
                          id: 'OPD',
                          doctor_code: 'OPD',
                          name: 'Hospital General OPD / Self (সাধারণ বহির্বিভাগ)',
                          specialty: 'General Duty Consultation & Medical Officer',
                          degrees: 'MediCare Hospital RMO / OPD'
                        })}
                        className="text-[10px] font-bold text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-2.5 py-1 rounded-lg transition-all"
                      >
                        Reset to OPD
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Doctor Selection Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5 no-scrollbar">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Quick Pick:</span>
                  {allReferredDoctorsList.slice(0, 5).map(d => {
                    const code = d.doctor_code || `D${d.id}`;
                    const isSelected = referredDoctor && (referredDoctor.doctor_code === code || referredDoctor.id === d.id);
                    return (
                      <button
                        key={`chip-doc-${d.id}`}
                        type="button"
                        onClick={() => handleSelectReferredDoctor(d)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border shrink-0 flex items-center gap-1 ${
                          isSelected
                            ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-purple-400 hover:text-purple-800'
                        }`}
                      >
                        <span>{code}</span>
                        <span className="opacity-80 truncate max-w-[110px]">{d.name.split(' ').slice(-2).join(' ')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Line Items Table & Searchable Test Catalog */}
              <div className="space-y-3">
                {/* Search & Add Diagnostic Tests Box */}
                <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200/90 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                      <FlaskConical className="w-4 h-4 text-blue-600" />
                      <span>Search & Quick-Add Diagnostic Tests (ল্যাব টেস্ট সার্চ ও সিলেক্ট):</span>
                    </div>
                    <span className="text-[10px] text-blue-700 bg-white font-mono px-2 py-0.5 rounded-md border border-blue-200">
                      29 Standard Hospital Investigations
                    </span>
                  </div>

                  {/* Interactive Search Bar with Live Dropdown */}
                  <div className="relative">
                    <div className="flex items-center bg-white border border-blue-300 hover:border-blue-500 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/20 rounded-xl px-3 py-2 shadow-xs transition-all">
                      <Search className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
                      <input
                        type="text"
                        value={testSearchQuery}
                        onChange={(e) => {
                          setTestSearchQuery(e.target.value);
                          setShowTestDropdown(true);
                        }}
                        onFocus={() => setShowTestDropdown(true)}
                        placeholder="Type test name or category (e.g. CBC, Creatinine, Dengue, Lipid, Urine, X-Ray)..."
                        className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                      />
                      {testSearchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setTestSearchQuery('');
                            setShowTestDropdown(false);
                          }}
                          className="text-slate-400 hover:text-slate-600 p-0.5 ml-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Dropdown with filtered hospital tests */}
                    {showTestDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-20" 
                          onClick={() => setShowTestDropdown(false)} 
                        />
                        <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-30 max-h-72 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-100">
                          <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center border-b border-slate-100 pb-1.5">
                            <span>Diagnostic Tests Catalog ({filteredTests.length})</span>
                            <span className="text-[9px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-mono">Click to Add to Bill</span>
                          </div>
                          {filteredTests.length === 0 ? (
                            <div className="p-4 text-center text-xs text-slate-500">
                              No investigation found for "{testSearchQuery}"
                            </div>
                          ) : (
                            filteredTests.map((test) => (
                              <button
                                key={test.id}
                                type="button"
                                onClick={() => handleQuickAddTest(test)}
                                className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all flex items-center justify-between group"
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-black text-xs text-blue-900 bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200">
                                      {test.code}
                                    </span>
                                    <span className="font-bold text-slate-900 text-xs group-hover:text-blue-900">
                                      {test.name}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-500 flex items-center gap-2">
                                    <span>📁 {test.category}</span>
                                    <span>• 🧪 {test.specimen}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-mono font-black text-xs text-blue-900 block">
                                    ৳ {test.price.toLocaleString()}
                                  </span>
                                  <span className="text-[9px] font-bold text-blue-700 bg-blue-100 group-hover:bg-blue-600 group-hover:text-white px-2 py-0.5 rounded transition-all">
                                    + Add Item
                                  </span>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Quick One-Click Standard Test Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 no-scrollbar">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Popular:</span>
                    {(hospitalStandardTests || []).slice(0, 8).map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleQuickAddTest(t)}
                        className="px-2.5 py-1 bg-white hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-200 hover:border-blue-600 rounded-lg text-[10px] font-bold transition-all shadow-2xs shrink-0 flex items-center gap-1"
                      >
                        <span>{t.code}</span>
                        <span className="opacity-75 font-mono">৳{t.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-emerald-700" />
                    <span>Billable Services & Line Items ({invoiceItems.length}):</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100"
                  >
                    <Plus className="w-3 h-3" /> Add Custom Charge
                  </button>
                </div>

                <div className="space-y-2.5">
                  {invoiceItems.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            required
                            list="hospital-tests-datalist"
                            placeholder="Service description (e.g. Complete Blood Count (CBC), Serum Creatinine)"
                            value={item.description}
                            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold bg-white"
                          />
                        </div>
                        <div className="w-36">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">৳</span>
                            <input
                              type="number"
                              required
                              placeholder="Amount"
                              value={item.amount}
                              onChange={(e) => handleItemChange(idx, 'amount', e.target.value)}
                              className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-1.5 text-xs font-bold text-right bg-white"
                            />
                          </div>
                        </div>
                        {invoiceItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Diagnostic Lab Item Indicator & Badge */}
                      <div className="flex flex-wrap items-center justify-between text-[11px] pt-0.5 px-1 gap-2">
                        <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 select-none">
                          <input
                            type="checkbox"
                            checked={isDiagnosticTest(item)}
                            onChange={(e) => handleItemChange(idx, 'is_test', e.target.checked)}
                            className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                          />
                          <span className={isDiagnosticTest(item) ? "font-bold text-blue-700 flex items-center gap-1" : "text-slate-500"}>
                            {isDiagnosticTest(item) ? "🧪 Diagnostic Lab Investigation (Auto-generates sequential Lab ID e.g. 112233)" : "Hospital / Doctor Regular Charge"}
                          </span>
                        </label>
                        {isDiagnosticTest(item) && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-mono font-bold px-2 py-0.5 rounded border border-blue-200">
                            ✓ Auto-Syncs to Lab Portal on Save
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Datalist for fast native autocomplete across all 29 tests */}
                <datalist id="hospital-tests-datalist">
                  {(hospitalStandardTests || []).map(t => (
                    <option key={t.id} value={t.name}>{t.code} - ৳{t.price} ({t.category})</option>
                  ))}
                </datalist>
              </div>

              {/* Payment Method & Percentage Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Mode *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-medium text-xs"
                  >
                    <option value="Cash Counter">Cash Counter (নগদ টাকা)</option>
                    <option value="bKash Digital Payment">bKash (বিকাশ মার্চেন্ট)</option>
                    <option value="Nagad Digital Payment">Nagad (নগদ পে)</option>
                    <option value="Credit / Debit Card POS">Visa / Mastercard POS Terminal</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-bold text-slate-700">Discount Percentage (ছাড় - %)</label>
                    {discountPercent > 0 && (
                      <span className="text-[11px] font-mono font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                        - ৳ {calculatedDiscount.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                      placeholder="0"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 font-bold text-xs focus:ring-2 focus:ring-emerald-500 pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">%</span>
                  </div>

                  {/* Quick Select Percentage Buttons */}
                  <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto">
                    {[0, 5, 10, 15, 20, 25, 50].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setDiscountPercent(pct)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono transition-all border ${
                          Number(discountPercent) === pct
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-700'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total Calculation Summary Box */}
              <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Amount:</span>
                  <span className="font-bold font-mono">৳ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Discount Applied ({discountPercent}%):</span>
                  <span className="font-bold font-mono text-rose-600">- ৳ {calculatedDiscount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-900 text-base font-black pt-2 border-t border-emerald-200">
                  <span>Net Amount Payable:</span>
                  <span className="text-emerald-800 font-mono">৳ {netTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-800/25 transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Receive Payment & Issue Official Money Receipt</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: Ledger Archive */}
        {activeTab === 'ledger' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Hospital Billing Ledger Archive</h3>
                <p className="text-xs text-slate-500">Official cash receipts and financial transactions log</p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search invoice #, patient, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                    <th className="py-3 px-4">Invoice # & Date</th>
                    <th className="py-3 px-4">Patient Information</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4 text-right">Total Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-emerald-900 block text-xs">{inv.invoice_code}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{inv.created_at}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-900 block text-sm">{inv.patient_name}</span>
                        <span className="font-mono text-[10px] text-cyan-700 font-bold">ID: {inv.patient_id || 'P01'}</span>
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-700">
                        {inv.payment_method}
                      </td>
                      <td className="py-4 px-4 text-right font-black font-mono text-emerald-800 text-sm">
                        ৳ {inv.total_amount?.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setViewingInvoice(inv)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold text-xs shadow-sm transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Day-End Cash Reconciliation */}
        {activeTab === 'closing' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6 max-w-2xl">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Day-End Cash Reconciliation & Counter Closing</h3>
              <p className="text-xs text-slate-500">Reconcile physical cash drawer with system digital payments</p>
            </div>

            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Active Shift Cashier:</span>
                <span className="font-bold text-slate-900">{staffName} ({staffCode})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Billing Counter Desk:</span>
                <span className="font-bold text-slate-900">Counter #01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Money Receipts Issued:</span>
                <span className="font-bold text-slate-900">{invoices.length} Receipts</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-black">
                <span className="text-slate-800">Total Shift Revenue:</span>
                <span className="text-emerald-800 font-mono">৳ {grandHospitalCollection.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Shift for ${staffName} (${staffCode}) closed and reconciled successfully. ৳ ${grandHospitalCollection.toLocaleString()} logged to Central Hospital Bank Ledger.`)}
              className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Confirm Shift Reconciliation & Close Counter</span>
            </button>
          </div>
        )}

        {/* TAB 4: Patient Statement & Billing Lookup */}
        {activeTab === 'patient-statement' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Patient Billing Statement & Invoice Record</h3>
                <p className="text-xs text-slate-500">Search patient ID to inspect all billing history and paid receipts</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    list="statement-patient-datalist"
                    value={patientLookupId}
                    onChange={(e) => setPatientLookupId(e.target.value)}
                    placeholder="Enter Patient ID (e.g. P01, P02)..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                  />
                  <datalist id="statement-patient-datalist">
                    {allPatientsList.map(p => (
                      <option key={p.patient_id} value={p.patient_id}>{p.patient_id} - {p.name}</option>
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-semibold text-[11px]">Quick Patient Lookups:</span>
              {allPatientsList.slice(0, 5).map(p => (
                <button
                  key={p.patient_id}
                  type="button"
                  onClick={() => setPatientLookupId(p.patient_id)}
                  className={`px-3 py-1 rounded-xl font-mono text-xs font-bold transition-all border ${
                    patientLookupId.toUpperCase() === p.patient_id.toUpperCase()
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                  }`}
                >
                  {p.patient_id} ({p.name.split(' ')[0]})
                </button>
              ))}
            </div>

            {currentStatementPatient ? (
              <div className="space-y-6">
                {/* Patient Profile Card */}
                <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-black font-mono tracking-wider bg-white/20 text-emerald-200 border border-white/20">
                        Patient ID: {currentStatementPatient.patient_id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/30 text-emerald-300">
                        Verified Record
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                      {currentStatementPatient.name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200 pt-1">
                      <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" /> {currentStatementPatient.phone || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {currentStatementPatient.address || 'Dhaka, Bangladesh'}
                      </span>
                      <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                        <Droplet className="w-3.5 h-3.5 text-rose-400" /> Blood: {currentStatementPatient.blood_group}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/10 p-4 rounded-2xl border border-white/15 space-y-2 text-right shrink-0">
                    <span className="text-[11px] text-emerald-200 block font-medium">Grand Billing Total:</span>
                    <div className="text-2xl font-black font-mono text-emerald-300">
                      ৳ {patientInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-300 block">
                      {patientInvoices.length} Invoices Issued
                    </span>
                  </div>
                </div>

                {/* Patient Invoices Table */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-700" />
                    <span>Invoices & Official Receipts ({patientInvoices.length})</span>
                  </h4>

                  {patientInvoices.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                      No invoices found for this patient ID yet. You can create a new invoice from the POS counter.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                            <th className="py-3 px-4">Invoice # & Date</th>
                            <th className="py-3 px-4">Payment Method</th>
                            <th className="py-3 px-4 text-right">Amount (৳)</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {patientInvoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3.5 px-4">
                                <span className="font-mono font-bold text-emerald-900 block">{inv.invoice_code}</span>
                                <span className="text-[10px] text-slate-400">{inv.created_at}</span>
                              </td>
                              <td className="py-3.5 px-4 font-semibold text-slate-800">{inv.payment_method}</td>
                              <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">৳ {inv.total_amount?.toLocaleString()}</td>
                              <td className="py-3.5 px-4 text-center">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  ✓ PAID
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => setViewingInvoice(inv)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold text-xs shadow-sm transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View Receipt</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-2">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800">No Patient Selected</h4>
                <p className="text-xs text-slate-400">Please enter a valid Patient ID (e.g. P01, P02) to inspect billing records.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Profile & Security */}
        {activeTab === 'profile' && (
          <ProfileSettingsView theme="emerald" />
        )}

      </div>

      {/* MODAL: View / Print Money Receipt */}
      {viewingInvoice && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setViewingInvoice(null); }}
          className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in duration-150">
            
            <div className="bg-slate-900 px-6 py-3.5 text-white flex justify-between items-center text-xs">
              <span className="font-bold flex items-center gap-1.5 text-emerald-300">
                <ShieldCheck className="w-4 h-4" /> Official Hospital Cash Money Receipt ({viewingInvoice.invoice_code})
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg font-bold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setViewingInvoice(null)}
                  title="Close Modal"
                  className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm"
                >
                  <X className="w-4 h-4" />
                  <span>Close (কেটে দিন)</span>
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6 text-slate-800 bg-white" id="printable-receipt">
              
              {/* Receipt Header */}
              <div className="border-b-2 border-emerald-800 pb-4 flex justify-between items-start">
                <div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">Medi<span className="text-cyan-600">Care</span> Hub Hospital</div>
                  <p className="text-xs text-slate-600 font-semibold">Central Billing & Cash Department</p>
                  <span className="text-[11px] text-slate-400">Govt. Reg # DH-9042 • 24/7 Helpline: +880 1700-112233</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {viewingInvoice.invoice_code}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1 font-mono">{viewingInvoice.created_at}</span>
                </div>
              </div>

              {/* Receipt Meta */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Patient Name:</span>
                  <span className="font-bold text-slate-900 text-sm">{viewingInvoice.patient_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Patient ID:</span>
                  <span className="font-bold font-mono text-cyan-700">{viewingInvoice.patient_id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Referred Doctor (রেফার্ড ডাক্তার):</span>
                  <span className="font-bold text-purple-900 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>{viewingInvoice.referred_doctor || 'Hospital OPD / Self'}</span>
                  </span>
                  {viewingInvoice.referred_doctor_code && viewingInvoice.referred_doctor_code !== 'OPD' && (
                    <span className="text-[10px] text-slate-500 font-mono block">
                      Code: {viewingInvoice.referred_doctor_code} {viewingInvoice.referred_doctor_specialty ? `• ${viewingInvoice.referred_doctor_specialty}` : ''}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Payment Method:</span>
                  <span className="font-bold text-slate-900">{viewingInvoice.payment_method}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200 flex justify-between items-center text-[11px]">
                  <div>
                    <span className="text-slate-400">Cashier: </span>
                    <span className="font-bold text-slate-800">{viewingInvoice.cashier_name} ({viewingInvoice.cashier_code})</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Counter: </span>
                    <span className="font-bold text-slate-800">{viewingInvoice.counter || 'Billing Counter #01'}</span>
                  </div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                      <th className="py-2 px-3">Service / Item Description</th>
                      <th className="py-2 px-3 text-right">Amount (৳)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingInvoice.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3">
                          <div className="font-medium text-slate-800">{idx + 1}. {item.description}</div>
                          {item.test_number && (
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1 font-mono font-black text-[11px] bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md">
                                <FlaskConical className="w-3 h-3 text-blue-600" /> Test ID: #{item.test_number}
                              </span>
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                ✓ Paid • Submitted to Lab Counter #02
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">৳ {Number(item.amount).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculation Summary */}
              <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Amount:</span>
                  <span className="font-mono font-bold">৳ {viewingInvoice.subtotal?.toLocaleString()}</span>
                </div>
                {viewingInvoice.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount {viewingInvoice.discount_percent ? `(${viewingInvoice.discount_percent}%)` : ''}:</span>
                    <span className="font-mono font-bold">- ৳ {viewingInvoice.discount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 text-base font-black pt-2 border-t border-slate-300">
                  <span>Total Amount Paid:</span>
                  <span className="text-emerald-800 font-mono">৳ {viewingInvoice.total_amount?.toLocaleString()}</span>
                </div>
              </div>

              {/* Stamp & Footer */}
              <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs">
                <div>
                  <div className="inline-block border-2 border-emerald-600 text-emerald-700 px-3 py-1 rounded-lg font-black uppercase text-xs tracking-wider rotate-[-5deg]">
                    ✓ PAID IN FULL
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-signature text-emerald-900 font-bold text-base italic">
                    {viewingInvoice.cashier_name}
                  </div>
                  <span className="border-t border-slate-400 pt-0.5 text-[10px] text-slate-500 block">
                    Authorized Cashier Signature
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Modal Action Footer */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-600 font-medium">
                Receipt Code: <strong className="font-mono text-emerald-900">{viewingInvoice.invoice_code}</strong> • Patient: <strong>{viewingInvoice.patient_name}</strong> ({viewingInvoice.patient_id})
              </span>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4" /> Print Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setViewingInvoice(null)}
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

export default AccountsPortal;
