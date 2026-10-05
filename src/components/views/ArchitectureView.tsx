import React from 'react';
import { Lock, Ban, CheckCircle2, ArrowDown } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-6 font-mono text-xs">
      {/* 1. ARCHITECTURE DIAGRAM WITH GOLD ONE-WAY BOUNDARY (Section 16 & 26) */}
      <div className="bg-white border border-[#D9DDE3] rounded p-6 shadow-xs space-y-6">
        <div className="border-b border-[#F1F2F3] pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3.5 bg-[#C9A227] rounded-xs" />
            <h2 className="text-sm font-semibold text-[#1A1D21] uppercase tracking-wider">
              Physical & Logical One-Way Architecture
            </h2>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold">
            0 BPS RETURN GUARANTEE
          </span>
        </div>

        {/* Diagram Flow */}
        <div className="max-w-xl mx-auto flex flex-col items-center space-y-3">
          {/* Step 1: Protected Network */}
          <div className="w-full bg-[#F7F7F5] border border-[#D9DDE3] rounded p-3 text-center space-y-1">
            <div className="text-[10px] text-[#667085] uppercase tracking-wider">Production Network</div>
            <div className="font-bold text-[#1A1D21] text-sm">
              PROTECTED INFRASTRUCTURE & SCADA GATEWAYS
            </div>
            <div className="text-[11px] text-[#667085] font-sans">
              Critical operations · Zero agents · Passive optical tap only
            </div>
          </div>

          {/* Down Arrow */}
          <div className="flex flex-col items-center text-[#667085]">
            <span className="text-[10px] uppercase font-bold text-[#667085] mb-0.5">One-Way Copy</span>
            <ArrowDown className="w-4 h-4 text-[#C9A227]" />
          </div>

          {/* Step 2: GOLD HARDWARE DATA DIODE BOUNDARY (SECTION 12 & 26) */}
          <div className="w-full relative py-2">
            <div className="border-2 border-[#C9A227] bg-[#FAF6EC] rounded p-4 text-center shadow-xs">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#9A7615] uppercase tracking-wider">
                <Lock className="w-4 h-4 text-[#C9A227]" />
                <span>PASSIVE INGEST (HARDWARE DATA DIODE)</span>
              </div>
              <div className="text-[11px] text-[#1A1D21] font-sans mt-1">
                Simplex optical photodiode receiver with transmit laser physically omitted.
              </div>
              <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-[#9A7615] mt-2 border-t border-[#C9A227]/30 pt-2">
                <span>READ ONLY</span>
                <span>·</span>
                <span>NO RETURN PATH</span>
                <span>·</span>
                <span>ZERO PAYLOAD DECRYPTION</span>
              </div>
            </div>
          </div>

          {/* Down Arrow */}
          <div className="flex flex-col items-center text-[#667085]">
            <ArrowDown className="w-4 h-4 text-[#C9A227]" />
          </div>

          {/* Step 3: Flow Processing */}
          <div className="w-full bg-[#F7F7F5] border border-[#D9DDE3] rounded p-2.5 text-center">
            <div className="font-bold text-[#1A1D21] text-xs">FLOW PROCESSING</div>
            <div className="text-[10px] text-[#667085] font-sans">Layer 3/4 header aggregation without payload inspection</div>
          </div>

          <ArrowDown className="w-3.5 h-3.5 text-[#667085]" />

          {/* Step 4: Feature Extraction */}
          <div className="w-full bg-[#F7F7F5] border border-[#D9DDE3] rounded p-2.5 text-center">
            <div className="font-bold text-[#1A1D21] text-xs">FEATURE EXTRACTION</div>
            <div className="text-[10px] text-[#667085] font-sans">Online entropy, periodicity autocorrelation, and streaming sketches</div>
          </div>

          <ArrowDown className="w-3.5 h-3.5 text-[#667085]" />

          {/* Step 5: Detection Engine */}
          <div className="w-full bg-[#F7F7F5] border border-[#D9DDE3] rounded p-2.5 text-center">
            <div className="font-bold text-[#1A1D21] text-xs">AI / ML DETECTION ENGINE</div>
            <div className="text-[10px] text-[#667085] font-sans">Statistical Z-scores, JA4 fingerprint correlation & Markov sequences</div>
          </div>

          <ArrowDown className="w-3.5 h-3.5 text-[#667085]" />

          {/* Step 6: Threat Classification */}
          <div className="w-full bg-[#F7F7F5] border border-[#D9DDE3] rounded p-2.5 text-center">
            <div className="font-bold text-[#1A1D21] text-xs">THREAT CLASSIFICATION</div>
            <div className="text-[10px] text-[#667085] font-sans">Attribution across 6 target categories with calibrated confidence</div>
          </div>

          <ArrowDown className="w-3.5 h-3.5 text-[#667085]" />

          {/* Step 7: Alert */}
          <div className="w-full bg-[#F7F7F5] border border-[#D9DDE3] rounded p-2.5 text-center">
            <div className="font-bold text-[#1A1D21] text-xs">STANDARDIZED ALERT</div>
            <div className="text-[10px] text-[#667085] font-sans">Structured JSON schema sealed with SHA-256 chain-of-custody hash</div>
          </div>

          <ArrowDown className="w-3.5 h-3.5 text-[#667085]" />

          {/* Step 8: Security Analyst */}
          <div className="w-full bg-[#FAF6EC] border border-[#C9A227]/40 rounded p-3 text-center">
            <div className="font-bold text-[#9A7615] text-xs">SECURITY ANALYST WORKSTATION</div>
            <div className="text-[10px] text-[#667085] font-sans">Air-gapped intelligence dashboard & SIEM export</div>
          </div>
        </div>
      </div>

      {/* 2. THE SYSTEM CAN VS THE SYSTEM MUST NEVER (Section 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WHAT THE SYSTEM CAN DO */}
        <div className="bg-white border border-[#D9DDE3] rounded p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 font-bold uppercase border-b border-[#F1F2F3] pb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>The System Can</span>
          </div>

          <ul className="space-y-2 text-[#1A1D21] text-[11px]">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Passively ingest optical copy of network traffic via hardware diode</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Parse Layer 3/4 headers into 5-tuple flow records</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Extract cleartext metadata (JA4 hashes, SNI, DNS query domains, TCP flags)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Compute real-time behavioral features (entropy, periodicity, fan-out)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Detect statistical departures from baseline distributions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Classify threats across 6 target categories with confidence scores</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Generate structured alerts sealed with SHA-256 for chain of custody</span>
            </li>
          </ul>
        </div>

        {/* WHAT THE SYSTEM MUST NEVER DO */}
        <div className="bg-white border border-[#D9DDE3] rounded p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-700 font-bold uppercase border-b border-[#F1F2F3] pb-2">
            <Ban className="w-4 h-4" />
            <span>The System Must Never</span>
          </div>

          <ul className="space-y-2 text-[#1A1D21] text-[11px]">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✗</span>
              <span>Send packets or electrical signals back to monitored hosts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✗</span>
              <span>Actively probe ports, endpoints, or network services</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✗</span>
              <span>Complete handshakes with traffic sources or destinations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✗</span>
              <span>Inject RST packets, drop flows, or issue inline blocking commands</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✗</span>
              <span>Attempt to decrypt TLS 1.3 or QUIC encrypted payload contents</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✗</span>
              <span>Claim active mitigation or automated firewall rule orchestration</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✗</span>
              <span>Introduce back-channel pivot paths into the protected network</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
