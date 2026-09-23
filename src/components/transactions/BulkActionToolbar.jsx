import React from 'react';
import { CheckCircle2, Trash2, Tag, X } from 'lucide-react';
import { useFinancialData } from '../../context/FinancialDataContext';

export default function BulkActionToolbar({ selectedIds, setSelectedIds }) {
  const { bulkApproveTransactions, deleteTransaction } = useFinancialData();

  if (!selectedIds || selectedIds.length === 0) return null;

  const handleBulkApprove = () => {
    bulkApproveTransactions(selectedIds);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteTransaction(id));
    setSelectedIds([]);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass-card px-6 py-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-6 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
        <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
          {selectedIds.length}
        </span>
        <span>Transactions Selected</span>
      </div>

      <div className="h-4 border-r border-slate-300 dark:border-slate-700" />

      <div className="flex items-center gap-3">
        <button
          onClick={handleBulkApprove}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md hover:bg-emerald-600 transition-all flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Approve All</span>
        </button>

        <button
          onClick={handleBulkDelete}
          className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>

        <button
          onClick={() => setSelectedIds([])}
          className="p-1.5 text-slate-400 hover:text-slate-200"
          title="Deselect All"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
