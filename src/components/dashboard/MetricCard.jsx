import React, { useState } from 'react';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function MetricCard({ title, amount, percentage, isPositive, icon: Icon, color, infoTooltip, isCount }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const colorMap = {
    emerald: {
      bg: "bg-sky-500/10 dark:bg-sky-500/20",
      iconColor: "text-sky-600 dark:text-sky-400",
      badgeBg: "badge-income",
      barBg: "bg-sky-500"
    },
    rose: {
      bg: "bg-rose-500/10 dark:bg-rose-500/20",
      iconColor: "text-rose-600 dark:text-rose-400",
      badgeBg: "badge-expense",
      barBg: "bg-rose-500"
    },
    blue: {
      bg: "bg-sky-500/10 dark:bg-sky-500/20",
      iconColor: "text-sky-600 dark:text-sky-400",
      badgeBg: "badge-income",
      barBg: "bg-sky-500"
    },
    purple: {
      bg: "bg-purple-500/10 dark:bg-purple-500/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      badgeBg: "badge-ai",
      barBg: "bg-purple-500"
    },
    indigo: {
      bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      badgeBg: "badge-neutral",
      barBg: "bg-indigo-500"
    }
  };

  const style = colorMap[color] || colorMap.emerald;

  return (
    <div className="saas-card-interactive p-4 sm:p-5 space-y-3 relative">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl ${style.bg} ${style.iconColor} flex items-center justify-center font-extrabold shrink-0 border border-slate-200/50 dark:border-slate-700/50`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">{title}</span>
        </div>

        {infoTooltip && (
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1"
            >
              <Info className="w-3.5 h-3.5" />
            </button>

            {showTooltip && (
              <div className="absolute right-0 bottom-full mb-2 w-52 p-2.5 rounded-xl saas-card text-xs text-slate-900 dark:text-slate-100 shadow-2xl z-50 border border-slate-300 dark:border-slate-700 font-bold leading-relaxed">
                {infoTooltip}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Large High-Contrast Amount */}
      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
          {isCount ? amount : formatCurrency(amount, 'USD')}
        </h3>

        {percentage && (
          <div className="flex items-center gap-1 text-xs font-bold pt-0.5">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${style.badgeBg}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{percentage}</span>
            </span>
          </div>
        )}
      </div>

      {/* Mini Sparkline Bar Graphic */}
      <div className="pt-1 flex items-end gap-1 h-4">
        {[35, 50, 40, 65, 80, 55, 90, 75, 95, 85].map((val, idx) => (
          <div
            key={idx}
            className={`flex-1 rounded-t ${style.barBg} opacity-40 dark:opacity-60`}
            style={{ height: `${val}%` }}
          />
        ))}
      </div>

    </div>
  );
}
