import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, ArrowUpRight, ArrowDownRight, Activity, 
  Users, Award, HelpCircle, Sparkles, Send, Loader2, RefreshCw, FileText
} from 'lucide-react';
import { ExecutiveMetrics } from '../types';

interface CommandCenterProps {
  metrics: ExecutiveMetrics;
  onRefreshData: () => void;
  isRealtimeActive: boolean;
  onToggleRealtime: () => void;
  currentFilters: { region: string; segment: string };
}

export default function CommandCenter({ 
  metrics, 
  onRefreshData, 
  isRealtimeActive, 
  onToggleRealtime,
  currentFilters 
}: CommandCenterProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [executiveBrief, setExecutiveBrief] = useState<string | null>(null);
  
  // Custom Chat console state
  const [analystQuery, setAnalystQuery] = useState('');
  const [chatLog, setChatLog] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: "Welcome to RevenuePulse Analyst Console. I have parsed your live datasets. Ask me any tactical question about margin leakages, campaign ROI, or regional expansion strategies." }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const fetchStrategicBrief = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics, currentFilters })
      });
      const data = await response.json();
      setExecutiveBrief(data.insight);
    } catch (error) {
      console.error(error);
      setExecutiveBrief("Error generation. Using pre-baked tactical brief fallback...");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!analystQuery.trim() || isChatLoading) return;

    const userText = analystQuery;
    setChatLog(prev => [...prev, { role: 'user', text: userText }]);
    setAnalystQuery('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          metrics, 
          currentFilters: { ...currentFilters, customQuery: userText } 
        })
      });
      const data = await response.json();
      setChatLog(prev => [...prev, { role: 'assistant', text: data.insight }]);
    } catch (error) {
      setChatLog(prev => [...prev, { role: 'assistant', text: "Apologies, I encountered an issue accessing the executive analyzer pipeline. Please check your credentials or retry shortly." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time sync & control row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-900/40 p-4 rounded-xl border border-white/[0.06] backdrop-blur-md">
        <div>
          <h2 className="text-xl font-display font-semibold tracking-tight text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" /> Executive Command Suite
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Displaying computed financial indexes filtered by <span className="text-cyan-400 font-mono font-medium">{currentFilters.region}</span> and <span className="text-cyan-400 font-mono font-medium">{currentFilters.segment}</span>.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={onToggleRealtime}
            id="toggle_realtime_btn"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 flex items-center gap-2 ${
              isRealtimeActive 
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' 
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full inline-block ${isRealtimeActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`}></span>
            {isRealtimeActive ? 'Real-time Feed: Pulse Live' : 'Enable Live Pulse'}
          </button>
          
          <button 
            onClick={onRefreshData}
            id="refresh_data_btn"
            className="p-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 hover:border-gray-600 cursor-pointer hover:bg-gray-750 transition-colors"
            title="Refresh Financial Calculations"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* TOTAL REVENUE */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-5 rounded-xl relative overflow-hidden glow-blue hover:border-blue-500/30 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <DollarSign className="h-20 w-20 text-blue-500" />
          </div>
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-display">Total Computed Revenue</span>
            <span className="p-1 px-2.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 flex items-center gap-1 font-mono">
              <ArrowUpRight className="h-3 w-3" /> MoM +{metrics.revenueGrowth}%
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-display font-bold text-white tracking-tight text-glow">
              ${metrics.totalRevenue.toLocaleString()}
            </h3>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1 font-mono">
              ARR Run Rate: ${(metrics.kpiPerformance.arr).toLocaleString()}
            </p>
          </div>
        </motion.div>

        {/* MONTHLY RECURRING REVENUE */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-panel p-5 rounded-xl relative overflow-hidden glow-cyan hover:border-cyan-500/30 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Activity className="h-20 w-20 text-cyan-500" />
          </div>
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-display">Monthly Recurring (MRR)</span>
            <span className="p-1 px-2 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 font-mono">
              SaaS Engine
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-display font-bold text-white tracking-tight text-glow">
              ${metrics.mrr.toLocaleString()}
            </h3>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1 font-mono">
              Net Revenue Retention: ~114.2%
            </p>
          </div>
        </motion.div>

        {/* AVERAGE CUSTOMER SPEND */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-5 rounded-xl relative overflow-hidden glow-purple hover:border-purple-500/30 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Users className="h-20 w-20 text-purple-500" />
          </div>
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-display">Contract Value (ACV)</span>
            <span className="p-1 px-2.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-300 font-mono">
              LTV: ${(metrics.kpiPerformance.clv).toLocaleString()}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-display font-bold text-white tracking-tight text-glow">
              ${metrics.avgCustomerSpend.toLocaleString()}
            </h3>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1 font-mono">
              Standard payback cycle: 4.2 months
            </p>
          </div>
        </motion.div>

        {/* REVENUE HEALTH SCORE */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-panel p-5 rounded-xl relative overflow-hidden glow-cyan hover:border-cyan-500/30 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Award className="h-20 w-20 text-cyan-400" />
          </div>
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-display">Revenue Health Index</span>
            <span className="p-1 px-2.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 font-mono">
              Active Audit
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-display font-bold text-white tracking-tight text-glow">
              {metrics.revenueHealthScore}
            </h3>
            <span className="text-xs font-semibold text-gray-400 font-display">/ 100</span>
          </div>
          {/* Custom micro horizontal bar design */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full" 
              style={{ width: `${metrics.revenueHealthScore}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2 font-mono">
            Satis: {metrics.customerSatisfaction}/5.0 (Excellent)
          </p>
        </motion.div>
      </div>

      {/* Advanced Unit Economics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="glass-panel p-5 rounded-xl lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase font-display border-b border-white/[0.05] pb-2 text-glow">
              LTV & CAC Unit Ratios
            </h3>
            <div className="space-y-4 mt-4 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Customer Acquisition Cost (CAC)</span>
                <span className="text-white font-medium">${metrics.kpiPerformance.cac}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Customer Lifetime Value (LTV)</span>
                <span className="text-emerald-400 font-semibold">${metrics.kpiPerformance.clv}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">LTV / CAC Return Power</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 font-bold">
                  {((metrics.kpiPerformance.clv) / (metrics.kpiPerformance.cac || 1)).toFixed(1)}x
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Gross Contract Churn</span>
                <span className="text-purple-400 font-semibold">{metrics.kpiPerformance.churnRate}%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Online Lead Conversion</span>
                <span className="text-cyan-400 font-semibold">{metrics.kpiPerformance.conversionRate}%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.05]">
            <p className="text-xs text-gray-400 leading-relaxed italic">
              "LTV represents ACV multiplied by normal longevity benchmarks, adjusted dynamically according to active regional segment filters."
            </p>
          </div>
        </div>

        {/* Executive Insights Console powered by Gemini */}
        <div className="glass-panel p-5 rounded-xl lg:col-span-3 flex flex-col">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase font-display flex items-center gap-2 text-glow">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" /> AI Strategic Insights
            </h3>
            <button
              onClick={fetchStrategicBrief}
              disabled={isAnalyzing}
              id="analyze_brief_btn"
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3" />
                  Run CRO Audit
                </>
              )}
            </button>
          </div>

          <div className="mt-4 flex-1 bg-gray-950/50 rounded-lg p-4 border border-white/[0.03] overflow-y-auto max-h-[220px] scrollbar-thin">
            {executiveBrief ? (
              <div className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap space-y-2">
                {executiveBrief}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-6 text-gray-500">
                <Sparkles className="h-8 w-8 text-cyan-500/30 mb-2" />
                <p className="text-xs">No active briefcase. Click "Run CRO Audit" to trigger real-time anomalies and expansion playbooks via Gemini-3.5-Flash.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Strategic Conversational Analyst console */}
      <div className="glass-panel p-5 rounded-xl">
        <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase font-display mb-4 flex items-center gap-2 text-glow">
          <FileText className="h-4 w-4 text-purple-400" /> Executive AI Dialog Console
        </h3>

        <div className="bg-gray-950/60 rounded-xl border border-white/[0.04] p-4 flex flex-col h-[280px]">
          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin text-xs">
            {chatLog.map((chat, idx) => (
              <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg p-3 ${
                  chat.role === 'user' 
                  ? 'bg-purple-600/10 text-purple-200 border border-purple-500/20' 
                  : 'bg-gray-900 text-gray-300 border border-white/[0.04]'
                }`}>
                  <p className="font-semibold text-[10px] uppercase tracking-wider text-gray-500 mb-1 font-mono">
                    {chat.role === 'user' ? 'You (CRO)' : 'RevenuePulse Copilot'}
                  </p>
                  <p className="leading-relaxed whitespace-pre-wrap">{chat.text}</p>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-900 rounded-lg p-3 border border-white/[0.04] flex items-center gap-2 text-gray-400 text-xs">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400" />
                  Formulating scenario playbooks...
                </div>
              </div>
            )}
          </div>

          {/* Form Input */}
          <form onSubmit={handleSendQuery} className="mt-4 flex gap-2 border-t border-white/[0.05] pt-3">
            <input
              type="text"
              value={analystQuery}
              onChange={(e) => setAnalystQuery(e.target.value)}
              placeholder="Ask: 'Which channel shows the highest acquisition leakage?' or 'Simulate 2 pricing expansions'..."
              className="flex-1 bg-gray-900 border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-500 font-sans"
            />
            <button
              type="submit"
              id="send_user_query_btn"
              disabled={isChatLoading || !analystQuery.trim()}
              className="px-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
