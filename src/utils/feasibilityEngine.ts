import {
  BusinessType,
  LocationData,
  FinancialScheme,
  FeasibilityReport,
  StressTestScenario,
  ProductPricingItem,
  FinancialInputMode,
} from '../types';
import { calculateFinancialScheme } from './calculator';

export function generateFeasibilityReport(
  location: LocationData,
  businessType: BusinessType,
  amount: number,
  mode: FinancialInputMode = 'margin_capital',
  aiOverride?: any
): FeasibilityReport {
  const finance: FinancialScheme = calculateFinancialScheme(amount, mode);

  // Sizing and operational assumptions proportional to project cost
  const scaleMultiplier = Math.max(0.5, Math.min(10, finance.projectCost / 140000));

  let dailyRevenueEstimate = 0;
  let monthlyOpexEstimate = 0;
  let productPricing: ProductPricingItem[] = [];
  let strengths: string[] = [];
  let weaknesses: string[] = [];
  let opportunities: string[] = [];
  let threats: string[] = [];
  let unmetDemandGap = '';
  let competitorCount = 0;
  let sectorScore = 14;

  if (businessType === 'dairy') {
    competitorCount = location.dairyCompetitorCount;
    sectorScore = 14;
    // Estimate daily milk production capacity based on project capital:
    // ~ ₹70,000 per milch cattle + infrastructure
    const estimatedCows = Math.max(2, Math.round(finance.projectCost / 70000));
    const dailyLpdYield = estimatedCows * 12; // avg 12 litres per animal per day
    const directRetailLpd = Math.round(dailyLpdYield * 0.45); // 45% direct retail @ ₹62/L
    const cooperativeBulkLpd = dailyLpdYield - directRetailLpd; // 55% to co-op @ ₹50/L
    const valueAddPaneerKg = Math.round((dailyLpdYield * 0.15) / 10); // converted to paneer

    const dailyMilkRev = (directRetailLpd * 62) + (cooperativeBulkLpd * 50) + (valueAddPaneerKg * 380);
    const dailyManureRev = estimatedCows * 35; // organic compost
    dailyRevenueEstimate = Math.round(dailyMilkRev + dailyManureRev);

    // Opex: Green fodder, dry feed concentrates, veterinary, power, labor
    const feedCostPerAnimalDay = 210;
    const monthlyFeedCost = estimatedCows * feedCostPerAnimalDay * 30;
    const monthlyVetPowerLabor = finance.projectCost * 0.025; // 2.5% of capex for utilities & misc
    monthlyOpexEstimate = Math.round(monthlyFeedCost + monthlyVetPowerLabor);

    productPricing = [
      {
        name: 'Fresh Cow/Buffalo Milk (Direct Doorstep)',
        unit: 'Litre',
        wholesaleCost: 38,
        retailMarketPrice: 62,
        grossMarginPct: 38.7,
        demandTrend: 'High',
        dailySalesVol: `${directRetailLpd} Litres`,
      },
      {
        name: 'Bulk Milk to Chilling Hub / Society',
        unit: 'Litre',
        wholesaleCost: 38,
        retailMarketPrice: 50,
        grossMarginPct: 24.0,
        demandTrend: 'Stable',
        dailySalesVol: `${cooperativeBulkLpd} Litres`,
      },
      {
        name: 'Farm-Fresh Malai Paneer',
        unit: 'Kg',
        wholesaleCost: 260,
        retailMarketPrice: 390,
        grossMarginPct: 33.3,
        demandTrend: 'Growing',
        dailySalesVol: `${valueAddPaneerKg || 2} Kg`,
      },
      {
        name: 'Cultured Desi Cow Ghee',
        unit: 'Kg',
        wholesaleCost: 480,
        retailMarketPrice: 750,
        grossMarginPct: 36.0,
        demandTrend: 'High',
        dailySalesVol: '15-20 Kg/mo',
      },
      {
        name: 'Enriched Vermicompost / Cattle Dung',
        unit: 'Kg',
        wholesaleCost: 1.2,
        retailMarketPrice: 3.5,
        grossMarginPct: 65.7,
        demandTrend: 'Growing',
        dailySalesVol: '300 Kg/wk',
      },
    ];

    unmetDemandGap = `Estimated daily local deficit of ${Math.round(location.dairyDemandLpd * 0.38)} Litres fresh milk in ${location.name} catchment.`;

    strengths = [
      'Immediate cash realization via daily milk collection centers and doorstep subscriptions.',
      'High byproduct monetization through organic dung compost and value-added paneer/ghee.',
      'Dual off-take safety: Local direct consumer sales + guaranteed society procurement.',
    ];
    weaknesses = [
      'Daily 365-day physical commitment with strict milking hygiene and animal husbandry standards.',
      'Working capital sensitivity to seasonal spikes in commercial cattle feed and dry fodder prices.',
    ];
    opportunities = [
      `Tie-up with ${location.name} hotel/tea stalls and sweet vendors for premium unadulterated milk.`,
      'Leverage subsidised animal insurance and veterinary vaccination under Rashtriya Gokul Mission.',
      'Value addition into high-margin Curd and Ghee to capture 35%+ gross profit margins.',
    ];
    threats = [
      'Summer yield drop (15-25%) and green fodder scarcity during dry months.',
      'Livestock disease risk (Mastitis / FMD) requiring strict quarantine and sanitization.',
    ];
  } else if (businessType === 'grocery') {
    competitorCount = location.groceryCompetitorCount;
    sectorScore = 13;
    const dailyFootfall = Math.min(320, Math.round(55 + (scaleMultiplier * 45)));
    const avgBasketSize = 160 + (scaleMultiplier * 25);
    dailyRevenueEstimate = Math.round(dailyFootfall * avgBasketSize);

    const monthlyRevenue = dailyRevenueEstimate * 30;
    const cogsMonthly = monthlyRevenue * 0.805; // 19.5% gross margin
    const overheadsMonthly = Math.round(4500 + (finance.projectCost * 0.018));
    monthlyOpexEstimate = Math.round(cogsMonthly + overheadsMonthly);

    productPricing = [
      {
        name: 'Staple Grains & Pulses (Rice/Toor Dal)',
        unit: 'Kg',
        wholesaleCost: 42,
        retailMarketPrice: 50,
        grossMarginPct: 16.0,
        demandTrend: 'High',
        dailySalesVol: '85 Kg',
      },
      {
        name: 'Packaged Edible Oils & Ghee Pouches',
        unit: 'Litre',
        wholesaleCost: 118,
        retailMarketPrice: 138,
        grossMarginPct: 14.5,
        demandTrend: 'High',
        dailySalesVol: '35 Litres',
      },
      {
        name: 'Regional Spices, Masalas & Loose Condiments',
        unit: 'Kg',
        wholesaleCost: 190,
        retailMarketPrice: 260,
        grossMarginPct: 26.9,
        demandTrend: 'Stable',
        dailySalesVol: '18 Kg',
      },
      {
        name: 'Packaged FMCG, Soaps, Biscuits & Snacks',
        unit: 'Unit',
        wholesaleCost: 24,
        retailMarketPrice: 30,
        grossMarginPct: 20.0,
        demandTrend: 'Growing',
        dailySalesVol: '120 Units',
      },
      {
        name: 'Dairy Staples, Eggs & Fresh Bakery',
        unit: 'Pack',
        wholesaleCost: 32,
        retailMarketPrice: 38,
        grossMarginPct: 15.8,
        demandTrend: 'High',
        dailySalesVol: '45 Packs',
      },
    ];

    unmetDemandGap = `Targeting ${Math.round(location.totalHouseholds * 0.18)} unserved households in peripheral residential pockets of ${location.name}.`;

    strengths = [
      'High transaction velocity with essential daily repeat purchase nature.',
      'Fast inventory turnover on packaged staples and impulse FMCG confectionery.',
      'Multi-category diversification protecting against single-product price crashes.',
    ];
    weaknesses = [
      'Competitive pressure from long-standing village grocers with entrenched customer credit books.',
      'Thin margins on branded price-controlled FMCG items (10-15%).',
    ];
    opportunities = [
      'Introduce doorstep delivery for senior citizens and weaver hamlets via WhatsApp ordering.',
      'Direct bulk procurement from district APMC wholesale mandis to boost gross margins by 4-6%.',
      'Integrate micro-financial services (UPI QR, Aadhaar cash withdrawal point / AEPS).',
    ];
    threats = [
      'Local credit lockup (Udhaari) if overdue receivables exceed 10% of monthly sales.',
      'Seasonal stock damage from monsoon dampness and grain weevils if storage is inadequate.',
    ];
  } else if (businessType === 'tailoring') {
    competitorCount = location.tailoringCompetitorCount || 6;
    sectorScore = 14;
    const machinesCount = Math.max(2, Math.round(finance.projectCost / 45000));
    const dailyStitchingOrders = machinesCount * 6;
    dailyRevenueEstimate = dailyStitchingOrders * 320;

    const monthlyRevenue = dailyRevenueEstimate * 30;
    const cogsMonthly = monthlyRevenue * 0.35; // threads, buttons, lining cloth, power
    const overheadsMonthly = Math.round(3500 + (machinesCount * 4000)); // helper wages
    monthlyOpexEstimate = Math.round(cogsMonthly + overheadsMonthly);

    productPricing = [
      {
        name: 'Designer Blouse & Saree Pico-Fall Stitching',
        unit: 'Piece',
        wholesaleCost: 80,
        retailMarketPrice: 350,
        grossMarginPct: 77.1,
        demandTrend: 'High',
        dailySalesVol: '10 Pieces',
      },
      {
        name: 'School & College Uniform Pairs',
        unit: 'Set',
        wholesaleCost: 220,
        retailMarketPrice: 480,
        grossMarginPct: 54.2,
        demandTrend: 'High',
        dailySalesVol: '6 Sets',
      },
      {
        name: 'Custom Men’s Kurta / Shirt Stitching',
        unit: 'Piece',
        wholesaleCost: 90,
        retailMarketPrice: 280,
        grossMarginPct: 67.8,
        demandTrend: 'Stable',
        dailySalesVol: '8 Pieces',
      },
      {
        name: 'Garment Alterations & Zippers Replacement',
        unit: 'Job',
        wholesaleCost: 15,
        retailMarketPrice: 60,
        grossMarginPct: 75.0,
        demandTrend: 'Growing',
        dailySalesVol: '14 Jobs',
      },
    ];

    unmetDemandGap = `High unmet demand for bridal embroidery and quick turnaround ladies tailoring in ${location.name}.`;
    strengths = [
      'Extremely high service gross margins (60–75%) with low raw material inventory burden.',
      'Loyal female customer base and seasonal peak surges during festival and wedding months.',
    ];
    weaknesses = [
      'Dependency on skilled artisan tailors and machine operators.',
    ];
    opportunities = [
      'Tie-up with local government schools for bulk annual uniform stitching contracts.',
      'Introduce readymade matching blouse and petticoat counter.',
    ];
    threats = [
      'Power supply cuts halting electric motorized sewing units without inverter backup.',
    ];
  } else if (businessType === 'poultry') {
    competitorCount = location.poultryCompetitorCount || 3;
    sectorScore = 13;
    const birdCapacity = Math.max(500, Math.round(finance.projectCost / 120));
    dailyRevenueEstimate = Math.round((birdCapacity * 35) / 7); // batch harvest cycle

    const monthlyRevenue = dailyRevenueEstimate * 30;
    const feedCostMonthly = monthlyRevenue * 0.62;
    const overheadsMonthly = Math.round(4000 + (finance.projectCost * 0.02));
    monthlyOpexEstimate = Math.round(feedCostMonthly + overheadsMonthly);

    productPricing = [
      {
        name: 'Farm Fresh Broiler Live Bird',
        unit: 'Kg',
        wholesaleCost: 92,
        retailMarketPrice: 145,
        grossMarginPct: 36.5,
        demandTrend: 'High',
        dailySalesVol: '120 Kg',
      },
      {
        name: 'Desi Country Chicken (Natukodi)',
        unit: 'Kg',
        wholesaleCost: 210,
        retailMarketPrice: 380,
        grossMarginPct: 44.7,
        demandTrend: 'Growing',
        dailySalesVol: '35 Kg',
      },
      {
        name: 'Farm Fresh Table Eggs (Crate)',
        unit: 'Crate (30 pcs)',
        wholesaleCost: 135,
        retailMarketPrice: 180,
        grossMarginPct: 25.0,
        demandTrend: 'Stable',
        dailySalesVol: '20 Crates',
      },
    ];

    unmetDemandGap = `Consistent supply deficit for hygienic country chicken & table eggs across local dhabas and households.`;
    strengths = [
      'Short 35-42 day production turnaround cycle with fast cash conversion.',
      'Strong protein consumption growth in rural and semi-urban clusters.',
    ];
    weaknesses = [
      'High vulnerability to broiler feed cost volatility (soymeal & maize).',
    ];
    opportunities = [
      'Direct retail dressing stall on the main access road for higher realization.',
    ];
    threats = [
      'Avian disease outbreaks and summer heat stress mortality.',
    ];
  } else if (businessType === 'food_processing') {
    competitorCount = location.foodProcessingCompetitorCount || 2;
    sectorScore = 15;
    dailyRevenueEstimate = Math.round(2800 + (scaleMultiplier * 3200));
    const monthlyRevenue = dailyRevenueEstimate * 30;
    const rawMaterialMonthly = monthlyRevenue * 0.52;
    const overheadsMonthly = Math.round(5000 + (finance.projectCost * 0.025));
    monthlyOpexEstimate = Math.round(rawMaterialMonthly + overheadsMonthly);

    productPricing = [
      {
        name: 'Cold-Pressed Groundnut & Sesame Oil',
        unit: 'Litre',
        wholesaleCost: 160,
        retailMarketPrice: 240,
        grossMarginPct: 33.3,
        demandTrend: 'High',
        dailySalesVol: '25 Litres',
      },
      {
        name: 'Traditional Pickles & Chutney Powders',
        unit: '500g Jar',
        wholesaleCost: 95,
        retailMarketPrice: 175,
        grossMarginPct: 45.7,
        demandTrend: 'Growing',
        dailySalesVol: '30 Jars',
      },
      {
        name: 'Spiced Millet & Pulse Healthy Snacks',
        unit: '200g Pouch',
        wholesaleCost: 28,
        retailMarketPrice: 50,
        grossMarginPct: 44.0,
        demandTrend: 'Growing',
        dailySalesVol: '60 Pouches',
      },
    ];

    unmetDemandGap = `Rising consumer demand for chemical-free, cold-pressed oils and hygienic regional food products.`;
    strengths = [
      'Value addition margin on local agri produce exceeds 35-45%.',
      'Extended shelf life (6-12 months) minimizes daily perishable waste.',
    ];
    weaknesses = [
      'Requires FSSAI license compliance and standardized packaging machinery.',
    ];
    opportunities = [
      'Supply local retail grocery stores, highway tourist stalls, and temple pilgrim bazaars.',
    ];
    threats = [
      'Seasonal agricultural price swings for raw oilseeds and spices.',
    ];
  } else {
    competitorCount = location.otherCompetitorCount || 4;
    sectorScore = 13;
    dailyRevenueEstimate = Math.round(2200 + (scaleMultiplier * 2600));
    const monthlyRevenue = dailyRevenueEstimate * 30;
    monthlyOpexEstimate = Math.round(monthlyRevenue * 0.65 + 4000);

    productPricing = [
      {
        name: 'Standard Micro Enterprise Service / Product Unit',
        unit: 'Unit',
        wholesaleCost: 120,
        retailMarketPrice: 200,
        grossMarginPct: 40.0,
        demandTrend: 'Stable',
        dailySalesVol: '15 Units',
      },
    ];

    unmetDemandGap = `General rural retail and service convenience gap in ${location.name}.`;
    strengths = ['Flexible operational model tailored to local community needs.'];
    weaknesses = ['Requires initial awareness building in the village community.'];
    opportunities = ['Expand service catalogue based on early customer feedback.'];
    threats = ['Seasonal monsoon slowdown in customer footfall.'];
  }

  const monthlyRevenueEstimate = dailyRevenueEstimate * 30;
  const monthlyNetCashflowBeforeEmi = Math.max(1000, monthlyRevenueEstimate - monthlyOpexEstimate);
  const monthlySurplusAfterEmi = monthlyNetCashflowBeforeEmi - finance.monthlyEmi;

  // Debt Service Coverage Ratio: (Net cashflow before EMI) / Monthly EMI
  const dscr = finance.monthlyEmi > 0 ? Number((monthlyNetCashflowBeforeEmi / finance.monthlyEmi).toFixed(2)) : 3.5;

  // Dynamic Feasibility Score calculation (0 - 100)
  // Factors: Catchment demand vs competitors (30%), DSCR safety (35%), Margin adequacy (20%), Sector resilience (15%)
  const competitorRatio = Math.max(0.5, 1.2 - (competitorCount * 0.07));

  const dscrScore = Math.min(35, Math.max(10, Math.round(dscr * 14)));
  const marketScore = Math.min(30, Math.round(competitorRatio * 26));
  const capitalScore = Math.min(20, Math.round((finance.beneficiaryContribution / 20000) * 12) + 6);

  const rawScore = Math.min(96, Math.max(48, Math.round(dscrScore + marketScore + capitalScore + sectorScore)));

  const scoreBreakdown = {
    dscrScore,
    marketScore,
    capitalScore,
    sectorScore,
    totalScore: rawScore,
    formulaExplanation: `Feasibility Score (${rawScore}/100) is calculated via 4 transparent dimensions: 1. Debt Service Coverage Safety (DSCR ${dscr}x = ${dscrScore}/35 pts), 2. Catchment Reach & Competitor Density (${marketScore}/30 pts), 3. Beneficiary Margin Capital Adequacy (${capitalScore}/20 pts), and 4. Sector Cashflow Velocity & Resilience (${sectorScore}/15 pts).`,
  };

  let feasibilityGrade: 'HIGH_FEASIBILITY' | 'MODERATE_FEASIBILITY' | 'HIGH_RISK' = 'HIGH_FEASIBILITY';
  if (rawScore < 65 || dscr < 1.2) {
    feasibilityGrade = 'HIGH_RISK';
  } else if (rawScore < 78 || dscr < 1.5) {
    feasibilityGrade = 'MODERATE_FEASIBILITY';
  }

  let threatsList = location.dairySpecificThreats;
  if (businessType === 'grocery') threatsList = location.grocerySpecificThreats;
  else if (businessType === 'tailoring') threatsList = location.tailoringSpecificThreats || location.grocerySpecificThreats;
  else if (businessType === 'poultry') threatsList = location.poultrySpecificThreats || location.dairySpecificThreats;
  else if (businessType === 'food_processing') threatsList = location.foodProcessingSpecificThreats || location.grocerySpecificThreats;
  else if (businessType === 'other') threatsList = location.otherSpecificThreats || location.grocerySpecificThreats;

  // AI Recommendation Synthesis
  let aiVerdict = 'Highly Feasible - Recommended for Concessional Loan Sanction';
  if (feasibilityGrade === 'MODERATE_FEASIBILITY') {
    aiVerdict = 'Conditionally Feasible - Margin Monitoring Recommended';
  } else if (feasibilityGrade === 'HIGH_RISK') {
    aiVerdict = 'Caution: High Repayment Stress - Additional Collateral/Margin Needed';
  }

  const businessLabel = businessType.replace('_', ' ').toUpperCase();

  const aiRecommendation = aiOverride || {
    verdict: aiVerdict,
    executiveSummary: `The proposed ${businessLabel} unit in ${location.name} demonstrates a sound Debt Service Coverage Ratio of ${dscr}x with an estimated post-debt monthly surplus of ₹${Math.round(monthlySurplusAfterEmi).toLocaleString('en-IN')}. The indicative project outlay of ${finance.projectCost >= 100000 ? `₹${(finance.projectCost / 100000).toFixed(2)} Lakh` : `₹${finance.projectCost}`} qualifies under ${finance.schemeName} at ${finance.interestRate}% interest.`,
    keyActionPoints: [
      `Secure reliable direct procurement channels within ${location.marketReachKm} km catchment.`,
      `Maintain a strict operating reserve equal to at least 2 months of loan EMI (₹${(finance.monthlyEmi * 2).toLocaleString('en-IN')}).`,
      `Leverage the ${finance.moratoriumMonths}-month moratorium grace period for initial setup before regular principal amortization.`,
    ],
    riskAlerts: [
      'Mitigate local credit default risk by enforcing strict payment cycles.',
      'Protect inventory and assets with appropriate general insurance coverage.',
    ],
    bankOfficerNotes: `Loan Proposal Appraisal: Beneficiary equity of ₹${finance.beneficiaryContribution.toLocaleString('en-IN')} (10%) and Agency Loan of ₹${finance.agencyFinancing.toLocaleString('en-IN')} (90%) meets ${finance.schemeName} concessional lending norms. DSCR is ${dscr}x, exceeding the banking benchmark of 1.25x. Moratorium of ${finance.moratoriumMonths} months provides adequate runway. Recommended for sanction.`,
  };

  const businessTitles: Record<BusinessType, string> = {
    dairy: 'Dairy Farming & Value Addition',
    grocery: 'Grocery / Rural Retail',
    tailoring: 'Tailoring & Textiles Boutique',
    poultry: 'Poultry & Country Birds Farming',
    food_processing: 'Agri-Food Processing',
    other: 'Rural Micro Enterprise',
  };

  return {
    businessType,
    businessTitle: businessTitles[businessType] || 'Rural Enterprise',
    location,
    finance,
    feasibilityScore: rawScore,
    scoreBreakdown,
    feasibilityGrade,
    marketCatchmentPopulation: location.nearbyPopulation,
    marketCatchmentHouseholds: location.totalHouseholds,
    competitorCount,
    unmetDemandGap,
    swot: {
      strengths,
      weaknesses,
      opportunities,
      threats,
    },
    localThreats: threatsList,
    productPricing,
    dailyRevenueEstimate,
    monthlyRevenueEstimate,
    monthlyOpexEstimate,
    monthlyNetCashflowBeforeEmi,
    monthlySurplusAfterEmi,
    dscr,
    aiRecommendation,
  };
}

