import React, { useState } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Sliders, 
  Clock, 
  CheckCircle2, 
  Terminal, 
  FileText,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Lock,
  ArrowRight
} from 'lucide-react';
import { StandardizedAlert, IngestedFlow, SimulationMetrics, ThreatClass } from '../../types/threats';
import { SCENARIOS } from '../../utils/trafficEngine';

interface LiveDetectionViewProps {
  metrics: SimulationMetrics;
  alerts: StandardizedAlert[];
  recentFlows: IngestedFlow[];
  trafficHistory: { time: string; rate: number; anomalyCount: number }[];
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
  activeScenario: string;
  setActiveScenario: (sc: string) => void;
  simulationSpeed: number;
  setSimulationSpeed: (sp: number) => void;
  onResetSimulation: () => void;
  onSelectAlert: (alert: StandardizedAlert) => void;
}

export const LiveDetectionView: React.FC<LiveDetectionViewProps> = ({
  metrics,
  alerts,
  recentFlows,
  trafficHistory,
  isStreaming,
  setIsStreaming,
  activeScenario,
  setActiveScenario,
  simulationSpeed,
  setSimulationSpeed,
  onResetSimulation,
  onSelectAlert
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'flows'>('alerts');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFlowDetail, setSelectedFlowDetail] = useState<IngestedFlow | null>(null);

  // Filter alerts
  const filteredAlerts = alerts.filter(a => {
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (categoryFilter !== 'all' && a.threat_class !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = a.threat_name.toLowerCase().includes(q) ||
                    a.source.toLowerCase().includes(q) ||
                    a.destination.toLowerCase().includes(q) ||
                    a.flow_id.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Filter flows
  const filteredFlows = recentFlows.filter(f => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = f.flowId.toLowerCase().includes(q) ||
                    f.fiveTuple.srcIp.toLowerCase().includes(q) ||
                    f.fiveTuple.dstIp.toLowerCase().includes(q) ||
                    f.applicationGuess.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-950/60 border-rose-800';
      case 'HIGH':
        return 'text-orange-400 bg-orange-950/60 border-orange-800';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-950/60 border-amber-800';
      default:
        return 'text-blue-400 bg-blue-950/60 border-blue-800';
    }
  };

  const totalFlowsCount = Math.max(1, recentFlows.length);
  const suspiciousFlowsCount = recentFlows.filter(f => f.isAnomaly).length;
  const normalFlowsCount = totalFlowsCount - suspiciousFlowsCount;
  const suspiciousPercent = Math.round((suspiciousFlowsCount / totalFlowsCount) * 100);
  const normalPercent = 100 - suspiciousPercent;
  const maxRate = Math.max(...trafficHistory.map(h => h.rate), 120000);

  return (
    <div className="space-y-4">
      {/* 1. SIMULATION & TRAFFIC STREAM CONTROL STRIP */}
      <div className="bg-[#101624] border border-[#1d273e] rounded p-3 shadow-sm font-mono text-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Stream Status & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#0b0f1a] border border-[#1d273e]">
            <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-white font-semibold">
              {isStreaming ? 'STREAM: ONLINE' : 'STREAM: PAUSED'}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-[#0b0f1a] p-0.5 rounded border border-[#1d273e]">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-bold cursor-pointer transition-colors ${
                isStreaming 
                  ? 'bg-amber-950/40 text-amber-300 hover:bg-amber-900/40' 
                  : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40'
              }`}
            >
              {isStreaming ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isStreaming ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={onResetSimulation}
              className="px-2 py-1 rounded text-slate-400 hover:text-white hover:bg-[#162035] flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset simulation telemetry buffer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-[#0b0f1a] p-0.5 rounded border border-[#1d273e]">
            <span className="text-slate-500 text-[10px] px-1.5">SPEED:</span>
            {[1, 2, 5].map((sp) => (
              <button
                key={sp}
                onClick={() => setSimulationSpeed(sp)}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                  simulationSpeed === sp
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>

        {/* Attack Scenario Injections */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-500 text-[10px] flex items-center gap-1 mr-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>INJECT SCENARIO:</span>
          </span>

          {[
            { id: 'mixed', label: 'Mixed Stream' },
            { id: 'ddos_volumetric', label: 'SYN Flood' },
            { id: 'botnet_c2', label: 'C2 Beacon' },
            { id: 'dga_dns_tunnel', label: 'DNS Tunnel' },
            { id: 'encrypted_anomaly', label: 'Encrypted Malware' },
            { id: 'reconnaissance', label: 'Port Scan' },
            { id: 'data_exfiltration', label: 'Data Exfil' }
          ].map((sc) => (
            <button
              key={sc.id}
              onClick={() => setActiveScenario(sc.id)}
              className={`px-2 py-0.8 rounded text-[11px] cursor-pointer transition-colors ${
                activeScenario === sc.id
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-[#0b0f1a] text-slate-300 hover:bg-[#162035] border border-[#1d273e]'
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. REAL-TIME MONITORING METRICS & RATE SPARKLINE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Real-Time Rate Chart (2/3 width) */}
        <div className="lg:col-span-2 bg-[#101624] border border-[#1d273e] rounded p-3.5 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="font-mono">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>UNIDIRECTIONAL INGEST RATE</span>
              </div>
              <div className="text-[10px] text-slate-400">
                1-second sliding window telemetry across optical diode tap
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-slate-300">
                Rate: <span className="text-white font-bold tabular-nums">{(metrics.currentRateFlowsSec / 1000).toFixed(1)}k</span> f/s
              </span>
              <span className="text-slate-300">
                Bandwidth: <span className="text-cyan-400 font-bold tabular-nums">~{metrics.currentRateMbps}</span> Mbps
              </span>
              <span className="text-slate-300">
                Latency: <span className="text-emerald-400 font-bold tabular-nums">{metrics.processingLatencyMs.toFixed(1)}</span> ms
              </span>
            </div>
          </div>

          {/* SVG Line Graph */}
          <div className="h-28 w-full pt-1">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 90">
              <line x1="0" y1="25" x2="400" y2="25" stroke="#1c263c" strokeDasharray="3 3" />
              <line x1="0" y1="55" x2="400" y2="55" stroke="#1c263c" strokeDasharray="3 3" />

              <defs>
                <linearGradient id="liveTrafficGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {trafficHistory.length > 1 && (
                <>
                  <polygon
                    points={`0,90 ${trafficHistory.map((h, i) => `${(i / (trafficHistory.length - 1)) * 400},${90 - Math.min(80, (h.rate / maxRate) * 80)}`).join(' ')} 400,90`}
                    fill="url(#liveTrafficGrad)"
                  />
                  <polyline
                    fill="none"
                    stroke="#38bdf8"
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
                        fill="#ef4444"
                        stroke="#0b0f17"
                        strokeWidth="1"
                      />
                    );
                  })}
                </>
              )}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-[#182133] pt-1.5">
            <span>Interface: SIMPLEX-FIBER-RX0</span>
            <span>Simulated Scenario: <span className="text-white uppercase font-bold">{activeScenario}</span></span>
          </div>
        </div>

        {/* Normal vs Anomalous Traffic Distribution (1/3 width) */}
        <div className="bg-[#101624] border border-[#1d273e] rounded p-3.5 space-y-3 flex flex-col justify-between font-mono text-xs">
          <div>
            <div className="text-xs font-bold text-white uppercase">Flow Composition Ratio</div>
            <div className="text-[10px] text-slate-400 font-sans">
              Evaluated across recent sliding micro-window
            </div>
          </div>

          {/* Ratio Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-emerald-400 font-semibold">Nominal: {normalPercent}%</span>
              <span className="text-rose-400 font-semibold">Anomalies: {suspiciousPercent}%</span>
            </div>
            <div className="w-full h-2 bg-[#090d16] rounded overflow-hidden flex border border-[#1b253b]">
              <div className="bg-emerald-500 h-full" style={{ width: `${normalPercent}%` }} />
              <div className="bg-rose-500 h-full" style={{ width: `${suspiciousPercent}%` }} />
            </div>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-300 py-0.5 border-b border-[#182133]">
              <span className="text-slate-400">Nominal Flows:</span>
              <span className="text-emerald-400 font-bold">{normalFlowsCount}</span>
            </div>
            <div className="flex justify-between text-slate-300 py-0.5 border-b border-[#182133]">
              <span className="text-slate-400">Threat Alerts Raised:</span>
              <span className="text-rose-400 font-bold">{suspiciousFlowsCount}</span>
            </div>
            <div className="flex justify-between text-slate-300 py-0.5">
              <span className="text-slate-400">Return Channel Packet Loss:</span>
              <span className="text-cyan-400 font-bold">100% (No Tx Laser)</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-[#182133] pt-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero decryption · Wire metadata only</span>
          </div>
        </div>
      </div>

      {/* 3. WORKSTATION SUB-TABS: ALERT TRIAGE QUEUE VS FLOW INSPECTOR */}
      <div className="bg-[#101624] border border-[#1d273e] rounded overflow-hidden">
        {/* Workspace Toolbar & Tabs */}
        <div className="px-3.5 py-2.5 border-b border-[#1d273e] bg-[#0c121d] flex flex-wrap items-center justify-between gap-3">
          {/* Sub-Tab Selector */}
          <div className="flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-3 py-1.5 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === 'alerts'
                  ? 'bg-[#18233c] text-white font-bold border border-[#2b3d66]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              <span>ALERT TRIAGE QUEUE ({alerts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('flows')}
              className={`px-3 py-1.5 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === 'flows'
                  ? 'bg-[#18233c] text-white font-bold border border-[#2b3d66]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-slate-300" />
              <span>PASSIVELY INGESTED FLOWS (IPFIX)</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter IP, domain, hash, ID..."
                className="pl-7 pr-2.5 py-1 rounded bg-[#090d16] border border-[#1d273e] text-slate-200 text-xs focus:outline-none focus:border-blue-500 w-44 sm:w-56"
              />
            </div>

            {/* Severity Filter (Alerts only) */}
            {activeTab === 'alerts' && (
              <div className="flex items-center gap-1">
                {['all', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
                      severityFilter === sev
                        ? 'bg-[#18233c] text-cyan-300 font-bold border border-[#2b3d66]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TAB 1: ALERT TRIAGE QUEUE */}
        {activeTab === 'alerts' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="bg-[#0b101a] text-slate-400 text-[10px] border-b border-[#1d273e]">
                <tr>
                  <th className="py-2.5 px-3">TIMESTAMP</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3">SEVERITY</th>
                  <th className="py-2.5 px-3">THREAT CLASSIFICATION</th>
                  <th className="py-2.5 px-3">SOURCE ENDPOINT</th>
                  <th className="py-2.5 px-3">DESTINATION</th>
                  <th className="py-2.5 px-3">EVIDENCE REASONING</th>
                  <th className="py-2.5 px-3 text-right">CONFIDENCE</th>
                  <th className="py-2.5 px-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#162035] text-[11px]">
                {filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400 font-sans">
                      No threat alerts match the current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAlerts.map((alert, idx) => (
                    <tr
                      key={`${alert.flow_id}-${idx}`}
                      onClick={() => onSelectAlert(alert)}
                      className="hover:bg-[#151f33] transition-colors cursor-pointer group"
                    >
                      <td className="py-2.5 px-3 text-slate-400 tabular-nums">
                        {alert.timestamp.split('T')[1].slice(0, 8)}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                          {alert.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                        {alert.threat_name}
                      </td>
                      <td className="py-2.5 px-3 text-cyan-300">
                        {alert.source}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {alert.destination}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate font-sans text-xs">
                        {alert.detection_reason}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400 tabular-nums">
                        {alert.confidence.toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="text-blue-400 group-hover:underline text-[11px] font-semibold flex items-center justify-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: PASSIVELY INGESTED FLOW INSPECTOR (NETFLOW / IPFIX) */}
        {activeTab === 'flows' && (
          <div className="space-y-0">
            <div className="px-3.5 py-2 bg-[#090d16] border-b border-[#1d273e] text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <div>
                PASSIVE INGEST STREAM: Parsed Layer 3/4 headers & wire metadata (Zero payload decryption)
              </div>
              <div className="text-slate-500">
                Click any row for flow metadata breakdown
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead className="bg-[#0b101a] text-slate-400 text-[10px] border-b border-[#1d273e]">
                  <tr>
                    <th className="py-2 px-3">FLOW ID</th>
                    <th className="py-2 px-3">TIMESTAMP</th>
                    <th className="py-2 px-3">PROTO</th>
                    <th className="py-2 px-3">SOURCE IP:PORT</th>
                    <th className="py-2 px-3">DESTINATION IP:PORT</th>
                    <th className="py-2 px-3 text-right">PACKETS</th>
                    <th className="py-2 px-3 text-right">BYTES</th>
                    <th className="py-2 px-3">METADATA IOC / GUESS</th>
                    <th className="py-2 px-3 text-center">FLAG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#162035] text-[11px]">
                  {filteredFlows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400 font-sans">
                        No flows in buffer.
                      </td>
                    </tr>
                  ) : (
                    filteredFlows.map((flow) => {
                      const isSelected = selectedFlowDetail?.flowId === flow.flowId;
                      return (
                        <tr
                          key={flow.flowId}
                          onClick={() => setSelectedFlowDetail(isSelected ? null : flow)}
                          className={`hover:bg-[#151f33] transition-colors cursor-pointer ${
                            flow.isAnomaly ? 'bg-rose-950/20' : ''
                          } ${isSelected ? 'bg-[#18233c]' : ''}`}
                        >
                          <td className="py-2 px-3 text-slate-400 text-[10px]">
                            {flow.flowId}
                          </td>
                          <td className="py-2 px-3 text-slate-400 tabular-nums">
                            {flow.timestamp.split('T')[1].slice(0, 8)}
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-300">
                            {flow.fiveTuple.protocol}
                          </td>
                          <td className="py-2 px-3 text-cyan-300">
                            {flow.fiveTuple.srcIp}:{flow.fiveTuple.srcPort}
                          </td>
                          <td className="py-2 px-3 text-slate-300">
                            {flow.fiveTuple.dstIp}:{flow.fiveTuple.dstPort}
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums text-slate-300">
                            {(flow.packetsOut + flow.packetsIn).toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums text-slate-300">
                            {((flow.bytesOut + flow.bytesIn) / 1024).toFixed(1)} KB
                          </td>
                          <td className="py-2 px-3 text-slate-300 truncate max-w-xs">
                            {flow.passiveMetadata.tlsMetadata?.ja4 ? (
                              <span className="text-cyan-300 font-mono text-[10px]">
                                JA4: {flow.passiveMetadata.tlsMetadata.ja4.slice(0, 16)}...
                              </span>
                            ) : flow.passiveMetadata.dnsMetadata?.queryName ? (
                              <span className="text-amber-300 font-mono text-[10px]">
                                DNS: {flow.passiveMetadata.dnsMetadata.queryName}
                              </span>
                            ) : (
                              <span>{flow.applicationGuess}</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {flow.isAnomaly ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-900/60 text-rose-300 border border-rose-800 font-bold">
                                ANOMALY
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-900/40">
                                NOMINAL
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Selected Flow Deep Metadata Inspector Drawer */}
            {selectedFlowDetail && (
              <div className="p-4 bg-[#0a0d16] border-t border-[#1d273e] font-mono text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#182133] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">FLOW INSPECTION:</span>
                    <span className="text-white">{selectedFlowDetail.flowId}</span>
                    <span className="text-slate-400">({selectedFlowDetail.applicationGuess})</span>
                  </div>
                  <button
                    onClick={() => setSelectedFlowDetail(null)}
                    className="text-slate-400 hover:text-white text-[11px]"
                  >
                    Close Inspection
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px]">
                  <div className="p-2.5 rounded bg-[#101624] border border-[#1d273e] space-y-1">
                    <div className="text-slate-500 uppercase text-[10px]">5-Tuple Coordinates</div>
                    <div>Source: <span className="text-cyan-300">{selectedFlowDetail.fiveTuple.srcIp}:{selectedFlowDetail.fiveTuple.srcPort}</span></div>
                    <div>Destination: <span className="text-slate-300">{selectedFlowDetail.fiveTuple.dstIp}:{selectedFlowDetail.fiveTuple.dstPort}</span></div>
                    <div>Transport: <span className="text-white font-bold">{selectedFlowDetail.fiveTuple.protocol}</span></div>
                  </div>

                  <div className="p-2.5 rounded bg-[#101624] border border-[#1d273e] space-y-1">
                    <div className="text-slate-500 uppercase text-[10px]">Volume & Directional Ratio</div>
                    <div>Outbound: <span className="text-white">{selectedFlowDetail.bytesOut.toLocaleString()} bytes</span></div>
                    <div>Inbound: <span className="text-white">{selectedFlowDetail.bytesIn.toLocaleString()} bytes</span></div>
                    <div>Directional Ratio: <span className="text-amber-400 font-bold">{(selectedFlowDetail.bytesOut / Math.max(1, selectedFlowDetail.bytesIn)).toFixed(1)}:1</span></div>
                  </div>

                  <div className="p-2.5 rounded bg-[#101624] border border-[#1d273e] space-y-1">
                    <div className="text-slate-500 uppercase text-[10px]">Passive TCP / TLS Metadata</div>
                    <div>TCP Flags: <span className="text-white">{selectedFlowDetail.passiveMetadata.tcpFlags?.syn ? 'SYN ' : ''}{selectedFlowDetail.passiveMetadata.tcpFlags?.ack ? 'ACK ' : ''}{selectedFlowDetail.passiveMetadata.tcpFlags?.fin ? 'FIN ' : ''}</span></div>
                    <div>JA4 Hash: <span className="text-cyan-400">{selectedFlowDetail.passiveMetadata.tlsMetadata?.ja4 || 'N/A (Cleartext or UDP)'}</span></div>
                    <div>TLS SNI: <span className="text-slate-300">{selectedFlowDetail.passiveMetadata.tlsMetadata?.sni || 'None'}</span></div>
                  </div>

                  <div className="p-2.5 rounded bg-[#101624] border border-[#1d273e] space-y-1">
                    <div className="text-slate-500 uppercase text-[10px]">Passive DNS Metadata</div>
                    <div>Query Name: <span className="text-amber-300">{selectedFlowDetail.passiveMetadata.dnsMetadata?.queryName || 'N/A'}</span></div>
                    <div>Query Type: <span className="text-white">{selectedFlowDetail.passiveMetadata.dnsMetadata?.queryType || 'N/A'}</span></div>
                    <div>Entropy: <span className="text-emerald-400">{selectedFlowDetail.passiveMetadata.dnsMetadata?.labelEntropy ? `${selectedFlowDetail.passiveMetadata.dnsMetadata.labelEntropy} bits` : 'N/A'}</span></div>
                  </div>
                </div>

                {/* Packet Length Sequence Preview Bar */}
                <div className="p-2.5 rounded bg-[#101624] border border-[#1d273e] space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>PASSIVE PACKET LENGTH SEQUENCE (FIRST 10 PACKETS OBSERVED)</span>
                    <span>WIRE SIZES (BYTES) WITHOUT PAYLOAD DECRYPTION</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-12 pt-2">
                    {selectedFlowDetail.passiveMetadata.packetLengthSequence.slice(0, 10).map((len, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div
                          className={`w-full rounded-sm ${selectedFlowDetail.isAnomaly ? 'bg-rose-500' : 'bg-cyan-500'}`}
                          style={{ height: `${Math.max(10, Math.min(100, (len / 1500) * 100))}%` }}
                        />
                        <span className="text-[9px] text-slate-400">{len}B</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
