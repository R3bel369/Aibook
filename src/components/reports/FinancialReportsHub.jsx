import React, { useState } from 'react';
import { FileSpreadsheet, FileText, Download, Filter, Calendar, CheckCircle2 } from 'lucide-react';
import { useFinancialData } from '../../context/FinancialDataContext';
import { useAuth } from '../../context/AuthContext';
import { exportTransactionsToExcel, exportProfitAndLossPDF } from '../../utils/exporter';
import ProfitAndLossReport from './ProfitAndLossReport';

const REPORTS = [
  { id: 'pnl', title: '1. Profit & Loss Report', description: 'Comprehensive income statement showing revenue, overhead, and net profit' },
  { id: 'income', title: '2. Income Report', description: 'Breakdown of client retainers, sales revenue, and consulting payouts' },
  { id: 'expense', title: '3. Expense Report', description: 'Categorized expenditure audit across salaries, rent, ads, and SaaS' },
  { id: 'cashflow', title: '4. Cash Flow Report', description: 'Opening balance, money in, money out, and liquid closing balances' },
  { id: 'category', title: '5. Category Spending Report', description: 'Distribution analysis of business spend across expense categories' },
  { id: 'monthly', title: '6. Monthly Financial Summary', description: 'Month-by-month accounting metrics ledger and MoM growth' },
  { id: 'audit', title: '7. Transaction Audit Report', description: 'Full line-item audit trail with AI confidence scores and bank ref numbers' }
];

export default function FinancialReportsHub() {
  const { transactions, financialTotals } = useFinancialData();
  const { user } = useAuth();
  const [activeReportId, setActiveReportId] = useState('pnl');

  const handleExportPDF = () => {
    exportProfitAndLossPDF(financialTotals, user, user.currency);
  };

  const handleExportExcel = () => {
    exportTransactionsToExcel(transactions, `Financial_Report_${activeReportId}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Financial Reports Center</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Generate, filter, and export audit-ready financial statements</p>
      </div>

      {/* Reports Grid Switcher */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORTS.map((rep) => (
          <div
            key={rep.id}
            onClick={() => setActiveReportId(rep.id)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              activeReportId === rep.id
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-md font-bold"
                : "glass-card border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold">{rep.title}</h4>
              {activeReportId === rep.id && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{rep.description}</p>
          </div>
        ))}
      </div>

      {/* Report Render Area */}
      {activeReportId === 'pnl' ? (
        <ProfitAndLossReport />
      ) : (
        <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {REPORTS.find(r => r.id === activeReportId)?.title}
              </h3>
              <p className="text-xs text-slate-400">Filter date ranges & export custom data tables</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPDF}
                className="px-3.5 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs shadow hover:bg-rose-600 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={handleExportExcel}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow hover:bg-emerald-600 flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          <div className="py-12 text-center text-slate-400 text-xs">
            {REPORTS.find(r => r.id === activeReportId)?.title} data generated automatically for active workspace. Click Export to download formatted file.
          </div>
        </div>
      )}
    </div>
  );
}
