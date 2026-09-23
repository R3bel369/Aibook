import React from 'react';
import { Repeat, Calendar, DollarSign, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useFinancialData } from '../context/FinancialDataContext';
import { formatCurrency } from '../utils/formatters';

export default function RecurringPaymentsPage() {
  const { subscriptions } = useFinancialData();

  const totalMonthly = subscriptions.reduce((sum, s) => sum + s.monthlyCost, 0);
  const totalAnnual = totalMonthly * 12;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="saas-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-ai text-xs font-black mb-2">
            <Repeat className="w-3.5 h-3.5" />
            <span>Automated Subscription Audit</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Recurring Payments & Subscriptions
          </h2>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Detected recurring SaaS tool charges, workspace leases, and digital subscriptions in your statement.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-700 dark:text-slate-300 font-extrabold">Total Monthly Commitment</div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
            {formatCurrency(totalMonthly, 'USD')}/mo
          </div>
          <div className="text-xs font-bold text-slate-600 dark:text-slate-400">({formatCurrency(totalAnnual, 'USD')}/year)</div>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="saas-card p-5 space-y-4 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-sm">
                  {sub.vendor.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">{sub.vendor}</h3>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{sub.category}</p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-black badge-neutral uppercase">
                {sub.frequency || "Monthly"}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-700 dark:text-slate-300 text-[10px] block uppercase font-extrabold">Monthly Cost</span>
                <span className="font-black text-slate-900 dark:text-white">{formatCurrency(sub.monthlyCost, 'USD')}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-700 dark:text-slate-300 text-[10px] block uppercase font-extrabold">Annual Projection</span>
                <span className="font-black text-purple-600 dark:text-purple-400">{formatCurrency(sub.monthlyCost * 12, 'USD')}/yr</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
