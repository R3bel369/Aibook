import React from 'react';
import { Repeat, CheckCircle2, AlertCircle, Trash2, Calendar, DollarSign } from 'lucide-react';
import { useFinancialData } from '../../context/FinancialDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function SubscriptionManager() {
  const { recurringPayments, updateSubscriptionAction } = useFinancialData();
  const { user } = useAuth();

  const totalAnnualSubCost = recurringPayments.reduce((acc, curr) => acc + curr.annualCost, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Repeat className="w-6 h-6 text-purple-500" />
            <span>Recurring Payments & Subscription Detector</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Automatic detection of monthly software SaaS licenses, lease commitments, and streaming tools</p>
        </div>

        <div className="text-right p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
          <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">Total Annual Commitments</div>
          <div className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(totalAnnualSubCost, user.currency)}/yr</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {recurringPayments.map((sub) => (
          <div
            key={sub.id}
            className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-2xl flex items-center justify-center">
                  {sub.logo}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{sub.serviceName}</h3>
                  <div className="text-xs text-slate-400 font-mono">{sub.merchant} • {sub.frequency}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {formatCurrency(sub.amount, user.currency)}/{sub.frequency.toLowerCase()}
                </div>
                <div className="text-[10px] text-purple-500 font-bold">Annual: {formatCurrency(sub.annualCost, user.currency)}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                <span>Next Due: {formatDate(sub.nextDue)}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {sub.category}
              </span>
            </div>

            {/* Interactive Prompt as requested in prompt */}
            <div className="p-4 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 space-y-3">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>"Do you still use this subscription?"</span>
                <span className="text-[10px] font-semibold text-purple-500">Action: {sub.recommendedAction}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateSubscriptionAction(sub.id, 'Keep')}
                  className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    sub.recommendedAction === 'Keep'
                      ? "bg-emerald-500 text-white shadow"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-500 hover:text-white"
                  }`}
                >
                  Keep ✓
                </button>

                <button
                  onClick={() => updateSubscriptionAction(sub.id, 'Review')}
                  className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    sub.recommendedAction === 'Review'
                      ? "bg-amber-500 text-white shadow"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-white"
                  }`}
                >
                  Review ⚠️
                </button>

                <button
                  onClick={() => updateSubscriptionAction(sub.id, 'Cancel Reminder')}
                  className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    sub.recommendedAction === 'Cancel Reminder'
                      ? "bg-rose-500 text-white shadow"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-rose-500 hover:text-white"
                  }`}
                >
                  Cancel Reminder
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
