import { Component, type ReactNode, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';
import {
  ExtrudeGeometry, Group, Mesh, MeshStandardMaterial, Shape, Vector3,
} from 'three';

type ScrollProgress = { value: number };
const getExplodedAmount = (progress: number) => {
  const enter = Math.max(0, Math.min(1, (progress - 0.38) / 0.27));
  const settle = Math.max(0, Math.min(1, (progress - 0.84) / 0.16));
  const smoothEnter = enter * enter * (3 - 2 * enter);
  const smoothSettle = settle * settle * (3 - 2 * settle);
  return smoothEnter * (1 - smoothSettle);
};

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { console.warn('RideSync 3D scene unavailable; using the accessible fallback.', error); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function CarWheel({ position, progress, outward }: { position: [number, number, number]; progress: ScrollProgress; outward: number }) {
  const root = useRef<Group>(null);
  const tire = useMemo(() => new MeshStandardMaterial({ color: '#101820', roughness: 0.78, metalness: 0.12 }), []);
  const rim = useMemo(() => new MeshStandardMaterial({ color: '#6d9ba5', roughness: 0.27, metalness: 0.82 }), []);
  useEffect(() => () => { tire.dispose(); rim.dispose(); }, [tire, rim]);
  useFrame((_, delta) => {
    if (!root.current) return;
    const eased = getExplodedAmount(progress.value);
    const [x, y, z] = position;
    const follow = Math.min(1, delta * 6);
    root.current.position.x += (x + Math.sign(x) * eased * 0.2 - root.current.position.x) * follow;
    root.current.position.y += (y + eased * 0.12 - root.current.position.y) * follow;
    root.current.position.z += (z + outward * eased * 0.52 - root.current.position.z) * follow;
  });
  return <group ref={root} position={position} rotation={[Math.PI / 2, 0, 0]}>
    <mesh material={tire} castShadow receiveShadow><cylinderGeometry args={[0.47, 0.47, 0.24, 28]} /></mesh>
    <mesh position={[0, 0.126, 0]} material={rim}><cylinderGeometry args={[0.31, 0.31, 0.018, 12]} /></mesh>
    <mesh position={[0, 0.14, 0]} material={rim}><torusGeometry args={[0.34, 0.035, 8, 24]} /></mesh>
    <mesh position={[0, 0.145, 0]}><cylinderGeometry args={[0.09, 0.09, 0.025, 12]} /><meshStandardMaterial color="#9debf0" metalness={0.7} roughness={0.22} /></mesh>
    {Array.from({ length: 5 }, (_, index) => <mesh key={index} position={[0, 0.145, 0]} rotation={[0, 0, (Math.PI * 2 * index) / 5]}>
      <boxGeometry args={[0.035, 0.27, 0.022]} /><meshStandardMaterial color="#78a5ad" metalness={0.62} roughness={0.28} />
    </mesh>)}
  </group>;
}

function CarAssembly({ progress }: { progress: ScrollProgress }) {
  const assembly = useRef<Group>(null);
  const hood = useRef<Mesh>(null);
  const cabin = useRef<Mesh>(null);
  const doorFrontL = useRef<Mesh>(null);
  const doorFrontR = useRef<Mesh>(null);
  const doorRearL = useRef<Mesh>(null);
  const doorRearR = useRef<Mesh>(null);
  const bodyGeometry = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-2.25, 0.55);
    shape.lineTo(2.25, 0.55);
    shape.quadraticCurveTo(2.4, 0.58, 2.36, 0.82);
    shape.lineTo(2.18, 0.98);
    shape.lineTo(1.55, 1.08);
    shape.lineTo(1.2, 1.38);
    shape.quadraticCurveTo(0.93, 1.59, 0.48, 1.61);
    shape.lineTo(-0.65, 1.59);
    shape.quadraticCurveTo(-1.03, 1.56, -1.34, 1.24);
    shape.lineTo(-1.72, 1.13);
    shape.lineTo(-2.15, 0.95);
    shape.quadraticCurveTo(-2.36, 0.84, -2.25, 0.55);
    const geom = new ExtrudeGeometry(shape, { depth: 1.34, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.055, bevelThickness: 0.06 });
    geom.translate(0, 0, -0.67);
    return geom;
  }, []);
  const cabinGeometry = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-1.22, 1.12);
    shape.lineTo(-0.78, 1.54);
    shape.quadraticCurveTo(-0.62, 1.71, -0.28, 1.73);
    shape.lineTo(0.54, 1.73);
    shape.quadraticCurveTo(0.82, 1.7, 1.02, 1.45);
    shape.lineTo(1.35, 1.12);
    shape.closePath();
    const geom = new ExtrudeGeometry(shape, { depth: 1.18, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.035, bevelThickness: 0.035 });
    geom.translate(0, 0, -0.59);
    return geom;
  }, []);
  const paint = useMemo(() => new MeshStandardMaterial({ color: '#317d88', metalness: 0.72, roughness: 0.24 }), []);
  const glass = useMemo(() => new MeshStandardMaterial({ color: '#12303c', emissive: '#0b2934', emissiveIntensity: 0.22, metalness: 0.5, roughness: 0.16, transparent: true, opacity: 0.91 }), []);
  const doorPaint = useMemo(() => new MeshStandardMaterial({ color: '#286976', metalness: 0.7, roughness: 0.29 }), []);
  useEffect(() => () => {
    bodyGeometry.dispose();
    cabinGeometry.dispose();
    paint.dispose();
    glass.dispose();
    doorPaint.dispose();
  }, [bodyGeometry, cabinGeometry, paint, glass, doorPaint]);

  useFrame((_, delta) => {
    const split = getExplodedAmount(progress.value);
    const follow = Math.min(1, delta * 6);
    const approach = (ref: { current: Mesh | null }, position: [number, number, number]) => {
      if (!ref.current) return;
      ref.current.position.x += (position[0] - ref.current.position.x) * follow;
      ref.current.position.y += (position[1] - ref.current.position.y) * follow;
      ref.current.position.z += (position[2] - ref.current.position.z) * follow;
    };
    approach(hood, [1.46 + split * 0.48, 1.015 + split * 0.66, 0]);
    approach(cabin, [0, 1.2 + split * 0.58, 0]);
    approach(doorFrontL, [0.55, 0.82 + split * 0.05, 0.69 + split * 0.56]);
    approach(doorFrontR, [0.55, 0.82 + split * 0.05, -0.69 - split * 0.56]);
    approach(doorRearL, [-0.78, 0.81 + split * 0.05, 0.69 + split * 0.56]);
    approach(doorRearR, [-0.78, 0.81 + split * 0.05, -0.69 - split * 0.56]);
    if (assembly.current) assembly.current.rotation.y = split * 0.035;
  });

  const wheelPlacements: Array<{ position: [number, number, number]; outward: number }> = [
    { position: [1.43, 0.49, 0.76], outward: 1 },
    { position: [1.43, 0.49, -0.76], outward: -1 },
    { position: [-1.45, 0.49, 0.76], outward: 1 },
    { position: [-1.45, 0.49, -0.76], outward: -1 },
  ];

  return <group ref={assembly}>
    <mesh geometry={bodyGeometry} material={paint} castShadow receiveShadow />
    <mesh ref={hood} position={[1.46, 1.015, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.38, 0.13, 1.28]} /><meshStandardMaterial color="#62c5c7" metalness={0.65} roughness={0.24} />
    </mesh>
    <mesh ref={cabin} geometry={cabinGeometry} material={paint} castShadow receiveShadow />
    <mesh position={[-0.13, 1.4, 0.596]}><boxGeometry args={[0.94, 0.37, 0.015]} /><primitive object={glass} attach="material" /></mesh>
    <mesh position={[-0.13, 1.4, -0.596]}><boxGeometry args={[0.94, 0.37, 0.015]} /><primitive object={glass} attach="material" /></mesh>
    <mesh position={[0.7, 1.4, 0.58]} rotation={[0, 0, -0.29]}><boxGeometry args={[0.48, 0.35, 0.015]} /><primitive object={glass} attach="material" /></mesh>
    <mesh position={[0.7, 1.4, -0.58]} rotation={[0, 0, -0.29]}><boxGeometry args={[0.48, 0.35, 0.015]} /><primitive object={glass} attach="material" /></mesh>
    <mesh position={[-0.15, 0.68, 0]}><boxGeometry args={[3.35, 0.18, 1.22]} /><meshStandardMaterial color="#14242c" metalness={0.5} roughness={0.42} /></mesh>
    <mesh ref={doorFrontL} position={[0.55, 0.82, 0.69]} castShadow>
      <boxGeometry args={[0.92, 0.46, 0.055]} /><primitive object={doorPaint} attach="material" />
    </mesh>
    <mesh ref={doorFrontR} position={[0.55, 0.82, -0.69]} castShadow>
      <boxGeometry args={[0.92, 0.46, 0.055]} /><primitive object={doorPaint} attach="material" />
    </mesh>
    <mesh ref={doorRearL} position={[-0.78, 0.81, 0.69]} castShadow>
      <boxGeometry args={[0.88, 0.45, 0.055]} /><primitive object={doorPaint} attach="material" />
    </mesh>
    <mesh ref={doorRearR} position={[-0.78, 0.81, -0.69]} castShadow>
      <boxGeometry args={[0.88, 0.45, 0.055]} /><primitive object={doorPaint} attach="material" />
    </mesh>
    {wheelPlacements.map((wheel, index) => <CarWheel key={index} position={wheel.position} outward={wheel.outward} progress={progress} />)}
    {[1, -1].map(side => <group key={side}>
      <mesh position={[2.31, 0.89, side * 0.42]} rotation={[0, side * -0.16, 0]}>
        <boxGeometry args={[0.075, 0.12, 0.38]} />
        <meshStandardMaterial color="#b9ffff" emissive="#3bdeeb" emissiveIntensity={3.2} toneMapped={false} />
      </mesh>
      <mesh position={[-2.27, 0.88, side * 0.43]}>
        <boxGeometry args={[0.06, 0.1, 0.28]} />
        <meshStandardMaterial color="#ed766e" emissive="#bd392e" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[0.57, 1.08, side * 0.73]}>
        <boxGeometry args={[0.18, 0.035, 0.06]} />
        <meshStandardMaterial color="#bdebed" metalness={0.55} roughness={0.3} />
      </mesh>
    </group>)}
    <mesh position={[2.41, 0.75, 0]}><boxGeometry args={[0.035, 0.3, 0.56]} /><meshStandardMaterial color="#0c1b22" metalness={0.45} roughness={0.34} /></mesh>
  </group>;
}

