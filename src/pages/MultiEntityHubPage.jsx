import React, { useState, useMemo } from 'react';
import { useFinancialData } from '../context/FinancialDataContext';
import { 
  Building2, 
  Globe, 
  ArrowRightLeft, 
  TrendingUp, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  Layers,
  Check
} from 'lucide-react';

export default function MultiEntityHubPage() {
  const { financialTotals } = useFinancialData();
  const [selectedEntityId, setSelectedEntityId] = useState('entity_us');

  // Multi Entity Database Mockup
  const entities = [
    {
      id: 'entity_us',
      name: 'Acme US Corporation',
      country: 'United States 🇺🇸',
      currency: 'USD',
      symbol: '$',
      rateToUSD: 1.0,
      revenue: financialTotals.totalIncome || 24500,
      expenses: financialTotals.totalExpenses || 14200,
      netProfit: (financialTotals.totalIncome || 24500) - (financialTotals.totalExpenses || 14200),
      isPrimary: true
    },
    {
      id: 'entity_eu',
      name: 'Acme Europe Operations BV',
      country: 'Netherlands 🇳🇱',
      currency: 'EUR',
      symbol: '€',
      rateToUSD: 1.08,
      revenue: 18400,
      expenses: 9800,
      netProfit: 8600,
      isPrimary: false
    },
    {
      id: 'entity_in',
      name: 'Acme India Tech Hub Pvt Ltd',
      country: 'India 🇮🇳',
      currency: 'INR',
      symbol: '₹',
      rateToUSD: 0.012,
      revenue: 850000,
      expenses: 420000,
      netProfit: 430000,
      isPrimary: false
    }
  ];

  const activeEntity = entities.find(e => e.id === selectedEntityId) || entities[0];

  // Compute Consolidated Treasury Totals in USD
  const consolidatedUSD = useMemo(() => {
    let totalRevUSD = 0;
    let totalExpUSD = 0;

    entities.forEach(e => {
      totalRevUSD += e.revenue * e.rateToUSD;
      totalExpUSD += e.expenses * e.rateToUSD;
    });

    const netUSD = totalRevUSD - totalExpUSD;

    return {
      totalRevUSD,
      totalExpUSD,
      netUSD
    };
  }, [entities]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-blue-400" /> Multi-Entity Treasury Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Consolidated Treasury & Global FX Matrix</h1>
          <p className="text-xs text-blue-200/80 max-w-2xl">
            Seamlessly switch between legal entities, automate live FX currency conversions, and view consolidated multi-subsidiary profit heatmaps.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <div className="px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-right">
            <span className="block text-[10px] text-blue-300 font-bold uppercase">Consolidated Net Profit (USD)</span>
            <span className="text-2xl font-black text-emerald-400">
              ${consolidatedUSD.netUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* Entity Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {entities.map((ent) => {
          const isSelected = ent.id === selectedEntityId;
          return (
            <div
              key={ent.id}
              onClick={() => setSelectedEntityId(ent.id)}
              className={`saas-card p-5 cursor-pointer transition-all border-2 ${
                isSelected
                  ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 shadow-lg ring-1 ring-sky-500/30'
                  : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-500 uppercase">{ent.country}</span>
                {ent.isPrimary && (
                  <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-black">
                    Parent HQ
                  </span>
                )}
              </div>

              <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">{ent.name}</h3>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">Currency: {ent.currency}</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">
                  {ent.symbol}{ent.netProfit.toLocaleString()} Net
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Consolidated Matrix Heatmap */}
      <div className="saas-card p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Global Entity Matrix & FX Consolidation</h3>
            <p className="text-xs text-slate-500">Live inter-company transfers and real-time spot FX rates</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black">
            Automated Elimination
          </span>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Legal Entity</th>
                <th className="py-3 px-3">Local Revenue</th>
                <th className="py-3 px-3">Local Expenses</th>
                <th className="py-3 px-3">FX Rate vs USD</th>
                <th className="py-3 px-3 text-right">USD Consolidated Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {entities.map((e) => {
                const usdNet = e.netProfit * e.rateToUSD;
                return (
                  <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-3 font-sans font-black text-slate-900 dark:text-white">
                      {e.name}
                    </td>
                    <td className="py-3.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">
                      {e.symbol}{e.revenue.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-rose-500">
                      {e.symbol}{e.expenses.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">
                      1 {e.currency} = ${e.rateToUSD}
                    </td>
                    <td className="py-3.5 px-3 text-right font-black text-slate-900 dark:text-white">
                      ${usdNet.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300 dark:border-slate-700 font-black text-sm text-slate-900 dark:text-white">
                <td className="py-4 px-3 font-sans">Global Consolidated Total:</td>
                <td className="py-4 px-3 text-emerald-600 dark:text-emerald-400 font-mono">
                  ${consolidatedUSD.totalRevUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
                <td className="py-4 px-3 text-rose-500 font-mono">
                  ${consolidatedUSD.totalExpUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
                <td className="py-4 px-3 text-slate-400 font-sans text-xs">Eliminated Inter-Co</td>
                <td className="py-4 px-3 text-right font-mono text-emerald-500">
                  ${consolidatedUSD.netUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
