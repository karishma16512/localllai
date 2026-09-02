import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  IndianRupee,
  Store,
  Milk,
  Calculator,
  Activity,
  Scale,
  Printer,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LocationData, BusinessType, FeasibilityReport, FinancialInputMode } from './types';
import { DEMO_LOCATIONS } from './data/demoLocations';
import { generateFeasibilityReport } from './utils/feasibilityEngine';
import Header from './components/Header';
import InputForm from './components/InputForm';
import FeasibilityScoreCard from './components/FeasibilityScoreCard';
import CompetitorMap from './components/CompetitorMap';
import SwotMatrix from './components/SwotMatrix';
import ProductPricingTable from './components/ProductPricingTable';
import LocalThreatsCard from './components/LocalThreatsCard';
import FinancialCalculatorCard from './components/FinancialCalculatorCard';
import StressTestView from './components/StressTestView';
import BusinessComparisonModal from './components/BusinessComparisonModal';
import BankProposalModal from './components/BankProposalModal';

export default function App() {
  // Primary input state: Starts fresh with no pre-selected values
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [financialMode, setFinancialMode] = useState<FinancialInputMode | null>(null);
  const [financialAmount, setFinancialAmount] = useState<number>(0);
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);

  // Analysis result state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [report, setReport] = useState<FeasibilityReport | null>(null);

  // Active section tab navigation (for quick jumping on desktop/mobile)
  const [activeTab, setActiveTab] = useState<'all' | 'feasibility' | 'finance' | 'stress'>('all');

  // Modals state
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const isFormComplete = Boolean(
    selectedLocation &&
    businessType &&
    financialMode &&
    financialAmount > 0
  );

  // Handle "Analyze" click with optional server AI analysis and local calculation
  const handleAnalyze = async () => {
    if (!selectedLocation || !businessType || !financialMode || financialAmount <= 0) {
      return;
    }

    setIsAnalyzing(true);

    try {
      // Local immediate computation
      const baseReport = generateFeasibilityReport(
        selectedLocation,
        businessType,
        financialAmount,
        financialMode
      );

      // Attempt AI advisory enhancement from server endpoint (if Gemini API key is configured)
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: selectedLocation,
            businessType,
            financialMode,
            marginCapital: baseReport.finance.beneficiaryContribution,
            projectCost: baseReport.finance.projectCost,
            loanScheme: baseReport.finance.schemeName,
          }),
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData.success && resData.data?.verdict) {
            baseReport.aiRecommendation = {
              verdict: resData.data.verdict,
              executiveSummary: resData.data.executiveSummary || baseReport.aiRecommendation.executiveSummary,
              keyActionPoints: resData.data.keyActionPoints || baseReport.aiRecommendation.keyActionPoints,
              riskAlerts: resData.data.riskAlerts || baseReport.aiRecommendation.riskAlerts,
              bankOfficerNotes: resData.data.bankOfficerNotes || baseReport.aiRecommendation.bankOfficerNotes,
            };
          }
        }
      } catch (err) {
        // Fallback gracefully to high-precision local heuristics
        console.log('AI server call optional fallback');
      }

      setReport(baseReport);

      // Trigger celebratory confetti if feasibility score is high (≥80)
      if (baseReport.feasibilityScore >= 80) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10b981', '#34d399', '#f59e0b', '#0284c7'],
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Recompute report automatically when all inputs are present and user edits one
  useEffect(() => {
    if (selectedLocation && businessType && financialMode && financialAmount > 0) {
      const updated = generateFeasibilityReport(
        selectedLocation,
        businessType,
        financialAmount,
        financialMode
      );
      setReport(updated);
    } else {
      setReport(null);
    }
  }, [selectedLocation, businessType, financialAmount, financialMode]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenComparison={() => setShowComparisonModal(true)}
      />

      {/* Main App Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full space-y-7">
        {/* Section 1: User Inputs Form */}
        <InputForm
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          financialAmount={financialAmount}
          onFinancialAmountChange={setFinancialAmount}
          financialMode={financialMode}
          onFinancialModeChange={setFinancialMode}
          businessType={businessType}
          onBusinessTypeChange={setBusinessType}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />

        {/* When inputs are not yet complete, display a clean onboarding guide */}
        {!report && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Ready to evaluate your Rural Enterprise Feasibility?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Complete the 3 quick inputs above to generate the full Hyper-Local Feasibility report, 10:90 Concessional Financing structure, and Stress Test.
                </p>
              </div>
            </div>

            {/* Checklist of 3 steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Step 1 */}
              <div className={`p-4 rounded-xl border transition ${
                selectedLocation
                  ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Step 1</span>
                  {selectedLocation ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      Pending
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Target Location</span>
                </h4>
                <p className="text-[11px] text-slate-600">
                  {selectedLocation
                    ? `${selectedLocation.name} (${selectedLocation.district}, ${selectedLocation.state})`
                    : 'Choose a benchmark village or enter your custom location.'}
                </p>
              </div>

              {/* Step 2 */}
              <div className={`p-4 rounded-xl border transition ${
                businessType
                  ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Step 2</span>
                  {businessType ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      Pending
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Business Category</span>
                </h4>
                <p className="text-[11px] text-slate-600">
                  {businessType
                    ? `Category selected: ${businessType.toUpperCase()}`
                    : 'Select Dairy, Grocery, Tailoring, Poultry, Food Processing, or Other.'}
                </p>
              </div>

              {/* Step 3 */}
              <div className={`p-4 rounded-xl border transition ${
                financialMode && financialAmount > 0
                  ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Step 3</span>
                  {financialMode && financialAmount > 0 ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      Pending
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Financial Outlay</span>
                </h4>
                <p className="text-[11px] text-slate-600">
                  {financialMode && financialAmount > 0
                    ? `Provided ₹${financialAmount.toLocaleString('en-IN')} (${financialMode === 'project_cost' ? 'Project Cost' : 'Margin Capital'})`
                    : 'Select YES/NO and enter your Estimated Project Cost or Available Margin Capital.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* When Report is Generated, show the full Analysis Dashboard */}
        {report && (
          <>
            {/* Section Tabs Quick Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Full Analysis Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('feasibility')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeTab === 'feasibility'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  1. Hyper-Local Feasibility
                </button>
                <button
                  onClick={() => setActiveTab('finance')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeTab === 'finance'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2. Financial Calculator (10:90 Concessional)
                </button>
                <button
                  onClick={() => setActiveTab('stress')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeTab === 'stress'
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  3. Stress Test (-10%, -20%, -30%)
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowComparisonModal(true)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition hover:bg-emerald-100"
              >
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                <span>Compare Business Options</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* 1. HYPER-LOCAL BUSINESS FEASIBILITY SECTION */}
            {(activeTab === 'all' || activeTab === 'feasibility') && selectedLocation && businessType && (
              <section className="space-y-6" id="feasibility-section">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    1
                  </span>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Hyper-Local Business Feasibility Assessment
                    </h2>
                    <p className="text-xs text-slate-500">
                      Catchment reach, competitor density, SWOT, product margins and AI recommendation for {selectedLocation.name}
                    </p>
                  </div>
                </div>

                {/* Feasibility Score Meter & AI Recommendation Card */}
                <FeasibilityScoreCard report={report} />

                {/* Spatial Competitor & Catchment Map */}
                <CompetitorMap location={selectedLocation} businessType={businessType} />

                {/* Product Pricing & SWOT Matrix Grid */}
                <div className="grid grid-cols-1 gap-6">
                  <ProductPricingTable
                    pricingItems={report.productPricing}
                    businessType={businessType}
                  />
                  <SwotMatrix swot={report.swot} businessType={businessType} />
                  <LocalThreatsCard
                    threats={report.localThreats}
                    businessType={businessType}
                  />
                </div>
              </section>
            )}

            {/* 2. SMART FINANCIAL CALCULATOR SECTION */}
            {(activeTab === 'all' || activeTab === 'finance') && (
              <section className="space-y-6 pt-4" id="finance-section">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    2
                  </span>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Smart Financial Calculator & Scheme Auto-Routing
                    </h2>
                    <p className="text-xs text-slate-500">
                      10% Beneficiary Equity • 90% Agency Loan • Micro Finance (6.5%, 3y) vs Term Loan (8.0%, 7y)
                    </p>
                  </div>
                </div>

                {/* Financial Calculator Component */}
                <FinancialCalculatorCard finance={report.finance} />
              </section>
            )}

            {/* 3. BUSINESS STRESS TEST SECTION */}
            {(activeTab === 'all' || activeTab === 'stress') && (
              <section className="space-y-6 pt-4" id="stress-section">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    3
                  </span>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Business Stress Test & Repayment Affordability
                    </h2>
                    <p className="text-xs text-slate-500">
                      Simulate -10%, -20%, -30% sales reduction to verify operating surplus buffer against fixed EMI
                    </p>
                  </div>
                </div>

                {/* Stress Test Component */}
                <StressTestView report={report} />
              </section>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-slate-200 font-bold">
              Rural Enterprise Hyper-Local Feasibility & Concessional Loan Assessment
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Micro-Enterprise Credit Evaluation & Feasibility Analytics Engine
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowComparisonModal(true)}
              className="text-slate-300 hover:text-white underline cursor-pointer text-[11px]"
            >
              Compare Businesses
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => setShowPrintModal(true)}
              className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer text-[11px]"
            >
              Print Bank Memo
            </button>
          </div>
        </div>
      </footer>

      {/* Side-by-Side Business Comparison Modal */}
      {showComparisonModal && (
        <BusinessComparisonModal
          location={selectedLocation}
          financialAmount={financialAmount}
          financialMode={financialMode}
          onClose={() => setShowComparisonModal(false)}
          onSelectBusiness={(type) => setBusinessType(type)}
        />
      )}

      {/* Bank Loan Appraisal Print Memo Modal */}
      {showPrintModal && (
        <BankProposalModal
          report={report}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}
