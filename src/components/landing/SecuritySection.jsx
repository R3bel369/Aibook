import React from 'react';
import { ShieldCheck, Lock, EyeOff, UserCheck, CheckCircle2 } from 'lucide-react';

const SECURITY_CARDS = [
  {
    icon: Lock,
    title: "Bank-Grade Encryption",
    description: "All financial data, statements, and transaction records are encrypted using AES-256 at rest and TLS 1.3 in transit."
  },
  {
    icon: ShieldCheck,
    title: "Secure Processing",
    description: "Statements are parsed isolated in memory. Extracted data is sanitized and masked to conceal sensitive account numbers."
  },
  {
    icon: EyeOff,
    title: "Strict Privacy Guarantee",
    description: "Your financial records belong exclusively to you. We never sell or share user financial data with third-party brokers."
  },
  {
    icon: UserCheck,
    title: "User-Controlled Data",
    description: "Complete control to modify categories, export audit ledgers, or permanently delete account data at any time with one click."
  }
];

export default function SecuritySection() {
  return (
    <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 space-y-12 glow-blue">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Financial Security Standards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Enterprise Security & Privacy Built In
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm">
            We adhere to strict fintech data handling protocols so you can manage your business financials with total peace of mind.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SECURITY_CARDS.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{sec.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{sec.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
