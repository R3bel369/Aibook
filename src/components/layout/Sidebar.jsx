import React, { useState } from 'react';
import {
  LayoutDashboard,
  Upload,
  FileText,
  Receipt,
  CheckCheck,
  Tag,
  Sparkles,
  Bot,
  AlertTriangle,
  Repeat,
  FileSpreadsheet,
  TrendingUp,
  PieChart,
  DollarSign,
  User,
  Building2,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  FileCheck,
  Sliders,
  Building,
  Zap,
  ShieldAlert,
  Presentation,
  Globe,
  Mic
} from 'lucide-react';
import { useFinancialData } from '../../context/FinancialDataContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { financialTotals } = useFinancialData();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const GROUPS = [
    {
      title: 'CORE LEDGER',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'upload', label: 'Upload Statement', icon: Upload, badge: 'PDF AI' },
        { id: 'my-statements', label: 'My Statements', icon: FileText }
      ]
    },
    {
      title: 'AUTONOMOUS AGENTS',
      items: [
        { id: 'auto-agent', label: 'Nightly Agent', icon: Zap, highlight: true, badge: 'Auto' },
        { id: 'voice-agent', label: 'Voice & WhatsApp', icon: Mic, highlight: true }
      ]
    },
    {
      title: 'RECONCILIATION',
      items: [
        { id: 'reconciliation', label: '3-Way Receipt Match', icon: FileCheck, badge: 'OCR Split' }
      ]
    },
    {
      title: 'TRANSACTIONS',
      items: [
        { id: 'transactions', label: 'All Transactions', icon: Receipt },
        {
          id: 'review',
          label: 'Needs Review',
          icon: CheckCheck,
          count: financialTotals.needsReviewCount > 0 ? financialTotals.needsReviewCount : null,
          countColor: 'bg-amber-500 text-slate-950 font-black'
        },
        { id: 'uncategorized', label: 'Uncategorized', icon: Tag }
      ]
    },
    {
      title: 'TAX & SIMULATOR',
      items: [
        { id: 'simulator', label: 'What-If Simulator', icon: Sliders, badge: 'Runway' },
        { id: 'tax-genius', label: 'IRS Tax Radar & 1099', icon: Building, badge: 'Tax 1099' }
      ]
    },
    {
      title: 'AI INTELLIGENCE',
      items: [
        { id: 'insights', label: 'AI Insights', icon: Sparkles, badge: 'Live AI' },
        { id: 'ai-assistant', label: 'AI Bookkeeper', icon: Bot, highlight: true },
        { id: 'vampire-hunter', label: 'SaaS Vampire Hunter', icon: ShieldAlert, badge: 'Fraud' },
        { id: 'anomalies', label: 'Smart Alerts', icon: AlertTriangle },
        { id: 'recurring', label: 'Recurring Payments', icon: Repeat }
      ]
    },
    {
      title: 'TREASURY & DECKS',
      items: [
        { id: 'multi-entity', label: 'Multi-Entity Hub', icon: Globe, badge: 'FX' },
        { id: 'pitch-deck', label: 'Executive Board Deck', icon: Presentation, badge: '16:9 Deck' },
        { id: 'reports-summary', label: 'Financial Summary', icon: PieChart },
        { id: 'reports', label: 'Profit & Loss', icon: FileSpreadsheet },
        { id: 'cashflow', label: 'Cash Flow', icon: TrendingUp },
        { id: 'expense-report', label: 'Expense Report', icon: DollarSign }
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { id: 'settings-profile', label: 'Profile', icon: User },
        { id: 'accounts', label: 'Bank Accounts', icon: Building2 },
        { id: 'settings', label: 'AI Settings', icon: Settings, highlight: true },
        { id: 'security', label: 'Security', icon: Shield }
      ]
    }
  ];

  return (
    <aside
      className={`shrink-0 hidden lg:flex flex-col saas-card sticky top-20 h-[calc(100vh-5.5rem)] my-4 ml-4 transition-all duration-300 z-30 shadow-md ${
        isCollapsed ? 'w-20 p-3' : 'w-64 p-4'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all shadow-md z-40"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Brand Header */}
      <div className={`mb-6 flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
        <div className="w-10 h-10 rounded-2xl bg-sky-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-sky-500/20 shrink-0">
          AI
        </div>
        {!isCollapsed && (
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">AI Bookkeeper</h4>
            <p className="text-xs text-sky-600 dark:text-sky-400 font-extrabold">Fintech SaaS Engine</p>
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 space-y-5 overflow-y-auto pr-1">
        {GROUPS.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[11px] font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest mb-1.5">
                {group.title}
              </div>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <div key={item.id} className="relative group/nav">
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-xl text-xs transition-all ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-black'
                        : item.highlight
                        ? 'text-purple-700 dark:text-purple-300 font-black hover:bg-purple-500/10'
                        : 'text-slate-800 dark:text-slate-100 font-extrabold hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-sky-600 dark:hover:text-sky-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-purple-600 dark:text-purple-400' : 'text-slate-700 dark:text-slate-300'}`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                        isActive ? 'bg-white/20 text-white' : 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {!isCollapsed && item.count && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${item.countColor}`}>
                        {item.count}
                      </span>
                    )}
                  </button>

                  {/* Tooltip for Collapsed State */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-black whitespace-nowrap opacity-0 pointer-events-none group-hover/nav:opacity-100 transition-opacity z-50 shadow-xl">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Profile & Controls */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-xl text-xs font-black text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all`}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400 shrink-0" /> : <Moon className="w-4 h-4 text-slate-700 shrink-0" />}
          {!isCollapsed && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
        </button>

        <button
          onClick={logout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-xl text-xs font-black text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
