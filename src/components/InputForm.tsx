import React, { useState } from 'react';
import {
  MapPin,
  IndianRupee,
  Store,
  Milk,
  Scissors,
  Egg,
  UtensilsCrossed,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Info,
  PlusCircle,
  Edit3
} from 'lucide-react';
import { LocationData, BusinessType, FinancialInputMode } from '../types';
import { DEMO_LOCATIONS, createCustomLocation } from '../data/demoLocations';
import { formatINR, formatLakh, calculateFinancialScheme } from '../utils/calculator';

interface InputFormProps {
  selectedLocation: LocationData | null;
  onLocationChange: (loc: LocationData | null) => void;
  financialAmount: number;
  onFinancialAmountChange: (amount: number) => void;
  financialMode: FinancialInputMode | null;
  onFinancialModeChange: (mode: FinancialInputMode) => void;
  businessType: BusinessType | null;
  onBusinessTypeChange: (type: BusinessType) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export default function InputForm({
  selectedLocation,
  onLocationChange,
  financialAmount,
  onFinancialAmountChange,
  financialMode,
  onFinancialModeChange,
  businessType,
  onBusinessTypeChange,
  onAnalyze,
  isAnalyzing,
}: InputFormProps) {
  // Custom location state
  const isCustomLocationActive = Boolean(selectedLocation && selectedLocation.id.startsWith('custom-'));
  const [isCustomMode, setIsCustomMode] = useState<boolean>(isCustomLocationActive);

  // Editable custom location fields
  const [customVillage, setCustomVillage] = useState<string>(
    isCustomLocationActive && selectedLocation ? selectedLocation.name : ''
  );
  const [customBlock, setCustomBlock] = useState<string>(
    isCustomLocationActive && selectedLocation ? selectedLocation.block : ''
  );
  const [customDistrict, setCustomDistrict] = useState<string>(
    isCustomLocationActive && selectedLocation ? selectedLocation.district : ''
  );
  const [customState, setCustomState] = useState<string>(
    isCustomLocationActive && selectedLocation ? selectedLocation.state : ''
  );

  const [validationError, setValidationError] = useState<string | null>(null);

  // Calculate live financial scheme preview (only if financialMode is chosen and amount > 0)
  const hasEnteredAmount = Boolean(financialMode && financialAmount && financialAmount > 0);
  const finance = hasEnteredAmount && financialMode ? calculateFinancialScheme(financialAmount, financialMode) : null;
  const isOverLimit = Boolean(hasEnteredAmount && finance?.isExceedsLimit);

  const handleApplyCustomLocation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customVillage.trim()) {
      setValidationError('Please enter at least a Village or Town name for the custom location.');
      return;
    }
    setValidationError(null);

