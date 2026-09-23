import React, { useState } from 'react';
import { Upload, FileText, Image, FileSpreadsheet, CheckCircle2, Sparkles, Cpu, Code, ArrowRight, Copy, Check } from 'lucide-react';
import { extractTransactionsFromOCR } from '../../utils/ocrEngine';

const SAMPLE_NOISY_OCR = `APEX TRUST BANK - ACCOUNT STATEMENT
Statement Period: Oct 01, 2024 – Oct 31, 2024
Page 1 of 3

Oct 31, 2024 | INT-00102 | Monthly Interest Paid (APY 0.75%) | CREDIT: $45.00 | BAL: $7,118.35
Oct 30, 2024 | POS-90184 | CVS Pharmacy Health & Wellness
  Store #4912 Prescriptions & Medical
  DEBIT: $12.00 | BAL: $7,073.35
Oct 28, 2024 | POS-12903 | Starbucks Coffee #1920 | DEBIT: $14.86 | BAL: $7,085.35
Oct 26, 2024 | ACH-48190 | Chase Credit Card Auto Payment | DEBIT: $1,65O.OO | BAL: $7,100.21
Oct 24, 2024 | POS-77412 | Target Supercenter Retail Purchase | DEBIT: $88.2O | BAL: $8,75O.21
Oct 22, 2024 | ATM-00912 | ATM Cash Withdrawal - Main Branch | DEBIT: $200.00 | BAL: $8,838.41
Oct 03, 2024 | EFT-11843 | Mortgage Auto-Debit - Apex Home Loans | DEBIT: $l,450.00 | BAL: $6,S40.50`;

export default function DragDropZone({ onFileSelected, onOcrTransactionsExtracted }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'ocr'
  const [isDragging, setIsDragging] = useState(false);
  const [rawOcrInput, setRawOcrInput] = useState('');
  const [ocrResults, setOcrResults] = useState(null);
  const [copiedJson, setCopiedJson] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  const handleRunOcrEngine = () => {
    const textToProcess = rawOcrInput.trim() || SAMPLE_NOISY_OCR;
    const jsonOutput = extractTransactionsFromOCR(textToProcess, 2024);
    setOcrResults(jsonOutput);
  };

  const handleLoadSample = () => {
    setRawOcrInput(SAMPLE_NOISY_OCR);
    const jsonOutput = extractTransactionsFromOCR(SAMPLE_NOISY_OCR, 2024);
    setOcrResults(jsonOutput);
  };

  const handleCopyJson = () => {
    if (!ocrResults) return;
    navigator.clipboard.writeText(JSON.stringify(ocrResults, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleImportExtracted = () => {
    if (!ocrResults || !ocrResults.length) return;
    if (onOcrTransactionsExtracted) {
      onOcrTransactionsExtracted(ocrResults);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 max-w-md mx-auto border border-slate-300 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'upload'
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File (PDF / CSV)</span>
        </button>

        <button
          onClick={() => setActiveTab('ocr')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ocr'
              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Tesseract OCR Engine</span>
        </button>
      </div>

      {activeTab === 'upload' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative glass-card rounded-3xl p-8 sm:p-12 text-center border-2 border-dashed transition-all duration-300 ${
            isDragging
              ? "border-emerald-500 bg-emerald-500/10 scale-[1.01]"
              : "border-slate-300 dark:border-slate-700 hover:border-emerald-500/60"
          }`}
        >
          <input
            type="file"
            id="bank-statement-upload"
            accept=".pdf,.csv,.xlsx,.xls,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-blue-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10 animate-pulse-subtle">
              <Upload className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Drag & Drop Your Bank Statement
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Or browse files from your computer to start automatic AI transaction extraction
              </p>
            </div>

            <label
              htmlFor="bank-statement-upload"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Browse Statement Files</span>
            </label>

            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-center gap-4 text-slate-400 text-xs font-semibold">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                <span>PDF Statement</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                <span>CSV / Excel</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Image className="w-3.5 h-3.5 text-blue-500" />
                <span>Scanned JPG / PNG</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Raw OCR Extraction Engine Tab */
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Raw Tesseract OCR Extraction Engine
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase">Active Engine</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reconstructs noisy Tesseract OCR output, corrects character substitutions (0/O, 1/l/I, 5/S, 8/B), merges wrapped lines, and tracks raw audit trails.
              </p>
            </div>
            
            <button
              onClick={handleLoadSample}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Load Noisy Sample OCR</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Paste Raw Tesseract OCR Output Below:
            </label>
            <textarea
              rows={6}
              value={rawOcrInput}
              onChange={(e) => setRawOcrInput(e.target.value)}
              placeholder="Paste raw noisy OCR text here (e.g. Oct 31, 2024 | POS-90184 | CVS Pharmacy | DEBIT: $12.O0)..."
              className="w-full p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs border border-slate-700 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handleRunOcrEngine}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              <span>Run OCR Extraction Engine</span>
            </button>

            {ocrResults && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-1.5"
                >
                  {copiedJson ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedJson ? "Copied JSON!" : "Copy JSON Output"}</span>
                </button>

                {onOcrTransactionsExtracted && (
                  <button
                    onClick={handleImportExtracted}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
                  >
                    <span>Import {ocrResults.length} Transactions</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results Preview Block */}
          {ocrResults && (
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-500" />
                  Reconstructed JSON Array Output ({ocrResults.length} Transactions)
                </h4>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 max-h-72 overflow-y-auto">
                <pre>{JSON.stringify(ocrResults, null, 2)}</pre>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
