import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const AppointmentModal = ({ setActivePage }) => {
  const { 
    isBookingModalOpen, 
    closeBookingModal, 
    selectedDoctorForBooking, 
    doctors, 
    bookAppointment 
  } = useData();

  const { user } = useAuth();

  const [formData, setFormData] = useState({
    doctor_id: '',
    doctor_name: '',
    doctor_specialty: '',
    patient_name: '',
    patient_email: '',
    patient_phone: '',
    appointment_date: '',
    appointment_time: '06:00 PM',
    symptoms: ''
  });

  const [loading, setLoading] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state when modal opens or doctor selected
  useEffect(() => {
    if (isBookingModalOpen) {
      setSuccessBooking(null);
      setErrorMsg('');

      const doctor = selectedDoctorForBooking || doctors[0];

      // Default date: tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDateStr = tomorrow.toISOString().split('T')[0];

      setFormData({
        doctor_id: doctor ? doctor.id : '',
        doctor_name: doctor ? doctor.name : '',
        doctor_specialty: doctor ? doctor.specialty : '',
        patient_name: user ? user.name : '',
        patient_email: user ? user.email : '',
        patient_phone: user ? (user.phone || '01811112233') : '',
        appointment_date: defaultDateStr,
        appointment_time: '06:00 PM',
        symptoms: ''
      });
    }
  }, [isBookingModalOpen, selectedDoctorForBooking, doctors, user]);

  if (!isBookingModalOpen) return null;

  const handleDoctorChange = (e) => {
    const docId = Number(e.target.value);
    const doc = doctors.find(d => d.id === docId);
    if (doc) {
      setFormData(prev => ({
        ...prev,
        doctor_id: doc.id,
        doctor_name: doc.name,
        doctor_specialty: doc.specialty
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.doctor_id || !formData.patient_name || !formData.patient_phone || !formData.appointment_date) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await bookAppointment(formData);
      if (res.success) {
        setSuccessBooking(res.appointment);
      } else {
        setErrorMsg('Failed to book appointment. Please try again.');
      }
    } catch (err) {
      setErrorMsg('An error occurred during booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) closeBookingModal(); }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Book an Appointment</h3>
            <p className="text-xs text-cyan-100 mt-0.5">Quick confirmation with certified doctors</p>
          </div>
          <button
            onClick={closeBookingModal}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {!user ? (
            /* Auth Required Gate Screen */
            <div className="text-center py-6 px-2 space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xl font-bold text-slate-900">Sign In Required / সাইন-ইন আবশ্যক</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  ডাক্তারের অ্যাপয়েন্টমেন্ট বুকিং করতে, প্রেসক্রিপশন ও মেডিকেল হিস্ট্রি সংরক্ষণ করতে অনুগ্রহ করে প্রথমে সাইন-ইন বা লগইন করুন। সাইন-ইন না করে ভেতরে বুকিং সম্পন্ন করা যাবে না।
                </p>
              </div>

              <div className="pt-3 flex flex-col gap-2.5 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    closeBookingModal();
                    if (setActivePage) setActivePage('login');
                  }}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-xl shadow-md text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In Now (লগইন করুন)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeBookingModal();
                    if (setActivePage) setActivePage('register');
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-all"
                >
                  Create Free Account (নতুন অ্যাকাউন্ট খুলুন)
                </button>
              </div>
            </div>
          ) : successBooking ? (
            /* Success confirmation screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900">Appointment Requested!</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Your appointment with <span className="font-bold text-slate-800">{successBooking.doctor_name}</span> has been received. Our team will verify and confirm your slot shortly.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Appointment ID:</span>
                  <span className="font-bold text-slate-800">#{successBooking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Slot:</span>
                  <span className="font-bold text-slate-800">{successBooking.appointment_date} at {successBooking.appointment_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold text-slate-800">{successBooking.patient_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded">Pending Review</span>
                </div>
              </div>

              <button
                onClick={closeBookingModal}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-sm mt-4"
              >
                Close & Return
              </button>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Select Doctor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Doctor *</label>
                <select
                  value={formData.doctor_id}
                  onChange={handleDoctorChange}
                  className="w-full text-xs sm:text-sm font-medium border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialty} (৳{d.consultation_fee})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-600" /> Date *
                  </label>
                  <input
                    type="date"
                    value={formData.appointment_date}
                    onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                    className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-600" /> Time Slot *
                  </label>
                  <select
                    value={formData.appointment_time}
                    onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                    className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="10:00 AM">10:00 AM - Morning Slot</option>
                    <option value="12:00 PM">12:00 PM - Midday Slot</option>
                    <option value="05:00 PM">05:00 PM - Evening Slot</option>
                    <option value="06:30 PM">06:30 PM - Evening Slot</option>
                    <option value="08:00 PM">08:00 PM - Night Slot</option>
                  </select>
                </div>
              </div>

              {/* Patient Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-600" /> Patient Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Patient Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-cyan-600" /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="017xxxxxxxx"
                    value={formData.patient_phone}
                    onChange={(e) => setFormData({ ...formData, patient_phone: e.target.value })}
                    className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-600" /> Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={formData.patient_email}
                    onChange={(e) => setFormData({ ...formData, patient_email: e.target.value })}
                    className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Symptoms / Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-600" /> Symptoms / Problem Description
                </label>
                <textarea
                  rows="2"
                  placeholder="Describe your health problem or reason for visit..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="w-full text-xs sm:text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                ></textarea>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-600/25 transition-all text-sm flex items-center justify-center gap-2 mt-4"
              >
                {loading ? 'Processing...' : 'Confirm Appointment Request'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default AppointmentModal;
