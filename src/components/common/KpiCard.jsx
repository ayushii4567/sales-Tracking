import React from 'react';
import { motion } from 'framer-motion';

export default function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'blue',
  onClick
}) {
  const schemeStyles = {
    blue: {
      iconBg: 'bg-blue-50 text-[#2456D6] border-blue-100',
      accent: 'border-l-[#2456D6]',
      gradient: 'from-blue-500/5 to-transparent'
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      accent: 'border-l-emerald-600',
      gradient: 'from-emerald-500/5 to-transparent'
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      accent: 'border-l-amber-500',
      gradient: 'from-amber-500/5 to-transparent'
    },
    navy: {
      iconBg: 'bg-indigo-50 text-[#102B5C] border-indigo-100',
      accent: 'border-l-[#102B5C]',
      gradient: 'from-indigo-500/5 to-transparent'
    }
  };

  const scheme = schemeStyles[colorScheme] || schemeStyles.blue;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`relative overflow-hidden bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${scheme.gradient} rounded-bl-full pointer-events-none`} />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl border ${scheme.iconBg} shadow-xs`}>
          {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
        <span>{subtitle}</span>
        {trend && (
          <span className="font-semibold text-emerald-600 flex items-center gap-1">
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
}
