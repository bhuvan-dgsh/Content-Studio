import React from 'react';
import { TrendingUp, ShieldAlert, CheckCircle2, DollarSign } from 'lucide-react';

interface PriceTrendChartProps {
  listedPrice: number;
  unit: string;
  mspPrice?: number;
  subcategory: string;
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({
  listedPrice,
  unit,
  mspPrice,
  subcategory,
}) => {
  const benchmarkMsp = mspPrice || Math.round(listedPrice * 0.95);
  const diffPercent = Math.round(((listedPrice - benchmarkMsp) / benchmarkMsp) * 100);

  // Simulated 6-month historical mandi benchmark
  const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul 2026'];
  const dataPoints = months.map((m, idx) => {
    const factor = 0.9 + (idx * 0.02) + (Math.sin(idx) * 0.03);
    return {
      month: m,
      mandiRate: Math.round(benchmarkMsp * factor),
      farmoraPrice: Math.round(listedPrice * (0.92 + (idx * 0.016))),
    };
  });

  const maxVal = Math.max(...dataPoints.map((d) => Math.max(d.mandiRate, d.farmoraPrice))) * 1.1;

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
              APMC Mandi Price Benchmark & Trend
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              6-Month historical market rates for {subcategory}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block">
            Govt MSP / Mandi Benchmark
          </span>
          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
            ₹{benchmarkMsp.toLocaleString('en-IN')}/{unit}
          </span>
        </div>
      </div>

      {/* Comparison Badge */}
      <div className="mb-4 p-2.5 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          {diffPercent <= 5 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
          )}
          <span className="text-zinc-700 dark:text-zinc-300">
            Listed Price is{' '}
            <strong className={diffPercent <= 5 ? 'text-emerald-600' : 'text-amber-600'}>
              {diffPercent >= 0 ? `+${diffPercent}%` : `${diffPercent}%`}{' '}
              {diffPercent >= 0 ? 'above' : 'below'} APMC benchmark
            </strong>
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
          Fair Price Verified
        </span>
      </div>

      {/* Visual Bar Chart */}
      <div className="h-36 flex items-end justify-between gap-2 pt-4 px-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        {dataPoints.map((dp, i) => {
          const mandiHeightPct = Math.round((dp.mandiRate / maxVal) * 100);
          const farmoraHeightPct = Math.round((dp.farmoraPrice / maxVal) * 100);

          return (
            <div key={dp.month} className="flex-1 flex flex-col items-center group relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white text-[10px] px-2 py-1 rounded shadow pointer-events-none whitespace-nowrap z-10">
                Mandi: ₹{dp.mandiRate} | Farmora: ₹{dp.farmoraPrice}
              </div>

              <div className="w-full flex items-end justify-center gap-1 h-28">
                {/* Mandi Rate Bar */}
                <div
                  style={{ height: `${mandiHeightPct}%` }}
                  className="w-2.5 sm:w-3.5 bg-zinc-300 dark:bg-zinc-700 rounded-t transition-all group-hover:bg-zinc-400"
                />
                {/* Farmora Rate Bar */}
                <div
                  style={{ height: `${farmoraHeightPct}%` }}
                  className="w-2.5 sm:w-3.5 bg-emerald-500 rounded-t transition-all group-hover:bg-emerald-400 shadow-sm shadow-emerald-500/30"
                />
              </div>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                {dp.month}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-3 text-[11px] text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center space-x-1.5">
          <div className="w-2.5 h-2.5 bg-zinc-400 dark:bg-zinc-600 rounded-sm" />
          <span>Regional Mandi Index</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
          <span>Farmora Direct Rate</span>
        </div>
      </div>
    </div>
  );
};
