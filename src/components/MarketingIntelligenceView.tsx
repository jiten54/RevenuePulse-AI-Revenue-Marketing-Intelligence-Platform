import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Megaphone, ArrowUpRight, BarChart3, TrendingUp, HelpCircle, 
  Sparkles, DollarSign, Target, Activity, Award
} from 'lucide-react';
import { Campaign } from '../types';

interface MarketingIntelligenceViewProps {
  campaigns: Campaign[];
}

export default function MarketingIntelligenceView({ campaigns }: MarketingIntelligenceViewProps) {
  const [selectedChannel, setSelectedChannel] = useState<'All' | 'Google Ads' | 'Meta' | 'LinkedIn' | 'Email' | 'Organic Search' | 'Referral'>('All');

  // Filter campaigns
  const filteredCampaigns = selectedChannel === 'All' 
    ? campaigns 
    : campaigns.filter(c => c.channel === selectedChannel);

  // Totals for general funnel computing
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);

  // Funnel Stage Statistics
  const stages = [
    { name: 'Impressions Awareness', value: totalImpressions, percent: 100, label: 'Unfiltered exposure tracking' },
    { name: 'Click Engagement', value: totalClicks, percent: Math.round((totalClicks / totalImpressions) * 100), label: `CTR: ${((totalClicks / totalImpressions) * 100).toFixed(2)}%` },
    { name: 'Qualified Conversions', value: totalConversions, percent: Math.round((totalConversions / totalClicks) * 100), label: `Conversion: ${((totalConversions / totalClicks) * 100).toFixed(2)}%` },
    { name: 'Closed Revenue Wins', value: `$${totalRevenue.toLocaleString()}`, percent: Math.round((totalRevenue / (totalSpend || 1)) * 100), label: `Gross ROI: ${Math.round((totalRevenue / (totalSpend || 1)) * 100)}%` }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-semibold text-white tracking-tight flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-purple-400" /> Marketing Attribution & ROI
          </h2>
          <p className="text-xs text-gray-400">Review campaigns pipelines, conversion rates, and the corporate acquisition marketing funnel.</p>
        </div>

        {/* Channel quick filter pill */}
        <div className="flex flex-wrap gap-1 bg-gray-950/60 p-1 rounded-xl border border-white/[0.05] text-xs">
          {['All', 'Google Ads', 'Meta', 'LinkedIn', 'Email'].map((channel) => (
            <button
              key={channel}
              onClick={() => setSelectedChannel(channel as any)}
              id={`filter_channel_${channel.replace(' ', '_')}`}
              className={`p-1 px-2.5 rounded-lg font-medium cursor-pointer transition-colors ${
                selectedChannel === channel 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-400 hover:text-white'
              }`}
            >
              {channel}
            </button>
          ))}
        </div>
      </div>

      {/* Main campaigns table and Funnel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Campaign Table (Left / 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-display font-bold text-gray-300 uppercase tracking-wider">Active Strategic Campaigns</h3>
            <span className="text-[10px] font-mono bg-purple-500/10 text-purple-300 p-1 px-2.5 rounded-full font-semibold">
              Live Attribution
            </span>
          </div>

          <div className="bg-gray-950/40 border border-white/[0.04] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead className="bg-white/[0.03] uppercase font-mono text-[10px] text-gray-400 border-b border-white/[0.04]">
                  <tr>
                    <th className="p-3">Campaign Line</th>
                    <th className="p-3 text-right">Spend</th>
                    <th className="p-3 text-right">Revenue</th>
                    <th className="p-3 text-right">Conversion</th>
                    <th className="p-3 text-right">ROI Rank</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredCampaigns.map((c, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01] transition-color font-mono">
                      <td className="p-3 text-white font-sans font-medium">
                        <p className="font-semibold text-gray-200">{c.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">{c.channel}</p>
                      </td>
                      <td className="p-3 text-right text-gray-400">${c.spend.toLocaleString()}</td>
                      <td className="p-3 text-right text-emerald-400 font-semibold">${c.revenue.toLocaleString()}</td>
                      <td className="p-3 text-right text-purple-300">{c.conversions.toLocaleString()} leads</td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          c.roi >= 500 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : c.roi >= 300 
                          ? 'bg-blue-500/10 text-blue-300' 
                          : 'bg-indigo-500/10 text-indigo-300'
                        }`}>
                          {c.roi}% ROI
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Funnel visualization (Right / 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-display font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1">
            <BarChart3 className="h-4 w-4 text-purple-400" /> Conversions Funnel Drops
          </h3>

          <div className="p-5 bg-gray-950/60 rounded-2xl border border-white/[0.04] space-y-5 flex flex-col justify-between">
            {/* Funnel elements stacked like standard BI interfaces */}
            {stages.map((stage, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-gray-300 font-sans font-semibold flex items-center gap-1.5">
                    <span className="p-1 px-1.5 bg-white/5 border border-white/[0.05] rounded text-[9px] text-gray-500">Stage #0{idx+1}</span>
                    {stage.name}
                  </span>
                  <span className="text-purple-300 font-semibold">{stage.percent}%</span>
                </div>
                
                {/* Visual block resizing like physical container size funnel */}
                <div className="relative">
                  <div 
                    className="bg-gradient-to-r from-purple-600/30 to-indigo-600/40 border border-purple-500/25 h-8 rounded-lg flex items-center justify-between px-3 text-xs text-white"
                    style={{ 
                      width: `${100 - (idx * 14)}%`, 
                      marginLeft: `${(idx * 7)}%` 
                    }}
                  >
                    <span className="font-mono text-white text-xs font-bold truncate">
                      {typeof stage.value === 'number' ? stage.value.toLocaleString() : stage.value}
                    </span>
                    <span className="text-[10px] text-purple-200 font-mono italic shrink-0">
                      {stage.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t border-white/[0.04]">
              <p className="text-[10px] text-gray-500 text-center font-mono">
                Attributed standard CPA: ${(totalConversions > 0 ? totalSpend/totalConversions : 0).toFixed(2)} | Target CTR threshold: 2.50%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
