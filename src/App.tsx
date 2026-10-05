/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { AlertDrawer } from './components/AlertDrawer';

// 8 Dedicated Enterprise Views
import { OverviewView } from './components/views/OverviewView';
import { LiveTrafficView } from './components/views/LiveTrafficView';
import { AlertsView } from './components/views/AlertsView';
import { ThreatsView } from './components/views/ThreatsView';
import { EvidenceView } from './components/views/EvidenceView';
import { DetectionLogicView } from './components/views/DetectionLogicView';
import { ArchitectureView } from './components/views/ArchitectureView';
import { SimulationView } from './components/views/SimulationView';

import { PageId, IngestedFlow, StandardizedAlert, SimulationMetrics } from './types/threats';
import { generateSyntheticFlow, DEMO_STEPS } from './utils/trafficEngine';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('overview');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Streaming & Simulation State
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [activeScenario, setActiveScenario] = useState<string>('mixed');
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);

  // Telemetry & Buffer State
  const [alerts, setAlerts] = useState<StandardizedAlert[]>([]);
  const [recentFlows, setRecentFlows] = useState<IngestedFlow[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<StandardizedAlert | null>(null);

  // Bounded Traffic History (last 30-40 points for smooth rendering)
  const [trafficHistory, setTrafficHistory] = useState<{ time: string; rate: number; anomalyCount: number }[]>([
    { time: '00:00', rate: 78000, anomalyCount: 0 },
    { time: '00:02', rate: 81000, anomalyCount: 0 },
    { time: '00:04', rate: 84000, anomalyCount: 0 },
    { time: '00:06', rate: 82000, anomalyCount: 0 },
    { time: '00:08', rate: 86000, anomalyCount: 0 },
    { time: '00:10', rate: 83000, anomalyCount: 0 },
    { time: '00:12', rate: 85000, anomalyCount: 0 }
  ]);

  // Demo Tour State
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [demoStage, setDemoStage] = useState<number>(1);
  const [demoSecondsInStage, setDemoSecondsInStage] = useState<number>(0);

  // Simulation Metrics
  const [metrics, setMetrics] = useState<SimulationMetrics>({
    mode: 'SIMULATION',
    flowsAnalyzed: 1284932,
    currentRateFlowsSec: 82400,
    currentRateMbps: 485,
    threatsDetected: 17,
    criticalAlerts: 3,
    meanConfidencePercent: 96.2,
    processingLatencyMs: 3.8,
    status: 'ACTIVE'
  });

  // Seed initial realistic data on mount
  useEffect(() => {
    const initialFlows: IngestedFlow[] = [];
    const initialAlerts: StandardizedAlert[] = [];

    const scenarios = ['mixed', 'ddos_volumetric', 'botnet_c2', 'dga_dns_tunnel', 'encrypted_anomaly', 'reconnaissance', 'data_exfiltration'];
    for (const sc of scenarios) {
      const { flow, alert } = generateSyntheticFlow(sc);
      initialFlows.push(flow);
      if (alert) initialAlerts.push(alert);
    }

    setRecentFlows(initialFlows.reverse());
    setAlerts(initialAlerts.reverse());
  }, []);

  // Continuous bounded simulation stream
  useEffect(() => {
    if (!isStreaming) return;

    const intervalTime = Math.max(250, 1100 / simulationSpeed);

    const interval = setInterval(() => {
      const batchSize = Math.random() > 0.4 ? 2 : 1;
      const newFlows: IngestedFlow[] = [];
      const newAlerts: StandardizedAlert[] = [];

      for (let i = 0; i < batchSize; i++) {
        const { flow, alert } = generateSyntheticFlow(activeScenario);
        newFlows.push(flow);
        if (alert) newAlerts.push(alert);
      }

      // Prepend and bound flows memory (max 60 flows)
      setRecentFlows((prev) => {
        const combined = [...newFlows, ...prev];
        const seen = new Set<string>();
        const deduped: IngestedFlow[] = [];
        for (const f of combined) {
          if (!seen.has(f.flowId)) {
            seen.add(f.flowId);
            deduped.push(f);
          }
        }
        return deduped.slice(0, 60);
      });

      // Prepend and bound alerts memory (max 50 alerts)
      if (newAlerts.length > 0) {
        setAlerts((prev) => {
          const combined = [...newAlerts, ...prev];
          const seen = new Set<string>();
          const deduped: StandardizedAlert[] = [];
          for (const a of combined) {
            if (!seen.has(a.flow_id)) {
              seen.add(a.flow_id);
              deduped.push(a);
            }
          }
          return deduped.slice(0, 50);
        });
      }

      // Calculate realistic rate based on active scenario
      let baseRate = 82000;
      if (activeScenario === 'ddos_volumetric') baseRate = 142000;
      else if (activeScenario === 'reconnaissance') baseRate = 96000;
      else if (activeScenario === 'data_exfiltration') baseRate = 88000;

      const randomJitter = Math.floor(Math.random() * 8000) - 4000;
      const calculatedRate = Math.max(25000, baseRate + randomJitter);
      const calculatedMbps = Math.round((calculatedRate * 780 * 8) / 1000000);

      // Update traffic history (keep last 30 points)
      const nowTime = new Date().toTimeString().slice(0, 8);
      setTrafficHistory((prev) => {
        const updated = [...prev, { time: nowTime, rate: calculatedRate, anomalyCount: newAlerts.length }];
        return updated.slice(-30);
      });

      // Update simulation metrics
      setMetrics((prev) => ({
        ...prev,
        flowsAnalyzed: prev.flowsAnalyzed + Math.round(calculatedRate * 0.1),
        currentRateFlowsSec: calculatedRate,
        currentRateMbps: calculatedMbps,
        threatsDetected: prev.threatsDetected + newAlerts.length,
        criticalAlerts: prev.criticalAlerts + newAlerts.filter(a => a.severity === 'CRITICAL').length,
        processingLatencyMs: Number((3.1 + Math.random() * 1.8).toFixed(1)),
        status: isStreaming ? 'ACTIVE' : 'PAUSED'
      }));
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isStreaming, activeScenario, simulationSpeed]);

  // Demo Mode Sequencer Timer
  useEffect(() => {
    if (!isDemoMode) return;

    const timer = setInterval(() => {
      setDemoSecondsInStage((prev) => {
        const currentStep = DEMO_STEPS.find(s => s.stage === demoStage) || DEMO_STEPS[0];
        if (prev + 1 >= currentStep.durationSec) {
          if (demoStage < DEMO_STEPS.length) {
            const nextStage = demoStage + 1;
            setDemoStage(nextStage);
            const nextStep = DEMO_STEPS.find(s => s.stage === nextStage);
            if (nextStep) setActiveScenario(nextStep.scenarioId);
          } else {
            setIsDemoMode(false);
            setDemoStage(1);
          }
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isDemoMode, demoStage]);

  const handleStartDemo = () => {
    setIsDemoMode(true);
    setDemoStage(1);
    setDemoSecondsInStage(0);
    setActivePage('overview');
    setIsStreaming(true);
    setActiveScenario(DEMO_STEPS[0].scenarioId);
  };

  const handleNextDemoStage = () => {
    if (demoStage < DEMO_STEPS.length) {
      const next = demoStage + 1;
      setDemoStage(next);
      setDemoSecondsInStage(0);
      const nextStep = DEMO_STEPS.find(s => s.stage === next);
      if (nextStep) setActiveScenario(nextStep.scenarioId);
    } else {
      setIsDemoMode(false);
      setDemoStage(1);
    }
  };

  const handleResetSimulation = () => {
    setAlerts([]);
    setRecentFlows([]);
    setTrafficHistory([]);
    setMetrics((prev) => ({
      ...prev,
      flowsAnalyzed: 0,
      threatsDetected: 0,
      criticalAlerts: 0
    }));
  };

  const handleSelectFlowForEvidence = (flow: IngestedFlow) => {
    // Find or create matching alert representation
    const matchedAlert = alerts.find(a => a.source.includes(flow.fiveTuple.srcIp) || a.destination.includes(flow.fiveTuple.dstIp));
    if (matchedAlert) {
      setSelectedAlert(matchedAlert);
    }
    setActivePage('evidence');
  };

  const handleInspectInEvidence = (alert: StandardizedAlert) => {
    setSelectedAlert(alert);
    setActivePage('evidence');
  };

  return (
    <div className="min-h-screen flex bg-[#F7F7F5] text-[#1A1D21]">
      {/* 1. FIXED LEFT SIDEBAR (Section 5, 10, 25) */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        alertCount={alerts.filter(a => a.severity === 'CRITICAL').length}
      />

      {/* 2. MAIN APPLICATION WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Simple Professional Top Bar (Section 6, 11) */}
        <TopBar
          activePage={activePage}
          metrics={metrics}
          isStreaming={isStreaming}
          setIsStreaming={setIsStreaming}
          onNavigate={setActivePage}
        />

        {/* Scrollable Main Viewport Container */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
          <div className="max-w-7xl mx-auto space-y-6">
            {activePage === 'overview' && (
              <OverviewView
                metrics={metrics}
                alerts={alerts}
                trafficHistory={trafficHistory}
                onSelectAlert={setSelectedAlert}
                onNavigate={setActivePage}
                isStreaming={isStreaming}
                onStartDemo={handleStartDemo}
              />
            )}

            {activePage === 'live_traffic' && (
              <LiveTrafficView
                metrics={metrics}
                recentFlows={recentFlows}
                trafficHistory={trafficHistory}
                isStreaming={isStreaming}
                setIsStreaming={setIsStreaming}
                activeScenario={activeScenario}
                setActiveScenario={setActiveScenario}
                simulationSpeed={simulationSpeed}
                setSimulationSpeed={setSimulationSpeed}
                onResetSimulation={handleResetSimulation}
                onSelectFlowForEvidence={handleSelectFlowForEvidence}
              />
            )}

            {activePage === 'alerts' && (
              <AlertsView
                alerts={alerts}
                onSelectAlert={setSelectedAlert}
              />
            )}

            {activePage === 'threats' && (
              <ThreatsView
                alerts={alerts}
                onSelectAlert={setSelectedAlert}
              />
            )}

            {activePage === 'evidence' && (
              <EvidenceView
                alerts={alerts}
                recentFlows={recentFlows}
                selectedAlert={selectedAlert}
                onSelectAlert={setSelectedAlert}
              />
            )}

            {activePage === 'detection_logic' && (
              <DetectionLogicView />
            )}

            {activePage === 'architecture' && (
              <ArchitectureView />
            )}

            {activePage === 'simulation' && (
              <SimulationView
                metrics={metrics}
                isStreaming={isStreaming}
                setIsStreaming={setIsStreaming}
                activeScenario={activeScenario}
                setActiveScenario={setActiveScenario}
                simulationSpeed={simulationSpeed}
                setSimulationSpeed={setSimulationSpeed}
                onResetSimulation={handleResetSimulation}
                isDemoMode={isDemoMode}
                demoStage={demoStage}
                demoSecondsInStage={demoSecondsInStage}
                onStartDemo={handleStartDemo}
                onStopDemo={() => setIsDemoMode(false)}
                onNextDemoStage={handleNextDemoStage}
              />
            )}
          </div>
        </main>
      </div>

      {/* 3. ALERT DETAIL DRAWER (Section 10 & 15) */}
      <AlertDrawer
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onInspectInEvidence={handleInspectInEvidence}
      />
    </div>
  );
}
