import React from 'react';
import { SAMPLE_STATEMENTS } from '../../data/sampleStatements';
import { FileText, ArrowRight, Sparkles, Building2 } from 'lucide-react';

export default function SampleStatementSelector({ onSelectSample }) {
  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Mode</span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Or Test 1-Click Sample Bank Statements
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No file on hand? Select a sample statement below to see instant AI extraction & P&L generation in action!
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {SAMPLE_STATEMENTS.map((stmt) => (
          <div
            key={stmt.id}
            onClick={() => onSelectSample(stmt)}
            className="group p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/60 cursor-pointer transition-all duration-300 hover:-translate-y-1 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                    {stmt.bankName}
                  </h4>
                  <div className="text-[10px] text-slate-400 font-mono">{stmt.accountNumber} • {stmt.fileType}</div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {stmt.transactionCount} Txs
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 text-slate-300 font-mono text-[10px] overflow-hidden line-clamp-2">
              {stmt.rawTextPreview}
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1">
              <span>Parse Statement Now</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
