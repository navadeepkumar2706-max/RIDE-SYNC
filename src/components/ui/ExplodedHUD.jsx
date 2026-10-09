import React, { useState } from 'react';
import { Eye, Info, Disc, Sliders, CheckCircle2 } from 'lucide-react';

export function ExplodedHUD({ explosionProgress, onExplosionSliderChange }) {
  const [selectedPart, setSelectedPart] = useState(null);

  const components = [
    {
      id: 'wing',
      label: 'SWAN-NECK REAR WING',
      category: 'AERODYNAMICS',
      metric: '860 kg Downforce',
      desc: 'Top-mounted pylons prevent turbulent air disturbance underneath the main suction aerofoil element.',
    },
    {
      id: 'hood',
      label: 'CARBON VENTED HOOD',
      category: 'COOLING / LIFT NEGATION',
      metric: 'Twin Exit Nostrils',
      desc: 'Central radiator exhaust expels hot air over the roof and around the cockpit rather than beneath the underbody.',
    },
    {
      id: 'brakes',
      label: 'CARBON CERAMIC BRAKES',
      category: 'UNSPRUNG MASS',
      metric: '410 mm Front Rotors',
      desc: '6-piston monobloc front calipers biting cross-drilled ceramic discs provide fade-free deceleration from 300+ km/h.',
    },
    {
      id: 'diffuser',
      label: 'VENTURI REAR DIFFUSER',
      category: 'GROUND EFFECT',
      metric: 'Full Underbody Sealing',
      desc: 'Smooth floor transitions into an elevated venturi ramp, extracting high-speed air to suction the chassis to the tarmac.',
    },
    {
      id: 'cockpit',
      label: 'FIA RACING MONOCOQUE',
      category: 'SAFETY & RIGIDITY',
      metric: 'Integrated Roll Cage',
      desc: 'Fixed-back full carbon bucket seats and welded structural cage place the driver at the exact rotational pivot point.',
    },
  ];

  const explodePct = Math.round(Math.min(Math.max(explosionProgress, 0), 1) * 100);

  return (
    <section className="relative min-h-[140vh] flex flex-col justify-between px-6 md:px-16 py-20 pointer-events-none">
      {/* Top Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pointer-events-auto">
        <div>
          <div className="flex items-center space-x-2">
            <span className="badge-red">EXPLODED DISASSEMBLY</span>
            <span className="text-xs font-mono text-slate-400">
              CAD PRECISION: 0.1 MM
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-2 tracking-tight">
            DECONSTRUCTED INTELLIGENCE.
          </h2>
        </div>

        {/* Live Explosion Gauge */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center space-x-5 min-w-[260px]">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                className="text-white/10"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-racing-red transition-all duration-150"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (125.6 * explodePct) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute text-xs font-mono font-bold text-white">
              {explodePct}%
            </span>
          </div>
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              ASSEMBLY STATE
            </div>
            <div className="text-sm font-semibold text-white tracking-wide">
              {explodePct > 80
                ? 'FULL EXPANSION'
                : explodePct > 20
                ? 'COMPONENT DECOUPLING'
                : 'CHASSIS COUPLED'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Component Callout Badges Floating Left */}
      <div className="my-auto py-10 max-w-sm pointer-events-auto space-y-3">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest px-1">
          SUBASSEMBLY INSPECTION
        </div>
        {components.map((c) => {
          const isSelected = selectedPart?.id === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setSelectedPart(isSelected ? null : c)}
              className={`p-3.5 rounded-xl cursor-pointer transition-all duration-300 border ${
                isSelected
                  ? 'bg-white/15 border-racing-red shadow-lg'
                  : 'glass-panel glass-panel-hover border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? 'bg-racing-red' : 'bg-white/40'
                    }`}
                  />
                  <span className="text-xs font-bold text-white tracking-wider">
                    {c.label}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {c.category}
                </span>
              </div>
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-300 animate-fadeIn">
                  <div className="font-mono text-racing-red font-semibold mb-1">
                    {c.metric}
                  </div>
                  <p className="font-light leading-relaxed">{c.desc}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Manual Override Slider for Desktop & Mobile Interaction */}
      <div className="pointer-events-auto glass-panel p-4 rounded-2xl max-w-md w-full border border-white/10 flex items-center space-x-4">
        <Sliders className="w-4 h-4 text-slate-400 shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span>MANUAL EXPLOSION OVERRIDE</span>
            <span className="text-white font-semibold">{explodePct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={explosionProgress}
            onChange={(e) =>
              onExplosionSliderChange(parseFloat(e.target.value))
            }
            className="w-full accent-racing-red bg-white/10 rounded-lg h-1.5 cursor-pointer"
          />
        </div>
      </div>
    </section>
  );
}
