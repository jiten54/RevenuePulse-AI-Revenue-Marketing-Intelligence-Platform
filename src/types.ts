export interface ExecutiveMetrics {
  totalRevenue: number;
  revenueGrowth: number; // percentage
  mrr: number; // Monthly Recurring Revenue
  avgCustomerSpend: number;
  revenueHealthScore: number; // 0 to 100
  customerSatisfaction: number; // 0 to 5.0
  kpiPerformance: {
    cac: number; // Customer Acquisition Cost
    clv: number; // Customer Lifetime Value
    arr: number; // Annual Recurring Revenue
    churnRate: number; // percentage
    conversionRate: number; // percentage
  };
}

export interface RevenueWrapped {
  bestMonth: { month: string; amount: number };
  highestDay: { date: string; amount: number };
  topProduct: { name: string; sales: number; growth: number };
  topCampaign: { name: string; roi: number; revenue: number };
  fastestSegment: { name: string; growth: number };
  biggestWin: { title: string; detail: string };
  journeyStory?: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  customerName: string;
  product: string;
  category: string;
  region: string;
  segment: 'Enterprise' | 'Mid-Market' | 'SMB';
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface Campaign {
  id: string;
  name: string;
  channel: 'Google Ads' | 'Meta' | 'LinkedIn' | 'Email' | 'Organic Search' | 'Referral';
  spend: number;
  revenue: number;
  conversions: number;
  roi: number; // percentage
  impressions: number;
  clicks: number;
}

export interface PersonalityProfile {
  type: 'Growth Accelerator' | 'Market Dominator' | 'Customer Magnet' | 'Revenue Optimizer' | 'Trend Explorer' | 'Strategic Performer';
  title: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  strategicAdvice: string;
  badgeColor: string; // Tailwind bg/text classes
}

export interface ForecastPoint {
  date: string;
  actual: number | null;
  predicted: number;
  optimistic: number;
  conservative: number;
}

export interface CustomerSegmentMetrics {
  name: string;
  count: number;
  avgLtv: number;
  totalRevenue: number;
  satisfaction: number;
  retentionRate: number;
}

export interface RealtimeEvent {
  id: string;
  customerName: string;
  product: string;
  amount: number;
  timestamp: string;
}
