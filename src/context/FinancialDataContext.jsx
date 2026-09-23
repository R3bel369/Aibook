import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SAMPLE_STATEMENTS } from '../data/sampleStatements';
import { CATEGORIES } from '../data/mockData';
import { saveUserCategorizationRule } from '../utils/aiCategorizer';
import { useAuth } from './AuthContext';
import { syncTransactionsToSupabase } from '../lib/supabase';


const FinancialDataContext = createContext();
const DATA_VERSION = "v5_oct_2024_exact_pdf_usd_only";

const CATEGORY_COLORS = {
  "Salaries & Wages": "#8B5CF6",
  "Mortgage & Housing": "#F43F5E",
  "Office Rent & Lease": "#F43F5E",
  "Card Payments & Debt": "#8B5CF6",
  "Marketing & Advertising": "#EC4899",
  "Software & SaaS": "#6366F1",
  "Groceries & Living": "#F97316",
  "Food & Client Dining": "#F97316",
  "Travel & Transport": "#06B6D4",
  "Utilities & Energy": "#F59E0B",
  "Utilities & Electricity": "#F59E0B",
  "Office Supplies": "#EAB308",
  "Entertainment": "#D946EF",
  "Other Expenses": "#64748B"
};

export function FinancialDataProvider({ children }) {
  const { updateProfile } = useAuth();
  // Default to exact Oct 2024 Bank Statement PDF
  const defaultStatement = SAMPLE_STATEMENTS[0];

  // Auto-purge stale browser cache if data version changed
  useEffect(() => {
    const savedVersion = localStorage.getItem('app_data_version');
    if (savedVersion !== DATA_VERSION) {
      localStorage.removeItem('app_financial_transactions');
      localStorage.removeItem('app_active_statement_info');
      localStorage.removeItem('app_user_profile');
      localStorage.setItem('app_data_version', DATA_VERSION);
    }
  }, []);

  const [activeStatementInfo, setActiveStatementInfo] = useState(() => {
    const savedVersion = localStorage.getItem('app_data_version');
    if (savedVersion !== DATA_VERSION) {
      return {
        id: defaultStatement.id,
        name: defaultStatement.name,
        bankName: defaultStatement.bankName,
        openingBalance: defaultStatement.openingBalance,
        currency: defaultStatement.currency || "USD"
      };
    }
    const saved = localStorage.getItem('app_active_statement_info');
    return saved ? JSON.parse(saved) : {
      id: defaultStatement.id,
      name: defaultStatement.name,
      bankName: defaultStatement.bankName,
      openingBalance: defaultStatement.openingBalance,
      currency: defaultStatement.currency || "USD"
    };
  });

  const [transactions, setTransactions] = useState(() => {
    const savedVersion = localStorage.getItem('app_data_version');
    if (savedVersion !== DATA_VERSION) {
      return defaultStatement.transactions;
    }
    const saved = localStorage.getItem('app_financial_transactions');
    return saved ? JSON.parse(saved) : defaultStatement.transactions;
  });

  const [selectedAccountId, setSelectedAccountId] = useState("ALL");
  const [categories, setCategories] = useState(CATEGORIES);

  // Persistence
  useEffect(() => {
    localStorage.setItem('app_financial_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('app_active_statement_info', JSON.stringify(activeStatementInfo));
  }, [activeStatementInfo]);

  // Bank accounts created from active statement
  const bankAccounts = useMemo(() => {
    const totalCredit = transactions.reduce((acc, t) => acc + Number(t.credit || 0), 0);
    const totalDebit = transactions.reduce((acc, t) => acc + Number(t.debit || 0), 0);
    const endingBalance = activeStatementInfo.openingBalance + (totalCredit - totalDebit);

    return [
      {
        id: "acc_active_01",
        bankName: activeStatementInfo.bankName || "Business Checking",
        accountType: "Parsed Statement",
        accountNumber: "•••• 4892",
        openingBalance: activeStatementInfo.openingBalance,
        balance: endingBalance,
        currency: activeStatementInfo.currency || "USD",
        currencySymbol: activeStatementInfo.currency === "INR" ? "₹" : "$",
        isPrimary: true,
        logo: "🏦",
        color: "from-blue-600 to-indigo-700",
        lastSynced: "Active Statement"
      }
    ];
  }, [transactions, activeStatementInfo]);

  // Compute key statement metrics strictly for active statement (NO DUMMY DATA)
  const financialTotals = useMemo(() => {
    let income = 0;
    let expenses = 0;

    transactions.forEach(tx => {
      if (tx.type === "INCOME") {
        income += Number(tx.credit || 0);
      } else {
        expenses += Number(tx.debit || 0);
      }
    });

    const netCashFlow = income - expenses;
    const openingBalance = activeStatementInfo.openingBalance || 0;
    const finalTotalBalance = openingBalance + netCashFlow;

    return {
      openingBalance,
      totalIncome: income,
      totalExpenses: expenses,
      netCashFlow,
      netProfit: netCashFlow,
      finalTotalBalance,
      currentBalance: finalTotalBalance,
      needsReviewCount: transactions.filter(t => t.status === "NEEDS_REVIEW").length
    };
  }, [transactions, activeStatementInfo]);

  // Dynamically compute monthly summary from ONLY active statement transactions
  const monthlySummary = useMemo(() => {
    const monthMap = {};

    transactions.forEach(tx => {
      if (!tx.date) return;
      const date = new Date(tx.date);
      const mName = date.toLocaleDateString("en-US", { month: "short" });
      const year = date.getFullYear();
      const key = `${mName}_${year}`;

      if (!monthMap[key]) {
        monthMap[key] = { month: mName, year, income: 0, expenses: 0, profit: 0 };
      }
      if (tx.type === "INCOME") {
        monthMap[key].income += Number(tx.credit || 0);
      } else {
        monthMap[key].expenses += Number(tx.debit || 0);
      }
      monthMap[key].profit = monthMap[key].income - monthMap[key].expenses;
    });

    const result = Object.values(monthMap);
    return result.length > 0 ? result : [{ month: "Oct", year: 2024, income: financialTotals.totalIncome, expenses: financialTotals.totalExpenses, profit: financialTotals.netCashFlow }];
  }, [transactions, financialTotals]);

  // Dynamically compute category spending breakdown from ONLY active statement transactions
  const categorySpending = useMemo(() => {
    const catMap = {};

    transactions.forEach(tx => {
      if (tx.type === "EXPENSE" && tx.debit > 0) {
        const cat = tx.category || "Other Expenses";
        catMap[cat] = (catMap[cat] || 0) + Number(tx.debit);
      }
    });

    const items = Object.entries(catMap).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || "#64748B"
    }));

    items.sort((a, b) => b.value - a.value);
    return items;
  }, [transactions]);

  // Dynamically generate AI Insights strictly for current active bank statement
  const insights = useMemo(() => {
    const totalRev = financialTotals.totalIncome;
    const totalExp = financialTotals.totalExpenses;
    const netGain = financialTotals.netCashFlow;
    const sym = activeStatementInfo.currency === "INR" ? "₹" : "$";
    const largestCat = categorySpending[0]?.name || "Expenses";
    const largestAmt = categorySpending[0]?.value || 0;

    return [
      {
        id: "ins_01",
        type: netGain >= 0 ? "POSITIVE" : "WARNING",
        icon: "TrendingUp",
        title: `Net Statement Cash Flow (${netGain >= 0 ? '+' : ''}${sym}${netGain.toLocaleString()})`,
        description: `Statement inflow of ${sym}${totalRev.toLocaleString()} vs outflow of ${sym}${totalExp.toLocaleString()} results in net gain of ${sym}${netGain.toLocaleString()}.`,
        impact: `${sym}${netGain.toLocaleString()}`,
        badge: "Net Cash Flow"
      },
      {
        id: "ins_02",
        type: "WARNING",
        icon: "AlertTriangle",
        title: `Top Expense Category: ${largestCat}`,
        description: `${largestCat} accounts for the highest portion of spending totaling ${sym}${largestAmt.toLocaleString()}.`,
        impact: `${sym}${largestAmt.toLocaleString()}`,
        badge: "Top Overhead"
      },
      {
        id: "ins_03",
        type: "NEUTRAL",
        icon: "Wallet",
        title: `Statement Ending Balance (${sym}${financialTotals.finalTotalBalance.toLocaleString()})`,
        description: `Opening balance of ${sym}${financialTotals.openingBalance.toLocaleString()} adjusted by net flow of ${sym}${netGain.toLocaleString()}.`,
        impact: `${sym}${financialTotals.finalTotalBalance.toLocaleString()}`,
        badge: "Final Balance"
      }
    ];
  }, [financialTotals, categorySpending, activeStatementInfo]);

  // Dynamically compute recurring payments from active statement
  const recurringPayments = useMemo(() => {
    const recs = transactions.filter(tx => tx.isRecurring || tx.debit > 1000);
    return recs.map((tx) => ({
      id: `rec_${tx.id}`,
      serviceName: tx.merchant || tx.description,
      merchant: tx.merchant || tx.description,
      logo: "💳",
      amount: tx.debit || tx.credit,
      frequency: "Monthly",
      annualCost: (tx.debit || tx.credit) * 12,
      nextDue: tx.date,
      category: tx.category,
      status: "Active",
      recommendedAction: "Keep",
      question: `Recurring transaction detected from statement`
    }));
  }, [transactions]);

  // Dynamically compute anomalies from active statement
  const anomalies = useMemo(() => {
    const highDebits = transactions.filter(tx => tx.type === "EXPENSE" && tx.debit > 1000);
    return highDebits.map(tx => ({
      id: `anom_${tx.id}`,
      transactionId: tx.id,
      title: `⚡ High Value Debit: ${tx.description}`,
      merchant: tx.merchant || tx.description,
      amount: tx.debit,
      date: tx.date,
      severity: "MEDIUM",
      reason: `Transaction of $${tx.debit} is a major outflow in this statement period.`,
      suggestion: "Verify receipt and business expense qualification.",
      status: "PENDING"
    }));
  }, [transactions]);

  // ACTION HANDLER: Load a Bank Statement and display ONLY its exact parsed data
  const setStatementData = (newTxs, statementMetadata = {}) => {
    const openingBal = statementMetadata.openingBalance !== undefined
      ? statementMetadata.openingBalance
      : (newTxs && newTxs.length)
        ? (newTxs[newTxs.length - 1]?.balance ? newTxs[newTxs.length - 1].balance - (newTxs[newTxs.length - 1].credit - newTxs[newTxs.length - 1].debit) : 4500.00)
        : 5240.50;

    const curr = statementMetadata.currency || "USD";

    const newStatementInfo = {
      id: statementMetadata.id || `stmt_${Date.now()}`,
      name: statementMetadata.name || "Uploaded_Statement.pdf",
      bankName: statementMetadata.bankName || "Parsed Bank Statement",
      openingBalance: openingBal,
      currency: curr
    };

    // Clean overwrite of active statement and transactions
    setActiveStatementInfo(newStatementInfo);
    setTransactions(newTxs || []);

    if (updateProfile) {
      updateProfile({ currency: curr });
    }

    // Persist immediately to localStorage
    try {
      localStorage.setItem('app_active_statement_info', JSON.stringify(newStatementInfo));
      localStorage.setItem('app_financial_transactions', JSON.stringify(newTxs || []));
    } catch (e) {
      console.warn("Storage save error:", e);
    }

    // Auto-sync new statement to Supabase cloud database
    syncTransactionsToSupabase(newTxs || []).then(res => {
      if (res.success) {
        setSyncStatus({ isSyncing: false, lastSynced: new Date(), error: null, needsTableSetup: false, count: res.count });
      }
    });
  };


  const updateTransactionCategory = (transactionId, newCategory, newSubcategory, userNote = "") => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === transactionId) {
        saveUserCategorizationRule(tx.description, newCategory, newSubcategory);
        return {
          ...tx,
          category: newCategory,
          subcategory: newSubcategory || tx.subcategory,
          aiConfidence: 100,
          aiExplanation: `User manually updated category to '${newCategory}'. Learned for future statements.`,
          status: "APPROVED",
          notes: userNote || tx.notes
        };
      }
      return tx;
    }));
  };

  const approveTransaction = (transactionId) => {
    setTransactions(prev => prev.map(tx => tx.id === transactionId ? { ...tx, status: "APPROVED" } : tx));
  };

  const bulkApproveTransactions = (ids) => {
    setTransactions(prev => prev.map(tx => ids.includes(tx.id) ? { ...tx, status: "APPROVED" } : tx));
  };

  const deleteTransaction = (transactionId) => {
    setTransactions(prev => prev.filter(tx => tx.id !== transactionId));
  };

  const handleAnomalyAction = (anomalyId, action) => {};
  const updateSubscriptionAction = (subscriptionId, action) => {};

  const addCustomCategory = (type, name, icon, color) => {
    setCategories(prev => ({
      ...prev,
      [type]: [...prev[type], { id: `custom_${Date.now()}`, name, icon, color, description: "User custom category" }]
    }));
  };

  // Supabase Data Sync
  const [syncStatus, setSyncStatus] = useState({ isSyncing: false, lastSynced: null, error: null, needsTableSetup: false, count: 0 });

  const syncToSupabase = async (txList = transactions) => {
    setSyncStatus(prev => ({ ...prev, isSyncing: true, error: null, needsTableSetup: false }));
    const result = await syncTransactionsToSupabase(txList);
    if (result.success) {
      setSyncStatus({ isSyncing: false, lastSynced: new Date(), error: null, needsTableSetup: false, count: result.count });
    } else {
      setSyncStatus({ isSyncing: false, lastSynced: null, error: result.error, needsTableSetup: result.needsTableSetup });
    }
    return result;
  };

  // Completely reset active statement back to exact Oct 2024 PDF Statement ($5,240.50, $5,725.00, $3,847.15, $1,877.85, $7,118.35)
  const resetDemoData = () => {
    localStorage.clear();
    localStorage.setItem('app_data_version', DATA_VERSION);
    setStatementData(defaultStatement.transactions, defaultStatement);
  };

  return (
    <FinancialDataContext.Provider value={{
      transactions,
      allTransactions: transactions,
      activeStatementInfo,
      bankAccounts,
      selectedAccountId,
      setSelectedAccountId,
      financialTotals,
      recurringPayments,
      subscriptions: recurringPayments,
      anomalies,
      insights,
      categories,
      monthlySummary,
      categorySpending,
      syncStatus,
      syncToSupabase,
      addTransactionsFromStatement: setStatementData,
      setStatementData,
      updateTransactionCategory,
      approveTransaction,
      bulkApproveTransactions,
      deleteTransaction,
      handleAnomalyAction,
      updateSubscriptionAction,
      addCustomCategory,
      resetDemoData
    }}>
      {children}
    </FinancialDataContext.Provider>
  );
}

export function useFinancialData() {
  const context = useContext(FinancialDataContext);
  if (!context) throw new Error('useFinancialData must be used within FinancialDataProvider');
  return context;
}
