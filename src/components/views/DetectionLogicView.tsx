import React from 'react';
import { ArrowDown, CheckCircle2, Cpu, ShieldAlert, Layers } from 'lucide-react';

export const DetectionLogicView: React.FC = () => {
  const pipelineSteps = [
    { title: 'Traffic Stream', desc: 'Passive optical tap off peering link' },
    { title: 'Flow Aggregation', desc: '5-tuple packet correlation into flows' },
    { title: 'Feature Extraction', desc: 'Online entropy, rate, and timing computation' },
    { title: 'Behavioral Analysis', desc: 'Sliding micro-window deviation evaluation' },
    { title: 'Anomaly Detection', desc: 'Statistical Z-score & isolation scoring' },
    { title: 'Threat Classification', desc: 'Attribution to 6 target threat categories' },
    { title: 'Confidence & Severity', desc: 'Calibrated 0-100% score calculation' },
    { title: 'Standardized Alert', desc: 'Structured JSON record sealed with SHA-256' }
  ];

  const detectionMethods = [
    {
      title: '1. Volumetric & Protocol DDoS Detection',
      threat: 'SYN floods, UDP amplification, and spoofed-source floods',
      logic: 'Monitors Poisson arrival rates and TCP SYN/ACK ratios across 100ms micro-slices. Calculates Shannon entropy of source IP addresses H(S). When flow rate spikes by >300% and source entropy approaches maximal uniformity (>6.50 bits) with a >90% SYN-only ratio, a volumetric spoofed flood is identified.',
      features: ['Source IP Shannon Entropy H(S)', 'SYN-to-ACK Imbalance Ratio', 'Packet Arrival Rate Deviation']
    },
    {
      title: '2. Botnet C2 Periodic Beaconing',
      threat: 'Cobalt Strike, Sliver, and recurring agent heartbeats',
      logic: 'Calculates the autocorrelation function R_xx(tau) of flow inter-arrival times across persistent destination IP/port tuples. Programmatic command-and-control implants repeat connections at fixed sleep intervals with low jitter coefficient (Cv < 0.08), whereas human browsing exhibits high stochastic dispersion.',
      features: ['Inter-Arrival Autocorrelation R_xx', 'Jitter Coefficient (Cv)', 'Destination Host Cardinality']
    },
    {
      title: '3. DGA Domains & DNS Tunnelling',
      threat: 'Algorithmically generated domains and covert data channels',
      logic: 'Analyzes passive DNS query names mirrored from recursive resolvers. Calculates Shannon entropy of query domain labels and bigram character perplexity against English phoneme distributions. Detects data tunneling when high-entropy domains accompany oversized TXT or NULL records (>256 bytes).',
      features: ['Domain Label Shannon Entropy', 'Bigram Perplexity Score', 'TXT/NULL Payload Volume']
    },
    {
      title: '4. Malware Inside Encrypted Sessions',
      threat: 'Malicious implants communicating over TLS 1.3 or QUIC',
      logic: 'Inspects unencrypted ClientHello parameters (cipher suite sequence, TLS extensions, and ALPN) to generate a JA4 fingerprint hash. Matches hashes against known threat actor profiles and models the first 10 packet length transitions using a Markov transition matrix without decrypting the payload.',
      features: ['JA4/JA3 Fingerprint Hash', 'Packet Length Sequence Markov Likelihood', 'Server Name Indication (SNI) Age']
    },
    {
      title: '5. Reconnaissance & Port Scanning',
      threat: 'Stealth SYN sweeps, service enumeration, and ICS port discovery',
      logic: 'Uses a streaming HyperLogLog sketch to measure the cardinality of destination IPs and ports contacted by a single source within a 1-second sliding window. Rapid fan-out (>50 hosts/sec) with zero payload bytes flags automated reconnaissance before an attack begins.',
      features: ['Host Fan-Out Cardinality', 'Port Dispersion Sketch', 'SYN-Only Flow Percentage']
    },
    {
      title: '6. Asymmetric Data Exfiltration',
      threat: 'Bulk data theft, archive staging, and covert egress streams',
      logic: 'Analyzes directional byte ratios (Bytes Out / Bytes In) on single socket flows. Standard enterprise web client traffic downloads far more data than it uploads (ratio ~0.12:1). A reversed ratio (>10:1) with sustained volume exceeding statistical baseline Z-scores (Z > 3.0) signals unauthorized exfiltration.',
      features: ['Directional Byte Ratio (B_out / B_in)', 'Cumulative Transfer Volume Z-Score', 'Destination ASN Classification']
    }
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* 1. VISUAL PIPELINE FLOW (Section 15) */}
      <div className="bg-white border border-[#D9DDE3] rounded p-4 shadow-xs space-y-3">
        <div className="border-b border-[#F1F2F3] pb-2 flex items-center gap-2">
          <span className="w-1 h-3.5 bg-[#C9A227] rounded-xs" />
          <h2 className="text-xs font-semibold text-[#1A1D21] uppercase tracking-wider">
            Streaming Detection Pipeline Flow
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1">
          {pipelineSteps.map((step, idx) => (
            <div key={idx} className="p-2.5 rounded bg-[#F7F7F5] border border-[#D9DDE3] flex flex-col justify-between space-y-1">
              <div className="text-[10px] text-[#9A7615] font-bold">
                0{idx + 1}
              </div>
              <div className="font-bold text-[#1A1D21] text-[11px] leading-tight">
                {step.title}
              </div>
              <div className="text-[10px] text-[#667085] font-sans leading-tight">
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SIX DETECTION METHODS BREAKDOWN (Section 15) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-1 h-3.5 bg-[#C9A227] rounded-xs" />
          <h2 className="text-xs font-semibold text-[#1A1D21] uppercase tracking-wider">
            Detection Method Specifications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {detectionMethods.map((m, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#D9DDE3] rounded p-4 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#1A1D21]">
                  {m.title}
                </div>
                <div className="text-[11px] text-[#C9A227] font-semibold">
                  {m.threat}
                </div>
                <p className="text-xs text-[#667085] font-sans leading-relaxed pt-1">
                  {m.logic}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#F1F2F3]">
                <div className="text-[10px] text-[#98A2B3] uppercase font-bold">
                  Key Extracted Features
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {m.features.map((f, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-2 py-0.5 rounded bg-[#F7F7F5] border border-[#D9DDE3] text-[10px] text-[#1A1D21]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
