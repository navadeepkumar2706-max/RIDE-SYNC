import React from 'react';
import { Gauge, Zap, Flame, ShieldAlert, Award, Compass } from 'lucide-react';

export function PerformanceSection() {
  const specs = [
    {
      label: 'MAXIMUM POWER',
      value: '525',
      unit: 'PS',
      detail: 'At 8,500 RPM Naturally Aspirated',
      icon: Flame,
    },
    {
      label: '0–100 KM/H',
      value: '3.2',
      unit: 'S',
      detail: 'With Launch Control Active',
      icon: Zap,
    },
    {
      label: 'TOP TRACK SPEED',
      value: '296',
      unit: 'KM/H',
      detail: 'High-Downforce Aerodynamic Trim',
      icon: Gauge,
    },
    {
      label: 'PEAK DOWNFORCE',
      value: '860',
      unit: 'KG',
      detail: 'At 285 km/h with Active Aero Closed',
      icon: Compass,
    },
    {
      label: 'KERB WEIGHT',
      value: '1,450',
      unit: 'KG',
      detail: 'Full Carbon Lightweight Configuration',
      icon: Award,
    },
    {
      label: 'POWER-TO-WEIGHT',
      value: '2.76',
      unit: 'KG/PS',
      detail: 'Track Optimized Mechanical Index',
      icon: Zap,
    },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 py-24 pointer-events-none">
      <div className="max-w-6xl mx-auto w-full pointer-events-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="badge-red">BENCHMARK LAB</span>
              <span className="text-xs font-mono text-slate-400">
                TELEMETRY & DYNAMICS
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
              PERFORMANCE
              <br />
              <span className="text-metallic">UNCOMPROMISED.</span>
            </h2>
          </div>

          {/* Fictional Concept Specification Disclaimer Tag */}
          <div className="glass-panel p-4 rounded-xl border border-white/10 max-w-md">
            <div className="flex items-start space-x-2.5">
              <ShieldAlert className="w-4 h-4 text-racing-red shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                <strong className="text-white">NOTICE:</strong> Fictional concept specifications. All values and engineering figures shown are illustrative conceptual designs strictly for this 3D demonstration.
              </p>
            </div>
          </div>
        </div>

        {/* 6 High-End Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10 relative overflow-hidden group"
              >
                {/* Background Tech Watermark */}
                <span className="absolute -right-3 -bottom-4 text-7xl font-mono font-black text-white/[0.03] pointer-events-none select-none">
                  0{idx + 1}
                </span>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                    {item.label}
                  </span>
                  <Icon className="w-4 h-4 text-slate-500 group-hover:text-racing-red transition-colors" />
                </div>

                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {item.value}
                  </span>
                  <span className="text-lg font-mono text-racing-red font-bold">
                    {item.unit}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-light border-t border-white/5 pt-3 mt-2">
                  {item.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
