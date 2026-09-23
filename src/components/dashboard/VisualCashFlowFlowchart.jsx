import React from 'react';
import { Landmark, ArrowRight, PlusCircle, MinusCircle, Wallet } from 'lucide-react';
import { useFinancialData } from '../../context/FinancialDataContext';
import { formatCurrency } from '../../utils/formatters';

export default function VisualCashFlowFlowchart() {
  const { financialTotals } = useFinancialData();

  const opening = financialTotals.openingBalance || 5240.50;
  const credits = financialTotals.totalIncome || 5725.00;
  const debits = financialTotals.totalExpenses || 3847.15;
  const closing = financialTotals.finalTotalBalance || 7118.35;

  return (
    <div className="saas-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Statement Cash Flow Pipeline
          </h3>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Visual breakdown of your bank account reconciliation flow</p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-black badge-neutral">
          Statement Period
        </span>
      </div>

      {/* Pipeline Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-3 pt-2">
        
        {/* 1. Opening Balance */}
        <div className="md:col-span-2 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-center space-y-1">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-1 font-bold">
            <Landmark className="w-4 h-4" />
          </div>
          <div className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide">Opening Balance</div>
          <div className="text-base font-black text-slate-900 dark:text-white font-mono">
            {formatCurrency(opening, 'USD')}
          </div>
        </div>

        {/* Arrow 1 */}
        <div className="hidden md:flex items-center justify-center text-slate-400 dark:text-slate-500">
          <ArrowRight className="w-5 h-5" />
        </div>

        {/* 2. Inflow Credits & Outflow Debits */}
        <div className="md:col-span-2 space-y-2">
          {/* + Credits (Light Blue) */}
          <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span className="font-extrabold text-sky-950 dark:text-sky-100">Total Credits</span>
            </div>
            <span className="font-black font-mono text-sky-600 dark:text-sky-400">
              +{formatCurrency(credits, 'USD')}
            </span>
          </div>

          {/* - Debits */}
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MinusCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span className="font-extrabold text-rose-950 dark:text-rose-100">Total Debits</span>
            </div>
            <span className="font-black font-mono text-rose-600 dark:text-rose-400">
              -{formatCurrency(debits, 'USD')}
            </span>
          </div>
        </div>

        {/* Arrow 2 */}
        <div className="hidden md:flex items-center justify-center text-slate-400 dark:text-slate-500">
          <ArrowRight className="w-5 h-5" />
        </div>

        {/* 3. Closing Balance */}
        <div className="md:col-span-2 p-4 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 border border-sky-400 dark:border-sky-600 text-center space-y-1">
          <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center mx-auto mb-1 shadow-md">
            <Wallet className="w-4 h-4" />
          </div>
          <div className="text-[11px] font-black text-sky-900 dark:text-sky-200 uppercase tracking-wide">Closing Balance</div>
          <div className="text-base font-black text-sky-600 dark:text-sky-400 font-mono">
            {formatCurrency(closing, 'USD')}
          </div>
        </div>

      </div>
    </div>
  );
}
