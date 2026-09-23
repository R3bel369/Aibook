import React, { useState } from 'react';
import { X, Sparkles, Edit2, CheckCircle2, FileText, Tag, Paperclip, AlertTriangle, HelpCircle } from 'lucide-react';
import { useFinancialData } from '../../context/FinancialDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate, getCategoryBadgeColor } from '../../utils/formatters';

export default function TransactionDetailsDrawer({ transaction, onClose }) {
  const { updateTransactionCategory, categories } = useFinancialData();
  const { user } = useAuth();

  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(transaction?.category || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(transaction?.subcategory || '');
  const [notes, setNotes] = useState(transaction?.notes || '');
  const [isBusiness, setIsBusiness] = useState(transaction?.isBusinessExpense ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!transaction) return null;

  const handleSave = () => {
    updateTransactionCategory(transaction.id, selectedCategory, selectedSubcategory, notes);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsEditingCategory(false);
    }, 800);
  };

  const isIncome = transaction.type === "INCOME";
  const amount = isIncome ? transaction.credit : transaction.debit;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-lg saas-card h-full p-6 sm:p-8 overflow-y-auto border-l border-slate-300 dark:border-slate-700 shadow-2xl space-y-6 flex flex-col justify-between">
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">Transaction Analysis</div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Detailed Ledger Record</h3>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Amount Card */}
          <div className={`p-6 rounded-2xl border space-y-2 text-center ${
            isIncome ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
          }`}>
            <div className="text-xs font-black text-slate-800 dark:text-slate-200">{transaction.description}</div>
            <div className={`text-3xl font-black ${isIncome ? 'text-sky-600 dark:text-sky-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {isIncome ? '+' : '-'}{formatCurrency(amount, user.currency)}
            </div>
            <div className="flex items-center justify-center gap-3 text-xs text-slate-700 dark:text-slate-300 font-bold">
              <span>{formatDate(transaction.date)}</span>
              <span>•</span>
              <span>{transaction.bankName || "HDFC Bank"}</span>
            </div>
          </div>

          {/* AI EXPLANATION FEATURE CARD */}
          <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-purple-700 dark:text-purple-300">
                <Sparkles className="w-4 h-4" />
                <span>AI Categorization Explanation</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-black bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300">
                {transaction.aiConfidence}% AI Confidence
              </span>
            </div>

            <p className="text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-bold">
              "{transaction.aiExplanation}"
            </p>

            <div className="text-xs text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>Correcting this category will train your local AI engine for future statements.</span>
            </div>
          </div>

          {/* Category Details & Editing */}
          <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300">Assigned Category</span>
              <button
                onClick={() => setIsEditingCategory(!isEditingCategory)}
                className="text-xs font-black text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isEditingCategory ? "Cancel Edit" : "Change Category"}</span>
              </button>
            </div>

            {!isEditingCategory ? (
              <div className="flex items-center justify-between">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border ${getCategoryBadgeColor(transaction.category)}`}>
                    {transaction.category}
                  </span>
                  <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1">Subcategory: {transaction.subcategory || "General"}</div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-sky-500" />
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">Select New Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-extrabold text-slate-900 dark:text-white"
                  >
                    {(isIncome ? categories.INCOME : categories.EXPENSES).map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">Subcategory Name</label>
                  <input
                    type="text"
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Business vs Personal Expense Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700">
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white">Tax Expense Classification</div>
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Mark as deductible business expenditure</div>
            </div>
            <button
              onClick={() => setIsBusiness(!isBusiness)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                isBusiness
                  ? "bg-sky-500 text-white shadow-md"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              }`}
            >
              {isBusiness ? "Business Expense ✓" : "Personal Spend"}
            </button>
          </div>

          {/* User Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-800 dark:text-slate-200">Accounting Notes & Context</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes for your accountant or tax review..."
              className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{savedSuccess ? "Saved & Learned ✓" : "Save Changes & Update AI"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
