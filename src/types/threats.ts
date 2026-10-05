export type ThreatClass = 
  | 'ddos_volumetric'
  | 'botnet_c2'
  | 'dga_dns_tunnel'
  | 'encrypted_anomaly'
  | 'reconnaissance'
  | 'data_exfiltration';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type AlertStatus = 'ACTIVE' | 'INVESTIGATING' | 'RESOLVED';

export type PageId = 
  | 'overview' 
  | 'live_traffic' 
  | 'alerts' 
  | 'threats' 
  | 'evidence' 
  | 'detection_logic' 
  | 'architecture' 
  | 'simulation';

export interface FiveTuple {
  srcIp: string;
  srcPort: number;
  dstIp: string;
  dstPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'QUIC';
}

export interface PassivePacketMetadata {
  packetLengthSequence: number[];
  interArrivalTimesMs: number[];
  tcpFlags?: {
    syn: boolean;
    ack: boolean;
    fin: boolean;
    rst: boolean;
    psh: boolean;
    urg: boolean;
  };
  tlsMetadata?: {
    sni?: string;
    ja3?: string;
    ja4?: string;
    cipherSuitesCount?: number;
    extensionsCount?: number;
    alpn?: string;
  };
  dnsMetadata?: {
    queryName?: string;
    queryType?: 'A' | 'AAAA' | 'TXT' | 'NULL' | 'MX';
    queryLength?: number;
    labelEntropy?: number;
  };
}

export interface IngestedFlow {
  flowId: string;
  timestamp: string;
  fiveTuple: FiveTuple;
  durationMs: number;
  bytesOut: number;
  bytesIn: number;
  packetsOut: number;
  packetsIn: number;
  passiveMetadata: PassivePacketMetadata;
  applicationGuess: string;
  isAnomaly: boolean;
  threatClass?: ThreatClass;
}

export interface EvidenceItem {
  metric: string;
  observed: string | number;
  baseline: string | number;
  threshold: string | number;
  explanation: string;
}

export interface StandardizedAlert {
  timestamp: string;
  flow_id: string;
  threat_class: ThreatClass;
  threat_name: string;
  severity: AlertSeverity;
  confidence: number; // 0 - 100
  source: string;
  destination: string;
  protocol: string;
  status: AlertStatus;
  evidence: {
    primary_metrics: Record<string, string | number>;
    items: EvidenceItem[];
  };
  detection_reason: string;
  metadata_only: true;
  read_only: true;
  chain_of_custody_sha256: string;
  latency_ms: number;
}

export type NavPage = 'overview' | 'live_detection' | 'threats' | 'how_it_works';

export interface SimulationMetrics {
  mode: 'SIMULATION' | 'SIMULATION / REPLAY' | 'LIVE ENCLAVE' | 'PCAP REPLAY';
  flowsAnalyzed: number;
  currentRateFlowsSec: number;
  currentRateMbps: number;
  threatsDetected: number;
  criticalAlerts: number;
  meanConfidencePercent: number;
  processingLatencyMs: number;
  status: 'ACTIVE' | 'PAUSED';
}

export interface ThreatDefinition {
  id: ThreatClass;
  title: string;
  shortCode: string;
  shortSummary: string;
  whatWeObserve: string;
  features: string[];
  detectionLogic: string;
  exampleEvidence: {
    metric: string;
    observed: string;
    baseline: string;
    explanation: string;
  }[];
}

export interface DemoStep {
  stage: number;
  durationSec: number;
  title: string;
  description: string;
  scenarioId: string;
  badge: string;
}
