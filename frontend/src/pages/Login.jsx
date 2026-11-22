import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  Lock, 
  LogIn, 
  AlertCircle, 
  Sparkles, 
  User, 
  KeyRound, 
  ShieldCheck,
  Stethoscope,
  FlaskConical,
  Landmark,
  Eye,
  EyeOff
} from 'lucide-react';

const Login = ({ setActivePage }) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(identifier, password);
    setLoading(false);

    if (res.success) {
      const role = res.user.role;
      if (role === 'doctor') {
        setActivePage('doctor-portal');
      } else if (role === 'lab_staff') {
        setActivePage('lab-portal');
      } else if (role === 'accountant') {
        setActivePage('accounts-portal');
      } else if (role === 'admin') {
        setActivePage('admin');
      } else {
        setActivePage('patient-dashboard');
      }
    } else {
      setErrorMsg(res.message || 'Login failed. Please check your ID and password.');
    }
  };

  const fillDemo = (role) => {
    switch (role) {
      case 'admin':
        setIdentifier('admin@medicare.com');
        setPassword('admin123');
        break;
      case 'doctor':
        setIdentifier('D101');
        setPassword('doctor123');
        break;
      case 'lab':
        setIdentifier('L101');
        setPassword('lab123');
        break;
      case 'accounts':
        setIdentifier('A101');
        setPassword('account123');
        break;
      default:
        setIdentifier('P01');
        setPassword('patient123');
        break;
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-cyan-600/25">
            <HeartPulse className="w-8 h-8" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">
            MediCare Sign In
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Sign in with your auto-generated ID: <strong>P01, D101, L101, A101</strong>
          </p>
        </div>

        {/* 1-Click Demo Login Selector */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>1-Click Quick Demo Login:</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">Click to fill</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('patient')}
              className="px-3 py-2 bg-white hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 rounded-xl text-xs font-bold text-slate-700 hover:text-cyan-700 transition-all shadow-sm text-left flex items-center gap-2 group"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
              <div>
                <span className="block leading-tight">Patient</span>
                <span className="text-[10px] font-mono text-cyan-600 font-bold">ID: P01</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => fillDemo('doctor')}
              className="px-3 py-2 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl text-xs font-bold text-slate-700 hover:text-purple-700 transition-all shadow-sm text-left flex items-center gap-2 group"
            >
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <div>
                <span className="block leading-tight">Doctor</span>
                <span className="text-[10px] font-mono text-purple-600 font-bold">ID: D101</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => fillDemo('lab')}
              className="px-3 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 transition-all shadow-sm text-left flex items-center gap-2 group"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div>
                <span className="block leading-tight">Lab Staff</span>
                <span className="text-[10px] font-mono text-blue-600 font-bold">ID: L101</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => fillDemo('accounts')}
              className="px-3 py-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 transition-all shadow-sm text-left flex items-center gap-2 group"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div>
                <span className="block leading-tight">Accounts</span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">ID: A101</span>
              </div>
            </button>
          </div>

          <button
            type="button"
            onClick={() => fillDemo('admin')}
            className="w-full py-1.5 px-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-[11px] font-bold text-center transition-all flex items-center justify-center gap-2"
          >
            <span>Admin Demo: admin@medicare.com (admin123)</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-600" /> ID Number, Name, or Email *
              </span>
              <span className="text-[10px] text-slate-400 font-mono">P01, D101, L101, A101</span>
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. P01, P04, Akramul Hasan, or name@mail.com"
              className="w-full text-xs sm:text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-slate-400" /> Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs sm:text-sm pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-600/25 transition-all text-sm flex items-center justify-center gap-2 mt-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Sign In with ID'}
          </button>
        </form>

        {/* Link to Register */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an ID yet?{' '}
          <button
            onClick={() => setActivePage('register')}
            className="text-cyan-600 hover:text-cyan-700 font-bold underline ml-1"
          >
            Register to Get ID (P01, D101, L101, A101)
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
