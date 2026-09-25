import React, { useState } from 'react';
import {
  Landmark,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  ExternalLink,
  ChevronRight,
  Database,
  Radio,
  ArrowUpRight,
  Sliders,
  Sparkles,
  Lock
} from 'lucide-react';
import { useFinancialData } from '../context/FinancialDataContext';

const SUPPORTED_BANKS = [
  { id: 'chase', name: 'JPMorgan Chase', logo: '🏛️', color: 'from-blue-600 to-indigo-800', status: 'Connected', balance: '$124,500.00', lastSynced: '2 mins ago' },
  { id: 'boa', name: 'Bank of America', logo: '🏦', color: 'from-red-600 to-rose-800', status: 'Connected', balance: '$45,210.50', lastSynced: '15 mins ago' },
  { id: 'svb', name: 'Silicon Valley Bank', logo: '🌐', color: 'from-teal-600 to-cyan-800', status: 'Active Sync', balance: '$310,890.00', lastSynced: 'Just now' },
  { id: 'wells', name: 'Wells Fargo', logo: '🐎', color: 'from-amber-600 to-red-700', status: 'Ready to Link', balance: '$0.00', lastSynced: 'Never' },
  { id: 'hdfc', name: 'HDFC Bank India', logo: '💎', color: 'from-blue-700 to-slate-900', status: 'Connected', balance: '₹1,245,000.00', lastSynced: '1 hour ago' },
  { id: 'revolut', name: 'Revolut Business', logo: '⚡', color: 'from-purple-600 to-indigo-900', status: 'Ready to Link', balance: '$0.00', lastSynced: 'Never' }
];

const RECENT_WEBHOOKS = [
  { id: 'wh_991', event: 'TRANSACTIONS.DEFAULT_UPDATE', bank: 'Silicon Valley Bank', items: 3, status: 'SUCCESS', time: '17:12:04' },
  { id: 'wh_990', event: 'SYNC.COMPLETED', bank: 'JPMorgan Chase', items: 15, status: 'SUCCESS', time: '17:10:15' },
  { id: 'wh_989', event: 'HOLD_REMOVED', bank: 'Bank of America', items: 1, status: 'SUCCESS', time: '16:55:00' },
  { id: 'wh_988', event: 'HISTORICAL_FETCH', bank: 'HDFC Bank India', items: 42, status: 'SUCCESS', time: '16:00:22' }
];

