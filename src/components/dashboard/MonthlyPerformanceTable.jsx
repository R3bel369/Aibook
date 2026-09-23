import React from 'react';
import { useFinancialData } from '../../context/FinancialDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';

export default function MonthlyPerformanceTable() {
  const { monthlySummary } = useFinancialData();
  const { user } = useAuth();

  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Statement Period Performance</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Statement accounting metrics ledger</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Period</th>
              <th className="py-3 px-4 text-right">Total Inflow</th>
              <th className="py-3 px-4 text-right">Total Outflow</th>
              <th className="py-3 px-4 text-right">Net Cash Flow</th>
              <th className="py-3 px-4 text-right">Surplus Ratio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-xs">
            {monthlySummary.map((row, idx) => {
              const margin = row.income > 0 ? ((row.profit / row.income) * 100).toFixed(1) : "0.0";
              const periodLabel = row.year ? `${row.month} ${row.year}` : row.month;
              return (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{periodLabel} Statement</td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(row.income, user.currency, true)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-rose-600 dark:text-rose-400">
                    -{formatCurrency(row.expenses, user.currency, true)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(row.profit, user.currency, true)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-600 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      {margin}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
