import { IngestedFlow, StandardizedAlert, ThreatClass, FiveTuple, DemoStep } from '../types/threats';
import { THREAT_CATALOG } from './threatCatalog';

// Shannon entropy calculation
export function calculateShannonEntropy(str: string): number {
  if (!str || str.length === 0) return 0;
  const freq: Record<string, number> = {};
  for (const ch of str) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  const len = str.length;
  let entropy = 0;
  for (const count of Object.values(freq)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(3));
}

// Pseudo SHA-256 for non-repudiation chain of custody proof
export function generateSha256(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hex1 = Math.abs(hash).toString(16).padStart(8, '0');
  const hex2 = Math.abs((hash ^ 0x5a5a5a5a) * 31).toString(16).padStart(8, '0');
  const hex3 = Math.abs((hash ^ 0x3c3c3c3c) * 17).toString(16).padStart(8, '0');
  const hex4 = Math.abs((hash ^ 0x1f1f1f1f) * 43).toString(16).padStart(8, '0');
  return `sha256:${hex1}${hex2}${hex3}${hex4}e8b429177cf02a`;
}

// Known malicious & benign JA4 fingerprints for encrypted session detection without decryption
export const JA4_DATABASE = {
  cobalt_strike: {
    hash: 't13d1516h2_8daaf6152771_b186095e22b6',
    threat: 'Cobalt Strike Malleable C2 over TLS 1.3',
    cipherCount: 15,
    extCount: 16
  },
  sliver_c2: {
    hash: 't13d1912h2_044f514588e0_5e982ca808d4',
    threat: 'Sliver C2 Implant Mutual TLS Session',
    cipherCount: 19,
    extCount: 12
  },
  emotet: {
    hash: 't12d190800_20803513b632_79201948df92',
    threat: 'Emotet Banking Trojan Dropper Session',
    cipherCount: 19,
    extCount: 8
  },
  benign_chrome: {
    hash: 't13d1516h2_8daaf6152771_000000000000',
    threat: 'Legitimate Chrome Enterprise v128'
  },
  benign_gateway: {
    hash: 't12d080400_10402010a101_000000000000',
    threat: 'Enterprise Ingress Gateway Auth'
  }
};

const DGA_SAMPLE_NAMES = [
  'xf98kmq20a81z88pq2l.biz',
  'q9z10a992bc4910294da18.su',
  'j82k110mcz81774aa19.ru',
  'bb819c90ae123984bcfa102.cc',
  '91823719823719827398127398.tunnel.darknet-drop.org',
  'd41d8cd98f00b204e9800998ecf8427e.exfil.dnsrelay.cc'
];

export const SCENARIOS = [
  { id: 'mixed', name: 'Mixed Operational Traffic (Simulation)', description: 'Simulates nominal enterprise and critical gateway traffic with realistic background noise and occasional anomalies.' },
  { id: 'ddos_volumetric', name: 'SYN Flood & UDP Amplification Surge', description: 'Massive surge in SYN/UDP traffic with source-IP entropy approaching maximal uniformity.' },
  { id: 'botnet_c2', name: 'Botnet C2 Periodic Beaconing', description: 'Repetitive heartbeat connections to external C2 nodes exhibiting strict periodicity and low jitter.' },
  { id: 'dga_dns_tunnel', name: 'DGA Queries & Iodine DNS Tunnel', description: 'High character entropy and massive TXT records carrying encoded data exfiltration.' },
  { id: 'encrypted_anomaly', name: 'Malware inside TLS 1.3 / QUIC', description: 'JA4 fingerprint signature matching and packet length sequence Markov anomalies without decryption.' },
  { id: 'reconnaissance', name: 'Horizontal Subnet Sweep & Port Scan', description: 'Single external source probing multiple internal hosts and operational ports.' },
  { id: 'data_exfiltration', name: 'Asymmetric Data Exfiltration Stream', description: 'Extreme outbound-to-inbound byte ratio transmitting unauthorized bulk data outbound.' }
];

