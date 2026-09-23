import React, { useState } from 'react';
import { LayoutDashboard, Receipt, FileSpreadsheet, Bot, Sparkles, ArrowRight } from 'lucide-react';

export default function DashboardPreviewSection({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
          Interactive Interface Preview
        </h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Designed for Clarity, Speed, & Total Financial Control
        </h3>
      </div>

      {/* Switcher Buttons */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'glass-card text-slate-600 dark:text-slate-300 hover:text-emerald-500'
          }`}
        >
          Financial Dashboard
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'transactions'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'glass-card text-slate-600 dark:text-slate-300 hover:text-emerald-500'
          }`}
        >
          Transaction Ledger & AI
        </button>
        <button
          onClick={() => setActiveTab('pnl')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pnl'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              : 'glass-card text-slate-600 dark:text-slate-300 hover:text-emerald-500'
          }`}
        >
          Automated P&L Reports
        </button>
      </div>

      {/* Mock Container */}
      <div className="glass-card rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700/80 space-y-6 glow-purple">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-400 font-mono ml-2">app.aibookkeeping.io/dashboard</span>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-500/20"
          >
            Launch Full Interactive App →
          </button>
        </div>

        {/* Tab Content Preview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Total Revenue</div>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1">₹4,25,000</div>
              </div>
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <div className="text-xs text-rose-600 dark:text-rose-400 font-bold">Total Expenses</div>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1">₹2,32,949</div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-bold">Net Profit</div>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1">₹1,92,051</div>
              </div>
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <div className="text-xs text-purple-600 dark:text-purple-400 font-bold">Current Balance</div>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-1">₹8,23,050</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
              <div className="flex justify-between text-xs text-emerald-400 font-bold">
                <span>AI Insights Feed</span>
                <span>4 Active Alerts</span>
              </div>
              <p className="text-xs text-slate-300">
                📈 Revenue is up +18% MoM. Software expenses surged +25%. 1 unusual debit flagged for review.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">GOOGLE ADS PAYMENT</div>
                <div className="text-[10px] text-slate-400">Marketing & Advertising • 98% AI Confidence</div>
              </div>
              <div className="font-bold text-rose-500">-₹24,500.00</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">ACME CORP CONSULTING INVOICE</div>
                <div className="text-[10px] text-slate-400">Sales Revenue • 99% AI Confidence</div>
              </div>
              <div className="font-bold text-emerald-500">+₹1,85,000.00</div>
            </div>
          </div>
        )}

        {activeTab === 'pnl' && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Automated Profit & Loss Statement (YTD)</h4>
            <div className="flex justify-between text-xs py-1 border-b border-slate-200 dark:border-slate-700">
              <span>Gross Sales Revenue</span>
              <span className="font-bold text-emerald-500">₹4,25,000.00</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-slate-200 dark:border-slate-700">
              <span>Operating Expenses (Salaries, Rent, Ads)</span>
              <span className="font-bold text-rose-500">-₹2,32,949.00</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-blue-500 pt-1">
              <span>Net Profit After Operating Overhead</span>
              <span>₹1,92,051.00</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
