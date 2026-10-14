import React from 'react';

export default function Badge({ status, variant, className = '' }) {
  // If variant is explicitly provided
  let styleClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  const normalized = (status || '').toLowerCase();

  if (variant === 'success' || normalized === 'active' || normalized === 'completed') {
    styleClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/70';
    dotColor = 'bg-emerald-500';
  } else if (variant === 'warning' || normalized === 'in progress' || normalized === 'pending') {
    styleClass = 'bg-amber-50 text-amber-700 border-amber-200/70';
    dotColor = 'bg-amber-500';
  } else if (variant === 'danger' || normalized === 'inactive' || normalized === 'cancelled') {
    styleClass = 'bg-rose-50 text-rose-700 border-rose-200/70';
    dotColor = 'bg-rose-500';
  } else if (variant === 'info' || normalized === 'admin') {
    styleClass = 'bg-blue-50 text-blue-700 border-blue-200/70';
    dotColor = 'bg-blue-500';
  } else if (normalized === 'sales rep' || normalized === 'sales_rep') {
    styleClass = 'bg-indigo-50 text-indigo-700 border-indigo-200/70';
    dotColor = 'bg-indigo-500';
  } else if (variant === 'gps' || normalized === 'browser gps' || normalized === 'genuine') {
    styleClass = 'bg-teal-50 text-teal-700 border-teal-200/70';
    dotColor = 'bg-teal-500';
  } else if (variant === 'demo' || normalized === 'simulated' || normalized === 'sample') {
    styleClass = 'bg-purple-50 text-purple-700 border-purple-200/70';
    dotColor = 'bg-purple-500';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styleClass} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0 animate-pulse`} />
      {status}
    </span>
  );
}
