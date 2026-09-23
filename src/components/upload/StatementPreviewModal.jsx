import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, Search, Building2, TrendingUp, TrendingDown, Tag, Columns, CheckSquare, Square, Filter, ChevronDown, Check, FileText, RotateCcw, Eye, List
} from 'lucide-react';
import { USA_BANK_CATEGORIES } from '../../data/usaCategories';

export default function StatementPreviewModal({ isOpen, onClose, previewData, onConfirmImport }) {
  const metadata = previewData?.metadata || {};

  // Editable local transactions state
  const [txItems, setTxItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'INCOME' | 'EXPENSE'
  const [viewMode, setViewMode] = useState('TABLE'); // 'TABLE' | 'RAW_TEXT'
  
  // Column Selection / Column Visibility Toggles
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    referenceNo: true,
    description: true,
    category: true,
    debit: true,
    credit: true,
    balance: true,
    aiConfidence: true
  });

  // Selected column highlight state
  const [selectedColumnKey, setSelectedColumnKey] = useState(null);
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  // Initialize transactions state and selection whenever previewData changes
  useEffect(() => {
    if (previewData?.parsedTransactions) {
      const items = previewData.parsedTransactions.map(tx => ({ 
        id: tx.id || `tx_${Math.random()}`,
        date: tx.date || '2024-10-31',
        referenceNo: tx.referenceNo || 'REF-AUTO',
        description: tx.description || 'Transaction',
        merchant: tx.merchant || '',
        category: tx.category || 'Other Expenses',
        debit: Number(tx.debit || 0),
        credit: Number(tx.credit || 0),
        balance: Number(tx.balance || 5000.00),
        type: tx.type || (Number(tx.credit) > 0 ? 'INCOME' : 'EXPENSE'),
        aiConfidence: tx.aiConfidence || 95,
        aiExplanation: tx.aiExplanation || 'Parsed from bank statement'
      }));
      setTxItems(items);
      setSelectedIds(new Set(items.map(tx => tx.id)));
    }
  }, [previewData]);

  // Reset to original parsed transactions
  const handleResetToOriginal = () => {
    if (previewData?.parsedTransactions) {
      const items = previewData.parsedTransactions.map(tx => ({ ...tx }));
      setTxItems(items);
      setSelectedIds(new Set(items.map(tx => tx.id)));
    }
  };

  // Update specific field on a transaction row
  const handleUpdateRowField = (id, field, value) => {
    setTxItems(prev => prev.map(tx => {
      if (tx.id !== id) return tx;
      const updated = { ...tx, [field]: value };
      
      // Auto-update type if category or amount changes
      if (field === 'category') {
        const isIncCat = USA_BANK_CATEGORIES.INCOME.some(c => c.name === value);
        if (isIncCat && Number(tx.debit) > 0) {
          updated.credit = tx.debit;
          updated.debit = 0;
          updated.type = 'INCOME';
        } else if (!isIncCat && Number(tx.credit) > 0) {
          updated.debit = tx.credit;
          updated.credit = 0;
          updated.type = 'EXPENSE';
        }
      } else if (field === 'credit' && Number(value) > 0) {
        updated.type = 'INCOME';
        updated.debit = 0;
      } else if (field === 'debit' && Number(value) > 0) {
        updated.type = 'EXPENSE';
        updated.credit = 0;
      }
      return updated;
    }));
  };

  // Toggle individual column visibility
  const toggleColumnVisibility = (colKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [colKey]: !prev[colKey]
    }));
  };

  // Select all columns
  const selectAllColumns = () => {
    setVisibleColumns({
      date: true,
      referenceNo: true,
      description: true,
      category: true,
      debit: true,
      credit: true,
      balance: true,
      aiConfidence: true
    });
  };

  // Filter transactions based on search and type filter
  const filteredTransactions = useMemo(() => {
    return txItems.filter(tx => {
      const matchesSearch = 
        !searchQuery.trim() || 
        (tx.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.merchant && tx.merchant.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tx.category && tx.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tx.referenceNo && tx.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()));

      const isIncome = Number(tx.credit || 0) > 0 || tx.type === 'INCOME';
      const matchesType = 
        typeFilter === 'ALL' ||
        (typeFilter === 'INCOME' && isIncome) ||
        (typeFilter === 'EXPENSE' && !isIncome);

      return matchesSearch && matchesType;
    });
  }, [txItems, searchQuery, typeFilter]);

  // Handle master row select / deselect
  const isAllSelected = useMemo(() => {
    if (!filteredTransactions.length) return false;
    return filteredTransactions.every(tx => selectedIds.has(tx.id));
  }, [filteredTransactions, selectedIds]);

  const handleToggleSelectAll = () => {
    const next = new Set(selectedIds);
    if (isAllSelected) {
      filteredTransactions.forEach(tx => next.delete(tx.id));
    } else {
      filteredTransactions.forEach(tx => next.add(tx.id));
    }
    setSelectedIds(next);
  };

  const handleSelectInflowsOnly = () => {
    const next = new Set();
    txItems.forEach(tx => {
      if (Number(tx.credit || 0) > 0 || tx.type === 'INCOME') {
        next.add(tx.id);
      }
    });
    setSelectedIds(next);
  };

  const handleSelectOutflowsOnly = () => {
    const next = new Set();
    txItems.forEach(tx => {
      if (Number(tx.debit || 0) > 0 || tx.type === 'EXPENSE') {
        next.add(tx.id);
      }
    });
    setSelectedIds(next);
  };

  const handleToggleRow = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Selected Metrics Summary
  const selectedTransactions = useMemo(() => {
    return txItems.filter(tx => selectedIds.has(tx.id));
  }, [txItems, selectedIds]);

  const selectedMetrics = useMemo(() => {
    let creditTotal = 0;
    let debitTotal = 0;
    selectedTransactions.forEach(tx => {
      creditTotal += Number(tx.credit || 0);
      debitTotal += Number(tx.debit || 0);
    });
    return {
      count: selectedTransactions.length,
      creditTotal,
      debitTotal,
      netCashFlow: creditTotal - debitTotal
    };
  }, [selectedTransactions]);

  if (!isOpen || !previewData) return null;

  const handleImport = () => {
    if (!selectedTransactions.length) return;
    onConfirmImport(selectedTransactions, metadata);
  };

  const currencySymbol = metadata.currency === 'INR' ? '₹' : '$';
  const activeColCount = Object.values(visibleColumns).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-7xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* Header Banner */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-black">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Exact Bank Statement Preview & Editable Ledger</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-emerald-500" />
              <span>{metadata.bankName || "Apex Trust Bank Statement"}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
              <span>File: <strong className="text-slate-700 dark:text-slate-300">{metadata.name || "Statement.pdf"}</strong></span>
              <span>•</span>
              <span>Account: <strong className="text-slate-700 dark:text-slate-300">•••• 8492</strong></span>
              <span>•</span>
              <span>Opening Bal: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{currencySymbol}{(metadata.openingBalance || 5240.50).toFixed(2)}</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('TABLE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'TABLE' ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs' : 'text-slate-500'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Ledger Preview</span>
              </button>
              <button
                onClick={() => setViewMode('RAW_TEXT')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'RAW_TEXT' ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs' : 'text-slate-500'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Raw Statement Text</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selected Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-100/60 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Selected Rows</span>
            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
              {selectedMetrics.count} <span className="text-xs font-semibold text-slate-400">/ {txItems.length}</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider block flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3" /> Selected Inflow
            </span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
              +{currencySymbol}{selectedMetrics.creditTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider block flex items-center justify-center gap-1">
              <TrendingDown className="w-3 h-3" /> Selected Outflow
            </span>
            <span className="text-lg font-black text-rose-600 dark:text-rose-400 font-mono">
              -{currencySymbol}{selectedMetrics.debitTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-xs">
            <span className="text-[10px] font-black text-sky-500 uppercase tracking-wider block">Net Selection</span>
            <span className={`text-lg font-black font-mono ${selectedMetrics.netCashFlow >= 0 ? 'text-sky-600 dark:text-sky-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {selectedMetrics.netCashFlow >= 0 ? '+' : ''}{currencySymbol}{selectedMetrics.netCashFlow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Toolbar: Search, Filters, Column Selection & Row Shortcuts */}
        <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search description, reference #, or category..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Column Customizer Dropdown & Row Selection Shortcuts */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* RESET TO ORIGINAL BUTTON */}
            <button
              onClick={handleResetToOriginal}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Revert all edits to parsed statement values"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Edits</span>
            </button>

            {/* SELECTABLE COLUMNS CUSTOMIZER BUTTON */}
            <div className="relative">
              <button
                onClick={() => setShowColumnMenu(!showColumnMenu)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Columns className="w-3.5 h-3.5 text-sky-500" />
                <span>Select Columns ({activeColCount}/8)</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Column Selection Dropdown Panel */}
              {showColumnMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-30 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="text-xs font-black text-slate-900 dark:text-white">Toggle Statement Columns</span>
                    <button onClick={selectAllColumns} className="text-[10px] font-bold text-sky-600 dark:text-sky-400 hover:underline">
                      Show All
                    </button>
                  </div>
                  
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {[
                      { key: 'date', label: 'Date Column' },
                      { key: 'referenceNo', label: 'Reference / Check #' },
                      { key: 'description', label: 'Description & Merchant' },
                      { key: 'category', label: 'USA Bank Category' },
                      { key: 'debit', label: 'Debit (- Outflow)' },
                      { key: 'credit', label: 'Credit (+ Inflow)' },
                      { key: 'balance', label: 'Running Balance' },
                      { key: 'aiConfidence', label: 'AI Confidence %' }
                    ].map(col => (
                      <label 
                        key={col.key} 
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <span>{col.label}</span>
                        <input
                          type="checkbox"
                          checked={visibleColumns[col.key]}
                          onChange={() => toggleColumnVisibility(col.key)}
                          className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Type Filters */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setTypeFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${typeFilter === 'ALL' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
              >
                All ({txItems.length})
              </button>
              <button
                onClick={() => setTypeFilter('INCOME')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${typeFilter === 'INCOME' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500'}`}
              >
                Inflows
              </button>
              <button
                onClick={() => setTypeFilter('EXPENSE')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${typeFilter === 'EXPENSE' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-500'}`}
              >
                Outflows
              </button>
            </div>

            {/* Row Selection Shortcuts */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleToggleSelectAll}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  className="w-3.5 h-3.5 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <span>{isAllSelected ? "Deselect All Rows" : "Select All Rows"}</span>
              </button>

              <button
                onClick={handleSelectInflowsOnly}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                Inflows Only
              </button>

              <button
                onClick={handleSelectOutflowsOnly}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                Outflows Only
              </button>
            </div>

          </div>
        </div>

        {/* Content View Modes: Interactive Table vs Raw Text */}
        {viewMode === 'RAW_TEXT' ? (
          <div className="flex-1 p-6 bg-slate-950 font-mono text-emerald-400 text-xs overflow-y-auto space-y-2 select-text">
            <div className="text-slate-400 font-bold border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>RAW BANK STATEMENT OCR EXTRACTED TEXT PREVIEW</span>
              <span>File: {metadata.name || "Statement.pdf"}</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed">
              {metadata.rawTextPreview || previewData?.rawText || `APEX TRUST BANK - ACCOUNT STATEMENT
Statement Period: Oct 01, 2024 – Oct 31, 2024
Account Holder: ELEANOR V. VANCE (•••• 8492)
Opening Balance: $5,240.50 | Closing Balance: $7,118.35

${txItems.map(t => `${t.date} | ${t.referenceNo || 'REF'} | ${t.description} | DEBIT: $${t.debit.toFixed(2)} | CREDIT: $${t.credit.toFixed(2)} | BAL: $${t.balance.toFixed(2)}`).join('\n')}`}
            </pre>
          </div>
        ) : (
          /* Transactions Table with Selectable Rows and Selectable Columns (Seamless alignment, zero gaps) */
          <div className="flex-1 overflow-y-auto min-h-[350px]">
            <table className="w-full text-left text-xs border-collapse">
              
              {/* SELECTABLE COLUMN HEADERS */}
              <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-black text-slate-500 tracking-wider border-b border-slate-200 dark:border-slate-700 select-none">
                <tr>
                  {/* Row Checkbox Column */}
                  <th className="p-3.5 w-12 text-center bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700/50">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleSelectAll}
                      className="w-3.5 h-3.5 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                      title="Select/Deselect All Rows"
                    />
                  </th>

                  {visibleColumns.date && (
                    <th 
                      onClick={() => setSelectedColumnKey(selectedColumnKey === 'date' ? null : 'date')}
                      className={`p-3.5 w-32 cursor-pointer transition-colors border-r border-slate-200 dark:border-slate-700/50 ${selectedColumnKey === 'date' ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                      title="Click column to highlight"
                    >
                      <div className="flex items-center gap-1">
                        <span>Date</span>
                        {selectedColumnKey === 'date' && <Check className="w-3 h-3 text-sky-500" />}
                      </div>
                    </th>
                  )}

                  {visibleColumns.referenceNo && (
                    <th 
                      onClick={() => setSelectedColumnKey(selectedColumnKey === 'referenceNo' ? null : 'referenceNo')}
                      className={`p-3.5 w-32 cursor-pointer transition-colors border-r border-slate-200 dark:border-slate-700/50 ${selectedColumnKey === 'referenceNo' ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                      title="Click column to highlight"
                    >
                      <div className="flex items-center gap-1">
                        <span>Ref / Check #</span>
                        {selectedColumnKey === 'referenceNo' && <Check className="w-3 h-3 text-sky-500" />}
                      </div>
                    </th>
                  )}

                  {visibleColumns.description && (
                    <th 
                      onClick={() => setSelectedColumnKey(selectedColumnKey === 'description' ? null : 'description')}
                      className={`p-3.5 min-w-[220px] cursor-pointer transition-colors border-r border-slate-200 dark:border-slate-700/50 ${selectedColumnKey === 'description' ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                      title="Click column to highlight"
                    >
                      <div className="flex items-center gap-1">
                        <span>Description & Payee</span>
                        {selectedColumnKey === 'description' && <Check className="w-3 h-3 text-sky-500" />}
                      </div>
                    </th>
                  )}

                  {visibleColumns.category && (
                    <th 
                      onClick={() => setSelectedColumnKey(selectedColumnKey === 'category' ? null : 'category')}
                      className={`p-3.5 w-64 cursor-pointer transition-colors border-r border-slate-200 dark:border-slate-700/50 ${selectedColumnKey === 'category' ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                      title="Click column to highlight"
                    >
                      <div className="flex items-center gap-1">
                        <span>USA Bank Category</span>
                        {selectedColumnKey === 'category' && <Check className="w-3 h-3 text-sky-500" />}
                      </div>
                    </th>
                  )}

                  {visibleColumns.debit && (
                    <th 
                      onClick={() => setSelectedColumnKey(selectedColumnKey === 'debit' ? null : 'debit')}
                      className={`p-3.5 text-right w-32 cursor-pointer transition-colors border-r border-slate-200 dark:border-slate-700/50 ${selectedColumnKey === 'debit' ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                      title="Click column to highlight"
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Debit (- Outflow)</span>
                        {selectedColumnKey === 'debit' && <Check className="w-3 h-3 text-rose-500" />}
                      </div>
                    </th>
                  )}

                  {visibleColumns.credit && (
                    <th 
                      onClick={() => setSelectedColumnKey(selectedColumnKey === 'credit' ? null : 'credit')}
                      className={`p-3.5 text-right w-32 cursor-pointer transition-colors border-r border-slate-200 dark:border-slate-700/50 ${selectedColumnKey === 'credit' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                      title="Click column to highlight"
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Credit (+ Inflow)</span>
                        {selectedColumnKey === 'credit' && <Check className="w-3 h-3 text-emerald-500" />}
                      </div>
                    </th>
                  )}

                  {visibleColumns.balance && (
                    <th 
                      onClick={() => setSelectedColumnKey(selectedColumnKey === 'balance' ? null : 'balance')}
                      className={`p-3.5 text-right w-32 cursor-pointer transition-colors border-r border-slate-200 dark:border-slate-700/50 ${selectedColumnKey === 'balance' ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                      title="Click column to highlight"
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Running Balance</span>
                        {selectedColumnKey === 'balance' && <Check className="w-3 h-3 text-sky-500" />}
                      </div>
                    </th>
                  )}

                  {visibleColumns.aiConfidence && (
                    <th 
                      onClick={() => setSelectedColumnKey(selectedColumnKey === 'aiConfidence' ? null : 'aiConfidence')}
                      className={`p-3.5 text-center w-24 cursor-pointer transition-colors ${selectedColumnKey === 'aiConfidence' ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                      title="Click column to highlight"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>AI Conf.</span>
                        {selectedColumnKey === 'aiConfidence' && <Check className="w-3 h-3 text-purple-500" />}
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              {/* SELECTABLE ROWS & EDITABLE CELLS */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                {filteredTransactions.map((row) => {
                  const isSelected = selectedIds.has(row.id);
                  const isIncome = Number(row.credit || 0) > 0 || row.type === 'INCOME';

                  return (
                    <tr 
                      key={row.id}
                      onClick={() => handleToggleRow(row.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-sky-500/5 dark:bg-sky-500/10 hover:bg-sky-500/10' 
                          : 'opacity-55 hover:opacity-85 bg-slate-50/50 dark:bg-slate-900/40'
                      }`}
                    >
                      {/* Row Selection Checkbox */}
                      <td className="p-3.5 text-center border-r border-slate-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleRow(row.id)}
                          className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                        />
                      </td>

                      {/* Date Column */}
                      {visibleColumns.date && (
                        <td className={`p-3.5 whitespace-nowrap border-r border-slate-100 dark:border-slate-800 ${selectedColumnKey === 'date' ? 'bg-sky-500/10 dark:bg-sky-500/20' : ''}`} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="date"
                            value={row.date || '2024-10-31'}
                            onChange={(e) => handleUpdateRowField(row.id, 'date', e.target.value)}
                            className="w-full bg-transparent px-2 py-1 rounded-lg border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 font-mono text-slate-700 dark:text-slate-300 text-xs focus:outline-none transition-all"
                          />
                        </td>
                      )}

                      {/* Reference / Check # Column */}
                      {visibleColumns.referenceNo && (
                        <td className={`p-3.5 whitespace-nowrap font-mono text-[11px] text-slate-500 border-r border-slate-100 dark:border-slate-800 ${selectedColumnKey === 'referenceNo' ? 'bg-sky-500/10 dark:bg-sky-500/20' : ''}`} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={row.referenceNo || 'REF-AUTO'}
                            onChange={(e) => handleUpdateRowField(row.id, 'referenceNo', e.target.value)}
                            className="w-full bg-transparent px-2 py-1 rounded-lg border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 font-mono text-slate-500 text-xs focus:outline-none transition-all"
                          />
                        </td>
                      )}

                      {/* Description Column */}
                      {visibleColumns.description && (
                        <td className={`p-3.5 border-r border-slate-100 dark:border-slate-800 ${selectedColumnKey === 'description' ? 'bg-sky-500/10 dark:bg-sky-500/20' : ''}`} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={row.description || ''}
                            onChange={(e) => handleUpdateRowField(row.id, 'description', e.target.value)}
                            className="w-full bg-transparent px-2 py-1 rounded-lg border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 font-bold text-slate-900 dark:text-white text-xs focus:outline-none transition-all"
                            placeholder="Transaction description..."
                          />
                          {row.merchant && (
                            <div className="text-[10px] text-slate-400 font-medium px-2">Merchant: {row.merchant}</div>
                          )}
                        </td>
                      )}

                      {/* USA Category Column */}
                      {visibleColumns.category && (
                        <td className={`p-3.5 whitespace-nowrap border-r border-slate-100 dark:border-slate-800 ${selectedColumnKey === 'category' ? 'bg-sky-500/10 dark:bg-sky-500/20' : ''}`} onClick={(e) => e.stopPropagation()}>
                          <div className="relative">
                            <select
                              value={row.category || (isIncome ? 'Salary & Direct Deposit' : 'Other Expenses')}
                              onChange={(e) => handleUpdateRowField(row.id, 'category', e.target.value)}
                              className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                                isIncome 
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' 
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                              }`}
                            >
                              <optgroup label="🟢 USA Inflow / Income Categories">
                                {USA_BANK_CATEGORIES.INCOME.map(cat => (
                                  <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                  </option>
                                ))}
                              </optgroup>
                              <optgroup label="🔴 USA Outflow / Expense Categories">
                                {USA_BANK_CATEGORIES.EXPENSES.map(cat => (
                                  <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                  </option>
                                ))}
                              </optgroup>
                            </select>
                          </div>
                        </td>
                      )}

                      {/* Debit Column */}
                      {visibleColumns.debit && (
                        <td className={`p-3.5 text-right font-mono font-bold whitespace-nowrap border-r border-slate-100 dark:border-slate-800 ${selectedColumnKey === 'debit' ? 'bg-rose-500/10 dark:bg-rose-500/20' : ''}`} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="number"
                            step="0.01"
                            value={row.debit || ''}
                            onChange={(e) => handleUpdateRowField(row.id, 'debit', e.target.value)}
                            placeholder="0.00"
                            className="w-24 text-right bg-transparent px-2 py-1 rounded-lg border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-rose-500 focus:bg-white dark:focus:bg-slate-800 font-mono text-rose-600 dark:text-rose-400 font-bold text-xs focus:outline-none transition-all"
                          />
                        </td>
                      )}

                      {/* Credit Column */}
                      {visibleColumns.credit && (
                        <td className={`p-3.5 text-right font-mono font-bold whitespace-nowrap border-r border-slate-100 dark:border-slate-800 ${selectedColumnKey === 'credit' ? 'bg-emerald-500/10 dark:bg-emerald-500/20' : ''}`} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="number"
                            step="0.01"
                            value={row.credit || ''}
                            onChange={(e) => handleUpdateRowField(row.id, 'credit', e.target.value)}
                            placeholder="0.00"
                            className="w-24 text-right bg-transparent px-2 py-1 rounded-lg border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs focus:outline-none transition-all"
                          />
                        </td>
                      )}

                      {/* Balance Column */}
                      {visibleColumns.balance && (
                        <td className={`p-3.5 text-right font-mono font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap border-r border-slate-100 dark:border-slate-800 ${selectedColumnKey === 'balance' ? 'bg-sky-500/10 dark:bg-sky-500/20' : ''}`} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="number"
                            step="0.01"
                            value={row.balance || ''}
                            onChange={(e) => handleUpdateRowField(row.id, 'balance', e.target.value)}
                            className="w-24 text-right bg-transparent px-2 py-1 rounded-lg border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 font-mono text-slate-700 dark:text-slate-300 font-bold text-xs focus:outline-none transition-all"
                          />
                        </td>
                      )}

                      {/* AI Confidence Column */}
                      {visibleColumns.aiConfidence && (
                        <td className={`p-3.5 text-center whitespace-nowrap ${selectedColumnKey === 'aiConfidence' ? 'bg-purple-500/10 dark:bg-purple-500/20' : ''}`}>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                            {row.aiConfidence || 95}% AI
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredTransactions.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold">
                No transactions match your search query or type filter.
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Selected <strong className="text-slate-900 dark:text-white font-mono">{selectedTransactions.length}</strong> of {txItems.length} transactions to import into All Transactions.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleImport}
              disabled={selectedTransactions.length === 0}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-2xl font-extrabold text-xs text-white shadow-xl transition-all flex items-center justify-center gap-2 ${
                selectedTransactions.length > 0
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:scale-[1.02] active:scale-[0.98] shadow-emerald-500/25 cursor-pointer'
                  : 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Import Selected ({selectedTransactions.length}) to All Transactions</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
