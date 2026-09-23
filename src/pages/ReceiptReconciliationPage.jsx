import React, { useState } from 'react';
import { useFinancialData } from '../context/FinancialDataContext';
import { 
  FileCheck, 
  Split, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Image as ImageIcon, 
  ZoomIn, 
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Tag,
  Scissors
} from 'lucide-react';

export default function ReceiptReconciliationPage() {
  const { transactions, updateTransactionCategory } = useFinancialData();
  const [selectedTxId, setSelectedTxId] = useState(transactions[0]?.id || null);
  const [isSplitMode, setIsSplitMode] = useState(false);
  const [splitCategoryA, setSplitCategoryA] = useState('Office Supplies');
  const [splitAmountA, setSplitAmountA] = useState('');
  const [splitCategoryB, setSplitCategoryB] = useState('Food & Client Dining');
  const [requestSentIds, setRequestSentIds] = useState([]);
  const [reconciledIds, setReconciledIds] = useState(['tx_001', 'tx_003']);

  const selectedTx = transactions.find(t => t.id === selectedTxId) || transactions[0];

  const handleRequestReceipt = (id) => {
    if (!requestSentIds.includes(id)) {
      setRequestSentIds([...requestSentIds, id]);
    }
  };

  const handleApproveReconciliation = (id) => {
    if (!reconciledIds.includes(id)) {
      setReconciledIds([...reconciledIds, id]);
    }
  };

  const handleSaveSplit = () => {
    if (selectedTx) {
      updateTransactionCategory(selectedTx.id, `${splitCategoryA} / ${splitCategoryB}`, 'Split Itemized');
      setIsSplitMode(false);
      handleApproveReconciliation(selectedTx.id);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Autonomous Audit Copilot
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">3-Way Receipt & Invoice Reconciliation</h1>
          <p className="text-xs text-sky-200/80 max-w-2xl">
            Side-by-side visual matcher linking bank statement line items directly to physical OCR photo receipts with auto-splitting for multi-item invoices.
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-right">
            <span className="block text-[10px] text-sky-300 font-bold uppercase">Reconciliation Score</span>
            <span className="text-xl font-black text-emerald-400">94.8% Matched</span>
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Bank Statement Lines */}
        <div className="lg:col-span-5 saas-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-sky-500" /> Bank Statement Entries
              </h3>
              <p className="text-[11px] text-slate-500">Select a transaction to inspect matched receipt OCR</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[10px] font-black">
              {transactions.length} Line Items
            </span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {transactions.map((tx) => {
              const isSelected = selectedTxId === tx.id;
              const isReconciled = reconciledIds.includes(tx.id);
              const isRequested = requestSentIds.includes(tx.id);

              return (
                <div
                  key={tx.id}
                  onClick={() => { setSelectedTxId(tx.id); setIsSplitMode(false); }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-500 shadow-md ring-1 ring-sky-500/30'
                      : 'bg-white/50 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {tx.merchant || tx.description}
                        </span>
                        {isReconciled && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[9px] font-black">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Matched
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{tx.category}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900 dark:text-white">
                        ${Number(tx.debit || tx.credit || 0).toFixed(2)}
                      </div>
                      <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400">
                        {tx.aiConfidence || 92}% Confidence
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar inside Card */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono text-[10px]">ID: {tx.id}</span>
                    {isRequested ? (
                      <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1">
                        <Send className="w-3 h-3" /> Request Sent
                      </span>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRequestReceipt(tx.id); }}
                        className="text-sky-600 dark:text-sky-400 font-bold hover:underline"
                      >
                        Request Receipt SMS
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Visual OCR Receipt Canvas & Match Verification */}
        <div className="lg:col-span-7 space-y-6">
          {selectedTx ? (
            <div className="saas-card p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase">
                      OCR Verification
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Matched Receipt #REC-8841</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    {selectedTx.merchant || selectedTx.description}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSplitMode(!isSplitMode)}
                    className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                      isSplitMode
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200'
                    }`}
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    {isSplitMode ? 'Cancel Split' : 'Auto-Split Receipt'}
                  </button>

                  <button
                    onClick={() => handleApproveReconciliation(selectedTx.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Match
                  </button>
                </div>
              </div>

              {/* Split Mode Form */}
              {isSplitMode && (
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-purple-900 dark:text-purple-200 flex items-center gap-2">
                      <Split className="w-4 h-4 text-purple-500" /> Split Multi-Item Receipt Across GL Accounts
                    </h4>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                      Total: ${Number(selectedTx.debit || selectedTx.credit || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Split 1 Category (Business)</label>
                      <input
                        type="text"
                        value={splitCategoryA}
                        onChange={(e) => setSplitCategoryA(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Split 2 Category (Personal / Mixed)</label>
                      <input
                        type="text"
                        value={splitCategoryB}
                        onChange={(e) => setSplitCategoryB(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={handleSaveSplit}
                      className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-black shadow-md hover:bg-purple-500"
                    >
                      Confirm Itemized Split
                    </button>
                  </div>
                </div>
              )}

              {/* Visual OCR Bounding Box Mockup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900 p-4 rounded-2xl text-white">
                
                {/* Visual Paper Receipt Mockup */}
                <div className="relative bg-amber-50 text-slate-900 p-5 rounded-xl font-mono text-xs shadow-inner space-y-3 border border-amber-200/50">
                  <div className="text-center border-b border-dashed border-slate-400 pb-2">
                    <h5 className="font-black text-sm uppercase">{selectedTx.merchant || selectedTx.description}</h5>
                    <p className="text-[10px] text-slate-500">STORE #4092 • TAX ID: 94-28104</p>
                    <p className="text-[10px] text-slate-500">{selectedTx.date} • 14:32 PST</p>
                  </div>

                  <div className="space-y-1 py-1">
                    {/* Highlighted Bounding Box OCR Crop */}
                    <div className="p-1.5 rounded bg-emerald-500/20 border border-emerald-600 ring-2 ring-emerald-400/40 relative">
                      <div className="absolute -top-2.5 right-1 px-1.5 py-0.5 rounded bg-emerald-600 text-[8px] text-white font-sans font-black uppercase">
                        AI OCR Match 99.4%
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>OFFICE SUPPLIES / ITEMS</span>
                        <span>${(Number(selectedTx.debit || selectedTx.credit || 100) * 0.85).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>STATE TAX (8.25%)</span>
                      <span>${(Number(selectedTx.debit || selectedTx.credit || 100) * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>MERCHANT TIP</span>
                      <span>${(Number(selectedTx.debit || selectedTx.credit || 100) * 0.07).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-slate-400 pt-2 flex justify-between font-black text-sm">
                    <span>TOTAL AUTHORIZED</span>
                    <span className="text-emerald-700">${Number(selectedTx.debit || selectedTx.credit || 0).toFixed(2)}</span>
                  </div>

                  <div className="text-center pt-2 text-[9px] text-slate-400 uppercase">
                    *** CUSTOMER COPY - THANK YOU ***
                  </div>
                </div>

                {/* AI Extracted Field Map */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> AI Confidence Breakdown
                    </h4>

                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between items-center text-xs">
                        <span className="text-slate-400">Vendor Identity:</span>
                        <span className="font-black text-emerald-400">100% Match</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between items-center text-xs">
                        <span className="text-slate-400">Amount Variance:</span>
                        <span className="font-black text-emerald-400">$0.00 (Exact)</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between items-center text-xs">
                        <span className="text-slate-400">Tax Breakdown:</span>
                        <span className="font-bold text-sky-300">IRS Compliant</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between items-center text-xs">
                        <span className="text-slate-400">GL Code Target:</span>
                        <span className="font-bold text-purple-300">{selectedTx.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-[11px] text-sky-200">
                    💡 <strong>Autonomous Audit Tip:</strong> High-confidence visual receipt matches do not require manual audit sampling during tax filings.
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="saas-card p-12 text-center text-slate-400">
              Select a transaction to inspect OCR receipt matching.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
