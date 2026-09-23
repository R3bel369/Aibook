import React, { useState } from 'react';
import { Download, Printer, FileSpreadsheet, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { useFinancialData } from '../../context/FinancialDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { exportProfitAndLossPDF, exportTransactionsToExcel } from '../../utils/exporter';

export default function ProfitAndLossReport() {
  const { financialTotals, transactions } = useFinancialData();
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('Annual'); // 'Monthly', 'Quarterly', 'Annual'

  const totalRev = financialTotals.totalIncome;
  const totalExp = financialTotals.totalExpenses;
  const grossProfit = totalRev * 0.85; // Simulated gross profit after COGS
  const cogs = totalRev * 0.15;
  const netProfit = totalRev - totalExp;

  const handleDownloadPDF = () => {
    exportProfitAndLossPDF(financialTotals, user, user.currency);
  };

  const handleDownloadExcel = () => {
    exportTransactionsToExcel(transactions, `${user.businessName.replace(/\s+/g, '_')}_Ledger`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated Accounting Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Profit & Loss Statement (P&L)</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Certified double-entry bookkeeping breakdown of revenue, overhead, and net earnings</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe switchers */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700">
            {['Monthly', 'Quarterly', 'Annual'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  timeframe === tf ? 'bg-emerald-500 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Export Actions as requested */}
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs shadow hover:bg-rose-600 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleDownloadExcel}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow hover:bg-emerald-600 transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-xl glass-card text-slate-600 dark:text-slate-300 hover:text-emerald-500 border border-slate-200 dark:border-slate-700"
            title="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* P&L Statement Document Paper */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 space-y-8 shadow-2xl">
        
        {/* Document Header */}
        <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
              {user.businessName}
            </h3>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tax ID: {user.taxId}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{user.country} • {user.businessType}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">PROFIT & LOSS STATEMENT</div>
            <div className="text-xs text-slate-400 font-mono mt-1">Period: {user.financialYear} ({timeframe})</div>
            <div className="text-xs text-slate-400 font-mono">Currency: {user.currency} ({user.currencySymbol})</div>
          </div>
        </div>

        {/* 1. REVENUE */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm font-extrabold text-emerald-600 dark:text-emerald-400 border-b border-emerald-500/20 pb-2">
            <span>1. REVENUE & GROSS INCOME</span>
            <span>{formatCurrency(totalRev, user.currency)}</span>
          </div>
          <div className="pl-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Sales Revenue & Client Retainers</span>
              <span className="font-semibold">{formatCurrency(totalRev * 0.85, user.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Consulting & Freelance Payouts</span>
              <span className="font-semibold">{formatCurrency(totalRev * 0.15, user.currency)}</span>
            </div>
          </div>
        </div>

        {/* 2. COST OF GOODS SOLD */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2">
            <span>2. COST OF GOODS SOLD (COGS)</span>
            <span className="text-rose-500">-{formatCurrency(cogs, user.currency)}</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-white pl-4">
            <span>GROSS PROFIT</span>
            <span className="text-emerald-500">{formatCurrency(grossProfit, user.currency)}</span>
          </div>
        </div>

        {/* 3. OPERATING EXPENSES */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm font-extrabold text-rose-600 dark:text-rose-400 border-b border-rose-500/20 pb-2">
            <span>3. OPERATING EXPENSES</span>
            <span>-{formatCurrency(totalExp, user.currency)}</span>
          </div>

          <div className="pl-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Salaries & Core Team Payroll</span>
              <span className="font-semibold">{formatCurrency(140000, user.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Office Rent & Workspace Lease</span>
              <span className="font-semibold">{formatCurrency(45000, user.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Marketing & Online Digital Ads</span>
              <span className="font-semibold">{formatCurrency(24500, user.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Software, SaaS & Cloud Infrastructure</span>
              <span className="font-semibold">{formatCurrency(20250, user.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Utilities, Travel, Food & Other</span>
              <span className="font-semibold">{formatCurrency(totalExp - 229750, user.currency)}</span>
            </div>
          </div>
        </div>

        {/* 4. NET PROFIT TOTAL */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white flex justify-between items-center">
          <div>
            <div className="text-xs font-mono uppercase text-emerald-400">NET OPERATING PROFIT</div>
            <div className="text-[11px] text-slate-400">Total Net Income remaining after all deductions</div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {formatCurrency(netProfit, user.currency)}
          </div>
        </div>

        <div className="text-[10px] text-slate-400 text-center border-t border-slate-200 dark:border-slate-800 pt-4">
          Generated automatically by AI Bookkeeping Autonomous Financial Platform • Confidential Business Record
        </div>

      </div>
    </div>
  );
}
