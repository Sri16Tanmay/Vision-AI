import React, { useState } from 'react';
import { IngestedFlow, SimulationMetrics } from '../../types/threats';
import { Activity, Play, Pause, RotateCcw, ArrowUpRight } from 'lucide-react';
import { SCENARIOS } from '../../utils/trafficEngine';

interface LiveTrafficViewProps {
  metrics: SimulationMetrics;
  recentFlows: IngestedFlow[];
  trafficHistory: { time: string; rate: number; anomalyCount: number }[];
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
  activeScenario: string;
  setActiveScenario: (sc: string) => void;
  simulationSpeed: number;
  setSimulationSpeed: (sp: number) => void;
  onResetSimulation: () => void;
  onSelectFlowForEvidence?: (flow: IngestedFlow) => void;
}

export const LiveTrafficView: React.FC<LiveTrafficViewProps> = ({
  metrics,
  recentFlows,
  trafficHistory,
  isStreaming,
  setIsStreaming,
  activeScenario,
  setActiveScenario,
  simulationSpeed,
  setSimulationSpeed,
  onResetSimulation,
  onSelectFlowForEvidence
}) => {
  const [protocolFilter, setProtocolFilter] = useState<string>('ALL');

  const filteredFlows = recentFlows.filter(f => {
    if (protocolFilter !== 'ALL' && f.fiveTuple.protocol !== protocolFilter) return false;
    return true;
  });

  const maxRate = Math.max(...trafficHistory.map(h => h.rate), 100000);

  // Derived protocol distribution from recent window
  const totalInWindow = Math.max(1, recentFlows.length);
  const tcpCount = recentFlows.filter(f => f.fiveTuple.protocol === 'TCP').length;
  const udpCount = recentFlows.filter(f => f.fiveTuple.protocol === 'UDP').length;
  const dnsCount = recentFlows.filter(f => f.fiveTuple.dstPort === 53 || f.fiveTuple.srcPort === 53).length;
  const tlsCount = recentFlows.filter(f => f.fiveTuple.dstPort === 443 || f.fiveTuple.dstPort === 8443).length;
  const otherCount = Math.max(0, totalInWindow - tcpCount - udpCount);

  const tcpPct = Math.round((tcpCount / totalInWindow) * 100);
  const udpPct = Math.round((udpCount / totalInWindow) * 100);
  const dnsPct = Math.min(15, Math.round((dnsCount / totalInWindow) * 100) || 8);
  const tlsPct = Math.min(25, Math.round((tlsCount / totalInWindow) * 100) || 5);
  const otherPct = Math.max(1, 100 - tcpPct - udpPct);

  return (
    <div className="space-y-5">
      {/* 1. TOP SIMULATION CONTROLS BAR (Section 11) */}
      <div className="bg-white border border-[#D9DDE3] rounded p-3.5 shadow-xs font-mono text-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left: Live Status & Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#F1F2F3] border border-[#D9DDE3]">
            <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="font-bold text-[#1A1D21]">
              {isStreaming ? 'LIVE ●' : 'PAUSED'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-3 py-1 rounded font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isStreaming
                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              {isStreaming ? <Pause className="w-3 h-3 text-amber-700" /> : <Play className="w-3 h-3 text-emerald-700" />}
              <span>{isStreaming ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={onResetSimulation}
              className="px-2.5 py-1 rounded bg-white hover:bg-[#F1F2F3] text-[#667085] hover:text-[#1A1D21] border border-[#D9DDE3] cursor-pointer flex items-center gap-1 transition-colors"
              title="Reset flow buffer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Right: Scenario Selector & Speed */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[#667085] text-[11px]">SCENARIO:</span>
            <select
              value={activeScenario}
              onChange={(e) => setActiveScenario(e.target.value)}
              className="bg-white border border-[#D9DDE3] rounded px-2.5 py-1 text-[#1A1D21] text-xs focus:outline-none focus:border-[#C9A227] cursor-pointer"
            >
              {SCENARIOS.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name.split('(')[0]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#667085] text-[11px]">SPEED:</span>
            {[1, 2, 5].map((sp) => (
              <button
                key={sp}
                onClick={() => setSimulationSpeed(sp)}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors text-xs ${
                  simulationSpeed === sp
                    ? 'bg-[#FAF6EC] text-[#9A7615] font-bold border border-[#C9A227]/40'
                    : 'text-[#667085] hover:text-[#1A1D21]'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. TRAFFIC ACTIVITY & PROTOCOL DISTRIBUTION ROW (Section 11) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Traffic Activity Graph (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-[#D9DDE3] rounded p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between border-b border-[#F1F2F3] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#C9A227] rounded-xs" />
              <h2 className="text-xs font-semibold text-[#1A1D21] uppercase tracking-wider font-mono">
                Traffic Activity
              </h2>
            </div>
            <div className="text-xs font-mono text-[#667085]">
              Rate: <span className="font-bold text-[#1A1D21] tabular-nums">{(metrics.currentRateFlowsSec / 1000).toFixed(1)}K</span> flows/s
            </div>
          </div>

          {/* SVG Smooth Chart */}
          <div className="h-32 w-full pt-1">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 90">
              <line x1="0" y1="25" x2="400" y2="25" stroke="#F1F2F3" strokeDasharray="3 3" />
              <line x1="0" y1="55" x2="400" y2="55" stroke="#F1F2F3" strokeDasharray="3 3" />

              <defs>
                <linearGradient id="liveTrafficGradLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {trafficHistory.length > 1 && (
                <>
                  <polygon
                    points={`0,90 ${trafficHistory.map((h, i) => `${(i / (trafficHistory.length - 1)) * 400},${90 - Math.min(80, (h.rate / maxRate) * 80)}`).join(' ')} 400,90`}
                    fill="url(#liveTrafficGradLight)"
                  />
                  <polyline
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    points={trafficHistory.map((h, i) => `${(i / (trafficHistory.length - 1)) * 400},${90 - Math.min(80, (h.rate / maxRate) * 80)}`).join(' ')}
                  />
                  {trafficHistory.map((h, i) => {
                    if (h.anomalyCount === 0) return null;
                    const x = (i / (trafficHistory.length - 1)) * 400;
                    const y = 90 - Math.min(80, (h.rate / maxRate) * 80);
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="3.5"
                        fill="#E02424"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Protocol Distribution (1/3 width - Section 11) */}
        <div className="bg-white border border-[#D9DDE3] rounded p-4 shadow-xs space-y-3 font-mono text-xs flex flex-col justify-between">
          <div className="border-b border-[#F1F2F3] pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1 h-3.5 bg-[#C9A227] rounded-xs" />
              <h2 className="text-xs font-semibold text-[#1A1D21] uppercase tracking-wider">
                Protocol Distribution
              </h2>
            </div>
            <span className="text-[10px] text-[#667085]">Recent Window</span>
          </div>

          {/* Clean Horizontal Breakdown Bar */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-[#F1F2F3] rounded-xs overflow-hidden flex border border-[#D9DDE3]">
              <div className="bg-[#3B82F6] h-full" style={{ width: `${tcpPct}%` }} title={`TCP: ${tcpPct}%`} />
              <div className="bg-[#10B981] h-full" style={{ width: `${udpPct}%` }} title={`UDP: ${udpPct}%`} />
              <div className="bg-[#F59E0B] h-full" style={{ width: `${dnsPct}%` }} title={`DNS: ${dnsPct}%`} />
              <div className="bg-[#8B5CF6] h-full" style={{ width: `${tlsPct}%` }} title={`TLS: ${tlsPct}%`} />
              <div className="bg-[#9CA3AF] h-full" style={{ width: `${otherPct}%` }} title={`Other: ${otherPct}%`} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-[#3B82F6]" />
                <span className="text-[#667085]">TCP</span>
                <span className="font-bold text-[#1A1D21]">{tcpPct}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-[#10B981]" />
                <span className="text-[#667085]">UDP</span>
                <span className="font-bold text-[#1A1D21]">{udpPct}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-[#F59E0B]" />
                <span className="text-[#667085]">DNS</span>
                <span className="font-bold text-[#1A1D21]">{dnsPct}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-[#8B5CF6]" />
                <span className="text-[#667085]">TLS</span>
                <span className="font-bold text-[#1A1D21]">{tlsPct}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-[#9CA3AF]" />
                <span className="text-[#667085]">Other</span>
                <span className="font-bold text-[#1A1D21]">{otherPct}%</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-[#98A2B3] border-t border-[#F1F2F3] pt-1.5">
            Zero decryption · Wire metadata aggregation only
          </div>
        </div>
      </div>

      {/* 3. ACTIVE FLOWS TABLE (Section 11) */}
      <div className="bg-white border border-[#D9DDE3] rounded shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#D9DDE3] bg-[#F7F7F5] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3.5 bg-[#C9A227] rounded-xs" />
            <h2 className="text-sm font-semibold text-[#1A1D21] uppercase tracking-wider font-mono">
              Active Flows
            </h2>
            <span className="text-xs font-mono text-[#667085]">
              ({filteredFlows.length} flows in active stream)
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-[#667085] text-[11px]">FILTER:</span>
            {['ALL', 'TCP', 'UDP'].map((proto) => (
              <button
                key={proto}
                onClick={() => setProtocolFilter(proto)}
                className={`px-2 py-0.5 rounded cursor-pointer transition-colors text-[11px] ${
                  protocolFilter === proto
                    ? 'bg-[#FAF6EC] text-[#9A7615] font-bold border border-[#C9A227]/40'
                    : 'text-[#667085] hover:text-[#1A1D21]'
                }`}
              >
                {proto}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className="bg-[#F1F2F3] text-[#667085] text-[11px] border-b border-[#D9DDE3]">
              <tr>
                <th className="py-2 px-3">TIMESTAMP</th>
                <th className="py-2 px-3">SOURCE</th>
                <th className="py-2 px-3">DESTINATION</th>
                <th className="py-2 px-3">PROTOCOL</th>
                <th className="py-2 px-3 text-right">PORT</th>
                <th className="py-2 px-3 text-right">PACKETS</th>
                <th className="py-2 px-3 text-right">BYTES</th>
                <th className="py-2 px-3 text-right">DURATION</th>
                <th className="py-2 px-3 text-center">STATUS</th>
                <th className="py-2 px-3 text-center">EVIDENCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F2F3] text-[12px]">
              {filteredFlows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-[#667085] font-sans">
                    No active flows in stream buffer.
                  </td>
                </tr>
              ) : (
                filteredFlows.map((flow) => (
                  <tr
                    key={flow.flowId}
                    className={`hover:bg-[#FAF6EC] transition-colors ${
                      flow.isAnomaly ? 'bg-rose-50/40' : ''
                    }`}
                  >
                    <td className="py-2 px-3 text-[#667085] tabular-nums">
                      {flow.timestamp.split('T')[1].slice(0, 8)}
                    </td>
                    <td className="py-2 px-3 text-[#1A1D21]">
                      {flow.fiveTuple.srcIp}
                    </td>
                    <td className="py-2 px-3 text-[#1A1D21]">
                      {flow.fiveTuple.dstIp}
                    </td>
                    <td className="py-2 px-3 font-semibold text-[#667085]">
                      {flow.fiveTuple.protocol}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums text-[#667085]">
                      {flow.fiveTuple.dstPort}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums text-[#1A1D21]">
                      {(flow.packetsIn + flow.packetsOut).toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums text-[#1A1D21]">
                      {((flow.bytesIn + flow.bytesOut) / 1024).toFixed(1)} KB
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums text-[#667085]">
                      {flow.durationMs}ms
                    </td>
                    <td className="py-2 px-3 text-center">
                      {flow.isAnomaly ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          ANOMALY
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                          NOMINAL
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {onSelectFlowForEvidence ? (
                        <button
                          onClick={() => onSelectFlowForEvidence(flow)}
                          className="text-[#C9A227] hover:underline text-[11px] font-semibold cursor-pointer"
                        >
                          Inspect
                        </button>
                      ) : (
                        <span className="text-[#98A2B3] text-[11px]">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
