import { FinancialScheme, AmortizationMonth, QuarterlyRepayment, FinancialInputMode } from '../types';

/**
 * Formats a number to Indian Rupee format (e.g. ₹1,40,000 or ₹50,00,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const absVal = Math.abs(rounded).toString();

  if (absVal.length <= 3) {
    return `${isNegative ? '-' : ''}₹${absVal}`;
  }

  const lastThree = absVal.substring(absVal.length - 3);
  const otherNumbers = absVal.substring(0, absVal.length - 3);
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return `${isNegative ? '-' : ''}₹${formattedOther},${lastThree}`;
}

/**
 * Compact Indian currency formatting (e.g., ₹1.40 Lakh, ₹25.0 Lakh)
 */
export function formatLakh(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return formatINR(amount);
}

/**
 * PS Rules Financial Calculator
 * 
 * Rules:
 * Micro Finance Scheme:
 * - Project Cost ≤ ₹1.40 lakh (140,000)
 * - Loan = 90% of Project Cost
 * - Maximum Loan = ₹1.25 lakh (125,000)
 * - Concessional Interest Rate = 6.5% p.a., 3 years (36 mo), 3-month moratorium
 * 
 * Term Loan Scheme:
 * - Project Cost > ₹1.40 lakh (140,000) and ≤ ₹50 lakh (5,000,000)
 * - Loan = 90% of Project Cost
 * - Maximum Loan = ₹45 lakh (4,500,000)
 * - Concessional Interest Rate = 8.0% p.a., 7 years (84 mo), 6-month moratorium
 * 
 * Final Loan Sizing:
 * - The final loan amount must always be the lower of 90% of Project Cost and the scheme's maximum loan limit.
 * - Beneficiary Contribution = Total Project Cost - Final Loan Amount (minimum 10%).
 */
