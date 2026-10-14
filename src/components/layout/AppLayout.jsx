import React, { useState } from 'react';
import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ToastContainer from '../common/Toast';
import { LayoutDashboard, PlayCircle, ShoppingBag, Clock, User } from 'lucide-react';

export default function AppLayout() {
  const { isAuthenticated, isSales, currentUser } = useAuth();
  const { getActiveVisitForEmployee } = useData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const activeVisit = isSales && currentUser ? getActiveVisitForEmployee(currentUser.id) : null;

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#172033] flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Quick-Action Bar for Sales Employee */}
      {isSales && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
          <Link
            to="/employee/dashboard"
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-2 rounded-lg transition-colors ${
              location.pathname === '/employee/dashboard'
                ? 'text-[#2456D6]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/employee/visit-action"
            className={`relative -top-3 flex flex-col items-center justify-center w-14 h-14 rounded-full shadow-lg border-2 border-white text-white font-bold transition-transform active:scale-95 ${
              activeVisit
                ? 'bg-amber-500 shadow-amber-500/40 animate-bounce'
                : 'bg-[#2456D6] shadow-blue-600/40'
            }`}
            title={activeVisit ? 'End Running Visit' : 'Start New Visit'}
          >
            <PlayCircle className="w-6 h-6" />
          </Link>

          <Link
            to="/employee/visits"
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-2 rounded-lg transition-colors ${
              location.pathname === '/employee/visits'
                ? 'text-[#2456D6]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span>Visits</span>
          </Link>

          <Link
            to="/employee/orders"
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-2 rounded-lg transition-colors ${
              location.pathname === '/employee/orders'
                ? 'text-[#2456D6]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Orders</span>
          </Link>

          <Link
            to="/employee/profile"
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold py-1 px-2 rounded-lg transition-colors ${
              location.pathname === '/employee/profile'
                ? 'text-[#2456D6]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
        </div>
      )}

      {/* Global Toast Notification System */}
      <ToastContainer />
    </div>
  );
}
