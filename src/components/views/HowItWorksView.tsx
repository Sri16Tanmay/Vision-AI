import React, { useState } from 'react';
import { 
  ArrowDown, 
  CheckCircle2, 
  Ban, 
  Lock, 
  Cpu, 
  Eye, 
  ShieldAlert, 
  Terminal, 
  FileText,
  Layers,
  Activity,
  Download,
  Copy,
  Check,
  Radio,
  FileCode
} from 'lucide-react';

export const HowItWorksView: React.FC = () => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const sampleStix21 = `{
  "type": "bundle",
  "id": "bundle--3b8a1c90-7d34-4b52-9e20-5c6218d9f482",
  "spec_version": "2.1",
  "objects": [
    {
      "type": "observed-data",
      "spec_version": "2.1",
      "id": "observed-data--7f8d10b9-52e1-4560-91cd-939e6a982cb1",
      "first_observed": "2026-10-05T09:30:00Z",
      "last_observed": "2026-10-05T09:30:01Z",
      "number_observed": 1,
      "objects": {
        "0": {
          "type": "network-traffic",
          "src_ref": "ipv4-addr--192.168.1.100",
          "dst_ref": "ipv4-addr--198.51.100.4",
          "protocols": ["tcp", "tls"],
          "extensions": {
            "tls-ext": {
              "ja4": "t13d1516h2_8daaf6152771_b4b3952a55bc",
              "sni": "c2-heartbeat.internal-update.xyz"
            }
          }
        }
      },
      "custom_properties": {
        "x_vision_ai_threat_class": "botnet_c2",
        "x_vision_ai_confidence": 94.1,
        "x_vision_ai_diode_simplex": true,
        "x_vision_ai_sha256_custody": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      }
    }
  ]
}`;

  const sampleCef = `CEF:0|VisionAI|PassiveNDR|2.4|botnet_c2|Botnet C2 Periodic Beaconing|8|src=192.168.1.100 spt=49201 dst=198.51.100.4 dpt=443 proto=TCP confidence=94.1 diodeRxOnly=true returnBps=0 sha256=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 reason="Passive timing analysis revealed repetitive heartbeat intervals (45s) towards single external endpoint"`;

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="border-b border-[#1c263c] pb-3 space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Cpu className="w-3.5 h-3.5" />
          <span>TECHNICAL ARCHITECTURE & CONSTRAINTS SPECIFICATION</span>
        </div>
        <h1 className="text-lg font-bold text-white tracking-tight font-mono uppercase">
          Passive Unidirectional Architecture
        </h1>
        <p className="text-xs text-slate-400 font-sans max-w-3xl">
          Complete physical and algorithmic specification for air-gapped monitoring enclaves in critical infrastructure. Adheres strictly to the architectural imperative: <span className="text-white font-mono font-bold">SEE EVERYTHING. SEND NOTHING.</span>
        </p>
      </div>

      {/* 1. PHYSICAL HARDWARE DATA DIODE SPECIFICATION */}
      <div className="bg-[#101624] border border-[#1d273e] rounded p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1c263c] pb-2 font-mono">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase">
              1. Physical Layer 1 Simplex Data Diode
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
            ZERO RETURN PATH (0 BPS)
          </span>
        </div>

        {/* Physical Diagram Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded bg-[#0b101a] border border-[#1d273e] space-y-1.5">
            <div className="text-[10px] text-emerald-400 font-bold uppercase">Source Network</div>
            <div className="text-white font-bold">Production Infrastructure</div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Industrial control networks, power grid SCADA, and enterprise core switches. An optical splitter taps 10% of light without introducing electrical or logical interfaces.
            </p>
          </div>

          <div className="p-3 rounded bg-[#0b101a] border border-[#1d273e] space-y-1.5">
            <div className="text-[10px] text-cyan-400 font-bold uppercase">Isolation Barrier</div>
            <div className="text-white font-bold">Hardware Simplex Optical Diode</div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Photodiode receiver captures incoming optical pulses. The return transmit laser diode is physically omitted at the circuit board level. Return transmission is physically impossible.
            </p>
          </div>

          <div className="p-3 rounded bg-[#0b101a] border border-[#1d273e] space-y-1.5">
            <div className="text-[10px] text-blue-400 font-bold uppercase">Analysis Enclave</div>
            <div className="text-white font-bold">Vision AI Detection Engine</div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Enclave parses Layer 3/4 packet headers and wire metadata in micro-windows. Even if an analyst workstation were compromised, no pivot path exists back to the core network.
            </p>
          </div>
        </div>
      </div>

      {/* 2. TEN-STAGE STREAMING PIPELINE FLOW */}
      <div className="bg-[#101624] border border-[#1d273e] rounded p-4 space-y-3 font-mono text-xs">
        <div className="text-xs font-bold text-white uppercase flex items-center gap-2 border-b border-[#1c263c] pb-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>2. Ten-Stage Streaming Detection Pipeline</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
          {[
            { step: '01', title: 'Optical Tap', desc: 'Passive optical split off production peering fibers', color: 'text-cyan-400' },
            { step: '02', title: 'Simplex Rx', desc: 'Hardware receiver with severed transmit optics (0 bps return)', color: 'text-cyan-400' },
            { step: '03', title: 'Header Parse', desc: 'Wire-speed extraction of 5-tuple and TCP/UDP/TLS flags', color: 'text-cyan-400' },
            { step: '04', title: 'Feature Math', desc: 'Online calculation of Shannon entropy, FFT, and sketches', color: 'text-purple-400' },
            { step: '05', title: 'Behavior Models', desc: 'Inter-arrival delay autocorrelation & volume asymmetry', color: 'text-purple-400' },
            { step: '06', title: 'Anomaly Engine', desc: 'Statistical Z-score and streaming isolation forest', color: 'text-purple-400' },
            { step: '07', title: 'Classification', desc: 'Ensemble attribution across 6 target threat classes', color: 'text-emerald-400' },
            { step: '08', title: 'Confidence Score', desc: 'Calibrated 0-100% confidence & severity calculation', color: 'text-emerald-400' },
            { step: '09', title: 'SHA-256 Seal', desc: 'Cryptographic chain-of-custody seal per alert record', color: 'text-rose-400' },
            { step: '10', title: 'Operator Bus', desc: 'High-density telemetry rendering & SIEM/STIX 2.1 export', color: 'text-rose-400' }
          ].map((item) => (
            <div key={item.step} className="p-2.5 rounded bg-[#0b101a] border border-[#1d273e] space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500">STAGE {item.step}</span>
                <span className={`font-bold ${item.color}`}>●</span>
              </div>
              <div className="text-white font-bold text-xs">{item.title}</div>
              <p className="text-[10px] text-slate-400 font-sans leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. THE SYSTEM CAN VS THE SYSTEM MUST NEVER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
        {/* THE SYSTEM CAN */}
        <div className="bg-[#101624] border border-[#1d273e] rounded p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase border-b border-[#1c263c] pb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>The System Can</span>
          </div>

          <ul className="space-y-2 text-slate-300 text-[11px]">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Ingest unidirectional copy of IP packets via optical tap</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Parse Layer 3/4 headers into 5-tuple flow records</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Extract cleartext metadata (JA4 hashes, SNI, DNS queries, TCP flags)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Compute real-time behavioral features (Shannon entropy, autocorrelation)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Detect statistical departures from baseline distributions in &lt;5ms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Classify threats across all 6 target categories with confidence scores</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Produce standardized alerts sealed with SHA-256 for chain of custody</span>
            </li>
          </ul>
        </div>

        {/* THE SYSTEM MUST NEVER */}
        <div className="bg-[#101624] border border-[#1d273e] rounded p-4 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase border-b border-[#1c263c] pb-2">
            <Ban className="w-4 h-4" />
            <span>The System Must Never</span>
          </div>

          <ul className="space-y-2 text-slate-300 text-[11px]">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✗</span>
              <span>Transmit packets or electrical signals back to monitored hosts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✗</span>
              <span>Actively probe ports, endpoints, or network services</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✗</span>
              <span>Complete handshakes with traffic sources or destinations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✗</span>
              <span>Inject RST packets, drop flows, or issue inline blocking commands</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✗</span>
              <span>Attempt to decrypt TLS 1.3 or QUIC encrypted payload contents</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✗</span>
              <span>Claim active mitigation or automated firewall rule orchestration</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✗</span>
              <span>Introduce back-channel pivot paths into the protected network</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. FORENSIC CHAIN OF CUSTODY & STANDARDIZED EXPORT */}
      <div className="bg-[#101624] border border-[#1d273e] rounded p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#1c263c] pb-2">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase">
              4. Standardized Alert Schema & SIEM / STIX 2.1 Export
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            Immutable SHA-256 Forensic Seals
          </span>
        </div>

        <p className="text-slate-400 font-sans text-xs">
          Alert records are cryptographically sealed upon generation to preserve forensic chain-of-custody in legal and critical infrastructure compliance proceedings.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
          {/* STIX 2.1 Preview */}
          <div className="p-3 rounded bg-[#0b101a] border border-[#1d273e] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 font-bold text-xs">OASIS STIX 2.1 Observable Bundle</span>
              <button
                onClick={() => copyToClipboard(sampleStix21, 'stix')}
                className="px-2 py-0.5 rounded bg-[#162035] hover:bg-[#1f2c48] text-slate-300 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedFormat === 'stix' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedFormat === 'stix' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-[10px] text-slate-400 overflow-x-auto p-2 bg-[#080c14] rounded max-h-48 font-mono leading-relaxed">
              {sampleStix21}
            </pre>
          </div>

          {/* CEF Preview */}
          <div className="p-3 rounded bg-[#0b101a] border border-[#1d273e] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold text-xs">ArcSight Common Event Format (CEF)</span>
              <button
                onClick={() => copyToClipboard(sampleCef, 'cef')}
                className="px-2 py-0.5 rounded bg-[#162035] hover:bg-[#1f2c48] text-slate-300 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedFormat === 'cef' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedFormat === 'cef' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-[10px] text-slate-400 overflow-x-auto p-2 bg-[#080c14] rounded max-h-48 font-mono leading-relaxed whitespace-pre-wrap break-all">
              {sampleCef}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
