import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, XCircle, ArrowRight } from 'lucide-react';
import { useFinancialData } from '../../context/FinancialDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function AnomalyDetector() {
  const { anomalies, handleAnomalyAction } = useFinancialData();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          <span>Smart Expense Anomaly & Fraud Detector</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Automated detection of unexpected spending surges, duplicate debits, and un-categorized vendor charges</p>
      </div>

      <div className="space-y-4">
        {anomalies.map((anom) => (
          <div
            key={anom.id}
            className="glass-card p-6 rounded-3xl border border-amber-500/30 space-y-4 glow-amber"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{anom.title}</h3>
                  <div className="text-xs text-slate-400 font-mono">{anom.merchant} • {formatDate(anom.date)}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-black text-rose-500">
                  {formatCurrency(anom.amount, user.currency)}
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Status: {anom.status}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">AI Detection Reason:</div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{anom.reason}</p>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                💡 Suggestion: {anom.suggestion}
              </div>
            </div>

            {/* Action Buttons as requested */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => handleAnomalyAction(anom.id, 'CONFIRMED')}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow hover:bg-emerald-600 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>✓ Confirm Transaction</span>
              </button>

              <button
                onClick={() => handleAnomalyAction(anom.id, 'REVIEWED')}
                className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>⚠️ Mark for Review</span>
              </button>

              <button
                onClick={() => handleAnomalyAction(anom.id, 'SUSPICIOUS')}
                className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-500/30 hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>❌ Report as Suspicious</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
