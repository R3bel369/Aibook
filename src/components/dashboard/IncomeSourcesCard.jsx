import React from 'react';
import { useFinancialData } from '../../context/FinancialDataContext';
import { formatCurrency } from '../../utils/formatters';

export default function IncomeSourcesCard() {
  const { transactions, financialTotals } = useFinancialData();

  const incomeTx = transactions.filter(t => (t.credit || 0) > 0);
  const totalIncome = financialTotals.totalIncome || 5725.00;

  // Aggregate by category
  const categoryMap = {};
  incomeTx.forEach(t => {
    const cat = t.category || "Other Income";
    categoryMap[cat] = (categoryMap[cat] || 0) + Number(t.credit || 0);
  });

  const sources = Object.entries(categoryMap).map(([cat, amt]) => ({
    name: cat,
    amount: amt,
    percentage: totalIncome > 0 ? Math.round((amt / totalIncome) * 100) : 0
  })).sort((a, b) => b.amount - a.amount);

  return (
    <div className="saas-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Income Sources Breakdown
          </h3>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Revenue channels extracted from statement credits</p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-black badge-income">
          {sources.length} Channels
        </span>
      </div>

      <div className="space-y-4 pt-2">
        {sources.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 font-bold">No income credits extracted in active statement.</div>
        ) : (
          sources.map((src, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900 dark:text-slate-100">{src.name}</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-black text-sky-600 dark:text-sky-400">
                    +{formatCurrency(src.amount, 'USD')}
                  </span>
                  <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-400">({src.percentage}%)</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700/80 overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(src.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
