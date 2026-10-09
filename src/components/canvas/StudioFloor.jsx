import React from 'react';
import { ContactShadows } from '@react-three/drei';

export function StudioFloor() {
  return (
    <group position={[0, 0, 0]}>
      {/* Studio Ground Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color="#0b0d12"
          roughness={0.32}
          metalness={0.7}
          envMapIntensity={0.6}
        />
      </mesh>

      {/* Subtle Studio Concentric Rings Marking */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[3.2, 3.22, 64]} />
        <meshBasicMaterial color="#ffffff" opacity={0.06} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[4.8, 4.82, 64]} />
        <meshBasicMaterial color="#ffffff" opacity={0.03} transparent />
      </mesh>

      {/* Realistic Soft Contact Shadows Underneath Vehicle */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.85}
        scale={10}
        blur={1.8}
        far={2.5}
        resolution={1024}
        color="#000000"
      />
    </group>
  );
}
