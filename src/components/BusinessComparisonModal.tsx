import React, { useState } from 'react';
import {
  X,
  Scale,
  Milk,
  Store,
  Scissors,
  Egg,
  UtensilsCrossed,
  Layers,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  IndianRupee,
  Clock
} from 'lucide-react';
import { LocationData, FeasibilityReport, BusinessType, FinancialInputMode } from '../types';
import { DEMO_LOCATIONS } from '../data/demoLocations';
import { generateFeasibilityReport } from '../utils/feasibilityEngine';
import { formatINR, formatLakh } from '../utils/calculator';

interface BusinessComparisonModalProps {
  location: LocationData | null;
  financialAmount: number;
  financialMode: FinancialInputMode | null;
  onClose: () => void;
  onSelectBusiness: (type: BusinessType) => void;
}

const BUSINESS_OPTIONS: { type: BusinessType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { type: 'dairy', label: 'Dairy Farming & Value-Add', icon: Milk },
  { type: 'grocery', label: 'Grocery / Rural Retail', icon: Store },
  { type: 'tailoring', label: 'Tailoring & Textiles', icon: Scissors },
  { type: 'poultry', label: 'Poultry & Country Birds', icon: Egg },
  { type: 'food_processing', label: 'Agri Food Processing', icon: UtensilsCrossed },
  { type: 'other', label: 'Rural Micro Enterprise', icon: Layers },
];

