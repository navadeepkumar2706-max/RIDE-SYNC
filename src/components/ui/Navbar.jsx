import React from 'react';
import { Volume2, VolumeX, RotateCcw, ChevronRight } from 'lucide-react';

export function Navbar({
  activePhase,
  isMuted,
  toggleSound,
  onReplay,
  onNavigatePhase,
}) {
  const phases = [
    { id: 'hero', label: '01 / REVEAL', scrollTarget: 0 },
    { id: 'engineering', label: '02 / ARCHITECTURE', scrollTarget: 0.22 },
    { id: 'exploded', label: '03 / EXPLODED', scrollTarget: 0.42 },
    { id: 'orbit', label: '04 / 360° ORBIT', scrollTarget: 0.65 },
    { id: 'performance', label: '05 / SPECS', scrollTarget: 0.85 },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 py-5 md:px-12 flex items-center justify-between pointer-events-auto">
      {/* Brand Wordmark */}
      <div
        onClick={onReplay}
        className="flex items-center space-x-3 cursor-pointer group"
      >
        <div className="flex items-center">
          <span className="text-2xl font-black tracking-tighter text-white font-sans group-hover:text-slate-200 transition-colors">
            GT<span className="text-racing-red">3</span>
          </span>
          <span className="ml-2 text-[10px] tracking-widest text-slate-400 uppercase font-mono border-l border-white/20 pl-2 hidden sm:inline">
            STUDIO LAB
          </span>
        </div>
      </div>

      {/* Center Phase Navigation Indicator */}
      <nav className="hidden lg:flex items-center space-x-1 glass-panel px-3 py-1.5 rounded-full border border-white/10">
        {phases.map((phase) => {
          const isActive = activePhase === phase.id;
          return (
            <button
              key={phase.id}
              onClick={() => onNavigatePhase(phase.scrollTarget)}
              className={`px-3 py-1 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                isActive
                  ? 'bg-white/15 text-white font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {phase.label}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Sound & Replay */}
      <div className="flex items-center space-x-3">
        {/* Audio Ambient Toggle */}
        <button
          onClick={toggleSound}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full glass-panel glass-panel-hover text-xs font-mono tracking-wider text-slate-300 border border-white/10"
          title={isMuted ? 'Enable ambient engine audio' : 'Mute audio'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-racing-red animate-pulse" />
          )}
          <span className="hidden sm:inline">{isMuted ? 'SOUND OFF' : 'SOUND ON'}</span>
        </button>

        {/* Replay Quick Action */}
        <button
          onClick={onReplay}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full glass-panel glass-panel-hover text-xs font-mono tracking-wider text-slate-300 border border-white/10"
          title="Return to start"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
          <span className="hidden md:inline">RESET</span>
        </button>
      </div>
    </header>
  );
}
