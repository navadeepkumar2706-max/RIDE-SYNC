import React, { useEffect, useState } from 'react';

export function Loader({ onLoadComplete }) {
  const [progress, setProgress] = useState(15);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(55), 200);
    const timer2 = setTimeout(() => setProgress(85), 500);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          onLoadComplete?.();
        }, 600);
      }, 400);
    }, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onLoadComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080a] transition-opacity duration-700 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center max-w-sm w-full px-8">
        {/* Monogram */}
        <div className="text-4xl font-black tracking-tighter text-white mb-6 font-sans">
          GT<span className="text-racing-red">3</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-4 relative">
          <div
            className="h-full bg-racing-red transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] font-mono text-slate-400 uppercase tracking-widest">
          <span>CALIBRATING 3D ENVIRONMENT</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
