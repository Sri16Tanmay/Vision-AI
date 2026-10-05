import React from 'react';
import { StandardizedAlert, IngestedFlow } from '../../types/threats';
import { Lock } from 'lucide-react';

interface EvidenceViewProps {
  alerts: StandardizedAlert[];
  recentFlows: IngestedFlow[];
  selectedAlert: StandardizedAlert | null;
  onSelectAlert: (alert: StandardizedAlert) => void;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  alerts,
  selectedAlert,
  onSelectAlert
}) => {
  // If selectedAlert is null, default to the latest alert
  const activeAlert = selectedAlert || alerts[0] || null;

  return (
    <div className="space-y-5 font-mono text-xs">
      {/* 1. ARCHITECTURAL INVARIANT CALLOUT (Section 14 & 25) */}
      <div className="p-3.5 rounded bg-[#FAF6EC] border border-[#C9A227]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#9A7615]">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-[#1A1D21] uppercase tracking-wider text-xs">
              PAYLOAD CONTENT NOT INSPECTED
            </div>
            <div className="text-[11px] text-[#667085] font-sans">
              All intelligence and anomaly scores are derived strictly from Layer 3/4 headers, inter-arrival intervals, and wire sizes.
            </div>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded bg-white text-[#9A7615] border border-[#C9A227]/40 font-bold whitespace-nowrap">
          ZERO DECRYPTION ASSURANCE
        </span>
      </div>

      {/* 2. EVENT SELECTOR */}
      <div className="bg-white border border-[#D9DDE3] rounded p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[#667085] text-[11px]">SELECT ACTIVE EVENT TO INSPECT:</span>
          <select
            value={activeAlert?.flow_id || ''}
            onChange={(e) => {
              const found = alerts.find(a => a.flow_id === e.target.value);
              if (found) onSelectAlert(found);
            }}
            className="bg-[#F7F7F5] border border-[#D9DDE3] rounded px-2.5 py-1 text-[#1A1D21] text-xs focus:outline-none focus:border-[#C9A227] cursor-pointer"
          >
            {alerts.map((a) => (
              <option key={a.flow_id} value={a.flow_id}>
                {a.timestamp.split('T')[1].slice(0, 8)} - {a.threat_name} ({a.flow_id})
              </option>
            ))}
          </select>
        </div>

        {activeAlert && (
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-[#667085]">Confidence:</span>
            <span className="text-emerald-700 font-bold">{activeAlert.confidence.toFixed(1)}%</span>
            <span className="text-[#98A2B3]">|</span>
            <span className="text-[#667085]">Severity:</span>
            <span className="text-rose-700 font-bold">{activeAlert.severity}</span>
          </div>
        )}
      </div>

      {activeAlert ? (
        <div className="space-y-4">
          {/* 3. THREE STRUCTURED FEATURE PANELS (Section 14) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Panel 1: Flow Information */}
            <div className="bg-white border border-[#D9DDE3] rounded p-4 shadow-xs space-y-3">
              <div className="border-b border-[#F1F2F3] pb-2 flex items-center gap-2">
                <span className="w-1 h-3 bg-[#C9A227] rounded-xs" />
                <h3 className="font-semibold text-[#1A1D21] uppercase tracking-wider text-xs">
                  Flow Information
                </h3>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between py-1 border-b border-[#F1F2F3]">
                  <span className="text-[#667085]">Source Endpoint:</span>
                  <span className="font-bold text-[#1A1D21]">{activeAlert.source}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F1F2F3]">
                  <span className="text-[#667085]">Destination:</span>
                  <span className="font-bold text-[#1A1D21]">{activeAlert.destination}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F1F2F3]">
                  <span className="text-[#667085]">Transport Protocol:</span>
                  <span className="font-bold text-[#1A1D21]">{activeAlert.protocol}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F1F2F3]">
                  <span className="text-[#667085]">Flow ID:</span>
                  <span className="font-bold text-[#1A1D21]">{activeAlert.flow_id}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#667085]">Processing Latency:</span>
                  <span className="font-bold text-emerald-700">{activeAlert.latency_ms} ms</span>
                </div>
              </div>
            </div>

            {/* Panel 2: Behavioral Features */}
            <div className="bg-white border border-[#D9DDE3] rounded p-4 shadow-xs space-y-3">
              <div className="border-b border-[#F1F2F3] pb-2 flex items-center gap-2">
                <span className="w-1 h-3 bg-[#C9A227] rounded-xs" />
                <h3 className="font-semibold text-[#1A1D21] uppercase tracking-wider text-xs">
                  Behavioral Features
                </h3>
              </div>

              <div className="space-y-2 text-[11px]">
                {Object.entries(activeAlert.evidence.primary_metrics).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-[#F1F2F3]">
                    <span className="text-[#667085] truncate max-w-[140px]">{key}:</span>
                    <span className="font-bold text-[#1A1D21]">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 3: Security & Wire Signatures */}
            <div className="bg-white border border-[#D9DDE3] rounded p-4 shadow-xs space-y-3">
              <div className="border-b border-[#F1F2F3] pb-2 flex items-center gap-2">
                <span className="w-1 h-3 bg-[#C9A227] rounded-xs" />
                <h3 className="font-semibold text-[#1A1D21] uppercase tracking-wider text-xs">
                  Security Metadata
                </h3>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between py-1 border-b border-[#F1F2F3]">
                  <span className="text-[#667085]">Zero Decryption:</span>
                  <span className="font-bold text-emerald-700">VERIFIED 100%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F1F2F3]">
                  <span className="text-[#667085]">Read-Only Ingest:</span>
                  <span className="font-bold text-[#1A1D21]">HARDWARE SIMPLEX</span>
                </div>
                <div className="py-1">
                  <span className="text-[#667085] block text-[10px]">SHA-256 CHAIN OF CUSTODY:</span>
                  <span className="text-[10px] text-[#9A7615] break-all select-all">
                    {activeAlert.chain_of_custody_sha256}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. MATHEMATICAL EVIDENCE PROOF TABLE */}
          <div className="bg-white border border-[#D9DDE3] rounded shadow-xs overflow-hidden">
            <div className="px-4 py-3 border-b border-[#D9DDE3] bg-[#F7F7F5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 bg-[#C9A227] rounded-xs" />
                <h3 className="text-xs font-semibold text-[#1A1D21] uppercase tracking-wider">
                  Mathematical Evidence Proof Matrix
                </h3>
              </div>
              <span className="text-[#667085] text-[11px]">
                Decision criteria for {activeAlert.threat_name}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F1F2F3] text-[#667085] text-[10px] border-b border-[#D9DDE3]">
                  <tr>
                    <th className="py-2.5 px-3">FEATURE METRIC</th>
                    <th className="py-2.5 px-3">OBSERVED VALUE</th>
                    <th className="py-2.5 px-3">NORMAL BASELINE</th>
                    <th className="py-2.5 px-3">DETECTION THRESHOLD</th>
                    <th className="py-2.5 px-3">ANOMALY EXPLANATION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F2F3] text-[11px]">
                  {activeAlert.evidence.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF6EC]">
                      <td className="py-2.5 px-3 font-semibold text-[#1A1D21]">{item.metric}</td>
                      <td className="py-2.5 px-3 font-bold text-rose-700 tabular-nums">{item.observed}</td>
                      <td className="py-2.5 px-3 text-[#667085]">{item.baseline}</td>
                      <td className="py-2.5 px-3 text-amber-700">{item.threshold}</td>
                      <td className="py-2.5 px-3 text-[#1A1D21] font-sans text-xs">{item.explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-[#667085] bg-white rounded border border-[#D9DDE3]">
          No alert selected for evidence inspection.
        </div>
      )}
    </div>
  );
};
