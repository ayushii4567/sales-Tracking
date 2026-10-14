import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatINR, formatDate } from '../../utils/formatters';
import Badge from '../../components/common/Badge';
import {
  CalendarCheck,
  Calendar,
  MapPin,
  ShoppingBag,
  IndianRupee,
  Clock,
  Printer,
  CheckCircle2
} from 'lucide-react';

export default function EmployeeDailySummary() {
  const { currentUser } = useAuth();
  const { visits, orders } = useData();

  const currentEmpId = currentUser?.id || 'EMP101';
  const [selectedDate, setSelectedDate] = useState('2026-10-14');

  const quickDates = [
    { label: 'Today (14 Oct)', value: '2026-10-14' },
    { label: 'Yesterday (13 Oct)', value: '2026-10-13' },
    { label: '12 Oct 2026', value: '2026-10-12' },
    { label: '11 Oct 2026', value: '2026-10-11' }
  ];

  // Personal records for this employee on the selected date
  const dayVisits = visits.filter(
    (v) => v.employeeId === currentEmpId && v.date === selectedDate
  );
  const dayCompleted = dayVisits.filter((v) => v.status === 'Completed');
  const dayOrders = orders.filter(
    (o) => o.employeeId === currentEmpId && o.orderDate === selectedDate
  );
  const dayTotalAmount = dayOrders.reduce(
    (sum, o) => sum + (Number(o.orderAmount) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck className="w-4 h-4 text-[#2456D6]" />
            <span className="text-xs font-bold text-[#2456D6] uppercase tracking-wider">
              Personal Performance Report
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#102B5C] tracking-tight">
            My Daily Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your daily customer visits completed and orders received for any selected date.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>Print Summary</span>
        </button>
      </div>

      {/* Date Picker Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Calendar className="w-4 h-4 text-[#2456D6]" />
          <span className="text-xs font-bold text-slate-600">Select Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#2456D6] bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {quickDates.map((qd) => (
            <button
              key={qd.value}
              onClick={() => setSelectedDate(qd.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDate === qd.value
                  ? 'bg-[#102B5C] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {qd.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards for the selected day */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-xs uppercase font-bold text-slate-400">Visits Conducted</p>
          <h3 className="text-3xl font-black text-[#102B5C] mt-2">{dayVisits.length}</h3>
          <p className="text-xs text-slate-500 mt-1">
            {dayCompleted.length} Completed • {dayVisits.length - dayCompleted.length} In Progress
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-xs uppercase font-bold text-slate-400">Orders Booked</p>
          <h3 className="text-3xl font-black text-slate-900 mt-2">{dayOrders.length}</h3>
          <p className="text-xs text-slate-500 mt-1">On-site client orders</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <p className="text-xs uppercase font-bold text-slate-400">Total Order Revenue</p>
          <h3 className="text-3xl font-black text-emerald-700 mt-2">{formatINR(dayTotalAmount)}</h3>
          <p className="text-xs text-slate-500 mt-1">For {formatDate(selectedDate)}</p>
        </div>
      </div>

      {/* Visits List on this day */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-[#102B5C]">
          Visits on {formatDate(selectedDate)}
        </h3>

        {dayVisits.length === 0 ? (
          <p className="text-slate-400 text-center py-6 text-xs">No visits logged on this day.</p>
        ) : (
          <div className="space-y-3">
            {dayVisits.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{v.customerName}</span>
                    <Badge status={v.status} />
                  </div>
                  <p className="text-slate-500 mt-0.5">Person Met: <strong className="text-slate-700">{v.personMet}</strong></p>
                  {v.remarks && <p className="text-slate-500 italic mt-1">"{v.remarks}"</p>}
                </div>
                <div className="text-left sm:text-right text-slate-400">
                  <span className="font-mono text-slate-700 font-bold block">{v.startTime} {v.endTime ? `— ${v.endTime}` : ''}</span>
                  {v.checkInLocation && (
                    <span className="text-[10px] text-[#2456D6] font-mono">
                      GPS: {v.checkInLocation.latitude.toFixed(4)}, {v.checkInLocation.longitude.toFixed(4)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Orders List on this day */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-[#102B5C]">
          Orders Booked on {formatDate(selectedDate)}
        </h3>

        {dayOrders.length === 0 ? (
          <p className="text-slate-400 text-center py-6 text-xs">No orders booked on this day.</p>
        ) : (
          <div className="space-y-3">
            {dayOrders.map((o) => (
              <div
                key={o.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{o.customerName}</span>
                  <p className="text-slate-600 mt-0.5">{o.productName}</p>
                </div>
                <span className="font-mono font-black text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
                  {formatINR(o.orderAmount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
