import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Drawer from '../../components/common/Drawer';
import Badge from '../../components/common/Badge';
import { formatINR, formatDate, formatCoordinates, getGoogleMapsUrl } from '../../utils/formatters';
import {
  MapPin,
  Search,
  Filter,
  ExternalLink,
  Clock,
  Eye,
  Calendar,
  User,
  ShoppingBag,
  Compass,
  MessageSquare,
  Navigation
} from 'lucide-react';

export default function VisitTrackingAdmin() {
  const { visits, employees, orders } = useData();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmpId, setSelectedEmpId] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Inspection Drawer
  const [activeInspectionVisit, setActiveInspectionVisit] = useState(null);

  // Unique dates from visits
  const uniqueDates = Array.from(new Set(visits.map((v) => v.date))).sort().reverse();

  // Filtered visits
  const filteredVisits = visits.filter((v) => {
    const matchesSearch =
      v.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.personMet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.remarks && v.remarks.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesEmp = selectedEmpId === 'All' ? true : v.employeeId === selectedEmpId;
    const matchesDate = selectedDate === 'All' ? true : v.date === selectedDate;
    const matchesStatus = selectedStatus === 'All' ? true : v.status === selectedStatus;

    return matchesSearch && matchesEmp && matchesDate && matchesStatus;
  });

  // Get order associated with inspected visit
  const inspectedOrder = activeInspectionVisit?.orderId
    ? orders.find((o) => o.id === activeInspectionVisit.orderId)
    : orders.find((o) => o.visitId === activeInspectionVisit?.id);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-4 h-4 text-[#2456D6]" />
            <span className="text-xs font-bold text-[#2456D6] uppercase tracking-wider">
              Field Verification & Geolocation
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#102B5C] tracking-tight">
            Visit Tracking Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verify sales representatives' on-site check-in coordinates, meeting times, and customer remarks.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl text-xs">
          <span className="font-semibold text-slate-500">Total Visits Found:</span>
          <span className="font-extrabold text-[#102B5C] text-sm">{filteredVisits.length}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer, rep, remarks..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#2456D6] bg-slate-50/50"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Employee Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Sales Reps</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.id})
                </option>
              ))}
            </select>
          </div>

          {/* Date Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Dates</option>
              {uniqueDates.map((d) => (
                <option key={d} value={d}>
                  {formatDate(d)}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visits Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">Customer / Shop Name</th>
                <th className="py-3.5 px-4">Sales Representative</th>
                <th className="py-3.5 px-4">Person Met</th>
                <th className="py-3.5 px-4">Date & Timings</th>
                <th className="py-3.5 px-4">GPS Check-In Location</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No visit records found for this filter.
                  </td>
                </tr>
              ) : (
                filteredVisits.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Customer */}
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900 text-sm">{v.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{v.id}</div>
                    </td>

                    {/* Sales Rep */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{v.employeeName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{v.employeeId}</div>
                    </td>

                    {/* Person met */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{v.personMet}</td>

                    {/* Date & Timings */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{formatDate(v.date)}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {v.startTime} {v.endTime ? `— ${v.endTime}` : '(In Progress)'}
                      </div>
                    </td>

                    {/* GPS Coordinates & Map Link */}
                    <td className="py-3.5 px-4">
                      {v.checkInLocation ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-700 font-mono text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-[#2456D6] shrink-0" />
                            <span>
                              {v.checkInLocation.latitude.toFixed(4)}, {v.checkInLocation.longitude.toFixed(4)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">
                              ±{v.checkInLocation.accuracy}m
                            </span>
                            <a
                              href={getGoogleMapsUrl(v.checkInLocation.latitude, v.checkInLocation.longitude)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-0.5 text-[#2456D6] hover:underline text-[10px] font-bold"
                            >
                              Map <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">GPS Unavailable</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <Badge status={v.status} />
                    </td>

                    {/* Inspection Button */}
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setActiveInspectionVisit(v)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-[#2456D6] font-bold text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visit Inspection Drawer */}
      <Drawer
        isOpen={!!activeInspectionVisit}
        onClose={() => setActiveInspectionVisit(null)}
        title="Field Visit Inspection Details"
      >
        {activeInspectionVisit && (
          <div className="space-y-6 text-xs">
            {/* Header Visit Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-slate-400 font-semibold">{activeInspectionVisit.id}</span>
                <Badge status={activeInspectionVisit.status} />
              </div>
              <h3 className="text-lg font-black text-slate-900">{activeInspectionVisit.customerName}</h3>
              <p className="text-slate-600 mt-0.5">Person Met: <span className="font-bold text-slate-800">{activeInspectionVisit.personMet}</span></p>
              <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-slate-500">
                <span>Field Rep: <strong className="text-slate-800">{activeInspectionVisit.employeeName}</strong></span>
                <span>Date: <strong className="text-slate-800">{formatDate(activeInspectionVisit.date)}</strong></span>
              </div>
            </div>

            {/* Timings */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2456D6]" /> Automatic Timestamps
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Check-In Time</p>
                  <p className="text-base font-extrabold text-slate-800 mt-0.5">{activeInspectionVisit.startTime}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Check-Out Time</p>
                  <p className="text-base font-extrabold text-slate-800 mt-0.5">
                    {activeInspectionVisit.endTime || 'Still In Progress'}
                  </p>
                </div>
              </div>
              {activeInspectionVisit.durationMinutes && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center font-bold">
                  Total Meeting Duration: {activeInspectionVisit.durationMinutes} Minutes
                </div>
              )}
            </div>

            {/* GPS Verification Section */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#2456D6]" /> Check-in & Check-out GPS Locations
              </h4>

              {/* Check-in location */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#2456D6]" /> Start Check-In Coordinates
                  </span>
                  <Badge
                    status={activeInspectionVisit.checkInLocation?.isSimulated ? 'Simulated Demo' : 'Browser GPS'}
                    variant={activeInspectionVisit.checkInLocation?.isSimulated ? 'demo' : 'gps'}
                  />
                </div>
                {activeInspectionVisit.checkInLocation ? (
                  <>
                    <p className="font-mono text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      Latitude: {activeInspectionVisit.checkInLocation.latitude.toFixed(6)} • Longitude: {activeInspectionVisit.checkInLocation.longitude.toFixed(6)}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Area: {activeInspectionVisit.checkInLocation.address || 'Raipur Commercial Zone'}</span>
                      <a
                        href={getGoogleMapsUrl(activeInspectionVisit.checkInLocation.latitude, activeInspectionVisit.checkInLocation.longitude)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-[#2456D6] hover:underline"
                      >
                        Open in Google Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-400">GPS location was not captured at check-in.</p>
                )}
              </div>

              {/* Check-out location */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> End Check-Out Coordinates
                  </span>
                  {activeInspectionVisit.checkOutLocation && (
                    <Badge
                      status={activeInspectionVisit.checkOutLocation.isSimulated ? 'Simulated Demo' : 'Browser GPS'}
                      variant={activeInspectionVisit.checkOutLocation.isSimulated ? 'demo' : 'gps'}
                    />
                  )}
                </div>
                {activeInspectionVisit.checkOutLocation ? (
                  <>
                    <p className="font-mono text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      Latitude: {activeInspectionVisit.checkOutLocation.latitude.toFixed(6)} • Longitude: {activeInspectionVisit.checkOutLocation.longitude.toFixed(6)}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Area: {activeInspectionVisit.checkOutLocation.address || 'Raipur Commercial Zone'}</span>
                      <a
                        href={getGoogleMapsUrl(activeInspectionVisit.checkOutLocation.latitude, activeInspectionVisit.checkOutLocation.longitude)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-[#2456D6] hover:underline"
                      >
                        Open in Google Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-400">Not recorded yet (Visit in progress or not captured).</p>
                )}
              </div>
            </div>

            {/* Remarks / Feedback */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#2456D6]" /> Customer Feedback & Notes
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                {activeInspectionVisit.remarks || 'No specific feedback notes entered.'}
              </div>
            </div>

            {/* Associated Order (if any) */}
            {inspectedOrder && (
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" /> Order Booked During Visit
                </h4>
                <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{inspectedOrder.productName}</span>
                    <span className="font-mono font-extrabold text-emerald-800 text-sm">
                      {formatINR(inspectedOrder.orderAmount)}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">Order ID: <code className="font-mono">{inspectedOrder.id}</code></p>
                  {inspectedOrder.notes && (
                    <p className="text-slate-500 text-[11px] italic">Notes: "{inspectedOrder.notes}"</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
