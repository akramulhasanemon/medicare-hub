import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppointmentModal from './components/AppointmentModal';
import EmergencyModal from './components/EmergencyModal';
import QuickReportTrackerModal from './components/QuickReportTrackerModal';
import FloatingQuickActionDial from './components/FloatingQuickActionDial';

import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Pharmacy from './pages/Pharmacy';
import LabTests from './pages/LabTests';
import SymptomChecker from './pages/SymptomChecker';
import HealthTools from './pages/HealthTools';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DoctorPortal from './pages/DoctorPortal';
import LabPortal from './pages/LabPortal';
import AccountsPortal from './pages/AccountsPortal';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-800 font-sans">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto font-bold text-2xl">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-slate-900">Application Recovered</h2>
            <p className="text-xs text-slate-500">
              সাময়িক ডাটা রেন্ডারিং ত্রুটি ধরা পড়েছে। অনুগ্রহ করে নিচের বাটনে ক্লিক করে পুনরায় ফ্রেশ লোড করুন।
            </p>
            {this.state.error && (
              <div className="text-left bg-slate-100 p-3 rounded-xl text-[11px] font-mono text-rose-600 overflow-x-auto">
                {String(this.state.error.message || this.state.error)}
              </div>
            )}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md"
              >
                Reload MediCare Hub (পেজ রিফ্রেশ করুন)
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('medicare_user');
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-xl text-xs transition-all"
              >
                Reset Session & Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent = () => {
  const [activePage, setActivePage] = useState('home');
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const { user } = useAuth();

  const userRole = String(user?.role || 'patient').toLowerCase();

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home setActivePage={setActivePage} />;
      case 'doctors':
        return <Doctors setActivePage={setActivePage} />;
      case 'pharmacy':
        return <Pharmacy setActivePage={setActivePage} />;
      case 'lab-tests':
        return <LabTests setActivePage={setActivePage} />;
      case 'symptom-checker':
        return <SymptomChecker setActivePage={setActivePage} />;
      case 'health-tools':
        return <HealthTools setActivePage={setActivePage} />;
      case 'login':
        return <Login setActivePage={setActivePage} />;
      case 'register':
        return <Register setActivePage={setActivePage} />;
      
      // Patient Portal (Only for Patients & Admin)
      case 'patient-dashboard':
        if (!user) return <Login setActivePage={setActivePage} />;
        if (userRole === 'patient' || userRole === 'admin') {
          return <UserDashboard setActivePage={setActivePage} onOpenTracker={() => setIsTrackerOpen(true)} />;
        }
        if (userRole === 'doctor') return <DoctorPortal setActivePage={setActivePage} />;
        if (userRole === 'lab_staff') return <LabPortal setActivePage={setActivePage} />;
        if (userRole === 'accountant') return <AccountsPortal setActivePage={setActivePage} />;
        return <UserDashboard setActivePage={setActivePage} onOpenTracker={() => setIsTrackerOpen(true)} />;

      // Doctor Portal (Only for Doctors & Admin)
      case 'doctor-portal':
        if (!user) return <Login setActivePage={setActivePage} />;
        if (userRole === 'doctor' || userRole === 'admin') {
          return <DoctorPortal setActivePage={setActivePage} />;
        }
        return <DoctorPortal setActivePage={setActivePage} />;

      // Lab Staff Portal (Only for Lab Staff & Admin)
      case 'lab-portal':
        if (!user) return <Login setActivePage={setActivePage} />;
        if (userRole === 'lab_staff' || userRole === 'admin') {
          return <LabPortal setActivePage={setActivePage} />;
        }
        return <LabPortal setActivePage={setActivePage} />;

      // Accounts Section Portal (Only for Accountants & Admin)
      case 'accounts-portal':
        if (!user) return <Login setActivePage={setActivePage} />;
        if (userRole === 'accountant' || userRole === 'admin') {
          return <AccountsPortal setActivePage={setActivePage} />;
        }
        return <AccountsPortal setActivePage={setActivePage} />;

      // Admin Portal (Only for Admin)
      case 'admin':
        if (!user) return <Login setActivePage={setActivePage} />;
        if (userRole === 'admin') {
          return <AdminDashboard setActivePage={setActivePage} />;
        }
        if (userRole === 'doctor') return <DoctorPortal setActivePage={setActivePage} />;
        if (userRole === 'lab_staff') return <LabPortal setActivePage={setActivePage} />;
        if (userRole === 'accountant') return <AccountsPortal setActivePage={setActivePage} />;
        return <UserDashboard setActivePage={setActivePage} onOpenTracker={() => setIsTrackerOpen(true)} />;

      default:
        return <Home setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onOpenTracker={() => setIsTrackerOpen(true)}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer setActivePage={setActivePage} />
      
      {/* Interactive Global Modals & Speed Dial */}
      <AppointmentModal setActivePage={setActivePage} />
      <EmergencyModal />
      <QuickReportTrackerModal 
        isOpen={isTrackerOpen} 
        onClose={() => setIsTrackerOpen(false)} 
      />
      <FloatingQuickActionDial 
        setActivePage={setActivePage} 
        onOpenTracker={() => setIsTrackerOpen(true)} 
      />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
