import React from 'react';
import { Bot, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { PROCESSING_STEPS } from '../../utils/pdfParser';

export default function AIProcessingModal({ currentStep, fileName }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-lg glass-card rounded-3xl p-8 border border-slate-700 shadow-2xl space-y-6 text-center">
        
        {/* Animated AI Brain Graphic */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 blur-xl opacity-60 animate-pulse" />
          <div className="relative w-full h-full rounded-full bg-slate-900 border-2 border-emerald-500/50 flex items-center justify-center shadow-2xl">
            <Bot className="w-12 h-12 text-emerald-400 animate-bounce" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center justify-center gap-2">
            <span>AI Analyzing Bank Statement</span>
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            File: {fileName || "Statement_Ingestion.pdf"}
          </p>
        </div>

        {/* Steps Checkmarks List */}
        <div className="space-y-3 text-left bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          {PROCESSING_STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isCompleted
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    : isCurrent
                    ? "text-blue-400 bg-blue-500/10 border border-blue-500/20 animate-pulse"
                    : "text-slate-500 opacity-40"
                }`}
              >
                <span>{isCompleted ? step.completedText : step.label}</span>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-400 animate-pulse">
          Please wait while our Neural Engine extracts dates, debits, credits, and calculates confidence scores...
        </p>

      </div>
    </div>
  );
}
