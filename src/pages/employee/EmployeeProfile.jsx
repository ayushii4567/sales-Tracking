import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Badge from '../../components/common/Badge';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  ShoppingBag,
  Award,
  Key,
  LogOut,
  PlayCircle,
  Settings
} from 'lucide-react';

export default function EmployeeProfile() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { visits, orders } = useData();

  const currentEmpId = currentUser?.id || 'EMP101';

  const personalVisits = visits.filter((v) => v.employeeId === currentEmpId);
  const completedVisits = personalVisits.filter((v) => v.status === 'Completed');
  const personalOrders = orders.filter((o) => o.employeeId === currentEmpId);
  const totalRevenue = personalOrders.reduce((sum, o) => sum + (Number(o.orderAmount) || 0), 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-[#2456D6]/20 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {currentUser?.name}
              </h2>
              <Badge status="Active" variant="success" />
            </div>
            <p className="text-xs font-mono font-bold text-slate-400">
              EMPLOYEE ID: {currentUser?.id}
            </p>
            <p className="text-xs font-semibold text-[#2456D6] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {currentUser?.territory || 'Raipur Central Market & Pandri'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate('/employee/visit-action')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-[#2456D6] hover:bg-blue-700 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" /> Start Visit
          </button>
          <button
            onClick={() => navigate('/employee/settings')}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-500" /> Account Settings
          </button>
          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Lifetime Performance Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Field Visits</p>
          <p className="text-2xl font-black text-[#102B5C] mt-1">{personalVisits.length}</p>
          <span className="text-[10px] text-slate-500">Lifetime</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Completed Visits</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{completedVisits.length}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Verified GPS</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Orders Booked</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{personalOrders.length}</p>
          <span className="text-[10px] text-slate-500">Client Orders</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Sales Value</p>
          <p className="text-lg font-black text-indigo-900 mt-1">{formatINR(totalRevenue)}</p>
          <span className="text-[10px] text-indigo-600 font-semibold">Total Revenue</span>
        </div>
      </div>

      {/* Personal Contact & Account Details */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#102B5C] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2456D6]" />
            Account & Authentication Info
          </h3>
          <button
            onClick={() => navigate('/employee/settings')}
            className="text-xs font-bold text-[#2456D6] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" /> Edit Profile Details
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Registered Email
            </span>
            <p className="font-bold text-slate-800 text-xs">{currentUser?.email}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Mobile Number
            </span>
            <p className="font-bold text-slate-800 text-xs">{currentUser?.phone || '+91 98271 44521'}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-slate-400" /> Password Security
            </span>
            <p className="font-mono font-bold text-slate-800 text-xs">•••••••••••• (Encrypted)</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date of Joining
            </span>
            <p className="font-bold text-slate-800 text-xs">15 Nov 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
