import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileText, Lock, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { StandardizedAlert } from '../types/threats';

interface AlertDrawerProps {
  alert: StandardizedAlert | null;
  onClose: () => void;
  onInspectInEvidence?: (alert: StandardizedAlert) => void;
}

export const AlertDrawer: React.FC<AlertDrawerProps> = ({
  alert,
  onClose,
  onInspectInEvidence
}) => {
  const [showJson, setShowJson] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

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

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-white border-l border-[#D9DDE3] shadow-xl z-50 flex flex-col font-mono text-xs">
      {/* Top Gold Structural Highlight Line */}
      <div className="h-1 bg-[#C9A227] w-full shrink-0" />

      {/* Drawer Header */}
      <div className="p-4 border-b border-[#D9DDE3] bg-[#F7F7F5] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getSeverityBadge(alert.severity)}`}>
            {alert.severity}
          </span>
          <span className="text-[#1A1D21] font-bold text-sm font-sans tracking-tight">
            {alert.threat_name}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-[#667085] hover:text-[#1A1D21] hover:bg-[#E4E7EC] transition-colors cursor-pointer"
          aria-label="Close drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Core Attributes */}
        <div className="bg-white p-3 rounded border border-[#D9DDE3] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#667085]">Confidence Score:</span>
            <span className="text-emerald-700 font-bold">{alert.confidence.toFixed(1)}%</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#667085]">Detected Timestamp:</span>
            <span className="text-[#1A1D21]">{alert.timestamp}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#667085]">Flow Identifier:</span>
            <span className="text-[#1A1D21] font-bold">{alert.flow_id}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#667085]">Detection Latency:</span>
            <span className="text-[#C9A227] font-semibold">{alert.latency_ms} ms</span>
          </div>
        </div>

        {/* 5-Tuple Network Coordinates */}
        <div className="bg-white p-3 rounded border border-[#D9DDE3] space-y-2">
          <div className="text-[10px] text-[#667085] font-bold uppercase tracking-wider">
            Flow Coordinates
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-[#98A2B3] block text-[10px]">SOURCE</span>
              <span className="text-[#1A1D21] font-bold">{alert.source}</span>
            </div>
            <div>
              <span className="text-[#98A2B3] block text-[10px]">DESTINATION</span>
              <span className="text-[#1A1D21] font-bold">{alert.destination}</span>
            </div>
            <div>
              <span className="text-[#98A2B3] block text-[10px]">PROTOCOL</span>
              <span className="text-[#1A1D21] font-bold">{alert.protocol}</span>
            </div>
            <div>
              <span className="text-[#98A2B3] block text-[10px]">STATUS</span>
              <span className="text-emerald-700 font-bold">{alert.status}</span>
            </div>
          </div>
        </div>

        {/* Why this was flagged */}
        <div className="bg-white p-3 rounded border border-[#D9DDE3] space-y-1.5">
          <div className="text-[10px] text-[#C9A227] font-bold uppercase tracking-wider">
            Why This Was Flagged
          </div>
          <p className="text-[#1A1D21] text-xs font-sans leading-relaxed">
            {alert.detection_reason}
          </p>
        </div>

        {/* Detection Evidence */}
        <div className="space-y-2">
          <div className="text-[10px] text-[#667085] font-bold uppercase tracking-wider">
            Detection Evidence
          </div>

          <div className="space-y-2">
            {alert.evidence.items.map((item, idx) => (
              <div key={idx} className="bg-white p-2.5 rounded border border-[#D9DDE3] space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#1A1D21]">{item.metric}</span>
                  <span className="text-rose-700 font-bold">{item.observed}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#667085]">
                  <span>Baseline: {item.baseline}</span>
                  <span>Threshold: {item.threshold}</span>
                </div>
                <div className="text-[10px] text-[#667085] font-sans border-t border-[#F1F2F3] pt-1">
                  {item.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Passive Enclave Invariant */}
        <div className="p-2.5 bg-[#FAF6EC] rounded border border-[#C9A227]/30 text-[10px] text-[#9A7615] space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Lock className="w-3 h-3 text-[#C9A227]" />
            <span>PASSIVE ENCLAVE INVARIANT</span>
          </div>
          <div className="text-[#667085]">
            Simplex Hardware Diode: Zero return transmission. Payload not inspected.
          </div>
          <div className="truncate text-[#98A2B3] select-all">
            Hash: {alert.chain_of_custody_sha256}
          </div>
        </div>

        {/* Standardized JSON View Toggle */}
        {showJson && (
          <div className="space-y-1.5 pt-2 border-t border-[#D9DDE3]">
            <div className="flex items-center justify-between text-[10px] text-[#667085]">
              <span>STANDARDIZED ALERT JSON</span>
            </div>
            <pre className="p-3 bg-[#F7F7F5] border border-[#D9DDE3] rounded text-[10px] text-[#1A1D21] overflow-x-auto max-h-56 leading-tight select-all">
              {JSON.stringify(alert, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-3 border-t border-[#D9DDE3] bg-[#F7F7F5] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowJson(!showJson)}
            className="px-2.5 py-1.5 rounded bg-white hover:bg-[#F1F2F3] text-[#1A1D21] flex items-center gap-1.5 transition-colors cursor-pointer border border-[#D9DDE3]"
          >
            <Terminal className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>{showJson ? 'Hide JSON' : 'View JSON'}</span>
          </button>

          {onInspectInEvidence && (
            <button
              onClick={() => onInspectInEvidence(alert)}
              className="px-2.5 py-1.5 rounded bg-[#FAF6EC] hover:bg-[#F5EDD6] text-[#9A7615] border border-[#C9A227]/40 flex items-center gap-1 transition-colors cursor-pointer font-semibold"
            >
              <span>Inspect</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 rounded bg-white hover:bg-[#F1F2F3] text-[#1A1D21] flex items-center gap-1.5 transition-colors cursor-pointer border border-[#D9DDE3]"
            title="Copy alert JSON record"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#667085]" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-[#1A1D21] hover:bg-[#2A2E35] text-white font-semibold transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
