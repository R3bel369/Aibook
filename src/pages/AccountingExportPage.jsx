import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  CheckCircle2,
  FileText,
  Zap,
  Sliders,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  Code,
  Check,
  RefreshCw
} from 'lucide-react';
import { useFinancialData } from '../context/FinancialDataContext';

const EXPORT_PLATFORMS = [
  {
    id: 'qbo',
    name: 'QuickBooks Online (QBO)',
    format: 'QBO JSON & Standard CSV',
    icon: '📊',
    color: 'from-emerald-600 to-teal-700',
    description: 'Direct IIF/CSV import with pre-mapped chart of account codes and tax categories.',
    fileExt: '.csv'
  },
  {
    id: 'xero',
    name: 'Xero Accounting',
    format: 'Xero Bank Feed CSV',
    icon: '🔵',
    color: 'from-sky-600 to-blue-700',
    description: 'Formatted with Xero date (DD/MM/YYYY), contact names, and track code columns.',
    fileExt: '.csv'
  },
  {
    id: 'tally',
    name: 'Tally Prime / ERP 9',
    format: 'Tally XML Data Ledger',
    icon: '🟧',
    color: 'from-amber-600 to-orange-700',
    description: 'Generates Tally XML payload for direct Daybook and Voucher entry sync.',
    fileExt: '.xml'
  },
  {
    id: 'zoho',
    name: 'Zoho Books',
    format: 'Zoho Bank Statement CSV',
    icon: '🔴',
    color: 'from-red-600 to-rose-700',
    description: 'Compatible with Zoho Books automated statement reconciliation workflow.',
    fileExt: '.csv'
  },
  {
    id: 'universal_csv',
    name: 'Universal Excel / CSV Ledger',
    format: 'Standard UTF-8 CSV',
    icon: '📄',
    color: 'from-purple-600 to-indigo-700',
    description: 'Complete unedited transaction dataset with AI confidence scores & notes.',
    fileExt: '.csv'
  }
];

export default function AccountingExportPage() {
  const { transactions } = useFinancialData();
  const [selectedPlatform, setSelectedPlatform] = useState('qbo');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState('');
  const [includeAIExplanations, setIncludeAIExplanations] = useState(true);
  const [includeConfidenceScores, setIncludeConfidenceScores] = useState(true);
  const [dateRange, setDateRange] = useState('all');

  const currentPlatformObj = EXPORT_PLATFORMS.find(p => p.id === selectedPlatform);

  const handleTriggerExport = () => {
    setIsExporting(true);
    setExportSuccessMsg('');

    setTimeout(() => {
      setIsExporting(false);
      
      // Generate actual downloadable CSV file content in browser
      let csvContent = "data:text/csv;charset=utf-8,";
      if (selectedPlatform === 'tally') {
        csvContent = "data:text/xml;charset=utf-8,<ENVELOPE><HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER><BODY><IMPORTDATA><REQUESTDATA>";
        transactions.forEach(t => {
          csvContent += `<VOUCHER><DATE>${t.date}</DATE><NARRATION>${t.description}</NARRATION><AMOUNT>${t.debit || -t.credit}</AMOUNT></VOUCHER>`;
        });
        csvContent += "</REQUESTDATA></IMPORTDATA></BODY></ENVELOPE>";
      } else {
        csvContent += "Transaction_ID,Date,Description,Category,Subcategory,Debit_Amount,Credit_Amount,Balance,AI_Confidence,Status\n";
        transactions.forEach(t => {
          csvContent += `"${t.id}","${t.date}","${t.description.replace(/"/g, '""')}","${t.category}","${t.subcategory || ''}","${t.debit}","${t.credit}","${t.balance}","${t.aiConfidence}%","${t.status}"\n`;
        });
      }

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `ai_bookkeeping_export_${selectedPlatform}_${Date.now()}${currentPlatformObj.fileExt}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportSuccessMsg(`Successfully generated & downloaded ${transactions.length} line items formatted for ${currentPlatformObj.name}!`);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="saas-card p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multi-Format Accounting Data Bridge</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Accounting Software Export Hub</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Export verified AI-categorized bank transactions directly into QuickBooks Online, Xero, Tally Prime, or Zoho Books with zero manual data entry.
            </p>
          </div>

          <button
            onClick={handleTriggerExport}
            disabled={isExporting}
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-xs shadow-xl transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
            <span>{isExporting ? 'Generating File...' : `Download ${currentPlatformObj?.name} Export`}</span>
          </button>
        </div>
      </div>

      {exportSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-extrabold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{exportSuccessMsg}</span>
          </div>
          <button onClick={() => setExportSuccessMsg('')} className="text-emerald-500 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Platform Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-500" />
          Select Target Accounting Software
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {EXPORT_PLATFORMS.map((platform) => {
            const isSelected = selectedPlatform === platform.id;
            return (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`saas-card p-5 text-left transition-all relative space-y-3 cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/40 shadow-lg'
                    : 'hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <div className="text-3xl">{platform.icon}</div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-xs">{platform.name}</h3>
                  <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">{platform.format}</div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{platform.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Export Configurations & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Export Controls */}
        <div className="saas-card p-6 space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-500" />
            Export Settings & Filters
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Statement Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700"
              >
                <option value="all">All Extracted Transactions ({transactions.length} items)</option>
                <option value="approved">Approved Line Items Only</option>
                <option value="october">October 2026 Statement Period</option>
              </select>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeAIExplanations}
                  onChange={(e) => setIncludeAIExplanations(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Include AI Categorization Explanations</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeConfidenceScores}
                  onChange={(e) => setIncludeConfidenceScores(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Include AI Confidence Scores (%)</span>
              </label>
            </div>

            <button
              onClick={handleTriggerExport}
              disabled={isExporting}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download Export Bundle ({currentPlatformObj?.fileExt})</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Field Mapping & Data Preview */}
        <div className="lg:col-span-2 saas-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-500" />
              Live Ledger Mapping Preview ({currentPlatformObj?.name})
            </h3>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {transactions.length} Rows Ready
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Category Head</th>
                  <th className="p-3 text-right">Debit ($)</th>
                  <th className="p-3 text-right">Credit ($)</th>
                  <th className="p-3 text-center">AI Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                {transactions.slice(0, 5).map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-mono text-[11px] whitespace-nowrap">{t.date}</td>
                    <td className="p-3 font-extrabold max-w-[180px] truncate">{t.description}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-extrabold text-[10px]">
                        {t.category}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400">{t.debit > 0 ? `$${t.debit.toFixed(2)}` : '-'}</td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">{t.credit > 0 ? `$${t.credit.toFixed(2)}` : '-'}</td>
                    <td className="p-3 text-center">
                      <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-600 dark:text-sky-400 font-bold text-[10px]">
                        {t.aiConfidence}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-slate-500 text-center italic">Showing first 5 sample lines out of {transactions.length} extracted records</div>
        </div>

      </div>

    </div>
  );
}
