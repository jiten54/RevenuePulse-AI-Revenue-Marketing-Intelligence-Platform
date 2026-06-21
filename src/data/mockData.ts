import { Transaction, Campaign, ExecutiveMetrics, RevenueWrapped, ForecastPoint, CustomerSegmentMetrics } from '../types';

export const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Summer HyperGrowth Ads', channel: 'Google Ads', spend: 45000, revenue: 185000, conversions: 1250, roi: 311, impressions: 850000, clicks: 34000 },
  { id: '2', name: 'Q2 Enterprise Prospector', channel: 'LinkedIn', spend: 60000, revenue: 320000, conversions: 110, roi: 433, impressions: 320000, clicks: 12800 },
  { id: '3', name: 'Direct Retargeting v4', channel: 'Meta', spend: 25000, revenue: 95000, conversions: 1840, roi: 280, impressions: 1200000, clicks: 48000 },
  { id: '4', name: 'Loyalty Upgrade Loop', channel: 'Email', spend: 5000, revenue: 58000, conversions: 520, roi: 1060, impressions: 95000, clicks: 19000 },
  { id: '5', name: 'Organic SEO Engine Boost', channel: 'Organic Search', spend: 12000, revenue: 84000, conversions: 780, roi: 600, impressions: 450000, clicks: 22000 },
  { id: '6', name: 'Affiliate Network Scale', channel: 'Referral', spend: 18000, revenue: 54000, conversions: 430, roi: 200, impressions: 280000, clicks: 11200 }
];

export const GEOGRAPHIC_REVENUE = [
  { region: 'North America', revenue: 480000, activeUsers: 14500, growth: 24, code: 'NA' },
  { region: 'Europe & UK', revenue: 290000, activeUsers: 8900, growth: 18, code: 'EU' },
  { region: 'Asia-Pacific', revenue: 165000, activeUsers: 5400, growth: 32, code: 'APAC' },
  { region: 'Latin America', revenue: 75000, activeUsers: 3100, growth: 14, code: 'LATAM' },
  { region: 'Middle East & Africa', revenue: 35000, activeUsers: 1200, growth: 8, code: 'MEA' }
];

export const CATEGORY_REVENUE = [
  { category: 'SaaS Subscriptions', revenue: 645000, margin: 88, transactions: 12400 },
  { category: 'API Usage Fees', revenue: 215000, margin: 94, transactions: 43200 },
  { category: 'Professional Services', revenue: 110000, margin: 45, transactions: 150 },
  { category: 'Add-on Licenses', revenue: 75000, margin: 90, transactions: 3500 }
];

// Generates baseline realistic transactions over the last 12 months
export function generateInitialTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const customers = [
    'Acme Corp', 'GlobalTech Industries', 'Vertex Solution Group', 'Nova Retail Systems',
    'Delta Airlines Inc.', 'Infinity Logistics', 'Apex Software', 'Pinnacle Ventures',
    'Starlight Capital', 'Horizon Media', 'BlueCore Robotics', 'Eclipse Digital',
    'Zephyr Apparel', 'Oasis Health', 'Lumina Analytics', 'Solstice AgriTech'
  ];

  const products = [
    { name: 'RevenuePulse Pro Seat', category: 'SaaS Subscriptions', price: 99 },
    { name: 'RevenuePulse Enterprise API', category: 'API Usage Fees', price: 1499 },
    { name: 'Custom Implementation Sprint', category: 'Professional Services', price: 5000 },
    { name: 'Predictive Addon Bundle', category: 'Add-on Licenses', price: 299 }
  ];

  const regions = ['North America', 'Europe & UK', 'Asia-Pacific', 'Latin America'];
  const segments: Array<'Enterprise' | 'Mid-Market' | 'SMB'> = ['Enterprise', 'Mid-Market', 'SMB'];
  const statuses: Array<'Completed' | 'Pending' | 'Failed'> = ['Completed', 'Completed', 'Completed', 'Completed', 'Completed', 'Pending', 'Failed'];

  const now = new Date();
  let idCounter = 1000;

  // Generate around 150 transactions distributed chronologically
  for (let i = 180; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    // 0 to 3 transactions per day
    const count = Math.floor(Math.random() * 3);
    for (let c = 0; c < count; c++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const prod = products[Math.floor(Math.random() * products.length)];
      const region = regions[Math.floor(Math.random() * regions.length)];
      const segment = customer.includes('Corp') || customer.includes('Industries') || customer.includes('Airlines') ? 'Enterprise' : (Math.random() > 0.4 ? 'Mid-Market' : 'SMB');
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      let amount = prod.price;
      if (prod.category === 'API Usage Fees') {
        // dynamic usage
        amount = Math.floor(prod.price * (0.5 + Math.random() * 2));
      }

      transactions.push({
        id: `TX-${idCounter++}`,
        date: date.toISOString().split('T')[0],
        amount,
        customerName: customer,
        product: prod.name,
        category: prod.category,
        region,
        segment,
        status
      });
    }
  }

  return transactions;
}

