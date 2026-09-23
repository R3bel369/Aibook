import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Receipt, Tag, Building2, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useFinancialData } from '../../context/FinancialDataContext';
import { formatCurrency } from '../../utils/formatters';

export default function GlobalSearchModal({ isOpen, onClose, onSelectTransaction, onNavigate }) {
  const { transactions } = useFinancialData();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim() === ''
    ? transactions.slice(0, 5)
    : transactions.filter(t => {
        const q = query.toLowerCase();
        return (
          t.description?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q) ||
          t.merchant?.toLowerCase().includes(q) ||
          t.date?.includes(q) ||
          String(t.debit || '').includes(q) ||
          String(t.credit || '').includes(q)
        );
      }).slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="saas-card max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Input Bar */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transactions, merchants, categories, amounts, dates..."
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">ESC</kbd>
        </div>

        {/* Results */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2">
            {query.trim() === '' ? 'Recent Transactions' : `Found ${filtered.length} Results`}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No matching transactions found for "{query}".
            </div>
          ) : (
            filtered.map((tx) => (
              <div
                key={tx.id}
                onClick={() => {
                  if (onSelectTransaction) onSelectTransaction(tx);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    tx.credit > 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}>
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 dark:text-white truncate">{tx.description}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">{tx.category}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`font-bold font-mono ${tx.credit > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {tx.credit > 0 ? `+${formatCurrency(tx.credit, 'USD')}` : formatCurrency(tx.debit, 'USD')}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Bal: ${tx.balance}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Quick Links */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>Search powered by AI Indexing</span>
          </div>

          <button
            onClick={() => {
              onNavigate('transactions');
              onClose();
            }}
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>View All Transactions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
