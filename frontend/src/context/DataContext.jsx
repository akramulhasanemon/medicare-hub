import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  initialDoctors, 
  initialAppointments, 
  initialDepartments, 
  initialMedicines, 
  initialLabTests, 
  initialPharmacyOrders, 
  initialLabBookings,
  initialLabEmployees,
  initialAccountsStaff,
  initialPrescriptions,
  initialLabReports,
  initialInvoices
} from '../data/mockData';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();

  // Core Clinical State
  const [doctors, setDoctors] = useState(() => {
    const saved = localStorage.getItem('medicare_doctors');
    return saved ? JSON.parse(saved) : initialDoctors;
  });

  const [departments] = useState(initialDepartments);

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('medicare_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  // Lab Employees & Accounts Staff State
  const [labEmployees, setLabEmployees] = useState(() => {
    const saved = localStorage.getItem('medicare_lab_employees');
    return saved ? JSON.parse(saved) : initialLabEmployees;
  });

  const [accountsStaff, setAccountsStaff] = useState(() => {
    const saved = localStorage.getItem('medicare_accounts_staff');
    return saved ? JSON.parse(saved) : initialAccountsStaff;
  });

  // Prescriptions State
  const [prescriptions, setPrescriptions] = useState(() => {
    const saved = localStorage.getItem('medicare_prescriptions');
    return saved ? JSON.parse(saved) : initialPrescriptions;
  });

  // Lab Reports State
  const [labReports, setLabReports] = useState(() => {
    const saved = localStorage.getItem('medicare_lab_reports');
    return saved ? JSON.parse(saved) : initialLabReports;
  });

  // Billing Invoices State
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('medicare_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  // Pharmacy State
  const [medicines, setMedicines] = useState(() => {
    const saved = localStorage.getItem('medicare_medicines');
    return saved ? JSON.parse(saved) : initialMedicines;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('medicare_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [pharmacyOrders, setPharmacyOrders] = useState(() => {
    const saved = localStorage.getItem('medicare_pharmacy_orders');
    return saved ? JSON.parse(saved) : initialPharmacyOrders;
  });

  // Lab Tests State
  const [labTests] = useState(initialLabTests);
  const [labBookings, setLabBookings] = useState(() => {
    const saved = localStorage.getItem('medicare_lab_bookings');
    const list = saved ? JSON.parse(saved) : initialLabBookings;
    return list.filter(b => !/consultation|doctor fee|chamber fee/i.test(b.package_name || b.test_name || ''));
  });

  // Ambulance Requests State
  const [ambulanceRequests, setAmbulanceRequests] = useState(() => {
    const saved = localStorage.getItem('medicare_ambulance_requests');
    return saved ? JSON.parse(saved) : [
      {
        id: "AMB-101",
        patient_name: "Rafiqul Islam",
        phone: "01712345678",
        pickup_address: "Dhanmondi 27, Dhaka",
        ambulance_type: "ICU Ambulance with Ventilator",
        status: "Dispatched",
        request_time: "10 mins ago"
      }
    ];
  });

  // Modals & Navigation Helpers
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('medicare_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('medicare_lab_employees', JSON.stringify(labEmployees));
  }, [labEmployees]);

  useEffect(() => {
    localStorage.setItem('medicare_accounts_staff', JSON.stringify(accountsStaff));
  }, [accountsStaff]);

  useEffect(() => {
    localStorage.setItem('medicare_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('medicare_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('medicare_pharmacy_orders', JSON.stringify(pharmacyOrders));
  }, [pharmacyOrders]);

  useEffect(() => {
    localStorage.setItem('medicare_lab_bookings', JSON.stringify(labBookings));
  }, [labBookings]);

  useEffect(() => {
    localStorage.setItem('medicare_ambulance_requests', JSON.stringify(ambulanceRequests));
  }, [ambulanceRequests]);

  useEffect(() => {
    localStorage.setItem('medicare_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('medicare_lab_reports', JSON.stringify(labReports));
  }, [labReports]);

  useEffect(() => {
    localStorage.setItem('medicare_invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Next Code Generator Helpers
  const getNextDoctorCode = () => {
    let maxNum = 100;
    doctors.forEach(d => {
      const code = d.doctor_code || '';
      const match = code.match(/^D(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `D${maxNum + 1}`;
  };

  const getNextLabCode = () => {
    let maxNum = 100;
    labEmployees.forEach(e => {
      const code = e.employee_code || '';
      const match = code.match(/^L(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `L${maxNum + 1}`;
  };

  const getNextAccountsCode = () => {
    let maxNum = 100;
    accountsStaff.forEach(a => {
      const code = a.account_code || '';
      const match = code.match(/^A(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `A${maxNum + 1}`;
  };

  // Auto-increment 6-digit Test Number generator (e.g. 112233, 112234, ...)
  const getNextTestNumber = () => {
    let maxNum = 112232;
    const stored = localStorage.getItem('medicare_last_test_number');
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed > maxNum) maxNum = parsed;
    }
    labBookings.forEach(b => {
      if (b.test_number) {
        const num = parseInt(b.test_number, 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    const nextNum = maxNum + 1;
    localStorage.setItem('medicare_last_test_number', nextNum.toString());
    return nextNum.toString();
  };

  // Book diagnostic lab tests from Accounts invoice
  const bookAccountsLabTests = (invoice, testItems) => {
    if (!testItems || !Array.isArray(testItems) || testItems.length === 0) return [];

    const newBookings = testItems.map(item => {
      const testNo = item.test_number || getNextTestNumber();
      item.test_number = testNo;
      return {
        id: `LAB-${testNo}`,
        test_number: testNo,
        patient_id: invoice.patient_id || 'P01',
        patient_name: invoice.patient_name,
        patient_phone: invoice.patient_phone,
        package_name: item.description.replace(/^Diagnostic Investigation:\s*/i, '').replace(/\[.*?\]/g, '').trim(),
        test_name: item.description.replace(/^Diagnostic Investigation:\s*/i, '').replace(/\[.*?\]/g, '').trim(),
        price: Number(item.amount) || 0,
        invoice_code: invoice.invoice_code,
        booking_date: new Date().toISOString().split('T')[0],
        collection_type: 'Hospital Lab Counter #02',
        status: 'Pending',
        created_from_accounts: true,
        paid: true,
        paid_at: invoice.created_at || new Date().toLocaleString(),
        address: 'MediCare Hub Central Hospital'
      };
    });

    setLabBookings(prev => {
      // Avoid duplicate labBookings with identical test_number
      const existingTestNos = new Set(prev.map(b => b.test_number));
      const freshBookings = newBookings.filter(b => !existingTestNos.has(b.test_number));
      return [...freshBookings, ...prev];
    });

    return newBookings;
  };

  // Appointment actions
  const bookAppointment = async (appointmentData) => {
    const newAppointment = {
      id: Date.now(),
      patient_id: user?.id || null,
      patient_code: user?.patient_id || 'P01',
      doctor_id: appointmentData.doctor_id,
      doctor_name: appointmentData.doctor_name,
      doctor_specialty: appointmentData.doctor_specialty,
      patient_name: appointmentData.patient_name,
      patient_email: appointmentData.patient_email,
      patient_phone: appointmentData.patient_phone,
      appointment_date: appointmentData.appointment_date,
      appointment_time: appointmentData.appointment_time,
      symptoms: appointmentData.symptoms,
      status: 'pending',
      admin_notes: 'Awaiting admin confirmation',
      created_at: new Date().toISOString()
    };

    setAppointments(prev => [newAppointment, ...prev]);
    return { success: true, appointment: newAppointment };
  };

  const updateAppointmentStatus = (id, status, notes = '') => {
    setAppointments(prev =>
      prev.map(app => (app.id === id ? { ...app, status, admin_notes: notes || app.admin_notes } : app))
    );
  };

  // Doctor CRUD
  const addDoctor = (doctorData) => {
    const nextCode = doctorData.doctor_code || getNextDoctorCode();
    const newDoctor = {
      id: Date.now(),
      doctor_code: nextCode,
      name: doctorData.name,
      specialty: doctorData.specialty,
      phone: doctorData.phone || '01711223344',
      address: doctorData.address || 'MediCare Hospital, Dhaka',
      department_id: Number(doctorData.department_id) || 1,
      qualification: doctorData.qualification || 'MBBS, Specialist',
      experience_years: Number(doctorData.experience_years) || 5,
      consultation_fee: Number(doctorData.consultation_fee) || 800,
      available_days: doctorData.available_days || 'Sat, Mon, Wed',
      available_time: doctorData.available_time || '05:00 PM - 09:00 PM',
      rating: 5.0,
      reviewsCount: 1,
      bio: doctorData.bio || 'Experienced specialist consultant.',
      image_url: doctorData.image_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'
    };

    setDoctors(prev => [newDoctor, ...prev]);

    // Also register user so they can log in
    const registeredUsers = JSON.parse(localStorage.getItem('medicare_registered_users') || '[]');
    registeredUsers.push({
      id: newDoctor.id,
      patient_id: nextCode,
      name: newDoctor.name,
      email: doctorData.email || `${nextCode.toLowerCase()}@medicare.com`,
      phone: newDoctor.phone,
      address: newDoctor.address,
      role: 'doctor',
      password: doctorData.password || 'doctor123'
    });
    localStorage.setItem('medicare_registered_users', JSON.stringify(registeredUsers));

    return { success: true, doctor: newDoctor };
  };

  const deleteDoctor = (id) => {
    setDoctors(prev => prev.filter(d => d.id !== id && d.doctor_code !== id));
  };

  // Lab Employee CRUD
  const addLabEmployee = (employeeData) => {
    const nextCode = employeeData.employee_code || getNextLabCode();
    const newEmployee = {
      id: Date.now(),
      employee_code: nextCode,
      name: employeeData.name,
      email: employeeData.email || `${nextCode.toLowerCase()}@medicare.com`,
      phone: employeeData.phone || '01711000000',
      address: employeeData.address || 'MediCare Hospital, Dhaka',
      role: 'lab_staff',
      specialization: employeeData.specialization || 'Clinical Technologist',
      department: employeeData.department || 'Pathology & Diagnostic Lab',
      joined_date: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setLabEmployees(prev => [newEmployee, ...prev]);

    // Also register user account so they can log in with their ID and password
    const registeredUsers = JSON.parse(localStorage.getItem('medicare_registered_users') || '[]');
    registeredUsers.push({
      id: newEmployee.id,
      patient_id: nextCode,
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone,
      address: newEmployee.address,
      role: 'lab_staff',
      password: employeeData.password || 'lab123'
    });
    localStorage.setItem('medicare_registered_users', JSON.stringify(registeredUsers));

    return { success: true, employee: newEmployee };
  };

  const deleteLabEmployee = (id) => {
    setLabEmployees(prev => prev.filter(e => e.id !== id && e.employee_code !== id));
  };

  // Accounts Staff CRUD
  const addAccountsStaff = (staffData) => {
    const nextCode = staffData.account_code || getNextAccountsCode();
    const newStaff = {
      id: Date.now(),
      account_code: nextCode,
      name: staffData.name,
      email: staffData.email || `${nextCode.toLowerCase()}@medicare.com`,
      phone: staffData.phone || '01722000000',
      address: staffData.address || 'MediCare Hospital, Dhaka',
      role: 'accountant',
      designation: staffData.designation || 'Accounts & Billing Officer',
      section: staffData.section || 'General Accounts & Cash Counter',
      joined_date: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setAccountsStaff(prev => [newStaff, ...prev]);

    // Also register user account so they can log in with their ID and password
    const registeredUsers = JSON.parse(localStorage.getItem('medicare_registered_users') || '[]');
    registeredUsers.push({
      id: newStaff.id,
      patient_id: nextCode,
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone,
      address: newStaff.address,
      role: 'accountant',
      password: staffData.password || 'account123'
    });
    localStorage.setItem('medicare_registered_users', JSON.stringify(registeredUsers));

    return { success: true, staff: newStaff };
  };

  const deleteAccountsStaff = (id) => {
    setAccountsStaff(prev => prev.filter(s => s.id !== id && s.account_code !== id));
  };

  // Pharmacy Cart Functions
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQty = (productId, delta) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCart([]);

  const placePharmacyOrder = (orderData) => {
    const newOrder = {
      id: `PHARM-${Date.now().toString().slice(-4)}`,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      delivery_address: orderData.delivery_address,
      items: [...cart],
      total_amount: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
      payment_method: orderData.payment_method || 'Cash on Delivery',
      status: 'Processing',
      created_at: new Date().toISOString()
    };

    setPharmacyOrders(prev => [newOrder, ...prev]);
    clearCart();
    return { success: true, order: newOrder };
  };

  const updatePharmacyOrderStatus = (orderId, newStatus) => {
    setPharmacyOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Diagnostics & Lab Functions
  const bookLabTest = (bookingData) => {
    const newBooking = {
      id: `LAB-${Date.now().toString().slice(-4)}`,
      patient_name: bookingData.patient_name,
      patient_phone: bookingData.patient_phone,
      package_name: bookingData.package_name,
      booking_date: bookingData.booking_date,
      collection_type: bookingData.collection_type || 'Home Sample Collection',
      price: bookingData.price,
      status: 'Pending',
      address: bookingData.address || 'Standard Address'
    };

    setLabBookings(prev => [newBooking, ...prev]);
    return { success: true, booking: newBooking };
  };

  const updateLabBookingStatus = (bookingId, newStatus) => {
    setLabBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  // Ambulance Functions
  const requestAmbulance = (requestData) => {
    const newRequest = {
      id: `AMB-${Date.now().toString().slice(-3)}`,
      patient_name: requestData.patient_name,
      phone: requestData.phone,
      pickup_address: requestData.pickup_address,
      ambulance_type: requestData.ambulance_type,
      status: 'Dispatched',
      request_time: 'Just now'
    };

    setAmbulanceRequests(prev => [newRequest, ...prev]);
    return { success: true, request: newRequest };
  };

  const updateAmbulanceStatus = (id, newStatus) => {
    setAmbulanceRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  // Digital Prescriptions Function
  const issuePrescription = (prescriptionData) => {
    const newPrescription = {
      id: Date.now(),
      prescription_code: `RX-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      ...prescriptionData
    };
    setPrescriptions(prev => [newPrescription, ...prev]);
    if (prescriptionData.appointment_id) {
      updateAppointmentStatus(prescriptionData.appointment_id, 'completed', 'Prescription issued & consultation complete');
    }
    return { success: true, prescription: newPrescription };
  };

  // Pathology Lab Reports Function
  const issueLabReport = (reportData) => {
    const newReport = {
      id: Date.now(),
      report_code: `REP-${Date.now().toString().slice(-4)}`,
      verified_at: new Date().toLocaleString(),
      status: 'Verified & Approved',
      ...reportData
    };
    setLabReports(prev => [newReport, ...prev]);
    if (reportData.booking_id) {
      updateLabBookingStatus(reportData.booking_id, 'Completed');
    }
    return { success: true, report: newReport };
  };

  // Hospital Accounts & Billing Invoice Function
  const issueInvoice = (invoiceData) => {
    const newInvoice = {
      id: Date.now(),
      invoice_code: `INV-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toLocaleString(),
      status: 'PAID',
      ...invoiceData
    };

    // Auto-detect & register diagnostic lab tests into labBookings
    if (newInvoice.items && Array.isArray(newInvoice.items)) {
      const testItems = newInvoice.items.filter(item => 
        (item.is_test === true || item.test_number) ||
        (item.is_test !== false &&
         !/consultation|doctor fee|opd fee|chamber fee|visit fee|registration/i.test(item.description) &&
         /test|cbc|creatinin|blood|profile|lipid|sugar|glucose|ecg|echo|panel|investigation|urine|electrolytes|lft|kft|hba1c|thyroid|serum|x-ray|ultrasound/i.test(item.description))
      );

      if (testItems.length > 0) {
        testItems.forEach(item => {
          if (!item.test_number) {
            item.test_number = getNextTestNumber();
          }
        });
        bookAccountsLabTests(newInvoice, testItems);
      }
    }

    setInvoices(prev => [newInvoice, ...prev]);
    return { success: true, invoice: newInvoice };
  };

  const openBookingModal = (doctor = null) => {
    setSelectedDoctorForBooking(doctor);
    setIsBookingModalOpen(true);
  };
  const closeBookingModal = () => {
    setSelectedDoctorForBooking(null);
    setIsBookingModalOpen(false);
  };

  const openEmergencyModal = () => setIsEmergencyModalOpen(true);
  const closeEmergencyModal = () => setIsEmergencyModalOpen(false);

  // Filter appointments for current logged in patient
  const patientAppointments = user
    ? (appointments || []).filter(a => {
        if (!a) return false;
        const uId = String(user.patient_id || user.id || '').trim().toUpperCase();
        const aId = String(a.patient_id || a.patient_code || '').trim().toUpperCase();
        const uEmail = String(user.email || '').trim().toLowerCase();
        const aEmail = String(a.patient_email || '').trim().toLowerCase();
        return (uEmail && aEmail && uEmail === aEmail) || (uId && aId && uId === aId);
      })
    : [];

  const patientOrders = user
    ? (pharmacyOrders || []).filter(o => {
        if (!o) return false;
        const uPhone = String(user.phone || '').replace(/\D/g, '');
        const oPhone = String(o.customer_phone || '').replace(/\D/g, '');
        const uName = String(user.name || '').trim().toLowerCase();
        const oName = String(o.customer_name || '').trim().toLowerCase();
        return (uPhone && oPhone && uPhone === oPhone) || (uName && oName && uName === oName);
      })
    : (pharmacyOrders || []);

  // Filter lab bookings strictly for current logged in patient
  const patientLabBookings = user
    ? (labBookings || []).filter(b => {
        if (!b) return false;
        if (b.package_name && /consultation|doctor fee|opd fee|chamber fee/i.test(b.package_name)) return false;
        const uRole = String(user.role || '').toLowerCase();
        if (uRole === 'admin') return true;
        const uId = String(user.patient_id || '').trim().toUpperCase();
        const bId = String(b.patient_id || '').trim().toUpperCase();
        if (uId && bId && uId === bId) return true;
        const uPhone = String(user.phone || '').replace(/\D/g, '');
        const bPhone = String(b.patient_phone || '').replace(/\D/g, '');
        if (uPhone && bPhone && uPhone === bPhone) return true;
        return false;
      })
    : [];

  return (
    <DataContext.Provider value={{
      doctors,
      departments,
      appointments,
      patientAppointments,
      bookAppointment,
      updateAppointmentStatus,
      addDoctor,
      deleteDoctor,
      getNextDoctorCode,

      // Lab Employees & Accounts Staff
      labEmployees,
      addLabEmployee,
      deleteLabEmployee,
      getNextLabCode,
      accountsStaff,
      addAccountsStaff,
      deleteAccountsStaff,
      getNextAccountsCode,
      
      // Pharmacy
      medicines,
      cart,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      pharmacyOrders,
      patientOrders,
      placePharmacyOrder,
      updatePharmacyOrderStatus,

      // Diagnostics & Lab
      labTests,
      labBookings,
      patientLabBookings,
      bookLabTest,
      updateLabBookingStatus,
      getNextTestNumber,
      bookAccountsLabTests,

      // Digital Prescriptions, Lab Reports, Hospital Invoices
      prescriptions,
      issuePrescription,
      labReports,
      issueLabReport,
      invoices,
      issueInvoice,

      // Ambulance & Emergency
      ambulanceRequests,
      requestAmbulance,
      updateAmbulanceStatus,

      // Modals
      selectedDoctorForBooking,
      isBookingModalOpen,
      openBookingModal,
      closeBookingModal,
      isEmergencyModalOpen,
      openEmergencyModal,
      closeEmergencyModal
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
