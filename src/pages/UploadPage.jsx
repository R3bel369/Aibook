import React, { useState, useEffect } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import DragDropZone from '../components/upload/DragDropZone';
import SampleStatementSelector from '../components/upload/SampleStatementSelector';
import AIProcessingModal from '../components/upload/AIProcessingModal';
import StatementPreviewModal from '../components/upload/StatementPreviewModal';
import { parseStatementFile } from '../utils/pdfParser';
import { useFinancialData } from '../context/FinancialDataContext';
import { useNotifications } from '../context/NotificationContext';
import { getAiApiConfig, getActiveApiKey } from '../utils/aiApiService';
import confetti from 'canvas-confetti';

export default function UploadPage({ onNavigate }) {
  const { addTransactionsFromStatement } = useFinancialData();
  const { addNotification } = useNotifications();

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeFileName, setActiveFileName] = useState('');
  const [aiConfig, setAiConfig] = useState(getAiApiConfig());
  const [previewModalData, setPreviewModalData] = useState({
    isOpen: false,
    parsedTransactions: [],
    metadata: {}
  });

  useEffect(() => {
    setAiConfig(getAiApiConfig());
  }, []);

  const activeApiKey = getActiveApiKey(aiConfig);
  const isLiveAiActive = aiConfig.enableAiApi && Boolean(activeApiKey);

  const processFile = async (fileOrSample) => {
    if (!fileOrSample) return;
    const isSample = Boolean(fileOrSample.transactions);
    const fileName = isSample ? fileOrSample.name : fileOrSample.name || "Bank_Statement.pdf";
    setActiveFileName(fileName);
    setIsProcessing(true);

    try {
      if (isSample) {
        // Simulate step delays for sample statement
        for (let s = 1; s <= 5; s++) {
          setCurrentStep(s);
          await new Promise(res => setTimeout(res, 200));
        }

        setPreviewModalData({
          isOpen: true,
          parsedTransactions: fileOrSample.transactions || [],
          metadata: {
            id: fileOrSample.id,
            name: fileOrSample.name,
            bankName: fileOrSample.bankName,
            openingBalance: fileOrSample.openingBalance,
            currency: fileOrSample.currency || "USD"
          }
        });
      } else {
        // Real uploaded file through OCR Parser & AI Model
        const result = await parseStatementFile(fileOrSample, (stepNum) => {
          setCurrentStep(stepNum);
        });

        if (result.aiError) {
          addNotification({
            title: "⚠️ AI Key Issue Detected",
            message: `${result.aiError}`,
            type: "warning"
          });
        }

        const extracted = result.parsedTransactions || [];
        const metadata = {
          id: `stmt_custom_${Date.now()}`,
          name: fileName,
          bankName: result.bankName || "Uploaded Bank Account",
          openingBalance: extracted[extracted.length - 1]?.balance || 5000.00,
          currency: "USD"
        };

        setPreviewModalData({
          isOpen: true,
          parsedTransactions: extracted,
          metadata
        });
      }
    } catch (err) {
      console.error("Statement processing error:", err);
      addNotification({
        title: "⚠️ Statement Extraction Error",
        message: err.message || "Could not process statement file.",
        type: "error"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOcrExtracted = (ocrResults) => {
    if (!ocrResults || !ocrResults.length) return;
    
    let runningBalance = 5240.50;
    const mapped = ocrResults.map((item, index) => {
      const debitNum = Number(item.debit || 0);
      const creditNum = Number(item.credit || 0);
      runningBalance = runningBalance + creditNum - debitNum;
      
      return {
        id: `tx_ocr_${Date.now()}_${index}`,
        date: item.date || "2024-10-31",
        referenceNo: `OCR-ROW-${1000 + index}`,
        description: item.description,
        debit: debitNum,
        credit: creditNum,
        balance: item.balance || Number(runningBalance.toFixed(2)),
        type: creditNum > 0 ? "INCOME" : "EXPENSE",
        category: creditNum > 0 ? "Income & Deposits" : "Other Expenses",
        subcategory: "OCR Extracted",
        merchant: item.description.split(' ')[0] || "Vendor",
        aiConfidence: item.confidence === 'high' ? 98 : (item.confidence === 'medium' ? 85 : 60),
        aiExplanation: `Extracted via OCR Engine (Confidence: ${item.confidence.toUpperCase()}). Audit raw line: ${item.raw_ocr_line}`,
        status: item.confidence === 'low' ? "NEEDS_REVIEW" : "APPROVED",
        isBusinessExpense: debitNum > 0,
        isRecurring: false,
        bankAccountId: "acc_active_01",
        bankName: "Tesseract OCR Statement",
        notes: `Raw OCR Line: ${item.raw_ocr_line}`
      };
    });

    setPreviewModalData({
      isOpen: true,
      parsedTransactions: mapped,
      metadata: {
        id: `stmt_ocr_${Date.now()}`,
        name: "Tesseract_OCR_Extracted_Statement.txt",
        bankName: "Tesseract OCR Bank Statement",
        openingBalance: 5240.50,
        currency: "USD"
      }
    });
  };

  const handleConfirmImport = (selectedTransactions, metadata) => {
    addTransactionsFromStatement(selectedTransactions, metadata);
    setPreviewModalData({ isOpen: false, parsedTransactions: [], metadata: {} });

    try { confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } }); } catch (e) {}

    addNotification({
      title: "📄 Selected Transactions Imported",
      message: `Imported ${selectedTransactions.length} transactions into All Transactions.`,
      type: "success",
      link: "/transactions"
    });

    if (onNavigate) {
      onNavigate('transactions');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/30 text-xs font-black mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Bank Statement Extraction Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Upload Bank Statement
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            Upload statements in PDF, CSV, Excel (XLSX), JPG, PNG, or paste raw text to extract structured transactions.
          </p>
        </div>

        {/* AI Status Badge */}
        <div className={`px-4 py-2 rounded-2xl border text-xs font-black flex items-center gap-2 ${
          isLiveAiActive 
            ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/40'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
        }`}>
          {isLiveAiActive ? <Sparkles className="w-4 h-4 text-sky-500 animate-pulse" /> : <Zap className="w-4 h-4 text-amber-500" />}
          <span>
            {isLiveAiActive 
              ? `${aiConfig.provider.toUpperCase()} AI Enabled` 
              : "OCR & Rule Engine Active"}
          </span>
        </div>
      </div>

      {/* Main Drag & Drop / OCR Extractor Zone */}
      <DragDropZone 
        onFileSelected={(file) => processFile(file)} 
        onOcrTransactionsExtracted={handleOcrExtracted}
      />

      {/* 1-Click Preset Sample Statements */}
      <SampleStatementSelector onSelectSample={(sample) => processFile(sample)} />

      {/* 5-Step Animated Processing Modal */}
      {isProcessing && (
        <AIProcessingModal
          currentStep={currentStep}
          fileName={activeFileName}
        />
      )}

      {/* Interactive Statement Preview & Selection Modal */}
      <StatementPreviewModal
        isOpen={previewModalData.isOpen}
        onClose={() => setPreviewModalData({ isOpen: false, parsedTransactions: [], metadata: {} })}
        previewData={previewModalData}
        onConfirmImport={handleConfirmImport}
      />
    </div>
  );
}

