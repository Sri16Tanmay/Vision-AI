import React, { useState } from 'react';
import { StandardizedAlert, AlertSeverity, ThreatClass, AlertStatus } from '../../types/threats';
import { Search, Filter, Eye, ArrowUpDown } from 'lucide-react';

interface AlertsViewProps {
  alerts: StandardizedAlert[];
  onSelectAlert: (alert: StandardizedAlert) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ alerts, onSelectAlert }) => {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [threatFilter, setThreatFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const filteredAlerts = alerts
    .filter((a) => {
      if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
      if (threatFilter !== 'ALL' && a.threat_class !== threatFilter) return false;
      if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          a.flow_id.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q) ||
          a.destination.toLowerCase().includes(q) ||
          a.threat_name.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortAsc) {
        return a.timestamp.localeCompare(b.timestamp);
      }
      return b.timestamp.localeCompare(a.timestamp);
    });

  const getSeverityBadge = (sev: AlertSeverity) => {
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
    <div className="space-y-4">
      {/* 1. FILTER BAR (Section 12) */}
      <div className="bg-white border border-[#D9DDE3] rounded p-3.5 shadow-xs font-mono text-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#667085] absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search IP, flow ID, threat..."
            className="w-full pl-8 pr-3 py-1.5 rounded bg-[#F7F7F5] border border-[#D9DDE3] text-[#1A1D21] text-xs focus:outline-none focus:border-[#C9A227]"
          />
        </div>

        {/* Severity Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[#667085] text-[11px]">SEVERITY:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors text-[11px] ${
                severityFilter === sev
                  ? 'bg-[#FAF6EC] text-[#9A7615] font-bold border border-[#C9A227]/40'
                  : 'text-[#667085] hover:text-[#1A1D21]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Threat Category Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#667085] text-[11px]">CATEGORY:</span>
          <select
            value={threatFilter}
            onChange={(e) => setThreatFilter(e.target.value)}
            className="bg-white border border-[#D9DDE3] rounded px-2.5 py-1 text-[#1A1D21] text-xs focus:outline-none focus:border-[#C9A227] cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="ddos_volumetric">DDoS / Volumetric</option>
            <option value="botnet_c2">Botnet C2</option>
            <option value="dga_dns_tunnel">DGA / DNS Tunnel</option>
            <option value="encrypted_anomaly">Encrypted Malware</option>
            <option value="reconnaissance">Reconnaissance</option>
            <option value="data_exfiltration">Data Exfiltration</option>
          </select>
        </div>
      </div>

      {/* 2. ALERTS TABLE */}
      <div className="bg-white border border-[#D9DDE3] rounded shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#D9DDE3] bg-[#F7F7F5] flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-1 h-3.5 bg-[#C9A227] rounded-xs" />
            <h2 className="text-sm font-semibold text-[#1A1D21] uppercase tracking-wider">
              Alert Queue
            </h2>
            <span className="text-[#667085]">
              ({filteredAlerts.length} matching events)
            </span>
          </div>

          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="text-xs text-[#667085] hover:text-[#1A1D21] flex items-center gap-1 cursor-pointer"
          >
            <ArrowUpDown className="w-3 h-3" />
            <span>Sort: {sortAsc ? 'Oldest first' : 'Latest first'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className="bg-[#F1F2F3] text-[#667085] text-[11px] border-b border-[#D9DDE3]">
              <tr>
                <th className="py-2.5 px-3">TIMESTAMP</th>
                <th className="py-2.5 px-3">FLOW ID</th>
                <th className="py-2.5 px-3">SEVERITY</th>
                <th className="py-2.5 px-3">THREAT CLASSIFICATION</th>
                <th className="py-2.5 px-3">SOURCE</th>
                <th className="py-2.5 px-3">DESTINATION</th>
                <th className="py-2.5 px-3">PROTOCOL</th>
                <th className="py-2.5 px-3 text-right">CONFIDENCE</th>
                <th className="py-2.5 px-3 text-center">STATUS</th>
                <th className="py-2.5 px-3 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F2F3] text-[12px]">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[#667085] font-sans">
                    No alerts match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert, idx) => (
                  <tr
                    key={`${alert.flow_id}-${idx}`}
                    onClick={() => onSelectAlert(alert)}
                    className="hover:bg-[#FAF6EC] hover:border-l-[2px] hover:border-[#C9A227] transition-colors cursor-pointer group"
                  >
                    <td className="py-2.5 px-3 text-[#667085] tabular-nums">
                      {alert.timestamp.split('T')[1].slice(0, 8)}
                    </td>
                    <td className="py-2.5 px-3 text-[#667085] text-[11px]">
                      {alert.flow_id}
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
                    <td className="py-2.5 px-3 text-[#667085]">
                      {alert.protocol}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700 tabular-nums">
                      {alert.confidence.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#F1F2F3] text-[#667085] border border-[#D9DDE3]">
                        {alert.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[#C9A227] group-hover:underline text-[11px] font-semibold flex items-center justify-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
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