export default function LiveBankSyncPage() {
  const { bankAccounts, selectedAccountId } = useFinancialData();
  const [banks, setBanks] = useState(SUPPORTED_BANKS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');
  const [activeModalBank, setActiveModalBank] = useState(null);
  const [linkingStep, setLinkingStep] = useState(0); // 0: select, 1: auth, 2: success
  const [syncFrequency, setSyncFrequency] = useState('realtime');

  const handleForceSyncAll = () => {
    setIsSyncing(true);
    setSyncSuccessMsg('');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccessMsg('Successfully synced 6 bank accounts! 18 new pending transactions pulled into AI queue.');
      setBanks(prev => prev.map(b => ({ ...b, lastSynced: 'Just now' })));
    }, 1800);
  };

  const handleConnectBank = (bank) => {
    setActiveModalBank(bank);
    setLinkingStep(1);
    setTimeout(() => {
      setLinkingStep(2);
      setTimeout(() => {
        setBanks(prev => prev.map(b => b.id === bank.id ? { ...b, status: 'Connected', lastSynced: 'Just now', balance: '$18,450.00' } : b));
        setActiveModalBank(null);
        setLinkingStep(0);
      }, 1400);
    }, 1600);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="saas-card p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-black">
              <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>Plaid & Open Banking OAuth 2.0 API Feed</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Live Bank Sync & API Webhooks</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Connect 12,000+ financial institutions via encrypted OAuth Plaid Link feeds. Automatically pull pending cleared transactions into your AI bookkeeper queue.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleForceSyncAll}
              disabled={isSyncing}
              className="px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Feeds...' : 'Force Sync All Feeds'}</span>
            </button>
          </div>
        </div>
      </div>

      {syncSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-extrabold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{syncSuccessMsg}</span>
          </div>
          <button onClick={() => setSyncSuccessMsg('')} className="text-emerald-500 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Sync Control & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="saas-card p-5 space-y-1 border-l-4 border-l-sky-500">
          <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase">Connected Banks</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">4 Active</div>
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> 256-Bit Encrypted OAuth
          </div>
        </div>

        <div className="saas-card p-5 space-y-1 border-l-4 border-l-emerald-500">
          <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase">Live Webhook Health</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">99.98%</div>
          <div className="text-[11px] text-slate-500">Instant Event Listeners</div>
        </div>

        <div className="saas-card p-5 space-y-1 border-l-4 border-l-purple-500">
          <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase">Sync Frequency</span>
          <select
            value={syncFrequency}
            onChange={(e) => setSyncFrequency(e.target.value)}
            className="w-full mt-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-black text-purple-600 dark:text-purple-400 border border-slate-300 dark:border-slate-700"
          >
            <option value="realtime">⚡ Realtime Webhook (Instant)</option>
            <option value="6h">⏳ Every 6 Hours</option>
            <option value="nightly">🌙 Nightly Batch (12:00 AM)</option>
          </select>
        </div>

        <div className="saas-card p-5 space-y-1 border-l-4 border-l-indigo-500">
          <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase">Auto-Categorization</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">Active</div>
          <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">Auto-routes to AI Queue</div>
        </div>
      </div>

      {/* Grid of Bank Accounts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-sky-500" />
            Connected Institutions & Live Accounts
          </h2>
          <span className="text-xs font-bold text-slate-500">Plaid Sandbox & Production Feeds</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {banks.map((bank) => (
            <div key={bank.id} className="saas-card p-6 space-y-4 hover:border-sky-500/50 transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${bank.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {bank.logo}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{bank.name}</h3>
                    <span className="text-[11px] font-semibold text-slate-500">Direct API Feed</span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                  bank.status === 'Connected' || bank.status === 'Active Sync'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                }`}>
                  {bank.status}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Available Balance</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">{bank.balance}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Last Synced</div>
                  <div className="text-xs font-extrabold text-sky-600 dark:text-sky-400">{bank.lastSynced}</div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                {bank.status === 'Connected' || bank.status === 'Active Sync' ? (
                  <button
                    onClick={handleForceSyncAll}
                    className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-500 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Transactions</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnectBank(bank)}
                    className="w-full py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Connect Plaid Feed</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhook Activity Feed */}
      <div className="saas-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" />
              Live Webhook Stream & Event Logs
            </h3>
            <p className="text-xs text-slate-500">Real-time callbacks pushed from bank servers</p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black flex items-center gap-1">
            <Radio className="w-3 h-3 animate-ping" />
            <span>Listening</span>
          </span>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {RECENT_WEBHOOKS.map((wh) => (
            <div key={wh.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-mono font-black text-[10px]">
                  RAW
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white">{wh.event}</div>
                  <div className="text-[11px] text-slate-500">{wh.bank} • {wh.items} items parsed</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-[11px] text-slate-400">{wh.time}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px]">
                  {wh.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plaid Connecting Modal Simulator */}
      {activeModalBank && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 text-white space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Plaid Secure OAuth 2.0 Gateway</span>
              </div>
              <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded">ENV: SANDBOX</span>
            </div>

            <div className="text-center space-y-2 py-4">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-3xl mx-auto mb-2">
                {activeModalBank.logo}
              </div>
              <h3 className="text-xl font-black">Connecting to {activeModalBank.name}</h3>
              <p className="text-xs text-slate-400">Authenticating credentials with bank security server...</p>
            </div>

            {linkingStep === 1 && (
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-sky-400 animate-spin mx-auto" />
                <div className="text-xs font-bold">Verifying Multi-Factor Auth Token...</div>
              </div>
            )}

            {linkingStep === 2 && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2 text-emerald-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-xs font-black">OAuth Connection Established!</div>
                <div className="text-[11px] text-slate-300">Importing account ledger data...</div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
