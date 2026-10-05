import React from 'react';
import { Compass, X, ChevronRight, CheckCircle2, Terminal } from 'lucide-react';
import { DEMO_STEPS } from '../utils/trafficEngine';

interface DemoModeBannerProps {
  currentStage: number;
  secondsInStage: number;
  onExitDemo: () => void;
  onNextStage: () => void;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({
  currentStage,
  secondsInStage,
  onExitDemo,
  onNextStage
}) => {
  const step = DEMO_STEPS.find(s => s.stage === currentStage) || DEMO_STEPS[0];
  const totalStages = DEMO_STEPS.length;
  const remainingSeconds = Math.max(0, step.durationSec - secondsInStage);
  const progressPercent = Math.min(100, (secondsInStage / step.durationSec) * 100);

  return (
    <div className="bg-[#0e1422] border-b border-[#1f2c48] px-4 sm:px-6 py-2.5 text-xs font-mono text-slate-200 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800 text-blue-300 font-bold text-[11px]">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>ANALYST EVALUATION TOUR</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-[#162035] text-cyan-300 font-bold border border-[#243558] text-[10px]">
              STEP {currentStage}/{totalStages}
            </span>
            <span className="text-white font-bold">{step.title}</span>
            <span className="text-slate-400 hidden lg:inline">· {step.description}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Stage Progress Indicators */}
          <div className="flex items-center gap-1">
            {DEMO_STEPS.map((s) => (
              <span
                key={s.stage}
                className={`w-5 h-1 rounded-xs transition-all ${
                  s.stage < currentStage
                    ? 'bg-blue-400'
                    : s.stage === currentStage
                    ? 'bg-white'
                    : 'bg-slate-800'
                }`}
                title={`Stage ${s.stage}: ${s.title}`}
              />
            ))}
          </div>

          <span className="text-slate-400 text-[11px] tabular-nums">
            {remainingSeconds}s
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onNextStage}
              className="px-2 py-0.8 rounded bg-[#18233c] hover:bg-[#223254] text-blue-200 border border-[#2b3e66] flex items-center gap-1 cursor-pointer transition-colors text-[11px] font-bold"
            >
              <span>Advance</span>
              <ChevronRight className="w-3 h-3" />
            </button>

            <button
              onClick={onExitDemo}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#18233c] cursor-pointer"
              title="Exit evaluation tour"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#141b2c] h-0.5 mt-2 rounded-full overflow-hidden">
        <div 
          className="bg-blue-500 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
