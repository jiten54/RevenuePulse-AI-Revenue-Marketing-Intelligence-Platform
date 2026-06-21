import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, ArrowUpRight, HelpCircle, CheckCircle2, ShieldAlert,
  Sparkles, FileSpreadsheet, Upload, Download, Printer, Copy, Check
} from 'lucide-react';
import { Transaction } from '../types';
import { ACHIEVEMENTS, MOCK_CSV_TEMPLATE } from '../data/mockData';

interface AchievementsUploadViewProps {
  onImportTransactions: (imported: Transaction[]) => void;
  transactionsCount: number;
  totalRevenue: number;
}

export default function AchievementsUploadView({ 
  onImportTransactions,
  transactionsCount,
  totalRevenue
}: AchievementsUploadViewProps) {
  const [dragActive, setDragActive] = useState(false);
  const [csvPreview, setCsvPreview] = useState<string>('');
  const [isParsing, setIsParsing] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [exportingBrief, setExportingBrief] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute Achievements Unlocked State dynamically based on live analytics data
  const dynamicAchievements = ACHIEVEMENTS.map(ach => {
    let unlocked = ach.unlocked;
    if (ach.title === 'Revenue Master') {
      unlocked = totalRevenue > 250000;
    } else if (ach.title === 'Analytics Expert') {
      unlocked = transactionsCount > 155; // Unlocks upon uploading custom transaction records
    }
    return {
      ...ach,
      unlocked
    };
  });

  // Handle Drag-and-drop mechanics
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const parseCSVContent = (text: string) => {
    setIsParsing(true);
    try {
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) throw new Error('Empty CSV template or invalid syntax.');

      const headers = lines[0].split(',').map(h => h.trim());
      const expectedHeaders = ['date', 'customerName', 'amount', 'product', 'category', 'region', 'segment', 'status'];
      
      // Basic check
      const results: Transaction[] = [];
      let nextId = 5000 + Math.floor(Math.random() * 1000);

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length < headers.length) continue;

        // Map values
        const row: any = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx];
        });

        // Push standard transaction
        results.push({
          id: `TX-UP-${nextId++}`,
          date: row.date || new Date().toISOString().split('T')[0],
          amount: Number(row.amount) || 0,
          customerName: row.customerName || 'Imported Customer',
          product: row.product || 'Standard Seat',
          category: row.category || 'SaaS Subscriptions',
          region: row.region || 'North America',
          segment: (row.segment as any) || 'SMB',
          status: (row.status as any) || 'Completed'
        });
      }

      if (results.length > 0) {
        onImportTransactions(results);
        alert(`Successfully calculated, authorized, and imported ${results.length} custom transactions. Check Command Center and forecasts to view live variations!`);
      } else {
        alert('Could not parse any rows. Ensure headings match exactly.');
      }
    } catch (error: any) {
      alert(`CSV Parser Error: ${error?.message || 'Check syntax'}`);
    } finally {
      setIsParsing(false);
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          parseCSVContent(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          parseCSVContent(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(MOCK_CSV_TEMPLATE);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([MOCK_CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "revenue_pulse_intel_template.csv";
    link.click();
  };

  // Simulation of complete PDF report compilations
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* CSV / Excel Ingestion Console */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-6">
        <div>
          <h2 className="text-xl font-display font-semibold text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-400" /> Sandboxed Custom Ingestions
          </h2>
          <p className="text-xs text-gray-400">Drag-and-drop raw financial CSV spreadsheets to merge logs and recalculate analytics immediately.</p>
        </div>

        {/* Ingest box area */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-colors cursor-pointer ${
            dragActive 
            ? 'border-emerald-500 bg-emerald-500/5' 
            : 'border-white/[0.08] hover:border-white/20 bg-gray-950/20'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleManualUpload}
            className="hidden"
          />
          {isParsing ? (
            <div className="space-y-2">
              <div className="h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-gray-300">Recalculating ledger pipelines...</p>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-emerald-400 mb-3 opacity-80 animate-bounce" />
              <p className="text-xs text-gray-200 font-semibold">Drag & Drop Financial CSV, or <span className="text-emerald-400 border-b border-emerald-400/20">browse local files</span></p>
              <p className="text-[10px] text-gray-500 font-mono mt-1">Upload triggers automated "Analytics Expert" trophy achievements unlock.</p>
            </>
          )}
        </div>

        {/* Template utilities */}
        <div className="bg-gray-950/40 p-3.5 rounded-xl border border-white/[0.05] flex justify-between items-center text-xs">
          <div>
            <span className="font-semibold text-gray-300 block">Ingestion CSV Format spec</span>
            <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">Expects matching header columns date, customer, amount, etc.</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyTemplate}
              id="copy_csv_tpl_btn"
              className="p-1.5 hover:bg-gray-800 text-gray-300 rounded text-xs transition duration-150 flex items-center gap-1 cursor-pointer font-bold"
            >
              {copiedTemplate ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedTemplate ? 'Copied' : 'Copy Spec'}
            </button>
            <button
              onClick={handleDownloadTemplate}
              id="download_csv_tpl_btn"
              className="p-1.5 hover:bg-gray-800 text-gray-300 rounded text-xs transition duration-150 flex items-center gap-1 cursor-pointer font-bold bg-white/5"
            >
              <Download className="h-3.5 w-3.5" />
              Tpl.csv
            </button>
          </div>
        </div>

        {/* PDF / Screen Sharing tools */}
        <div className="border-t border-white/[0.05] pt-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-300 block">Board Room Export utilities</span>
            <span className="text-[10px] text-gray-500 block">Simulate full board-presentation exports blocks.</span>
          </div>
          
          <button
            onClick={handlePrintPDF}
            id="print_pdf_report_btn"
            className="px-3.5 py-1.5 bg-gray-800 text-white hover:bg-gray-750 border border-gray-700 hover:border-gray-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" /> PDF Report (Print Layout)
          </button>
        </div>
      </div>

      {/* Gamified Achievement System */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div>
          <h2 className="text-xl font-display font-semibold text-white tracking-tight flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-400" /> Strategic Trophy Milestones
          </h2>
          <p className="text-xs text-gray-400">Unlock corporate operational badges by maintaining high customer ratings, uploading ledgers or exceeding subscription quotas.</p>
        </div>

        <div className="space-y-3 Scrollbar-thin max-h-[320px] overflow-y-auto">
          {dynamicAchievements.map((ach) => (
            <div 
              key={ach.id} 
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all duration-300 ${
                ach.unlocked 
                ? 'bg-yellow-500/5 border-yellow-500/25 glow-cyan' 
                : 'bg-white/10 dark:bg-black/10 border-white/[0.04] opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg border flex items-center justify-center shrink-0 ${
                  ach.unlocked 
                  ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20' 
                  : 'bg-white/5 text-gray-500 border-white/[0.05]'
                }`}>
                  <Award className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-sans font-semibold text-white">{ach.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{ach.requirement}</p>
                </div>
              </div>

              <div>
                {ach.unlocked ? (
                  <span className="px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-300 text-[9px] font-bold font-mono uppercase tracking-wider">
                    Unlocked
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-500 text-[9px] font-bold font-mono uppercase tracking-wider">
                    Locked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
