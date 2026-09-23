import React from 'react';
import {
  Sparkles,
  Receipt,
  FileSpreadsheet,
  TrendingUp,
  Repeat,
  Bot,
  ShieldCheck,
  Calculator,
  ArrowRight
} from 'lucide-react';

const FEATURES = [
  {
    icon: Sparkles,
    color: "from-emerald-500 to-teal-600",
    title: "AI Transaction Categorization",
    description: "Automatic machine-learning categorization for all bank credits and debits with 99.2% accuracy and confidence scoring."
  },
  {
    icon: Receipt,
    color: "from-blue-500 to-indigo-600",
    title: "Automatic Expense Tracking",
    description: "Instant vendor matching, tax classification, and expense tagging across office, travel, utilities, software, and payroll."
  },
  {
    icon: FileSpreadsheet,
    color: "from-purple-500 to-pink-600",
    title: "Bank Statement Analysis",
    description: "Upload statements in PDF, CSV, XLSX, JPG, or PNG. OCR engine parses dates, reference numbers, debits, credits, and balances."
  },
  {
    icon: TrendingUp,
    color: "from-amber-500 to-orange-600",
    title: "Smart Financial Insights",
    description: "Proactive automated notifications on expense surges, revenue trends, potential tax deductions, and cash flow dips."
  },
  {
    icon: Repeat,
    color: "from-cyan-500 to-blue-600",
    title: "Recurring Payment Detection",
    description: "Automatic identification of recurring subscriptions like AWS, Netflix, Google Workspace, lease rents, and loan EMIs."
  },
  {
    icon: Bot,
    color: "from-emerald-500 to-green-600",
    title: "AI Bookkeeping Assistant",
    description: "Interactive natural language assistant. Ask 'How much did I spend on marketing?' or 'What is my net profit?' for instant answers."
  },
  {
    icon: Calculator,
    color: "from-rose-500 to-red-600",
    title: "Financial Reports & P&L",
    description: "Automated Profit & Loss statements, Cash Flow summaries, and Ledger exports available in PDF, Excel, and CSV."
  },
  {
    icon: ShieldCheck,
    color: "from-teal-500 to-emerald-600",
    title: "Tax Preparation Support",
    description: "Classify business vs personal expenses, attach digital receipt records, and export audit-ready financial statement summaries."
  }
];

export default function FeaturesSection({ onNavigate }) {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
          Comprehensive Feature Set
        </h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Everything You Need for Autonomous Financial Management
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base">
          Built for small businesses, freelancers, startups, shop owners, and accountants to eliminate manual bookkeeping forever.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="group glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                  {feat.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer" onClick={() => onNavigate('dashboard')}>
                <span>Try feature</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
