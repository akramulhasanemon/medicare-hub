import React, { useState } from 'react';
import { 
  Calculator, 
  Heart, 
  Droplet, 
  Scale, 
  Activity, 
  Info, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const HealthTools = ({ setActivePage }) => {
  const [activeTool, setActiveTool] = useState('bmi'); // 'bmi' | 'bp' | 'water'

  // BMI State
  const [weightKg, setWeightKg] = useState(68);
  const [heightCm, setHeightCm] = useState(172);

  // BP State
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);

  // Water State
  const [waterWeight, setWaterWeight] = useState(65);
  const [activityMins, setActivityMins] = useState(30);

  // Calculate BMI
  const heightInMeters = heightCm / 100;
  const bmiValue = (weightKg / (heightInMeters * heightInMeters)).toFixed(1);
  let bmiCategory = 'Normal Weight';
  let bmiColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  let bmiAdvice = 'Your weight is in the healthy range. Maintain your balanced diet and regular physical activity.';

  if (bmiValue < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-amber-600 bg-amber-50 border-amber-200';
    bmiAdvice = 'Nutrient-rich calorie intake and strength training recommended to build healthy muscle mass.';
  } else if (bmiValue >= 25 && bmiValue < 29.9) {
    bmiCategory = 'Overweight';
    bmiColor = 'text-amber-600 bg-amber-50 border-amber-200';
    bmiAdvice = 'Consider increasing cardiovascular workouts and reducing processed sugars to attain optimal weight.';
  } else if (bmiValue >= 30) {
    bmiCategory = 'Obese';
    bmiColor = 'text-rose-600 bg-rose-50 border-rose-200';
    bmiAdvice = 'Consult a general physician or clinical nutritionist for a sustainable lifestyle and weight management plan.';
  }

  // Calculate BP Category
  let bpCategory = 'Normal Blood Pressure';
  let bpColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  let bpAdvice = 'Your blood pressure is within ideal limits (<120/80 mmHg). Continue low-sodium diet and stress management.';

  if (systolic >= 140 || diastolic >= 90) {
    bpCategory = 'Stage 2 Hypertension (High BP)';
    bpColor = 'text-rose-700 bg-rose-50 border-rose-200';
    bpAdvice = 'High readings detected. Clinical evaluation by a cardiologist or medicine specialist is recommended.';
  } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    bpCategory = 'Stage 1 Hypertension';
    bpColor = 'text-amber-700 bg-amber-50 border-amber-200';
    bpAdvice = 'Lifestyle modifications recommended: reduce dietary salt, limit processed foods, and monitor readings daily.';
  } else if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    bpCategory = 'Elevated Blood Pressure';
    bpColor = 'text-amber-600 bg-amber-50 border-amber-200';
    bpAdvice = 'Readings are slightly above normal. Regular physical exercise and potassium-rich fruits will help normalize.';
  }

  // Calculate Daily Water Intake (approx 35ml per kg + 350ml per 30 mins workout)
  const dailyLiters = ((waterWeight * 0.033) + (activityMins / 30 * 0.35)).toFixed(1);
  const dailyGlasses = Math.round((dailyLiters * 1000) / 250);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold">
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Wellness Calculators</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Personal Health & Vitals Tools
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Quickly assess your body metrics, blood pressure status, and daily hydration requirements.
          </p>
        </div>

        {/* Tool Selector Tabs */}
        <div className="grid grid-cols-3 gap-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm max-w-lg mx-auto">
          <button
            onClick={() => setActiveTool('bmi')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTool === 'bmi'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>BMI Index</span>
          </button>

          <button
            onClick={() => setActiveTool('bp')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTool === 'bp'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Blood Pressure</span>
          </button>

          <button
            onClick={() => setActiveTool('water')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTool === 'water'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Droplet className="w-4 h-4" />
            <span>Hydration</span>
          </button>
        </div>

        {/* TOOL 1: BMI Calculator */}
        {activeTool === 'bmi' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-cyan-600" /> Body Mass Index (BMI) Calculator
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Weight:</span>
                  <span className="text-cyan-700">{weightKg} kg ({(weightKg * 2.20462).toFixed(1)} lbs)</span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="150"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Height:</span>
                  <span className="text-cyan-700">{heightCm} cm ({Math.floor(heightCm / 30.48)}' {Math.round((heightCm % 30.48) / 2.54)}")</span>
                </div>
                <input
                  type="range"
                  min="120"
                  max="215"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>
            </div>

            {/* BMI Result Display */}
            <div className={`p-6 rounded-2xl border text-center space-y-2 ${bmiColor}`}>
              <span className="text-xs uppercase font-bold tracking-wider">Your Body Mass Index</span>
              <div className="text-5xl font-black">{bmiValue}</div>
              <div className="text-base font-extrabold uppercase tracking-wide">{bmiCategory}</div>
              <p className="text-xs text-slate-600 max-w-md mx-auto pt-2">{bmiAdvice}</p>
            </div>
          </div>
        )}

        {/* TOOL 2: Blood Pressure Evaluator */}
        {activeTool === 'bp' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" /> Blood Pressure Evaluation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Systolic Pressure (Top Number)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold bg-slate-50 focus:bg-white"
                  />
                  <span className="text-xs text-slate-400 font-bold">mmHg</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Diastolic Pressure (Bottom Number)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold bg-slate-50 focus:bg-white"
                  />
                  <span className="text-xs text-slate-400 font-bold">mmHg</span>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border text-center space-y-2 ${bpColor}`}>
              <span className="text-xs uppercase font-bold tracking-wider">Evaluation Result</span>
              <div className="text-3xl font-black">{systolic} / {diastolic} mmHg</div>
              <div className="text-base font-extrabold">{bpCategory}</div>
              <p className="text-xs text-slate-600 max-w-md mx-auto pt-2">{bpAdvice}</p>
            </div>
          </div>
        )}

        {/* TOOL 3: Water Hydration Calculator */}
        {activeTool === 'water' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-cyan-600" /> Daily Water Intake Estimator
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Body Weight:</span>
                  <span className="text-cyan-700">{waterWeight} kg</span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="130"
                  value={waterWeight}
                  onChange={(e) => setWaterWeight(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Daily Exercise:</span>
                  <span className="text-cyan-700">{activityMins} minutes</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="15"
                  value={activityMins}
                  onChange={(e) => setActivityMins(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl border text-center space-y-2 bg-cyan-50 border-cyan-200 text-cyan-900">
              <span className="text-xs uppercase font-bold tracking-wider text-cyan-700">Recommended Daily Intake</span>
              <div className="text-5xl font-black text-cyan-800">{dailyLiters} Liters</div>
              <div className="text-base font-extrabold text-cyan-700">Approximately {dailyGlasses} glasses (250ml each)</div>
              <p className="text-xs text-cyan-800 max-w-md mx-auto pt-1">
                Drinking adequate water improves kidney filtration, boosts energy levels, and maintains healthy skin complexion.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HealthTools;