export default function BusinessComparisonModal({
  location,
  financialAmount,
  financialMode,
  onClose,
  onSelectBusiness,
}: BusinessComparisonModalProps) {
  const activeLocation = location || DEMO_LOCATIONS[0];
  const activeAmount = financialAmount > 0 ? financialAmount : 250000;
  const activeMode: FinancialInputMode = financialMode || 'project_cost';

  const [businessA, setBusinessA] = useState<BusinessType>('dairy');
  const [businessB, setBusinessB] = useState<BusinessType>('grocery');

  const reportA: FeasibilityReport = generateFeasibilityReport(activeLocation, businessA, activeAmount, activeMode);
  const reportB: FeasibilityReport = generateFeasibilityReport(activeLocation, businessB, activeAmount, activeMode);

  const getIcon = (type: BusinessType) => {
    switch (type) {
      case 'dairy': return Milk;
      case 'grocery': return Store;
      case 'tailoring': return Scissors;
      case 'poultry': return Egg;
      case 'food_processing': return UtensilsCrossed;
      default: return Layers;
    }
  };

  const IconA = getIcon(businessA);
  const IconB = getIcon(businessB);

  const comparisonMetrics = [
    {
      metric: 'Indicative Project Cost',
      valA: formatINR(reportA.finance.projectCost),
      valB: formatINR(reportB.finance.projectCost),
      highlight: 'Standard 10% Margin : 90% Loan basis',
    },
    {
      metric: 'Auto Concessional Scheme',
      valA: `${reportA.finance.schemeName} (${reportA.finance.interestRate}%)`,
      valB: `${reportB.finance.schemeName} (${reportB.finance.interestRate}%)`,
      highlight: 'Priority Sector Lending Norms',
    },
    {
      metric: 'Monthly Fixed Loan EMI',
      valA: formatINR(reportA.finance.monthlyEmi),
      valB: formatINR(reportB.finance.monthlyEmi),
      highlight: 'Fixed debt amortization',
    },
    {
      metric: 'Estimated Monthly Revenue (Base)',
      valA: formatINR(reportA.monthlyRevenueEstimate),
      valB: formatINR(reportB.monthlyRevenueEstimate),
      winner: reportA.monthlyRevenueEstimate >= reportB.monthlyRevenueEstimate ? 'A' : 'B',
      highlight: 'Estimated monthly turnover',
    },
    {
      metric: 'Monthly Net Surplus (In-Hand)',
      valA: formatINR(reportA.monthlySurplusAfterEmi),
      valB: formatINR(reportB.monthlySurplusAfterEmi),
      winner: reportA.monthlySurplusAfterEmi >= reportB.monthlySurplusAfterEmi ? 'A' : 'B',
      highlight: 'Net cash after paying loan EMI & all opex',
    },
    {
      metric: 'Debt Service Coverage (DSCR)',
      valA: `${reportA.dscr}x`,
      valB: `${reportB.dscr}x`,
      winner: reportA.dscr >= reportB.dscr ? 'A' : 'B',
      highlight: 'Banking safety benchmark: ≥ 1.25x',
    },
    {
      metric: 'Feasibility Score',
      valA: `${reportA.feasibilityScore}/100`,
      valB: `${reportB.feasibilityScore}/100`,
      winner: reportA.feasibilityScore >= reportB.feasibilityScore ? 'A' : 'B',
      highlight: 'Catchment demand vs existing competitor density',
    },
    {
      metric: 'Market Reach & Customer Base',
      valA: `${location.marketReachKm} km (~${location.nearbyPopulation.toLocaleString('en-IN')} pop)`,
      valB: `${location.marketReachKm} km (~${location.nearbyPopulation.toLocaleString('en-IN')} pop)`,
      highlight: 'Hyper-local village catchment area',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-slate-100 p-5 sm:p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  Decision Matrix
                </span>
                <span className="text-xs text-slate-400 font-medium">Location: {location.name}, {location.district}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                Head-to-Head Feasibility & Financial Comparison
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Top Selectors for Enterprise A and Enterprise B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Enterprise A Selector Card */}
            <div className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 flex flex-col justify-between space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">Option A Enterprise</label>
                <select
                  value={businessA}
                  onChange={(e) => setBusinessA(e.target.value as BusinessType)}
                  className="w-full text-xs font-bold p-2 bg-white border border-emerald-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500"
                >
                  {BUSINESS_OPTIONS.map((opt) => (
                    <option key={opt.type} value={opt.type}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between gap-2 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                      <IconA className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{reportA.businessTitle}</h3>
                      <span className="text-[11px] text-emerald-800 font-semibold">
                        Score: {reportA.feasibilityScore}/100 ({reportA.feasibilityGrade.replace('_', ' ')})
                      </span>
                    </div>
                  </div>
                  <span className="text-base font-black text-emerald-950">
                    {formatINR(reportA.monthlySurplusAfterEmi)}<span className="text-[10px] text-emerald-700 font-normal">/mo</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectBusiness(businessA);
                  onClose();
                }}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Select & Load {reportA.businessTitle}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Enterprise B Selector Card */}
            <div className="p-4 rounded-2xl border-2 border-amber-300 bg-amber-50/50 flex flex-col justify-between space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-amber-800 block mb-1">Option B Enterprise</label>
                <select
                  value={businessB}
                  onChange={(e) => setBusinessB(e.target.value as BusinessType)}
                  className="w-full text-xs font-bold p-2 bg-white border border-amber-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500"
                >
                  {BUSINESS_OPTIONS.map((opt) => (
                    <option key={opt.type} value={opt.type}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between gap-2 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-600 text-white shadow-xs">
                      <IconB className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{reportB.businessTitle}</h3>
                      <span className="text-[11px] text-amber-800 font-semibold">
                        Score: {reportB.feasibilityScore}/100 ({reportB.feasibilityGrade.replace('_', ' ')})
                      </span>
                    </div>
                  </div>
                  <span className="text-base font-black text-amber-950">
                    {formatINR(reportB.monthlySurplusAfterEmi)}<span className="text-[10px] text-amber-700 font-normal">/mo</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectBusiness(businessB);
                  onClose();
                }}
                className="w-full py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Select & Load {reportB.businessTitle}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Detailed Side-by-Side Comparison Table */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-3 bg-slate-100 border-b border-slate-200 font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Comparative Performance Table</span>
              <span className="text-[10px] text-slate-500 lowercase font-medium">
                {financialMode === 'project_cost' ? `Project Cost: ${formatINR(financialAmount)}` : `Beneficiary Margin: ${formatINR(financialAmount)}`}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-white font-bold text-slate-900">
                    <th className="py-2.5 px-3 w-1/3">Evaluation Dimension</th>
                    <th className="py-2.5 px-3 w-1/3 bg-emerald-50/50 text-emerald-950">
                      <div className="flex items-center gap-1.5 truncate">
                        <IconA className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">{reportA.businessTitle}</span>
                      </div>
                    </th>
                    <th className="py-2.5 px-3 w-1/3 bg-amber-50/50 text-amber-950">
                      <div className="flex items-center gap-1.5 truncate">
                        <IconB className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span className="truncate">{reportB.businessTitle}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {comparisonMetrics.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-100/60 transition">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        <span>{row.metric}</span>
                        {row.highlight && (
                          <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                            {row.highlight}
                          </span>
                        )}
                      </td>
                      <td className={`py-2.5 px-3 ${row.winner === 'A' ? 'bg-emerald-100/50 font-bold text-emerald-950' : 'bg-emerald-50/20'}`}>
                        {row.valA}
                      </td>
                      <td className={`py-2.5 px-3 ${row.winner === 'B' ? 'bg-amber-100/50 font-bold text-amber-950' : 'bg-amber-50/20'}`}>
                        {row.valB}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <span>Both models comply strictly with Priority Sector Lending limits and margin requirements.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
