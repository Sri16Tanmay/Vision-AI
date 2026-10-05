import { ThreatDefinition, ThreatClass } from '../types/threats';

export const THREAT_CATALOG: Record<ThreatClass, ThreatDefinition> = {
  ddos_volumetric: {
    id: 'ddos_volumetric',
    title: 'DDoS / Volumetric',
    shortCode: 'VOL-DDOS',
    shortSummary: 'Detect SYN floods, UDP reflection, and spoofed-source link saturation.',
    whatWeObserve: 'Passively mirrored TCP handshakes and UDP datagram arrival distributions across the one-way link. We observe arrival rates, SYN-to-ACK ratios, and source IP randomness without interacting with traffic sources.',
    features: [
      'Source IP Shannon Entropy H(S)',
      'SYN-to-ACK Passive Ratio',
      'UDP Response Amplification Factor (Bytes/Packet)',
      'Flow Arrival Poisson Rate Deviation'
    ],
    detectionLogic: 'Windowed source IP frequency entropy calculation over sliding 100ms micro-slices. Normal traffic exhibits ASN clustering (H < 3.8 bits); spoofed bot floods approach maximal uniformity (H > 7.6 bits). Incomplete TCP handshakes are flagged when thousands of SYNs arrive without corresponding ACK handshakes observed.',
    exampleEvidence: [
      { metric: 'Flow Rate', observed: '84,210 flows/sec', baseline: '12,000 flows/sec', explanation: 'Massive volume surge exceeding learned moving baseline.' },
      { metric: 'SYN/ACK Ratio', observed: '99.4% SYN only', baseline: '1:1 ratio (±5%)', explanation: 'Stateless SYN flood generating half-open connection attempts.' },
      { metric: 'Source Entropy H(S)', observed: '7.89 bits', baseline: '2.40 bits', explanation: 'Near-maximal randomness characteristic of IP address spoofing.' }
    ]
  },
  botnet_c2: {
    id: 'botnet_c2',
    title: 'Botnet C2 Beaconing',
    shortCode: 'BOT-C2',
    shortSummary: 'Detect periodic command-and-control heartbeat intervals towards fixed destinations.',
    whatWeObserve: 'Connection initiation timestamps, session durations, and flow byte sizes toward repetitive external endpoints. Monitored strictly from timestamp metadata.',
    features: [
      'Inter-Arrival Time (IAT) Coefficient of Variation (Cv)',
      'Autocorrelation Peak R_xx(tau)',
      'Destination IP Concentration Index',
      'Byte Size Uniformity'
    ],
    detectionLogic: 'Discrete autocorrelation function R_xx(tau) computed on inter-arrival delays per (Source IP, Destination IP) pair. Programmatic malware timers (Cobalt Strike, Sliver, Mirai) trigger low jitter coefficients (Cv < 0.08) and distinct periodic peaks (e.g. exactly every 30s or 60s) distinct from bursty human web browsing.',
    exampleEvidence: [
      { metric: 'Beacon Interval (tau)', observed: '45.02s ± 0.8s', baseline: 'Stochastic Poisson', explanation: 'Rigid sleep timer executed by C2 agent implant.' },
      { metric: 'Jitter Coefficient (Cv)', observed: '0.018 (1.8% Jitter)', baseline: '> 0.35 (Human Web)', explanation: 'Absence of human interaction indicates automated background beacon.' },
      { metric: 'Autocorrelation Peak', observed: 'R_xx(45s) = 0.94', baseline: 'R_xx < 0.15', explanation: 'High periodic recurrence confirmative of persistent C2.' }
    ]
  },
  dga_dns_tunnel: {
    id: 'dga_dns_tunnel',
    title: 'DGA & DNS Tunnelling',
    shortCode: 'DNS-EXFIL',
    shortSummary: 'Detect high-entropy algorithmically generated domains and DNS-based data exfiltration.',
    whatWeObserve: 'Unencrypted standard DNS (port 53) UDP query names, query types (A, TXT, NULL), and record payload lengths captured from the one-way link.',
    features: [
      'Query Label Character Shannon Entropy H(Q)',
      'Bigram/Trigram Language Perplexity Score',
      'Subdomain Hierarchy Depth & Length',
      'TXT/NULL Record Byte Volume Ratio'
    ],
    detectionLogic: 'Evaluates character frequency distribution of query labels against natural language n-gram dictionaries. Legitimate domains stay below 2.8 bits/char; base64/hex-encoded tunnel payloads (Iodine, dnscat2) and DGA algorithms exceed 3.75 bits/char with abnormal character transitions.',
    exampleEvidence: [
      { metric: 'Query Entropy H(Q)', observed: '3.92 bits/char', baseline: '< 2.65 bits/char', explanation: 'High character dispersion indicates encrypted/base64 encoded payload.' },
      { metric: 'Query Length', observed: '68 characters', baseline: '14 - 24 characters', explanation: 'Abnormally long subdomain carrying encoded exfiltration data.' },
      { metric: 'Record Type Anomaly', observed: 'TXT Record (512B)', baseline: 'A/AAAA Records', explanation: 'Data exfiltration utilizing DNS TXT records to bypass firewalls.' }
    ]
  },
  encrypted_anomaly: {
    id: 'encrypted_anomaly',
    title: 'Encrypted Session Anomaly',
    shortCode: 'TLS-ANOMALY',
    shortSummary: 'Detect suspicious TLS 1.3 / QUIC sessions using JA4 fingerprints without decrypting payload.',
    whatWeObserve: 'Cleartext ClientHello handshake bytes (protocol version, cipher suite lists, extensions, ALPN) and subsequent packet length sequences (PLS). We never touch encrypted payload bytes or inspect private keys.',
    features: [
      'JA4 / JA3 Fingerprint Hash Matching',
      'ClientHello Cipher Suite Order & Count',
      'Packet Length Sequence (PLS) Markov Transitions',
      'Initial Burst Inter-Arrival Delays'
    ],
    detectionLogic: 'Extracts cleartext ClientHello metadata before session encryption keys are negotiated. Matches JA4 hashes against known threat intelligence IOCs (Cobalt Strike, Emotet, Sliver). First 10 packet length transitions are scored using pre-trained discrete Markov transition matrices.',
    exampleEvidence: [
      { metric: 'JA4 Fingerprint', observed: 't13d1516h2_8daaf6152771_b186095e22b6', baseline: 'Standard Browser JA4', explanation: 'Signature matches Cobalt Strike Malleable C2 over TLS 1.3.' },
      { metric: 'Markov PLS Score', observed: 'Log-Likelihood: -48.2', baseline: '> -20.0 (Web Browsing)', explanation: 'Packet length progression conforms to C2 staging rather than HTML.' },
      { metric: 'Zero Decryption', observed: 'Verified 100%', baseline: 'Metadata Only', explanation: 'Payload remains fully encrypted; detection made strictly from handshake structure.' }
    ]
  },
  reconnaissance: {
    id: 'reconnaissance',
    title: 'Reconnaissance & Port Scanning',
    shortCode: 'RECON-SCAN',
    shortSummary: 'Detect horizontal subnet sweeps and vertical service port probes.',
    whatWeObserve: 'Source-to-destination cardinality graphs, destination port diversity, and connection completion ratios across the passive link.',
    features: [
      'Source-to-Destination Cardinality (Unique Dst IPs / sec)',
      'Source-to-Port Cardinality (Unique Ports / Host)',
      'SYN-Only Incomplete Handshake Ratio',
      'Target Dispersion Index'
    ],
    detectionLogic: 'Streaming HyperLogLog cardinality counters tracking unique destination IP addresses and ports per source IP in sliding 500ms windows. Rapid probes with high host dispersion indicate horizontal sweeps (Masscan/ZMap); sequential port sequences indicate vertical scans (Nmap).',
    exampleEvidence: [
      { metric: 'Host Fan-Out Rate', observed: '840 hosts / sec', baseline: '< 5 hosts / sec', explanation: 'Rapid horizontal sweep across internal subnet range.' },
      { metric: 'Targeted Ports', observed: 'Port 502 (Modbus), 44818 (EtherNet/IP)', baseline: 'Port 443 / 80', explanation: 'Targeted enumeration of operational SCADA protocols.' },
      { metric: 'Handshake Rate', observed: '100% SYN only (0 data)', baseline: '> 95% full sessions', explanation: 'Half-open stealth port scanning technique.' }
    ]
  },
  data_exfiltration: {
    id: 'data_exfiltration',
    title: 'Data Exfiltration',
    shortCode: 'DATA-EXFIL',
    shortSummary: 'Detect abnormal outbound-to-inbound byte ratios and sustained egress transfer bursts.',
    whatWeObserve: 'Layer 3/4 octet volume counters exported passively in flow records. Compares outbound bytes vs inbound bytes across individual flow lifetimes.',
    features: [
      'Outbound-to-Inbound Byte Ratio (B_out / B_in)',
      'Transfer Duration vs Volume Z-Score',
      'Destination ASN Historical Rarity',
      'Single Session Egress Magnitude'
    ],
    detectionLogic: 'Standard enterprise traffic is heavily inbound-dominant (downloading pages/updates, typical ratio 0.05 - 0.2). Data exfiltration reverses this directional ratio (B_out / B_in > 10.0 to 100.0) combined with prolonged high-volume single-socket connections to rare external endpoints.',
    exampleEvidence: [
      { metric: 'Out/In Byte Ratio', observed: '84.2 : 1 (Egress heavy)', baseline: '0.12 : 1 (Ingress heavy)', explanation: 'Extreme directional byte inversion indicating bulk data transfer.' },
      { metric: 'Egress Volume', observed: '8.4 GB in single stream', baseline: '< 15 MB / flow', explanation: 'Sustained full-MTU packet stream leaving internal database host.' },
      { metric: 'Volume Z-Score', observed: 'Z = +4.82', baseline: '|Z| < 2.0', explanation: 'Statistical extreme outlier relative to baseline historical traffic.' }
    ]
  }
};
