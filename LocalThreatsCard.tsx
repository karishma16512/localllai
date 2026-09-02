import React from 'react';
import {
  AlertTriangle,
  Shield,
  CheckCircle2,
  Wrench
} from 'lucide-react';

interface LocalThreatsCardProps {
  threats: Array<{
    title: string;
    severity: 'High' | 'Medium' | 'Low';
    mitigation: string;
  }>;
  businessType: 'dairy' | 'grocery';
}

export default function LocalThreatsCard({ threats, businessType }: LocalThreatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            Risk Management
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Local Threats & Practical Mitigations</span>
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Actionable field safeguard measures
        </span>
      </div>

      <div className="space-y-3">
        {threats.map((item, idx) => {
          const isHigh = item.severity === 'High';
          const isMedium = item.severity === 'Medium';

          const badgeColor = isHigh
            ? 'bg-rose-100 text-rose-800 border-rose-300'
            : isMedium
            ? 'bg-amber-100 text-amber-800 border-amber-300'
            : 'bg-emerald-100 text-emerald-800 border-emerald-300';

          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span>{item.title}</span>
                </h4>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${badgeColor}`}>
                  Severity: {item.severity}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-start gap-2.5 mt-2">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-0.5">
                    Recommended Field Mitigation:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {item.mitigation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