// Compute executive metrics dynamically from transactions and campaigns
export function calculateExecutiveMetrics(transactions: Transaction[], campaigns: Campaign[]): ExecutiveMetrics {
  const completedTx = transactions.filter(t => t.status === 'Completed');
  const totalRevenue = completedTx.reduce((sum, t) => sum + t.amount, 0);
  
  // Historical context to calculate growth (this dataset vs virtual baseline)
  const revenueGrowth = 42.8; // Baseline mockup growth

  // Calculate MRR from "SaaS Subscriptions" + a portion of API usage
  const saasRevenue = completedTx.filter(t => t.category === 'SaaS Subscriptions').reduce((sum, t) => sum + t.amount, 0);
  const apiRevenue = completedTx.filter(t => t.category === 'API Usage Fees').reduce((sum, t) => sum + t.amount, 0);
  
  // Approximate active MRR
  const mrr = Math.round((saasRevenue / 6) + (apiRevenue / 6) * 0.8) || 84200;

  // Average customer spend
  const uniqueCustomers = new Set(completedTx.map(t => t.customerName));
  const avgCustomerSpend = uniqueCustomers.size > 0 ? Math.round(totalRevenue / uniqueCustomers.size) : 0;

  // Churn/KPI factors
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const cac = totalConversions > 0 ? Math.round(totalSpend / totalConversions) : 85;
  const clv = Math.round(avgCustomerSpend * 8.5) || 5400;
  const arr = mrr * 12;
  const churnRate = 1.8;
  const conversionRate = 3.62;

  // Let's compute a dynamic Revenue Health Score (weighted avg of users, revenue, conversion and low churn)
  const scoreBase = 84 + (revenueGrowth / 10) - (churnRate * 2) + (conversionRate * 1.5);
  const revenueHealthScore = Math.min(100, Math.max(50, Math.round(scoreBase)));

  return {
    totalRevenue,
    revenueGrowth,
    mrr,
    avgCustomerSpend,
    revenueHealthScore,
    customerSatisfaction: 4.85,
    kpiPerformance: {
      cac,
      clv,
      arr,
      churnRate,
      conversionRate
    }
  };
}

