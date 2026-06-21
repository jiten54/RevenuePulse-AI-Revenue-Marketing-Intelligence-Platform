import React, { useState } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, PieChart, Pie, Cell, Legend, CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, Layers, MapPin, Grid, Users, HelpCircle, 
  Coins, Heart, UserPlus, ShieldPlus, ChevronRight, Sparkles
} from 'lucide-react';
import { Transaction, CustomerSegmentMetrics } from '../types';
import { GEOGRAPHIC_REVENUE, CATEGORY_REVENUE } from '../data/mockData';

interface RevenueAnalyticsViewProps {
  transactions: Transaction[];
  customerSegments: CustomerSegmentMetrics[];
}

export default function RevenueAnalyticsView({ transactions, customerSegments }: RevenueAnalyticsViewProps) {
  const [activeTab, setActiveTab] = useState<'trends' | 'products' | 'geography' | 'customers'>('trends');

  // Prune transactions to complete ones for calculations
  const completeTx = transactions.filter(t => t.status === 'Completed');

  // 1. Process Monthly Revenue values
  const processMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dataMap: Record<string, number> = {};
    months.forEach(m => { dataMap[m] = 0; });

    completeTx.forEach(t => {
      const monthShort = new Date(t.date).toLocaleString('default', { month: 'short' });
      if (months.includes(monthShort)) {
        dataMap[monthShort] += t.amount;
      }
    });

    // If some months are zero in current mock distribution, provide realistic baseline
    const fallbackBaselines: Record<string, number> = {
      Jan: 35000, Feb: 48000, Mar: 62000, Apr: 85000, May: 110000, Jun: 125000,
      Jul: 140000, Aug: 130000, Sep: 165000, Oct: 155000, Nov: 198000, Dec: 210000
    };

    return months.map(m => ({
      name: m,
      Revenue: dataMap[m] > 0 ? Math.round(dataMap[m]) : fallbackBaselines[m],
      Subscriptions: Math.round((dataMap[m] > 0 ? dataMap[m] : fallbackBaselines[m]) * 0.72)
    }));
  };

  const monthlyChartData = processMonthlyData();

  // 2. Process Product performance
  const processProductData = () => {
    const prodMap: Record<string, number> = {};
    completeTx.forEach(t => {
      prodMap[t.product] = (prodMap[t.product] || 0) + t.amount;
    });

    const list = Object.entries(prodMap).map(([name, value]) => ({
      name: name.replace('RevenuePulse ', ''),
      Sales: Math.round(value)
    })).sort((a, b) => b.Sales - a.Sales);

    // Fallbacks if data empty
    if (list.length === 0) {
      return [
        { name: 'Enterprise API', Sales: 320000 },
        { name: 'Pro Seats', Sales: 185000 },
        { name: 'Addon Bundle', Sales: 58000 },
        { name: 'Implementation Sprint', Sales: 35000 }
      ];
    }
    return list;
  };

  const productChartData = processProductData();

  // COLORS for pie segments
  const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  // Total calculated product sum
  const totalCategoryRev = CATEGORY_REVENUE.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      {/* Tab Header layout */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-white/[0.05] pb-4">
        <div>
          <h2 className="text-xl font-display font-semibold text-white tracking-tight flex items-center gap-2">
            📊 Executive Analytics Matrix
          </h2>
          <p className="text-xs text-gray-400">Granular visualizations mapping transaction curves, category segments, regions, and CAC retention scores.</p>
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 bg-gray-950/60 rounded-xl border border-white/[0.05]">
          <button
            onClick={() => setActiveTab('trends')}
            id="tab_trends_btn"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'trends' ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5 inline mr-1.5" /> Revenue Trends
          </button>
          <button
            onClick={() => setActiveTab('products')}
            id="tab_products_btn"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'products' ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5 inline mr-1.5" /> Product metrics
          </button>
          <button
            onClick={() => setActiveTab('geography')}
            id="tab_geography_btn"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'geography' ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <MapPin className="h-3.5 w-3.5 inline mr-1.5" /> Regions Map
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            id="tab_customers_btn"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              activeTab === 'customers' ? 'bg-cyan-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="h-3.5 w-3.5 inline mr-1.5" /> Cohort Sectors
          </button>
        </div>
      </div>

      {/* Analytics Content Area */}
      <div className="min-h-[350px]">
        {/* TABS 1: REVENUE TRENDS (AreaChart) */}
        {activeTab === 'trends' && (
          <div className="space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-display font-bold text-gray-300 uppercase tracking-wider">Gross Growth & Recurrency Waves</h3>
              <span className="text-[10px] font-mono font-semibold text-cyan-400 bg-cyan-400/10 p-1 px-2.5 rounded-full">
                SaaS Baseline model
              </span>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickFormatter={(v) => `$${v >= 1000 ? (v / 1000) + 'k' : v}`} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(v) => [`$${Number(v).toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="Revenue" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="Subscriptions" stroke="#8b5cf6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorSubs)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-gray-950/40 rounded-xl border border-white/[0.04]">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">Compounded Growth</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-xl font-display font-semibold text-white">+5.4%</p>
                  <span className="text-[10px] text-emerald-400 font-mono">Monthly standard dev</span>
                </div>
              </div>
              <div className="p-4 bg-gray-950/40 rounded-xl border border-white/[0.04]">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">SaaS Recurrency Ratio</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-xl font-display font-semibold text-white">72.4%</p>
                  <span className="text-[10px] text-gray-400 font-mono">Subscribers weight</span>
                </div>
              </div>
              <div className="p-4 bg-gray-950/40 rounded-xl border border-white/[0.04]">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">Transactional Frequency</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-xl font-display font-semibold text-white">4.3k / mo</p>
                  <span className="text-[10px] text-emerald-400 font-mono">Completed status</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TABS 2: PRODUCT METRICS (BarChart & Treemap list) */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up">
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-display font-bold text-gray-300 uppercase tracking-wider">Gross product Performance index</h3>
              <div className="h-[250px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                      formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Receipts']}
                      labelStyle={{ color: '#94a3b8' }}
                    />
                    <Bar dataKey="Sales" radius={[4, 4, 0, 0]}>
                      {productChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-1" />

            {/* Product Category Treemap/Pie representation */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-sm font-display font-bold text-gray-300 uppercase tracking-wider">Category Contribution</h3>
              <div className="space-y-3.5 mt-2 font-mono">
                {CATEGORY_REVENUE.map((cat, idx) => (
                  <div key={idx} className="p-3 bg-gray-950/40 rounded-xl border border-white/[0.04] space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white font-sans font-medium flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        {cat.category}
                      </span>
                      <span className="text-gray-400 text-[11px]">{Math.round((cat.revenue / totalCategoryRev) * 100)}%</span>
                    </div>
                    {/* Visual bar gauge */}
                    <div className="w-full bg-slate-900 rounded-full h-1">
                      <div 
                        className="h-1 rounded-full" 
                        style={{ 
                          width: `${(cat.revenue / totalCategoryRev) * 100}%`,
                          backgroundColor: COLORS[idx % COLORS.length]
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                      <span>Margin: {cat.margin}%</span>
                      <span>Vol: {cat.transactions.toLocaleString()} Tx</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TABS 3: GEOGRAPHIC MAP & REGIONS */}
        {activeTab === 'geography' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-up">
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-display font-bold text-gray-300 uppercase tracking-wider">Geographic Penetration Index</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Global revenue weights compiled by client host servers. Emerging APAC channels show a blistering **+32% MoM escalation rate**, outpacing standard Western baseline nodes.
              </p>
              
              <div className="bg-gradient-to-tr from-cyan-600/10 to-indigo-600/10 p-5 rounded-xl border border-cyan-500/15 flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-300 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-mono">Dominator Region</p>
                  <p className="text-sm font-semibold text-white font-display mt-0.5">North America ($480,000)</p>
                  <p className="text-[10px] text-emerald-400 mt-1 font-mono">Accounts for 45.9% of active gross revenue</p>
                </div>
              </div>
            </div>

            {/* Simulated Geographic Heatmap Listing */}
            <div className="lg:col-span-7">
              <div className="bg-gray-950/40 border border-white/[0.04] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs min-w-full">
                  <thead className="bg-white/[0.03] uppercase font-mono text-gray-500 text-[10px] border-b border-white/[0.04]">
                    <tr>
                      <th className="p-4">Geographic Node</th>
                      <th className="p-4 text-right">Computed Revenue</th>
                      <th className="p-4 text-right">Active subscribers</th>
                      <th className="p-4 text-right">Growth Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {GEOGRAPHIC_REVENUE.map((geo, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.01] transition-colors font-mono">
                        <td className="p-4 text-white font-sans font-medium flex items-center gap-2">
                          <span className="p-1 px-1.5 rounded bg-gray-900 border border-white/[0.05] text-[9px] text-gray-400">{geo.code}</span>
                          {geo.region}
                        </td>
                        <td className="p-4 text-right text-gray-300">${geo.revenue.toLocaleString()}</td>
                        <td className="p-4 text-right text-gray-400">{geo.activeUsers.toLocaleString()}</td>
                        <td className="p-4 text-right text-emerald-400 font-semibold flex items-center justify-end gap-1">
                          <TrendingUp className="h-3 w-3" /> +{geo.growth}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TABS 4: COHORT SECTORS */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-display font-bold text-gray-300 uppercase tracking-wider">Customer Cohorts Segmentations</h3>
              <span className="text-[10px] text-purple-300 bg-purple-500/10 p-1 px-2 rounded-full font-mono font-semibold">
                Strategic Intelligence
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {customerSegments.map((seg, idx) => (
                <div 
                  key={idx}
                  className="bg-gray-950/40 border border-white/[0.04] p-5 rounded-2xl space-y-4 hover:border-purple-500/25 transition-all duration-300 hover:shadow-xl shadow-purple-500/5 cursor-pointer relative group overflow-hidden"
                >
                  {/* Design backdrop glow */}
                  <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-purple-500/5 group-hover:bg-purple-500/10 rounded-full filter blur-2xl transition-all" />

                  <div className="flex justify-between items-stretch">
                    <div>
                      <h4 className="text-xs uppercase font-bold text-gray-400 font-mono tracking-wider">{seg.name} Contracts</h4>
                      <p className="text-xs text-gray-500 mt-1">{seg.count} Active corporate groups</p>
                    </div>
                    <span className="text-xs font-mono px-2 py-1 bg-white/5 rounded text-white self-start">
                      Seg #0{idx+1}
                    </span>
                  </div>

                  <div className="space-y-3.5 border-t border-white/[0.05] pt-4 font-mono">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Total Contribution</span>
                      <span className="text-white font-bold">${seg.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Cohort Average LTV</span>
                      <span className="text-emerald-400 font-semibold">${seg.avgLtv.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Retention Ratio</span>
                      <span className="text-cyan-400 font-semibold">{seg.retentionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Satisfaction Rating</span>
                      <span className="text-yellow-400 font-semibold">{seg.satisfaction} / 5.0</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center text-[10px] text-purple-400 font-semibold uppercase group-hover:text-purple-300 transition-colors">
                      View customers cohort <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
