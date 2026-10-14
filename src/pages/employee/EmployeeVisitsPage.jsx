import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Badge from '../../components/common/Badge';
import { formatDate, formatCoordinates, getGoogleMapsUrl } from '../../utils/formatters';
import {
  MapPin,
  Clock,
  Search,
  Calendar,
  ExternalLink,
  MessageSquare,
  Compass
} from 'lucide-react';

export default function EmployeeVisitsPage() {
  const { currentUser } = useAuth();
  const { visits } = useData();

  const currentEmpId = currentUser?.id || 'EMP101';

  // Personal records only
  const personalVisits = visits.filter((v) => v.employeeId === currentEmpId);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('All');

  const uniqueDates = Array.from(new Set(personalVisits.map((v) => v.date))).sort().reverse();

  const filteredVisits = personalVisits.filter((v) => {
    const matchesSearch =
      v.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.personMet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.remarks && v.remarks.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDate = selectedDate === 'All' ? true : v.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#102B5C] tracking-tight">
            My Field Visit History
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personal chronological record of customer visits, timings, and verified GPS coordinates.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-slate-700 self-start sm:self-auto">
          {personalVisits.length} Lifetime Visits
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer, person met, notes..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#2456D6] bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Visit Dates</option>
            {uniqueDates.map((d) => (
              <option key={d} value={d}>
                {formatDate(d)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visits Cards Grid */}
      <div className="space-y-3">
        {filteredVisits.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200 text-xs">
            No visits found matching your search.
          </div>
        ) : (
          filteredVisits.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-blue-200 hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    {v.customerName}
                  </h3>
                  <Badge status={v.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span>{formatDate(v.date)}</span>
                  <span>•</span>
                  <span>{v.startTime} {v.endTime ? `— ${v.endTime}` : ''}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Person Met</span>
                  <span className="font-bold text-slate-800">{v.personMet}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Check-in Location</span>
                  {v.checkInLocation ? (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-700 text-[11px]">
                        {v.checkInLocation.latitude.toFixed(4)}, {v.checkInLocation.longitude.toFixed(4)}
                      </span>
                      <a
                        href={getGoogleMapsUrl(v.checkInLocation.latitude, v.checkInLocation.longitude)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#2456D6] hover:underline font-bold text-[10px] flex items-center gap-0.5"
                      >
                        Google Map <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  ) : (
                    <span className="text-slate-400">GPS not available</span>
                  )}
                </div>
              </div>

              {v.remarks && (
                <div className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-100 flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>"{v.remarks}"</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
