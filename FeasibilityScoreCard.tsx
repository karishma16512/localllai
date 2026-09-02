import React from 'react';
import {
  Award,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileCheck2,
  IndianRupee,
  Activity
} from 'lucide-react';
import { FeasibilityReport } from '../types';
import { formatINR, formatLakh } from '../utils/calculator';

interface FeasibilityScoreCardProps {
  report: FeasibilityReport;
}

export default function FeasibilityScoreCard({ report }: FeasibilityScoreCardProps) {
  const { feasibilityScore, feasibilityGrade, dscr, monthlySurplusAfterEmi, aiRecommendation, unmetDemandGap, businessType, location } = report;

  // Grade styling
  const isHigh = feasibilityGrade === 'HIGH_FEASIBILITY';
  const isModerate = feasibilityGrade === 'MODERATE_FEASIBILITY';

  const scoreBadgeColor = isHigh
    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
    : isModerate
    ? 'bg-amber-100 text-amber-800 border-amber-300'
    : 'bg-rose-100 text-rose-800 border-rose-300';

  const gaugeStrokeColor = isHigh ? '#059669' : isModerate ? '#d97706' : '#e11d48';

  // SVG Gauge calculations
  // Angle from -180 to 0 (half circle)
  const scorePercent = Math.min(100, Math.max(0, feasibilityScore));
  const radius = 64;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (scorePercent / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
      {/* Top Banner: Score & Feasibility Status */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Semi-Circle Feasibility Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Overall Feasibility Score
          </span>

          <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
            <svg viewBox="0 0 160 90" className="w-40 h-22">
              {/* Background Arc */}
              <path
                d="M 16 80 A 64 64 0 0 1 144 80"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Progress Arc */}
              <path
                d="M 16 80 A 64 64 0 0 1 144 80"
                fill="none"
                stroke={gaugeStrokeColor}
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Score Text in Center */}
            <div className="absolute bottom-0 text-center">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                {feasibilityScore}
              </span>
              <span className="text-slate-400 font-bold text-xs">/100</span>
            </div>
          </div>

          <div className="mt-2 text-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${scoreBadgeColor}`}>
              {isHigh && <CheckCircle2 className="w-3.5 h-3.5" />}
              {isModerate && <AlertTriangle className="w-3.5 h-3.5" />}
              {!isHigh && !isModerate && <AlertTriangle className="w-3.5 h-3.5" />}
              <span>{feasibilityGrade.replace('_', ' ')}</span>
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Based on spatial demand, competitor density & DSCR
            </p>
          </div>
        </div>

        {/* Core Financial & Feasibility Highlights */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Monthly Net Surplus */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-800 text-xs font-bold uppercase">
              <span>Monthly Surplus</span>
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-emerald-950 block">
                {formatINR(monthlySurplusAfterEmi)}
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">
                Net in-hand profit after loan EMI
              </span>
            </div>
            <div className="text-[10px] text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded font-semibold self-start">
              Revenue: {formatINR(report.monthlyRevenueEstimate)}/mo
            </div>
          </div>

          {/* Debt Service Coverage Ratio (DSCR) */}
          <div className="bg-sky-50/70 border border-sky-200 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-sky-800 text-xs font-bold uppercase">
              <span>DSCR Safety</span>
              <ShieldCheck className="w-4 h-4 text-sky-600" />
            </div>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-sky-950 block">
                {dscr}x
              </span>
              <span className="text-[11px] text-sky-700 font-medium">
                Bank benchmark: &ge; 1.25x
              </span>
            </div>
            <div className={`text-[10px] px-2 py-0.5 rounded font-semibold self-start ${
              dscr >= 1.5 ? 'bg-sky-200 text-sky-900' : 'bg-amber-200 text-amber-900'
            }`}>
              {dscr >= 1.5 ? 'Excellent Buffer' : 'Adequate Coverage'}
            </div>
          </div>

          {/* Market Opportunity */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-700 text-xs font-bold uppercase">
              <span>Market Opportunity</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="my-2">
              <span className="text-xs font-bold text-slate-900 block leading-snug">
                {unmetDemandGap}
              </span>
            </div>
            <div className="text-[10px] text-slate-600 bg-slate-200 px-2 py-0.5 rounded font-medium self-start">
              {location.nearbyPopulation.toLocaleString('en-IN')} catchment population
            </div>
          </div>
        </div>
      </div>

      {/* Explicit Feasibility Score Calculation Explanation (Requirement 11) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Feasibility Score Calculation Formula & Weightage Breakdown
            </h4>
          </div>
          <span className="text-xs font-extrabold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">
            Total Score: {report.scoreBreakdown?.totalScore || report.feasibilityScore}/100
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {/* Component 1: DSCR Safety */}
          <div className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 text-[11px]">1. Debt Coverage (DSCR)</span>
                <span className="font-extrabold text-sky-700 text-xs bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                  {report.scoreBreakdown?.dscrScore ?? 32}/35 pts
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Evaluates operating surplus cushion against monthly loan EMI (DSCR = {dscr}x).
              </p>
            </div>
          </div>

          {/* Component 2: Catchment Demand */}
          <div className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 text-[11px]">2. Spatial Catchment</span>
                <span className="font-extrabold text-emerald-700 text-xs bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {report.scoreBreakdown?.marketScore ?? 24}/30 pts
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Ratio of {location.nearbyPopulation.toLocaleString('en-IN')} catchment population vs {report.competitorCount} existing local competitors.
              </p>
            </div>
          </div>

          {/* Component 3: Margin Capital */}
          <div className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 text-[11px]">3. Margin Adequacy</span>
                <span className="font-extrabold text-amber-700 text-xs bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  {report.scoreBreakdown?.capitalScore ?? 16}/20 pts
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Sufficiency of available equity capital ({formatINR(report.finance.beneficiaryContribution)}) to sustain project capex.
              </p>
            </div>
          </div>

          {/* Component 4: Sector Cash Velocity */}
          <div className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 text-[11px]">4. Sector Resilience</span>
                <span className="font-extrabold text-purple-700 text-xs bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                  {report.scoreBreakdown?.sectorScore ?? 14}/15 pts
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Daily cash inflow velocity and resilience against rural liquidity shocks.
              </p>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 italic bg-white p-2 rounded border border-slate-200">
          * Score formula: <code className="text-slate-800 font-semibold">Total = DSCR (max 35) + Market Catchment (max 30) + Margin Adequacy (max 20) + Sector Resilience (max 15)</code>. Minimum bank sanction recommendation threshold is 65/100.
        </p>
      </div>

      {/* AI Recommendation & Action Advisory */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                AI Advisory Engine
              </span>
              <h4 className="text-base font-bold text-white">
                {aiRecommendation.verdict}
              </h4>
            </div>
          </div>

          <span className="bg-slate-800 text-slate-300 text-[11px] font-medium px-2.5 py-1 rounded-full border border-slate-700 hidden sm:inline-block">
            SIH Sanction Advisory
          </span>
        </div>

        {/* Executive Summary */}
        <p className="text-sm text-slate-200 leading-relaxed mb-4 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
          {aiRecommendation.executiveSummary}
        </p>

        {/* Key Action Points & Risk Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Key Action Steps */}
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Recommended Launch Action Steps:</span>
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              {aiRecommendation.keyActionPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-emerald-800">
                    {i + 1}
                  </span>
                  <span className="leading-normal">{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risk Alerts */}
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Operational Risk Watchlist:</span>
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              {aiRecommendation.riskAlerts.map((risk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-950 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-amber-800">
                    !
                  </span>
                  <span className="leading-normal">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
