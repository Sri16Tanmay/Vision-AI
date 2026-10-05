import React from 'react';
import { Lock, ArrowDown, ShieldAlert, Cpu, Eye, Ban, ShieldCheck } from 'lucide-react';

interface OneWayVisualizerProps {
  isStreaming: boolean;
}

export const OneWayVisualizer: React.FC<OneWayVisualizerProps> = ({ isStreaming }) => {
  return (
    <div className="relative bg-gradient-to-b from-[#0c1322] to-[#070b13] border border-slate-800 rounded-xl p-6 sm:p-8 overflow-hidden shadow-2xl">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Banner Guarantees */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-8 text-xs font-mono">
        <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900/80 border border-slate-700/70 text-slate-300">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>READ-ONLY INGEST</span>
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900/80 border border-slate-700/70 text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>ONE-WAY OPTICAL FLOW</span>
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-rose-950/40 border border-rose-800/60 text-rose-300 font-semibold">
          <Ban className="w-3.5 h-3.5 text-rose-400" />
          <span>NO RETURN PATH (ZERO PIVOT RISK)</span>
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900/80 border border-slate-700/70 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>NO PAYLOAD DECRYPTION</span>
        </span>
      </div>

      {/* Interactive Unidirectional Architecture Visualization */}
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {/* Step 1: Protected Network */}
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-700 rounded-lg p-4 text-center shadow-lg relative z-10">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span className="text-emerald-400 font-semibold">PRODUCTION INFRASTRUCTURE</span>
            <span>CORE BACKBONE</span>
          </div>
          <div className="text-sm font-bold text-white font-mono">
            PROTECTED ENTERPRISE & INDUSTRIAL NETWORK
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Zero agents installed · Zero active probes allowed · Passive optical split
          </div>
        </div>

        {/* Directed Simplex Flow Pipe with Animated One-Way Packets */}
        <div className="relative py-4 flex flex-col items-center my-1">
          {/* Vertical One-Way Cable */}
          <div className="w-1 h-20 bg-gradient-to-b from-cyan-500 via-cyan-400 to-cyan-600 relative overflow-hidden rounded-full">
            {isStreaming && (
              <>
                <div className="absolute w-2 h-4 bg-white rounded-full -left-0.5 animate-bounce shadow-sm shadow-cyan-300" style={{ animationDuration: '1.2s' }} />
                <div className="absolute w-2 h-3 bg-cyan-200 rounded-full -left-0.5 animate-ping" style={{ animationDuration: '1.6s' }} />
              </>
            )}
          </div>

          {/* Central Isolation Marker: Strictly No Return Path */}
          <div className="absolute top-1/2 -translate-y-1/2 flex items-center gap-4 bg-slate-950 px-4 py-1.5 rounded-full border border-slate-700 shadow-md">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-cyan-400">
              <ArrowDown className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
              <span>ONE-WAY TRAFFIC COPY</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1 text-[11px] font-mono text-rose-400 font-semibold">
              <Ban className="w-3.5 h-3.5" />
              <span>✕ REVERSE PATH SEVERED</span>
            </div>
          </div>
        </div>

        {/* Step 2: Passive Ingest Enclave (Read Only) */}
        <div className="w-full max-w-lg bg-slate-900/90 border border-cyan-800/70 rounded-lg p-5 text-center shadow-lg relative z-10">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-1">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>PASSIVE ENCLAVE INGESTION</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-[10px] text-cyan-300 font-bold">
              READ ONLY
            </span>
          </div>
          <div className="text-base font-bold text-white font-mono">
            AIR-GAPPED HARDWARE DATA DIODE BUFFER
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px]">REVERSE CHANNEL</span>
              <span className="text-rose-400 font-semibold">0% (Physically Absent)</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">PAYLOAD STATUS</span>
              <span className="text-emerald-400 font-semibold">Zero Decryption</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">DATA CAPTURE</span>
              <span className="text-cyan-300 font-semibold">Passive Headers Only</span>
            </div>
          </div>
        </div>

        {/* Transition arrow to AI Analysis */}
        <div className="w-1 h-12 bg-gradient-to-b from-cyan-500 to-purple-500 my-1 relative overflow-hidden">
          {isStreaming && (
            <div className="absolute w-2 h-3 bg-purple-200 rounded-full -left-0.5 animate-bounce shadow-sm" style={{ animationDuration: '1s' }} />
          )}
        </div>

        {/* Step 3: AI/ML Analysis Pipeline */}
        <div className="w-full max-w-2xl bg-gradient-to-r from-purple-950/30 via-slate-900 to-cyan-950/30 border border-purple-800/60 rounded-lg p-5 text-center shadow-xl relative z-10">
          <div className="flex items-center justify-between text-xs font-mono text-purple-400 mb-1">
            <span className="flex items-center gap-1.5 font-bold">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>VISION AI INFERENCE ENGINE</span>
            </span>
            <span className="text-emerald-400 font-semibold">
              Near Real-Time Streaming
            </span>
          </div>

          <div className="text-sm font-bold text-white font-mono mt-1">
            PASSIVE BEHAVIORAL & METADATA ANALYSIS
          </div>

          {/* 3 Pillars of AI Analysis */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-left font-mono text-xs">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded space-y-1">
              <span className="text-cyan-300 font-bold block text-[11px]">1. FEATURE EXTRACTION</span>
              <p className="text-[11px] text-slate-400 font-sans">
                Shannon entropy H(S), inter-arrival autocorrelation, fan-out cardinality, JA4 hashes.
              </p>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded space-y-1">
              <span className="text-purple-300 font-bold block text-[11px]">2. ANOMALY DETECTION</span>
              <p className="text-[11px] text-slate-400 font-sans">
                Streaming isolation trees & Poisson statistical departure scoring.
              </p>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded space-y-1">
              <span className="text-emerald-300 font-bold block text-[11px]">3. 6-CLASS TAXONOMY</span>
              <p className="text-[11px] text-slate-400 font-sans">
                Calibrated confidence (0-100%) and severity mapping to standardized alert schema.
              </p>
            </div>
          </div>
        </div>

        {/* Transition arrow to Alert Output */}
        <div className="w-1 h-10 bg-gradient-to-b from-purple-500 to-rose-500 my-1 relative overflow-hidden" />

        {/* Step 4: Threat Intelligence Alert Output */}
        <div className="w-full max-w-md bg-rose-950/30 border border-rose-800/80 rounded-lg p-4 text-center shadow-lg relative z-10">
          <div className="flex items-center justify-between text-xs font-mono text-rose-400 mb-1">
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>STANDARDIZED ALERT DISPATCH</span>
            </span>
            <span className="text-slate-400">SIEM / SOC BUS</span>
          </div>
          <div className="text-sm font-bold text-white font-mono">
            EXPLAINABLE THREAT INTEL + EVIDENCE VECTOR
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Timestamped · 5-Tuple · Severity · Mathematical Proof · Sealed with SHA-256
          </div>
        </div>
      </div>
    </div>
  );
};
