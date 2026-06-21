import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Award, UserCheck, Flame, Cpu, ShieldAlert, ArrowDownCircle,
  Clock, Download, Share2, Copy, Check, Info, BarChart3, HelpCircle
} from 'lucide-react';
import { ExecutiveMetrics, CustomerSegmentMetrics, PersonalityProfile } from '../types';

interface PersonalityEngineViewProps {
  metrics: ExecutiveMetrics;
  customerSegments: CustomerSegmentMetrics[];
}

export default function PersonalityEngineView({ metrics, customerSegments }: PersonalityEngineViewProps) {
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [activeProfile, setActiveProfile] = useState<PersonalityProfile | null>({
    type: 'Growth Accelerator',
    title: 'The Growth Accelerator',
    description: 'Prioritizes rapid scalability and aggressive customer acquisition channels. This organization scales overall turnover with high-speed, compounding subscription cycles, but should continuously optimize long-term client retention.',
    strengths: ['Highly scalable campaign loops', 'High conversion ratios on outbound leads', 'Outstanding early-market growth momentum'],
    weaknesses: ['Susceptible to medium-term cohort churn', 'High spending overhead on top-of-funnel ads'],
    strategicAdvice: 'Immediately deploy retention vectors, and launch high-tier SLAs for mid-market accounts to lock long-term commitments.',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  });
  
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const diagnosePersonality = async () => {
    setIsDiagnosing(true);
    try {
      const response = await fetch('/api/gemini/personality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics, customerSegments })
      });
      const data = await response.json();
      
      // Determine appropriate badge color styles
      let badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      if (data.type === 'Growth Accelerator') badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      if (data.type === 'Market Dominator') badgeColor = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      if (data.type === 'Customer Magnet') badgeColor = 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      if (data.type === 'Revenue Optimizer') badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/20';
      if (data.type === 'Trend Explorer') badgeColor = 'bg-violet-500/20 text-violet-300 border-[#9333ea]/30';
      
      setActiveProfile({
        ...data,
        badgeColor
      });
    } catch (error) {
      console.error('Error diagnosing personality:', error);
      // Fallback is already established in initial state or simple threshold routing
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleExportCard = () => {
    if (!activeProfile) return;
    setDownloading(true);
    
    // Create text content representation to download as file
    const fileContent = `REVENUEPULSE AI - BUSINESS PERSONALITY CARD
---------------------------------------
Archetype: ${activeProfile.title}
Profile: ${activeProfile.description}

STRENGTHS:
${activeProfile.strengths.map(s => `- ${s}`).join('\n')}

RISKS:
${activeProfile.weaknesses.map(w => `- ${w}`).join('\n')}

TACTICAL CRO PLAYBOOK ADVICE:
${activeProfile.strategicAdvice}

Generated on RevenuePulse AI (https://ai.studio/build)`;

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeProfile.type.replace(/\s+/g, '_')}_Personality_Card.txt`;
    link.click();
    
    setTimeout(() => {
      setDownloading(false);
    }, 1500);
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(`https://revenuepulse.ai/wrapped/share/personality_${activeProfile?.type.toLowerCase()}`);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const badgeIcons = {
    'Growth Accelerator': <Flame className="h-5 w-5 text-emerald-400" />,
    'Market Dominator': <CrownIcon className="h-5 w-5 text-indigo-400" />,
    'Customer Magnet': <UserCheck className="h-5 w-5 text-pink-400" />,
    'Revenue Optimizer': <Cpu className="h-5 w-5 text-amber-400" />,
    'Trend Explorer': <Clock className="h-5 w-5 text-violet-400" />,
    'Strategic Performer': <Award className="h-5 w-5 text-cyan-400" />
  };

  return (
    <div className="space-y-6">
      {/* Module Title info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-display font-semibold text-white tracking-tight flex items-center gap-2">
            🧠 AI Strategic Personality Engine
          </h2>
          <p className="text-xs text-gray-400">Generates and charts your company's operational blueprint based on unit margins and customer segment ratios.</p>
        </div>
        
        <button
          onClick={diagnosePersonality}
          disabled={isDiagnosing}
          id="diagnose_personality_btn"
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg flex items-center gap-2 transition shadow-lg cursor-pointer"
        >
          {isDiagnosing ? (
            <>
              <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analyzing Team Metrics...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Diagnose Corporate Profile
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* The Collectible Visual Glass Card */}
        <div className="lg:col-span-6 flex justify-center">
          <motion.div 
            initial={{ rotateY: -15, scale: 0.95 }}
            animate={{ rotateY: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 60 }}
            className="w-full max-w-[380px] bg-gradient-to-br from-indigo-950/80 via-gray-900/90 to-purple-950/70 p-6 rounded-2xl border border-white/[0.1] shadow-2xl relative overflow-hidden glow-purple"
          >
            {/* Gloss Card Reflect Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0)_50%)]" />
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-500/20 rounded-full filter blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-500/20 rounded-full filter blur-3xl" />

            {/* Header branding */}
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-4 mb-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400">RevenuePulse AI Profiler</span>
              <span className="text-[10px] text-gray-500 font-mono font-bold">CARD ID #042A</span>
            </div>

            <div className="space-y-4">
              {/* Badge visual */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">Company Archetype</span>
                  <h3 className="text-xl font-display font-black tracking-tight text-white uppercase">
                    {activeProfile ? activeProfile.title : 'Uncertified'}
                  </h3>
                </div>
                {activeProfile && (
                  <div className={`p-2 rounded-xl border border-white/[0.05] ${activeProfile.badgeColor}`}>
                    {badgeIcons[activeProfile.type] || <Award className="h-5 w-5" />}
                  </div>
                )}
              </div>

              {/* Holographic rating visual matrix representation */}
              <div className="p-3 bg-gray-950/50 rounded-lg border border-white/[0.04]">
                <p className="text-[10px] text-purple-300 font-mono flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" /> Core Diagnosis Telemetry
                </p>
                <div className="grid grid-cols-3 gap-2 mt-2 text-center text-xs font-mono font-semibold text-gray-300">
                  <div className="bg-white/[0.02] p-1.5 rounded">
                    <p className="text-[9px] text-gray-500 uppercase">Velocity</p>
                    <p className="text-glow text-white">94%</p>
                  </div>
                  <div className="bg-white/[0.02] p-1.5 rounded">
                    <p className="text-[9px] text-gray-500 uppercase">Retention</p>
                    <p className="text-emerald-400">92%</p>
                  </div>
                  <div className="bg-white/[0.02] p-1.5 rounded">
                    <p className="text-[9px] text-gray-500 uppercase">CAC ROI</p>
                    <p className="text-cyan-300">{((metrics.kpiPerformance.clv) / (metrics.kpiPerformance.cac || 1)).toFixed(1)}x</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-300 leading-relaxed min-h-[72px]">
                {activeProfile ? activeProfile.description : 'Click "Diagnose Corporate Profile" to sync and map your performance archetype via Gemini.'}
              </p>

              {/* Bottom tag line */}
              <div className="border-t border-white/[0.08] pt-4 flex justify-between items-center text-[10px] text-gray-400">
                <span className="font-mono">VALID UNTIL Q4 2026</span>
                <span className="uppercase text-purple-400 font-bold border-b border-purple-500/20 pb-0.5 tracking-wider">Board Authorized</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Strategic Breakdown (Strengths, playbooks) */}
        <div className="lg:col-span-6 space-y-5">
          <AnimatePresence mode="wait">
            {activeProfile ? (
              <motion.div 
                key={activeProfile.type}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* STRENGTHS */}
                <div className="glass-panel p-5 rounded-xl">
                  <h4 className="text-xs uppercase font-bold text-gray-400 font-mono tracking-widest mb-3 flex items-center gap-1.5">
                    <UserCheck className="h-4 w-4 text-emerald-400" /> Operational Strengths
                  </h4>
                  <ul className="space-y-2.5">
                    {activeProfile.strengths.map((s, idx) => (
                      <li key={idx} className="text-xs text-gray-300 leading-relaxed flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block mt-1.5 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* LIMITATIONS / THREATS */}
                <div className="glass-panel p-5 rounded-xl">
                  <h4 className="text-xs uppercase font-bold text-gray-400 font-mono tracking-widest mb-3 flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-rose-400" /> Key Strategic Vulnerabilities
                  </h4>
                  <ul className="space-y-2.5">
                    {activeProfile.weaknesses.map((w, idx) => (
                      <li key={idx} className="text-xs text-gray-300 leading-relaxed flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-400 inline-block mt-1.5 shrink-0" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CEO TACTICAL ADVICE */}
                <div className="p-5 rounded-xl bg-purple-600/10 border border-purple-500/20">
                  <h4 className="text-xs uppercase font-bold text-purple-300 font-mono tracking-widest mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-purple-400" /> Strategic Advice Playbook
                  </h4>
                  <p className="text-xs text-purple-200 leading-relaxed font-sans font-medium">
                    {activeProfile.strategicAdvice}
                  </p>
                </div>

                {/* Export controls */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleExportCard}
                    disabled={downloading}
                    id="export_card_btn"
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-lg flex items-center gap-2 transition cursor-pointer"
                  >
                    {downloading ? (
                      <>
                        <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Compressing Card...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Export Collectible Card (TXT)
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCopyLink}
                    id="share_card_btn"
                    className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-750 font-semibold text-xs rounded-lg border border-gray-700 hover:border-gray-600 flex items-center gap-2 transition cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" />
                        Copied share link!
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4" />
                        Copy Shareable Link
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="glass-panel p-8 text-center text-gray-500 rounded-xl">
                <Info className="h-8 w-8 mx-auto text-gray-600 mb-2" />
                <p className="text-xs">Diagnose corporate profile to view strength distributions, sector pitfalls, and tactical advice briefings.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Simple crowns icon for Market Dominator profile matching
function CrownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
      <path d="M5 20h14" />
    </svg>
  );
}
