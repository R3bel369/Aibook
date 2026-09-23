import React, { useState } from 'react';
import { User, Building2, Bell, Shield, Sparkles, Settings as SettingsIcon } from 'lucide-react';
import ProfileSettings from '../components/settings/ProfileSettings';
import BankAccountsManager from '../components/settings/BankAccountsManager';
import AISettingsManager from '../components/settings/AISettingsManager';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('ai_models');

  const TABS = [
    { id: 'ai_models', label: 'AI APIs (Gemini / Claude)', icon: Sparkles },
    { id: 'profile', label: 'Profile & Business', icon: User },
    { id: 'accounts', label: 'Bank Accounts', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Data & Security', icon: Shield }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-slate-500" />
          <span>Platform Settings</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure AI models, API keys, business rules, and linked bank accounts</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'glass-card text-slate-600 dark:text-slate-300 hover:text-emerald-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'ai_models' && <AISettingsManager />}
      {activeTab === 'profile' && <ProfileSettings />}
      {activeTab === 'accounts' && <BankAccountsManager />}
      {activeTab === 'notifications' && (
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Notification Preferences</h3>
          <p className="text-xs text-slate-500">Unusual transaction alerts (Active), Monthly P&L report notifications (Active), Subscription due reminders (Active).</p>
        </div>
      )}
      {activeTab === 'security' && (
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Security & Audit Logs</h3>
          <p className="text-xs text-slate-500">AES-256 Data Encryption Active • Bank Statement OCR memory sanitization enabled • TLS 1.3 Active.</p>
        </div>
      )}

    </div>
  );
}

