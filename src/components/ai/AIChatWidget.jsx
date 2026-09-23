import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, User, RefreshCw } from 'lucide-react';
import { useFinancialData } from '../../context/FinancialDataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';

const PRESET_QUESTIONS = [
  "How much did I spend on marketing?",
  "What was my highest expense last month?",
  "Show my income for August.",
  "Why are my expenses increasing?",
  "Which subscriptions am I paying for?",
  "How can I reduce my expenses?",
  "Give me a financial summary."
];

export default function AIChatWidget() {
  const { financialTotals, transactions, recurringPayments } = useFinancialData();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${user.name.split(' ')[0]}! 👋 I am your AI Bookkeeper Assistant. Ask me anything about your income, expenses, subscriptions, or P&L report!`
    }
  ]);

  const generateAIAnswer = (query) => {
    const q = query.toLowerCase();

    if (q.includes('marketing') || q.includes('ads')) {
      return `You spent ${formatCurrency(24500, user.currency)} on Marketing & Advertising this period. The largest charge was ${formatCurrency(24500, user.currency)} to 'GOOGLE ADS PAYMENT' on 05 Sep 2026.`;
    }
    if (q.includes('highest expense') || q.includes('largest expense')) {
      return `Your highest single expense was ${formatCurrency(140000, user.currency)} for Salary Payroll (August Batch), followed by ${formatCurrency(114900, user.currency)} at Apple Store for hardware equipment.`;
    }
    if (q.includes('august') || q.includes('income for august')) {
      return `Your total income for August 2026 was ${formatCurrency(425000, user.currency)} across client retainers and consulting payouts!`;
    }
    if (q.includes('increasing') || q.includes('why are my expenses')) {
      return `Your expenses increased by +25% primarily due to software subscription renewals (AWS + Google Workspace) and a 1-time laptop purchase at Apple Store.`;
    }
    if (q.includes('subscription') || q.includes('subscriptions')) {
      return `You have 5 active recurring subscriptions totaling ${formatCurrency(70099, user.currency)}/mo (${formatCurrency(841188, user.currency)}/yr): Netflix (₹649), AWS (₹18,450), Google Workspace (₹1,800), WeWork Lease (₹45,000), and Adobe CC (₹4,200).`;
    }
    if (q.includes('reduce') || q.includes('save money')) {
      return `Cost Reduction Opportunity: 1) Review non-business Netflix subscription (Save ₹7,788/yr). 2) Audit unused AWS EC2 server instances. 3) Consolidate duplicate design software licenses.`;
    }
    if (q.includes('summary') || q.includes('financial summary')) {
      return `Financial Summary for ${user.businessName}: Total Revenue is ${formatCurrency(financialTotals.totalIncome, user.currency)}, Total Expenses are ${formatCurrency(financialTotals.totalExpenses, user.currency)}, giving a Net Profit of ${formatCurrency(financialTotals.netProfit, user.currency)} (Margin: 45.8%).`;
    }

    return `Based on your bank statements for ${user.businessName}, your current Net Profit is ${formatCurrency(financialTotals.netProfit, user.currency)} with ${transactions.length} parsed transactions in your ledger.`;
  };

  const handleSend = (textToSend) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg = { id: `msg_${Date.now()}`, sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const aiReply = { id: `msg_ai_${Date.now()}`, sender: 'ai', text: generateAIAnswer(q) };
      setMessages(prev => [...prev, aiReply]);
    }, 600);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white shadow-2xl shadow-sky-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 font-black text-xs group"
      >
        <Bot className="w-5 h-5 animate-bounce" />
        <span className="hidden sm:inline">Ask AI Bookkeeper</span>
        <Sparkles className="w-4 h-4 text-sky-200" />
      </button>

      {/* Floating Chat Widget Popup - Solid Opaque Background */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-3xl p-4 shadow-2xl space-y-3 animate-in zoom-in-95 duration-200 flex flex-col h-[520px] opacity-100">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-extrabold border border-sky-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">AI Bookkeeper Chatbot</h4>
                <div className="text-[11px] text-sky-600 dark:text-sky-400 font-extrabold">Active Ledger Context Connected</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto space-y-3 p-1">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 font-bold">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-sky-500 text-white font-extrabold rounded-tr-none shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-tl-none border border-slate-300 dark:border-slate-700 shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Preset Question Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {PRESET_QUESTIONS.slice(0, 3).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-black text-sky-700 dark:text-sky-300 shrink-0 border border-slate-300 dark:border-slate-700 hover:border-sky-500 hover:bg-sky-500/10"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AI about expenses, marketing, P&L..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-xl bg-sky-500 text-white font-black hover:bg-sky-600 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
