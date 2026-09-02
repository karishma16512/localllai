import React from 'react';
import {
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface SwotMatrixProps {
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  businessType: 'dairy' | 'grocery';
}

export default function SwotMatrix({ swot, businessType }: SwotMatrixProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Strategic Assessment
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            SWOT Analysis Matrix ({businessType === 'dairy' ? 'Dairy Enterprise' : 'Grocery Retail'})
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Local rural market context
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-emerald-900 font-bold text-sm">
            <div className="p-1 rounded bg-emerald-600 text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span>Strengths (Internal Advantages)</span>
          </div>
          <ul className="space-y-2 text-xs text-emerald-950">
            {swot.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-amber-900 font-bold text-sm">
            <div className="p-1 rounded bg-amber-600 text-white">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <span>Weaknesses (Internal Challenges)</span>
          </div>
          <ul className="space-y-2 text-xs text-amber-950">
            {swot.weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="bg-sky-50/70 border border-sky-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-sky-900 font-bold text-sm">
            <div className="p-1 rounded bg-sky-600 text-white">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span>Opportunities (External Growth)</span>
          </div>
          <ul className="space-y-2 text-xs text-sky-950">
            {swot.opportunities.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-sky-600 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Threats */}
        <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-rose-900 font-bold text-sm">
            <div className="p-1 rounded bg-rose-600 text-white">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <span>Threats (External Risks)</span>
          </div>
          <ul className="space-y-2 text-xs text-rose-950">
            {swot.threats.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-600 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