export function compileRevenueWrapped(transactions: Transaction[], campaigns: Campaign[]): RevenueWrapped {
  const completedTx = transactions.filter(t => t.status === 'Completed');
  
  // Group by month
  const monthlyMap: Record<string, number> = {};
  completedTx.forEach(t => {
    const month = new Date(t.date).toLocaleString('default', { month: 'long' });
    monthlyMap[month] = (monthlyMap[month] || 0) + t.amount;
  });

  let bestMonthName = 'September';
  let maxMonthAmount = 0;
  Object.entries(monthlyMap).forEach(([m, amt]) => {
    if (amt > maxMonthAmount) {
      maxMonthAmount = amt;
      bestMonthName = m;
    }
  });

  // Group by day
  const dailyMap: Record<string, number> = {};
  completedTx.forEach(t => {
    dailyMap[t.date] = (dailyMap[t.date] || 0) + t.amount;
  });

  let bestDayName = '2026-05-14';
  let maxDayAmount = 0;
  Object.entries(dailyMap).forEach(([d, amt]) => {
    if (amt > maxDayAmount) {
      maxDayAmount = amt;
      bestDayName = d;
    }
  });

  // Top Product
  const prodMap: Record<string, { count: number; rev: number }> = {};
  completedTx.forEach(t => {
    const curr = prodMap[t.product] || { count: 0, rev: 0 };
    prodMap[t.product] = {
      count: curr.count + 1,
      rev: curr.rev + t.amount
    };
  });

  let topProductName = 'RevenuePulse Enterprise API';
  let topProductSales = 0;
  Object.entries(prodMap).forEach(([name, stats]) => {
    if (stats.rev > topProductSales) {
      topProductSales = stats.rev;
      topProductName = name;
    }
  });

  // Top Campaign
  let topCampaign = campaigns[0] || { name: 'Q2 Enterprise Prospector', roi: 433, revenue: 320000 };
  campaigns.forEach(c => {
    if (c.roi > topCampaign.roi) {
      topCampaign = c;
    }
  });

  // Segment Growth Check
  const fastestSegment = { name: 'Enterprise SaaS Scaling', growth: 64 };

  return {
    bestMonth: { month: bestMonthName, amount: Math.round(maxMonthAmount) || 112000 },
    highestDay: { date: bestDayName, amount: Math.round(maxDayAmount) || 14800 },
    topProduct: { name: topProductName, sales: Math.round(topProductSales) || 285000, growth: 58 },
    topCampaign: { name: topCampaign.name, roi: topCampaign.roi, revenue: topCampaign.revenue },
    fastestSegment,
    biggestWin: {
      title: 'Enterprise Momentum Unlock',
      detail: 'Secured critical multi-tenant licenses, scaling recurring channels by 52% in APAC and Europe.'
    },
    journeyStory: "An incredible trajectory marked by sustained, compounded compounding SaaS subscription velocity. March established early dominance, followed by an unprecedented surge in corporate API volume during late spring. Customer intelligence loops stayed tight with feedback scores at top tier metrics of 4.8/5."
  };
}

export function generateForecastingPoints(metrics: ExecutiveMetrics): ForecastPoint[] {
  const currentBasis = metrics.totalRevenue / 6; // monthly average spend base
  const points: ForecastPoint[] = [];
  const baseMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Historical elements (Past 4 months)
  points.push({ date: 'Feb', actual: currentBasis * 0.85, predicted: currentBasis * 0.85, optimistic: currentBasis * 0.85, conservative: currentBasis * 0.85 });
  points.push({ date: 'Mar', actual: currentBasis * 0.92, predicted: currentBasis * 0.92, optimistic: currentBasis * 0.92, conservative: currentBasis * 0.92 });
  points.push({ date: 'Apr', actual: currentBasis * 1.05, predicted: currentBasis * 1.05, optimistic: currentBasis * 1.05, conservative: currentBasis * 1.05 });
  points.push({ date: 'May', actual: currentBasis, predicted: currentBasis, optimistic: currentBasis, conservative: currentBasis });

  const growthMultiplier = 1.05; // 5% base monthly increase

  // Future Predictions (Next 6 months forecasting models)
  let prevVal = currentBasis;
  const predictiveMonths = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  predictiveMonths.forEach((m, idx) => {
    const predictedBase = prevVal * growthMultiplier;
    // adding seasonal variables
    const shift = (m === 'Sep' || m === 'Nov') ? 1.15 : 1.02; 
    const finalPredicted = Math.round(predictedBase * shift);
    const optimistic = Math.round(finalPredicted * 1.12);
    const conservative = Math.round(finalPredicted * 0.88);

    points.push({
      date: m,
      actual: null,
      predicted: finalPredicted,
      optimistic,
      conservative
    });

    prevVal = finalPredicted;
  });

  return points;
}

