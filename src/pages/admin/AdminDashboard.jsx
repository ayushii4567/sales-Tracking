import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import KpiCard from '../../components/common/KpiCard';
import Badge from '../../components/common/Badge';
import { formatINR, formatDate, getGoogleMapsUrl } from '../../utils/formatters';
import {
  Users,
  MapPin,
  ShoppingBag,
  IndianRupee,
  Calendar,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    employees,
    visits,
    orders,
    selectedDate,
    setSelectedDate,
    getFilteredData
  } = useData();

  const {
    filteredVisits,
    filteredOrders,
    totalEmployeesCount,
    totalVisitsCount,
    completedVisitsCount,
    activeVisitsCount,
    totalOrdersCount,
    totalOrderAmount
  } = getFilteredData(selectedDate);

  // Available dates for filter selection
  const filterOptions = [
    { label: "Today (14 Oct)", value: '2026-10-14' },
    { label: "Yesterday (13 Oct)", value: '2026-10-13' },
    { label: "12 Oct 2026", value: '2026-10-12' },
    { label: "11 Oct 2026", value: '2026-10-11' },
    { label: "All Dates", value: 'all' }
  ];

  // Employee-wise performance aggregation based on selected date filter
  const employeePerformance = employees.map((emp) => {
    const empVisits = filteredVisits.filter((v) => v.employeeId === emp.id);
    const empCompletedVisits = empVisits.filter((v) => v.status === 'Completed').length;
    const empOrders = filteredOrders.filter((o) => o.employeeId === emp.id);
    const empRevenue = empOrders.reduce((acc, o) => acc + (Number(o.orderAmount) || 0), 0);

    return {
      id: emp.id,
      name: emp.name,
      territory: emp.territory,
      status: emp.status,
      visitsCount: empVisits.length,
      completedVisits: empCompletedVisits,
      ordersCount: empOrders.length,
      totalRevenue: empRevenue
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Quick Date Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Management Portal
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#102B5C] tracking-tight">
            Admin Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Overview of field sales visits, employee activities, and client orders.
          </p>
        </div>

        {/* Date Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedDate(opt.value)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedDate === opt.value
                    ? 'bg-[#102B5C] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KpiCard
          title="Total Employees"
          value={totalEmployeesCount}
          subtitle={`${employees.length} Total Registered`}
          icon={Users}
          colorScheme="blue"
          trend={`${totalEmployeesCount} Active`}
          onClick={() => navigate('/admin/employees')}
        />
        <KpiCard
          title="Total Visits"
          value={totalVisitsCount}
          subtitle={`${completedVisitsCount} Completed • ${activeVisitsCount} In Progress`}
          icon={MapPin}
          colorScheme="emerald"
          trend={activeVisitsCount > 0 ? `${activeVisitsCount} Live Now` : 'Completed'}
          onClick={() => navigate('/admin/visits')}
        />
        <KpiCard
          title="Total Orders"
          value={totalOrdersCount}
          subtitle={`Across ${new Set(filteredOrders.map((o) => o.customerName)).size} Unique Clients`}
          icon={ShoppingBag}
          colorScheme="amber"
          trend={`${totalVisitsCount > 0 ? Math.round((totalOrdersCount / totalVisitsCount) * 100) : 0}% Conv.`}
          onClick={() => navigate('/admin/orders')}
        />
        <KpiCard
          title="Total Order Amount"
          value={formatINR(totalOrderAmount)}
          subtitle={selectedDate === 'all' ? 'All-Time Revenue' : `For ${formatDate(selectedDate)}`}
          icon={IndianRupee}
          colorScheme="navy"
          trend="INR Currency"
          onClick={() => navigate('/admin/orders')}
        />
      </div>

      {/* Employee-wise Performance Table (Quotation Module 1) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#102B5C]">
              Employee-wise Monitoring & Performance
            </h3>
            <p className="text-xs text-slate-500">
              Breakdown of visits conducted, completion status, and order revenue generated.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/employees')}
            className="text-xs font-bold text-[#2456D6] hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            Manage All Employees <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-100 text-xs">
              <tr>
                <th className="py-3.5 px-5">Employee</th>
                <th className="py-3.5 px-4">Territory</th>
                <th className="py-3.5 px-4 text-center">Visits (Total)</th>
                <th className="py-3.5 px-4 text-center">Completed</th>
                <th className="py-3.5 px-4 text-center">Orders Booked</th>
                <th className="py-3.5 px-4 text-right">Total Order Value</th>
                <th className="py-3.5 px-5 text-center">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employeePerformance.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-slate-900 text-sm">{emp.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{emp.id}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">{emp.territory}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {emp.visitsCount}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      {emp.completedVisits}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-slate-700">
                    {emp.ordersCount}
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                    {formatINR(emp.totalRevenue)}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <Badge status={emp.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Columns: Recent Visits & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Visits Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#102B5C] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2456D6]" />
                  Recent Field Visits
                </h3>
                <p className="text-xs text-slate-500">
                  Last recorded visit interactions & GPS check-ins
                </p>
              </div>
              <button
                onClick={() => navigate('/admin/visits')}
                className="text-xs font-bold text-[#2456D6] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {filteredVisits.slice(0, 5).map((v) => (
                <div
                  key={v.id}
                  className="p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-all flex items-start justify-between gap-3 text-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{v.customerName}</span>
                      <Badge status={v.status} />
                    </div>
                    <p className="text-slate-600 text-xs">
                      Person: <span className="text-slate-800 font-medium">{v.personMet}</span> • Rep: <span className="text-slate-800 font-semibold">{v.employeeName}</span>
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {v.startTime} {v.endTime ? `— ${v.endTime}` : '(Ongoing)'}
                      </span>
                      {v.checkInLocation && (
                        <a
                          href={getGoogleMapsUrl(v.checkInLocation.latitude, v.checkInLocation.longitude)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[#2456D6] hover:underline font-semibold"
                          title="Open GPS in Google Maps"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Map Link
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#102B5C] flex items-center gap-2">
                  <ShoppingBag className="w-4.5 h-4.5 text-[#2456D6]" />
                  Recent Orders Received
                </h3>
                <p className="text-xs text-slate-500">
                  On-site customer orders booked during field visits
                </p>
              </div>
              <button
                onClick={() => navigate('/admin/orders')}
                className="text-xs font-bold text-[#2456D6] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {filteredOrders.slice(0, 5).map((o) => (
                <div
                  key={o.id}
                  className="p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-all flex items-start justify-between gap-3 text-sm"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">{o.customerName}</div>
                    <p className="text-slate-600 text-xs line-clamp-1">{o.productName}</p>
                    <p className="text-slate-400 text-xs">
                      Booked by: <span className="text-slate-800 font-semibold">{o.employeeName}</span> • {formatDate(o.orderDate)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-extrabold text-sm text-[#102B5C] bg-blue-50/70 px-2.5 py-1 rounded-lg border border-blue-100/60 inline-block">
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
