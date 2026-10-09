import React from 'react';
import { Wind, Shield, Zap, Layers } from 'lucide-react';

export function EngineeringSection() {
  const pillars = [
    {
      icon: Wind,
      title: 'AERODYNAMICS',
      subtitle: 'Swan-Neck & Ground Effect',
      desc: 'Top-hung rear wing mounts preserve clean under-wing laminar airflow, generating up to 860 kg of functional downforce at speed.',
    },
    {
      icon: Shield,
      title: 'MONOCOQUE',
      subtitle: 'Carbon Composite Tub',
      desc: 'Extruded aluminum and carbon-fiber passenger cell provides uncompromising torsional stiffness with minimal tare mass.',
    },
    {
      icon: Zap,
      title: 'POWERTRAIN',
      subtitle: '4.0L High-Rev Boxer',
      desc: 'Naturally aspirated flat-six equipped with individual throttle butterflies, singing to an exhilarating 9,000 RPM track redline.',
    },
    {
      icon: Layers,
      title: 'CHASSIS KINEMATICS',
      subtitle: 'Double-Wishbone Front Axle',
      desc: 'Motorsport-derived double-wishbone geometry eliminates brake-dive and guarantees maximum contact patch under heavy lateral G-forces.',
    },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 py-24 pointer-events-none">
      <div className="max-w-6xl mx-auto w-full pointer-events-auto">
        {/* Section Header */}
        <div className="mb-14">
          <div className="flex items-center space-x-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-racing-red animate-pulse" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              PHASE 02 // STRUCTURAL ANATOMY
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4">
            EVERY COMPONENT.
            <br />
            <span className="text-metallic">A PURPOSE.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-light">
            No ornamental styling. Every contour, duct, and intake is sculpted to master the physics of air, cooling, and mechanical grip on the racing circuit.
          </p>
        </div>

        {/* 4 Pillars Grid with Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 text-slate-300 group-hover:text-racing-red group-hover:border-racing-red/50 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    {pillar.title}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {pillar.subtitle}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>SPEC 0{idx + 1}</span>
                  <span className="text-racing-red opacity-0 group-hover:opacity-100 transition-opacity">
                    ACTIVE
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