export function calculateFinancialScheme(
  amount: number,
  mode: FinancialInputMode = 'margin_capital'
): FinancialScheme {
  const safeAmount = Math.max(1000, Number(amount) || 1000);

  let calculatedProjectCost = 0;

  if (mode === 'project_cost') {
    calculatedProjectCost = safeAmount;
  } else {
    // Mode is available margin capital (10% baseline equity)
    calculatedProjectCost = safeAmount / 0.10;
  }

  const isExceededLimit = calculatedProjectCost > 5000000;

  // Scheme auto-selection threshold: Project Cost ≤ ₹1.40 Lakh (140,000)
  const isMicroFinance = calculatedProjectCost <= 140000;

  // Maximum loan limits per PS specification:
  // Micro Finance: Max Loan = ₹1.25 lakh (125,000)
  // Term Loan: Max Loan = ₹45 lakh (4,500,000)
  const maxLoanLimit = isMicroFinance ? 125000 : 4500000;

  // Final Loan: The lower of 90% of Project Cost and the scheme's maximum loan limit
  const ninetyPercentLoan = calculatedProjectCost * 0.90;
  const agencyFinancing = Math.min(ninetyPercentLoan, maxLoanLimit);

  // Beneficiary Contribution is the remainder (ensuring full project cost coverage)
  const beneficiaryContribution = Math.max(calculatedProjectCost * 0.10, calculatedProjectCost - agencyFinancing);

  // Sizing allocations
  const fixedCapexRequirement = calculatedProjectCost * 0.75;
  const workingCapitalRequirement = calculatedProjectCost * 0.25;

  // Monthly / Quarterly Operating Expense demo estimation (~15-20% of project scale / month)
  const monthlyOpexEstimate = Math.round(calculatedProjectCost * 0.08 + 12000);
  const quarterlyOpexEstimate = monthlyOpexEstimate * 3;

  const schemeName: 'Micro Finance' | 'Term Loan' = isMicroFinance ? 'Micro Finance' : 'Term Loan';
  const interestRate = isMicroFinance ? 6.5 : 8.0;
  const tenureYears = isMicroFinance ? 3 : 7;
  const tenureMonths = tenureYears * 12;
  const moratoriumMonths = isMicroFinance ? 3 : 6;

  const monthlyRate = interestRate / 100 / 12;
  const repaymentMonths = tenureMonths - moratoriumMonths;

  // Standard Reducing balance EMI formula for the post-moratorium term
  // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const P = agencyFinancing;
  const r = monthlyRate;
  const n = repaymentMonths;

  let monthlyEmi = 0;
  if (r > 0 && n > 0) {
    monthlyEmi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  // Calculate month-by-month schedule & moratorium accrued interest
  const amortizationSchedule: AmortizationMonth[] = [];
  let currentBalance = P;
  let totalInterest = 0;
  let moratoriumInterestAccrued = 0;

  for (let m = 1; m <= tenureMonths; m++) {
    const isMoratorium = m <= moratoriumMonths;

    if (isMoratorium) {
      // During moratorium: Interest charged/serviced on principal, zero principal amortization
      const monthInterest = currentBalance * r;
      moratoriumInterestAccrued += monthInterest;
      totalInterest += monthInterest;

      amortizationSchedule.push({
        month: m,
        openingPrincipal: Math.round(currentBalance),
        interestPayment: Math.round(monthInterest),
        principalPayment: 0,
        totalEmi: Math.round(monthInterest),
        closingPrincipal: Math.round(currentBalance),
        isMoratorium: true,
      });
    } else {
      // Active repayment phase
      const monthInterest = currentBalance * r;
      let principalPayment = monthlyEmi - monthInterest;

      // Handle final month rounding
      if (m === tenureMonths || principalPayment > currentBalance) {
        principalPayment = currentBalance;
      }

      const totalMonthPayment = principalPayment + monthInterest;
      const closing = Math.max(0, currentBalance - principalPayment);
      totalInterest += monthInterest;

      amortizationSchedule.push({
        month: m,
        openingPrincipal: Math.round(currentBalance),
        interestPayment: Math.round(monthInterest),
        principalPayment: Math.round(principalPayment),
        totalEmi: Math.round(totalMonthPayment),
        closingPrincipal: Math.round(closing),
        isMoratorium: false,
      });

      currentBalance = closing;
    }
  }

  // Generate Quarterly Repayment Schedule (groups 3 months per quarter)
  const quarterlySchedule: QuarterlyRepayment[] = [];
  const totalQuarters = Math.ceil(tenureMonths / 3);

  for (let q = 1; q <= totalQuarters; q++) {
    const startM = (q - 1) * 3 + 1;
    const endM = Math.min(tenureMonths, q * 3);
    const monthsSlice = amortizationSchedule.slice(startM - 1, endM);

    if (monthsSlice.length > 0) {
      const opening = monthsSlice[0].openingPrincipal;
      const closing = monthsSlice[monthsSlice.length - 1].closingPrincipal;
      const qPrincipal = monthsSlice.reduce((sum, item) => sum + item.principalPayment, 0);
      const qInterest = monthsSlice.reduce((sum, item) => sum + item.interestPayment, 0);
      const qInstallment = monthsSlice.reduce((sum, item) => sum + item.totalEmi, 0);
      const isMoratoriumQ = monthsSlice.every((item) => item.isMoratorium);

      quarterlySchedule.push({
        quarter: q,
        monthsRange: `Months ${startM} – ${endM}`,
        openingPrincipal: opening,
        principalPaid: qPrincipal,
        interestPaid: qInterest,
        totalInstallment: qInstallment,
        closingPrincipal: closing,
        isMoratoriumQuarter: isMoratoriumQ,
      });
    }
  }

  const totalRepayment = agencyFinancing + totalInterest;
  const quarterlyEmi = Math.round(monthlyEmi * 3);

  return {
    schemeName,
    isExceededLimit,
    isExceedsLimit: isExceededLimit,
    maxLoanLimit,
    projectCost: Math.round(calculatedProjectCost),
    beneficiaryContribution: Math.round(beneficiaryContribution),
    agencyFinancing: Math.round(agencyFinancing),
    fixedCapexRequirement: Math.round(fixedCapexRequirement),
    workingCapitalRequirement: Math.round(workingCapitalRequirement),
    monthlyOpexEstimate,
    quarterlyOpexEstimate,
    interestRate,
    tenureYears,
    tenureMonths,
    moratoriumMonths,
    monthlyEmi: Math.round(monthlyEmi),
    quarterlyEmi,
    totalInterest: Math.round(totalInterest),
    totalRepayment: Math.round(totalRepayment),
    moratoriumInterestAccrued: Math.round(moratoriumInterestAccrued),
    amortizationSchedule,
    quarterlySchedule,
  };
}
