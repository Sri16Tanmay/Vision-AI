import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  ShieldAlert, 
  AlertTriangle, 
  FileSearch, 
  Cpu, 
  Network, 
  Sliders, 
  ChevronLeft, 
  ChevronRight,
  Shield
} from 'lucide-react';
import { PageId } from '../types/threats';

interface SidebarProps {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  alertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  isCollapsed,
  setIsCollapsed,
  alertCount
}) => {
  const navSections = [
    {
      title: 'MONITOR',
      items: [
        { id: 'overview' as PageId, label: 'Overview', icon: LayoutDashboard },
        { id: 'live_traffic' as PageId, label: 'Live Traffic', icon: Activity },
        { id: 'alerts' as PageId, label: 'Alerts', icon: ShieldAlert, badge: alertCount },
        { id: 'threats' as PageId, label: 'Threats', icon: AlertTriangle }
      ]
    },
    {
      title: 'ANALYSIS',
      items: [
        { id: 'evidence' as PageId, label: 'Evidence', icon: FileSearch },
        { id: 'detection_logic' as PageId, label: 'Detection Logic', icon: Cpu }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'architecture' as PageId, label: 'Architecture', icon: Network },
        { id: 'simulation' as PageId, label: 'Simulation', icon: Sliders }
      ]
    }
  ];

  return (
    <aside 
      className={`bg-white border-r border-[#D9DDE3] flex flex-col justify-between transition-all duration-200 select-none z-30 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="h-14 border-b border-[#D9DDE3] flex items-center justify-between px-3">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-[#FAF6EC] border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] font-bold text-xs">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1A1D21] font-mono tracking-tight leading-tight flex items-center gap-1.5">
                  <span>ONESIGHT AI</span>
                </div>
                <div className="text-[10px] text-[#667085] font-mono leading-none">
                  Passive Threat Detection
                </div>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="mx-auto w-7 h-7 rounded bg-[#FAF6EC] border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
              <Shield className="w-4 h-4" />
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded text-[#667085] hover:text-[#1A1D21] hover:bg-[#F1F2F3] transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="p-2 space-y-4">
          {navSections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-0.5">
              {!isCollapsed && (
                <div className="px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-[#98A2B3]">
                  {sec.title}
                </div>
              )}

              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#FAF6EC] text-[#1A1D21] font-semibold border-l-[3px] border-[#C9A227]'
                        : 'text-[#667085] hover:text-[#1A1D21] hover:bg-[#F1F2F3] border-l-[3px] border-transparent'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C9A227]' : ''}`} />
                    {!isCollapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}
                    {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 border border-rose-200 font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Status & Simplex Diode Invariant */}
      <div className="p-3 border-t border-[#D9DDE3] bg-[#F7F7F5] text-[11px] font-mono text-[#667085] space-y-2">
        {!isCollapsed ? (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>MONITORING ACTIVE</span>
            </div>
            <div className="text-[10px] text-[#98A2B3] leading-tight">
              Read-only Ingest · 0 Bps Return
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Monitoring Active: Read-Only Ingest">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};
