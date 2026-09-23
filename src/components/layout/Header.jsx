import React, { useState } from 'react';
import { Search, Bell, Upload, Sun, Moon, Building2, ChevronDown, CheckCircle2, Sparkles, HelpCircle, User, LogOut, Settings, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinancialData } from '../../context/FinancialDataContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationDropdown from './NotificationDropdown';
import GlobalSearchModal from './GlobalSearchModal';

export default function Header({ onUploadClick, onNavigate, onSelectTransaction }) {
  const { user, logout } = useAuth();
  const { bankAccounts, selectedAccountId, setSelectedAccountId, activeStatementInfo } = useFinancialData();
  const { unreadCount } = useNotifications();
  const { isDark, toggleTheme } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showStatementDropdown, setShowStatementDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const activeAccount = bankAccounts.find(a => a.id === selectedAccountId);

  return (
    <>
      <header className="sticky top-0 z-40 saas-card rounded-none border-x-0 border-t-0 border-b px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-sm">
        
        {/* Left: Global Search Input Trigger */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <button
            onClick={() => setShowSearchModal(true)}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-bold border border-slate-300 dark:border-slate-700 transition-all text-left shadow-inner"
          >
            <Search className="w-4 h-4 shrink-0 text-slate-600 dark:text-slate-400" />
            <span className="flex-1 truncate text-slate-700 dark:text-slate-300 font-bold">Search transactions, merchants, categories...</span>
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-extrabold bg-slate-200 dark:bg-slate-700 rounded-md text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600">⌘K</kbd>
          </button>
        </div>

        {/* Center / Right Selectors & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Statement Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowStatementDropdown(!showStatementDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-extrabold border border-slate-300 dark:border-slate-700 hover:border-sky-500 transition-all"
            >
              <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="max-w-[150px] truncate">
                {activeStatementInfo?.name || "sample_bank_statement.pdf"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            </button>

            {showStatementDropdown && (
              <div className="absolute right-0 mt-2 w-72 saas-card p-3 shadow-2xl z-50 border border-slate-300 dark:border-slate-700">
                <div className="px-2 py-1 text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Active Bank Statement
                </div>
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs space-y-1">
                  <div className="font-extrabold text-slate-900 dark:text-white truncate">
                    {activeStatementInfo?.name || "sample_bank_statement.pdf"}
                  </div>
                  <div className="text-xs font-bold text-sky-700 dark:text-sky-400">
                    Period: Oct 01 – Oct 31, 2026
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bank Account Selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-extrabold border border-slate-300 dark:border-slate-700 hover:border-sky-500 transition-all"
            >
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="max-w-[130px] truncate">
                {selectedAccountId === "ALL" ? "All Bank Accounts" : activeAccount?.bankName || "Account"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            </button>

            {showAccountDropdown && (
              <div className="absolute right-0 mt-2 w-64 saas-card p-2 shadow-2xl z-50 border border-slate-300 dark:border-slate-700">
                <div className="px-3 py-1.5 text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Filter Bank Accounts
                </div>
                <button
                  onClick={() => { setSelectedAccountId("ALL"); setShowAccountDropdown(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left ${
                    selectedAccountId === "ALL" ? "bg-sky-500/10 text-sky-700 dark:text-sky-400" : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>All Linked Accounts</span>
                  {selectedAccountId === "ALL" && <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />}
                </button>
                <div className="my-1 border-t border-slate-200 dark:border-slate-800" />
                {bankAccounts.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => { setSelectedAccountId(acc.id); setShowAccountDropdown(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left mb-1 ${
                      selectedAccountId === acc.id ? "bg-sky-500/10 text-sky-700 dark:text-sky-400 font-extrabold" : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                    }`}
                  >
                    <div>
                      <div className="font-extrabold">{acc.bankName}</div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">{acc.accountNumber}</div>
                    </div>
                    {selectedAccountId === acc.id && <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors border border-slate-300 dark:border-slate-700 shadow-sm"
            title="Toggle Light / Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors border border-slate-300 dark:border-slate-700 shadow-sm"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <NotificationDropdown
                onClose={() => setShowNotifications(false)}
                onNavigate={onNavigate}
              />
            )}
          </div>

          {/* Help Icon */}
          <button
            onClick={() => onNavigate('ai-assistant')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors border border-slate-300 dark:border-slate-700 hidden sm:block shadow-sm"
            title="AI Help & Bookkeeper Chat"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Profile Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 border-l border-slate-300 dark:border-slate-800"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8.5 h-8.5 rounded-xl object-cover ring-2 ring-sky-500/40 shadow-sm"
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 saas-card p-2 shadow-2xl z-50 space-y-1 border border-slate-300 dark:border-slate-700">
                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">{user.name}</div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">{user.email}</div>
                </div>
                <button
                  onClick={() => { onNavigate('settings-profile'); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                  <span>Profile Settings</span>
                </button>
                <button
                  onClick={() => { onNavigate('settings'); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                  <span>AI & Platform Settings</span>
                </button>
                <div className="border-t border-slate-200 dark:border-slate-800 my-1" />
                <button
                  onClick={() => { logout(); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Primary CTA: Upload Statement (Light Blue CTA) */}
          <button
            onClick={onUploadClick}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 ml-1"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Upload Statement</span>
          </button>

        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectTransaction={onSelectTransaction}
        onNavigate={onNavigate}
      />
    </>
  );
}