export function getCustomerSegmentMetrics(transactions: Transaction[]): CustomerSegmentMetrics[] {
  const completedTx = transactions.filter(t => t.status === 'Completed');
  
  const segments: Array<'Enterprise' | 'Mid-Market' | 'SMB'> = ['Enterprise', 'Mid-Market', 'SMB'];
  return segments.map(seg => {
    const segTx = completedTx.filter(t => t.segment === seg);
    const totalRevenue = segTx.reduce((sum, t) => sum + t.amount, 0);
    const count = new Set(segTx.map(t => t.customerName)).size;
    const avgLtv = count > 0 ? Math.round((totalRevenue / count) * 8.5) : 0;
    
    // Customize statistics depending on size
    let retentionRate = 98.4;
    let satisfaction = 4.9;
    if (seg === 'Mid-Market') {
      retentionRate = 92.1;
      satisfaction = 4.75;
    } else if (seg === 'SMB') {
      retentionRate = 86.5;
      satisfaction = 4.6;
    }

    return {
      name: seg,
      count: count || 12,
      avgLtv: avgLtv || 2400,
      totalRevenue: totalRevenue || 140000,
      satisfaction,
      retentionRate
    };
  });
}

export const ACHIEVEMENTS = [
  { id: '1', title: 'Revenue Master', requirement: 'Exceed $100K in SaaS recurring subscription tiers', unlocked: true, icon: 'Award', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  { id: '2', title: 'Growth Champion', requirement: 'Achieve a Month-over-Month acceleration greater than 25%', unlocked: true, icon: 'ArrowUpRight', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  { id: '3', title: 'Forecast Wizard', requirement: 'Align predictive models mapped with low margin of error (< 2.5%)', unlocked: false, icon: 'Sparkles', color: 'text-violet-400 bg-violet-400/10 border-violet-400/20' },
  { id: '4', title: 'Customer Hero', requirement: 'Maintain a customer satisfaction index average of 4.8 stars or higher', unlocked: true, icon: 'Heart', color: 'text-rose-400 bg-rose-400/10 border-rose-400/20' },
  { id: '5', title: 'Analytics Expert', requirement: 'Upload raw transaction datasets successfully through the CSV engine', unlocked: false, icon: 'CheckCircle', color: 'text-sky-400 bg-sky-400/10 border-sky-400/20' }
];

// Mock Business Personalities mapping
export const AI_PERSONALITIES = {
  'Growth Accelerator': {
    type: 'Growth Accelerator',
    title: 'The Growth Accelerator',
    description: 'You prioritize rapid scalability and recurring subscriptions with aggressive conversion plays. Every marketing cent yields maximum recurring contract values.',
    strengths: ['Aggressive CAC-back payout leverage', 'High conversion ratios', 'Strong momentum on early products'],
    weaknesses: ['Vulnerable to high-frequency client churn', 'Potentially bloated CAC averages'],
    strategicAdvice: 'Solidify retention vectors immediately. Set up upgrades mechanisms for Mid-Market cohorts to convert contracts to multi-year locks.',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
  'Market Dominator': {
    type: 'Market Dominator',
    title: 'The Market Dominator',
    description: 'A heavyweight across geographic channels. Enterprise licenses constitute your castle and you aggressively crush local scaling operations.',
    strengths: ['Astronomical Customer Lifetime Value', 'Unbelievable revenue per customer', 'Zero customer anxiety'],
    weaknesses: ['Sales cycles measured in calendar semesters', 'Underperforming self-service channels'],
    strategicAdvice: 'Launch automated professional product onboarding suites to decrease delivery time and unlock client-side expansion speed.',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  }
};

export const MOCK_CSV_TEMPLATE = `date,customerName,amount,product,category,region,segment,status
2026-06-15,Global Dynamics Inc,12500,RevenuePulse Enterprise API,API Usage Fees,North America,Enterprise,Completed
2026-06-16,Sora Ventures,4900,Predictive Addon Bundle,Add-on Licenses,Europe & UK,Mid-Market,Completed
2026-06-17,CloudBase Solutions,9800,RevenuePulse Pro Seat,SaaS Subscriptions,Asia-Pacific,SMB,Completed
2026-06-18,Stripe Capital,15000,RevenuePulse Enterprise API,API Usage Fees,North America,Enterprise,Completed
2026-06-19,Oasis Labs,120,RevenuePulse Pro Seat,SaaS Subscriptions,Latin America,SMB,Completed
2026-06-20,Nova Core,4200,Predictive Addon Bundle,Add-on Licenses,Europe & UK,Mid-Market,Failed`;
