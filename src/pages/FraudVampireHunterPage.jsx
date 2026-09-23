import React, { useState } from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  Copy, 
  PauseCircle, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  DollarSign, 
  Lock,
  Scissors
} from 'lucide-react';

export default function FraudVampireHunterPage() {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [frozenCardIds, setFrozenCardIds] = useState([]);
  const [showLetterModal, setShowLetterModal] = useState(false);

  // Mock Vampire Subscriptions & Inflation Alerts
  const alerts = [
    {
      id: 'vamp_01',
      title: 'Silent Price Increase: Adobe Creative Cloud',
      vendor: 'Adobe Systems',
      type: 'PRICE_HIKE',
      oldPrice: 29.99,
      newPrice: 34.99,
      hikePercent: 16.6,
      annualWaste: 60.00,
      severity: 'HIGH',
      description: 'Vendor increased monthly subscription price from $29.99 to $34.99 without explicit notification.'
    },
    {
      id: 'vamp_02',
      title: 'Duplicate Card Charge: Notion Labs',
      vendor: 'Notion Labs Inc',
      type: 'DUPLICATE',
      oldPrice: 16.00,
      newPrice: 32.00,
      hikePercent: 100.0,
      annualWaste: 192.00,
      severity: 'CRITICAL',
      description: 'Identical charge of $16.00 billed twice within 48 hours across Chase and Amex cards.'
    },
    {
      id: 'vamp_03',
      title: 'Ghost SaaS Tool: Zoom Pro (Unused 60+ Days)',
      vendor: 'Zoom Video Com',
      type: 'GHOST_SAAS',
      oldPrice: 19.99,
      newPrice: 19.99,
      hikePercent: 0,
      annualWaste: 239.88,
      severity: 'MEDIUM',
      description: 'Zero login activity recorded across Google Workspace SSO for 64 days.'
    }
  ];

  const handleFreezeCard = (id) => {
    if (!frozenCardIds.includes(id)) {
      setFrozenCardIds([...frozenCardIds, id]);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-rose-950 via-slate-900 to-sky-950 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute left-0 top-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-black uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Deep Forensic Scanner
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Forensic Fraud & "SaaS Vampire" Hunter</h1>
          <p className="text-xs text-rose-200/80 max-w-2xl">
            Detects silent price increases, duplicate invoice charges, ghost SaaS subscriptions, and features 1-click virtual card freezes and auto-cancellation letter drafting.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <div className="px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-right">
            <span className="block text-[10px] text-rose-300 font-bold uppercase">Identified Annual Leakage</span>
            <span className="text-2xl font-black text-rose-400">$491.88 / yr</span>
          </div>
        </div>
      </div>

      {/* Main Alert List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Alert Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Active Forensic Detections ({alerts.length})
            </h3>
            <span className="text-xs font-bold text-rose-500">3 Action Required</span>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => {
              const isSelected = selectedAlert?.id === alert.id;
              const isFrozen = frozenCardIds.includes(alert.id);

              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`saas-card p-5 cursor-pointer transition-all border-l-4 ${
                    alert.severity === 'CRITICAL'
                      ? 'border-l-rose-500'
                      : alert.severity === 'HIGH'
                      ? 'border-l-amber-500'
                      : 'border-l-sky-500'
                  } ${
                    isSelected ? 'ring-2 ring-rose-500/40 shadow-lg' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900 dark:text-white">{alert.title}</span>
                        {isFrozen && (
                          <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 text-[10px] font-black flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Card Frozen
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{alert.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-rose-600 dark:text-rose-400">
                        +${alert.annualWaste.toFixed(2)}/yr
                      </div>
                      {alert.hikePercent > 0 && (
                        <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400">
                          +{alert.hikePercent}% Surge
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[10px]">Vendor: {alert.vendor}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedAlert(alert); setShowLetterModal(true); }}
                        className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black hover:bg-purple-200"
                      >
                        Draft Cancellation Letter
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); handleFreezeCard(alert.id); }}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black shadow"
                      >
                        {isFrozen ? 'Card Frozen' : 'Pause Virtual Card'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detail Inspector */}
        <div className="lg:col-span-5 saas-card p-6 space-y-5">
          {selectedAlert ? (
            <div className="space-y-5">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider">
                  Forensic Deep Dive
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{selectedAlert.title}</h3>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Historical Rate:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">${selectedAlert.oldPrice}/mo</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Current Detected Rate:</span>
                  <span className="font-mono font-bold text-rose-500">${selectedAlert.newPrice}/mo</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Annualized Profit Waste:</span>
                  <span className="font-black text-rose-600 dark:text-rose-400">${selectedAlert.annualWaste} / year</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-900 dark:text-rose-200 space-y-2">
                <h4 className="font-black flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" /> AI Recommendation
                </h4>
                <p>
                  Initiate 1-click vendor cancellation or freeze the virtual card assigned to {selectedAlert.vendor} to stop unauthorized price hikes.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <ShieldAlert className="w-8 h-8 mx-auto text-slate-500" />
              <p className="text-xs">Select any detection alert on the left to inspect forensic details.</p>
            </div>
          )}
        </div>

      </div>

      {/* Cancellation Letter Modal */}
      {showLetterModal && selectedAlert && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="saas-card max-w-xl w-full p-6 space-y-5 bg-slate-900 text-white border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-black flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" /> Auto-Generated Cancellation Letter
              </h4>
              <button onClick={() => setShowLetterModal(false)} className="text-xs text-slate-400 hover:text-white">
                Close
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>RE: Immediate Subscription Cancellation - Account #{selectedAlert.vendor.toUpperCase()}-9401</p>
              <p>Dear {selectedAlert.vendor} Support Team,</p>
              <p>
                Please accept this notice as formal authorization to terminate our monthly subscription service for account <strong>#{selectedAlert.vendor.toUpperCase()}-9401</strong> effective immediately.
              </p>
              <p>
                Reason: Unannounced price increase from ${selectedAlert.oldPrice} to ${selectedAlert.newPrice}.
              </p>
              <p>Sincerely,<br />Finance Department, Acme Corp Inc.</p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`RE: Immediate Subscription Cancellation...`);
                  setShowLetterModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center gap-2 shadow"
              >
                <Copy className="w-4 h-4" /> Copy Letter to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
