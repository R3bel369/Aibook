import React, { useState } from 'react';
import { CheckCheck, AlertTriangle, Check, X, Edit2, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { useFinancialData } from '../context/FinancialDataContext';
import { useNotifications } from '../context/NotificationContext';
import { formatCurrency } from '../utils/formatters';

export default function ReviewQueuePage() {
  const { transactions, updateTransactionCategory } = useFinancialData();
  const { addNotification } = useNotifications();

  // Filter items needing review (confidence < 85 or status NEEDS_REVIEW)
  const reviewItems = transactions.filter(t => t.status === 'NEEDS_REVIEW' || (t.aiConfidence || 95) < 85);
  const [resolvedIds, setResolvedIds] = useState([]);

  const activeItems = reviewItems.filter(t => !resolvedIds.includes(t.id));

  const handleAccept = (tx) => {
    setResolvedIds(prev => [...prev, tx.id]);
    addNotification({
      title: "Category Accepted",
      message: `Approved category '${tx.category}' for ${tx.description}.`,
      type: "success"
    });
  };

  const handleIgnore = (tx) => {
    setResolvedIds(prev => [...prev, tx.id]);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="saas-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-review text-xs font-bold mb-2">
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Uncertain Transactions Queue</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Transactions Needing Review
          </h2>
          <p className="text-xs text-slate-500">
            Review low confidence AI classifications to train your custom accounting engine rules.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-xs">
          {activeItems.length} Transactions Pending
        </div>
      </div>

      {/* Item Cards List */}
      {activeItems.length === 0 ? (
        <div className="saas-card p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto font-bold">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Review Queue Clean & Verified!</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">All statement transactions have high AI confidence scores (90%+). No manual corrections required.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeItems.map((item) => (
            <div key={item.id} className="saas-card p-5 space-y-4 border-l-4 border-l-amber-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-slate-400">{item.date}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.description}</span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span>Suggested Category: <strong className="text-purple-600 dark:text-purple-400 font-bold">{item.category}</strong></span>
                    <span>•</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">AI Confidence: {item.aiConfidence}%</span>
                  </div>
                </div>

                <div className="text-right font-mono font-bold text-sm text-slate-900 dark:text-white">
                  {item.credit > 0 ? `+${formatCurrency(item.credit, 'USD')}` : formatCurrency(item.debit, 'USD')}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
                <strong className="text-purple-600 dark:text-purple-400">Why AI Flagged This:</strong> "{item.aiExplanation || "Merchant keywords were ambiguous. Verification requested."}"
              </div>

              {/* Control Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleIgnore(item)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all"
                >
                  Ignore
                </button>
                <button
                  onClick={() => handleAccept(item)}
                  className="px-5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept Category</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
