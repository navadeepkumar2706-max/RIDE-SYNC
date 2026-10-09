import React from 'react';
import { Palette, Check } from 'lucide-react';

export function ColorCustomizer({ currentColor, onSelectColor }) {
  const colors = [
    { name: 'Arctic Liquid Silver', hex: '#cbd5e1', ring: 'border-slate-300' },
    { name: 'Obsidian Stealth Black', hex: '#1c1e22', ring: 'border-slate-600' },
    { name: 'Pure Apex White', hex: '#f8fafc', ring: 'border-white' },
    { name: 'Carmine Motorsport Red', hex: '#b91c1c', ring: 'border-red-600' },
    { name: 'Riviera Track Blue', hex: '#0284c7', ring: 'border-sky-500' },
    { name: 'Acid Competition Green', hex: '#65a30d', ring: 'border-lime-500' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 glass-panel p-2.5 rounded-full border border-white/10 flex items-center space-x-2.5 shadow-2xl">
      <div className="pl-2 pr-1 hidden sm:flex items-center space-x-1.5 text-[11px] font-mono text-slate-400">
        <Palette className="w-3.5 h-3.5 text-racing-red" />
        <span>LIVERY:</span>
      </div>

      <div className="flex items-center space-x-2">
        {colors.map((c) => {
          const isSelected = currentColor.toLowerCase() === c.hex.toLowerCase();
          return (
            <button
              key={c.hex}
              onClick={() => onSelectColor(c.hex)}
              className={`w-7 h-7 rounded-full transition-all duration-300 flex items-center justify-center relative ${
                isSelected
                  ? 'scale-110 ring-2 ring-white shadow-lg'
                  : 'hover:scale-105 opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            >
              {isSelected && (
                <Check
                  className={`w-3.5 h-3.5 ${
                    c.hex === '#f8fafc' || c.hex === '#cbd5e1'
                      ? 'text-black'
                      : 'text-white'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
