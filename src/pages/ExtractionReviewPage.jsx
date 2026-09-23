import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Edit2, Trash2, Plus, ArrowRight, FileText, Check, ShieldCheck } from 'lucide-react';
import { useFinancialData } from '../context/FinancialDataContext';
import { useNotifications } from '../context/NotificationContext';
import { formatCurrency } from '../utils/formatters';
import { USA_BANK_CATEGORIES } from '../data/usaCategories';

export default function ExtractionReviewPage({ extractedTransactions = [], statementName = "Uploaded_Statement.pdf", onFinalize, onCancel }) {
  const { addNotification } = useNotifications();
  const [rows, setRows] = useState(extractedTransactions);
  const [selectedIds, setSelectedIds] = useState(() => new Set(extractedTransactions.map(r => r.id)));

  const isAllSelected = rows.length > 0 && rows.every(r => selectedIds.has(r.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(rows.map(r => r.id)));
    }
  };

  const handleToggleRow = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleUpdateRowField = (id, field, value) => {
    setRows(rows.map(row => {
      if (row.id !== id) return row;
      const updated = { ...row, [field]: value };
      if (field === 'category') {
        const isInc = USA_BANK_CATEGORIES.INCOME.some(c => c.name === value);
        if (isInc && Number(row.debit) > 0) {
          updated.credit = row.debit;
          updated.debit = 0;
          updated.type = 'INCOME';
        } else if (!isInc && Number(row.credit) > 0) {
          updated.debit = row.credit;
          updated.credit = 0;
          updated.type = 'EXPENSE';
        }
      }
      return updated;
    }));
  };

  const handleDelete = (id) => {
    setRows(rows.filter(r => r.id !== id));
    const next = new Set(selectedIds);
    next.delete(id);
    setSelectedIds(next);
  };

  const handleAddRow = () => {
    const newId = `tx_manual_${Date.now()}`;
    const newRow = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      referenceNo: `MAN-TX-${Math.floor(1000 + Math.random() * 9000)}`,
      description: "Manual Transaction Entry",
      debit: 0,
      credit: 100.00,
      balance: 5000.00,
      category: "Salary & Direct Deposit",
      aiConfidence: 99,
      aiExplanation: "Manually added during extraction verification"
    };
    setRows([newRow, ...rows]);
    setSelectedIds(prev => new Set([...prev, newId]));
  };

  const selectedRows = rows.filter(r => selectedIds.has(r.id));
  const totalCredits = selectedRows.reduce((sum, r) => sum + Number(r.credit || 0), 0);
  const totalDebits = selectedRows.reduce((sum, r) => sum + Number(r.debit || 0), 0);
  const lowConfidenceCount = selectedRows.filter(r => (r.aiConfidence || 90) < 85).length;

  const handleBulkApprove = () => {
    if (!selectedRows.length) {
      addNotification({
        title: "⚠️ No Rows Selected",
        message: "Please select at least one transaction row to approve.",
        type: "warning"
      });
      return;
    }
    addNotification({
      title: "✅ Statement Extraction Approved",
      message: `Verified and imported ${selectedRows.length} transactions from ${statementName}.`,
      type: "success"
    });
    if (onFinalize) onFinalize(selectedRows);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="saas-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Extraction Verification Step</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Review Extracted Statement Ledger
          </h2>
          <p className="text-xs text-slate-500">
            Verify extracted line items and USA bank categories from <strong>{statementName}</strong> before committing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddRow}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-500" />
            <span>Add Row</span>
          </button>

          <button
            onClick={handleBulkApprove}
            disabled={!selectedRows.length}
            className={`px-6 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 ${
              selectedRows.length ? 'bg-emerald-500 hover:bg-emerald-600 cursor-pointer' : 'bg-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve & Save Selected ({selectedRows.length})</span>
          </button>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="saas-card p-4 text-center space-y-1">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase">Selected Items</div>
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
            {selectedRows.length} <span className="text-xs text-slate-400">/ {rows.length}</span>
          </div>
        </div>
        <div className="saas-card p-4 text-center space-y-1">
          <div className="text-[10px] font-extrabold text-emerald-500 uppercase">Selected Credits (Inflow)</div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">+{formatCurrency(totalCredits, 'USD')}</div>
        </div>
        <div className="saas-card p-4 text-center space-y-1">
          <div className="text-[10px] font-extrabold text-rose-500 uppercase">Selected Debits (Outflow)</div>
          <div className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono">-{formatCurrency(totalDebits, 'USD')}</div>
        </div>
        <div className="saas-card p-4 text-center space-y-1">
          <div className="text-[10px] font-extrabold text-amber-500 uppercase">Potential Flags</div>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">{lowConfidenceCount} Items</div>
        </div>
      </div>

      {/* Editable Transactions Table */}
      <div className="saas-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 font-extrabold">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
                <th className="p-3.5 w-32">Date</th>
                <th className="p-3.5 min-w-[200px]">Description</th>
                <th className="p-3.5 w-60">USA Bank Category</th>
                <th className="p-3.5 text-right w-28">Debit</th>
                <th className="p-3.5 text-right w-28">Credit</th>
                <th className="p-3.5 text-center w-24">Confidence</th>
                <th className="p-3.5 text-center w-16">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {rows.map((row) => {
                const isSelected = selectedIds.has(row.id);
                const isIncome = Number(row.credit || 0) > 0;

                return (
                  <tr 
                    key={row.id} 
                    onClick={() => handleToggleRow(row.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-emerald-500/5 dark:bg-emerald-500/10 hover:bg-emerald-500/10' 
                        : 'opacity-60 hover:opacity-90 bg-slate-50/50 dark:bg-slate-900/40'
                    }`}
                  >
                    <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(row.id)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="date"
                        value={row.date || ''}
                        onChange={(e) => handleUpdateRowField(row.id, 'date', e.target.value)}
                        className="w-full bg-transparent px-2 py-1 rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-700 text-xs font-mono focus:outline-none focus:bg-white dark:focus:bg-slate-800"
                      />
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={row.description || ''}
                        onChange={(e) => handleUpdateRowField(row.id, 'description', e.target.value)}
                        className="w-full bg-transparent px-2 py-1 rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-700 text-xs font-bold focus:outline-none focus:bg-white dark:focus:bg-slate-800"
                      />
                    </td>
                    <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={row.category || (isIncome ? 'Salary & Direct Deposit' : 'Other Expenses')}
                        onChange={(e) => handleUpdateRowField(row.id, 'category', e.target.value)}
                        className="w-full px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <optgroup label="🟢 USA Inflow / Income Categories">
                          {USA_BANK_CATEGORIES.INCOME.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="🔴 USA Outflow / Expense Categories">
                          {USA_BANK_CATEGORIES.EXPENSES.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </optgroup>
                      </select>
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-rose-600 dark:text-rose-400" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="number"
                        step="0.01"
                        value={row.debit || ''}
                        onChange={(e) => handleUpdateRowField(row.id, 'debit', e.target.value)}
                        placeholder="0.00"
                        className="w-24 text-right bg-transparent px-2 py-1 rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-700 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800"
                      />
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="number"
                        step="0.01"
                        value={row.credit || ''}
                        onChange={(e) => handleUpdateRowField(row.id, 'credit', e.target.value)}
                        placeholder="0.00"
                        className="w-24 text-right bg-transparent px-2 py-1 rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-700 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800"
                      />
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold badge-ai">
                        {row.aiConfidence || 95}% Conf.
                      </span>
                    </td>
                    <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete Row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