// Scripted Guided Demo Steps (30-45 seconds)
export const DEMO_STEPS: DemoStep[] = [
  { stage: 1, durationSec: 6, title: 'Stage 1: Normal Traffic Baseline', description: 'Network operating under nominal conditions. Standard protocol distributions, diverse destinations, and stable Poisson arrival rates.', scenarioId: 'mixed', badge: 'NOMINAL BASELINE' },
  { stage: 2, durationSec: 6, title: 'Stage 2: Traffic Anomaly Emerging', description: 'Unidirectional ingest observes initial deviations in packet inter-arrival delays and TCP flag balances.', scenarioId: 'mixed', badge: 'ANOMALY DETECTED' },
  { stage: 3, durationSec: 7, title: 'Stage 3: Behavioral Analysis Triggered', description: 'Streaming sliding window calculates source IP entropy and byte asymmetry. Statistical Z-score exceeds baseline threshold (Z = +4.1).', scenarioId: 'ddos_volumetric', badge: 'FEATURE EXTRACTION' },
  { stage: 4, durationSec: 7, title: 'Stage 4: Threat Pattern Classified', description: 'Hybrid classifier correlates high SYN/ACK imbalance with source address dispersion: Volumetric SYN Flood identified.', scenarioId: 'ddos_volumetric', badge: 'CLASSIFICATION' },
  { stage: 5, durationSec: 7, title: 'Stage 5: Standardized Alert Raised', description: 'CRITICAL severity alert generated with 97.4% calibrated confidence. Dispatched to air-gapped SIEM bus.', scenarioId: 'ddos_volumetric', badge: 'ALERT GENERATED' },
  { stage: 6, durationSec: 8, title: 'Stage 6: Explainable Evidence Matrix', description: 'Complete feature attribution provided: Source Entropy 7.89 bits, SYN Ratio 99.4%, and zero return path compliance verified.', scenarioId: 'ddos_volumetric', badge: 'EVIDENCE VERIFIED' }
];

let globalFlowSeq = 10000;
let globalAlertSeq = 500;

