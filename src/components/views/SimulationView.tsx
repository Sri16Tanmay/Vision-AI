import React from 'react';
import { Play, Pause, RotateCcw, Compass } from 'lucide-react';
import { SimulationMetrics } from '../../types/threats';
import { SCENARIOS, DEMO_STEPS } from '../../utils/trafficEngine';

interface SimulationViewProps {
  metrics: SimulationMetrics;
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
  activeScenario: string;
  setActiveScenario: (sc: string) => void;
  simulationSpeed: number;
  setSimulationSpeed: (sp: number) => void;
  onResetSimulation: () => void;
  isDemoMode: boolean;
  demoStage: number;
  demoSecondsInStage: number;
  onStartDemo: () => void;
  onStopDemo: () => void;
  onNextDemoStage: () => void;
}

export const SimulationView: React.FC<SimulationViewProps> = ({
  isStreaming,
  setIsStreaming,
  activeScenario,
  setActiveScenario,
  simulationSpeed,
  setSimulationSpeed,
  onResetSimulation,
  isDemoMode,
  demoStage,
  demoSecondsInStage,
  onStartDemo,
  onStopDemo,
  onNextDemoStage
}) => {
  const currentDemoStep = DEMO_STEPS.find(s => s.stage === demoStage) || DEMO_STEPS[0];
  const demoRemainingSeconds = Math.max(0, currentDemoStep.durationSec - demoSecondsInStage);

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* 1. MASTER CONTROLS BAR (Section 17) */}
      <div className="bg-white border border-[#D9DDE3] rounded p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Play/Pause/Reset */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#F1F2F3] border border-[#D9DDE3]">
            <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="font-bold text-[#1A1D21]">
              {isStreaming ? 'INGEST: ACTIVE' : 'INGEST: PAUSED'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-3 py-1.5 rounded font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                isStreaming
                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              {isStreaming ? <Pause className="w-3.5 h-3.5 text-amber-700" /> : <Play className="w-3.5 h-3.5 text-emerald-700" />}
              <span>{isStreaming ? 'Pause Ingest' : 'Start Ingest'}</span>
            </button>

            <button
              onClick={onResetSimulation}
              className="px-3 py-1.5 rounded bg-white hover:bg-[#F1F2F3] text-[#667085] hover:text-[#1A1D21] border border-[#D9DDE3] cursor-pointer flex items-center gap-1.5 transition-colors"
              title="Reset simulation telemetry and alert buffers"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[#667085]">SPEED:</span>
          <div className="flex items-center gap-1 bg-[#F1F2F3] p-1 rounded border border-[#D9DDE3]">
            {[1, 2, 5].map((sp) => (
              <button
                key={sp}
                onClick={() => setSimulationSpeed(sp)}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                  simulationSpeed === sp
                    ? 'bg-[#FAF6EC] text-[#9A7615] font-bold border border-[#C9A227]/40'
                    : 'text-[#667085] hover:text-[#1A1D21]'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. SCRIPTED EVALUATOR DEMO WORKFLOW (Section 18 & 23) */}
      <div className="bg-white border border-[#C9A227]/40 rounded p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F2F3] pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#C9A227]" />
            <h2 className="text-sm font-semibold text-[#1A1D21] uppercase tracking-wider">
              Scripted Evaluator Demo Sequence (30–60 Seconds)
            </h2>
          </div>

          <button
            onClick={() => isDemoMode ? onStopDemo() : onStartDemo()}
            className={`px-3 py-1.5 rounded font-bold transition-colors cursor-pointer text-xs flex items-center gap-1.5 border ${
              isDemoMode
                ? 'bg-rose-50 text-rose-700 border-rose-300'
                : 'bg-[#FAF6EC] text-[#9A7615] border-[#C9A227]/50 hover:bg-[#F5EDD6]'
            }`}
          >
            <span>{isDemoMode ? 'Exit Demo Tour' : 'Start Guided Demo'}</span>
          </button>
        </div>

        {/* Demo Progress Bar & Stage Cards */}
        {isDemoMode && (
          <div className="p-3 rounded bg-[#FAF6EC]/60 border border-[#C9A227]/30 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#9A7615]">
                  STAGE {demoStage} of {DEMO_STEPS.length}:
                </span>
                <span className="font-bold text-[#1A1D21]">
                  {currentDemoStep.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#667085] tabular-nums">{demoRemainingSeconds}s remaining</span>
                <button
                  onClick={onNextDemoStage}
                  className="px-2 py-0.5 rounded bg-white hover:bg-[#F1F2F3] border border-[#D9DDE3] text-[11px] font-bold text-[#1A1D21] cursor-pointer"
                >
                  Next Step →
                </button>
              </div>
            </div>

            <p className="text-xs text-[#667085] font-sans leading-relaxed">
              {currentDemoStep.description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 text-[11px]">
          {DEMO_STEPS.map((s) => (
            <div
              key={s.stage}
              className={`p-2 rounded border transition-colors ${
                isDemoMode && demoStage === s.stage
                  ? 'border-[#C9A227] bg-[#FAF6EC] text-[#9A7615] font-bold'
                  : 'border-[#D9DDE3] bg-[#F7F7F5] text-[#667085]'
              }`}
            >
              <div className="text-[10px] text-[#98A2B3]">STEP {s.stage}</div>
              <div className="truncate font-semibold">{s.badge}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SIMULATION SCENARIOS SELECTOR (Section 17 & 20) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-1 h-3.5 bg-[#C9A227] rounded-xs" />
          <h2 className="text-xs font-semibold text-[#1A1D21] uppercase tracking-wider">
            Available Simulation Scenarios
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SCENARIOS.map((sc) => {
            const isSelected = activeScenario === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => setActiveScenario(sc.id)}
                className={`p-3.5 rounded border transition-all cursor-pointer shadow-xs flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'border-[#C9A227] bg-[#FAF6EC]/50'
                    : 'border-[#D9DDE3] bg-white hover:border-[#B0B7C3]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-[#1A1D21] flex items-center gap-2">
                    <span>{sc.name}</span>
                  </div>
                  {isSelected ? (
                    <span className="px-2 py-0.5 rounded bg-[#FAF6EC] text-[#9A7615] border border-[#C9A227]/40 text-[10px] font-bold">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#98A2B3] hover:underline">
                      Click to Activate
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#667085] font-sans leading-relaxed">
                  {sc.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
