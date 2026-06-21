import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Calendar, TrendingUp, Trophy, ArrowRight, ArrowLeft, RotateCcw, 
  Copy, Check, Share2, Play, Volume2, HelpCircle, Flame, Star
} from 'lucide-react';
import { RevenueWrapped } from '../types';

interface RevenueWrappedViewProps {
  wrappedData: RevenueWrapped;
}

export default function RevenueWrappedView({ wrappedData }: RevenueWrappedViewProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [customStory, setCustomStory] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchAIJourneyStory = async () => {
    setIsGeneratingStory(true);
    try {
      const response = await fetch('/api/gemini/wrapped', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wrappedData })
      });
      const data = await response.json();
      setCustomStory(data.story);
    } catch (error) {
      console.error(error);
      setCustomStory("There was an issue launching the generative copywriter. Here is your baseline saga:\n\nOur subscription sales exploded in late spring, creating unparalleled SaaS momentum across geographic divisions. This was driven by a remarkable ROI on core inbound channels, and enterprise upgrades.");
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = customStory || wrappedData.journeyStory || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const slides = [
    // Slide 0: Cover Slide
    {
      bgColor: 'from-indigo-900/60 to-purple-950/60',
      element: (
        <div className="text-center space-y-6 py-8">
          <motion.div 
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            className="inline-block bg-gradient-to-tr from-cyan-400 via-purple-500 to-rose-400 p-3 rounded-2xl shadow-xl shadow-purple-500/10 mb-2"
          >
            <Trophy className="h-10 w-10 text-white" />
          </motion.div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-display font-black tracking-tight text-white uppercase"
          >
            2026 Wrapped
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 max-w-md mx-auto text-sm leading-relaxed"
          >
            Ready to review your team's legendary commercial run? Your growth, best months, campaigns, and strategic personal narratives packaged as a cinematic journey.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSlide(1)}
            id="start_wrapped_btn"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm rounded-full tracking-wider uppercase transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
          >
            Start Your Journey
          </motion.button>
        </div>
      )
    },
    // Slide 1: Best Month
    {
      bgColor: 'from-emerald-900/50 to-indigo-950/60',
      element: (
        <div className="space-y-6 py-6 text-center">
          <Calendar className="h-12 w-12 text-emerald-400 mx-auto opacity-80" />
          <h3 className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold">The Golden Era</h3>
          <h2 className="text-2xl md:text-3xl font-display font-medium text-white">Your Best Revenue Month was</h2>
          
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="py-5"
          >
            <span className="text-5xl md:text-7xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-400 uppercase tracking-tight block">
              {wrappedData.bestMonth.month}
            </span>
            <span className="text-2xl md:text-3xl font-mono text-white mt-2 block">
              ${wrappedData.bestMonth.amount.toLocaleString()}
            </span>
          </motion.div>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            A beautiful period of compounded contract signups that redefined your core growth ceiling.
          </p>
        </div>
      )
    },
    // Slide 2: Highest Revenue Day
    {
      bgColor: 'from-rose-950/50 to-slate-900/60',
      element: (
        <div className="space-y-6 py-6 text-center">
          <Flame className="h-12 w-12 text-rose-400 mx-auto opacity-80" />
          <h3 className="text-xs uppercase tracking-widest text-rose-400 font-mono font-bold">Breaking Point</h3>
          <h2 className="text-2xl md:text-3xl font-display font-medium text-white">Your Single Day Peak Hit</h2>
          
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="py-5"
          >
            <span className="text-5xl md:text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-orange-400 uppercase block tracking-tight">
              ${wrappedData.highestDay.amount.toLocaleString()}
            </span>
            <span className="text-sm font-mono text-gray-400 tracking-wider mt-3 block">
              ON {new Date(wrappedData.highestDay.date).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </motion.div>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            The transactions log had a near heartbeat spike. The servers barely compiled the volumes!
          </p>
        </div>
      )
    },
    // Slide 3: Top Product
    {
      bgColor: 'from-cyan-950/50 to-blue-900/40',
      element: (
        <div className="space-y-6 py-6 text-center">
          <Star className="h-12 w-12 text-cyan-400 mx-auto opacity-80" />
          <h3 className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-bold font-semibold">The Product MVP</h3>
          <h2 className="text-2xl md:text-3xl font-display font-medium text-white">Your Undisputed Leader was</h2>
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-4 bg-gray-950/40 border border-white/[0.05] p-6 rounded-xl max-w-md mx-auto"
          >
            <span className="text-xl md:text-2xl font-display font-semibold text-white block">
              {wrappedData.topProduct.name}
            </span>
            <span className="text-2xl font-mono text-cyan-300 mt-2 block">
              ${wrappedData.topProduct.sales.toLocaleString()} Generated
            </span>
            <span className="text-xs font-mono text-emerald-400 block mt-1">
              📈 Growing at +{wrappedData.topProduct.growth}% YoY
            </span>
          </motion.div>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Representing unmatched product-market fit that pulled subscriptions chronologically.
          </p>
        </div>
      )
    },
    // Slide 4: Strategic Catalyst
    {
      bgColor: 'from-violet-950/50 to-rose-950/40',
      element: (
        <div className="space-y-6 py-6 text-center">
          <TrendingUp className="h-12 w-12 text-violet-400 mx-auto opacity-80" />
          <h3 className="text-xs uppercase tracking-widest text-violet-300 font-mono font-bold">The Catalyst</h3>
          <h2 className="text-2xl md:text-3xl font-display font-medium text-white">Lead Campaign & Segment</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-gray-950/40 border border-white/[0.05] p-5 rounded-xl text-left"
            >
              <h4 className="text-[10px] uppercase font-bold tracking-wider text-violet-300 font-mono">Top Campaign</h4>
              <p className="text-sm font-semibold text-white mt-1 border-b border-white/[0.05] pb-2 truncate">{wrappedData.topCampaign.name}</p>
              <p className="text-xs text-emerald-400 font-mono mt-2 font-bold">ROI: {wrappedData.topCampaign.roi}%</p>
              <p className="text-xs text-gray-400 font-mono">Revenue: ${wrappedData.topCampaign.revenue.toLocaleString()}</p>
            </motion.div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-gray-950/40 border border-white/[0.05] p-5 rounded-xl text-left"
            >
              <h4 className="text-[10px] uppercase font-bold tracking-wider text-rose-300 font-mono">Speed Demon Sector</h4>
              <p className="text-sm font-semibold text-white mt-1 border-b border-white/[0.05] pb-2 truncate">{wrappedData.fastestSegment.name}</p>
              <p className="text-xs text-emerald-400 font-mono mt-2 font-bold">Expansion: +{wrappedData.fastestSegment.growth}%</p>
              <p className="text-xs text-gray-400 font-mono">Segment: Mid-to-Enterprise</p>
            </motion.div>
          </div>
          <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
            This campaign and segment crossover unlocked unprecedented pipelines that scaled overall velocity.
          </p>
        </div>
      )
    },
    // Slide 5: Generative Narrative
    {
      bgColor: 'from-slate-900 via-indigo-950/40 to-slate-950',
      element: (
        <div className="space-y-4 py-4 text-left max-w-2xl mx-auto flex flex-col h-full">
          <div className="flex justify-between items-center border-b border-white/[0.05] pb-3">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-semibold">Generative Executive Saga</h3>
              <h2 className="text-lg font-display text-white">Your Year In Words</h2>
            </div>
            {!customStory ? (
              <button
                onClick={fetchAIJourneyStory}
                disabled={isGeneratingStory}
                id="generate_ai_story_btn"
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isGeneratingStory ? 'Drafting Saga...' : 'Generate with AI'}
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  id="copy_saga_btn"
                  className="p-1 px-2 hover:bg-gray-800 text-gray-300 hover:text-white rounded text-xs transition duration-150 flex items-center gap-1 cursor-pointer"
                  title="Copy Saga Content"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={() => setCustomStory(null)}
                  id="reset_saga_btn"
                  className="p-1 hover:bg-gray-800 text-gray-300 hover:text-white rounded text-xs transition duration-150"
                  title="Regenerate"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="bg-gray-950/60 p-4 border border-white/[0.04] rounded-xl flex-1 overflow-y-auto max-h-[250px] scrollbar-thin text-xs text-gray-300 leading-relaxed font-sans">
            {isGeneratingStory ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500 space-y-2">
                <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p>Generating custom copywriting journey via Gemini...</p>
              </div>
            ) : customStory ? (
              <div className="space-y-4 whitespace-pre-wrap font-sans">
                {customStory}
              </div>
            ) : (
              <div className="space-y-4 font-sans text-gray-400">
                <p className="font-semibold text-white">The Journey of a Champion Enterprise</p>
                <p>{wrappedData.journeyStory}</p>
                <div className="p-3 bg-cyan-500/5 rounded-lg border border-cyan-500/10 text-[11px] text-cyan-300 leading-normal flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Click "Generate with AI" to let Gemini compose a highly personalized, witty story of your year's numbers, customized for presentation to board members.</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-[10px] text-gray-500 text-center flex justify-center items-center gap-2 mt-2">
            <Volume2 className="h-3 w-3" /> Track simulated with 114 BPM retro chill-hop loops.
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    }
  };

  const handlePrev = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden backdrop-blur-lg">
      <div className="absolute top-0 right-0 p-4 shrink-0 flex items-center gap-2">
        <span className="px-2 py-0.5 rounded bg-purple-600/20 text-purple-300 text-[10px] uppercase tracking-widest font-bold font-mono">2026 Edition</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-display font-semibold tracking-tight text-white flex items-center gap-2">
            🚀 Revenue Wrapped Experience
          </h2>
          <p className="text-xs text-gray-400">Cinematic summary slide show celebrating your commercial velocity metrics.</p>
        </div>
      </div>

      <div className="relative min-h-[380px] rounded-xl overflow-hidden shadow-2xl p-6 flex flex-col justify-between border border-white/[0.05]">
        {/* Animated Background */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${slides[activeSlide].bgColor} transition-all duration-1000 -z-10`} />
        
        {/* Particle Overlay (Visual Polish) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.02)_0%,rgba(0,0,0,0)_60%)] -z-10" />

        {/* Action Header Progress Indicator */}
        <div className="flex gap-1.5 w-full mt-2">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className="h-1 flex-1 rounded-full overflow-hidden bg-white/10"
            >
              <motion.div 
                className="h-full bg-cyan-400 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: idx <= activeSlide ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>

        {/* Content Box */}
        <div className="flex-1 flex items-center justify-center py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full"
            >
              {slides[activeSlide].element}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center border-t border-white/[0.05] pt-4 mt-2">
          <button
            onClick={handlePrev}
            disabled={activeSlide === 0}
            id="prev_slide_btn"
            className="px-3 py-1.5 bg-white/5 text-gray-300 disabled:opacity-30 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Previous
          </button>

          <span className="text-xs font-mono text-gray-400">
            Slide {activeSlide + 1} of {slides.length}
          </span>

          {activeSlide === slides.length - 1 ? (
            <button
              onClick={() => setActiveSlide(0)}
              id="wrapped_restart_btn"
              className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Start Over
            </button>
          ) : (
            <button
              onClick={handleNext}
              id="next_slide_btn"
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              Next Slide <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
