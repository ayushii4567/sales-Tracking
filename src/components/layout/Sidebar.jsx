import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  Users,
  MapPin,
  ShoppingBag,
  CalendarCheck,
  PlayCircle,
  Clock,
  User,
  Shield,
  X,
  Compass,
  Settings
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { isAdmin, currentUser } = useAuth();
  const { getActiveVisitForEmployee } = useData();

  const activeVisit = !isAdmin && currentUser ? getActiveVisitForEmployee(currentUser.id) : null;

  const adminNav = [
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Sales Employees', path: '/admin/employees', icon: Users },
    { label: 'Visit Tracking', path: '/admin/visits', icon: MapPin },
    { label: 'Order Management', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Daily Summary', path: '/admin/daily-summary', icon: CalendarCheck },
    { label: 'Account Settings', path: '/admin/settings', icon: Settings }
  ];

  const employeeNav = [
    { label: 'My Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    {
      label: activeVisit ? 'Active Visit (Running)' : 'Start Visit (GPS)',
      path: '/employee/visit-action',
      icon: PlayCircle,
      badge: activeVisit ? 'Live' : null
    },
    { label: 'My Visit History', path: '/employee/visits', icon: Clock },
    { label: 'My Orders', path: '/employee/orders', icon: ShoppingBag },
    { label: 'Daily Summary', path: '/employee/daily-summary', icon: CalendarCheck },
    { label: 'My Profile', path: '/employee/profile', icon: User },
    { label: 'Account Settings', path: '/employee/settings', icon: Settings }
  ];

  const navItems = isAdmin ? adminNav : employeeNav;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#102B5C] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 bg-[#0C224B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2456D6] to-[#4F8CFF] flex items-center justify-center font-black text-sm text-white shadow-md shadow-blue-500/30">
              INS
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-wider text-white">
                  iNext Track
                </span>
                <span className="text-[9px] bg-[#2456D6] text-white font-mono font-semibold px-1 py-0.5 rounded">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-blue-200/80 tracking-tight">
                Thinking Beyond
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Badge Banner */}
        <div className="px-5 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#4F8CFF]" />
            <span className="text-slate-300 font-medium">Logged Role:</span>
          </div>
          <span className="font-bold text-[#4F8CFF] uppercase text-[11px] tracking-wider">
            {isAdmin ? 'Admin' : 'Sales Rep'}
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-blue-300/60">
            {isAdmin ? 'Management Navigation' : 'Field Operations'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#2456D6] text-white shadow-md shadow-blue-600/30 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/8'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-slate-900 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick GPS Status / Info Card */}
        <div className="p-4 border-t border-white/10 bg-[#0C224B]">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
            <div className="flex items-center gap-2 text-[#4F8CFF] font-bold text-[11px] mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>GPS Mode: Check-in/Out</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Records location only at check-in & check-out per quotation scope.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
