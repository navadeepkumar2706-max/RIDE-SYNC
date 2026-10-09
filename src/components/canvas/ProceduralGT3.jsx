import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ProceduralGT3({ explosionProgress = 0, bodyColor = '#cbd5e1' }) {
  // Component group refs
  const hoodRef = useRef();
  const frontBumperRef = useRef();
  const rearWingRef = useRef();
  const rearBumperRef = useRef();
  const doorLRef = useRef();
  const doorRRef = useRef();
  const roofRef = useRef();
  const wheelFLRef = useRef();
  const wheelFRRef = useRef();
  const wheelRLRef = useRef();
  const wheelRRRef = useRef();
  const interiorRef = useRef();
  const chassisRef = useRef();

  // Internal smooth interpolated progress for fluid 60fps responsiveness
  const currentProgress = useRef(0);

  // Materials with premium automotive shaders
  const materials = useMemo(() => {
    return {
      paint: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(bodyColor),
        metalness: 0.88,
        roughness: 0.16,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        reflectivity: 0.95,
      }),
      carbon: new THREE.MeshStandardMaterial({
        color: 0x111317,
        metalness: 0.25,
        roughness: 0.38,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x080c14,
        metalness: 0.1,
        roughness: 0.04,
        transmission: 0.9,
        transparent: true,
        opacity: 0.9,
      }),
      redAccent: new THREE.MeshStandardMaterial({
        color: 0xe10600,
        metalness: 0.45,
        roughness: 0.25,
      }),
      rubber: new THREE.MeshStandardMaterial({
        color: 0x131417,
        metalness: 0.05,
        roughness: 0.88,
      }),
      alloy: new THREE.MeshStandardMaterial({
        color: 0x22262e,
        metalness: 0.95,
        roughness: 0.18,
      }),
      steelDisc: new THREE.MeshStandardMaterial({
        color: 0x9ca3af,
        metalness: 0.96,
        roughness: 0.2,
      }),
      exhaustTip: new THREE.MeshStandardMaterial({
        color: 0x475569,
        metalness: 0.92,
        roughness: 0.28,
      }),
      ledHeadlight: new THREE.MeshBasicMaterial({
        color: 0xffffff,
      }),
      ledTaillight: new THREE.MeshBasicMaterial({
        color: 0xff0f0f,
      }),
    };
  }, [bodyColor]);

  useFrame((_, delta) => {
    // Smooth lerp current progress to target explosionProgress
    currentProgress.current = THREE.MathUtils.damp(
      currentProgress.current,
      explosionProgress,
      12,
      delta
    );
    const p = currentProgress.current;

    // 1. Hood: explodes up and forward
    if (hoodRef.current) {
      hoodRef.current.position.set(0, 1.85 * p, 0.75 * p);
      hoodRef.current.rotation.x = 0.12 * p;
    }

    // 2. Front Bumper & Splitter: explodes forward and slightly down
    if (frontBumperRef.current) {
      frontBumperRef.current.position.set(0, -0.25 * p, 2.15 * p);
    }

    // 3. Rear Wing: explodes up and rearward
    if (rearWingRef.current) {
      rearWingRef.current.position.set(0, 1.75 * p, -1.85 * p);
      rearWingRef.current.rotation.x = -0.1 * p;
    }

    // 4. Rear Bumper & Diffuser: explodes straight back
    if (rearBumperRef.current) {
      rearBumperRef.current.position.set(0, -0.28 * p, -2.15 * p);
    }

    // 5. Left Door: explodes outward laterally with slight dihedral tilt
    if (doorLRef.current) {
      doorLRef.current.position.set(-1.85 * p, 0.35 * p, 0.1 * p);
      doorLRef.current.rotation.y = -0.32 * p;
    }

    // 6. Right Door: explodes outward laterally
    if (doorRRef.current) {
      doorRRef.current.position.set(1.85 * p, 0.35 * p, 0.1 * p);
      doorRRef.current.rotation.y = 0.32 * p;
    }

    // 7. Roof & Canopy: floats straight up into the light
    if (roofRef.current) {
      roofRef.current.position.set(0, 2.15 * p, 0);
    }

    // 8. Wheels: explode outward laterally
    if (wheelFLRef.current) wheelFLRef.current.position.x = -0.92 - 1.45 * p;
    if (wheelFRRef.current) wheelFRRef.current.position.x = 0.92 + 1.45 * p;
    if (wheelRLRef.current) wheelRLRef.current.position.x = -0.96 - 1.55 * p;
    if (wheelRRRef.current) wheelRRRef.current.position.x = 0.96 + 1.55 * p;

    // 9. Interior & Roll cage: floats slightly up
    if (interiorRef.current) {
      interiorRef.current.position.set(0, 0.45 * p, 0);
    }

    // 10. Chassis core: sinks slightly down for dramatic visual layer separation
    if (chassisRef.current) {
      chassisRef.current.position.set(0, -0.2 * p, 0);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. CHASSIS CORE / MONOCOQUE / POWERTRAIN */}
      <group ref={chassisRef}>
        {/* Carbon fiber monocoque lower chassis tub */}
        <mesh position={[0, 0.28, 0]} material={materials.carbon}>
          <boxGeometry args={[1.56, 0.26, 3.82]} />
        </mesh>
        {/* Central floor tunnel */}
        <mesh position={[0, 0.44, 0]} material={materials.carbon}>
          <boxGeometry args={[0.35, 0.18, 2.4]} />
        </mesh>
        {/* Flat-Six 4.0L High-Revving Racing Engine Block */}
        <mesh position={[0, 0.46, -0.92]} material={materials.alloy}>
          <boxGeometry args={[0.94, 0.42, 0.86]} />
        </mesh>
        {/* Carbon Airbox & Individual Throttle Bodies */}
        <mesh position={[0, 0.72, -0.92]} material={materials.carbon}>
          <boxGeometry args={[0.72, 0.16, 0.62]} />
        </mesh>
        {/* Dual Center Titanium Exhaust Tips */}
        <mesh position={[-0.09, 0.27, -2.14]} rotation={[Math.PI / 2, 0, 0]} material={materials.exhaustTip}>
          <cylinderGeometry args={[0.048, 0.048, 0.38, 24]} />
        </mesh>
        <mesh position={[0.09, 0.27, -2.14]} rotation={[Math.PI / 2, 0, 0]} material={materials.exhaustTip}>
          <cylinderGeometry args={[0.048, 0.048, 0.38, 24]} />
        </mesh>
        {/* Titanium blue exhaust heat rings */}
        <mesh position={[-0.09, 0.27, -2.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 24]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0.09, 0.27, -2.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 24]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* Double-Wishbone Suspension Arms */}
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[side * 0.65, 0.34, 1.25]} rotation={[0, 0, side * -0.28]} material={materials.alloy}>
              <cylinderGeometry args={[0.016, 0.016, 0.72, 10]} />
            </mesh>
            <mesh position={[side * 0.68, 0.36, -1.25]} rotation={[0, 0, side * -0.28]} material={materials.alloy}>
              <cylinderGeometry args={[0.016, 0.016, 0.74, 10]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 2. FRONT HOOD & RADIATOR NOSTRILS */}
      <group ref={hoodRef}>
        {/* Sloping Front Hood Panel */}
        <mesh position={[0, 0.67, 1.16]} rotation={[0.09, 0, 0]} material={materials.paint}>
          <boxGeometry args={[1.54, 0.065, 1.46]} />
        </mesh>
        {/* Recessed Dual Hood Cooling Extractors (GT3 Nostrils) */}
        {[-0.26, 0.26].map((x, i) => (
          <mesh key={i} position={[x, 0.71, 1.26]} rotation={[0.09, 0, 0]} material={materials.carbon}>
            <boxGeometry args={[0.22, 0.04, 0.5]} />
          </mesh>
        ))}
        {/* Raised Hood Creases */}
        {[-0.45, 0.45].map((x, i) => (
          <mesh key={i} position={[x, 0.71, 1.15]} rotation={[0.09, 0, 0]} material={materials.paint}>
            <boxGeometry args={[0.04, 0.03, 1.25]} />
          </mesh>
        ))}
      </group>

      {/* 3. FRONT BUMPER, SPLITTER & MATRIX HEADLIGHTS */}
      <group ref={frontBumperRef}>
        {/* Bumper Fascia */}
        <mesh position={[0, 0.38, 2.08]} material={materials.paint}>
          <boxGeometry args={[1.84, 0.35, 0.64]} />
        </mesh>
        {/* Front Radiator Main Intake Mesh */}
        <mesh position={[0, 0.28, 2.38]} material={materials.carbon}>
          <boxGeometry args={[1.15, 0.22, 0.08]} />
        </mesh>
        {/* Carbon Fiber Front Splitter with Ground Effect */}
        <mesh position={[0, 0.15, 2.3]} material={materials.carbon}>
          <boxGeometry args={[1.96, 0.038, 0.48]} />
        </mesh>
        {/* Splitter Endplate Flicks */}
        {[-0.98, 0.98].map((x, i) => (
          <mesh key={i} position={[x, 0.22, 2.36]} material={materials.carbon}>
            <boxGeometry args={[0.03, 0.14, 0.22]} />
          </mesh>
        ))}
        {/* Dual Aerodynamic Canards / Dive Planes */}
        {[-0.94, 0.94].map((x, i) => (
          <mesh key={i} position={[x, 0.36, 2.14]} rotation={[0.2, (x > 0 ? -1 : 1) * 0.4, (x > 0 ? -1 : 1) * 0.2]} material={materials.carbon}>
            <boxGeometry args={[0.025, 0.11, 0.24]} />
          </mesh>
        ))}
        {/* Quad-Point LED Matrix Headlights */}
        {[-0.66, 0.66].map((x, i) => (
          <group key={i} position={[x, 0.62, 1.88]} rotation={[0.1, (x > 0 ? -1 : 1) * 0.12, 0]}>
            <mesh material={materials.ledHeadlight}>
              <boxGeometry args={[0.28, 0.11, 0.3]} />
            </mesh>
            {/* LED Halo DRL Accents */}
            <mesh position={[0, 0, 0.16]}>
              <ringGeometry args={[0.04, 0.055, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 4. DOORS & AERO MIRRORS */}
      <group ref={doorLRef}>
        <mesh position={[-0.85, 0.58, 0.05]} material={materials.paint}>
          <boxGeometry args={[0.13, 0.52, 1.54]} />
        </mesh>
        {/* Side Sill Lower Skirt */}
        <mesh position={[-0.88, 0.22, 0.05]} material={materials.carbon}>
          <boxGeometry args={[0.1, 0.06, 1.6]} />
        </mesh>
        {/* Carbon Aero Mirror */}
        <mesh position={[-0.97, 0.82, 0.62]} material={materials.carbon}>
          <boxGeometry args={[0.18, 0.075, 0.13]} />
        </mesh>
      </group>

      <group ref={doorRRef}>
        <mesh position={[0.85, 0.58, 0.05]} material={materials.paint}>
          <boxGeometry args={[0.13, 0.52, 1.54]} />
        </mesh>
        {/* Side Sill Lower Skirt */}
        <mesh position={[0.88, 0.22, 0.05]} material={materials.carbon}>
          <boxGeometry args={[0.1, 0.06, 1.6]} />
        </mesh>
        {/* Carbon Aero Mirror */}
        <mesh position={[0.97, 0.82, 0.62]} material={materials.carbon}>
          <boxGeometry args={[0.18, 0.075, 0.13]} />
        </mesh>
      </group>

      {/* 5. ROOF & TINTED GLASS CANOPY */}
      <group ref={roofRef}>
        {/* Carbon fiber roof with aerodynamic dual-bubble depression */}
        <mesh position={[0, 1.15, -0.05]} material={materials.carbon}>
          <boxGeometry args={[1.34, 0.05, 1.48]} />
        </mesh>
        {/* Raked Windshield */}
        <mesh position={[0, 0.93, 0.72]} rotation={[-0.45, 0, 0]} material={materials.glass}>
          <boxGeometry args={[1.36, 0.46, 0.74]} />
        </mesh>
        {/* Sloping Rear Polycarbonate Screen */}
        <mesh position={[0, 0.95, -0.76]} rotation={[0.46, 0, 0]} material={materials.glass}>
          <boxGeometry args={[1.3, 0.44, 0.84]} />
        </mesh>
        {/* Left Side Window */}
        <mesh position={[-0.72, 0.95, -0.05]} rotation={[0, 0, -0.1]} material={materials.glass}>
          <boxGeometry args={[0.04, 0.35, 1.36]} />
        </mesh>
        {/* Right Side Window */}
        <mesh position={[0.72, 0.95, -0.05]} rotation={[0, 0, 0.1]} material={materials.glass}>
          <boxGeometry args={[0.04, 0.35, 1.36]} />
        </mesh>
      </group>

      {/* 6. SWAN-NECK REAR WING (MOTORSPORT DOWNFORCE) */}
      <group ref={rearWingRef}>
        {/* Swan-neck overhead upright pylons */}
        {[-0.38, 0.38].map((x, i) => (
          <mesh key={i} position={[x, 1.16, -1.68]} rotation={[-0.22, 0, 0]} material={materials.carbon}>
            <boxGeometry args={[0.038, 0.48, 0.15]} />
          </mesh>
        ))}
        {/* Main curved aerofoil blade */}
        <mesh position={[0, 1.38, -1.76]} rotation={[0.08, 0, 0]} material={materials.carbon}>
          <boxGeometry args={[2.06, 0.048, 0.5]} />
        </mesh>
        {/* Gurney flap rear edge */}
        <mesh position={[0, 1.41, -1.99]} material={materials.redAccent}>
          <boxGeometry args={[2.02, 0.022, 0.04]} />
        </mesh>
        {/* Motorsport Red Endplates */}
        {[-1.04, 1.04].map((x, i) => (
          <mesh key={i} position={[x, 1.38, -1.76]} material={materials.redAccent}>
            <boxGeometry args={[0.035, 0.32, 0.54]} />
          </mesh>
        ))}
      </group>

      {/* 7. REAR BUMPER, DIFFUSER & TAILLIGHT STRIP */}
      <group ref={rearBumperRef}>
        {/* Rear Bumper Fascia */}
        <mesh position={[0, 0.46, -1.88]} material={materials.paint}>
          <boxGeometry args={[1.9, 0.44, 0.7]} />
        </mesh>
        {/* Venturi Rear Diffuser Tunnel */}
        <mesh position={[0, 0.17, -1.98]} material={materials.carbon}>
          <boxGeometry args={[1.76, 0.12, 0.66]} />
        </mesh>
        {/* 4 Vertical Diffuser Aerodynamic Air Channels */}
        {[-0.56, -0.2, 0.2, 0.56].map((x, i) => (
          <mesh key={i} position={[x, 0.15, -2.06]} material={materials.carbon}>
            <boxGeometry args={[0.028, 0.16, 0.52]} />
          </mesh>
        ))}
        {/* Full-Width Seamless Glowing OLED Taillight Strip */}
        <mesh position={[0, 0.69, -2.14]} material={materials.ledTaillight}>
          <boxGeometry args={[1.74, 0.042, 0.05]} />
        </mesh>
      </group>

      {/* 8. WHEELS & CARBON CERAMIC BRAKES */}
      {/* Front Left */}
      <group ref={wheelFLRef} position={[-0.92, 0.35, 1.25]}>
        <DetailedWheelAssembly materials={materials} isLeft={true} />
      </group>
      {/* Front Right */}
      <group ref={wheelFRRef} position={[0.92, 0.35, 1.25]}>
        <DetailedWheelAssembly materials={materials} isLeft={false} />
      </group>
      {/* Rear Left */}
      <group ref={wheelRLRef} position={[-0.96, 0.37, -1.25]}>
        <DetailedWheelAssembly materials={materials} isLeft={true} isRear={true} />
      </group>
      {/* Rear Right */}
      <group ref={wheelRRRef} position={[0.96, 0.37, -1.25]}>
        <DetailedWheelAssembly materials={materials} isLeft={false} isRear={true} />
      </group>

      {/* 9. RACING COCKPIT INTERIOR & ROLL CAGE */}
      <group ref={interiorRef}>
        {/* FIA Carbon Racing Bucket Seats */}
        {[-0.34, 0.34].map((s, idx) => (
          <group key={idx}>
            <mesh position={[s, 0.66, -0.06]} rotation={[-0.22, 0, 0]} material={materials.carbon}>
              <boxGeometry args={[0.4, 0.58, 0.1]} />
            </mesh>
            <mesh position={[s, 0.41, 0.13]} material={materials.carbon}>
              <boxGeometry args={[0.4, 0.11, 0.42]} />
            </mesh>
            {/* Motorsport 6-point red harness straps */}
            {[-0.08, 0.08].map((strap, sIdx) => (
              <mesh key={sIdx} position={[s + strap, 0.65, -0.01]} rotation={[-0.22, 0, 0]} material={materials.redAccent}>
                <boxGeometry args={[0.04, 0.52, 0.015]} />
              </mesh>
            ))}
          </group>
        ))}
        {/* High-Rigidity Welded Roll Cage */}
        {[-0.62, 0.62].map((s, idx) => (
          <group key={idx}>
            <mesh position={[s, 0.78, -0.42]} rotation={[0.42, 0, 0]} material={materials.redAccent}>
              <cylinderGeometry args={[0.022, 0.022, 0.95, 12]} />
            </mesh>
          </group>
        ))}
        {/* Roll Cage Overhead Cross Brace */}
        <mesh position={[0, 1.05, -0.6]} rotation={[0, 0, Math.PI / 2]} material={materials.redAccent}>
          <cylinderGeometry args={[0.022, 0.022, 1.26, 12]} />
        </mesh>
        {/* Racing Steering Wheel with Yellow 12 o'clock Center Marker */}
        <mesh position={[-0.34, 0.72, 0.42]} rotation={[0.35, 0, 0]} material={materials.alloy}>
          <torusGeometry args={[0.13, 0.022, 10, 28]} />
        </mesh>
        <mesh position={[-0.34, 0.85, 0.42]} material={materials.redAccent}>
          <boxGeometry args={[0.03, 0.02, 0.02]} />
        </mesh>
      </group>
    </group>
  );
}

// 10-Spoke Forged Rim with Carbon Ceramic Brake Rotor and 6-Piston Caliper
function DetailedWheelAssembly({ materials, isLeft, isRear = false }) {
  const tireRadius = isRear ? 0.38 : 0.35;
  const tireWidth = isRear ? 0.33 : 0.28;
  const rimRadius = isRear ? 0.26 : 0.24;

  return (
    <group>
      {/* Matte Tire Rubber */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={materials.rubber}>
        <cylinderGeometry args={[tireRadius, tireRadius, tireWidth, 28]} />
      </mesh>

      {/* Outer Rim Lip */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={materials.alloy}>
        <cylinderGeometry args={[rimRadius, rimRadius, tireWidth + 0.015, 24]} />
      </mesh>

      {/* 10 Forged Spokes */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i * Math.PI) / 5;
        return (
          <mesh
            key={i}
            position={[isLeft ? -0.1 : 0.1, 0, 0]}
            rotation={[angle, 0, 0]}
            material={materials.alloy}
          >
            <boxGeometry args={[0.03, rimRadius * 1.8, 0.025]} />
          </mesh>
        );
      })}

      {/* Center Lock Motorsport Nut */}
      <mesh
        position={[isLeft ? -0.12 : 0.12, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={materials.redAccent}
      >
        <cylinderGeometry args={[0.045, 0.045, 0.05, 16]} />
      </mesh>

      {/* Carbon Ceramic Perforated Brake Rotor */}
      <mesh
        position={[isLeft ? 0.07 : -0.07, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={materials.steelDisc}
      >
        <cylinderGeometry args={[0.22, 0.22, 0.025, 24]} />
      </mesh>

      {/* 6-Piston Monobloc Brake Caliper in Crimson Red */}
      <mesh
        position={[isLeft ? 0.07 : -0.07, 0.13, 0.06]}
        material={materials.redAccent}
      >
        <boxGeometry args={[0.075, 0.15, 0.12]} />
      </mesh>
    </group>
  );
}
