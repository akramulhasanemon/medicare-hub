import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  FlaskConical, 
  CheckCircle2, 
  Clock, 
  Home, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';

const LabTests = ({ setActivePage }) => {
  const { labTests, bookLabTest } = useData();
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: '',
    collectionType: 'Home Sample Collection',
    address: ''
  });

  const handleOpenBooking = (pkg) => {
    if (!user) {
      if (setActivePage) setActivePage('login');
      return;
    }
    setSelectedPackage(pkg);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingForm({
      name: '',
      phone: '',
      date: tomorrow.toISOString().split('T')[0],
      collectionType: 'Home Sample Collection',
      address: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) return;

    const res = bookLabTest({
      name: bookingForm.name,
      phone: bookingForm.phone,
      packageName: selectedPackage.title,
      date: bookingForm.date,
      collectionType: bookingForm.collectionType,
      price: selectedPackage.price,
      address: bookingForm.address
    });

    if (res.success) {
      setBookingSuccess(res.booking);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Lab Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-white/20 tracking-wider inline-flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5" /> ISO 15189 Certified Pathology
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Diagnostic Health Checkups & Lab Tests
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm">
              Preventive full body profiles, cardiac screens, and hormone panels with 100% painless home sample collection and digital report delivery.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs space-y-2 shrink-0">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-cyan-300" />
              <span>Free Home Sample Collection in Dhaka</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-300" />
              <span>Digital Reports within 12-24 Hours</span>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {labTests.map(pkg => (
            <div 
              key={pkg.id}
              className={`bg-white rounded-3xl border ${pkg.popular ? 'border-blue-400 shadow-xl relative' : 'border-slate-200/80 shadow-sm'} p-7 flex flex-col justify-between hover:shadow-2xl transition-all duration-300`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Most Recommended
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {pkg.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">{pkg.title}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 line-through block">৳ {pkg.originalPrice}</span>
                    <span className="text-2xl font-black text-blue-700">৳ {pkg.price}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{pkg.description}</p>

                {/* Tests Checklist */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-700 block">Tests Included ({pkg.testsIncluded.length} parameters):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                    {pkg.testsIncluded.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preparation info */}
                <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {pkg.fastingRequired}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {pkg.reportDeliveryTime}
                  </span>
                </div>
              </div>

              {/* Book CTA */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={() => handleOpenBooking(pkg)}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3 rounded-2xl shadow-lg shadow-blue-600/25 transition-all text-xs flex items-center justify-center gap-2"
                >
                  <span>Book Test / Home Sample Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Booking Modal */}
      {isModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in">
            <div className="bg-blue-700 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Book Lab Test Package</h3>
                <p className="text-xs text-blue-200">{selectedPackage.title}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:bg-white/20 rounded-full p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017xxxxxxxx"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sample Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Collection Preference</label>
                <select
                  value={bookingForm.collectionType}
                  onChange={(e) => setBookingForm({ ...bookingForm, collectionType: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white font-medium"
                >
                  <option value="Home Sample Collection">Home Sample Collection (Phlebotomist visits home)</option>
                  <option value="Hospital / Lab Visit">Hospital / Lab Visit</option>
                </select>
              </div>

              {bookingForm.collectionType === 'Home Sample Collection' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Home Address *</label>
                  <textarea
                    required
                    rows="2"
                    placeholder="House, Road, Area for sample pickup..."
                    value={bookingForm.address}
                    onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white resize-none"
                  ></textarea>
                </div>
              )}

              <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 flex justify-between font-bold text-slate-800">
                <span>Total Test Cost:</span>
                <span className="text-blue-700">৳ {selectedPackage.price}</span>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-xs"
              >
                Confirm Test Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {bookingSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Lab Booking Confirmed!</h3>
            <p className="text-xs text-slate-600">
              Booking <span className="font-bold text-slate-800">#{bookingSuccess.id}</span> for <span className="font-bold">{bookingSuccess.package_name}</span> has been received. Our certified phlebotomist will contact you on sample day.
            </p>
            <button
              onClick={() => setBookingSuccess(null)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs"
            >
              Done & Return
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default LabTests;
