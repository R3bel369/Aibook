import React, { useState } from 'react';
import { Upload, Play, Sparkles, ShieldCheck, ArrowRight, Bot, TrendingUp, CheckCircle, DollarSign, Activity } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function HeroSection({ onNavigate }) {
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <section className="relative overflow-hidden py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold shadow-lg">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>Next-Gen Autonomous Accounting AI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Your AI-Powered <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-600 bg-clip-text text-transparent">
                Bookkeeper & Analyst
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
              Upload bank statements in PDF, Excel, CSV, or images. Our intelligent AI extracts transactions, categorizes expenses with 99%+ accuracy, detects recurring subscriptions, and generates real-time P&L reports.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('upload')}
                className="group px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 text-white font-bold text-base shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Statement</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setShowDemoModal(true)}
                className="px-6 py-4 rounded-2xl glass-card text-slate-700 dark:text-slate-200 font-bold text-base hover:text-emerald-500 hover:border-emerald-500/50 transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700"
              >
                <Play className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                <span>Watch Demo (2 Min)</span>
              </button>
            </div>

            {/* Micro Trust Stats */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">99.2%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">AI Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">&lt; 5 Sec</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">PDF Processing</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">100%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Data Encryption</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Illustration Widget */}
          <div className="lg:col-span-5 relative">
            <div className="relative glass-card rounded-3xl p-6 shadow-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-6 glow-green animate-float">
              
              {/* Header Widget */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live AI Analysis</h3>
                    <p className="text-[11px] text-emerald-500 font-semibold">Statement: HDFC_Q3_Current.pdf</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Sync
                </span>
              </div>

              {/* Sample Metrics Widget */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-400 font-semibold">Total Revenue</div>
                  <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">₹4,25,000</div>
                  <div className="text-[10px] text-emerald-500 font-semibold mt-0.5">↑ +18.4% vs last month</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-400 font-semibold">Net Profit</div>
                  <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400 mt-1">₹1,95,000</div>
                  <div className="text-[10px] text-blue-500 font-semibold mt-0.5">Margin: 45.8%</div>
                </div>
              </div>

              {/* Floating Extracted Item */}
              <div className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-xl space-y-2 border border-slate-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-400 font-bold">GOOGLE ADS PAYMENT</span>
                  <span className="font-bold text-rose-400">-₹24,500</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                    Marketing & Ads (98% AI Conf)
                  </span>
                  <span>Extracted ✓</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Demo Video Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl glass-card rounded-3xl p-6 border border-slate-700 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-emerald-400" />
                AI Bookkeeping Platform Demo
              </h3>
              <button onClick={() => setShowDemoModal(false)} className="text-slate-400 hover:text-white font-bold">✕ Close</button>
            </div>
            <div className="aspect-video rounded-2xl bg-slate-950 flex flex-col items-center justify-center text-center p-8 space-y-4 border border-slate-800">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Bot className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Interactive Bank Statement Processing Demonstration</h4>
                <p className="text-xs text-slate-400 max-w-md mt-1">
                  Click "Launch Platform" to test real statement upload, AI categorization, P&L generation, and chatbot features right now!
                </p>
              </div>
              <button
                onClick={() => { setShowDemoModal(false); onNavigate('dashboard'); }}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
              >
                Open Demo Dashboard Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