function CameraRig({ progress }: { progress: ScrollProgress }) {
  const { camera } = useThree();
  const lookAt = useMemo(() => new Vector3(0, 0.95, 0), []);
  const target = useMemo(() => new Vector3(), []);
  useFrame((_, delta) => {
    const p = progress.value;
    const orbit = Math.max(0, Math.min(1, (p - 0.64) / 0.21));
    const reveal = Math.max(0, Math.min(1, p / 0.32));
    const easedOrbit = orbit * orbit * (3 - 2 * orbit);
    const distance = 6.2 - reveal * 0.7;
    const angle = -0.63 + easedOrbit * Math.PI * 2;
    const height = 2.65 + Math.sin(easedOrbit * Math.PI * 2) * 0.42;
    target.set(Math.cos(angle) * distance, height, Math.sin(angle) * distance);
    camera.position.lerp(target, Math.min(1, delta * 2.6));
    camera.lookAt(lookAt);
  });
  return null;
}

function RideScene({ progress }: { progress: ScrollProgress }) {
  return <>
    <ambientLight intensity={1.05} />
    <hemisphereLight args={['#e3ffff', '#14202b', 1.1]} />
    <directionalLight position={[4, 8, 5]} intensity={3.1} color="#d3ffff" castShadow shadow-mapSize={[768, 768]} />
    <pointLight position={[-3, 1.4, -3]} intensity={15} color="#26cfe5" distance={9} />
    <pointLight position={[3, 2.5, 2]} intensity={5} color="#f2ad78" distance={7} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} /><meshStandardMaterial color="#111922" roughness={0.76} metalness={0.22} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.055, 0]} scale={[3.2, 1.5, 1]}>
      <circleGeometry args={[1, 48]} /><meshBasicMaterial color="#1ab8ca" transparent opacity={0.09} />
    </mesh>
    <CarAssembly progress={progress} />
    <CameraRig progress={progress} />
  </>;
}

