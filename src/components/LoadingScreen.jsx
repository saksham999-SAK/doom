import React from 'react';
import { Cpu } from 'lucide-react';

export function LoadingScreen({ progress, loadedCount, totalFrames, isLoaded }) {
  if (isLoaded) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center transition-opacity duration-700 select-none">
      {/* Background Radial Glow */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-[#0050FF]/20 to-[#00D6FF]/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        {/* Animated Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#0A0A0C] border border-white/10 flex items-center justify-center mb-6 shadow-2xl relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0050FF] to-[#00D6FF] rounded-2xl opacity-30 blur-md group-hover:opacity-60 transition-opacity" />
          <Cpu className="w-8 h-8 text-[#00D6FF] animate-pulse relative z-10" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold tracking-tight text-white mb-2">
          Initializing Engine Sequence
        </h2>
        <p className="text-xs text-white/50 mb-8 font-mono">
          Preloading high-fidelity assets...
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-[#0A0A0C] h-2 rounded-full border border-white/10 overflow-hidden relative mb-4">
          <div
            className="h-full bg-gradient-to-r from-[#0050FF] to-[#00D6FF] transition-all duration-150 rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/80 blur-[2px]" />
          </div>
        </div>

        {/* Counters */}
        <div className="flex items-center justify-between w-full text-xs font-mono text-white/60">
          <span>{progress}% Loaded</span>
          <span>
            {loadedCount} / {totalFrames} Frames
          </span>
        </div>
      </div>
    </div>
  );
}
