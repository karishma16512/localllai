export type BusinessType =
  | 'dairy'
  | 'grocery'
  | 'tailoring'
  | 'poultry'
  | 'food_processing'
  | 'other';

export type FinancialInputMode = 'project_cost' | 'margin_capital';

export interface CompetitorPoint {
  id: string;
  name: string;
  type: 'competitor' | 'anchor_demand' | 'cooperative_hub' | 'unserved_hamlet';
  distanceKm: number;
  directionAngleDeg: number; // for radar / map rendering (0 - 360)
  details: string;
  impactLevel: 'High' | 'Medium' | 'Low';
  dailyVolume?: string;
}

export interface LocationData {
  id: string;
  name: string;
  block: string;
  district: string;
  state: string;
  pinCode: string;
  regionType: string;
  marketReachKm: number; // e.g. 5 - 10 km
  nearbyPopulation: number;
  totalHouseholds: number;
  avgMonthlyHouseholdIncome: number;
  dairyCompetitorCount: number;
  groceryCompetitorCount: number;
  tailoringCompetitorCount?: number;
  poultryCompetitorCount?: number;
  foodProcessingCompetitorCount?: number;
  otherCompetitorCount?: number;
  dairyDemandLpd: number; // Litres per day
  groceryDailySpendEstimate: number; // INR
  centerCoords: { lat: number; lng: number };
  dairyCompetitors: CompetitorPoint[];
  groceryCompetitors: CompetitorPoint[];
  tailoringCompetitors?: CompetitorPoint[];
  poultryCompetitors?: CompetitorPoint[];
  foodProcessingCompetitors?: CompetitorPoint[];
  otherCompetitors?: CompetitorPoint[];
  dairySpecificThreats: Array<{ title: string; severity: 'High' | 'Medium' | 'Low'; mitigation: string }>;
  grocerySpecificThreats: Array<{ title: string; severity: 'High' | 'Medium' | 'Low'; mitigation: string }>;
  tailoringSpecificThreats?: Array<{ title: string; severity: 'High' | 'Medium' | 'Low'; mitigation: string }>;
  poultrySpecificThreats?: Array<{ title: string; severity: 'High' | 'Medium' | 'Low'; mitigation: string }>;
  foodProcessingSpecificThreats?: Array<{ title: string; severity: 'High' | 'Medium' | 'Low'; mitigation: string }>;
  otherSpecificThreats?: Array<{ title: string; severity: 'High' | 'Medium' | 'Low'; mitigation: string }>;
}

export interface AmortizationMonth {
  month: number;
  openingPrincipal: number;
  interestPayment: number;
  principalPayment: number;
  totalEmi: number;
  closingPrincipal: number;
  isMoratorium: boolean;
}

export interface QuarterlyRepayment {
  quarter: number;
  monthsRange: string;
  openingPrincipal: number;
  principalPaid: number;
  interestPaid: number;
  totalInstallment: number;
  closingPrincipal: number;
  isMoratoriumQuarter: boolean;
}

export interface FinancialScheme {
  schemeName: 'Micro Finance' | 'Term Loan';
  isExceededLimit: boolean;
  isExceedsLimit?: boolean;
  maxLoanLimit?: number;
  projectCost: number;
  beneficiaryContribution: number; // 10% or balance after capped loan
  agencyFinancing: number; // min(90% of Project Cost, maxLoanLimit)
  fixedCapexRequirement: number; // ~75% (Livestock / Machinery / Store Infrastructure)
  workingCapitalRequirement: number; // ~25% (Feed / Initial Stock / Operational Cycle)
  monthlyOpexEstimate: number;
  quarterlyOpexEstimate: number;
  interestRate: number; // 6.5% or 8%
  tenureYears: number; // 3 or 7
  tenureMonths: number; // 36 or 84
  moratoriumMonths: number; // 3 or 6
  monthlyEmi: number; // Post moratorium EMI
  quarterlyEmi: number;
  totalInterest: number;
  totalRepayment: number;
  moratoriumInterestAccrued: number;
  amortizationSchedule: AmortizationMonth[];
  quarterlySchedule: QuarterlyRepayment[];
}

export interface ProductPricingItem {
  name: string;
  unit: string;
  wholesaleCost: number;
  retailMarketPrice: number;
  grossMarginPct: number;
  demandTrend: 'High' | 'Growing' | 'Stable';
  dailySalesVol: string;
}

export interface FeasibilityScoreBreakdown {
  dscrScore: number; // max 35 pts
  marketScore: number; // max 30 pts
  capitalScore: number; // max 20 pts
  sectorScore: number; // max 15 pts
  totalScore: number; // 0 - 100
  formulaExplanation: string;
}

export interface FeasibilityReport {
  businessType: BusinessType;
  businessTitle?: string;
  location: LocationData;
  finance: FinancialScheme;
  feasibilityScore: number; // 0 - 100
  scoreBreakdown: FeasibilityScoreBreakdown;
  feasibilityGrade: 'HIGH_FEASIBILITY' | 'MODERATE_FEASIBILITY' | 'HIGH_RISK';
  marketCatchmentPopulation: number;
  marketCatchmentHouseholds: number;
  competitorCount: number;
  unmetDemandGap: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  localThreats: Array<{ title: string; severity: 'High' | 'Medium' | 'Low'; mitigation: string }>;
  productPricing: ProductPricingItem[];
  dailyRevenueEstimate: number;
  monthlyRevenueEstimate: number;
  monthlyOpexEstimate: number;
  monthlyNetCashflowBeforeEmi: number;
  monthlySurplusAfterEmi: number;
  dscr: number; // Debt Service Coverage Ratio (Net cashflow / EMI)
  aiRecommendation: {
    verdict: string;
    executiveSummary: string;
    keyActionPoints: string[];
    riskAlerts: string[];
    bankOfficerNotes: string;
  };
}

export interface StressTestScenario {
  salesDropPct: number; // 0, 10, 20, 30, etc.
  revenue: number;
  opex: number;
  netCashflow: number;
  emi: number;
  monthlySurplus: number;
  dscr: number;
  status: 'Robust & Safe' | 'Acceptable Margin' | 'High Stress' | 'Default Risk';
  statusColor: 'green' | 'yellow' | 'amber' | 'red';
}