function CSSFallback({ checking = false }: { checking?: boolean }) {
  const description = checking
    ? 'Stylized RideSync car preview; checking WebGL support'
    : 'Stylized RideSync car preview; 3D graphics are unavailable on this device';
  return <div className="rs-car-fallback" role="img" aria-label={description}>
    <div className="fallback-car">
      <div className="fallback-cabin"><i /><i /></div>
      <div className="fallback-body"><i className="fallback-light" /><i className="fallback-grille" /></div>
      <i className="fallback-wheel fallback-wheel-a" /><i className="fallback-wheel fallback-wheel-b" />
    </div>
    <span>{checking ? 'Preparing the 3D preview' : '3D preview unavailable on this device'}</span>
  </div>;
}

function LandingShowcase({ support, reducedMotion, mobile }: { support: 'checking' | 'supported' | 'unsupported'; reducedMotion: boolean; mobile: boolean }) {
  const sequenceRef = useRef<HTMLElement | null>(null);
  const progress = useRef<ScrollProgress>({ value: 0 });
  const [contextLost, setContextLost] = useState(false);
  const canRender3D = support === 'supported' && !contextLost;
  useLayoutEffect(() => {
    const trigger = sequenceRef.current;
    if (!trigger || !canRender3D || reducedMotion) {
      progress.current.value = 0;
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.to(progress.current, {
      value: 1,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
        invalidateOnRefresh: true,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [canRender3D, reducedMotion]);

  const carPreview = canRender3D
    ? <SceneBoundary fallback={<CSSFallback />}>
        <Canvas
          shadows={!mobile}
          dpr={mobile ? [1, 1.15] : [1, 1.5]}
          camera={{ position: [5.02, 2.65, -3.66], fov: 35, near: 0.1, far: 120 }}
          gl={{ alpha: true, antialias: !mobile, powerPreference: 'low-power' }}
          frameloop={reducedMotion ? 'demand' : 'always'}
          aria-label="Three-dimensional unbranded shared-commute car"
          role="img"
          tabIndex={-1}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', () => setContextLost(true), { once: true });
          }}
        >
          <Suspense fallback={null}><RideScene progress={progress.current} /></Suspense>
        </Canvas>
      </SceneBoundary>
    : <CSSFallback checking={support === 'checking'} />;

  return <section className={`rs-hero-sequence ${support === 'unsupported' ? 'rs-static-sequence' : ''}`} ref={sequenceRef} aria-label="RideSync interactive vehicle showcase">
    <div className="rs-shell rs-hero-sticky">
      <section className="rs-hero">
        <div className="rs-hero-copy rs-in-view">
          <div className="rs-kicker rs-tag">Campus mobility, in sync</div>
          <h1>GO TOGETHER.<span>GO FURTHER.</span></h1>
          <p className="rs-lead">Experience a smarter way to commute. Discover compatible rides, connect with fellow travelers, and share every journey.</p>
          <div className="rs-hero-actions">
            <Link href="/find-rides" className="rs-btn rs-btn-primary" data-testid="button-hero-find">Find a ride <ArrowUpRight size={15} /></Link>
            <Link href="/offer-ride" className="rs-btn" data-testid="button-hero-offer">Offer a ride <ArrowRight size={15} /></Link>
          </div>
        </div>
        <div className="rs-hero-art" aria-label="Interactive 3D RideSync car">
          <div className="rs-stage">
            <div className="rs-car-canvas">
              {carPreview}
            </div>
            <div className="rs-car-meta"><strong>R/S — 01</strong><span>SHARED BY DESIGN</span><span>SCROLL TO EXPLORE ↓</span></div>
          </div>
        </div>
        <div className="rs-scroll-cue"><i /> SAME ROUTE. SHARED RIDE. SMARTER COMMUTE.</div>
      </section>
      <div className="rs-scene-caption" aria-hidden="true"><span>01 / REVEAL</span><span>02 / EXPLORE</span><span>03 / REASSEMBLE</span></div>
    </div>
  </section>;
}

export default function LandingCarScene() {
  const [support, setSupport] = useState<'checking' | 'supported' | 'unsupported'>('checking');
  const [mobile, setMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    let supported = false;
    try {
      const context = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      supported = Boolean(context);
      if (context && 'getExtension' in context) {
        (context as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();
      }
    } catch { supported = false; }
    setSupport(supported ? 'supported' : 'unsupported');
    const compact = window.matchMedia('(max-width: 720px)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setMobile(compact.matches); setReducedMotion(motion.matches); };
    update();
    compact.addEventListener('change', update);
    motion.addEventListener('change', update);
    return () => {
      compact.removeEventListener('change', update);
      motion.removeEventListener('change', update);
    };
  }, []);
  return <LandingShowcase support={support} reducedMotion={reducedMotion} mobile={mobile} />;
}
