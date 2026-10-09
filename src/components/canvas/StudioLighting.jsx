import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function StudioLighting({ mousePosition }) {
  const spotLightRef = useRef();
  const rimLightRef = useRef();

  useFrame(() => {
    if (spotLightRef.current && mousePosition) {
      // Subtle cursor parallax on overhead spotlight
      spotLightRef.current.position.x = THREE.MathUtils.lerp(
        spotLightRef.current.position.x,
        mousePosition.x * 2.5,
        0.05
      );
      spotLightRef.current.position.z = THREE.MathUtils.lerp(
        spotLightRef.current.position.z,
        mousePosition.y * 1.5,
        0.05
      );
    }
  });

  return (
    <>
      {/* Soft Ambient Base */}
      <ambientLight intensity={0.8} color="#94a3b8" />

      {/* Main Overhead Automotive Studio Spotlight */}
      <spotLight
        ref={spotLightRef}
        position={[0, 9.5, 0.5]}
        angle={0.7}
        penumbra={0.85}
        intensity={7.5}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Primary Key Light from Front-Right 3/4 */}
      <directionalLight
        position={[5.5, 6, 6]}
        intensity={3.5}
        color="#f8fafc"
      />

      {/* High-Contrast Cool Rim Light 1 (Rear Silhouette & Roofline Definition) */}
      <directionalLight
        ref={rimLightRef}
        position={[-7, 5, -6]}
        intensity={4.8}
        color="#e0f2fe"
      />

      {/* High-Contrast Rim Light 2 (Rear-Right Shoulder Definition) */}
      <directionalLight
        position={[7, 4.5, -5]}
        intensity={3.8}
        color="#f1f5f9"
      />

      {/* Low-Angle Fill Light to Illuminate Splitter and Diffuser Underside */}
      <directionalLight
        position={[0, -1.0, 4]}
        intensity={1.2}
        color="#334155"
      />

      {/* Studio Ceiling Softbox Panels for Glossy Bodyline Reflections */}
      {/* Center Main Softbox */}
      <mesh position={[0, 7.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.5, 7.5]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>

      {/* Left Shoulder Softbox */}
      <mesh position={[-4.5, 4.5, 0]} rotation={[0, Math.PI / 4, 0]}>
        <planeGeometry args={[1.5, 8]} />
        <meshBasicMaterial color="#ffffff" opacity={0.65} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Right Shoulder Softbox */}
      <mesh position={[4.5, 4.5, 0]} rotation={[0, -Math.PI / 4, 0]}>
        <planeGeometry args={[1.5, 8]} />
        <meshBasicMaterial color="#ffffff" opacity={0.65} transparent side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}
