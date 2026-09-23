import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';

const CASH_FLOW_DATA = {
  Monthly: [
    { name: "Jan", flow: 135000 },
    { name: "Feb", flow: 150000 },
    { name: "Mar", flow: 120000 },
    { name: "Apr", flow: 150000 },
    { name: "May", flow: 155000 },
    { name: "Jun", flow: 155000 },
    { name: "Jul", flow: 185000 },
    { name: "Aug", flow: 195000 },
    { name: "Sep", flow: 72051 }
  ],
  Weekly: [
    { name: "Wk 1", flow: 45000 },
    { name: "Wk 2", flow: 38000 },
    { name: "Wk 3", flow: 62000 },
    { name: "Wk 4", flow: 50000 }
  ],
  Daily: [
    { name: "Mon", flow: 12000 },
    { name: "Tue", flow: 8500 },
    { name: "Wed", flow: 24000 },
    { name: "Thu", flow: -4500 },
    { name: "Fri", flow: 18000 },
    { name: "Sat", flow: 2000 },
    { name: "Sun", flow: 0 }
  ]
};

export default function CashFlowChart() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('Monthly');

  const data = CASH_FLOW_DATA[timeframe] || CASH_FLOW_DATA.Monthly;

  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Cash Flow Trajectory</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Net liquid capital movement over selected time horizons</p>
        </div>

        {/* Timeframe selector */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700">
          {['Daily', 'Weekly', 'Monthly'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                timeframe === tf ? 'bg-emerald-500 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${v/1000}k`} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass-card p-3 rounded-2xl border border-slate-700 shadow-2xl text-xs space-y-1">
                      <div className="font-bold text-slate-900 dark:text-white">{label} Cash Balance</div>
                      <div className="text-blue-500 font-bold">{formatCurrency(payload[0].value, user.currency)}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area type="monotone" dataKey="flow" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorFlow)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