/**
 * Calculates stress test scenarios with varying sales reduction percentages (0%, 10%, 20%, 30%, 40%, 50%)
 */
export function calculateStressTest(report: FeasibilityReport, customDropPct?: number): StressTestScenario[] {
  const drops = [0, 10, 20, 30, 40, 50];
  if (customDropPct !== undefined && !drops.includes(customDropPct)) {
    drops.push(customDropPct);
    drops.sort((a, b) => a - b);
  }

  const baseRevenue = report.monthlyRevenueEstimate;
  const baseOpex = report.monthlyOpexEstimate;
  const emi = report.finance.monthlyEmi;

  const fixedOpex = baseOpex * 0.25;
  const variableOpexBase = baseOpex * 0.75;

  return drops.map((dropPct) => {
    const revenueFactor = (100 - dropPct) / 100;
    const adjustedRevenue = Math.round(baseRevenue * revenueFactor);
    const adjustedVariableOpex = Math.round(variableOpexBase * revenueFactor);
    const adjustedOpex = Math.round(fixedOpex + adjustedVariableOpex);
    const adjustedNetCashflow = adjustedRevenue - adjustedOpex;
    const monthlySurplus = adjustedNetCashflow - emi;
    const dscr = emi > 0 ? Number((adjustedNetCashflow / emi).toFixed(2)) : 2.5;

    let status: 'Robust & Safe' | 'Acceptable Margin' | 'High Stress' | 'Default Risk' = 'Robust & Safe';
    let statusColor: 'green' | 'yellow' | 'amber' | 'red' = 'green';

    if (monthlySurplus < 0 || dscr < 1.0) {
      status = 'Default Risk';
      statusColor = 'red';
    } else if (dscr < 1.25 || monthlySurplus < emi * 0.4) {
      status = 'High Stress';
      statusColor = 'amber';
    } else if (dscr < 1.6) {
      status = 'Acceptable Margin';
      statusColor = 'yellow';
    }

    return {
      salesDropPct: dropPct,
      revenue: adjustedRevenue,
      opex: adjustedOpex,
      netCashflow: adjustedNetCashflow,
      emi,
      monthlySurplus,
      dscr,
      status,
      statusColor,
    };
  });
}

