import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { FinancialDataProvider } from './context/FinancialDataContext';
import { NotificationProvider } from './context/NotificationContext';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import ExtractionReviewPage from './pages/ExtractionReviewPage';
import ReviewQueuePage from './pages/ReviewQueuePage';
import ReviewPage from './pages/ReviewPage';
import AIAssistantPage from './pages/AIAssistantPage';
import SmartAlertsPage from './pages/SmartAlertsPage';
import RecurringPaymentsPage from './pages/RecurringPaymentsPage';
import SettingsPage from './pages/SettingsPage';

// New Mind-Blowing Feature Pages
import ReceiptReconciliationPage from './pages/ReceiptReconciliationPage';
import CashFlowSimulatorPage from './pages/CashFlowSimulatorPage';
import TaxGeniusPage from './pages/TaxGeniusPage';
import AutoBookkeeperAgentPage from './pages/AutoBookkeeperAgentPage';
import FraudVampireHunterPage from './pages/FraudVampireHunterPage';
import ExecutivePitchDeckPage from './pages/ExecutivePitchDeckPage';
import MultiEntityHubPage from './pages/MultiEntityHubPage';

// Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import TransactionTable from './components/transactions/TransactionTable';
import TransactionDetailsDrawer from './components/transactions/TransactionDetailsDrawer';
import BulkActionToolbar from './components/transactions/BulkActionToolbar';
import AIInsightsList from './components/insights/AIInsightsList';
import FinancialReportsHub from './components/reports/FinancialReportsHub';
import CashFlowView from './components/reports/CashFlowView';
import BankAccountsManager from './components/settings/BankAccountsManager';
import ProfileSettings from './components/settings/ProfileSettings';
import AIChatWidget from './components/ai/AIChatWidget';
import VoiceAndWhatsAppModal from './components/ai/VoiceAndWhatsAppModal';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTx, setSelectedTx] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [extractedLedger, setExtractedLedger] = useState(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Top level views outside main layout shell
  if (activeTab === 'landing') {
    return <LandingPage onNavigate={(tab) => setActiveTab(tab)} />;
  }

  if (activeTab === 'auth' || !isAuthenticated) {
    return <AuthPage onComplete={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col transition-colors duration-200">
      
      {/* Top Header */}
      <Header
        onUploadClick={() => setActiveTab('upload')}
        onNavigate={(tab) => setActiveTab(tab)}
        onSelectTransaction={(tx) => setSelectedTx(tx)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto items-start">
        
        {/* Left Sticky Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'voice-agent') {
              setIsVoiceModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
        />

        {/* Main Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 space-y-6">
          
          {/* Main Dashboard */}
          {activeTab === 'dashboard' && (
            <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />
          )}

          {/* Statement Upload Journey */}
          {activeTab === 'upload' && (
            <UploadPage onNavigate={(tab) => setActiveTab(tab)} />
          )}

          {/* 8 Mind-Blowing Features Routes */}
          {activeTab === 'auto-agent' && <AutoBookkeeperAgentPage />}
          {activeTab === 'reconciliation' && <ReceiptReconciliationPage />}
          {activeTab === 'simulator' && <CashFlowSimulatorPage />}
          {activeTab === 'tax-genius' && <TaxGeniusPage />}
          {activeTab === 'vampire-hunter' && <FraudVampireHunterPage />}
          {activeTab === 'pitch-deck' && <ExecutivePitchDeckPage />}
          {activeTab === 'multi-entity' && <MultiEntityHubPage />}

          {/* Statement File Manager */}
          {activeTab === 'my-statements' && (
            <div className="saas-card p-8 space-y-4 max-w-4xl mx-auto">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">My Uploaded Statements</h2>
              <p className="text-xs text-slate-500">History of parsed PDF, CSV, and OCR statement files.</p>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-mono">
                1. sample_bank_statement.pdf • Oct 01 – Oct 31, 2026 • 15 Transactions Extracted (Active)
              </div>
            </div>
          )}

          {/* Extraction Review Step */}
          {activeTab === 'extraction-review' && (
            <ExtractionReviewPage
              extractedTransactions={extractedLedger || []}
              onFinalize={() => setActiveTab('dashboard')}
              onCancel={() => setActiveTab('upload')}
            />
          )}

          {/* All Transactions Ledger */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Transaction Ledger</h2>
                <p className="text-xs text-slate-500">Complete extracted bank statement line items with AI confidence scores</p>
              </div>
              <TransactionTable
                onSelectTransaction={(tx) => setSelectedTx(tx)}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
              />
              <BulkActionToolbar
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
              />
            </div>
          )}

          {/* Needs Review Queue */}
          {activeTab === 'review' && <ReviewQueuePage />}

          {/* Uncategorized */}
          {activeTab === 'uncategorized' && <ReviewPage />}

          {/* AI Insights */}
          {activeTab === 'insights' && <AIInsightsList />}

          {/* AI Bookkeeper Chat */}
          {activeTab === 'ai-assistant' && <AIAssistantPage />}

          {/* Smart Alerts */}
          {activeTab === 'anomalies' && <SmartAlertsPage />}

          {/* Recurring Payments */}
          {activeTab === 'recurring' && <RecurringPaymentsPage />}

          {/* Reports */}
          {activeTab === 'reports-summary' && <FinancialReportsHub defaultTab="summary" />}
          {activeTab === 'reports' && <FinancialReportsHub defaultTab="pnl" />}
          {activeTab === 'cashflow' && <CashFlowView />}
          {activeTab === 'expense-report' && <FinancialReportsHub defaultTab="expenses" />}

          {/* Settings */}
          {activeTab === 'settings-profile' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Profile Settings</h2>
              <ProfileSettings />
            </div>
          )}
          {activeTab === 'accounts' && <BankAccountsManager />}
          {activeTab === 'settings' && <SettingsPage />}
          {activeTab === 'security' && (
            <div className="saas-card p-6 max-w-4xl mx-auto space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Security & Audit Controls</h3>
              <p className="text-xs text-slate-500">Client-side encryption active. Local API key memory storage enabled. TLS 1.3 encryption active.</p>
            </div>
          )}

        </main>

      </div>

      {/* Transaction Right-Side Slide-Over Drawer */}
      {selectedTx && (
        <TransactionDetailsDrawer
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}

      {/* Voice & WhatsApp Modal */}
      <VoiceAndWhatsAppModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      {/* Floating Assistant Widget */}
      <AIChatWidget />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FinancialDataProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </FinancialDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
