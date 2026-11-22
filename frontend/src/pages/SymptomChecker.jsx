import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Bot, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Stethoscope, 
  HeartPulse, 
  ArrowRight, 
  Activity, 
  ShieldAlert,
  Clock,
  RotateCcw
} from 'lucide-react';

const commonSymptoms = [
  { id: 'fever', label: 'High Fever (>100°F)', category: 'General' },
  { id: 'chest_pain', label: 'Chest Pressure / Tightness', category: 'Cardiology' },
  { id: 'short_breath', label: 'Shortness of Breath', category: 'Cardiology' },
  { id: 'headache', label: 'Severe Throbbing Headache', category: 'Neurology' },
  { id: 'dizziness', label: 'Dizziness or Vertigo', category: 'Neurology' },
  { id: 'skin_rash', label: 'Skin Rash or Itching', category: 'Dermatology' },
  { id: 'acne', label: 'Severe Acne & Skin Lesions', category: 'Dermatology' },
  { id: 'joint_pain', label: 'Knee / Joint Pain & Stiffness', category: 'Orthopedics' },
  { id: 'back_pain', label: 'Lower Back Strain / Pain', category: 'Orthopedics' },
  { id: 'stomach_ache', label: 'Severe Abdominal Cramps', category: 'General' },
  { id: 'cough', label: 'Persistent Dry or Wet Cough', category: 'General' },
  { id: 'vomiting', label: 'Nausea or Vomiting', category: 'General' }
];

