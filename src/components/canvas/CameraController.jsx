import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CameraController({ scrollProgress = 0, mousePosition = { x: 0, y: 0 } }) {
  const currentPos = useRef(new THREE.Vector3(1.3, 0.45, 1.8));
  const currentTarget = useRef(new THREE.Vector3(0.2, 0.4, 0.8));

  useFrame(({ camera }, delta) => {
    const t = Math.min(Math.max(scrollProgress, 0), 1);

    const targetPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();

    // Mouse parallax offsets
    const pX = mousePosition.x * 0.35;
    const pY = mousePosition.y * 0.2;

    if (t < 0.2) {
      // Phase 1: Hero Reveal (Close-up -> Full Reveal)
      const phaseT = t / 0.2; // 0 -> 1
      const p1Start = new THREE.Vector3(1.3, 0.45, 1.8);
      const p1End = new THREE.Vector3(3.6, 1.4, 3.8);
      targetPos.lerpVectors(p1Start, p1End, phaseT);

      const lookStart = new THREE.Vector3(0.2, 0.4, 0.8);
      const lookEnd = new THREE.Vector3(0, 0.45, 0);
      targetLookAt.lerpVectors(lookStart, lookEnd, phaseT);
    } else if (t < 0.45) {
      // Phase 2: Exploded View Elevation
      const phaseT = (t - 0.2) / 0.25; // 0 -> 1
      const p2Start = new THREE.Vector3(3.6, 1.4, 3.8);
      const p2End = new THREE.Vector3(4.5, 2.7, 4.2);
      targetPos.lerpVectors(p2Start, p2End, phaseT);

      const lookStart = new THREE.Vector3(0, 0.45, 0);
      const lookEnd = new THREE.Vector3(0, 0.8, 0);
      targetLookAt.lerpVectors(lookStart, lookEnd, phaseT);
    } else if (t < 0.75) {
      // Phase 3: 360-Degree Orbit around Exploded Assembly
      const phaseT = (t - 0.45) / 0.3; // 0 -> 1
      const startAngle = Math.atan2(4.2, 4.5);
      const orbitAngle = startAngle + phaseT * Math.PI * 2;
      const radius = 6.1;

      targetPos.x = Math.cos(orbitAngle) * radius;
      targetPos.z = Math.sin(orbitAngle) * radius;
      targetPos.y = 2.7 + Math.sin(phaseT * Math.PI * 2) * 0.35;

      targetLookAt.set(0, 0.8, 0);
    } else if (t < 0.92) {
      // Phase 4: Reassembly & Transition to Rear-Quarter Track Stance
      const phaseT = (t - 0.75) / 0.17; // 0 -> 1
      const startAngle = Math.atan2(4.2, 4.5);
      const endPos = new THREE.Vector3(-3.8, 1.35, -3.6);
      const startOrbitPos = new THREE.Vector3(
        Math.cos(startAngle) * 6.1,
        2.7,
        Math.sin(startAngle) * 6.1
      );

      targetPos.lerpVectors(startOrbitPos, endPos, phaseT);

      const lookStart = new THREE.Vector3(0, 0.8, 0);
      const lookEnd = new THREE.Vector3(0, 0.5, 0);
      targetLookAt.lerpVectors(lookStart, lookEnd, phaseT);
    } else {
      // Phase 5: Low-Angle Final Hero Showcase
      const phaseT = (t - 0.92) / 0.08; // 0 -> 1
      const p5Start = new THREE.Vector3(-3.8, 1.35, -3.6);
      const p5End = new THREE.Vector3(0, 0.78, 4.4);
      targetPos.lerpVectors(p5Start, p5End, phaseT);

      const lookStart = new THREE.Vector3(0, 0.5, 0);
      const lookEnd = new THREE.Vector3(0, 0.45, 0);
      targetLookAt.lerpVectors(lookStart, lookEnd, phaseT);
    }

    // Apply mouse parallax
    targetPos.x += pX;
    targetPos.y += pY;

    // Smooth camera damping
    currentPos.current.lerp(targetPos, Math.min(delta * 4.5, 1));
    currentTarget.current.lerp(targetLookAt, Math.min(delta * 5.0, 1));

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}
