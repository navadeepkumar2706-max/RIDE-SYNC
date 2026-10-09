import React, { useRef, useState, useEffect, useMemo, Component } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { ProceduralGT3 } from './ProceduralGT3';

// Error boundary to catch any GLTF asset load error and smoothly fall back to procedural car
class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn('GLTF load failed, using procedural GT3 fallback:', error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Subcomponent that loads and parses the GLB asset
function LoadedGLBCar({ explosionProgress, bodyColor }) {
  const { scene } = useGLTF('/assets/gt3rs.glb');
  const clone = useMemo(() => scene.clone(true), [scene]);

  // Identify nodes
  const partsRef = useRef({
    hood: null,
    frontBumper: null,
    rearWing: null,
    rearBumper: null,
    doorL: null,
    doorR: null,
    roof: null,
    wheelFL: null,
    wheelFR: null,
    wheelRL: null,
    wheelRR: null,
    interior: null,
    chassis: null,
  });

  const basePositions = useRef({});
  const currentProgress = useRef(0);

  // Traverse model and identify meshes and assign materials
  useEffect(() => {
    if (!clone) return;

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Apply dynamic car paint
        if (
          child.material &&
          (child.material.name.includes('Paint') ||
            child.name.toLowerCase().includes('hood') ||
            child.name.toLowerCase().includes('door') ||
            child.name.toLowerCase().includes('fascia'))
        ) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(bodyColor),
            metalness: 0.85,
            roughness: 0.18,
            clearcoat: 1.0,
            clearcoatRoughness: 0.08,
            reflectivity: 0.9,
          });
        }
      }

      // Identify named or heuristic parts
      const name = (child.name || '').toLowerCase();
      if (name.includes('hood') && !partsRef.current.hood) partsRef.current.hood = child;
      else if (name.includes('front_bumper') && !partsRef.current.frontBumper) partsRef.current.frontBumper = child;
      else if (name.includes('rear_wing') && !partsRef.current.rearWing) partsRef.current.rearWing = child;
      else if (name.includes('rear_bumper') && !partsRef.current.rearBumper) partsRef.current.rearBumper = child;
      else if ((name.includes('door_left') || name.includes('door_l')) && !partsRef.current.doorL) partsRef.current.doorL = child;
      else if ((name.includes('door_right') || name.includes('door_r')) && !partsRef.current.doorR) partsRef.current.doorR = child;
      else if ((name.includes('roof') || name.includes('canopy')) && !partsRef.current.roof) partsRef.current.roof = child;
      else if (name.includes('wheel_fl') && !partsRef.current.wheelFL) partsRef.current.wheelFL = child;
      else if (name.includes('wheel_fr') && !partsRef.current.wheelFR) partsRef.current.wheelFR = child;
      else if (name.includes('wheel_rl') && !partsRef.current.wheelRL) partsRef.current.wheelRL = child;
      else if (name.includes('wheel_rr') && !partsRef.current.wheelRR) partsRef.current.wheelRR = child;
      else if (name.includes('interior') && !partsRef.current.interior) partsRef.current.interior = child;
      else if (name.includes('chassis') && !partsRef.current.chassis) partsRef.current.chassis = child;

      // Store base position if not stored
      if (child.id && !basePositions.current[child.id]) {
        basePositions.current[child.id] = child.position.clone();
      }
    });
  }, [clone, bodyColor]);

  useFrame((_, delta) => {
    currentProgress.current = THREE.MathUtils.damp(
      currentProgress.current,
      explosionProgress,
      12,
      delta
    );
    const p = currentProgress.current;

    const parts = partsRef.current;
    if (parts.hood && basePositions.current[parts.hood.id]) {
      const b = basePositions.current[parts.hood.id];
      parts.hood.position.set(b.x, b.y + 1.85 * p, b.z + 0.75 * p);
      parts.hood.rotation.x = 0.12 * p;
    }
    if (parts.frontBumper && basePositions.current[parts.frontBumper.id]) {
      const b = basePositions.current[parts.frontBumper.id];
      parts.frontBumper.position.set(b.x, b.y - 0.25 * p, b.z + 2.15 * p);
    }
    if (parts.rearWing && basePositions.current[parts.rearWing.id]) {
      const b = basePositions.current[parts.rearWing.id];
      parts.rearWing.position.set(b.x, b.y + 1.75 * p, b.z - 1.85 * p);
      parts.rearWing.rotation.x = -0.1 * p;
    }
    if (parts.rearBumper && basePositions.current[parts.rearBumper.id]) {
      const b = basePositions.current[parts.rearBumper.id];
      parts.rearBumper.position.set(b.x, b.y - 0.28 * p, b.z - 2.15 * p);
    }
    if (parts.doorL && basePositions.current[parts.doorL.id]) {
      const b = basePositions.current[parts.doorL.id];
      parts.doorL.position.set(b.x - 1.85 * p, b.y + 0.35 * p, b.z + 0.1 * p);
      parts.doorL.rotation.y = -0.32 * p;
    }
    if (parts.doorR && basePositions.current[parts.doorR.id]) {
      const b = basePositions.current[parts.doorR.id];
      parts.doorR.position.set(b.x + 1.85 * p, b.y + 0.35 * p, b.z + 0.1 * p);
      parts.doorR.rotation.y = 0.32 * p;
    }
    if (parts.roof && basePositions.current[parts.roof.id]) {
      const b = basePositions.current[parts.roof.id];
      parts.roof.position.set(b.x, b.y + 2.15 * p, b.z);
    }
    if (parts.wheelFL && basePositions.current[parts.wheelFL.id]) {
      const b = basePositions.current[parts.wheelFL.id];
      parts.wheelFL.position.set(b.x - 1.45 * p, b.y, b.z);
    }
    if (parts.wheelFR && basePositions.current[parts.wheelFR.id]) {
      const b = basePositions.current[parts.wheelFR.id];
      parts.wheelFR.position.set(b.x + 1.45 * p, b.y, b.z);
    }
    if (parts.wheelRL && basePositions.current[parts.wheelRL.id]) {
      const b = basePositions.current[parts.wheelRL.id];
      parts.wheelRL.position.set(b.x - 1.55 * p, b.y, b.z);
    }
    if (parts.wheelRR && basePositions.current[parts.wheelRR.id]) {
      const b = basePositions.current[parts.wheelRR.id];
      parts.wheelRR.position.set(b.x + 1.55 * p, b.y, b.z);
    }
    if (parts.interior && basePositions.current[parts.interior.id]) {
      const b = basePositions.current[parts.interior.id];
      parts.interior.position.set(b.x, b.y + 0.45 * p, b.z);
    }
    if (parts.chassis && basePositions.current[parts.chassis.id]) {
      const b = basePositions.current[parts.chassis.id];
      parts.chassis.position.set(b.x, b.y - 0.2 * p, b.z);
    }
  });

  return <primitive object={clone} />;
}

// Preload GLTF asset
try {
  useGLTF.preload('/assets/gt3rs.glb');
} catch (e) {}

// Main GT3 Car component with seamless fallback
export function GT3Car({ explosionProgress = 0, bodyColor = '#cbd5e1' }) {
  const fallback = (
    <ProceduralGT3
      explosionProgress={explosionProgress}
      bodyColor={bodyColor}
    />
  );

  return (
    <group position={[0, 0, 0]}>
      <ModelErrorBoundary fallback={fallback}>
        <React.Suspense fallback={fallback}>
          <LoadedGLBCar
            explosionProgress={explosionProgress}
            bodyColor={bodyColor}
          />
        </React.Suspense>
      </ModelErrorBoundary>
    </group>
  );
}
