import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Percent,
  IndianRupee,
  Sliders
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { FeasibilityReport, StressTestScenario } from '../types';
import { calculateStressTest } from '../utils/feasibilityEngine';
import { formatINR } from '../utils/calculator';

interface StressTestViewProps {
  report: FeasibilityReport;
}

export default function StressTestView({ report }: StressTestViewProps) {
  const [selectedDrop, setSelectedDrop] = useState<number>(20); // default 20% stress test

  const allScenarios: StressTestScenario[] = calculateStressTest(report, selectedDrop);

  // Active scenario corresponding to selectedDrop
  const activeScenario = allScenarios.find((s) => s.salesDropPct === selectedDrop) || allScenarios[2];

  // Prepare chart data for 0% to 50% drops
  const chartData = allScenarios.map((s) => ({
    drop: `-${s.salesDropPct}%`,
    dropPct: s.salesDropPct,
    Revenue: s.revenue,
    Opex: s.opex,
    NetCashflow: s.netCashflow,
    Surplus: s.monthlySurplus,
    EMI: s.emi,
  }));

  const getStatusBadge = (status: string, color: string) => {
    switch (color) {
      case 'green':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Robust & Safe (High Surplus)</span>
          </span>
        );
      case 'yellow':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Acceptable Margin (Adequate DSCR)</span>
          </span>
        );
      case 'amber':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-orange-100 text-orange-800 border border-orange-300">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>High Stress (Thin Safety Buffer)</span>
          </span>
        );
      case 'red':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5" />
            <span>Default Warning (Negative Cashflow)</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
              Downside Sensitivity Analysis
            </span>
            <span className="text-xs text-slate-500 font-semibold">Micro-Enterprise Stress Lab</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-600" />
            <span>Business Stress Test & Repayment Affordability</span>
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Simulate market downturns & dry seasons
        </span>
      </div>

      {/* Stress Controller (Quick buttons + Slider) */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-1">
              Select Sales Drop Scenario:
            </label>
            <p className="text-xs text-slate-600">
              Evaluate debt servicing capacity under reduced consumer demand or livestock yield drops.
            </p>
          </div>

          {/* Quick Preset Buttons (10%, 20%, 30% as specifically required) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedDrop(0)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                selectedDrop === 0
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              0% (Baseline)
            </button>
            <button
              type="button"
              onClick={() => setSelectedDrop(10)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                selectedDrop === 10
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              -10% Drop
            </button>
            <button
              type="button"
              onClick={() => setSelectedDrop(20)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                selectedDrop === 20
                  ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              -20% Drop
            </button>
            <button
              type="button"
              onClick={() => setSelectedDrop(30)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                selectedDrop === 30
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              -30% Drop
            </button>
          </div>
        </div>

        {/* Custom Slider */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Sales Reduction Level:</span>
            <span className="text-rose-700 font-extrabold text-sm bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              -{selectedDrop}% Expected Turnover Drop
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={5}
            value={selectedDrop}
            onChange={(e) => setSelectedDrop(Number(e.target.value))}
            className="w-full accent-rose-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>0% Normal Operations</span>
            <span>-25% Moderate Shocks</span>
            <span>-50% Severe Emergency Crisis</span>
          </div>
        </div>
      </div>

      {/* Dynamic Scenario Metrics under Active Stress */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Affordability Verdict Card */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 shadow-md flex flex-col justify-between h-full">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Affordability Assessment at -{selectedDrop}%
            </span>
            <div className="mb-4">
              {getStatusBadge(activeScenario.status, activeScenario.statusColor)}
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Monthly Surplus In-Hand:</span>
                <strong className={`text-base font-extrabold ${activeScenario.monthlySurplus >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatINR(activeScenario.monthlySurplus)}
                </strong>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Stress DSCR Coverage:</span>
                <strong className={`font-bold ${activeScenario.dscr >= 1.25 ? 'text-sky-400' : 'text-amber-400'}`}>
                  {activeScenario.dscr}x (Bank min 1.25x)
                </strong>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Fixed Monthly Loan EMI:</span>
                <strong className="text-white font-bold">{formatINR(activeScenario.emi)}</strong>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            {activeScenario.monthlySurplus >= 0 ? (
              <p>
                ✓ Even with a <strong>{selectedDrop}% decline in sales</strong>, the enterprise generates sufficient cashflow to service the monthly EMI of <strong>{formatINR(activeScenario.emi)}</strong> with a positive surplus buffer.
              </p>
            ) : (
              <p className="text-rose-300">
                ⚠️ At <strong>{selectedDrop}% drop</strong>, net operating cashflow falls below the EMI obligation. The entrepreneur will need working capital reserves or debt restructuring.
              </p>
            )}
          </div>
        </div>

        {/* Detailed Breakdown Cards */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Stressed Revenue */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Stressed Monthly Sales</span>
            <span className="text-base font-extrabold text-slate-900 block mt-1">
              {formatINR(activeScenario.revenue)}
            </span>
            <span className="text-[10px] text-rose-600 font-semibold">
              Down from {formatINR(report.monthlyRevenueEstimate)}
            </span>
          </div>

          {/* Stressed Opex */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Adjusted Operating Costs</span>
            <span className="text-base font-extrabold text-slate-900 block mt-1">
              {formatINR(activeScenario.opex)}
            </span>
            <span className="text-[10px] text-slate-500">Variable costs scaled down</span>
          </div>

          {/* Stressed Net Cashflow */}
          <div className="bg-sky-50/70 border border-sky-200 p-3.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-sky-800 block">Operating Cashflow</span>
            <span className="text-base font-extrabold text-sky-950 block mt-1">
              {formatINR(activeScenario.netCashflow)}
            </span>
            <span className="text-[10px] text-sky-700">Before loan servicing</span>
          </div>

          {/* Monthly Surplus Buffer */}
          <div className={`p-3.5 rounded-xl border ${
            activeScenario.monthlySurplus >= 0 ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50 border-rose-200'
          }`}>
            <span className={`text-[10px] uppercase font-bold block ${
              activeScenario.monthlySurplus >= 0 ? 'text-emerald-800' : 'text-rose-800'
            }`}>
              Net Surplus Buffer
            </span>
            <span className={`text-base font-extrabold block mt-1 ${
              activeScenario.monthlySurplus >= 0 ? 'text-emerald-950' : 'text-rose-950'
            }`}>
              {formatINR(activeScenario.monthlySurplus)}
            </span>
            <span className={`text-[10px] font-semibold ${
              activeScenario.monthlySurplus >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}>
              Cash left for family livelihood
            </span>
          </div>
        </div>
      </div>

      {/* Stress Curve Area Chart */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Stress Test Sensitivity Curve (0% to 50% Sales Reduction)
            </h4>
            <p className="text-[11px] text-slate-500">
              Visualizing how revenue drops compress operating surplus against the fixed loan EMI threshold
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-600 font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              Monthly Surplus
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Fixed Loan EMI
            </span>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSurplus" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="drop" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val: any) => [formatINR(Number(val)), '']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
              <Area type="monotone" dataKey="Revenue" stroke="#0284c7" strokeWidth={2} fill="url(#colorRevenue)" name="Gross Revenue" />
              <Area type="monotone" dataKey="Surplus" stroke="#059669" strokeWidth={2.5} fill="url(#colorSurplus)" name="Net Surplus (Post EMI)" />
              <ReferenceLine y={report.finance.monthlyEmi} stroke="#e11d48" strokeDasharray="3 3" label={{ value: `Fixed EMI (${formatINR(report.finance.monthlyEmi)})`, fill: '#e11d48', fontSize: 10, position: 'insideTopRight' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
