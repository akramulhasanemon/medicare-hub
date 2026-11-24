import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import DoctorCard from '../components/DoctorCard';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Award, 
  FolderOpen, 
  FileText, 
  CheckCircle2, 
  Download, 
  Activity,
  PhoneCall,
  Siren,
  Sparkles
} from 'lucide-react';

const Home = ({ setActivePage }) => {
  const { doctors, openBookingModal, openEmergencyModal } = useData();
  const { isBn } = useLanguage();
  const featuredDoctors = doctors.slice(0, 4);

  return (
    <div className="space-y-4 transition-colors">
      
      {/* 1. Bento Grid Hero Section */}
      <Hero setActivePage={setActivePage} />

      {/* 2. Core 4 Services Bento Section */}
      <Services setActivePage={setActivePage} />

      {/* 3. Featured Specialist Doctors Showcase */}
      <section className="py-16 sm:py-20 transition-colors" id="doctors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-700/50 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isBn ? 'শীর্ষ বিশেষজ্ঞ ডাক্তার' : 'Top Rated Specialists'}</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                {isBn ? (
                  <>বিএমডিসি অনুমোদিত <span className="gradient-text">বিশেষজ্ঞ চিকিৎসকবৃন্দ</span></>
                ) : (
                  <>BMDC Certified <span className="gradient-text">Specialist Doctors</span></>
                )}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-xl">
                {isBn 
                  ? 'ঢাকা ও ঢাকার বাইরে সিনিয়র অধ্যাপক ও বিশেষজ্ঞদের সাথে সরাসরি চেম্বার বা ভিডিও কনসালটেশন শিডিউল করুন।'
                  : 'Schedule instant chamber or video consultations with verified senior consultants and professors.'
                }
              </p>
            </div>

            <button
              onClick={() => setActivePage('doctors')}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
            >
              <span>{isBn ? `সকল ডাক্তার দেখুন (${doctors.length})` : `View All Doctors (${doctors.length})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} setActivePage={setActivePage} />
            ))}
          </div>

        </div>
      </section>

      {/* 4. Patient Medical Vault (PID) Interactive Preview */}
      <section className="py-16 sm:py-20 transition-colors" id="vault-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-700/50 mb-3">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>{isBn ? 'স্মার্ট মেডিকেল ভল্ট (PID)' : 'Patient Medical Vault (PID)'}</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
              {isBn ? (
                <>আপনার সম্পূর্ণ <span className="gradient-text">মেডিকেল রেকর্ড</span> এক জায়গায়</>
              ) : (
                <>Your Complete <span className="gradient-text">Medical Records</span> in One Place</>
              )}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              {isBn 
                ? 'আজীবন সুরক্ষিত ডিজিটাল মেডিকেল প্রোফাইল — সব প্রেসক্রিপশন, ল্যাব টেস্ট ট্র্যাকিং ও ইতিহাস এক ক্লিকে ডাউনলোড করুন।'
                : 'Lifetime secure digital medical profile — all doctor prescriptions, live lab tracking, and medical history in one click.'
              }
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
            
            {/* Demo Patient PID Card */}
            <div className="lg:col-span-2 glass rounded-3xl p-6 flex flex-col justify-between border border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-sky-600 flex items-center justify-center text-white text-2xl font-black shadow-md flex-shrink-0">
                    JD
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">John Doe (পেশেন্ট)</h4>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-mono font-bold">PID: P01</p>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isBn ? 'সক্রিয় প্রোফাইল' : 'Verified Profile'}</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 mb-6 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isBn ? 'বয়স:' : 'Age:'}</span>
                    <span className="font-bold font-en">32 Yrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isBn ? 'রক্তের গ্রুপ:' : 'Blood Group:'}</span>
                    <span className="font-bold text-rose-600 font-en">B+ Positive</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isBn ? 'ফোন নম্বর:' : 'Phone:'}</span>
                    <span className="font-bold font-en">+880 1811112233</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setActivePage('patient-dashboard')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <span>{isBn ? 'আমার ভল্টে প্রবেশ করুন' : 'Access My Medical Vault'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Live Lab Tracking Progress Timeline Card */}
            <div className="lg:col-span-3 glass rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                      {isBn ? 'সাম্প্রতিক ডায়াগনস্টিক টেস্ট' : 'Recent Diagnostic Test'}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      Complete Blood Count (CBC) + Lipid Profile
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700/50">
                    LAB-240109
                  </span>
                </div>

                {/* Progressive Status Timeline */}
                <div className="space-y-4 my-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {isBn ? 'নমুনা সংগ্রহ সম্পন্ন (Sample Collected)' : 'Sample Collected at Home'}
                      </div>
                      <div className="text-[11px] text-slate-500">Dhanmondi Collection Unit • 08:30 AM</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {isBn ? 'ল্যাব প্রসেসিং ও বিশ্লেষণ' : 'Processing in Central Pathology Lab'}
                      </div>
                      <div className="text-[11px] text-slate-500">Automated Hematology Analyzer</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {isBn ? 'কনসালটেন্ট প্যাথলজিস্ট কর্তৃক অনুমোদিত' : 'Doctor Verified & Certified'}
                      </div>
                      <div className="text-[11px] text-slate-500">Dr. Rafiqul Islam (Chief Pathologist)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isBn ? 'রিপোর্ট অনলাইনে প্রস্তুত' : 'PDF Report Ready'}</span>
                </span>

                <button
                  onClick={() => setActivePage('patient-dashboard')}
                  className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-teal-400" />
                  <span>{isBn ? 'ডাউনলোড রিপোর্ট' : 'Download PDF'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. 24/7 National Emergency Hotline Banner */}
      <section className="py-14 bg-gradient-to-r from-teal-600 to-sky-600 text-white relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mb-12 shadow-xl">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold">
            <Siren className="w-4 h-4 text-white animate-pulse" />
            <span>{isBn ? 'জরুরি চিকিৎসা হেল্পলাইন' : 'National Emergency Response'}</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {isBn 
              ? 'যেকোনো চিকিৎসা জরুরি প্রয়োজনে আমরা প্রস্তুত ২৪/৭' 
              : 'Immediate Medical Assistance When Every Second Counts'
            }
          </h3>

          <p className="text-teal-100 text-xs sm:text-sm max-w-xl mx-auto">
            {isBn 
              ? 'জাতীয় জরুরি হটলাইন ৯৯৯ অথবা আমাদের জরুরি অ্যাম্বুলেন্স কমান্ড সেন্টারে সরাসরি যোগাযোগ করুন।'
              : 'Call national hotline 999 or connect directly with our rapid response dispatch center.'
            }
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="tel:+8801700000000"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white text-teal-700 hover:bg-teal-50 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <PhoneCall className="w-4 h-4 text-teal-600" />
              <span className="font-en">+880 1700-000000</span>
            </a>

            <button
              onClick={() => openEmergencyModal()}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Siren className="w-4 h-4" />
              <span>{isBn ? 'অ্যাম্বুলেন্স রিকোয়েস্ট' : 'Request Ambulance'}</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
