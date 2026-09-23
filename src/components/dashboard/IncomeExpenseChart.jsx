import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useFinancialData } from '../../context/FinancialDataContext';
import { formatCurrency } from '../../utils/formatters';

export default function IncomeExpenseChart() {
  const { monthlySummary } = useFinancialData();

  return (
    <div className="saas-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Income vs Expenses</h3>
          <p className="text-xs text-slate-500">Monthly breakdown of incoming revenue and outgoing operational costs</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" />
            <span className="text-slate-700 dark:text-slate-300">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="text-slate-700 dark:text-slate-300">Expenses</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlySummary} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.3} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `$${v/1000}k`} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="saas-card p-3 shadow-xl text-xs space-y-1">
                      <div className="font-bold text-slate-900 dark:text-white">{label} Performance</div>
                      <div className="text-sky-600 dark:text-sky-400 font-bold">Income: {formatCurrency(payload[0].value, 'USD')}</div>
                      <div className="text-rose-600 dark:text-rose-400 font-bold">Expenses: {formatCurrency(payload[1].value, 'USD')}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="income" fill="#0284c7" radius={[6, 6, 0, 0]} maxBarSize={32} />
            <Bar dataKey="expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
