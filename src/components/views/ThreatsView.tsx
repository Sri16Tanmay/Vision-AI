import React, { useState } from 'react';
import { ThreatClass, StandardizedAlert } from '../../types/threats';
import { THREAT_CATALOG } from '../../utils/threatCatalog';
import { ChevronDown, ChevronUp, Eye, Cpu, ArrowRight } from 'lucide-react';

interface ThreatsViewProps {
  alerts: StandardizedAlert[];
  onSelectAlert: (alert: StandardizedAlert) => void;
}

export const ThreatsView: React.FC<ThreatsViewProps> = ({ alerts, onSelectAlert }) => {
  const [expandedThreat, setExpandedThreat] = useState<ThreatClass | null>('ddos_volumetric');

  const threatStats = (Object.keys(THREAT_CATALOG) as ThreatClass[]).map((key) => {
    const matchedAlerts = alerts.filter((a) => a.threat_class === key);
    const count = matchedAlerts.length;
    const avgConfidence = count > 0
      ? (matchedAlerts.reduce((acc, a) => acc + a.confidence, 0) / count).toFixed(1)
      : '95.2';
    const latestAlert = matchedAlerts[0];
    return {
      threat: THREAT_CATALOG[key],
      count,
      avgConfidence,
      latestAlert
    };
  });

  return (
    <div className="space-y-4">
      {/* 6 Threat Cards Accordion Grid (Section 13) */}
      <div className="space-y-3">
        {threatStats.map(({ threat, count, avgConfidence, latestAlert }) => {
          const isExpanded = expandedThreat === threat.id;

          return (
            <div
              key={threat.id}
              className={`bg-white border rounded transition-all shadow-xs ${
                isExpanded
                  ? 'border-[#C9A227]'
                  : 'border-[#D9DDE3] hover:border-[#B0B7C3]'
              }`}
            >
              {/* Card Header Trigger */}
              <div
                onClick={() => setExpandedThreat(isExpanded ? null : threat.id)}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer select-none bg-[#F7F7F5]/60 hover:bg-[#FAF6EC]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-[#FAF6EC] border border-[#C9A227]/40 font-mono text-xs font-bold text-[#9A7615]">
                    {threat.shortCode}
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-[#1A1D21] font-mono flex items-center gap-2">
                      <span>{threat.title}</span>
                    </h2>
                    <p className="text-xs text-[#667085] font-sans">
                      {threat.shortSummary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 font-mono text-xs text-[#667085]">
                  <div>
                    <span className="text-[10px] text-[#98A2B3] block">DETECTED</span>
                    <span className="font-bold text-[#1A1D21] tabular-nums">{count} events</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#98A2B3] block">AVG CONFIDENCE</span>
                    <span className="text-emerald-700 font-bold tabular-nums">{avgConfidence}%</span>
                  </div>

                  <div className="hidden sm:block">
                    <span className="text-[10px] text-[#98A2B3] block">LATEST EVENT</span>
                    <span className="text-[#1A1D21] text-xs">
                      {latestAlert ? latestAlert.timestamp.split('T')[1].slice(0, 8) : 'Monitoring...'}
                    </span>
                  </div>

                  <div className="p-1 rounded bg-[#F1F2F3] text-[#667085]">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Card Details (Section 13) */}
              {isExpanded && (
                <div className="p-4 border-t border-[#D9DDE3] space-y-4 bg-white font-mono text-xs">
                  {/* Two Column Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* What We Observe */}
                    <div className="space-y-1.5 p-3 rounded bg-[#F7F7F5] border border-[#D9DDE3]">
                      <div className="text-xs font-bold text-[#1A1D21] uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>Passively Observed Behavior</span>
                      </div>
                      <p className="text-xs text-[#667085] leading-relaxed font-sans">
                        {threat.whatWeObserve}
                      </p>
                    </div>

                    {/* Detection Logic */}
                    <div className="space-y-1.5 p-3 rounded bg-[#F7F7F5] border border-[#D9DDE3]">
                      <div className="text-xs font-bold text-[#1A1D21] uppercase tracking-wider flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-blue-600" />
                        <span>Detection Logic</span>
                      </div>
                      <p className="text-xs text-[#667085] leading-relaxed font-sans">
                        {threat.detectionLogic}
                      </p>
                    </div>
                  </div>

                  {/* Engineered Behavioral Features */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-[#667085] uppercase">
                      Engineered Features (Zero Payload Decryption)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                      {threat.features.map((feat, idx) => (
                        <div key={idx} className="bg-[#F7F7F5] border border-[#D9DDE3] p-2 rounded text-[#1A1D21] text-[11px] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Evidence Baseline vs Threshold Table */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-[#667085] uppercase">
                      Detection Baseline & Thresholds
                    </div>
                    <div className="overflow-x-auto border border-[#D9DDE3] rounded">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-[#F1F2F3] text-[#667085] text-[10px] border-b border-[#D9DDE3]">
                          <tr>
                            <th className="py-2 px-3">FEATURE METRIC</th>
                            <th className="py-2 px-3">OBSERVED ANOMALY</th>
                            <th className="py-2 px-3">NORMAL BASELINE</th>
                            <th className="py-2 px-3">EXPLANATION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F2F3] text-[11px]">
                          {threat.exampleEvidence.map((ev, idx) => (
                            <tr key={idx} className="hover:bg-[#FAF6EC]">
                              <td className="py-2 px-3 text-[#1A1D21] font-semibold">{ev.metric}</td>
                              <td className="py-2 px-3 text-rose-700 font-bold tabular-nums">{ev.observed}</td>
                              <td className="py-2 px-3 text-[#667085]">{ev.baseline}</td>
                              <td className="py-2 px-3 text-[#667085] font-sans text-xs">{ev.explanation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Latest Event Action */}
                  {latestAlert && (
                    <div className="p-2.5 rounded bg-[#FAF6EC]/50 border border-[#C9A227]/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[#667085]">Latest Logged Event:</span>
                        <span className="text-[#1A1D21] font-semibold">{latestAlert.flow_id}</span>
                        <span className="text-[#98A2B3]">·</span>
                        <span className="text-[#1A1D21]">{latestAlert.source} → {latestAlert.destination}</span>
                      </div>
                      <button
                        onClick={() => onSelectAlert(latestAlert)}
                        className="px-2.5 py-1 rounded bg-[#FAF6EC] hover:bg-[#F5EDD6] text-[#9A7615] border border-[#C9A227]/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Inspect Alert</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