const SymptomChecker = ({ setActivePage }) => {
  const { openBookingModal, doctors } = useData();

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [duration, setDuration] = useState('2-3 days');
  const [severity, setSeverity] = useState('Moderate');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const toggleSymptom = (id) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0) return;

    setAnalyzing(true);
    setTimeout(() => {
      let urgency = 'Moderate';
      let deptName = 'General Medicine';
      let precautions = [];
      let summary = '';
      let recommendedDocSpecialty = 'General Physician';

      const hasEmergency = selectedSymptoms.includes('chest_pain') || (selectedSymptoms.includes('short_breath') && severity === 'Severe');
      const hasNeuro = selectedSymptoms.includes('headache') || selectedSymptoms.includes('dizziness');
      const hasSkin = selectedSymptoms.includes('skin_rash') || selectedSymptoms.includes('acne');
      const hasJoint = selectedSymptoms.includes('joint_pain') || selectedSymptoms.includes('back_pain');
      const hasCardiac = selectedSymptoms.includes('chest_pain') || selectedSymptoms.includes('short_breath');

      if (hasEmergency) {
        urgency = 'Critical / Emergency';
        deptName = 'Cardiology & Emergency Care';
        recommendedDocSpecialty = 'Cardiologist';
        summary = 'Symptoms indicate potential cardiac or respiratory strain. Immediate consultation or emergency evaluation is advised.';
        precautions = [
          'Do not exert yourself physically; rest in a seated upright position.',
          'If pain radiates to the left arm, neck, or jaw, call emergency ambulance (999) without delay.',
          'Keep your medical history and previous ECGs accessible.'
        ];
      } else if (hasCardiac) {
        urgency = 'Prompt Consultation Advised';
        deptName = 'Cardiology';
        recommendedDocSpecialty = 'Cardiologist';
        summary = 'Cardiovascular evaluation recommended to screen heart rhythm and blood circulation.';
        precautions = ['Monitor resting pulse rate and blood pressure.', 'Avoid caffeine and heavy meals.'];
      } else if (hasNeuro) {
        urgency = 'Moderate';
        deptName = 'Neurology';
        recommendedDocSpecialty = 'Neurologist';
        summary = 'Symptoms align with neurological or vascular triggers such as migraine, tension headache, or inner ear vertigo.';
        precautions = [
          'Stay in a quiet, dimmed room and ensure adequate hydration.',
          'Avoid sudden neck or head movements if experiencing dizziness.'
        ];
      } else if (hasSkin) {
        urgency = 'Routine';
        deptName = 'Dermatology';
        recommendedDocSpecialty = 'Dermatologist';
        summary = 'Topical skin inflammation, contact dermatitis, or allergic reaction indicated.';
        precautions = [
          'Avoid scratching or applying harsh soaps on the affected area.',
          'Take note of any new foods, lotions, or detergents introduced recently.'
        ];
      } else if (hasJoint) {
        urgency = 'Moderate';
        deptName = 'Orthopedics';
        recommendedDocSpecialty = 'Orthopedic Surgeon';
        summary = 'Musculoskeletal or joint articulation stress observed.';
        precautions = [
          'Apply cold compress for acute swelling, warm compress for chronic stiffness.',
          'Avoid heavy weight lifting or deep squatting.'
        ];
      } else {
        urgency = 'Routine Care';
        deptName = 'General Medicine';
        recommendedDocSpecialty = 'General Physician';
        summary = 'Common systemic or viral infection symptoms. Primary care consultation is advised if symptoms persist.';
        precautions = [
          'Drink plenty of oral rehydration fluids and warm water.',
          'Rest adequately and monitor body temperature twice daily.'
        ];
      }

      // Match recommended doctor from roster
      const matchingDoctor = doctors.find(d => 
        d.specialty.toLowerCase().includes(recommendedDocSpecialty.toLowerCase())
      ) || doctors[0];

      setAnalysisResult({
        urgency,
        deptName,
        summary,
        precautions,
        matchingDoctor
      });
      setAnalyzing(false);
    }, 800);
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setAnalysisResult(null);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold shadow-sm">
            <Bot className="w-4 h-4 text-cyan-600" />
            <span>AI Health & Triage Assistant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Smart Symptom Checker
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Select what you are experiencing to receive instant triage recommendations, department mapping, and relevant specialist matching.
          </p>
        </div>

        {/* Checker Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          
          {/* Step 1: Symptoms Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                1. Select all symptoms you are experiencing:
              </label>
              {selectedSymptoms.length > 0 && (
                <button onClick={handleReset} className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {commonSymptoms.map(sym => {
                const isSelected = selectedSymptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    onClick={() => toggleSymptom(sym.id)}
                    className={`p-3 rounded-2xl text-left border text-xs font-semibold transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-600/20'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                    }`}
                  >
                    <span>{sym.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Severity and Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">2. How long have you had these symptoms?</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white"
              >
                <option value="Just today (<24 hours)">Just today (less than 24 hours)</option>
                <option value="2-3 days">2 - 3 days</option>
                <option value="1 week">About 1 week</option>
                <option value="More than 2 weeks">Chronic (more than 2 weeks)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">3. Severity Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['Mild', 'Moderate', 'Severe'].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeverity(lvl)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      severity === lvl
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleAnalyze}
            disabled={selectedSymptoms.length === 0 || analyzing}
            className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              selectedSymptoms.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-cyan-600/25 active:scale-[0.99]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {analyzing ? 'Analyzing clinical parameters...' : 'Run Triage & Specialist Check'}
          </button>
        </div>

        {/* Results Presentation */}
        {analysisResult && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cyan-200 shadow-xl space-y-6 animate-in fade-in zoom-in duration-200">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 block">Assessment Result</span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">Recommended Department: {analysisResult.deptName}</h3>
              </div>

              <div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  analysisResult.urgency.includes('Critical')
                    ? 'bg-rose-100 text-rose-800 animate-pulse'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  <ShieldAlert className="w-4 h-4" />
                  Urgency: {analysisResult.urgency}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-slate-700 text-sm leading-relaxed bg-cyan-50/60 p-4 rounded-2xl border border-cyan-100">
                {analysisResult.summary}
              </p>

              {/* Precautions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Recommended Next Steps & Precautions:</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {analysisResult.precautions.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Matched Specialist Card */}
              {analysisResult.matchingDoctor && (
                <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={analysisResult.matchingDoctor.image_url}
                      alt={analysisResult.matchingDoctor.name}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-wider">Top Matched Consultant</span>
                      <h4 className="font-bold text-slate-900 text-base">{analysisResult.matchingDoctor.name}</h4>
                      <p className="text-xs text-slate-500">{analysisResult.matchingDoctor.specialty} • Fee: ৳{analysisResult.matchingDoctor.consultation_fee}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => openBookingModal(analysisResult.matchingDoctor)}
                    className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-cyan-600/20 flex items-center justify-center gap-2"
                  >
                    <Stethoscope className="w-4 h-4" /> Book Consultation Slot
                  </button>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400 text-center pt-2">
              ⚠️ Disclaimer: This AI triage tool provides educational guidance only and is not a substitute for professional clinical diagnosis.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default SymptomChecker;
