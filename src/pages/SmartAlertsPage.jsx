import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Check, DollarSign, Repeat, ArrowRight } from 'lucide-react';
import { useFinancialData } from '../context/FinancialDataContext';
import { formatCurrency } from '../utils/formatters';

export default function SmartAlertsPage() {
  const { anomalies, transactions } = useFinancialData();
  const [dismissed, setDismissed] = useState([]);

  // Generate intelligent alert items
  const largeTx = transactions.filter(t => (t.debit || 0) > 1000);
  const activeAnomalies = anomalies.filter(a => !dismissed.includes(a.id));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="saas-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-review text-xs font-black mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Smart Expense Protection</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Smart Financial Alerts & Anomaly Detection
          </h2>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Real-time pattern analysis detecting large transactions, duplicate charges, and unexpected spending spikes.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-black text-xs">
          {activeAnomalies.length + largeTx.length} Active Alerts
        </div>
      </div>

      {/* Large Transaction Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Large Amount Transactions ($1,000+)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {largeTx.map((tx) => (
            <div key={tx.id} className="saas-card p-4 space-y-3 border-l-4 border-l-rose-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white truncate">{tx.description}</span>
                <span className="font-mono font-black text-rose-600 dark:text-rose-400 text-sm">
                  {formatCurrency(tx.debit, 'USD')}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Date: {tx.date} • Category: {tx.category}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-black text-amber-700 dark:text-amber-400">High Volume Expense</span>
                <button
                  onClick={() => setDismissed(prev => [...prev, tx.id])}
                  className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 hover:bg-slate-200"
                >
                  Mark Normal ✓
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern Anomalies Section */}
      <div className="space-y-3 pt-4">
        <h3 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Detected Pattern Anomalies
        </h3>

        {activeAnomalies.length === 0 ? (
          <div className="saas-card p-8 text-center text-xs font-extrabold text-slate-700 dark:text-slate-300">
            No pattern anomalies detected in active statement.
          </div>
        ) : (
          activeAnomalies.map((anom) => (
            <div key={anom.id} className="saas-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>{anom.title}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black badge-review">
                  {anom.severity || "MEDIUM"} SEVERITY
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{anom.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
