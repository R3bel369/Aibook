import React, { useState } from 'react';
import { useFinancialData } from '../context/FinancialDataContext';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  Pause, 
  Sliders, 
  MessageSquare, 
  Trash2, 
  Plus, 
  Zap, 
  Clock, 
  ShieldCheck,
  Send
} from 'lucide-react';

export default function AutoBookkeeperAgentPage() {
  const { transactions } = useFinancialData();
  const [isAgentActive, setIsAgentActive] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [showDigestModal, setShowDigestModal] = useState(false);

  // Self-learned Rules List State
  const [rules, setRules] = useState([
    { id: 'rule_1', pattern: 'AWS|Amazon Web Services', category: 'Software & SaaS', confidence: '99%', autoApprovedCount: 42 },
    { id: 'rule_2', pattern: 'Uber|Lyft', category: 'Travel & Transport', confidence: '96%', autoApprovedCount: 28 },
    { id: 'rule_3', pattern: 'Starbucks|Peets Coffee', category: 'Food & Client Dining', confidence: '94%', autoApprovedCount: 19 },
    { id: 'rule_4', pattern: 'WeWork|Regus', category: 'Office Rent & Lease', confidence: '98%', autoApprovedCount: 12 },
    { id: 'rule_5', pattern: 'Github|Vercel|Supabase', category: 'Software & SaaS', confidence: '100%', autoApprovedCount: 35 }
  ]);

  const [newPattern, setNewPattern] = useState('');
  const [newCategory, setNewCategory] = useState('Software & SaaS');

  const handleAddRule = () => {
    if (newPattern.trim()) {
      setRules([
        ...rules,
        {
          id: `rule_${Date.now()}`,
          pattern: newPattern,
          category: newCategory,
          confidence: '100%',
          autoApprovedCount: 0
        }
      ]);
      setNewPattern('');
    }
  };

  const handleDeleteRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-sky-900 via-purple-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-sky-400" /> Self-Learning AI Agent
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Autonomous "Nightly Sweep" Agent</h1>
          <p className="text-xs text-sky-200/80 max-w-2xl">
            Runs automated background sweeps while you sleep, categorizing 99% of transactions and sending a 1-minute morning WhatsApp/Slack digest.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => setIsAgentActive(!isAgentActive)}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg transition-all ${
              isAgentActive
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'bg-rose-500 text-white hover:bg-rose-400'
            }`}
          >
            {isAgentActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAgentActive ? 'Agent Running (Active)' : 'Agent Paused'}
          </button>
        </div>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Agent Controls & Digest Preview Trigger */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="saas-card p-6 space-y-5 border-t-4 border-t-sky-500">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-500" /> Agent Autonomy Settings
              </h3>
              <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                142 Auto-Classified
              </span>
            </div>

            {/* Threshold Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-black">
                <span className="text-slate-700 dark:text-slate-200">Auto-Approval Confidence Limit</span>
                <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                  {confidenceThreshold}%+
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="98"
                step="2"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Transactions with AI confidence above {confidenceThreshold}% are categorized with zero human intervention.
              </p>
            </div>

            {/* Sweep Time */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" /> Scheduled Nightly Sweep
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">03:00 AM PST</span>
            </div>

            {/* Trigger Morning Digest Modal */}
            <button
              onClick={() => setShowDigestModal(true)}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <MessageSquare className="w-4 h-4" /> Simulate Morning WhatsApp / Slack Digest
            </button>
          </div>

          <div className="saas-card p-6 space-y-3 bg-gradient-to-br from-sky-950 to-slate-900 text-white">
            <h4 className="text-xs font-black uppercase text-sky-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Self-Learning Neural Loop
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every time you manually edit a transaction's category, the AI agent dynamically updates its rule matrix. Over 30 days, manual effort drops by 94%.
            </p>
          </div>

        </div>

        {/* Right Column: Learned Regex Rules Table */}
        <div className="lg:col-span-7 saas-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Self-Learned Categorization Rules</h3>
              <p className="text-xs text-slate-500">Automatically updated regex rules from your past ledger edits</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-black">
              {rules.length} Active Rules
            </span>
          </div>

          {/* Create Rule Bar */}
          <div className="flex flex-col sm:flex-row gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              placeholder="Merchant Regex Pattern (e.g. OpenAI|ChatGPT)"
              value={newPattern}
              onChange={(e) => setNewPattern(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
            />
            <input
              type="text"
              placeholder="Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-44 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
            />
            <button
              onClick={handleAddRule}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black shrink-0 flex items-center gap-1 shadow"
            >
              <Plus className="w-4 h-4" /> Add Rule
            </button>
          </div>

          {/* Rules Table */}
          <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
            {rules.map((rule) => (
              <div key={rule.id} className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded">
                      {rule.pattern}
                    </span>
                    <span className="text-slate-400">➔</span>
                    <span className="font-black text-slate-900 dark:text-white">{rule.category}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Accuracy: {rule.confidence} • Auto-Approved: {rule.autoApprovedCount} txs
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Delete Rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Morning WhatsApp / Slack Digest Modal */}
      {showDigestModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="saas-card max-w-lg w-full p-6 space-y-5 relative bg-slate-900 text-white border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black">WhatsApp Morning Digest</h4>
                  <p className="text-[10px] text-slate-400">08:00 AM Daily Sweep Summary</p>
                </div>
              </div>
              <button
                onClick={() => setShowDigestModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            {/* Chat Bubble Mockup */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-3 font-sans">
              <p className="font-bold text-emerald-400">☀️ Good morning! Here is your 1-minute financial sweep digest:</p>
              
              <ul className="space-y-1.5 text-slate-300">
                <li>✅ <strong>142 transactions</strong> auto-categorized with 99% accuracy.</li>
                <li>⚠️ <strong>1 duplicate charge</strong> flagged on Uber ($42.50).</li>
                <li>📈 <strong>1 price increase</strong> detected on Adobe (+16%).</li>
              </ul>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-[11px] text-sky-300 font-mono">
                Reply "APPROVE ALL" to finalize ledger or "1" to hold Uber charge.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDigestModal(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow"
              >
                Simulate "APPROVE ALL" Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
