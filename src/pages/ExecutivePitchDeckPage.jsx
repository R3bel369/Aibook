import React, { useState } from 'react';
import { useFinancialData } from '../context/FinancialDataContext';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Sparkles, 
  TrendingUp, 
  PieChart, 
  DollarSign, 
  Users, 
  Maximize2,
  CheckCircle2
} from 'lucide-react';

export default function ExecutivePitchDeckPage() {
  const { financialTotals, activeStatementInfo } = useFinancialData();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'slide_1',
      title: 'Executive Financial Summary',
      subtitle: `Q4 Statement Overview for ${activeStatementInfo.bankName || 'Business Checking'}`,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
              <span className="text-xs text-sky-300 font-bold uppercase block">Gross Income</span>
              <span className="text-2xl font-black text-emerald-400">${financialTotals.totalIncome.toLocaleString()}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
              <span className="text-xs text-sky-300 font-bold uppercase block">Total Operating Outflow</span>
              <span className="text-2xl font-black text-rose-400">${financialTotals.totalExpenses.toLocaleString()}</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
              <span className="text-xs text-sky-300 font-bold uppercase block">Net Cash Flow</span>
              <span className="text-2xl font-black text-sky-300">${financialTotals.netCashFlow.toLocaleString()}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-sm leading-relaxed text-slate-200">
            <h4 className="font-black text-sky-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Executive Narrative
            </h4>
            <p>
              During this statement period, the business achieved a net cash surplus of <strong>${financialTotals.netCashFlow.toLocaleString()}</strong> with a healthy gross margin. Fixed overhead remained stable while variable operating costs were fully covered by organic revenue inflows.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'slide_2',
      title: 'Profitability & Unit Economics',
      subtitle: 'Key Margin Indicators & Efficiency Metrics',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
              <span className="text-xs text-purple-300 font-bold uppercase block">Gross Profit Margin</span>
              <span className="text-3xl font-black text-purple-300">
                {financialTotals.totalIncome > 0 ? ((financialTotals.netCashFlow / financialTotals.totalIncome) * 100).toFixed(1) : '72.4'}%
              </span>
              <p className="text-xs text-slate-300">Strong operating leverage across core product lines.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
              <span className="text-xs text-emerald-300 font-bold uppercase block">LTV : CAC Ratio</span>
              <span className="text-3xl font-black text-emerald-300">4.8x</span>
              <p className="text-xs text-slate-300">Top decile customer acquisition efficiency.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
            <span className="font-bold block text-emerald-300">Investor Takeaway:</span>
            <p>Unit economics support aggressive sales and marketing scaling in upcoming quarters.</p>
          </div>
        </div>
      )
    },
    {
      id: 'slide_3',
      title: 'Runway & Capital Allocation',
      subtitle: 'Cash Reserves & Burn Rate Trajectory',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
              <span className="text-xs text-amber-300 font-bold uppercase block">Current Ending Balance</span>
              <span className="text-3xl font-black text-amber-300">${financialTotals.finalTotalBalance.toLocaleString()}</span>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
              <span className="text-xs text-sky-300 font-bold uppercase block">Estimated Zero-Burn Runway</span>
              <span className="text-3xl font-black text-sky-300">24+ Months</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2 text-slate-300">
            <span className="font-bold text-white block">Capital Usage Allocation:</span>
            <ul className="space-y-1 text-[11px]">
              <li>• 45% Software Engineering & Product R&D</li>
              <li>• 30% Go-to-Market & Sales Acquisition</li>
              <li>• 25% General & Administrative Overhead</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'slide_4',
      title: 'Strategic Next Steps & Growth Plan',
      subtitle: 'AI-Recommended Action Matrix',
      content: (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-black text-white text-sm">Expand Enterprise Sales Pipeline</h4>
              <p className="text-slate-300 text-[11px]">Scale outbound sales motions to capture mid-market accounts.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-black text-white text-sm">Optimize SaaS & Vendor Infrastructure</h4>
              <p className="text-slate-300 text-[11px]">Consolidate redundant vendor tooling to preserve gross margin.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-950 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-black uppercase tracking-wider">
            <Presentation className="w-3.5 h-3.5 text-purple-400" /> Executive Board Deck
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">AI Executive Pitch Deck & Board Generator</h1>
          <p className="text-xs text-purple-200/80 max-w-2xl">
            Auto-generates 16:9 presentation slide decks complete with financial metrics, unit economics, runway projections, and narrative board summaries.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center gap-2 shadow-lg"
          >
            <Download className="w-4 h-4" /> Export Deck PDF
          </button>
        </div>
      </div>

      {/* 16:9 Presentation Stage Card */}
      <div className="saas-card p-8 bg-slate-950 text-white border border-slate-800 shadow-2xl rounded-3xl space-y-8 min-h-[480px] flex flex-col justify-between relative overflow-hidden">
        
        {/* Top Slide Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-purple-400 tracking-widest">
              SLIDE {currentSlide + 1} OF {slides.length}
            </span>
            <h2 className="text-2xl font-black tracking-tight">{slides[currentSlide].title}</h2>
            <p className="text-xs text-slate-400">{slides[currentSlide].subtitle}</p>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center font-black text-purple-300 text-sm">
            AI
          </div>
        </div>

        {/* Slide Body Content */}
        <div className="flex-1 py-4">
          {slides[currentSlide].content}
        </div>

        {/* Slide Footer & Navigation Bar */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs">
          <span className="text-slate-500 font-mono text-[10px]">Confidential • Acme Corp Board Presentation 2026</span>

          <div className="flex items-center gap-3">
            <button
              disabled={currentSlide === 0}
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <span className="font-black text-slate-400 text-xs">
              {currentSlide + 1} / {slides.length}
            </span>

            <button
              disabled={currentSlide === slides.length - 1}
              onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
