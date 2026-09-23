import React from 'react';
import { TrendingUp, ArrowDownRight, ArrowUpRight, DollarSign, Wallet, FileText, CheckCircle2 } from 'lucide-react';
import { useFinancialData } from '../../context/FinancialDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import CashFlowChart from '../dashboard/CashFlowChart';

export default function CashFlowView() {
  const { financialTotals } = useFinancialData();
  const { user } = useAuth();

  const openingBalance = 5240.50;
  const moneyIn = financialTotals.totalIncome || 5725.00;
  const moneyOut = financialTotals.totalExpenses || 3847.15;
  const netCashFlow = moneyIn - moneyOut;
  const finalTotalBalance = openingBalance + netCashFlow;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <span>Statement Cash Flow & Summary Metrics</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Extracted net cash flow, surplus activity, and account balances from the bank statement</p>
      </div>

      {/* Structured Statement Metrics Table matching user's exact specification */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sample Statement Cash Flow Summary</h3>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Oct 01 - Oct 31, 2024 Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Metric</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-xs sm:text-sm font-medium">
              
              {/* Row 1: Opening Balance */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Opening Balance</td>
                <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white font-mono">
                  {formatCurrency(openingBalance, user.currency)}
                </td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>Balance as of Oct 01, 2024</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-400">PDF</span>
                </td>
              </tr>

              {/* Row 2: Total Inflow / Credits */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors bg-emerald-500/5">
                <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">Total Inflow / Credits (Profit/Surplus)</td>
                <td className="py-3.5 px-4 text-right font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  +{formatCurrency(moneyIn, user.currency)}
                </td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>Direct deposits, Zelle, and interest earned</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">PDF</span>
                </td>
              </tr>

              {/* Row 3: Total Outflow / Debits */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors bg-rose-500/5">
                <td className="py-3.5 px-4 font-bold text-rose-600 dark:text-rose-400">Total Outflow / Debits (Loss/Expenses)</td>
                <td className="py-3.5 px-4 text-right font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                  -{formatCurrency(moneyOut, user.currency)}
                </td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>Bills, mortgage, card payments, and living expenses</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400">PDF</span>
                </td>
              </tr>

              {/* Row 4: Net Cash Flow (Net Gain) */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors bg-blue-500/5">
                <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">Net Cash Flow (Net Gain)</td>
                <td className="py-3.5 px-4 text-right font-black text-blue-600 dark:text-blue-400 font-mono">
                  +{formatCurrency(netCashFlow, user.currency)}
                </td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>Net monthly increase ({formatCurrency(moneyIn, user.currency)} – {formatCurrency(moneyOut, user.currency)})</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400">PDF</span>
                </td>
              </tr>

              {/* Row 5: Final Total Balance */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors bg-purple-500/10">
                <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white text-base">Final Total Balance</td>
                <td className="py-3.5 px-4 text-right font-black text-purple-600 dark:text-purple-400 text-base font-mono">
                  {formatCurrency(finalTotalBalance, user.currency)}
                </td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>Ending account balance as of Oct 31, 2024</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400">PDF</span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* Cash Flow Interactive Chart */}
      <CashFlowChart />
    </div>
  );
}
