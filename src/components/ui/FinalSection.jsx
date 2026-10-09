import React from 'react';
import { RotateCcw, ArrowUp, CheckCircle, Sparkles } from 'lucide-react';

export function FinalSection({ onReplay }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-between px-6 md:px-16 py-24 pointer-events-none">
      <div className="max-w-4xl mx-auto w-full text-center my-auto pointer-events-auto">
        <div className="inline-flex items-center space-x-2 badge-red mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MOTORSPORT ARCHITECTURE</span>
        </div>

        <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.95] mb-8">
          BUILT FOR THE
          <br />
          <span className="text-metallic">EXTRAORDINARY.</span>
        </h2>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed mb-12">
          From downforce optimization to micro-balanced piston tolerances, the GT3 embodies pure racing devotion. Every millimeter accounted for.
        </p>

        {/* Minimal Replay Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onReplay}
            className="group px-8 py-4 rounded-full bg-white text-black font-bold text-sm tracking-wider uppercase flex items-center space-x-3 shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:bg-racing-red hover:text-white hover:shadow-[0_0_35px_rgba(225,6,0,0.5)] transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
            <span>REPLAY CINEMATIC SEQUENCE</span>
          </button>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="max-w-6xl mx-auto w-full pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400 pointer-events-auto">
        <div>
          GT3 MOTORSPORT DIGITAL ARCHIVE &copy; {new Date().getFullYear()} // ALL RIGHTS RESERVED
        </div>
        <div className="flex items-center space-x-4">
          <span>REACT 19</span>
          <span>&bull;</span>
          <span>THREE.JS & R3F</span>
          <span>&bull;</span>
          <span>GSAP SCROLLTRIGGER</span>
        </div>
      </div>
    </section>
  );
}
