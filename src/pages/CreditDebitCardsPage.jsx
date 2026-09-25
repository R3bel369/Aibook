import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Shield,
  Lock,
  Unlock,
  Sparkles,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Sliders,
  Zap,
  Cpu,
  ChevronRight,
  Check,
  AlertCircle
} from 'lucide-react';
import { INITIAL_CARDS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function CreditDebitCardsPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('app_user_cards');
    return saved ? JSON.parse(saved) : INITIAL_CARDS;
  });

  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'CREDIT' | 'DEBIT' | 'VIRTUAL'
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCardForEdit, setSelectedCardForEdit] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Add Card Form State
  const [newCardName, setNewCardName] = useState('');
  const [newCardholder, setNewCardholder] = useState(user.name || 'Alex Morgan');
  const [newCardType, setNewCardType] = useState('CREDIT');
  const [newNetwork, setNewNetwork] = useState('Visa');
  const [newLast4, setNewLast4] = useState('4892');
  const [newExpiry, setNewExpiry] = useState('12/28');
  const [newLimit, setNewLimit] = useState(25000);

  const saveCardsToStorage = (updatedCards) => {
    setCards(updatedCards);
    localStorage.setItem('app_user_cards', JSON.stringify(updatedCards));
  };

  const handleToggleFreeze = (cardId) => {
    const updated = cards.map(c => {
      if (c.id === cardId) {
        const nextStatus = c.status === 'FROZEN' ? 'ACTIVE' : 'FROZEN';
        setToastMessage(`${c.cardName} is now ${nextStatus}!`);
        return { ...c, status: nextStatus };
      }
      return c;
    });
    saveCardsToStorage(updated);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleToggleAutoCategorize = (cardId) => {
    const updated = cards.map(c => {
      if (c.id === cardId) {
        const nextAuto = !c.autoCategorize;
        setToastMessage(`AI Auto-Categorization ${nextAuto ? 'Enabled' : 'Disabled'} for ${c.cardName}`);
        return { ...c, autoCategorize: nextAuto };
      }
      return c;
    });
    saveCardsToStorage(updated);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCreateCard = (e) => {
    e.preventDefault();
    const newCard = {
      id: `card_${Date.now()}`,
      cardName: newCardName || `${newNetwork} ${newCardType === 'CREDIT' ? 'Corporate Credit' : 'Business Debit'}`,
      cardholderName: newCardholder,
      cardType: newCardType,
      network: newNetwork,
      last4: newLast4,
      expiry: newExpiry,
      creditLimit: Number(newLimit),
      usedBalance: 0.00,
      dailyLimit: newCardType === 'DEBIT' ? 5000 : undefined,
      status: 'ACTIVE',
      color: newCardType === 'CREDIT'
        ? 'from-slate-900 via-purple-950 to-indigo-950'
        : newCardType === 'DEBIT'
        ? 'from-blue-600 via-teal-700 to-slate-900'
        : 'from-emerald-600 via-teal-800 to-indigo-950',
      isPrimary: false,
      autoCategorize: true
    };

    const updated = [newCard, ...cards];
    saveCardsToStorage(updated);
    setShowAddModal(false);
    setToastMessage(`New ${newCardType} Card "${newCard.cardName}" linked successfully!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredCards = cards.filter(c => activeFilter === 'ALL' || c.cardType === activeFilter);

  const totalCreditLimit = cards.filter(c => c.cardType === 'CREDIT' || c.cardType === 'VIRTUAL').reduce((sum, c) => sum + (c.creditLimit || 0), 0);
  const totalUsedBalance = cards.filter(c => c.cardType === 'CREDIT' || c.cardType === 'VIRTUAL').reduce((sum, c) => sum + (c.usedBalance || 0), 0);
  const totalAvailableCredit = totalCreditLimit - totalUsedBalance;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="saas-card p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-black">
              <CreditCard className="w-3.5 h-3.5 text-purple-400" />
              <span>Digital Wallet & Card Treasury</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Credit & Debit Cards Manager</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Manage corporate credit cards, executive debit accounts, and AI virtual procurement cards with real-time spend controls and auto-categorization.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl transition-all flex items-center gap-2 shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Link / Issue New Card</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-extrabold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-emerald-500 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="saas-card p-5 space-y-1 border-l-4 border-l-purple-500">
          <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase">Total Credit Limit</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">${totalCreditLimit.toLocaleString()}</div>
          <div className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">Across {cards.length} Payment Cards</div>
        </div>

        <div className="saas-card p-5 space-y-1 border-l-4 border-l-rose-500">
          <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase">Current Card Balance</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">${totalUsedBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-[11px] font-semibold text-slate-500">Pending Statement Settlements</div>
        </div>

        <div className="saas-card p-5 space-y-1 border-l-4 border-l-emerald-500">
          <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase">Available Revolving Credit</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${totalAvailableCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Healthy Liquidity Ratio
          </div>
        </div>

        <div className="saas-card p-5 space-y-1 border-l-4 border-l-sky-500">
          <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase">AI Auto-Categorization</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">Active</div>
          <div className="text-[11px] text-sky-600 dark:text-sky-400 font-bold">Auto-matches receipts to card lines</div>
        </div>
      </div>

      {/* Cards Filtering Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'ALL', label: 'All Wallet Cards' },
            { id: 'CREDIT', label: 'Credit Cards' },
            { id: 'DEBIT', label: 'Debit Cards' },
            { id: 'VIRTUAL', label: 'Virtual Procurement' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeFilter === tab.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-bold text-slate-500">{filteredCards.length} Active Cards</span>
      </div>

      {/* Visual Cards Wallet Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => {
          const isFrozen = card.status === 'FROZEN';
          return (
            <div
              key={card.id}
              className={`rounded-3xl p-6 bg-gradient-to-tr ${card.color} text-white shadow-2xl relative overflow-hidden transition-all transform hover:-translate-y-1 space-y-6 border border-white/10 ${
                isFrozen ? 'opacity-70 grayscale' : ''
              }`}
            >
              {/* Card Watermark */}
              <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/5 rounded-full blur-xl pointer-events-none" />

              {/* Card Header: Brand & Network */}
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-300">{card.cardName}</span>
                    {card.isPrimary && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-400 text-slate-950">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-slate-300">
                    {card.cardType} CARD • {card.network}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-wider text-slate-200">
                    {card.network === 'American Express' ? 'AMEX' : card.network.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Card Chip & Contactless Symbol */}
              <div className="flex items-center justify-between relative z-10 py-1">
                <div className="w-11 h-8 rounded-lg bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 border border-amber-500/50 shadow-inner flex items-center justify-center">
                  <div className="w-7 h-5 rounded border border-amber-600/40 grid grid-cols-2 gap-0.5 p-0.5">
                    <div className="bg-amber-600/20 rounded-sm"></div>
                    <div className="bg-amber-600/20 rounded-sm"></div>
                  </div>
                </div>

                <div className="text-slate-300 flex items-center gap-1 text-xs font-mono font-bold">
                  <span>)))</span>
                  <span className="text-[9px] uppercase tracking-wider">{card.status}</span>
                </div>
              </div>

              {/* Masked Card Number */}
              <div className="relative z-10 font-mono text-lg sm:text-xl font-extrabold tracking-[0.2em] text-white">
                •••• •••• •••• {card.last4}
              </div>

              {/* Card Details: Cardholder & Expiry */}
              <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/10 text-xs">
                <div>
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Cardholder</div>
                  <div className="font-extrabold text-white tracking-wide">{card.cardholderName}</div>
                </div>

                <div className="text-right">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">Expires</div>
                  <div className="font-mono font-extrabold text-white">{card.expiry}</div>
                </div>
              </div>

              {/* Balance & Card Control Actions */}
              <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-300 font-bold uppercase">
                    {card.cardType === 'CREDIT' ? 'Used Balance' : 'Available Balance'}
                  </div>
                  <div className="text-base font-black text-white">
                    ${(card.usedBalance || card.availableBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleAutoCategorize(card.id)}
                    className={`p-2 rounded-xl text-xs font-bold transition-all ${
                      card.autoCategorize
                        ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                    title={card.autoCategorize ? "AI Auto-Categorize Enabled" : "Enable AI Auto-Categorize"}
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleFreeze(card.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      isFrozen
                        ? 'bg-rose-500 text-white font-black shadow'
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    {isFrozen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{isFrozen ? 'Unfreeze' : 'Freeze'}</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add New Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg saas-card p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-500" />
                  Link or Issue New Payment Card
                </h3>
                <p className="text-xs text-slate-500">Configure corporate credit, debit, or virtual cards</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Card Nickname / Title</label>
                <input
                  type="text"
                  required
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  placeholder="e.g. Chase Corporate Platinum"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Card Instrument Type</label>
                  <select
                    value={newCardType}
                    onChange={(e) => setNewCardType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="CREDIT">Corporate Credit Card</option>
                    <option value="DEBIT">Executive Debit Card</option>
                    <option value="VIRTUAL">AI Virtual Procurement</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Card Network</label>
                  <select
                    value={newNetwork}
                    onChange={(e) => setNewNetwork(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="American Express">American Express</option>
                    <option value="Discover">Discover</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  required
                  value={newCardholder}
                  onChange={(e) => setNewCardholder(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    value={newLast4}
                    onChange={(e) => setNewLast4(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    required
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Credit Limit ($)</label>
                  <input
                    type="number"
                    required
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-right"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black shadow-lg"
                >
                  Save & Link Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
