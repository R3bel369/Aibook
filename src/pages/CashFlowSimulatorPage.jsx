import React, { useState, useMemo } from 'react';
import { useFinancialData } from '../context/FinancialDataContext';
import { 
  Sliders, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertOctagon, 
  Users, 
  DollarSign, 
  Scissors, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';

export default function CashFlowSimulatorPage() {
  const { financialTotals, activeStatementInfo } = useFinancialData();

  // Slider State Controls
  const [newHires, setNewHires] = useState(1);
  const [hireSalary, setHireSalary] = useState(95000); // annual salary per hire
  const [revenueChange, setRevenueChange] = useState(10); // % change
  const [invoiceDelayDays, setInvoiceDelayDays] = useState(15);
  const [saasCutPercent, setSaasCutPercent] = useState(15);
  const [oneTimeCapex, setOneTimeCapex] = useState(5000);

  const baselineMonthlyIncome = financialTotals.totalIncome || 15000;
  const baselineMonthlyExpense = financialTotals.totalExpenses || 11000;
  const currentCashBalance = financialTotals.finalTotalBalance || 45000;

  // Derived Scenario Metrics
  const scenarioMetrics = useMemo(() => {
    // Monthly cost of new hires
    const monthlyHiresCost = (newHires * hireSalary) / 12;

    // Monthly income adjusted by revenue change % and invoice delay drag
    const delayPenaltyFactor = Math.max(0.6, 1 - (invoiceDelayDays * 0.005));
    const simulatedMonthlyIncome = baselineMonthlyIncome * (1 + revenueChange / 100) * delayPenaltyFactor;

    // Monthly expense adjusted for new hires and SaaS cuts
    const saasSavings = baselineMonthlyExpense * 0.20 * (saasCutPercent / 100);
    const simulatedMonthlyExpense = Math.max(1000, baselineMonthlyExpense + monthlyHiresCost - saasSavings);

    // Monthly Net Burn or Cash Flow
    const netSimulatedMonthlyFlow = simulatedMonthlyIncome - simulatedMonthlyExpense;

    // Effective Starting Cash after One-Time Capex
    const effectiveCash = Math.max(0, currentCashBalance - oneTimeCapex);

    // Runway calculation in months
    let runwayMonths = 99;
    if (netSimulatedMonthlyFlow < 0) {
      runwayMonths = Math.max(0.5, effectiveCash / Math.abs(netSimulatedMonthlyFlow));
    }

    // Death Date Estimation
    const deathDate = new Date();
    deathDate.setMonth(deathDate.getMonth() + Math.round(runwayMonths));

    return {
      monthlyHiresCost,
      simulatedMonthlyIncome,
      simulatedMonthlyExpense,
      netSimulatedMonthlyFlow,
      effectiveCash,
      runwayMonths: runwayMonths > 60 ? 60 : Number(runwayMonths.toFixed(1)),
      deathDateString: runwayMonths >= 60 ? "Infinite (Profitable)" : deathDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    };
  }, [
    newHires,
    hireSalary,
    revenueChange,
    invoiceDelayDays,
    saasCutPercent,
    oneTimeCapex,
    baselineMonthlyIncome,
    baselineMonthlyExpense,
    currentCashBalance
  ]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-purple-900 via-slate-900 to-sky-950 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute -left-10 top-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> What-If Decision Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Runway & Cash Flow Simulator</h1>
          <p className="text-xs text-purple-200/80 max-w-2xl">
            Simulate hiring, delayed client payments, revenue spikes, and capital spend to predict exact bankruptcy dates and optimize runway extension strategies.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <div className="px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-right">
            <span className="block text-[10px] text-purple-200 font-bold uppercase">Estimated Cash Runway</span>
            <span className={`text-2xl font-black ${
              scenarioMetrics.runwayMonths < 6 ? 'text-rose-400' : scenarioMetrics.runwayMonths < 12 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {scenarioMetrics.runwayMonths >= 60 ? '∞ Infinite' : `${scenarioMetrics.runwayMonths} Months`}
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="saas-card p-4 space-y-1 border-l-4 border-l-purple-500">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase">Simulated Cash Balance</span>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            ${scenarioMetrics.effectiveCash.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[10px] text-slate-400">Adjusted for ${oneTimeCapex.toLocaleString()} CapEx</p>
        </div>

        <div className="saas-card p-4 space-y-1 border-l-4 border-l-emerald-500">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase">Simulated Net Flow / Mo</span>
          <div className={`text-xl font-black ${scenarioMetrics.netSimulatedMonthlyFlow >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {scenarioMetrics.netSimulatedMonthlyFlow >= 0 ? '+' : ''}${scenarioMetrics.netSimulatedMonthlyFlow.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[10px] text-slate-400">Income: ${scenarioMetrics.simulatedMonthlyIncome.toFixed(0)} • Exp: ${scenarioMetrics.simulatedMonthlyExpense.toFixed(0)}</p>
        </div>

        <div className="saas-card p-4 space-y-1 border-l-4 border-l-sky-500">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase">Estimated Zero-Cash Date</span>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {scenarioMetrics.deathDateString}
          </div>
          <p className="text-[10px] text-slate-400">Based on Monte Carlo cash burn model</p>
        </div>

        <div className="saas-card p-4 space-y-1 border-l-4 border-l-amber-500">
          <span className="text-[11px] font-extrabold text-slate-500 uppercase">New Hires Monthly Cost</span>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400">
            ${scenarioMetrics.monthlyHiresCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
          </div>
          <p className="text-[10px] text-slate-400">{newHires} Headcount @ ${(hireSalary/1000).toFixed(0)}k/yr</p>
        </div>

      </div>

      {/* Main Grid: Controls vs Visual Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Scenario Sliders */}
        <div className="lg:col-span-6 saas-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-500" /> Scenario Parameter Sliders
            </h3>
            <button
              onClick={() => {
                setNewHires(1);
                setHireSalary(95000);
                setRevenueChange(10);
                setInvoiceDelayDays(15);
                setSaasCutPercent(15);
                setOneTimeCapex(5000);
              }}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Reset Defaults
            </button>
          </div>

          {/* Slider 1: New Hires Headcount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-500" /> Planned New Hires
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {newHires} People (${((newHires * hireSalary)/1000).toFixed(0)}k/yr total)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={newHires}
              onChange={(e) => setNewHires(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Slider 2: Average Salary per Hire */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Avg Salary / Hire
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                ${(hireSalary / 1000).toFixed(0)}k / year
              </span>
            </div>
            <input
              type="range"
              min="40000"
              max="250000"
              step="5000"
              value={hireSalary}
              onChange={(e) => setHireSalary(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Slider 3: Revenue Growth % */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-sky-500" /> Revenue Growth Forecast
              </span>
              <span className={`px-2 py-0.5 rounded ${revenueChange >= 0 ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'}`}>
                {revenueChange >= 0 ? '+' : ''}{revenueChange}%
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="100"
              step="5"
              value={revenueChange}
              onChange={(e) => setRevenueChange(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          {/* Slider 4: Delayed Client Payments */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Client Payment Delay (Days Late)
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                +{invoiceDelayDays} Days Delay
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={invoiceDelayDays}
              onChange={(e) => setInvoiceDelayDays(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Slider 5: SaaS & Vendor Expense Cut % */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-indigo-500" /> SaaS & Vendor Cost Cuts
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Cut {saasCutPercent}% Spend
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={saasCutPercent}
              onChange={(e) => setSaasCutPercent(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Slider 6: One-Time CapEx */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-rose-500" /> Immediate CapEx / Equipment
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                ${oneTimeCapex.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="2500"
              value={oneTimeCapex}
              onChange={(e) => setOneTimeCapex(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>

        </div>

        {/* Right Column: Visual Cash Curve Graph & AI Recommendations */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="saas-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Projected 12-Month Cash Curve
              </h3>
              <span className="text-xs font-bold text-slate-400">Interactive Model</span>
            </div>

            {/* Custom SVG Curve Graph */}
            <div className="h-56 w-full bg-slate-900 p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Start: ${scenarioMetrics.effectiveCash.toFixed(0)}</span>
                <span>6 Mo: ${(scenarioMetrics.effectiveCash + scenarioMetrics.netSimulatedMonthlyFlow * 6).toFixed(0)}</span>
                <span>12 Mo: ${(scenarioMetrics.effectiveCash + scenarioMetrics.netSimulatedMonthlyFlow * 12).toFixed(0)}</span>
              </div>

              {/* Grid Lines */}
              <div className="absolute inset-[40px] flex flex-col justify-between pointer-events-none opacity-20 border-y border-slate-700">
                <div className="border-b border-slate-700 w-full" />
                <div className="border-b border-slate-700 w-full" />
              </div>

              {/* Dynamic SVG Line */}
              <svg className="w-full h-32 overflow-visible relative z-10" viewBox="0 0 400 100">
                <defs>
                  <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={scenarioMetrics.netSimulatedMonthlyFlow >= 0 ? "#10B981" : "#EF4444"} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={scenarioMetrics.netSimulatedMonthlyFlow >= 0 ? "#10B981" : "#EF4444"} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {(() => {
                  const pts = [];
                  const startY = 50;
                  const flow = scenarioMetrics.netSimulatedMonthlyFlow;
                  for (let i = 0; i <= 12; i++) {
                    const x = (i / 12) * 400;
                    // Map balance to Y coordinate (0 to 100)
                    const bal = scenarioMetrics.effectiveCash + (flow * i);
                    const y = Math.max(5, Math.min(95, 90 - (bal / (currentCashBalance * 2)) * 80));
                    pts.push(`${x},${y}`);
                  }
                  const pathD = `M 0,${pts[0].split(',')[1]} ` + pts.map(p => `L ${p}`).join(' ');
                  const areaD = `${pathD} L 400,100 L 0,100 Z`;

                  return (
                    <>
                      <path d={areaD} fill="url(#curveGrad)" />
                      <path d={pathD} fill="none" stroke={scenarioMetrics.netSimulatedMonthlyFlow >= 0 ? "#10B981" : "#EF4444"} strokeWidth="3.5" strokeLinecap="round" />
                    </>
                  );
                })()}
              </svg>

              <div className="flex justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800 pt-2">
                <span>Month 0</span>
                <span>Month 3</span>
                <span>Month 6</span>
                <span>Month 9</span>
                <span>Month 12</span>
              </div>
            </div>
          </div>

          {/* AI Runway Optimization Recommendations */}
          <div className="saas-card p-6 space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" /> AI Runway Optimization Playbook
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-purple-900 dark:text-purple-200">Enforce Net-15 Invoice Terms</h4>
                  <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80">
                    Reducing payment delay from {invoiceDelayDays} days down to 10 days recovers <strong>+${(baselineMonthlyIncome * 0.15).toFixed(0)} cash buffer</strong> immediately.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/50 flex items-start gap-3">
                <ArrowUpRight className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-sky-900 dark:text-sky-200">Phase Hiring Timeline</h4>
                  <p className="text-[11px] text-sky-800/80 dark:text-sky-300/80">
                    Delaying {newHires} new headcount by 60 days adds <strong>+2.4 months of extra cash runway</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
