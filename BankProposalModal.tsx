import React from 'react';
import {
  X,
  Printer,
  FileCheck,
  Building,
  ShieldCheck,
  IndianRupee,
  CheckCircle2,
  Calendar,
  MapPin,
  Award
} from 'lucide-react';
import { FeasibilityReport } from '../types';
import { DEMO_LOCATIONS } from '../data/demoLocations';
import { generateFeasibilityReport } from '../utils/feasibilityEngine';
import { formatINR, formatLakh } from '../utils/calculator';

interface BankProposalModalProps {
  report: FeasibilityReport | null;
  onClose: () => void;
}

export default function BankProposalModal({ report, onClose }: BankProposalModalProps) {
  const activeReport = report || generateFeasibilityReport(DEMO_LOCATIONS[0], 'dairy', 250000, 'project_cost');
  const { finance, location, businessType, aiRecommendation, dscr, monthlySurplusAfterEmi, feasibilityScore, feasibilityGrade } = activeReport;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[94vh] flex flex-col overflow-hidden my-auto print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Top Controls (Hidden during print) */}
        <div className="bg-slate-900 text-slate-100 p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Credit Appraisal Memo Preview (Bank Loan Officer Memo)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formal Printable Document Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-900 font-sans print:p-0 print:overflow-visible">
          {/* Bank Header Memo Title */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-white text-[10px] font-black tracking-widest px-2 py-0.5 uppercase">
                  CONFIDENTIAL
                </span>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Micro-Enterprise Credit Appraisal
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                PRIORITY SECTOR CONCESSIONAL LOAN APPRAISAL MEMO
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Hyper-Local Feasibility Evaluation & Project Sizing Report
              </p>
            </div>

            <div className="text-right text-xs text-slate-600 shrink-0">
              <p><strong>Appraisal Ref:</strong> GB-{location.district.toUpperCase()}-{Date.now().toString().slice(-6)}</p>
              <p><strong>Appraisal Date:</strong> {currentDate}</p>
            </div>
          </div>

          {/* 1. Borrower & Location Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Proposed Unit Location</span>
              <strong className="text-slate-900">{location.name}, {location.state}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Enterprise Category</span>
              <strong className="text-emerald-800">{businessType === 'dairy' ? 'Dairy Enterprise' : 'Grocery Retail Store'}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Catchment Radius</span>
              <strong className="text-slate-900">{location.marketReachKm} km ({location.nearbyPopulation.toLocaleString('en-IN')} Pop)</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Feasibility Score</span>
              <strong className="text-emerald-700">{feasibilityScore}/100 ({feasibilityGrade.replace('_', ' ')})</strong>
            </div>
          </div>

          {/* 2. Project Cost & Financing Pattern */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              1. Project Outlay & Concessional Lending Structure (PS Norms)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="border border-slate-200 p-2.5 rounded-lg">
                <span className="text-slate-500 block text-[10px]">Total Project Cost (100%)</span>
                <span className="text-base font-extrabold text-slate-900">{formatINR(finance.projectCost)}</span>
              </div>
              <div className="border border-slate-200 p-2.5 rounded-lg bg-amber-50/50">
                <span className="text-amber-800 block text-[10px]">Beneficiary Margin Equity (10%)</span>
                <span className="text-base font-extrabold text-amber-950">{formatINR(finance.beneficiaryContribution)}</span>
              </div>
              <div className="border border-slate-200 p-2.5 rounded-lg bg-emerald-50/50">
                <span className="text-emerald-800 block text-[10px]">Agency Concessional Loan (90%)</span>
                <span className="text-base font-extrabold text-emerald-950">{formatINR(finance.agencyFinancing)}</span>
              </div>
              <div className="border border-slate-200 p-2.5 rounded-lg">
                <span className="text-slate-500 block text-[10px]">Applicable Scheme</span>
                <span className="text-sm font-extrabold text-slate-900">{finance.schemeName}</span>
              </div>
            </div>
          </div>

          {/* 3. Concessional Terms & Repayment Schedule */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              2. Loan Terms, Interest & Amortization
            </h3>
            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-slate-50 font-medium">
                  <td className="p-2 w-1/4 font-bold text-slate-700">Concessional Interest Rate</td>
                  <td className="p-2 w-1/4 font-extrabold text-slate-900">{finance.interestRate}% p.a.</td>
                  <td className="p-2 w-1/4 font-bold text-slate-700">Tenure & Moratorium</td>
                  <td className="p-2 w-1/4 font-extrabold text-slate-900">{finance.tenureYears} Years ({finance.moratoriumMonths} Mo Grace)</td>
                </tr>
                <tr className="font-medium">
                  <td className="p-2 font-bold text-slate-700">Monthly EMI (Post-Grace)</td>
                  <td className="p-2 font-extrabold text-emerald-800">{formatINR(finance.monthlyEmi)}/mo</td>
                  <td className="p-2 font-bold text-slate-700">Total Interest Payable</td>
                  <td className="p-2 font-extrabold text-slate-900">{formatINR(finance.totalInterest)}</td>
                </tr>
                <tr className="bg-slate-50 font-medium">
                  <td className="p-2 font-bold text-slate-700">Debt Service Ratio (DSCR)</td>
                  <td className="p-2 font-extrabold text-sky-800">{dscr}x (Min Bank Norm: 1.25x)</td>
                  <td className="p-2 font-bold text-slate-700">Monthly Surplus In-Hand</td>
                  <td className="p-2 font-extrabold text-emerald-800">{formatINR(monthlySurplusAfterEmi)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. Bank Branch Manager Credit Appraisal Notes */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              3. Credit Officer Verification & Recommendation
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
              <p className="mb-2">
                <strong>Officer Appraisal:</strong> {aiRecommendation.bankOfficerNotes}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200 text-[11px]">
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Primary Strengths Verified:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                    <li>10% equity available upfront from beneficiary savings.</li>
                    <li>Catchment demand ({location.nearbyPopulation} pop) exceeds required breakeven volume.</li>
                  </ul>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">Sanction Pre-Conditions:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                    <li>Direct credit of loan proceeds to registered vendor / equipment supplier.</li>
                    <li>Hypothecation of purchased assets & livestock / stock insurance.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Block */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-700 border-t border-slate-300">
            <div>
              <div className="h-10 border-b border-slate-400 mb-1" />
              <span className="font-bold block">Borrower Signature / Thumb</span>
              <span className="text-[10px] text-slate-500">Beneficiary Rural Entrepreneur</span>
            </div>
            <div>
              <div className="h-10 border-b border-slate-400 mb-1" />
              <span className="font-bold block">Field Verification Officer</span>
              <span className="text-[10px] text-slate-500">Gramin / Nationalized Bank Branch</span>
            </div>
            <div className="hidden sm:block">
              <div className="h-10 border-b border-slate-400 mb-1" />
              <span className="font-bold block">Branch Manager Sanction Stamp</span>
              <span className="text-[10px] text-slate-500">Concessional Loan Cell</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 print:hidden shrink-0">
          <span>Priority Sector Lending Appraisal • Micro-Enterprise Credit Evaluation</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition cursor-pointer"
          >
            Close Memo
          </button>
        </div>
      </div>
    </div>
  );
}
