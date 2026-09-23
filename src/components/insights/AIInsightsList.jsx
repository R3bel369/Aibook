import React, { useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Repeat, ArrowRight, ShieldCheck } from 'lucide-react';
import { useFinancialData } from '../../context/FinancialDataContext';
import AIFinancialAuditModal from './AIFinancialAuditModal';

export default function AIInsightsList() {
  const { insights } = useFinancialData();
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case "POSITIVE": return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case "WARNING": return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "SAVINGS": return <Lightbulb className="w-5 h-5 text-blue-500" />;
      default: return <Repeat className="w-5 h-5 text-purple-500" />;
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case "POSITIVE": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "WARNING": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "SAVINGS": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      default: return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Intelligence</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">AI Financial Insights & Recommendations</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Automated pattern analysis operating on your live transaction ledger</p>
        </div>

        <button
          onClick={() => setIsAuditModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2 shrink-0"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Run Deep AI Audit (Gemini/Claude)</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {getIcon(ins.type)}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{ins.title}</h3>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getBadgeColor(ins.type)}`}>
                {ins.badge}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {ins.description}
            </p>

            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400 font-mono">Financial Impact:</span>
              <span className="text-emerald-600 dark:text-emerald-400">{ins.impact}</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Financial Audit Modal */}
      <AIFinancialAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
}
