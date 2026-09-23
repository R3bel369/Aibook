import React, { useState } from 'react';
import { Bot, Sun, Moon, ArrowRight, ShieldCheck, Sparkles, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ onNavigate, onOpenDemo }) {
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-emerald-600 to-blue-600 dark:from-white dark:via-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
                AI Bookkeeping
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Intelligent Platform</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button onClick={() => onNavigate('landing')} className="hover:text-emerald-500 transition-colors">Home</button>
            <a href="#features" className="hover:text-emerald-500 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-500 transition-colors">How It Works</a>
            <a href="#security" className="hover:text-emerald-500 transition-colors">Security</a>
            <button onClick={() => onNavigate('dashboard')} className="hover:text-emerald-500 transition-colors">Demo Dashboard</button>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-all border border-slate-200 dark:border-slate-700"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            <button
              onClick={() => onNavigate('auth')}
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-500 transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <button onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 font-medium text-slate-700 dark:text-slate-200">Home</button>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-medium text-slate-700 dark:text-slate-200">Features</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-medium text-slate-700 dark:text-slate-200">How It Works</a>
          <a href="#security" onClick={() => setMobileMenuOpen(false)} className="block py-2 font-medium text-slate-700 dark:text-slate-200">Security</a>
          <div className="pt-2 flex flex-col gap-2">
            <button onClick={() => { onNavigate('auth'); setMobileMenuOpen(false); }} className="w-full py-2.5 text-center font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl">Sign In</button>
            <button onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }} className="w-full py-2.5 text-center font-semibold text-white bg-emerald-500 rounded-xl">Launch App</button>
          </div>
        </div>
      )}
    </nav>
  );
}