    const customLoc = createCustomLocation(
      customVillage.trim(),
      customBlock.trim(),
      customDistrict.trim(),
      customState.trim()
    );
    onLocationChange(customLoc);
    setIsCustomMode(true);
  };

  const handleSelectDemoLocation = (loc: LocationData) => {
    setIsCustomMode(false);
    setValidationError(null);
    onLocationChange(loc);
  };

  const handleSelectCustomCard = () => {
    setIsCustomMode(true);
    setValidationError(null);
    if (customVillage.trim()) {
      handleApplyCustomLocation();
    } else {
      // Clear location until custom fields are populated
      onLocationChange(null);
    }
  };

  const handleTriggerAnalyze = () => {
    if (!selectedLocation && isCustomMode && customVillage.trim()) {
      handleApplyCustomLocation();
    }

    if (!selectedLocation && !(isCustomMode && customVillage.trim())) {
      setValidationError('Please select a Location (benchmark or custom village) to proceed.');
      return;
    }
    if (!businessType) {
      setValidationError('Please select a Business Category to proceed.');
      return;
    }
    if (!financialMode) {
      setValidationError('Please answer "Do you already know your estimated project cost?" by choosing YES or NO.');
      return;
    }
    if (!hasEnteredAmount) {
      setValidationError(
        financialMode === 'project_cost'
          ? 'Please enter your Estimated Project Cost (₹) to proceed.'
          : 'Please enter your Available Margin Capital (₹) to proceed.'
      );
      return;
    }

    setValidationError(null);
    onAnalyze();
  };

  const businessCards: {
    type: BusinessType;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    tag: string;
    marginHint: string;
  }[] = [
    {
      type: 'dairy',
      title: 'Dairy Farming & Processing',
      description: 'Milch cattle, doorstep milk subscriptions, society collection off-take & fresh paneer/ghee.',
      icon: Milk,
      tag: 'Daily Cash Inflow',
      marginHint: 'Gross Margin: ~24–38%',
    },
    {
      type: 'grocery',
      title: 'Grocery / Rural Retail',
      description: 'Daily ration staples, pulses, cooking oils, loose spices, FMCG soaps & confectionery.',
      icon: Store,
      tag: 'Fast Inventory Turn',
      marginHint: 'Gross Margin: ~16–22%',
    },
    {
      type: 'tailoring',
      title: 'Tailoring & Textiles',
      description: 'Custom ladies blouses, school uniforms, men’s garments, alterations & fabric boutique.',
      icon: Scissors,
      tag: 'High Service Margin',
      marginHint: 'Gross Margin: ~54–77%',
    },
    {
      type: 'poultry',
      title: 'Poultry & Country Birds',
      description: 'Broiler batch rearing, desi country chicken (Natukodi) & farm-fresh table eggs supply.',
      icon: Egg,
      tag: 'Short 40-Day Cycle',
      marginHint: 'Gross Margin: ~25–44%',
    },
    {
      type: 'food_processing',
      title: 'Agri Food Processing',
      description: 'Cold-pressed cooking oils, traditional pickles, pulse papads & regional snack packaging.',
      icon: UtensilsCrossed,
      tag: 'High Value-Add',
      marginHint: 'Gross Margin: ~33–45%',
    },
    {
      type: 'other',
      title: 'Other Rural Enterprise',
      description: 'Micro repair workshop, mobile accessories & general rural commercial utility services.',
      icon: Layers,
      tag: 'Custom Venture',
      marginHint: 'Gross Margin: ~30–40%',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 relative overflow-hidden space-y-6">
      {/* Decorative accent strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />

      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Configure Rural Enterprise Parameters
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Select or enter your target location, choose business category, and provide financial parameters.
          </p>
        </div>

        {/* Live Auto-Routed Scheme Badge: ONLY shown when financial amount is entered */}
        {hasEnteredAmount && finance && !isOverLimit && (
          <div className="bg-slate-900 text-slate-100 p-3 rounded-xl border border-slate-800 text-xs shadow-inner shrink-0 w-full md:w-auto">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-emerald-400">Auto-Scheme: {finance.schemeName}</span>
            </div>
            <div className="text-[11px] text-slate-300 grid grid-cols-2 gap-x-3 gap-y-0.5">
              <span>Project Cost: <strong className="text-white">{formatINR(finance.projectCost)}</strong></span>
              <span>Agency Loan: <strong className="text-emerald-300">{formatINR(finance.agencyFinancing)} (90%)</strong></span>
              <span>Interest Rate: <strong className="text-white">{finance.interestRate}% p.a.</strong></span>
              <span>Tenure: <strong className="text-white">{finance.tenureYears} yrs ({finance.moratoriumMonths}m grace)</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* PART A: LOCATION INPUT (No pre-selected option on start + Custom Location Option) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>A. Location (Select Benchmark Village or Enter Custom Location)</span>
          </label>

          {selectedLocation ? (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active: {selectedLocation.name} ({selectedLocation.district}, {selectedLocation.state})
            </span>
          ) : (
            <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              *No location selected
            </span>
          )}
        </div>

        {/* Location Selection Grid: Demo Locations + Dedicated Custom Location Option */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Demo Locations */}
          {DEMO_LOCATIONS.map((loc) => {
            const isSelected = selectedLocation?.id === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelectDemoLocation(loc)}
                className={`text-left p-3.5 rounded-xl border transition cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">
                      {loc.name}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                    {loc.district}, {loc.state}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/70 text-[10px] text-slate-500 font-medium">
                  <span>Radius: <strong>{loc.marketReachKm} km</strong></span>
                  <span>Pop: <strong>{loc.nearbyPopulation.toLocaleString('en-IN')}</strong></span>
                </div>
              </button>
            );
          })}

          {/* Dedicated Custom Location Card */}
          <button
            type="button"
            onClick={handleSelectCustomCard}
            className={`text-left p-3.5 rounded-xl border transition cursor-pointer relative flex flex-col justify-between ${
              isCustomMode
                ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <span>Custom Location</span>
                </span>
                {isCustomLocationActive && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {isCustomLocationActive && selectedLocation
                  ? `${selectedLocation.name} • ${selectedLocation.district}`
                  : 'Enter your village, block, district & state'}
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200/70 text-[10px] text-emerald-700 font-bold flex items-center gap-1">
              <Edit3 className="w-3 h-3" />
              <span>{isCustomMode ? 'Custom Location Form Active' : 'Click to Enter Village Details'}</span>
            </div>
          </button>
        </div>

        {/* Custom Location Form Input Section */}
        {isCustomMode && (
          <form
            onSubmit={handleApplyCustomLocation}
            className="p-4 bg-slate-50 border border-emerald-300 rounded-xl space-y-3 mt-2 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Custom Location Details (Village, Block, District, State)</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                *The feasibility engine will model catchment & demographics for this location
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                  Village / Town Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customVillage}
                  onChange={(e) => setCustomVillage(e.target.value)}
                  placeholder="e.g. Ramanathapuram Village"
                  required
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                  Block / Mandal / Tehsil
                </label>
                <input
                  type="text"
                  value={customBlock}
                  onChange={(e) => setCustomBlock(e.target.value)}
                  placeholder="e.g. Paramakudi Block"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                  District
                </label>
                <input
                  type="text"
                  value={customDistrict}
                  onChange={(e) => setCustomDistrict(e.target.value)}
                  placeholder="e.g. Ramanathapuram"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={customState}
                  onChange={(e) => setCustomState(e.target.value)}
                  placeholder="e.g. Tamil Nadu"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="text-xs font-bold py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Apply Custom Location</span>
              </button>

              {isCustomLocationActive && (
                <span className="text-xs text-emerald-700 font-semibold">
                  ✓ Custom location set for analysis
                </span>
              )}
            </div>
          </form>
        )}
      </div>

      {/* PART B: BUSINESS CATEGORY SELECTION (No pre-selected option on start) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>B. Business Category (Select One)</span>
          </label>

          {businessType ? (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Selected: {businessCards.find((c) => c.type === businessType)?.title}
            </span>
          ) : (
            <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              *No business category selected
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {businessCards.map((card) => {
            const isSelected = businessType === card.type;
            const Icon = card.icon;
            return (
              <button
                key={card.type}
                type="button"
                onClick={() => {
                  setValidationError(null);
                  onBusinessTypeChange(card.type);
                }}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer relative flex items-start gap-3 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  isSelected ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 text-slate-700'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-sm text-slate-900 truncate">{card.title}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                    {card.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="bg-emerald-100/80 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {card.tag}
                    </span>
                    <span className="bg-slate-200/80 text-slate-700 text-[10px] font-medium px-1.5 py-0.5 rounded">
                      {card.marginHint}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PART C: FINANCIAL INFORMATION (Dual Mode Switch) */}
      <div className="space-y-4 pt-2 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <span>C. Financial Information</span>
          </label>

          <span className="text-[11px] text-slate-500 font-medium">
            *Concessional lending applies standard 10% Beneficiary Margin : 90% Agency Loan ratio
          </span>
        </div>

        {/* Question Switch (No default pre-selection) */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              Do you already know your estimated project cost?
            </p>
            {financialMode ? (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded self-start sm:self-auto">
                Selected: {financialMode === 'project_cost' ? 'YES (Project Cost)' : 'NO (Margin Capital)'}
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded self-start sm:self-auto">
                *Select YES or NO to proceed
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setValidationError(null);
                if (financialMode !== 'project_cost') {
                  onFinancialModeChange('project_cost');
                  if (financialAmount > 0 && financialMode === 'margin_capital') {
                    onFinancialAmountChange(Math.round(financialAmount * 10));
                  }
                }
              }}
              className={`py-2.5 px-4 rounded-xl font-bold text-xs transition cursor-pointer border flex items-center justify-center gap-2 ${
                financialMode === 'project_cost'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-500/20'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {financialMode === 'project_cost' && <CheckCircle2 className="w-4 h-4" />}
              <span>YES, I know my project cost</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setValidationError(null);
                if (financialMode !== 'margin_capital') {
                  onFinancialModeChange('margin_capital');
                  if (financialAmount > 0 && financialMode === 'project_cost') {
                    onFinancialAmountChange(Math.round(financialAmount * 0.10));
                  }
                }
              }}
              className={`py-2.5 px-4 rounded-xl font-bold text-xs transition cursor-pointer border flex items-center justify-center gap-2 ${
                financialMode === 'margin_capital'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-500/20'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {financialMode === 'margin_capital' && <CheckCircle2 className="w-4 h-4" />}
              <span>NO, I only know my available margin capital</span>
            </button>
          </div>
        </div>

        {/* Active Input Field & Dynamic Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Direct Number Input (Empty by default, No presets, disabled until YES/NO selected) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                {financialMode === 'project_cost'
                  ? 'Estimated Project Cost (₹)'
                  : financialMode === 'margin_capital'
                  ? 'Available Margin Capital (₹)'
                  : 'Project Cost / Margin Capital (₹)'}
              </label>
              {hasEnteredAmount && (
                <span className="text-xs text-slate-500 font-semibold">
                  {formatLakh(financialAmount)}
                </span>
              )}
            </div>

            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-lg ${
                financialMode ? 'text-slate-400' : 'text-slate-300'
              }`}>
                ₹
              </span>
              <input
                type="number"
                disabled={financialMode === null}
                min="0"
                max={financialMode === 'project_cost' ? 10000000 : 1000000}
                step={financialMode === 'project_cost' ? 5000 : 1000}
                placeholder={
                  financialMode === 'project_cost'
                    ? 'e.g. 250000'
                    : financialMode === 'margin_capital'
                    ? 'e.g. 25000'
                    : 'Select YES or NO above to enter amount'
                }
                value={financialAmount > 0 ? financialAmount : ''}
                onChange={(e) => {
                  setValidationError(null);
                  const val = e.target.value;
                  if (val === '') {
                    onFinancialAmountChange(0);
                  } else {
                    const parsed = Number(val);
                    onFinancialAmountChange(isNaN(parsed) || parsed < 0 ? 0 : parsed);
                  }
                }}
                className={`w-full pl-8 pr-28 py-2.5 rounded-xl text-lg font-bold transition ${
                  financialMode === null
                    ? 'bg-slate-100/70 border border-slate-200 text-slate-400 cursor-not-allowed placeholder:text-slate-400 placeholder:text-xs placeholder:font-normal'
                    : 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-600 bg-slate-200 px-2 py-1 rounded">
                {financialMode === 'project_cost'
                  ? '100% Capex'
                  : financialMode === 'margin_capital'
                  ? '10% Equity'
                  : 'Awaiting YES/NO'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              {financialMode === 'project_cost'
                ? 'Enter your full estimated project setup outlay. The system will auto-calculate the 10% Margin & 90% Loan.'
                : financialMode === 'margin_capital'
                ? 'Enter your available cash contribution. The system will auto-calculate the 100% Project Cost (Margin ÷ 10%) & 90% Loan.'
                : 'Select YES or NO in the prompt above to unlock the financial amount input field.'}
            </p>
          </div>

          {/* Right Column: Real-Time Indicative Financing Structure Breakdown */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Indicative Financing Structure
                </span>
                {hasEnteredAmount && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Auto-Computed (10:90)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                {hasEnteredAmount
                  ? 'Calculated by the system from your entered financial input (10% Own Contribution : 90% Agency Loan)'
                  : 'Select YES or NO and enter an amount to view the calculated financing structure'}
              </p>
            </div>

            {hasEnteredAmount && finance ? (
              <>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">
                      Available Margin / Own Contribution (10%)
                    </span>
                    <span className="text-base font-extrabold text-amber-950 block mt-0.5">
                      {formatINR(finance.beneficiaryContribution)}
                    </span>
                    <span className="text-[10px] text-slate-500">Entrepreneur Equity</span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                      Potential Agency Loan (90%)
                    </span>
                    <span className="text-base font-extrabold text-emerald-950 block mt-0.5">
                      {formatINR(finance.agencyFinancing)}
                    </span>
                    <span className="text-[10px] text-slate-500">Concessional Borrowing</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-200">
                  <span className="text-slate-600">Total Indicative Project Cost (100%):</span>
                  <strong className="text-slate-900 font-extrabold text-sm">{formatINR(finance.projectCost)}</strong>
                </div>
              </>
            ) : (
              <div className="bg-white p-4 rounded-lg border border-dashed border-slate-300 text-center flex flex-col items-center justify-center py-5">
                <IndianRupee className="w-5 h-5 text-slate-400 mb-1" />
                <p className="text-xs font-bold text-slate-700">Awaiting Financial Input</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {!financialMode
                    ? 'Please choose YES or NO above, then enter an amount to view the 10% Margin & 90% Loan calculation.'
                    : 'Enter an amount above. The system will calculate the 10% Beneficiary Margin and 90% Potential Agency Loan.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Warning if project cost > ₹50 Lakh */}
        {isOverLimit && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                Project cost exceeds the prototype's supported Term Loan range (up to ₹50,00,000).
              </p>
              <p className="mt-0.5 text-amber-800">
                Please consult the relevant district financing agency / DIC for large-scale enterprise schemes or reduce the project outlay.
              </p>
            </div>
          </div>
        )}

        {/* Validation Notice if user clicked analyze without completing inputs */}
        {validationError && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Indicative Disclaimer Note */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
          <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-700">Indicative Guidance Notice:</strong> All loan amounts, interest rates, and equity splits are calculated as indicative estimates under standard Priority Sector norms. Final loan eligibility is subject to official document verification and bank appraisal.
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>
            Evaluates 5–10km catchment, competitor density, SWOT, pricing tables & DSCR repayment buffer.
          </span>
        </div>

        <button
          type="button"
          onClick={handleTriggerAnalyze}
          disabled={isAnalyzing || isOverLimit}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide text-white shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
            isAnalyzing || isOverLimit
              ? 'bg-slate-700 cursor-not-allowed opacity-80'
              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 shadow-emerald-900/20'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Evaluating Hyper-Local Feasibility...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Analyze Business Feasibility</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
