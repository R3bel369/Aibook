import React, { useState } from 'react';
import {
  Receipt,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Edit2,
  Trash2,
  Sparkles,
  Search,
  Filter,
  Check,
  ChevronRight,
  ChevronLeft,
  FileText
} from 'lucide-react';
import { useFinancialData } from '../../context/FinancialDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDate, getCategoryBadgeColor } from '../../utils/formatters';

export default function TransactionTable({ onSelectTransaction, selectedIds, setSelectedIds }) {
  const { transactions, approveTransaction, deleteTransaction, activeStatementInfo } = useFinancialData();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [rowsPerPage, setRowsPerPage] = useState(25); // Default to 25 rows
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering
  const filteredTxs = transactions.filter(tx => {
    const matchesSearch =
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.merchant && tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalRows = filteredTxs.length;
  const isAll = rowsPerPage === 'ALL';
  const effectiveRowsPerPage = isAll ? totalRows : Number(rowsPerPage);
  const totalPages = Math.ceil(totalRows / (effectiveRowsPerPage || 1)) || 1;
  const startIndex = (currentPage - 1) * effectiveRowsPerPage;
  const displayedTxs = filteredTxs.slice(startIndex, startIndex + effectiveRowsPerPage);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredTxs.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="saas-card rounded-2xl overflow-hidden space-y-4 shadow-md">
      
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        
        {/* Search Input & Total Count Callout */}
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all statement transactions..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-black shrink-0 border border-sky-500/30">
            {totalRows} Total Statement Line Items
          </div>
        </div>

        {/* Rows Per Page & Filter Dropdowns */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-extrabold">
            <span>Show:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value={10}>10 Rows</option>
              <option value={25}>25 Rows</option>
              <option value={50}>50 Rows</option>
              <option value="ALL">Show All ({totalRows})</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-black text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved ✓</option>
            <option value="NEEDS_REVIEW">Needs Review ⚠️</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider bg-slate-100/70 dark:bg-slate-800/80">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={filteredTxs.length > 0 && selectedIds.length === filteredTxs.length}
                  className="rounded border-slate-400 text-sky-600 focus:ring-sky-500"
                />
              </th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Debit</th>
              <th className="py-3 px-4 text-right">Credit</th>
              <th className="py-3 px-4 text-right">Balance</th>
              <th className="py-3 px-4 text-center">AI Confidence</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs font-semibold">
            {displayedTxs.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-600 dark:text-slate-400 font-extrabold">
                  No transaction records match your search query.
                </td>
              </tr>
            ) : (
              displayedTxs.map((tx) => {
                const isSelected = selectedIds.includes(tx.id);
                return (
                  <tr
                    key={tx.id}
                    className={`hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                      isSelected ? "bg-sky-500/10 dark:bg-sky-500/20" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(tx.id)}
                        className="rounded border-slate-400 text-sky-600 focus:ring-sky-500"
                      />
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap" onClick={() => onSelectTransaction(tx)}>
                      {formatDate(tx.date)}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs" onClick={() => onSelectTransaction(tx)}>
                      <div className="font-extrabold text-slate-900 dark:text-white truncate">
                        {tx.description}
                      </div>
                      <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                        <span>{tx.referenceNo || "REF-AUTO"}</span>
                        {tx.merchant && <span>• {tx.merchant}</span>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap" onClick={() => onSelectTransaction(tx)}>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold border ${getCategoryBadgeColor(tx.category)}`}>
                        {tx.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-rose-600 dark:text-rose-400 whitespace-nowrap" onClick={() => onSelectTransaction(tx)}>
                      {tx.debit ? formatCurrency(tx.debit, user.currency) : "-"}
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-sky-600 dark:text-sky-400 whitespace-nowrap" onClick={() => onSelectTransaction(tx)}>
                      {tx.credit ? formatCurrency(tx.credit, user.currency) : "-"}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap font-mono" onClick={() => onSelectTransaction(tx)}>
                      {formatCurrency(tx.balance, user.currency, false)}
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={() => onSelectTransaction(tx)}>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-extrabold text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700">
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        <span>{tx.aiConfidence}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {tx.status === "NEEDS_REVIEW" && (
                          <button
                            onClick={() => approveTransaction(tx.id)}
                            className="p-1.5 rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 font-black text-xs flex items-center gap-1 border border-sky-500/30"
                            title="Approve AI Suggestion"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}
                        <button
                          onClick={() => onSelectTransaction(tx)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      {!isAll && totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-extrabold">
          <div>
            Showing {startIndex + 1} to {Math.min(startIndex + effectiveRowsPerPage, totalRows)} of {totalRows} transactions
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 disabled:opacity-30 border border-slate-300 dark:border-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-black text-slate-900 dark:text-white">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 disabled:opacity-30 border border-slate-300 dark:border-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
