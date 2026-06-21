import React, { useState } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  Legend, CartesianGrid 
} from 'recharts';
import { 
  Sparkles, TrendingUp, HelpCircle, Loader2, RefreshCw, 
  ChevronRight, AlertTriangle, PlayCircle, Coins, Heart
} from 'lucide-react';
import { ExecutiveMetrics, ForecastPoint } from '../types';
import { generateForecastingPoints } from '../data/mockData';

interface ForecastingViewProps {
  metrics: ExecutiveMetrics;
}

export default function ForecastingView({ metrics }: ForecastingViewProps) {
  const [seasonalFactor, setSeasonalFactor] = useState<number>(5); // baseline growth multiplier %
  const [isExplaining, setIsExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  // Re-generate forecasting points dynamically based on seasonal factor slider
  const computeCustomForecasts = (): ForecastPoint[] => {
    const currentBasis = metrics.totalRevenue / 6;
    const points: ForecastPoint[] = [];
    
    // Historical 4 months
    points.push({ date: 'Feb', actual: currentBasis * 0.82, predicted: currentBasis * 0.82, optimistic: currentBasis * 0.82, conservative: currentBasis * 0.82 });
    points.push({ date: 'Mar', actual: currentBasis * 0.90, predicted: currentBasis * 0.90, optimistic: currentBasis * 0.90, conservative: currentBasis * 0.90 });
    points.push({ date: 'Apr', actual: currentBasis * 1.02, predicted: currentBasis * 1.02, optimistic: currentBasis * 1.02, conservative: currentBasis * 1.02 });
    points.push({ date: 'May', actual: currentBasis, predicted: currentBasis, optimistic: currentBasis, conservative: currentBasis });

    const multiplier = 1 + (seasonalFactor / 100);
    const predictiveMonths = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    
    let prevVal = currentBasis;
    predictiveMonths.forEach((m) => {
      const forecasted = prevVal * multiplier;
      // Add a seasonal swing factor for Sep and Nov
      const seasonalShift = (m === 'Sep' || m === 'Nov') ? 1.15 : 1.01;
      const predictedValue = Math.round(forecasted * seasonalShift);
      const optimistic = Math.round(predictedValue * 1.15);
      const conservative = Math.round(predictedValue * 0.85);

      points.push({
        date: m,
        actual: null,
        predicted: predictedValue,
        optimistic,
        conservative
      });

      prevVal = predictedValue;
    });

    return points;
  };

  const activePoints = computeCustomForecasts();

  const fetchAIExplanation = async () => {
    setIsExplaining(true);
    try {
      const response = await fetch('/api/gemini/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          forecastPoints: activePoints,
          metrics 
        })
      });
      const data = await response.json();
      setAiExplanation(data.analysis);
    } catch (error) {
      console.error(error);
      setAiExplanation("Using fallback predictive brief:\n\n* Compounding trajectory has positive outlooks.\n* September is marked as an enterprise buying peak.\n* Retain a cash runway matching conservative variance to prevent churn risks.");
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      {/* Header section with parameters settings */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-semibold text-white tracking-tight flex items-center gap-2">
            🔮 Multi-Scenario Forecasting Center
          </h2>
          <p className="text-xs text-gray-400">Map future cash balances, demand peaks, and strategic runway scenarios under varying seasonal configurations.</p>
        </div>

        {/* Dynamic Simulation Controls (Stripe inspired slider) */}
        <div className="flex items-center gap-4 bg-gray-950/60 p-3 rounded-xl border border-white/[0.05] text-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 font-mono block">Baseline Compounding Multiplier</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="2"
                max="12"
                value={seasonalFactor}
                onChange={(e) => {
                  setSeasonalFactor(Number(e.target.value));
                  setAiExplanation(null); // Clear staled explanations
                }}
                className="w-24 accent-cyan-500 cursor-pointer h-1.5 rounded-lg bg-gray-800"
              />
              <span className="font-mono font-bold text-white">+{seasonalFactor}% MoM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main forecasting chart */}
      <div className="space-y-5 animate-slide-up">
        <div className="flex justify-between items-center text-xs">
          <h3 className="text-sm font-display font-bold text-gray-300 uppercase tracking-widest">Runway Simulations Curve</h3>
          <div className="flex gap-4 font-mono font-bold text-[10px] uppercase">
            <span className="text-blue-400">● Actuals</span>
            <span className="text-cyan-300">● central prediction</span>
            <span className="text-emerald-400">▲ optimistic ceiling (+15%)</span>
            <span className="text-rose-400">▼ Conservative floor (-15%)</span>
          </div>
        </div>

        {/* Recharts Area for forecasting risk bands */}
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activePoints} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOptimistic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConservative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickFormatter={(v) => `$${v >= 1000 ? (v / 1000) + 'k' : v}`} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="optimistic" stroke="#10b981" strokeWidth={1} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorOptimistic)" name="Optimistic Ceiling" />
              <Area type="monotone" dataKey="conservative" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorConservative)" name="Conservative Floor" />
              <Area type="monotone" dataKey="predicted" stroke="#06b6d4" strokeWidth={2} fillOpacity={0.5} fill="url(#colorPredicted)" name="Central Scenario" />
              <Area type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={3} fill="none" name="Actual Closed Spend" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI forecast brief section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch border-t border-white/[0.05] pt-6">
        
        {/* Playbook scenario choices */}
        <div className="lg:col-span-4 space-y-4">
          <h4 className="text-xs uppercase font-bold text-gray-400 font-mono tracking-wider">Playbook Risk Diagnostics</h4>
          <div className="space-y-3 font-mono text-[11px]">
            <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-emerald-300">
              <span className="font-bold block">Optimistic case catalyst</span>
              High enterprise API integrations across European cohorts scales MRR by 1.15x.
            </div>
            <div className="p-3 bg-rose-500/5 rounded-xl border border-rose-500/10 text-rose-300">
              <span className="font-bold block">Conservative Case exposure</span>
              Google Ads CPC bloating increases CAC by 18%, shrinking marketing conversion rates.
            </div>
          </div>
        </div>

        {/* Gemini Explanation Brief */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="flex justify-between items-center bg-gray-950/40 p-4 rounded-xl border border-white/[0.04]">
            <div>
              <h4 className="text-xs font-display font-medium text-white flex items-center gap-1.5 text-glow">
                <Sparkles className="h-4 w-4 text-cyan-400" /> AI Forecast Strategic Briefing
              </h4>
              <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                Generates a professional risks and peaks audit of this seasonal curve parameters using Gemini.
              </p>
            </div>
            
            <button
              onClick={fetchAIExplanation}
              disabled={isExplaining}
              id="forecast_explain_btn"
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isExplaining ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Analyzing Curves...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Explain Runway
                </>
              )}
            </button>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-gray-950/60 border border-white/[0.04] flex-1 text-xs text-gray-300 leading-relaxed overflow-y-auto max-h-[140px] scrollbar-thin">
            {aiExplanation ? (
              <div className="whitespace-pre-wrap font-sans space-y-2">
                {aiExplanation}
              </div>
            ) : (
              <p className="text-gray-500 italic text-center py-6">
                Scenario briefing uncompiled. Run "Explain Runway" to generate real-time volatility calculations.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
