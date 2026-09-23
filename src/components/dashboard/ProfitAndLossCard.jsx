import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, ArrowDownRight, FileText, Download, Sparkles, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { useFinancialData } from '../../context/FinancialDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { exportProfitAndLossPDF } from '../../utils/exporter';

export default function ProfitAndLossCard({ onNavigate }) {
  const { financialTotals, transactions } = useFinancialData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('SUMMARY'); // 'SUMMARY' | 'INCOME_BREAKDOWN' | 'EXPENSE_BREAKDOWN'

  const totalRevenue = financialTotals.totalIncome || 0;
  const totalExpenses = financialTotals.totalExpenses || 0;
  const netProfit = totalRevenue - totalExpenses;
  const profitMarginPercent = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

  // Aggregate Top Income Categories
  const incomeBreakdown = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      if (t.type === 'INCOME' || Number(t.credit || 0) > 0) {
        const cat = t.category || 'Other Income';
        map[cat] = (map[cat] || 0) + Number(t.credit || 0);
      }
    });
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount, percentage: totalRevenue > 0 ? ((amount / totalRevenue) * 100).toFixed(1) : 0 }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, totalRevenue]);

  // Aggregate Top Expense Categories
  const expenseBreakdown = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      if (t.type === 'EXPENSE' || Number(t.debit || 0) > 0) {
        const cat = t.category || 'Other Expenses';
        map[cat] = (map[cat] || 0) + Number(t.debit || 0);
      }
    });
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount, percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : 0 }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, totalExpenses]);

  const handleExportPdf = (e) => {
    e.stopPropagation();
    exportProfitAndLossPDF(financialTotals, user, user.currency);
  };

  return (
    <div className="saas-card rounded-2xl p-5 sm:p-6 space-y-5 shadow-md border border-slate-200/80 dark:border-slate-800">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>P&L Financial Engine</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Profit & Loss Statement (P&L)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time ledger operating summary, net profit margin, and income vs expense breakdown.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportPdf}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Download PDF P&L Report"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>Export P&L PDF</span>
          </button>

          {onNavigate && (
            <button
              onClick={() => onNavigate('reports')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-sm transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Full P&L Report</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Metric Highlights Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Revenue */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Gross Income / Revenue
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              100% Total Inflow
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            +{formatCurrency(totalRevenue, user.currency)}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {incomeBreakdown.length} verified statement credit sources
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> Total Operating Expenses
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
              {totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100).toFixed(1) : 0}% of Inflow
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
            -{formatCurrency(totalExpenses, user.currency)}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {expenseBreakdown.length} operating overhead categories
          </div>
        </div>

        {/* Net Profit */}
        <div className={`p-4 rounded-2xl border space-y-1 ${
          netProfit >= 0 
            ? 'bg-sky-50/60 dark:bg-sky-950/30 border-sky-200/80 dark:border-sky-800/80' 
            : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
              netProfit >= 0 ? 'text-sky-700 dark:text-sky-400' : 'text-amber-700 dark:text-amber-400'
            }`}>
              <DollarSign className="w-3.5 h-3.5" /> Net Profit / Net Surplus
            </span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              netProfit >= 0 ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}>
              {profitMarginPercent}% Margin
            </span>
          </div>
          <div className={`text-2xl font-black font-mono ${
            netProfit >= 0 ? 'text-sky-600 dark:text-sky-400' : 'text-amber-600 dark:text-amber-400'
          }`}>
            {netProfit >= 0 ? '+' : ''}{formatCurrency(netProfit, user.currency)}
          </div>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {netProfit >= 0 ? "✅ Net Profit Surplus Achieved" : "⚠️ Operating Net Deficit"}
          </div>
        </div>
      </div>

      {/* Profit Margin Progress Meter */}
      <div className="space-y-1.5 p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between text-xs font-extrabold">
          <span className="text-slate-700 dark:text-slate-300">P&L Net Profit Margin Ratio</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400">{profitMarginPercent}% Net Margin</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
          <div 
            style={{ width: `${Math.min(Math.max(profitMarginPercent, 0), 100)}%` }} 
            className="bg-gradient-to-r from-emerald-500 to-sky-500 h-full rounded-full transition-all duration-500"
          />
        </div>
      </div>

      {/* Tabs for Summary / Income Breakdown / Expense Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('SUMMARY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'SUMMARY' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            P&L Summary Table
          </button>

          <button
            onClick={() => setActiveTab('INCOME_BREAKDOWN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'INCOME_BREAKDOWN' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Income Sources ({incomeBreakdown.length})
          </button>

          <button
            onClick={() => setActiveTab('EXPENSE_BREAKDOWN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'EXPENSE_BREAKDOWN' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Expense Items ({expenseBreakdown.length})
          </button>
        </div>

        {/* Tab 1: P&L Summary Table */}
        {activeTab === 'SUMMARY' && (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 font-extrabold text-slate-900 dark:text-white">
              <span className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" /> Total Revenue & Gross Deposits
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">+{formatCurrency(totalRevenue, user.currency)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 font-extrabold text-slate-900 dark:text-white">
              <span className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                <ArrowDownRight className="w-4 h-4 text-rose-500" /> Total Operating Expenses & Overhead
              </span>
              <span className="font-mono text-rose-600 dark:text-rose-400">-{formatCurrency(totalExpenses, user.currency)}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-black">
              <span>NET PROFIT / NET SURPLUS</span>
              <span className="font-mono text-emerald-400">{netProfit >= 0 ? '+' : ''}{formatCurrency(netProfit, user.currency)}</span>
            </div>
          </div>
        )}

        {/* Tab 2: Income Breakdown */}
        {activeTab === 'INCOME_BREAKDOWN' && (
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {incomeBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500 font-extrabold">{item.percentage}%</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+{formatCurrency(item.amount, user.currency)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Expense Breakdown */}
        {activeTab === 'EXPENSE_BREAKDOWN' && (
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {expenseBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500 font-extrabold">{item.percentage}%</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">-{formatCurrency(item.amount, user.currency)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
