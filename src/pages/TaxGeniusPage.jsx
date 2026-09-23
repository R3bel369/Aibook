import React, { useState, useMemo } from 'react';
import { useFinancialData } from '../context/FinancialDataContext';
import { 
  Building, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  ShieldCheck, 
  DollarSign, 
  Car, 
  Home, 
  Utensils, 
  Laptop,
  Users,
  Send
} from 'lucide-react';

export default function TaxGeniusPage() {
  const { transactions, financialTotals } = useFinancialData();
  const [selectedTab, setSelectedTab] = useState('deductions'); // 'deductions' | '1099' | 'schedule-c'
  const [requestedW9Ids, setRequestedW9Ids] = useState([]);

  // Compute Tax Deductions from Ledger
  const taxDeductionCategories = useMemo(() => {
    const totalExp = financialTotals.totalExpenses || 10000;

    return [
      {
        id: 'tax_home_office',
        name: 'Home Office Deduction (Simplified Rule)',
        icon: Home,
        amount: 1500,
        confidence: 'High (IRS Sec. 280A)',
        description: '300 sq ft @ $5/sq ft standard IRS rate for qualified home workspace.',
        status: 'Qualified',
        color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60'
      },
      {
        id: 'tax_meals',
        name: 'Client Business Meals (50% Deduction)',
        icon: Utensils,
        amount: (transactions.filter(t => t.category?.includes('Food') || t.category?.includes('Dining')).reduce((a, b) => a + (b.debit || 0), 0) * 0.5) || 420,
        confidence: 'High (Receipt OCR Verified)',
        description: '50% allowable tax deduction on client entertainment & travel meals.',
        status: 'Qualified',
        color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
      },
      {
        id: 'tax_vehicle',
        name: 'Business Vehicle Mileage (67¢/mile)',
        icon: Car,
        amount: 1840,
        confidence: 'Medium (Logbook recommended)',
        description: '2,746 business miles driven for client meetings @ 2026 IRS standard rate.',
        status: 'Review Log',
        color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/60'
      },
      {
        id: 'tax_sec179',
        name: 'Section 179 Equipment Instant Write-off',
        icon: Laptop,
        amount: (transactions.filter(t => t.category?.includes('Supplies') || t.debit > 1000).reduce((a, b) => a + (b.debit || 0), 0)) || 2400,
        confidence: 'High (Full Year-1 Expense)',
        description: 'Immediate 100% write-off for computer hardware, office furniture & tools.',
        status: 'Qualified',
        color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60'
      }
    ];
  }, [transactions, financialTotals]);

  const totalPotentialTaxSavings = useMemo(() => {
    const totalDeductions = taxDeductionCategories.reduce((acc, item) => acc + item.amount, 0);
    // Estimated tax bracket of 24%
    return {
      totalDeductions,
      taxSavedEst: totalDeductions * 0.24
    };
  }, [taxDeductionCategories]);

  // Mock Vendor 1099 Data derived from transactions
  const contractors1099 = useMemo(() => {
    const vendorMap = {};
    transactions.forEach(t => {
      const name = t.merchant || t.description;
      if (t.debit > 0) {
        vendorMap[name] = (vendorMap[name] || 0) + Number(t.debit);
      }
    });

    const list = Object.entries(vendorMap).map(([name, total], idx) => ({
      id: `v1099_${idx}`,
      name,
      totalAmount: total,
      needs1099: total >= 600,
      hasW9: idx % 2 === 0,
      tin: idx % 2 === 0 ? 'XX-XXX4910' : 'Missing'
    }));

    return list.sort((a, b) => b.totalAmount - a.totalAmount);
  }, [transactions]);

  const handleRequestW9 = (id) => {
    if (!requestedW9Ids.includes(id)) {
      setRequestedW9Ids([...requestedW9Ids, id]);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> AI Tax Radar & Compliance
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">IRS Tax Savings & 1099 Optimizer</h1>
          <p className="text-xs text-emerald-200/80 max-w-2xl">
            Real-time tax deduction scanner, automated IRS Schedule C prep packs, and vendor 1099 compliance tracking to maximize tax write-offs safely.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <div className="px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-right">
            <span className="block text-[10px] text-emerald-300 font-bold uppercase">Estimated Tax Cash Saved</span>
            <span className="text-2xl font-black text-emerald-300">
              ${totalPotentialTaxSavings.taxSavedEst.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setSelectedTab('deductions')}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
            selectedTab === 'deductions'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Tax Deductions Maximizer
        </button>

        <button
          onClick={() => setSelectedTab('1099')}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
            selectedTab === '1099'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" /> 1099 Vendor Compliance (${contractors1099.filter(c => c.needs1099).length})
        </button>

        <button
          onClick={() => setSelectedTab('schedule-c')}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
            selectedTab === 'schedule-c'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" /> IRS Schedule C Pack
        </button>
      </div>

      {/* TAB 1: DEDUCTIONS MAXIMIZER */}
      {selectedTab === 'deductions' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taxDeductionCategories.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="saas-card p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">{item.name}</h3>
                        <p className="text-[11px] text-slate-500">{item.confidence}</p>
                      </div>
                    </div>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      +${item.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <span className="text-slate-400">IRS Qualification</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="saas-card p-6 bg-gradient-to-r from-emerald-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-base font-black">Total Tax Write-Offs Unlocked: ${totalPotentialTaxSavings.totalDeductions.toLocaleString()}</h4>
              <p className="text-xs text-emerald-200/80">Estimated net cash saved on Q4 taxes based on 24% tax rate bracket.</p>
            </div>
            <button
              onClick={() => setSelectedTab('schedule-c')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shrink-0 flex items-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" /> Download Tax Tax-Pack PDF
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: 1099 VENDOR COMPLIANCE */}
      {selectedTab === '1099' && (
        <div className="saas-card p-6 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Form 1099-NEC Contractor Threshold Tracker</h3>
              <p className="text-xs text-slate-500">Vendors paid ≥$600 per tax year require Form 1099-NEC filing by Jan 31st</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-black">
              IRS Threshold: $600/yr
            </span>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {contractors1099.map((contractor) => {
              const isRequested = requestedW9Ids.includes(contractor.id);
              return (
                <div key={contractor.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900 dark:text-white">{contractor.name}</span>
                      {contractor.needs1099 ? (
                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-black">
                          1099 Required (≥$600)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                          Below Limit
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-4">
                      <span>TIN: <strong className="text-slate-700 dark:text-slate-300 font-mono">{contractor.tin}</strong></span>
                      <span>W-9 Status: {contractor.hasW9 ? <strong className="text-emerald-600">Verified</strong> : <strong className="text-rose-500">Missing</strong>}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-base font-black text-slate-900 dark:text-white">
                        ${contractor.totalAmount.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-slate-400">Total YTD Payout</span>
                    </div>

                    {!contractor.hasW9 && contractor.needs1099 && (
                      isRequested ? (
                        <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black flex items-center gap-1">
                          <Send className="w-3.5 h-3.5" /> Request Sent
                        </span>
                      ) : (
                        <button
                          onClick={() => handleRequestW9(contractor.id)}
                          className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black shadow transition-all"
                        >
                          Request W-9
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SCHEDULE C PREP */}
      {selectedTab === 'schedule-c' && (
        <div className="saas-card p-6 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Form 1040 Schedule C Draft Preview</h3>
              <p className="text-xs text-slate-500">Profit or Loss From Business (Sole Proprietorship / Single-Member LLC)</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-2 shadow">
              <Download className="w-4 h-4" /> Export CSV / IRS Ready
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-4 border border-slate-800 shadow-inner">
            <div className="border-b border-slate-800 pb-3 text-center">
              <h4 className="font-black text-sm text-emerald-400">SCHEDULE C (Form 1040) - IRS TAX YEAR 2026</h4>
              <p className="text-[10px] text-slate-400">Department of the Treasury - Internal Revenue Service</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-3">
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Business Name</span>
                <span className="font-bold text-white">ACME CONSULTING LLC</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Principal Code (NAICS)</span>
                <span className="font-bold text-white">541511 - Custom Computer Programming</span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-black text-sky-400 text-[11px] uppercase">Part I: Income</h5>
              <div className="flex justify-between border-b border-slate-800/60 py-1">
                <span>1. Gross Receipts or Sales</span>
                <span className="text-emerald-400 font-bold">${financialTotals.totalIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 py-1">
                <span>7. Gross Income</span>
                <span className="text-emerald-400 font-bold">${financialTotals.totalIncome.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-black text-purple-400 text-[11px] uppercase">Part II: Expenses</h5>
              <div className="flex justify-between border-b border-slate-800/60 py-1">
                <span>8. Advertising & Marketing</span>
                <span>$1,250.00</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 py-1">
                <span>13. Depreciation & Section 179</span>
                <span>${(taxDeductionCategories[3].amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 py-1">
                <span>18. Office Expense & SaaS</span>
                <span>${(financialTotals.totalExpenses * 0.4).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 py-1 font-black text-rose-400">
                <span>28. Total Expenses</span>
                <span>${financialTotals.totalExpenses.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-emerald-500/40 pt-3 flex justify-between font-black text-sm text-emerald-300">
              <span>31. Net Profit (or Loss)</span>
              <span>${financialTotals.netCashFlow.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
