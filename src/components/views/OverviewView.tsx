import React from 'react';
import { StandardizedAlert, SimulationMetrics, PageId } from '../../types/threats';
import { ArrowUpRight, ShieldAlert, Activity } from 'lucide-react';

interface OverviewViewProps {
  metrics: SimulationMetrics;
  alerts: StandardizedAlert[];
  trafficHistory: { time: string; rate: number; anomalyCount: number }[];
  onSelectAlert: (alert: StandardizedAlert) => void;
  onNavigate: (page: PageId) => void;
  isStreaming: boolean;
  onStartDemo: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  metrics,
  alerts,
  trafficHistory,
  onSelectAlert,
  onNavigate,
  isStreaming,
  onStartDemo
}) => {
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

  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const maxRate = Math.max(...trafficHistory.map(h => h.rate), 100000);

  return (
    <div className="space-y-6">
      {/* 4 Compact Metric Cards (Section 7) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
        {/* Metric 1: Flows Analyzed */}
        <div className="bg-white border border-[#D9DDE3] rounded p-4 shadow-xs hover:border-[#B0B7C3] transition-colors">
          <div className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">
            Flows Analyzed
          </div>
          <div className="text-2xl font-bold text-[#1A1D21] tabular-nums mt-1">
            {metrics.flowsAnalyzed.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#98A2B3] font-sans mt-0.5">
            Continuous passive ingest
          </div>
        </div>

        {/* Metric 2: Traffic Rate (Gold Highlighted Card - Section 7) */}
        <div className="bg-white border border-[#C9A227]/40 bg-[#FAF6EC]/30 rounded p-4 shadow-xs">
          <div className="text-[11px] text-[#9A7615] font-medium uppercase tracking-wider flex items-center justify-between">
            <span>Traffic Rate</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
          </div>
          <div className="text-2xl font-bold text-[#1A1D21] tabular-nums mt-1">
            {(metrics.currentRateFlowsSec / 1000).toFixed(1)}K <span className="text-xs text-[#667085] font-normal">flows/s</span>
          </div>
          <div className="text-[11px] text-[#667085] font-sans mt-0.5">
            ~{metrics.currentRateMbps} Mbps wire throughput
          </div>
        </div>

        {/* Metric 3: Threats Detected */}
        <div className="bg-white border border-[#D9DDE3] rounded p-4 shadow-xs hover:border-[#B0B7C3] transition-colors">
          <div className="text-[11px] text-[#667085] font-medium uppercase tracking-wider">
            Threats Detected
          </div>
          <div className="text-2xl font-bold text-[#1A1D21] tabular-nums mt-1">
            {metrics.threatsDetected}
          </div>
          <div className="text-[11px] text-[#98A2B3] font-sans mt-0.5">
            Across 6 behavioral classes
          </div>
        </div>

        {/* Metric 4: Critical Alerts */}
        <div className="bg-white border border-[#D9DDE3] rounded p-4 shadow-xs hover:border-[#B0B7C3] transition-colors">
          <div className="text-[11px] text-rose-700 font-medium uppercase tracking-wider">
            Critical
          </div>
          <div className="text-2xl font-bold text-rose-700 tabular-nums mt-1">
            {criticalCount}
          </div>
          <div className="text-[11px] text-[#98A2B3] font-sans mt-0.5">
            Immediate operator review
          </div>
        </div>
      </div>

      {/* Traffic Activity Section (Section 8) */}
      <div className="bg-white border border-[#D9DDE3] rounded p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#F1F2F3] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3.5 bg-[#C9A227] rounded-xs" />
            <h2 className="text-sm font-semibold text-[#1A1D21] uppercase tracking-wider font-mono">
              Traffic Activity
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#667085]">
              <span className="w-2.5 h-0.5 bg-[#3B82F6] inline-block" />
              <span>Traffic Rate</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#667085]">
              <span className="w-2.5 h-0.5 bg-[#D9DDE3] inline-block border-t border-dashed" />
              <span>Baseline</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-600">
              <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
              <span>Anomaly</span>
            </span>
          </div>
        </div>

        {/* Clean Line Chart */}
        <div className="h-40 w-full pt-2">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 120">
            {/* Baseline Gridlines */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F2F3" strokeDasharray="3 3" />
            <line x1="0" y1="65" x2="500" y2="65" stroke="#E4E7EC" strokeDasharray="4 4" />
            <line x1="0" y1="100" x2="500" y2="100" stroke="#F1F2F3" strokeDasharray="3 3" />

            {/* Gradient Fill under Curve */}
            <defs>
              <linearGradient id="overviewChartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {trafficHistory.length > 1 && (
              <>
                <polygon
                  points={`0,120 ${trafficHistory.map((h, i) => `${(i / (trafficHistory.length - 1)) * 500},${120 - Math.min(110, (h.rate / maxRate) * 110)}`).join(' ')} 500,120`}
                  fill="url(#overviewChartGrad)"
                />
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={trafficHistory.map((h, i) => `${(i / (trafficHistory.length - 1)) * 500},${120 - Math.min(110, (h.rate / maxRate) * 110)}`).join(' ')}
                />
                {/* Anomaly Points */}
                {trafficHistory.map((h, i) => {
                  if (h.anomalyCount === 0) return null;
                  const x = (i / (trafficHistory.length - 1)) * 500;
                  const y = 120 - Math.min(110, (h.rate / maxRate) * 110);
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#E02424"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </>
            )}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#667085] pt-2 border-t border-[#F1F2F3]">
          <span>Buffer: {trafficHistory.length} data points (Bounded memory)</span>
          <span>Inference Latency: <span className="text-[#1A1D21] font-semibold">{metrics.processingLatencyMs.toFixed(1)} ms</span></span>
        </div>
      </div>

      {/* Recent Security Alerts Table (Section 9) */}
      <div className="bg-white border border-[#D9DDE3] rounded shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#D9DDE3] bg-[#F7F7F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3.5 bg-[#C9A227] rounded-xs" />
            <h2 className="text-sm font-semibold text-[#1A1D21] uppercase tracking-wider font-mono">
              Recent Security Alerts
            </h2>
            <span className="text-xs font-mono text-[#667085]">
              ({alerts.length} logged)
            </span>
          </div>

          <button
            onClick={() => onNavigate('alerts')}
            className="text-xs font-mono text-[#C9A227] hover:text-[#9A7615] flex items-center gap-1 cursor-pointer font-semibold"
          >
            <span>View All Alerts</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className="bg-[#F1F2F3] text-[#667085] text-[11px] border-b border-[#D9DDE3]">
              <tr>
                <th className="py-2.5 px-3">TIME</th>
                <th className="py-2.5 px-3">SEVERITY</th>
                <th className="py-2.5 px-3">THREAT</th>
                <th className="py-2.5 px-3">SOURCE</th>
                <th className="py-2.5 px-3">DESTINATION</th>
                <th className="py-2.5 px-3 text-right">CONFIDENCE</th>
                <th className="py-2.5 px-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F2F3] text-[12px]">
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#667085] font-sans">
                    No active threat alerts in current monitoring buffer.
                  </td>
                </tr>
              ) : (
                alerts.slice(0, 8).map((alert, idx) => (
                  <tr
                    key={`${alert.flow_id}-${idx}`}
                    onClick={() => onSelectAlert(alert)}
                    className="hover:bg-[#FAF6EC] hover:border-l-[2px] hover:border-[#C9A227] transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3 text-[#667085] tabular-nums">
                      {alert.timestamp.split('T')[1].slice(0, 8)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#1A1D21] group-hover:text-[#9A7615] transition-colors">
                      {alert.threat_name}
                    </td>
                    <td className="py-2.5 px-3 text-[#1A1D21]">
                      {alert.source}
                    </td>
                    <td className="py-2.5 px-3 text-[#667085]">
                      {alert.destination}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700 tabular-nums">
                      {alert.confidence.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[#C9A227] group-hover:underline text-[11px] font-semibold">
                        Inspect
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
