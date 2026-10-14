import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import KpiCard from '../../components/common/KpiCard';
import Badge from '../../components/common/Badge';
import { formatINR, formatDate, getGoogleMapsUrl } from '../../utils/formatters';
import {
  MapPin,
  ShoppingBag,
  IndianRupee,
  Clock,
  PlayCircle,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  Calendar,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { visits, orders, getActiveVisitForEmployee, selectedDate, setSelectedDate } = useData();

  const currentEmpId = currentUser?.id || 'EMP101';

  // Personal active visit (Rahul Verma or logged-in rep)
  const activeVisit = getActiveVisitForEmployee(currentEmpId);

  // Live timer state for active visit
  const [elapsedTimer, setElapsedTimer] = useState('00:00');

  useEffect(() => {
    if (!activeVisit) return;

    const interval = setInterval(() => {
      try {
        const [time, modifier] = activeVisit.startTime.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const startD = new Date();
        startD.setHours(hours, minutes, 0, 0);

        const diffSecs = Math.max(0, Math.floor((new Date() - startD) / 1000));
        const hrs = Math.floor(diffSecs / 3600);
        const mins = Math.floor((diffSecs % 3600) / 60);
        const secs = diffSecs % 60;

        if (hrs > 0) {
          setElapsedTimer(`${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
        } else {
          setElapsedTimer(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
        }
      } catch {
        setElapsedTimer('Active');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeVisit]);

  // Personal visits & orders filtered by employee identity
  const personalVisits = visits.filter((v) => v.employeeId === currentEmpId);
  const personalOrders = orders.filter((o) => o.employeeId === currentEmpId);

  // Today's personal records (2026-10-14)
  const todayVisits = personalVisits.filter((v) => v.date === '2026-10-14');
  const todayCompletedVisits = todayVisits.filter((v) => v.status === 'Completed');
  const todayOrders = personalOrders.filter((o) => o.orderDate === '2026-10-14');
  const todayOrderAmount = todayOrders.reduce((sum, o) => sum + (Number(o.orderAmount) || 0), 0);

  // Total Lifetime personal records
  const totalPersonalRevenue = personalOrders.reduce((sum, o) => sum + (Number(o.orderAmount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome & Territory Banner */}
      <div className="bg-gradient-to-r from-[#102B5C] via-[#1B4080] to-[#2456D6] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                Field Sales Representative
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Hello, {currentUser?.name}!
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#4F8CFF]" />
              Assigned Territory: <strong className="text-white">{currentUser?.territory || 'Raipur Central Market'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-white">
              ID: {currentUser?.id}
            </span>
          </div>
        </div>
      </div>

      {/* ACTIVE VISIT BANNER (Prominent Card) */}
      {activeVisit ? (
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border-2 border-amber-400/80 rounded-3xl p-6 shadow-md relative overflow-hidden animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white animate-pulse">
                  <PlayCircle className="w-3.5 h-3.5" /> Visit In Progress
                </span>
                <span className="font-mono font-bold text-xs text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                  Elapsed: {elapsedTimer}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {activeVisit.customerName}
              </h3>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600">
                <span>Person Met: <strong className="text-slate-800">{activeVisit.personMet}</strong></span>
                <span>•</span>
                <span>Started At: <strong className="text-slate-800">{activeVisit.startTime}</strong></span>
                {activeVisit.checkInLocation && (
                  <>
                    <span>•</span>
                    <a
                      href={getGoogleMapsUrl(activeVisit.checkInLocation.latitude, activeVisit.checkInLocation.longitude)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#2456D6] hover:underline font-bold flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3" /> Check-in GPS Coordinates <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Quick Action to End or Inspect Visit */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/employee/visit-action')}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl font-black text-xs text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete / End Visit Now</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* START VISIT CTA CARD */
        <div className="bg-white border border-blue-200/80 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-[#2456D6] flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#102B5C]">
                Ready for your next client visit?
              </h3>
              <p className="text-xs text-slate-500">
                Automatic GPS check-in & time recording per quotation workflow.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/employee/visit-action')}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs text-white bg-[#2456D6] hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Start Visit (Check-In GPS)</span>
          </button>
        </div>
      )}

      {/* KPI Cards Grid (Exact Quotation Module 5 Scope) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Today's Visits"
          value={todayVisits.length}
          subtitle={`${todayCompletedVisits.length} Completed • ${activeVisit ? '1 Active' : 'None Active'}`}
          icon={MapPin}
          colorScheme="blue"
          trend="Today"
          onClick={() => navigate('/employee/visits')}
        />
        <KpiCard
          title="Total Orders"
          value={personalOrders.length}
          subtitle={`${todayOrders.length} Booked Today`}
          icon={ShoppingBag}
          colorScheme="amber"
          trend="Orders"
          onClick={() => navigate('/employee/orders')}
        />
        <KpiCard
          title="Total Order Amount"
          value={formatINR(totalPersonalRevenue)}
          subtitle={`${formatINR(todayOrderAmount)} Booked Today`}
          icon={IndianRupee}
          colorScheme="emerald"
          trend="INR Value"
          onClick={() => navigate('/employee/orders')}
        />
        <KpiCard
          title="Previous Visits"
          value={personalVisits.filter((v) => v.status === 'Completed').length}
          subtitle={`${personalVisits.length} Total Visits Logged`}
          icon={Clock}
          colorScheme="navy"
          trend="History"
          onClick={() => navigate('/employee/visits')}
        />
      </div>

      {/* Quick Action Tiles for Field Reps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <Link
          to="/employee/visit-action"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2456D6] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <PlayCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-[#2456D6]">
              {activeVisit ? 'End Active Visit' : 'Start Visit'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">GPS location check-in/out</p>
          </div>
        </Link>

        <Link
          to="/employee/orders"
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700">
              Book Order
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Record customer order</p>
          </div>
        </Link>

        <Link
          to="/employee/daily-summary"
          className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-700">
              Daily Summary
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">My date-wise report</p>
          </div>
        </Link>
      </div>

      {/* Two Column Section: Personal Recent Visits & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Recent Visits */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#102B5C] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2456D6]" />
                  My Recent Visits
                </h3>
                <p className="text-xs text-slate-500">Your logged customer visits</p>
              </div>
              <Link to="/employee/visits" className="text-xs font-bold text-[#2456D6] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {personalVisits.slice(0, 4).map((v) => (
                <div
                  key={v.id}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{v.customerName}</span>
                      <Badge status={v.status} />
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Person Met: <span className="font-semibold text-slate-700">{v.personMet}</span>
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{formatDate(v.date)}</span>
                      <span>•</span>
                      <span>{v.startTime} {v.endTime ? `— ${v.endTime}` : ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personal Recent Orders */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#102B5C] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#2456D6]" />
                  My Orders Booked
                </h3>
                <p className="text-xs text-slate-500">Orders placed under your account</p>
              </div>
              <Link to="/employee/orders" className="text-xs font-bold text-[#2456D6] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {personalOrders.slice(0, 4).map((o) => (
                <div
                  key={o.id}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">{o.customerName}</div>
                    <p className="text-slate-600 text-[11px] line-clamp-1">{o.productName}</p>
                    <p className="text-slate-400 text-[10px]">{formatDate(o.orderDate)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100 inline-block">
                      {formatINR(o.orderAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
