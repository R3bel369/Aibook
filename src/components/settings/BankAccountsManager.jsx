import React from 'react';
import { Building2, Plus, CheckCircle2, RefreshCw } from 'lucide-react';
import { useFinancialData } from '../../context/FinancialDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';

export default function BankAccountsManager() {
  const { bankAccounts, selectedAccountId, setSelectedAccountId } = useFinancialData();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Connected Bank Accounts</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage multiple bank accounts and statement sync connections</p>
        </div>
        <button
          onClick={() => alert("To link a new bank account, upload its statement or connect via Net Banking portal.")}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow hover:bg-emerald-600 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Connect Bank Account</span>
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {bankAccounts.map((acc) => (
          <div
            key={acc.id}
            className={`p-6 rounded-3xl border space-y-4 transition-all ${
              selectedAccountId === acc.id
                ? "bg-emerald-500/10 border-emerald-500"
                : "glass-card border-slate-200 dark:border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white text-2xl flex items-center justify-center font-bold">
                  {acc.logo}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{acc.bankName}</h4>
                  <div className="text-xs text-slate-400 font-mono">{acc.accountNumber} • {acc.accountType}</div>
                </div>
              </div>

              {acc.isPrimary && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Primary
                </span>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Current Balance</div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {formatCurrency(acc.balance, user.currency)}
                </div>
              </div>

              <button
                onClick={() => setSelectedAccountId(acc.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedAccountId === acc.id
                    ? "bg-emerald-500 text-white shadow"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500"
                }`}
              >
                {selectedAccountId === acc.id ? "Viewing Ledger ✓" : "View Ledger"}
              </button>
            </div>

            <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
              <RefreshCw className="w-3 h-3 text-emerald-500" />
              <span>Last Synced: {acc.lastSynced}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
