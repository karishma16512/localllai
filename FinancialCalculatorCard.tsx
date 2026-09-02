import { useState } from 'react';
import {
  Calculator,
  ShieldCheck,
  IndianRupee,
  Percent,
  Calendar,
  Clock,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  PieChart as PieIcon,
  TrendingDown,
  Layers,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { FinancialScheme } from '../types';
import { formatINR, formatLakh } from '../utils/calculator';

interface FinancialCalculatorCardProps {
  finance: FinancialScheme;
}

export default function FinancialCalculatorCard({ finance }: FinancialCalculatorCardProps) {
  const [scheduleView, setScheduleView] = useState<'quarterly' | 'monthly'>('quarterly');
  const [showFullSchedule, setShowFullSchedule] = useState(true);

  const isMicro = finance.schemeName === 'Micro Finance';

  // Chart data for Capital Structure
  const capitalStructureData = [
    { name: 'Agency Loan (90%)', value: finance.agencyFinancing, color: '#059669' },
    { name: 'Beneficiary Equity (10%)', value: finance.beneficiaryContribution, color: '#f59e0b' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6">
      {/* Header & Auto-Scheme Selector Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Concessional Lending Rule Engine
            </span>
            <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Indicative Calculation
            </span>
            <span className="text-xs text-slate-500 font-semibold">Priority Sector (PS) Norms</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <span>Smart Financial Calculator & Indicative Loan Structuring</span>
          </h3>
        </div>

        {/* Selected Scheme Badge */}
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 shadow-xs ${
          isMicro
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
            : 'bg-indigo-50 text-indigo-900 border-indigo-300'
        }`}>
          <ShieldCheck className={`w-5 h-5 ${isMicro ? 'text-emerald-600' : 'text-indigo-600'}`} />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Auto-Routed Scheme</span>
            <span className="text-sm font-extrabold">{finance.schemeName}</span>
          </div>
        </div>
      </div>

      {/* Scheme Rule Verification Summary & Moratorium Explanation */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-3">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Info className="w-4 h-4 text-emerald-600" />
          <span>PS Rules Applied Automatically for this Project Cost:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-slate-600">
          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Rule 1: Equity / Loan</span>
            <strong className="text-slate-900">10% Margin : 90% Agency</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Rule 2: Concessional Rate</span>
            <strong className="text-slate-900">{finance.interestRate}% p.a. Fixed</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Rule 3: Repayment Tenure</span>
            <strong className="text-slate-900">{finance.tenureYears} Years ({finance.tenureMonths} Months)</strong>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Rule 4: Moratorium Period</span>
            <strong className="text-emerald-700">{finance.moratoriumMonths} Months Grace Period</strong>
          </div>
        </div>

        {/* Moratorium Explanation Callout */}
        <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-start gap-2">
          <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">What is Moratorium?</strong> Moratorium is the initial period ({finance.moratoriumMonths} months) before regular principal repayment begins. During this grace period, only nominal simple interest is serviced, allowing the rural enterprise time to establish cashflow.
          </div>
        </div>
      </div>

      {/* Primary Financial Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Project Cost */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Project Cost</span>
          <span className="text-base sm:text-lg font-extrabold text-slate-900 block mt-1">
            {formatINR(finance.projectCost)}
          </span>
          <span className="text-[10px] text-slate-500">100% Outlay</span>
        </div>

        {/* Beneficiary Contribution */}
        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-amber-800 block">Beneficiary Margin (10%)</span>
          <span className="text-base sm:text-lg font-extrabold text-amber-950 block mt-1">
            {formatINR(finance.beneficiaryContribution)}
          </span>
          <span className="text-[10px] text-amber-700">Entrepreneur Equity</span>
        </div>

        {/* Agency Loan */}
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block">Agency Loan (90%)</span>
          <span className="text-base sm:text-lg font-extrabold text-emerald-950 block mt-1">
            {formatINR(finance.agencyFinancing)}
          </span>
          <span className="text-[10px] text-emerald-700">Indicative Financing</span>
        </div>

        {/* Repayment Amount */}
        <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-sky-800 block">Estimated Repayment</span>
          <span className="text-base sm:text-lg font-extrabold text-sky-950 block mt-1">
            {formatINR(finance.monthlyEmi)}<span className="text-xs font-normal">/mo</span>
          </span>
          <span className="text-[10px] text-sky-700 block">or {formatINR(finance.quarterlyEmi)}/quarter</span>
        </div>

        {/* Total Interest */}
        <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-rose-800 block">Total Interest</span>
          <span className="text-base sm:text-lg font-extrabold text-rose-950 block mt-1">
            {formatINR(finance.totalInterest)}
          </span>
          <span className="text-[10px] text-rose-700">Over {finance.tenureYears} yrs</span>
        </div>

        {/* Total Outflow */}
        <div className="p-3.5 bg-slate-900 text-slate-100 border border-slate-800 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Total Outflow</span>
          <span className="text-base sm:text-lg font-extrabold text-white block mt-1">
            {formatINR(finance.totalRepayment)}
          </span>
          <span className="text-[10px] text-slate-400">Principal + Interest</span>
        </div>
      </div>

      {/* Project Outlay, Operating Expenses & Working Capital Breakdown */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2">
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Project Outlay, Operating Expenses & Working Capital Breakdown</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              *Estimated demo values based on standard rural micro-enterprise economic benchmarks.
            </p>
          </div>
          <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            Total Project Outlay: {formatINR(finance.projectCost)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {/* Fixed Assets / Capex */}
          <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 block mb-1">
              Fixed Capex (75%)
            </span>
            <span className="text-base font-extrabold text-indigo-950 block">
              {formatINR(finance.fixedCapexRequirement)}
            </span>
            <p className="text-[11px] text-slate-600 mt-1">
              Livestock, machinery, shed construction / store shelving & POS.
            </p>
          </div>

          {/* Working Capital Margin */}
          <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 block mb-1">
              Working Capital (25%)
            </span>
            <span className="text-base font-extrabold text-amber-950 block">
              {formatINR(finance.workingCapitalRequirement)}
            </span>
            <p className="text-[11px] text-slate-600 mt-1">
              Initial 2-3 months feed/inventory stock and liquidity buffer.
            </p>
          </div>

          {/* Est Monthly Opex */}
          <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 block mb-1">
              Est. Monthly Opex
            </span>
            <span className="text-base font-extrabold text-sky-950 block">
              {formatINR(finance.monthlyOpexEstimate)}<span className="text-xs font-normal">/mo</span>
            </span>
            <p className="text-[11px] text-slate-600 mt-1">
              Raw materials, feed/inventory refill, electricity & transport.
            </p>
          </div>

          {/* Est Quarterly Opex */}
          <div className="bg-white border border-slate-200 p-3.5 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 block mb-1">
              Est. Quarterly Opex
            </span>
            <span className="text-base font-extrabold text-purple-950 block">
              {formatINR(finance.quarterlyOpexEstimate)}<span className="text-xs font-normal">/qtr</span>
            </span>
            <p className="text-[11px] text-slate-600 mt-1">
              3-month rolling operating expenditure cycle.
            </p>
          </div>
        </div>
      </div>

      {/* Capital Financing Ratio Donut Breakdown */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Project Financing Ratio
            </h4>
            <p className="text-[11px] text-slate-500">
              Concessional 10% Beneficiary Margin Equity to 90% Agency Loan
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <span className="text-slate-600">Agency Loan (90%):</span>
              <strong className="text-slate-900 font-extrabold">{formatINR(finance.agencyFinancing)}</strong>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-600">Beneficiary Margin (10%):</span>
              <strong className="text-slate-900 font-extrabold">{formatINR(finance.beneficiaryContribution)}</strong>
            </div>
          </div>
        </div>

        <div className="h-36 w-full flex items-center justify-center mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={capitalStructureData}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={58}
                paddingAngle={4}
                dataKey="value"
              >
                {capitalStructureData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: any) => [formatINR(Number(val)), '']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Repayment Schedule Section with Quarterly vs Monthly View Switch */}
      <div className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Repayment Amortization Schedule
            </h4>
          </div>

          {/* Toggle between Quarterly and Monthly */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setScheduleView('quarterly')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                scheduleView === 'quarterly'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Quarterly Schedule ({finance.quarterlySchedule.length} Qtrs)
            </button>
            <button
              type="button"
              onClick={() => setScheduleView('monthly')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                scheduleView === 'monthly'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month-by-Month ({finance.tenureMonths} Mos)
            </button>
          </div>
        </div>

        {scheduleView === 'quarterly' ? (
          <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto max-h-80">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Quarter</th>
                  <th className="p-2.5">Tenure Coverage</th>
                  <th className="p-2.5 text-right">Opening Principal</th>
                  <th className="p-2.5 text-right">Interest To Be Paid</th>
                  <th className="p-2.5 text-right">Principal To Be Paid</th>
                  <th className="p-2.5 text-right">Quarterly Installment</th>
                  <th className="p-2.5 text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {finance.quarterlySchedule.map((q) => (
                  <tr key={q.quarter} className={q.isMoratoriumQuarter ? 'bg-amber-50/40' : 'hover:bg-slate-50'}>
                    <td className="p-2.5 font-bold text-slate-900">Quarter {q.quarter}</td>
                    <td className="p-2.5 text-slate-500 font-semibold">{q.monthsRange}</td>
                    <td className="p-2.5 text-right text-slate-600">{formatINR(q.openingPrincipal)}</td>
                    <td className="p-2.5 text-right text-rose-600 font-semibold">{formatINR(q.interestPaid)}</td>
                    <td className="p-2.5 text-right text-emerald-700 font-semibold">{formatINR(q.principalPaid)}</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">{formatINR(q.totalInstallment)}</td>
                    <td className="p-2.5 text-right text-slate-600 font-semibold">{formatINR(q.closingPrincipal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto max-h-80">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-2">Month</th>
                  <th className="p-2 text-right">Opening Principal</th>
                  <th className="p-2 text-right">Interest To Be Paid</th>
                  <th className="p-2 text-right">Principal To Be Paid</th>
                  <th className="p-2 text-right">Monthly Installment</th>
                  <th className="p-2 text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {finance.amortizationSchedule.map((row) => (
                  <tr key={row.month} className={row.isMoratorium ? 'bg-amber-50/40' : 'hover:bg-slate-50'}>
                    <td className="p-2 font-bold text-slate-900">Month {row.month}</td>
                    <td className="p-2 text-right text-slate-600">{formatINR(row.openingPrincipal)}</td>
                    <td className="p-2 text-right text-rose-600 font-semibold">{formatINR(row.interestPayment)}</td>
                    <td className="p-2 text-right text-emerald-700 font-semibold">{formatINR(row.principalPayment)}</td>
                    <td className="p-2 text-right font-bold text-slate-900">{formatINR(row.totalEmi)}</td>
                    <td className="p-2 text-right text-slate-600 font-semibold">{formatINR(row.closingPrincipal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Indicative Disclaimer Notice */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-700">Indicative Prototype Notice:</strong> All loan eligibility, interest rates, and repayment figures presented are purely indicative based on prototype guidelines and standard Priority Sector norms. Final loan sanction is subject to formal credit appraisal and verification by the lending institution.
        </div>
      </div>
    </div>
  );
}
