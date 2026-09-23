import React, { useState } from 'react';
import { CheckCheck, CheckCircle2, AlertTriangle, Filter, Sparkles } from 'lucide-react';
import { useFinancialData } from '../context/FinancialDataContext';
import TransactionTable from '../components/transactions/TransactionTable';
import BulkActionToolbar from '../components/transactions/BulkActionToolbar';
import TransactionDetailsDrawer from '../components/transactions/TransactionDetailsDrawer';

export default function ReviewPage() {
  const { allTransactions, bulkApproveTransactions } = useFinancialData();
  const [selectedTx, setSelectedTx] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const needsReviewCount = allTransactions.filter(t => t.status === "NEEDS_REVIEW").length;
  const approvedCount = allTransactions.filter(t => t.status === "APPROVED").length;

  const handleApproveAllNeedsReview = () => {
    const unapprovedIds = allTransactions.filter(t => t.status === "NEEDS_REVIEW").map(t => t.id);
    bulkApproveTransactions(unapprovedIds);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>AI Bookkeeping Review System</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Transaction Review Queue</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Review AI categorization confidence levels and approve extracted bank entries</p>
        </div>

        {needsReviewCount > 0 && (
          <button
            onClick={handleApproveAllNeedsReview}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve All {needsReviewCount} Pending Items</span>
          </button>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Extracted</div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{allTransactions.length}</div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 text-center">
          <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Needs Review</div>
          <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{needsReviewCount}</div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-center">
          <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Approved</div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{approvedCount}</div>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 text-center">
          <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">AI Categorized</div>
          <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">100%</div>
        </div>
      </div>

      {/* Transaction Table View */}
      <TransactionTable
        onSelectTransaction={(tx) => setSelectedTx(tx)}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />

      {/* Bulk Toolbar */}
      <BulkActionToolbar
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />

      {/* Transaction Details Drawer */}
      {selectedTx && (
        <TransactionDetailsDrawer
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
}