export function generateSyntheticFlow(scenario: string): { flow: IngestedFlow; alert?: StandardizedAlert } {
  globalFlowSeq++;
  const now = new Date();
  const timestampIso = now.toISOString();
  const randString = Math.random().toString(36).substring(2, 7);
  const flowId = `flw-${globalFlowSeq}-${randString}`;

  let injectedThreat: ThreatClass | null = null;
  const rand = Math.random();

  if (scenario === 'ddos_volumetric') {
    injectedThreat = rand < 0.75 ? 'ddos_volumetric' : null;
  } else if (scenario === 'botnet_c2') {
    injectedThreat = rand < 0.7 ? 'botnet_c2' : null;
  } else if (scenario === 'dga_dns_tunnel') {
    injectedThreat = rand < 0.7 ? 'dga_dns_tunnel' : null;
  } else if (scenario === 'encrypted_anomaly') {
    injectedThreat = rand < 0.7 ? 'encrypted_anomaly' : null;
  } else if (scenario === 'reconnaissance') {
    injectedThreat = rand < 0.75 ? 'reconnaissance' : null;
  } else if (scenario === 'data_exfiltration') {
    injectedThreat = rand < 0.7 ? 'data_exfiltration' : null;
  } else {
    // Mixed scenario: occasional threat
    if (rand < 0.25) {
      const threats: ThreatClass[] = ['ddos_volumetric', 'botnet_c2', 'dga_dns_tunnel', 'encrypted_anomaly', 'reconnaissance', 'data_exfiltration'];
      injectedThreat = threats[Math.floor(Math.random() * threats.length)];
    }
  }

  let fiveTuple: FiveTuple;
  let bytesOut = Math.floor(600 + Math.random() * 3200);
  let bytesIn = Math.floor(3500 + Math.random() * 28000);
  let packetsOut = Math.floor(4 + Math.random() * 16);
  let packetsIn = Math.floor(12 + Math.random() * 45);
  let durationMs = Math.floor(95 + Math.random() * 1800);
  let applicationGuess = 'HTTPS';

  const packetLengthSequence = [584, 1420, 1420, 312, 1420, 120];
  const interArrivalTimesMs = [12.4, 2.1, 0.8, 14.2, 1.9, 0.4];

  if (injectedThreat === 'ddos_volumetric') {
    const isUdp = Math.random() > 0.5;
    if (isUdp) {
      fiveTuple = {
        srcIp: `198.51.100.${Math.floor(1 + Math.random() * 250)}`,
        srcPort: Math.random() > 0.5 ? 123 : 389,
        dstIp: '10.140.2.88',
        dstPort: Math.floor(20000 + Math.random() * 30000),
        protocol: 'UDP'
      };
      bytesIn = Math.floor(450000 + Math.random() * 950000);
      bytesOut = 64;
      packetsIn = Math.floor(800 + Math.random() * 1500);
      packetsOut = 1;
      applicationGuess = fiveTuple.srcPort === 123 ? 'NTP Amplification' : 'CLDAP Reflection';
    } else {
      fiveTuple = {
        srcIp: `${Math.floor(11 + Math.random() * 210)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        srcPort: Math.floor(1024 + Math.random() * 64000),
        dstIp: '10.140.2.1',
        dstPort: 443,
        protocol: 'TCP'
      };
      bytesOut = 60;
      bytesIn = 0;
      packetsOut = 1;
      packetsIn = 0;
      durationMs = 6;
      applicationGuess = 'TCP SYN Flood';
    }
  } else if (injectedThreat === 'botnet_c2') {
    fiveTuple = {
      srcIp: '10.140.4.112',
      srcPort: 49812,
      dstIp: '194.26.29.112',
      dstPort: 8443,
      protocol: 'TCP'
    };
    bytesOut = 340;
    bytesIn = 180;
    packetsOut = 4;
    packetsIn = 3;
    durationMs = 54;
    applicationGuess = 'Cobalt Strike Beacon';
  } else if (injectedThreat === 'dga_dns_tunnel') {
    fiveTuple = {
      srcIp: '10.140.10.45',
      srcPort: Math.floor(40000 + Math.random() * 20000),
      dstIp: '10.140.0.2',
      dstPort: 53,
      protocol: 'UDP'
    };
    bytesOut = Math.floor(1800 + Math.random() * 4500);
    bytesIn = Math.floor(2200 + Math.random() * 8000);
    packetsOut = 12;
    packetsIn = 14;
    applicationGuess = 'DNS Tunneling';
  } else if (injectedThreat === 'encrypted_anomaly') {
    fiveTuple = {
      srcIp: '10.140.8.219',
      srcPort: Math.floor(51000 + Math.random() * 10000),
      dstIp: '45.154.255.89',
      dstPort: 443,
      protocol: 'TCP'
    };
    bytesOut = 14200;
    bytesIn = 48900;
    packetsOut = 32;
    packetsIn = 44;
    applicationGuess = 'TLS 1.3 C2 Implant';
  } else if (injectedThreat === 'reconnaissance') {
    fiveTuple = {
      srcIp: '185.220.101.5',
      srcPort: 39811,
      dstIp: `10.140.${Math.floor(Math.random() * 4)}.${Math.floor(1 + Math.random() * 254)}`,
      dstPort: Math.random() > 0.5 ? 502 : 44818,
      protocol: 'TCP'
    };
    bytesOut = 54;
    bytesIn = 0;
    packetsOut = 1;
    packetsIn = 0;
    durationMs = 4;
    applicationGuess = 'Port Recon Sweep';
  } else if (injectedThreat === 'data_exfiltration') {
    fiveTuple = {
      srcIp: '10.140.1.50',
      srcPort: 58920,
      dstIp: '162.243.14.92',
      dstPort: 443,
      protocol: 'TCP'
    };
    bytesOut = Math.floor(4800000 + Math.random() * 12000000);
    bytesIn = Math.floor(24000 + Math.random() * 45000);
    packetsOut = Math.floor(3400 + Math.random() * 8000);
    packetsIn = 180;
    durationMs = 14200;
    applicationGuess = 'HTTPS Exfiltration';
  } else {
    // Normal traffic
    const benignSources = ['10.140.1.10', '10.140.1.15', '10.140.2.4', '10.140.3.8', '10.140.4.50'];
    const benignDests = ['142.250.190.46', '13.107.42.14', '151.101.65.140', '10.140.0.10'];
    fiveTuple = {
      srcIp: benignSources[Math.floor(Math.random() * benignSources.length)],
      srcPort: Math.floor(32768 + Math.random() * 30000),
      dstIp: benignDests[Math.floor(Math.random() * benignDests.length)],
      dstPort: Math.random() > 0.3 ? 443 : 53,
      protocol: Math.random() > 0.2 ? 'TCP' : 'UDP'
    };
    applicationGuess = fiveTuple.dstPort === 443 ? 'HTTPS TLS 1.3' : (fiveTuple.dstPort === 53 ? 'DNS' : 'Modbus TCP');
  }

  const passiveMetadata: IngestedFlow['passiveMetadata'] = {
    packetLengthSequence,
    interArrivalTimesMs,
    tcpFlags: {
      syn: fiveTuple.protocol === 'TCP',
      ack: injectedThreat !== 'ddos_volumetric' && injectedThreat !== 'reconnaissance',
      fin: false,
      rst: false,
      psh: Math.random() > 0.5,
      urg: false
    }
  };

  if (fiveTuple.protocol === 'TCP' && (fiveTuple.dstPort === 443 || fiveTuple.dstPort === 8443)) {
    if (injectedThreat === 'encrypted_anomaly') {
      passiveMetadata.tlsMetadata = {
        sni: 'cloud-telemetry-cdn.service-metrics.xyz',
        ja3: '72c039320224a30d3ff1e8b0c9ac4556',
        ja4: JA4_DATABASE.cobalt_strike.hash,
        cipherSuitesCount: 15,
        extensionsCount: 16,
        alpn: 'h2'
      };
    } else {
      passiveMetadata.tlsMetadata = {
        sni: 'api.enterprise-gateway.internal',
        ja3: 'b32309a26951912be7dba376398abcde',
        ja4: JA4_DATABASE.benign_chrome.hash,
        cipherSuitesCount: 22,
        extensionsCount: 14,
        alpn: 'h2,http/1.1'
      };
    }
  }

  if (fiveTuple.dstPort === 53) {
    if (injectedThreat === 'dga_dns_tunnel') {
      const qname = DGA_SAMPLE_NAMES[Math.floor(Math.random() * DGA_SAMPLE_NAMES.length)];
      const entropy = calculateShannonEntropy(qname.split('.')[0]);
      passiveMetadata.dnsMetadata = {
        queryName: qname,
        queryType: Math.random() > 0.4 ? 'TXT' : 'A',
        queryLength: qname.length,
        labelEntropy: entropy
      };
    } else {
      passiveMetadata.dnsMetadata = {
        queryName: 'gateway.ad.infrastructure.local',
        queryType: 'A',
        queryLength: 32,
        labelEntropy: 2.14
      };
    }
  }

  const flow: IngestedFlow = {
    flowId,
    timestamp: timestampIso,
    fiveTuple,
    durationMs,
    bytesOut,
    bytesIn,
    packetsOut,
    packetsIn,
    passiveMetadata,
    applicationGuess,
    isAnomaly: !!injectedThreat
  };

  let alert: StandardizedAlert | undefined = undefined;

  if (injectedThreat) {
    globalAlertSeq++;
    const alertIdRand = Math.random().toString(36).substring(2, 7);
    const alertFlowId = `ALT-${now.getFullYear()}-${globalAlertSeq}-${alertIdRand}`;
    const latency = Number((2.1 + Math.random() * 1.8).toFixed(1));

    if (injectedThreat === 'ddos_volumetric') {
      const isReflect = fiveTuple.protocol === 'UDP';
      alert = {
        timestamp: timestampIso,
        flow_id: alertFlowId,
        threat_class: 'ddos_volumetric',
        threat_name: isReflect ? 'UDP Reflection / Amplification Flood' : 'TCP SYN Spoofed-Source Flood',
        severity: 'CRITICAL',
        confidence: 97.4,
        source: `${fiveTuple.srcIp}:${fiveTuple.srcPort}`,
        destination: `${fiveTuple.dstIp}:${fiveTuple.dstPort}`,
        protocol: fiveTuple.protocol,
        status: 'ACTIVE',
        evidence: {
          primary_metrics: {
            'Flow Rate': '84,210 flows/sec',
            'SYN Ratio': '99.4% SYN only',
            'Source Entropy': '7.89 bits',
            'Destination Concentration': '92%'
          },
          items: [
            { metric: 'Source IP Entropy H(S)', observed: '7.89 bits', baseline: '2.40 bits', threshold: '> 6.50 bits', explanation: 'Near-uniform randomness indicates IP spoofing across address blocks.' },
            { metric: 'SYN/ACK Imbalance', observed: '99.4% SYN only', baseline: '1:1 ratio (±5%)', threshold: '> 90% unacknowledged', explanation: 'Passive diode monitor observed massive half-open connection spikes without returns.' },
            { metric: 'Flow Rate Deviation', observed: '+840% baseline', baseline: '12,000 flows/sec', threshold: '> 300% threshold', explanation: 'Sudden Poisson arrival departure exceeding normal capacity bounds.' }
          ]
        },
        detection_reason: 'Traffic rate and SYN imbalance significantly exceed the learned normal traffic baseline.',
        metadata_only: true,
        read_only: true,
        chain_of_custody_sha256: generateSha256(`${flowId}-${timestampIso}-ddos`),
        latency_ms: latency
      };
    } else if (injectedThreat === 'botnet_c2') {
      alert = {
        timestamp: timestampIso,
        flow_id: alertFlowId,
        threat_class: 'botnet_c2',
        threat_name: 'Botnet C2 Periodic Beaconing',
        severity: 'HIGH',
        confidence: 94.1,
        source: `${fiveTuple.srcIp}:${fiveTuple.srcPort}`,
        destination: `${fiveTuple.dstIp}:${fiveTuple.dstPort}`,
        protocol: fiveTuple.protocol,
        status: 'ACTIVE',
        evidence: {
          primary_metrics: {
            'Beacon Interval': '45.02s ± 0.8s',
            'Jitter Coefficient': '1.8% (Cv = 0.018)',
            'Autocorrelation R_xx': '0.94 at tau=45s',
            'Destination Cardinality': 'Single external host'
          },
          items: [
            { metric: 'Inter-Arrival Autocorrelation', observed: 'R_xx(45s) = 0.94', baseline: 'R_xx < 0.15', threshold: 'R_xx > 0.85', explanation: 'Autocorrelation peaked at 45s, matching Cobalt Strike default sleep timers.' },
            { metric: 'Jitter Coefficient (Cv)', observed: '0.018 (1.8% Jitter)', baseline: '> 0.35 (Human web)', threshold: 'Cv < 0.08', explanation: 'Absence of stochastic human dispersion confirms programmatic agent execution.' },
            { metric: 'Destination Concentration', observed: '194.26.29.112', baseline: 'Dynamic CDNs', threshold: 'Fixed C2 IP', explanation: 'Persistent socket re-instantiation to unranked external infrastructure.' }
          ]
        },
        detection_reason: 'Passive timing analysis revealed repetitive heartbeat intervals towards a single external C2 endpoint.',
        metadata_only: true,
        read_only: true,
        chain_of_custody_sha256: generateSha256(`${flowId}-${timestampIso}-c2`),
        latency_ms: latency
      };
    } else if (injectedThreat === 'dga_dns_tunnel') {
      const qname = passiveMetadata.dnsMetadata?.queryName || 'xf98kmq20a81z88pq2l.biz';
      const entropy = passiveMetadata.dnsMetadata?.labelEntropy || 3.92;
      alert = {
        timestamp: timestampIso,
        flow_id: alertFlowId,
        threat_class: 'dga_dns_tunnel',
        threat_name: 'DGA Domain & DNS Tunnel Exfiltration',
        severity: 'HIGH',
        confidence: 95.8,
        source: `${fiveTuple.srcIp}:${fiveTuple.srcPort}`,
        destination: `${fiveTuple.dstIp}:${fiveTuple.dstPort}`,
        protocol: 'UDP',
        status: 'ACTIVE',
        evidence: {
          primary_metrics: {
            'Query Entropy': `${entropy} bits/char`,
            'Query Length': `${qname.length} chars`,
            'Perplexity Score': '184.2',
            'Record Type': passiveMetadata.dnsMetadata?.queryType || 'TXT'
          },
          items: [
            { metric: 'Query Label Shannon Entropy', observed: `${entropy} bits/char`, baseline: '< 2.65 bits/char', threshold: '> 3.75 bits/char', explanation: 'High character randomness indicates algorithmically generated string or encoded payload.' },
            { metric: 'Bigram Perplexity Anomaly', observed: '184.2', baseline: '< 35.0', threshold: '> 120.0', explanation: 'Non-natural language character transitions violating English phoneme distributions.' },
            { metric: 'TXT Byte Leakage', observed: '512 bytes / response', baseline: '< 45 bytes', threshold: '> 256 bytes', explanation: 'Payload field exploitation to tunnel outbound intelligence via DNS resolver.' }
          ]
        },
        detection_reason: `High-entropy domain query "${qname}" matches covert DNS tunneling behavior.`,
        metadata_only: true,
        read_only: true,
        chain_of_custody_sha256: generateSha256(`${flowId}-${timestampIso}-dns`),
        latency_ms: latency
      };
    } else if (injectedThreat === 'encrypted_anomaly') {
      alert = {
        timestamp: timestampIso,
        flow_id: alertFlowId,
        threat_class: 'encrypted_anomaly',
        threat_name: 'Malware in Encrypted Session (Zero Decrypt)',
        severity: 'CRITICAL',
        confidence: 96.5,
        source: `${fiveTuple.srcIp}:${fiveTuple.srcPort}`,
        destination: `${fiveTuple.dstIp}:${fiveTuple.dstPort}`,
        protocol: 'TCP',
        status: 'ACTIVE',
        evidence: {
          primary_metrics: {
            'JA4 Fingerprint': JA4_DATABASE.cobalt_strike.hash,
            'Markov PLS Log-Likelihood': '-48.2',
            'ClientHello Size': '384 bytes',
            'Zero Decryption': 'Verified 100%'
          },
          items: [
            { metric: 'JA4 Signature Match', observed: JA4_DATABASE.cobalt_strike.hash, baseline: 'Browser JA4', threshold: 'Threat IOC Hash', explanation: 'Cleartext ClientHello parameters match known Cobalt Strike malleable C2 profile.' },
            { metric: 'Packet Length Sequence Markov', observed: 'Log-Likelihood: -48.2', baseline: '> -20.0', threshold: '< -30.0', explanation: 'First 10 packet size transitions follow command staging rather than HTML browsing.' },
            { metric: 'SNI Domain Profile', observed: 'Newly Registered Domain', baseline: 'Aged Infrastructure', threshold: 'NRD Age < 5 days', explanation: 'Ephemeral bulletproof infrastructure hosting TLS endpoint.' }
          ]
        },
        detection_reason: 'TLS 1.3 ClientHello metadata and packet length Markov sequence flagged malicious implant without decrypting payload.',
        metadata_only: true,
        read_only: true,
        chain_of_custody_sha256: generateSha256(`${flowId}-${timestampIso}-tls`),
        latency_ms: latency
      };
    } else if (injectedThreat === 'reconnaissance') {
      alert = {
        timestamp: timestampIso,
        flow_id: alertFlowId,
        threat_class: 'reconnaissance',
        threat_name: 'Subnet Sweep & Port Reconnaissance',
        severity: 'MEDIUM',
        confidence: 89.3,
        source: `${fiveTuple.srcIp}:${fiveTuple.srcPort}`,
        destination: `${fiveTuple.dstIp}:${fiveTuple.dstPort}`,
        protocol: 'TCP',
        status: 'ACTIVE',
        evidence: {
          primary_metrics: {
            'Target Host Fan-Out': '840 hosts/sec',
            'Target Ports': '502 (Modbus), 44818',
            'SYN Only Ratio': '100%',
            'Scan Dispersion': '0.92'
          },
          items: [
            { metric: 'Host Fan-Out Cardinality', observed: '840 hosts/sec', baseline: '< 5 hosts/sec', threshold: '> 50 hosts/sec', explanation: 'HyperLogLog streaming sketch detected horizontal sweep across internal subnets.' },
            { metric: 'Industrial Port Targeting', observed: 'Port 502 & 44818', baseline: 'Standard Web (80/443)', threshold: 'OT/ICS Ports', explanation: 'Scanner probing specialized operational protocol ports.' },
            { metric: 'SYN-to-Data Ratio', observed: '100% SYN (0 data bytes)', baseline: '< 2%', threshold: '> 80%', explanation: 'Half-open stealth reconnaissance attempting service discovery.' }
          ]
        },
        detection_reason: 'Automated horizontal sweep detected probing multiple internal operational endpoints.',
        metadata_only: true,
        read_only: true,
        chain_of_custody_sha256: generateSha256(`${flowId}-${timestampIso}-recon`),
        latency_ms: latency
      };
    } else if (injectedThreat === 'data_exfiltration') {
      const ratio = (bytesOut / bytesIn).toFixed(1);
      alert = {
        timestamp: timestampIso,
        flow_id: alertFlowId,
        threat_class: 'data_exfiltration',
        threat_name: 'Asymmetric Data Exfiltration Anomaly',
        severity: 'CRITICAL',
        confidence: 96.2,
        source: `${fiveTuple.srcIp}:${fiveTuple.srcPort}`,
        destination: `${fiveTuple.dstIp}:${fiveTuple.dstPort}`,
        protocol: 'TCP',
        status: 'ACTIVE',
        evidence: {
          primary_metrics: {
            'Out/In Byte Ratio': `${ratio} : 1`,
            'Egress Sliced Volume': `${(bytesOut / 1024 / 1024).toFixed(1)} MB`,
            'Volume Z-Score': 'Z = +4.82',
            'Duration': `${durationMs} ms`
          },
          items: [
            { metric: 'Directional Byte Ratio (B_out / B_in)', observed: `${ratio} : 1 (Outbound dominant)`, baseline: '0.12 : 1 (Inbound dominant)', threshold: '> 10.0 : 1', explanation: 'Extreme directional inversion. Enterprise clients usually download far more data than they egress.' },
            { metric: 'Transfer Volume Z-Score', observed: 'Z = +4.82', baseline: '|Z| < 2.0', threshold: '|Z| > 3.0', explanation: 'Statistical extreme outlier relative to historical single-socket transfer volumes.' },
            { metric: 'Destination Autonomous System', observed: 'Unclassified VPS Provider', baseline: 'Approved Cloud Storage', threshold: 'Untrusted ASN', explanation: 'Egress endpoint does not belong to authorized backup or cloud infrastructure.' }
          ]
        },
        detection_reason: `Abnormal outbound-to-inbound byte ratio (${ratio}:1) indicating unauthorized data extraction.`,
        metadata_only: true,
        read_only: true,
        chain_of_custody_sha256: generateSha256(`${flowId}-${timestampIso}-exfil`),
        latency_ms: latency
      };
    }
  }

  return { flow, alert };
}
