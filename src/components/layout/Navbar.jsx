import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Menu,
  RotateCcw,
  Calendar,
  LogOut,
  UserCheck,
  Briefcase,
  ChevronDown,
  Settings
} from 'lucide-react';
import Badge from '../common/Badge';

export default function Navbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const { currentUser, logout, switchDemoRole, isAdmin } = useAuth();
  const { selectedDate, setSelectedDate, resetDemoData } = useData();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const availableDates = [
    { label: "Today (14 Oct)", value: '2026-10-14' },
    { label: "Yesterday (13 Oct)", value: '2026-10-13' },
    { label: "12 Oct 2026", value: '2026-10-12' },
    { label: "11 Oct 2026", value: '2026-10-11' },
    { label: "All Dates", value: 'all' }
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger & breadcrumb/title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-400 hidden sm:inline">
                iNext Solutions
              </span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <div className="flex items-center gap-2.5">
                <span className="text-base font-bold text-slate-800">
                  {isAdmin ? 'Admin Management Portal' : 'Sales Field Portal'}
                </span>
                <Badge
                  status={isAdmin ? 'Admin' : 'Sales Rep'}
                  variant={isAdmin ? 'info' : 'sales_rep'}
                />
              </div>
            </div>
          </div>

          {/* Right: Date selector, Reset, Role switcher, User profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Date filter dropdown */}
            <div className="relative hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm text-slate-700">
              <Calendar className="w-4 h-4 text-[#2456D6]" />
              <span className="font-semibold text-slate-500">Filter:</span>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer text-sm"
              >
                {availableDates.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Demo Data button */}
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset Demo Data to Initial Seed"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span className="hidden xl:inline">Reset Demo</span>
            </button>

            {/* Role switch toggle pill for fast client presentation */}
            <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-sm">
              <button
                onClick={() => switchDemoRole('admin')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  isAdmin
                    ? 'bg-white text-[#102B5C] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => switchDemoRole('sales')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  !isAdmin
                    ? 'bg-white text-[#2456D6] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sales Rep
              </button>
            </div>

            {/* User Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-left cursor-pointer"
              >
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/20"
                />
                <div className="hidden sm:block text-sm">
                  <p className="font-bold text-slate-900 leading-tight">
                    {currentUser?.name}
                  </p>
                  <p className="text-slate-400 text-xs uppercase font-mono">
                    {currentUser?.id}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">{currentUser?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                    <div className="mt-1.5">
                      <span className="text-xs bg-blue-50 text-[#2456D6] px-2 py-0.5 rounded-md font-semibold">
                        {currentUser?.designation || currentUser?.role}
                      </span>
                    </div>
                  </div>

                  <div className="py-1 border-b border-slate-100">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate(isAdmin ? '/admin/settings' : '/employee/settings');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:text-[#2456D6] hover:bg-blue-50/50 flex items-center gap-2.5 font-semibold cursor-pointer transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>Account Settings</span>
                    </button>
                  </div>

                  <div className="py-1.5">
                    <div className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Demo Role
                    </div>
                    <button
                      onClick={() => switchDemoRole('admin')}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                        isAdmin ? 'font-bold text-[#102B5C] bg-blue-50/40' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[#2456D6]" /> Login as Admin (INS001)
                      </span>
                      {isAdmin && <span className="text-emerald-600 text-sm font-bold">✓</span>}
                    </button>
                    <button
                      onClick={() => switchDemoRole('sales')}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                        !isAdmin ? 'font-bold text-[#2456D6] bg-blue-50/40' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-indigo-600" /> Login as Sales Rep (EMP101)
                      </span>
                      {!isAdmin && <span className="text-emerald-600 text-sm font-bold">✓</span>}
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1.5 mt-1">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 font-semibold hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h4 className="text-base font-bold text-slate-900 mb-2">Reset Demo Data?</h4>
            <p className="text-sm text-slate-600 mb-5">
              This will reset all visits, orders, and employee changes back to the initial demo seed data.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-[#102B5C] hover:bg-blue-900 text-white shadow-xs cursor-pointer"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
