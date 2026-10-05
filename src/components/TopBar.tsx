import React, { useState, useEffect } from 'react';
import { PageId, SimulationMetrics } from '../types/threats';
import { Pause, Play } from 'lucide-react';

interface TopBarProps {
  activePage: PageId;
  metrics: SimulationMetrics;
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
  onNavigate: (page: PageId) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activePage,
  metrics,
  isStreaming,
  setIsStreaming,
  onNavigate
}) => {
  const [lastUpdate, setLastUpdate] = useState<string>('00:00:00 UTC');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setLastUpdate(now.toTimeString().slice(0, 8) + ' UTC');
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPageInfo = (page: PageId) => {
    switch (page) {
      case 'overview':
        return {
          title: 'Network Security Overview',
          subtitle: 'Passive monitoring of unidirectional IP traffic'
        };
      case 'live_traffic':
        return {
          title: 'Live Traffic',
          subtitle: 'Active unidirectional flow stream and protocol distribution'
        };
      case 'alerts':
        return {
          title: 'Security Alerts',
          subtitle: 'Triaged behavioral threat detection events and queue'
        };
      case 'threats':
        return {
          title: 'Threat Detection',
          subtitle: 'Six target threat categories and anomaly models'
        };
      case 'evidence':
        return {
          title: 'Evidence Inspection',
          subtitle: 'Passive behavioral and wire metadata evidence attribution'
        };
      case 'detection_logic':
        return {
          title: 'Detection Logic',
          subtitle: 'Deterministic behavioral scoring and anomaly classification flow'
        };
      case 'architecture':
        return {
          title: 'Architecture & Invariants',
          subtitle: 'Physical simplex diode boundaries and compliance constraints'
        };
      case 'simulation':
        return {
          title: 'Simulation Control',
          subtitle: 'Deterministic scenario injection and evaluator demo sequence'
        };
      default:
        return {
          title: 'Network Security Overview',
          subtitle: 'Passive monitoring of unidirectional IP traffic'
        };
    }
  };

  const pageInfo = getPageInfo(activePage);

  return (
    <header className="h-14 border-b border-[#D9DDE3] bg-white px-4 sm:px-6 flex items-center justify-between z-20 select-none">
      {/* Left: Page Title & Subtitle */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-sm sm:text-base font-semibold text-[#1A1D21] tracking-tight">
            {pageInfo.title}
          </h1>
          <p className="text-[11px] text-[#667085] hidden sm:block">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Operational Status Telemetry */}
      <div className="flex items-center gap-3 sm:gap-6 font-mono text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-700 font-semibold text-[11px]">
            MONITORING ACTIVE
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-[#1A1D21] text-[11px]">
          <span className="text-[#667085]">Rate:</span>
          <span className="font-bold tabular-nums">
            {(metrics.currentRateFlowsSec / 1000).toFixed(1)}K flows/s
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-[#1A1D21] text-[11px]">
          <span className="text-[#667085]">Simulation:</span>
          <span className="font-bold text-[#C9A227]">
            {isStreaming ? 'ACTIVE' : 'PAUSED'}
          </span>
        </div>

        <div className="hidden xl:flex items-center gap-1.5 text-[#667085] text-[11px]">
          <span className="tabular-nums">{lastUpdate}</span>
        </div>

        {/* Quick Ingest Stream Pause / Resume */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              isStreaming
                ? 'bg-[#F1F2F3] text-[#1A1D21] border-[#D9DDE3] hover:bg-[#E4E7EC]'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
            title="Toggle passive packet ingest stream"
          >
            {isStreaming ? <Pause className="w-3 h-3 text-[#667085]" /> : <Play className="w-3 h-3 text-emerald-700" />}
            <span className="hidden sm:inline">{isStreaming ? 'Pause' : 'Resume'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
