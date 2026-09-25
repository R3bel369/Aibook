import React, { useState } from 'react';
import {
  PieChart,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  DollarSign,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Scale
} from 'lucide-react';
import { useFinancialData } from '../context/FinancialDataContext';

const BUDGET_CATEGORIES = [
  { id: 'cat_software', name: 'Software & Cloud Ops', budget: 1500, actual: 1845.20, icon: '☁️', color: 'bg-rose-500' },
  { id: 'cat_payroll', name: 'Payroll & Contractor Fees', budget: 8500, actual: 7800.00, icon: '👥', color: 'bg-emerald-500' },
  { id: 'cat_marketing', name: 'Marketing & Ad Spend', budget: 2000, actual: 2450.00, icon: '📢', color: 'bg-rose-500' },
  { id: 'cat_office', name: 'Office, Hardware & Utilities', budget: 1200, actual: 950.00, icon: '🏢', color: 'bg-emerald-500' },
  { id: 'cat_travel', name: 'Travel & Meals', budget: 800, actual: 1120.50, icon: '✈️', color: 'bg-amber-500' },
  { id: 'cat_legal', name: 'Legal, Compliance & Tax', budget: 1000, actual: 600.00, icon: '⚖️', color: 'bg-emerald-500' }
];

export default function BudgetVariancePage() {
  const [categories, setCategories] = useState(BUDGET_CATEGORIES);
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [reallocationPercent, setReallocationPercent] = useState(10);

  const totalBudget = categories.reduce((sum, c) => sum + c.budget, 0);
  const totalActual = categories.reduce((sum, c) => sum + c.actual, 0);
  const overallVariance = totalActual - totalBudget;
  const isOverTotal = overallVariance > 0;

  const handleBudgetChange = (id, newBudget) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, budget: Number(newBudget) } : c));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="saas-card p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-black">
              <Scale className="w-3.5 h-3.5 text-purple-400" />
              <span>Budget vs. Actual Variance Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Financial Budget & Variance Tracker</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Track category targets against real-time extracted bank ledger transactions. Identify cost overruns and optimize cash burn allocation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-extrabold text-white"
            >
              <option value="October 2026">October 2026 (Active)</option>
              <option value="September 2026">September 2026</option>
              <option value="Q4 2026">Q4 2026 Forecast</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="saas-card p-6 space-y-2 border-l-4 border-l-sky-500">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Monthly Budget</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white">${totalBudget.toLocaleString()}</div>
          <div className="text-xs font-semibold text-slate-500">Planned Target Spend</div>
        </div>

        <div className="saas-card p-6 space-y-2 border-l-4 border-l-purple-500">
          <span className="text-xs font-bold text-slate-500 uppercase">Actual Ledger Spend</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white">${totalActual.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-xs font-semibold text-purple-600 dark:text-purple-400">Extracted from Statement</div>
        </div>

        <div className={`saas-card p-6 space-y-2 border-l-4 ${isOverTotal ? 'border-l-rose-500' : 'border-l-emerald-500'}`}>
          <span className="text-xs font-bold text-slate-500 uppercase">Overall Net Variance</span>
          <div className={`text-3xl font-black flex items-center gap-1 ${isOverTotal ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {isOverTotal ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
            <span>${Math.abs(overallVariance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="text-xs font-bold text-slate-500">
            {isOverTotal ? '⚠️ Over Target Budget by ' + ((overallVariance / totalBudget) * 100).toFixed(1) + '%' : '✅ Under Target Budget'}
          </div>
        </div>
      </div>

      {/* AI Budget Optimizer Alert */}
      {isOverTotal && (
        <div className="saas-card p-6 border-l-4 border-l-rose-500 bg-rose-500/10 border-rose-500/30 flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-rose-700 dark:text-rose-400">AI Budget Advisory Notice</h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Software & Cloud Ops (+${(1845.20 - 1500).toFixed(2)}) and Ad Spend (+${(2450 - 2000).toFixed(2)}) exceed budgeted targets. Reallocate surplus from Legal & Office budgets to keep net monthly burn flat.
            </p>
          </div>
        </div>
      )}

      {/* Category Breakdown Table & Sliders */}
      <div className="saas-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-500" />
            Budget vs. Actual Line Item Analysis
          </h3>
          <span className="text-xs font-bold text-slate-500">Adjust sliders to re-forecast budget</span>
        </div>

        <div className="space-y-6">
          {categories.map((cat) => {
            const diff = cat.actual - cat.budget;
            const percentUsed = Math.min(Math.round((cat.actual / cat.budget) * 100), 100);
            const isOver = diff > 0;

            return (
              <div key={cat.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">{cat.name}</h4>
                      <div className="text-[11px] font-semibold text-slate-500">
                        Actual Spend: <span className="font-bold text-slate-900 dark:text-white">${cat.actual.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-xs font-bold text-slate-500">Target:</span>
                      <div className="flex items-center">
                        <span className="text-xs font-bold text-slate-400 mr-1">$</span>
                        <input
                          type="number"
                          value={cat.budget}
                          onChange={(e) => handleBudgetChange(cat.id, e.target.value)}
                          className="w-24 px-2 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono font-black text-xs text-slate-900 dark:text-white text-right"
                        />
                      </div>
                    </div>
                    <div className={`text-[11px] font-extrabold mt-1 ${isOver ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {isOver ? `+$${diff.toFixed(2)} (${((diff/cat.budget)*100).toFixed(0)}% over)` : `-$${Math.abs(diff).toFixed(2)} under budget`}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${percentUsed}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
