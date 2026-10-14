import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { formatINR, formatDate } from '../../utils/formatters';
import Badge from '../../components/common/Badge';
import {
  Calendar,
  CalendarCheck,
  MapPin,
  ShoppingBag,
  IndianRupee,
  Users,
  Printer,
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';

export default function DailySummaryAdmin() {
  const { visits, orders, employees } = useData();

  // Date picker state - defaults to today (2026-10-14)
  const [selectedDate, setSelectedDate] = useState('2026-10-14');

  // Quick dates options
  const quickDates = [
    { label: 'Today (14 Oct)', value: '2026-10-14' },
    { label: 'Yesterday (13 Oct)', value: '2026-10-13' },
    { label: '12 Oct 2026', value: '2026-10-12' },
    { label: '11 Oct 2026', value: '2026-10-11' },
    { label: '10 Oct 2026', value: '2026-10-10' }
  ];

  // Data for the selected date
  const dayVisits = visits.filter((v) => v.date === selectedDate);
  const dayCompletedVisits = dayVisits.filter((v) => v.status === 'Completed');
  const dayActiveVisits = dayVisits.filter((v) => v.status === 'In Progress');

  const dayOrders = orders.filter((o) => o.orderDate === selectedDate);
  const dayTotalOrderAmount = dayOrders.reduce((sum, o) => sum + (Number(o.orderAmount) || 0), 0);

  // Breakdown by employee on this specific date
  const employeeBreakdown = employees.map((emp) => {
    const empVisits = dayVisits.filter((v) => v.employeeId === emp.id);
    const empOrders = dayOrders.filter((o) => o.employeeId === emp.id);
    const revenue = empOrders.reduce((sum, o) => sum + (Number(o.orderAmount) || 0), 0);

    return {
      id: emp.id,
      name: emp.name,
      territory: emp.territory,
      status: emp.status,
      visitsCount: empVisits.length,
      completedVisits: empVisits.filter((v) => v.status === 'Completed').length,
      ordersCount: empOrders.length,
      revenue
    };
  }).filter((e) => e.visitsCount > 0 || e.ordersCount > 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck className="w-4 h-4 text-[#2456D6]" />
            <span className="text-xs font-bold text-[#2456D6] uppercase tracking-wider">
              Management Reporting
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#102B5C] tracking-tight">
            Daily Activity Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Consolidated daily report of field visits conducted and order values booked per quotation specs.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>Print / Export Summary</span>
        </button>
      </div>

      {/* Date Picker Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
            <Calendar className="w-4 h-4 text-[#2456D6]" />
            <span>Select Summary Date:</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#2456D6] bg-slate-50"
          />
        </div>

        {/* Quick Date Pills */}
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

      {/* Daily Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Total Visits</span>
            <div className="p-2 rounded-xl bg-blue-50 text-[#2456D6]">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-[#102B5C] mt-2">{dayVisits.length}</h3>
          <p className="text-xs text-slate-500 mt-1">
            {dayCompletedVisits.length} completed • {dayActiveVisits.length} in progress
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Total Orders</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-900 mt-2">{dayOrders.length}</h3>
          <p className="text-xs text-slate-500 mt-1">Booked during field client visits</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Total Order Amount</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-emerald-700 mt-2">{formatINR(dayTotalOrderAmount)}</h3>
          <p className="text-xs text-slate-500 mt-1">Revenue for {formatDate(selectedDate)}</p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Active Field Reps</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-indigo-950 mt-2">{employeeBreakdown.length}</h3>
          <p className="text-xs text-slate-500 mt-1">Reps active on this date</p>
        </div>
      </div>

      {/* Employee-wise Breakdown for the Selected Date */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#102B5C]">
              Employee Performance Breakdown for {formatDate(selectedDate)}
            </h3>
            <p className="text-xs text-slate-500">
              Individual representative contribution on this date
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {employeeBreakdown.length} Active Reps
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">Sales Representative</th>
                <th className="py-3.5 px-4">Territory</th>
                <th className="py-3.5 px-4 text-center">Visits Logged</th>
                <th className="py-3.5 px-4 text-center">Completed</th>
                <th className="py-3.5 px-4 text-center">Orders Received</th>
                <th className="py-3.5 px-5 text-right">Order Amount Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employeeBreakdown.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No field activity was recorded for {formatDate(selectedDate)}.
                  </td>
                </tr>
              ) : (
                employeeBreakdown.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900 text-sm">{row.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{row.id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{row.territory}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">{row.visitsCount}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {row.completedVisits}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                      {row.ordersCount}
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono font-bold text-emerald-700 text-sm">
                      {formatINR(row.revenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Visit Records for the Day */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6">
        <h3 className="text-base font-bold text-[#102B5C] mb-4 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#2456D6]" />
          Detailed Visit Logs for {formatDate(selectedDate)}
        </h3>

        {dayVisits.length === 0 ? (
          <p className="text-slate-400 text-center py-8 text-xs">No visit logs for this date.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dayVisits.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{v.customerName}</span>
                  <Badge status={v.status} />
                </div>
                <p className="text-slate-600">
                  Rep: <strong className="text-slate-800">{v.employeeName}</strong> • Met: <strong className="text-slate-800">{v.personMet}</strong>
                </p>
                <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                  <span>Timings: {v.startTime} {v.endTime ? `— ${v.endTime}` : ''}</span>
                  {v.checkInLocation && (
                    <span className="font-mono text-[#2456D6]">
                      GPS: {v.checkInLocation.latitude.toFixed(4)}, {v.checkInLocation.longitude.toFixed(4)}
                    </span>
                  )}
                </div>
                {v.remarks && (
                  <p className="text-slate-500 italic text-[11px] bg-white p-2 rounded-lg border border-slate-100">
                    "{v.remarks}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
