import { useState, useRef, useEffect } from 'react';

/**
 * Web Audio API synthesizer for subtle motorsport ambient hum and UI feedback
 * Completely offline, zero external audio assets required.
 */
export function useAudio() {
  const [isMuted, setIsMuted] = useState(true);
  const audioCtxRef = useRef(null);
  const engineOscRef = useRef(null);
  const gainNodeRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtxRef.current = new AudioContext();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const toggleSound = () => {
    initAudio();
    setIsMuted((prev) => {
      const next = !prev;
      if (!next) {
        startAmbientDrone();
      } else {
        stopAmbientDrone();
      }
      return next;
    });
  };

  const startAmbientDrone = () => {
    try {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;

      // Low frequency motorsport turbine drone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(48, ctx.currentTime); // Low 48Hz flat-six idle rumble

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      engineOscRef.current = osc;
      gainNodeRef.current = gain;
    } catch (e) {
      console.warn('Audio drone error:', e);
    }
  };

  const stopAmbientDrone = () => {
    try {
      if (engineOscRef.current) {
        engineOscRef.current.stop();
        engineOscRef.current.disconnect();
        engineOscRef.current = null;
      }
    } catch (e) {}
  };

  const playClick = () => {
    if (isMuted || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  };

  // Adjust pitch based on scroll speed
  const updatePitch = (speedFactor) => {
    if (isMuted || !engineOscRef.current || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const freq = 48 + Math.min(speedFactor * 60, 120);
      engineOscRef.current.frequency.setTargetAtTime(freq, ctx.currentTime, 0.1);
    } catch (e) {}
  };

  useEffect(() => {
    return () => {
      stopAmbientDrone();
    };
  }, []);

  return { isMuted, toggleSound, playClick, updatePitch };
}
