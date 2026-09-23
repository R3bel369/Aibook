import React from 'react';
import { Upload, Eye, Sparkles, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    step: "Step 01",
    title: "Upload Bank Statement",
    description: "Drag and drop your PDF, Excel, CSV, or scanned image statement.",
    icon: Upload,
    color: "from-blue-500 to-indigo-600"
  },
  {
    step: "Step 02",
    title: "AI Reads Transactions",
    description: "OCR engine extracts dates, descriptions, debits, credits, and balances.",
    icon: Eye,
    color: "from-cyan-500 to-teal-600"
  },
  {
    step: "Step 03",
    title: "AI Categorizes Data",
    description: "Machine learning tags expenses into tax-friendly categories with confidence scores.",
    icon: Sparkles,
    color: "from-emerald-500 to-green-600"
  },
  {
    step: "Step 04",
    title: "Review & Approve",
    description: "Verify flags, edit categories, or let AI automatically approve high-confidence rows.",
    icon: CheckCircle2,
    color: "from-amber-500 to-orange-600"
  },
  {
    step: "Step 05",
    title: "Get Financial Insights",
    description: "View real-time P&L reports, subscription alerts, and AI chatbot advice.",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-600"
  }
];

export default function HowItWorksSection({ onNavigate }) {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-16">
        
        <div className="text-center space-y-4">
          <h2 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Seamless 5-Step Workflow
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            From Raw Bank Statement to Financial Clarity in Seconds
          </h3>
        </div>

        {/* Visual Workflow Steps */}
        <div className="grid md:grid-cols-5 gap-4 relative">
          {STEPS.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div key={idx} className="relative glass-card p-5 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{st.step}</span>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${st.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{st.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {st.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('upload')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:bg-emerald-600 transition-all"
          >
            <span>Test 5-Step Upload Workflow</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
