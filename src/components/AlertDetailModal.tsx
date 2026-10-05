import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileText, Lock, FileCode, ShieldCheck } from 'lucide-react';
import { StandardizedAlert } from '../types/threats';

interface AlertDetailModalProps {
  alert: StandardizedAlert | null;
  onClose: () => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({ alert, onClose }) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'json' | 'stix'>('explanation');
  const [copied, setCopied] = useState(false);

  if (!alert) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(alert, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'HIGH':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'MEDIUM':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  const stixEquivalent = {
    type: "observed-data",
    spec_version: "2.1",
    id: `observed-data--${alert.flow_id.toLowerCase()}`,
    created: alert.timestamp,
    objects: {
      "0": {
        type: "network-traffic",
        src_ref: alert.source,
        dst_ref: alert.destination,
        protocols: [alert.protocol.toLowerCase()]
      }
    },
    custom_properties: {
      x_threat_class: alert.threat_class,
      x_threat_name: alert.threat_name,
      x_confidence: alert.confidence,
      x_severity: alert.severity,
      x_sha256_custody: alert.chain_of_custody_sha256,
      x_diode_simplex: true,
      x_zero_decrypt: true
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-mono">
      <div className="w-full max-w-3xl bg-white border border-[#D9DDE3] rounded shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#D9DDE3] bg-[#F7F7F5] flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`px-2 py-0.5 rounded font-bold border ${getSeverityBadge(alert.severity)}`}>
                {alert.severity}
              </span>
              <span className="text-[#667085] font-semibold">
                {alert.flow_id}
              </span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                CONFIDENCE: {alert.confidence.toFixed(1)}%
              </span>
              <span className="text-[#98A2B3] text-[11px]">
                LATENCY: {alert.latency_ms} ms
              </span>
            </div>

            <h2 className="text-base font-bold text-[#1A1D21] tracking-tight pt-0.5">
              {alert.threat_name}
            </h2>

            <div className="text-[11px] text-[#667085] flex flex-wrap items-center gap-3">
              <span>Timestamp (UTC): {alert.timestamp}</span>
              <span>·</span>
              <span>Channel: Simplex Optical Diode Rx</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#667085] hover:text-[#1A1D21] rounded hover:bg-[#E4E7EC] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5-Tuple Network Coordinates Banner */}
        <div className="px-4 py-2 bg-[#F1F2F3] border-b border-[#D9DDE3] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#667085] text-[10px]">SOURCE:</span>
            <span className="text-[#1A1D21] font-bold">{alert.source}</span>
          </div>
          <span className="text-[#98A2B3]">→</span>
          <div className="flex items-center gap-2">
            <span className="text-[#667085] text-[10px]">DESTINATION:</span>
            <span className="text-[#1A1D21] font-bold">{alert.destination}</span>
          </div>
          <span className="text-[#98A2B3]">|</span>
          <div className="flex items-center gap-2">
            <span className="text-[#667085] text-[10px]">PROTOCOL:</span>
            <span className="text-[#1A1D21] font-bold">{alert.protocol}</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="px-4 border-b border-[#D9DDE3] bg-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('explanation')}
              className={`py-2 px-3 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === 'explanation'
                  ? 'border-[#C9A227] text-[#1A1D21] font-bold'
                  : 'border-transparent text-[#667085] hover:text-[#1A1D21]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>EXPLAINABLE EVIDENCE</span>
            </button>

            <button
              onClick={() => setActiveTab('json')}
              className={`py-2 px-3 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === 'json'
                  ? 'border-[#C9A227] text-[#1A1D21] font-bold'
                  : 'border-transparent text-[#667085] hover:text-[#1A1D21]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-[#667085]" />
              <span>STANDARDIZED JSON</span>
            </button>

            <button
              onClick={() => setActiveTab('stix')}
              className={`py-2 px-3 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeTab === 'stix'
                  ? 'border-[#C9A227] text-[#1A1D21] font-bold'
                  : 'border-transparent text-[#667085] hover:text-[#1A1D21]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-purple-600" />
              <span>STIX 2.1 BUNDLE</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-2 py-1 rounded bg-[#F1F2F3] hover:bg-[#E4E7EC] text-[#1A1D21] text-[11px] flex items-center gap-1 cursor-pointer transition-colors border border-[#D9DDE3]"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#667085]" />}
            <span>{copied ? 'Copied' : 'Copy Record'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 max-h-[60vh] bg-white text-xs">
          {activeTab === 'explanation' && (
            <div className="space-y-4">
              {/* Detection Rationale */}
              <div className="p-3 rounded bg-[#F7F7F5] border border-[#D9DDE3] space-y-1">
                <div className="text-[10px] text-[#667085] uppercase font-semibold">
                  Detection Rationale & Hypothesis
                </div>
                <p className="text-[#1A1D21] font-sans text-xs leading-relaxed">
                  {alert.detection_reason}
                </p>
              </div>

              {/* Primary Feature Metrics Grid */}
              <div className="space-y-1.5">
                <div className="text-[10px] text-[#667085] uppercase font-semibold">
                  Primary Observed Wire Metrics
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(alert.evidence.primary_metrics).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded bg-[#F7F7F5] border border-[#D9DDE3] space-y-0.5">
                      <div className="text-[10px] text-[#667085] truncate">{key}</div>
                      <div className="text-xs font-bold text-[#1A1D21] truncate">{String(val)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Mathematical Evidence Matrix */}
              <div className="space-y-1.5">
                <div className="text-[10px] text-[#667085] uppercase font-semibold">
                  Mathematical Evidence Proof Matrix
                </div>
                <div className="overflow-x-auto border border-[#D9DDE3] rounded">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#F1F2F3] text-[#667085] text-[10px] border-b border-[#D9DDE3]">
                      <tr>
                        <th className="py-2 px-3">FEATURE METRIC</th>
                        <th className="py-2 px-3">OBSERVED VALUE</th>
                        <th className="py-2 px-3">LEARNED BASELINE</th>
                        <th className="py-2 px-3">DETECTION THRESHOLD</th>
                        <th className="py-2 px-3">ANOMALY EXPLANATION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F2F3] text-[11px]">
                      {alert.evidence.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF6EC]">
                          <td className="py-2 px-3 font-semibold text-[#1A1D21]">{item.metric}</td>
                          <td className="py-2 px-3 font-bold text-rose-700 tabular-nums">{item.observed}</td>
                          <td className="py-2 px-3 text-[#667085]">{item.baseline}</td>
                          <td className="py-2 px-3 text-amber-700">{item.threshold}</td>
                          <td className="py-2 px-3 text-[#1A1D21] font-sans text-xs">{item.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Architectural Zero-Decryption & Simplex Guarantee */}
              <div className="p-3 rounded bg-[#FAF6EC] border border-[#C9A227]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#9A7615]" />
                  <span className="text-[#1A1D21]">
                    Calculated purely from passive metadata without payload decryption.
                  </span>
                </div>
                <div className="text-[#9A7615] font-mono text-[10px] truncate">
                  SHA-256: {alert.chain_of_custody_sha256}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-2">
              <div className="text-[10px] text-[#667085]">
                Standardized structured record conforming to the unidirectional threat alert schema.
              </div>
              <pre className="p-3 rounded bg-[#F7F7F5] border border-[#D9DDE3] text-[11px] text-[#1A1D21] overflow-x-auto leading-relaxed">
                {JSON.stringify(alert, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'stix' && (
            <div className="space-y-2">
              <div className="text-[10px] text-[#667085]">
                OASIS STIX 2.1 Cyber Observable Object bundle for SIEM and threat intelligence platform ingestion.
              </div>
              <pre className="p-3 rounded bg-[#F7F7F5] border border-[#D9DDE3] text-[11px] text-purple-800 overflow-x-auto leading-relaxed">
                {JSON.stringify(stixEquivalent, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#D9DDE3] bg-[#F7F7F5] flex items-center justify-between text-xs">
          <div className="text-[#667085] text-[11px] flex items-center gap-2">
            <Lock className="w-3 h-3 text-[#C9A227]" />
            <span>READ-ONLY FORENSIC RECORD · CHAIN OF CUSTODY PRESERVED</span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-[#1A1D21] hover:bg-[#2A2E35] text-white font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
