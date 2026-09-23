import React, { useState, useEffect } from 'react';
import { Search, X, Receipt, Tag, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import { useFinancialData } from '../../context/FinancialDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function CommandPalette({ onClose, onNavigate }) {
  const { allTransactions } = useFinancialData();
  const { user } = useAuth();
  const [query, setQuery] = useState('');

  // Keyboard shortcut Esc to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filtered = query.trim() === '' ? allTransactions.slice(0, 5) : allTransactions.filter(tx => {
    const q = query.toLowerCase();
    return (
      tx.description.toLowerCase().includes(q) ||
      tx.category.toLowerCase().includes(q) ||
      (tx.merchant && tx.merchant.toLowerCase().includes(q)) ||
      (tx.notes && tx.notes.toLowerCase().includes(q)) ||
      (tx.debit && tx.debit.toString().includes(q)) ||
      (tx.credit && tx.credit.toString().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl glass-card rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-emerald-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by transaction, merchant, category, or amount (e.g. 'Amazon', 'Marketing', '25000')..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-2">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{query.trim() === '' ? "Recent Transactions" : `Matching Results (${filtered.length})`}</span>
            <span>Press ESC to close</span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No matching financial records found for "{query}"
            </div>
          ) : (
            filtered.map((tx) => (
              <div
                key={tx.id}
                onClick={() => {
                  onNavigate('transactions');
                  onClose();
                }}
                className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-emerald-500/10 border border-slate-200/60 dark:border-slate-800 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    tx.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                  }`}>
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {tx.description}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                      <span>{formatDate(tx.date)}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-500 dark:text-slate-400">{tx.category}</span>
                      {tx.merchant && <span>• {tx.merchant}</span>}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-xs font-bold ${tx.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.credit || tx.debit, user.currency)}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                    <span>{tx.aiConfidence}% AI</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
