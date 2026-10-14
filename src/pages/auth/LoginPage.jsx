import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Briefcase,
  Compass,
  FileSpreadsheet
} from 'lucide-react';
import QuotationModal from '../../components/common/QuotationModal';
import { DEMO_ACCOUNTS, QUOTATION_INFO } from '../../data/seedData';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { employees } = useData();

  const [identifier, setIdentifier] = useState('INS001');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isQuotationOpen, setIsQuotationOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your Employee ID or registered email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(identifier, password, employees);
      setIsLoading(false);

      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/employee/dashboard', { replace: true });
        }
      } else {
        setErrorMessage(res.error || 'Authentication failed.');
      }
    }, 450);
  };

  const fillDemoAccount = (role) => {
    setErrorMessage('');
    if (role === 'admin') {
      setIdentifier(DEMO_ACCOUNTS.admin.id);
      setPassword(DEMO_ACCOUNTS.admin.defaultPassword);
    } else {
      setIdentifier(DEMO_ACCOUNTS.sales.id);
      setPassword(DEMO_ACCOUNTS.sales.defaultPassword);
    }
  };

  const instantLogin = (role) => {
    const creds = role === 'admin'
      ? { id: DEMO_ACCOUNTS.admin.id, pass: DEMO_ACCOUNTS.admin.defaultPassword }
      : { id: DEMO_ACCOUNTS.sales.id, pass: DEMO_ACCOUNTS.sales.defaultPassword };

    setIsLoading(true);
    setTimeout(() => {
      const res = login(creds.id, creds.pass, employees);
      setIsLoading(false);
      if (res.success) {
        if (role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/employee/dashboard', { replace: true });
        }
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1A3A] via-[#102B5C] to-[#183973] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#4F8CFF]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        {/* Left Side: Brand Story & Quotation Highlights */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#102B5C] to-[#1B4080] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3.5 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2456D6] to-[#4F8CFF] flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/30">
                INS
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-wide text-white">
                  iNext Software Solutions
                </h1>
                <p className="text-xs text-blue-200 tracking-wider">
                  Thinking Beyond • Pvt. Ltd.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-200 border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4F8CFF]" />
                Official Quotation Implementation
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Sales Visit Tracking & Order Management
              </h2>

              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                Streamline field sales team monitoring, check-in GPS verification, daily interaction remarks, and on-site order bookings with zero clutter.
              </p>
            </div>

            {/* Quotation highlights checklist */}
            <div className="mt-8 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automatic check-in / check-out GPS capture</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Separate Admin & Sales Employee control panels</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Date-wise summaries & employee performance</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Basic order entry & INR value monitoring</span>
              </div>
            </div>
          </div>

          {/* Quotation metadata button */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-blue-200">
            <div>
              <p className="font-mono text-[11px] text-white">Quotation: {QUOTATION_INFO.refNo}</p>
              <p className="text-[10px] text-blue-300">Raipur, Chhattisgarh</p>
            </div>
            <button
              onClick={() => setIsQuotationOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Scope Details
            </button>
          </div>
        </div>

        {/* Right Side: Login Form & One-Click Demo Launchers */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Sign In to Your Account
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Access your role-based sales management workspace
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#2456D6] border border-blue-100">
                Live Demo
              </span>
            </div>

            {/* Fast Demo Account Switcher Buttons */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>Select Demo Account Shortcut:</span>
                <span className="text-[10px] text-slate-400 font-normal">Click to prefill or launch</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('admin')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    identifier === 'INS001'
                      ? 'border-[#102B5C] bg-white shadow-sm ring-2 ring-blue-900/10'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#102B5C] flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#2456D6]" /> Admin Panel
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                      INS001
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Pass: Admin@123</p>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemoAccount('sales')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    identifier === 'EMP101'
                      ? 'border-[#2456D6] bg-white shadow-sm ring-2 ring-blue-500/10'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#2456D6] flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#2456D6]" /> Sales Rep Panel
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 font-bold text-[#2456D6]">
                      EMP101
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Pass: Sales@123</p>
                </button>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center justify-between"
              >
                <span>{errorMessage}</span>
                <button
                  onClick={() => setErrorMessage('')}
                  className="text-rose-400 hover:text-rose-700 font-bold ml-2"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Employee ID or Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. INS001 or EMP101"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-[#2456D6] bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setPassword(identifier === 'INS001' ? 'Admin@123' : 'Sales@123')}
                    className="text-[11px] text-[#2456D6] hover:underline font-semibold"
                  >
                    Reset default demo key
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-[#2456D6] bg-slate-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2456D6] focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-600">Remember demo session</span>
                </label>
                <span className="text-xs text-slate-400">Demo sandbox mode</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#102B5C] to-[#2456D6] hover:from-[#0C224B] hover:to-blue-700 shadow-md shadow-blue-900/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Instant Launch Pills */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">Direct 1-Click Login:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => instantLogin('admin')}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-xs transition-colors"
              >
                Instant Admin (INS001)
              </button>
              <button
                onClick={() => instantLogin('sales')}
                className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 font-bold text-[#2456D6] text-xs transition-colors"
              >
                Instant Sales (EMP101)
              </button>
            </div>
          </div>
        </div>
      </div>

      <QuotationModal isOpen={isQuotationOpen} onClose={() => setIsQuotationOpen(false)} />
    </div>
  );
}
