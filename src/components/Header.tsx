import React from 'react';
import { Activity, ShieldAlert, Cpu, HelpCircle, Play, Pause, Compass, Radio, Lock } from 'lucide-react';
import { NavPage } from '../types/threats';

export type { NavPage };

interface HeaderProps {
  activePage: NavPage;
  setActivePage: (page: NavPage) => void;
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  isStreaming,
  setIsStreaming,
  isDemoMode,
  onToggleDemoMode
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-[#1c2438] bg-[#0c101a] text-slate-200">
      {/* Primary Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5">
        {/* Left: Product Identity & Physical Diode Hardware Status */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => setActivePage('overview')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-7 h-7 rounded bg-[#162035] border border-[#2a3858] flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
              V
            </div>
            <div>
              <div className="text-sm font-bold tracking-wider font-mono text-white flex items-center gap-2">
                <span>VISION AI</span>
                <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-[#162035] text-cyan-300 border border-[#243354]">
                  NDR ENCLAVE
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                UNIDIRECTIONAL THREAT MONITORING
              </div>
            </div>
          </button>

          {/* Physical Diode Hardware Integrity Badge */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-[#0f1422] border border-[#1e2840] font-mono text-[11px]">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400">DIODE:</span>
            <span className="text-emerald-400 font-semibold">SIMPLEX RX0</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">TX:</span>
            <span className="text-slate-300 font-semibold">SEVERED (0 BPS)</span>
          </div>
        </div>

        {/* Center: 4 Primary Console Tabs */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setActivePage('overview')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              activePage === 'overview'
                ? 'bg-[#18233c] text-white font-semibold border border-[#2b3d66]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#121828]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActivePage('live_detection')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              activePage === 'live_detection'
                ? 'bg-[#18233c] text-white font-semibold border border-[#2b3d66]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#121828]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Detection & Flows</span>
          </button>

          <button
            onClick={() => setActivePage('threats')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              activePage === 'threats'
                ? 'bg-[#18233c] text-white font-semibold border border-[#2b3d66]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#121828]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Threat Taxonomy</span>
          </button>

          <button
            onClick={() => setActivePage('how_it_works')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
              activePage === 'how_it_works'
                ? 'bg-[#18233c] text-white font-semibold border border-[#2b3d66]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#121828]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Architecture & Forensics</span>
          </button>
        </nav>

        {/* Right: Operational Controls */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
          {/* Analyst Demo Tour / Walkthrough */}
          <button
            onClick={onToggleDemoMode}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDemoMode
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-[#141b2e] text-blue-300 hover:bg-[#1b2540] border border-[#223050]'
            }`}
            title="Interactive Analyst Tour across normal baseline and simulated threat scenarios"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isDemoMode ? 'TOUR IN PROGRESS' : 'ANALYST TOUR'}</span>
            <span className="sm:hidden">TOUR</span>
          </button>

          {/* Ingest Stream Pause / Resume */}
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 cursor-pointer transition-colors border ${
              isStreaming
                ? 'bg-[#0f1d19] text-emerald-300 border-emerald-900/60 hover:bg-[#142621]'
                : 'bg-[#21160e] text-amber-300 border-amber-900/60 hover:bg-[#2e1f13]'
            }`}
          >
            {isStreaming ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="hidden sm:inline">INGESTING</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">PAUSED</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-between px-3 py-1.5 bg-[#0a0d15] border-t border-[#182030] text-[11px] font-mono overflow-x-auto">
        <button
          onClick={() => setActivePage('overview')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activePage === 'overview' ? 'text-white bg-[#162035]' : 'text-slate-400'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActivePage('live_detection')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activePage === 'live_detection' ? 'text-white bg-[#162035]' : 'text-slate-400'}`}
        >
          Live Detection
        </button>
        <button
          onClick={() => setActivePage('threats')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activePage === 'threats' ? 'text-white bg-[#162035]' : 'text-slate-400'}`}
        >
          Threats
        </button>
        <button
          onClick={() => setActivePage('how_it_works')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activePage === 'how_it_works' ? 'text-white bg-[#162035]' : 'text-slate-400'}`}
        >
          Architecture
        </button>
      </div>
    </header>
  );
};
