import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, Sparkles, Megaphone, HelpCircle, 
  Award, TrendingUp, FileText, Cpu, Settings, RefreshCw, 
  Heart, Coins, ShieldCheck, Mail, Layers, MapPin, Users, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  generateInitialTransactions, calculateExecutiveMetrics, 
  compileRevenueWrapped, getCustomerSegmentMetrics 
} from './data/mockData';
import { Transaction, ExecutiveMetrics, RevenueWrapped, Campaign, CustomerSegmentMetrics } from './types';
import { INITIAL_CAMPAIGNS } from './data/mockData';

// Import Modular sub-views
import CommandCenter from './components/CommandCenter';
import RevenueWrappedView from './components/RevenueWrappedView';
import PersonalityEngineView from './components/PersonalityEngineView';
import RevenueAnalyticsView from './components/RevenueAnalyticsView';
import MarketingIntelligenceView from './components/MarketingIntelligenceView';
import ForecastingView from './components/ForecastingView';
import AchievementsUploadView from './components/AchievementsUploadView';

export default function App() {
  // Global Transactions ledger state
  const [transactions, setTransactions] = useState<Transaction[]>(() => generateInitialTransactions());
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  
  // Real-time dynamic simulator state
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const [liveNotification, setLiveNotification] = useState<string | null>(null);

  // Active dashboard navigation tab
  const [activeTab, setActiveTab] = useState<'command' | 'wrapped' | 'personality' | 'charts' | 'marketing' | 'forecast' | 'ingestion'>('command');

  // Recalculate metrics reactively
  const computedMetrics = useMemo<ExecutiveMetrics>(() => {
    return calculateExecutiveMetrics(transactions, campaigns);
  }, [transactions, campaigns]);

  const computedWrapped = useMemo<RevenueWrapped>(() => {
    return compileRevenueWrapped(transactions, campaigns);
  }, [transactions, campaigns]);

  const computedCustomerSegments = useMemo<CustomerSegmentMetrics[]>(() => {
    return getCustomerSegmentMetrics(transactions);
  }, [transactions]);

  // Handle live simulated transaction insert loop
  useEffect(() => {
    if (!isRealtimeActive) return;

    const customers = ['Netflix EMEA', 'Snowflake Inc', 'Databricks Group', 'Supabase Corp', 'Framer HQ', 'Vercel CDN', 'OpenAI API Node'];
    const prods = [
      { name: 'RevenuePulse Pro Seat', price: 99, cat: 'SaaS Subscriptions' },
      { name: 'RevenuePulse Enterprise API', price: 1499, cat: 'API Usage Fees' },
      { name: 'Predictive Addon Bundle', price: 299, cat: 'Add-on Licenses' }
    ];
    const regions = ['North America', 'Europe & UK', 'Asia-Pacific', 'Latin America'];

    const interval = setInterval(() => {
      const cust = customers[Math.floor(Math.random() * customers.length)];
      const prod = prods[Math.floor(Math.random() * prods.length)];
      const reg = regions[Math.floor(Math.random() * regions.length)];
      const newTx: Transaction = {
        id: `TX-LIVE-${10000 + Math.floor(Math.random() * 8000)}`,
        date: new Date().toISOString().split('T')[0],
        amount: prod.price,
        customerName: cust,
        product: prod.name,
        category: prod.cat,
        region: reg,
        segment: Math.random() > 0.5 ? 'Enterprise' : 'Mid-Market',
        status: 'Completed'
      };

      setTransactions(prev => [newTx, ...prev]);
      
      // Trigger subtle beautiful overlay confirmation card
      setLiveNotification(`SUCCESSFUL CONTRACT: ${cust} acquired ${prod.name} for $${prod.price}!`);
      setTimeout(() => setLiveNotification(null), 3500);

    }, 4500);

    return () => clearInterval(interval);
  }, [isRealtimeActive]);

  // Filter components arguments config parameters
  const [regionFilter, setRegionFilter] = useState('All');
  const [segmentFilter, setSegmentFilter] = useState('All');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (regionFilter !== 'All' && t.region !== regionFilter) return false;
      if (segmentFilter !== 'All' && t.segment !== segmentFilter) return false;
      return true;
    });
  }, [transactions, regionFilter, segmentFilter]);

  const filteredMetrics = useMemo(() => {
    return calculateExecutiveMetrics(filteredTransactions, campaigns);
  }, [filteredTransactions, campaigns]);

  const handleRefresh = () => {
    setTransactions(generateInitialTransactions());
    setCampaigns(INITIAL_CAMPAIGNS);
    alert('Calculations completely re-initialized and synced with default cloud seed database.');
  };

  const handleImport = (imported: Transaction[]) => {
    setTransactions(prev => [...imported, ...prev]);
  };

  return (
    <div className="premium-gradient-bg min-h-screen pb-16 font-sans relative overflow-hidden">
      
      {/* Decorative backdrop blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none -z-50" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-50" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none -z-50" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Elite Navigation Top-Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 rounded-2xl glass-panel border border-white/[0.08] glow-blue mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-white shadow-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-glow" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-black tracking-tight text-white flex items-center gap-2">
                RevenuePulse <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">AI</span>
              </h1>
              <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Revenue & Marketing Intelligence Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Context Global Filters */}
            <div className="flex gap-2 bg-gray-950/60 p-1 rounded-xl border border-white/[0.05] text-xs w-full sm:w-auto">
              <select 
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="bg-transparent text-gray-300 font-semibold focus:outline-none px-2 cursor-pointer border-r border-white/10"
              >
                <option value="All">All Regions</option>
                <option value="North America">North America</option>
                <option value="Europe & UK">Europe & UK</option>
                <option value="Asia-Pacific">Asia-Pacific</option>
                <option value="Latin America">Latin America</option>
              </select>

              <select 
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value)}
                className="bg-transparent text-gray-300 font-semibold focus:outline-none px-2 cursor-pointer"
              >
                <option value="All">All Segments</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Mid-Market">Mid-Market</option>
                <option value="SMB">SMB</option>
              </select>
            </div>
          </div>
        </header>

        {/* Master Navigation Rails Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-8">
          {[
            { id: 'command', label: 'Command Suite', icon: <Activity className="h-4 w-4" /> },
            { id: 'wrapped', label: 'Revenue Wrapped', icon: <Sparkles className="h-4 w-4 text-amber-400" /> },
            { id: 'personality', label: 'Corporate Profile', icon: <Cpu className="h-4 w-4 text-purple-400" /> },
            { id: 'charts', label: 'Analytics Multi-Tabs', icon: <TrendingUp className="h-4 w-4 text-cyan-400" /> },
            { id: 'marketing', label: 'Marketing Attribution', icon: <Megaphone className="h-4 w-4 text-indigo-400" /> },
            { id: 'forecast', label: 'Forecasting', icon: <FileText className="h-4 w-4 text-rose-400" /> },
            { id: 'ingestion', label: 'Ingestion & Milestones', icon: <Upload className="h-4 w-4 text-emerald-400" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              id={`nav_tab_${item.id}`}
              className={`p-3.5 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === item.id 
                ? 'bg-white/15 border-white/25 text-cyan-300 shadow-md scale-95 backdrop-blur-md' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20 backdrop-blur-md'
              }`}
            >
              {item.icon}
              <span className="font-display font-medium tracking-tight truncate w-full text-center">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic transaction notifications */}
        <AnimatePresence>
          {liveNotification && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-semibold text-center flex items-center justify-center gap-2 glow-cyan"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulseinline-block"></span>
              {liveNotification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Render Modular components inside container */}
        <main className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'command' && (
                <CommandCenter 
                  metrics={filteredMetrics}
                  onRefreshData={handleRefresh}
                  isRealtimeActive={isRealtimeActive}
                  onToggleRealtime={() => setIsRealtimeActive(!isRealtimeActive)}
                  currentFilters={{ region: regionFilter, segment: segmentFilter }}
                />
              )}

              {activeTab === 'wrapped' && (
                <RevenueWrappedView 
                  wrappedData={computedWrapped}
                />
              )}

              {activeTab === 'personality' && (
                <PersonalityEngineView 
                  metrics={filteredMetrics}
                  customerSegments={computedCustomerSegments}
                />
              )}

              {activeTab === 'charts' && (
                <RevenueAnalyticsView 
                  transactions={transactions}
                  customerSegments={computedCustomerSegments}
                />
              )}

              {activeTab === 'marketing' && (
                <MarketingIntelligenceView 
                  campaigns={campaigns}
                />
              )}

              {activeTab === 'forecast' && (
                <ForecastingView 
                  metrics={filteredMetrics}
                />
              )}

              {activeTab === 'ingestion' && (
                <AchievementsUploadView 
                  onImportTransactions={handleImport}
                  transactionsCount={transactions.length}
                  totalRevenue={computedMetrics.totalRevenue}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Decorative footer */}
      <footer className="mt-16 text-center text-[11px] text-gray-500 font-mono tracking-widest uppercase flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6">
        <span>© 2026 REVENUEPULSE AI INC. ALL RIGHTS RESERVED</span>
        <span className="hidden sm:inline">|</span>
        <span>BOARD SECURE SSL TRANSACTION ENGINES STATUS OK</span>
        <span className="hidden sm:inline">|</span>
        <span className="text-cyan-400">AUDITED BY GEMINI AI</span>
      </footer>
    </div>
  );
}
