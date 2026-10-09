import React from 'react';
import { ChevronDown, ArrowDownRight, Compass } from 'lucide-react';

export function HeroSection({ onExploreClick }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-between px-6 md:px-16 pt-28 pb-12 pointer-events-none">
      {/* Top Tagline */}
      <div className="flex items-center space-x-3 pointer-events-auto">
        <span className="badge-red">GT3 AERODYNAMICS LAB</span>
        <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">
          CHASSIS NO. 03-EXP
        </span>
      </div>

      {/* Dominant Headline */}
      <div className="max-w-4xl mt-12 mb-auto">
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-metallic leading-[0.95] mb-6">
          ENGINEERED
          <br />
          TO PERFORM.
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 max-w-xl font-light tracking-wide leading-relaxed">
          Explore the machine. Beyond the surface.
          <span className="block text-sm text-slate-400 mt-2 font-mono">
            Scroll to trigger precision exploded-view disassembly.
          </span>
        </p>
      </div>

      {/* Bottom Bar: Key Specs Preview & Scroll Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-8 border-t border-white/10 pointer-events-auto">
        {/* Quick Highlights */}
        <div className="grid grid-cols-3 gap-6 sm:gap-12">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Output
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              525 <span className="text-xs font-normal text-slate-400">PS</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Rev Limit
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              9,000 <span className="text-xs font-normal text-slate-400">RPM</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Downforce
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              860 <span className="text-xs font-normal text-slate-400">KG</span>
            </div>
          </div>
        </div>

        {/* Scroll CTA Indicator */}
        <div
          onClick={onExploreClick}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-mono text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">
              DISASSEMBLE VEHICLE
            </span>
            <span className="block text-[11px] font-mono text-slate-500">
              SCROLL DOWN
            </span>
          </div>
          <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center border border-white/15 group-hover:border-racing-red group-hover:scale-105 transition-all">
            <ChevronDown className="w-4 h-4 text-white group-hover:text-racing-red animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
