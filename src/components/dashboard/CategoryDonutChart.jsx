import React, { useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useFinancialData } from '../../context/FinancialDataContext';
import { formatCurrency } from '../../utils/formatters';
import { PieChart as PieIcon } from 'lucide-react';

export default function CategoryDonutChart() {
  const { categorySpending } = useFinancialData();
  const [activeIndex, setActiveIndex] = useState(null);

  const totalSpent = categorySpending.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="saas-card p-5 flex flex-col h-full justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-sky-500" />
            <span>Expense Breakdown</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Distribution of company spending by expense category
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Donut graphic */}
        <div className="h-52 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categorySpending}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={84}
                paddingAngle={4}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {categorySpending.map((entry, index) => {
                  const isHighlighted = activeIndex === null || activeIndex === index;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="transparent"
                      opacity={isHighlighted ? 1 : 0.4}
                      className="transition-opacity duration-200 cursor-pointer"
                    />
                  );
                })}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const percent = totalSpent ? ((data.value / totalSpent) * 100).toFixed(1) : 0;
                    return (
                      <div className="saas-card p-3 shadow-xl text-xs space-y-1 border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                          {data.name}
                        </div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between gap-4 pt-1">
                          <span>{formatCurrency(data.value, 'USD')}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold" style={{ backgroundColor: `${data.color}20`, color: data.color }}>
                            {percent}%
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Donut Center Display */}
          <div className="absolute text-center pointer-events-none">
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
              {activeIndex !== null && categorySpending[activeIndex]
                ? categorySpending[activeIndex].name
                : 'Total Spent'}
            </div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(
                activeIndex !== null && categorySpending[activeIndex]
                  ? categorySpending[activeIndex].value
                  : totalSpent,
                'USD'
              )}
            </div>
            {activeIndex !== null && categorySpending[activeIndex] && (
              <div className="text-[10px] font-bold text-sky-500 mt-0.5">
                {((categorySpending[activeIndex].value / (totalSpent || 1)) * 100).toFixed(1)}% of total
              </div>
            )}
          </div>
        </div>

        {/* Legend List with Badges & Mini Progress Fill */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {categorySpending.map((cat, idx) => {
            const percent = totalSpent ? ((cat.value / totalSpent) * 100).toFixed(1) : 0;
            const isHovered = activeIndex === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`p-2 rounded-xl transition-all duration-200 cursor-pointer border ${
                  isHovered
                    ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 shadow-sm scale-[1.01]'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                }`}
              >
                {/* Top line: dot + category name + percentage badge + total amount */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {cat.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-extrabold"
                      style={{
                        backgroundColor: `${cat.color}20`,
                        color: cat.color,
                      }}
                    >
                      {percent}%
                    </span>
                    <span className="font-bold tabular-nums text-slate-900 dark:text-white">
                      {formatCurrency(cat.value, 'USD')}
                    </span>
                  </div>
                </div>

                {/* Relative progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700/60 rounded-full h-1 mt-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
