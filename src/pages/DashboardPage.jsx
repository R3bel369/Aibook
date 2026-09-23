import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Upload,
  Sparkles,
  ArrowRight,
  Receipt,
  RotateCcw,
  FileText
} from 'lucide-react';
import { useFinancialData } from '../context/FinancialDataContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import MetricCard from '../components/dashboard/MetricCard';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import CategoryDonutChart from '../components/dashboard/CategoryDonutChart';
import VisualCashFlowFlowchart from '../components/dashboard/VisualCashFlowFlowchart';
import IncomeSourcesCard from '../components/dashboard/IncomeSourcesCard';
import ProfitAndLossCard from '../components/dashboard/ProfitAndLossCard';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionDetailsDrawer from '../components/transactions/TransactionDetailsDrawer';

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const { financialTotals, activeStatementInfo, resetDemoData, transactions } = useFinancialData();
  const [selectedTx, setSelectedTx] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const needsReviewCount = financialTotals.needsReviewCount || 0;

  return (
    <div className="space-y-6">
      
      {/* 1. Compact Dashboard Header */}
      <div className="saas-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Good Morning, {user.name.split(' ')[0]} 👋
          </h2>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Here's your financial overview based on your latest bank statement.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 font-extrabold border border-slate-200 dark:border-slate-700">
              <FileText className="w-3.5 h-3.5 text-sky-500" />
              <span>Active Statement: <strong className="text-sky-600 dark:text-sky-400">{activeStatementInfo?.name || "sample_bank_statement.pdf"}</strong></span>
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-700 dark:text-slate-300 font-bold">
              Period: <strong className="text-slate-900 dark:text-white">Oct 01 – Oct 31, 2026</strong>
            </span>
          </div>
        </div>

        {/* Compact Header Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('my-statements')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Statement</span>
          </button>

          <button
            onClick={() => onNavigate('upload')}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Statement</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Reset dashboard analysis data back to sample statement?")) {
                resetDemoData();
              }
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
            title="Reset Analysis Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Key Financial Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* TOTAL INCOME */}
        <MetricCard
          title="TOTAL INCOME"
          amount={financialTotals.totalIncome}
          percentage="↑ 12% vs previous period"
          isPositive={true}
          icon={TrendingUp}
          color="blue"
          infoTooltip="Total revenue and deposits extracted from statement credits."
        />

        {/* TOTAL EXPENSES */}
        <MetricCard
          title="TOTAL EXPENSES"
          amount={financialTotals.totalExpenses}
          percentage="↑ 8% vs previous period"
          isPositive={false}
          icon={TrendingDown}
          color="rose"
          infoTooltip="Total debits and living expenditures."
        />

        {/* NET CASH FLOW */}
        <MetricCard
          title="NET CASH FLOW"
          amount={financialTotals.netCashFlow}
          percentage="↑ 16% net gain"
          isPositive={financialTotals.netCashFlow >= 0}
          icon={DollarSign}
          color="blue"
          infoTooltip="Net profit surplus (Total Income – Total Expenses)."
        />

        {/* TRANSACTIONS */}
        <MetricCard
          title="TRANSACTIONS"
          amount={transactions.length}
          percentage={`${needsReviewCount} need review`}
          isPositive={needsReviewCount === 0}
          icon={Receipt}
          color="purple"
          infoTooltip="Total transaction line items parsed from statement."
          isCount={true}
        />

        {/* ENDING BALANCE */}
        <MetricCard
          title="ENDING BALANCE"
          amount={financialTotals.finalTotalBalance}
          percentage="Oct 31, 2026"
          isPositive={true}
          icon={Wallet}
          color="indigo"
          infoTooltip="Ending account ledger balance as of statement close."
        />
      </div>

      {/* 3. AI Insight Banner */}
      <div className="saas-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-l-purple-600 bg-purple-500/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-black text-purple-700 dark:text-purple-400 uppercase tracking-widest block">
              ✨ AI Insight
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              "Your income exceeded your expenses by {formatCurrency(financialTotals.netCashFlow, 'USD')} during this statement period."
            </span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('insights')}
          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-sm transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <span>View All Insights</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. PROFIT & LOSS STATEMENT (P&L) FEATURE CARD ON DASHBOARD */}
      <ProfitAndLossCard onNavigate={onNavigate} />

      {/* 5. Main Responsive Grid (Charts & Category Analytics) */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <IncomeExpenseChart />
        </div>
        <div className="lg:col-span-4">
          <CategoryDonutChart />
        </div>
      </div>

      {/* 6. Visual Cash Flow Pipeline + Income Sources Breakdown */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <VisualCashFlowFlowchart />
        </div>
        <div className="lg:col-span-5">
          <IncomeSourcesCard />
        </div>
      </div>

      {/* 7. Extracted Statement Transactions Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Recent Extracted Statement Transactions
            </h3>
            <p className="text-xs text-slate-500">Click any row to inspect AI rules or edit categories</p>
          </div>
        </div>

        <TransactionTable 
          onSelectTransaction={(tx) => setSelectedTx(tx)}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      </div>

      {/* Drawer */}
      {selectedTx && (
        <TransactionDetailsDrawer
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}

    </div>
  );
}
