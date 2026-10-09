import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { StudioLighting } from './StudioLighting';
import { StudioFloor } from './StudioFloor';
import { GT3Car } from './GT3Car';
import { CameraController } from './CameraController';

export function SceneContainer({
  scrollProgress = 0,
  explosionProgress = 0,
  bodyColor = '#cbd5e1',
  mousePosition = { x: 0, y: 0 },
}) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, Math.min(window.devicePixelRatio || 1, 2)]}
        camera={{
          position: [1.3, 0.45, 1.8],
          fov: 38,
          near: 0.1,
          far: 60,
        }}
      >
        <CameraController
          scrollProgress={scrollProgress}
          mousePosition={mousePosition}
        />
        <StudioLighting mousePosition={mousePosition} />
        <StudioFloor />

        <Suspense fallback={null}>
          <GT3Car
            explosionProgress={explosionProgress}
            bodyColor={bodyColor}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
