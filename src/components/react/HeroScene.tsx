import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import {
  Float,
  ContactShadows,
  Environment,
  Lightformer,
  PerspectiveCamera,
} from "@react-three/drei";
import { useMemo, useRef, useState, useEffect, Suspense } from "react";
import * as THREE from "three";

/* ----------------------------------------------------- shared mouse track --- */
function useMouse() {
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return mouse;
}

/* ------------------------------------------------ procedural facade texture --- */
function makeFacade(base: string, win: string, lit: string, litProb: number) {
  const W = 128;
  const H = 256;
  const map = document.createElement("canvas");
  map.width = W;
  map.height = H;
  const emi = document.createElement("canvas");
  emi.width = W;
  emi.height = H;
  const mc = map.getContext("2d")!;
  const ec = emi.getContext("2d")!;

  mc.fillStyle = base;
  mc.fillRect(0, 0, W, H);
  ec.fillStyle = "#000000";
  ec.fillRect(0, 0, W, H);

  const cols = 5;
  const rows = 18;
  const padX = 12;
  const padTop = 14;
  const gap = 4;
  const cellW = (W - padX * 2 - gap * (cols - 1)) / cols;
  const cellH = (H - padTop * 2 - gap * (rows - 1)) / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = padX + c * (cellW + gap);
      const y = padTop + r * (cellH + gap);
      const isLit = Math.random() < litProb;
      mc.fillStyle = isLit ? lit : win;
      mc.fillRect(x, y, cellW, cellH);
      if (isLit) {
        ec.fillStyle = lit;
        ec.fillRect(x, y, cellW, cellH);
      }
    }
  }

  const mTex = new THREE.CanvasTexture(map);
  mTex.colorSpace = THREE.SRGBColorSpace;
  const eTex = new THREE.CanvasTexture(emi);
  eTex.colorSpace = THREE.SRGBColorSpace;
  return { map: mTex, emissiveMap: eTex };
}

/* --------------------------------------------------------------- a tower --- */
type TowerProps = ThreeElements["group"] & {
  size: [number, number, number];
  facade: { map: THREE.Texture; emissiveMap: THREE.Texture };
  color: string;
  emissive: string;
  metalness?: number;
  roughness?: number;
  emissiveIntensity?: number;
};

function Tower({
  size,
  facade,
  color,
  emissive,
  metalness = 0.6,
  roughness = 0.35,
  emissiveIntensity = 1.4,
  ...rest
}: TowerProps) {
  const [w, h, d] = size;
  return (
    <group {...rest}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          map={facade.map}
          emissiveMap={facade.emissiveMap}
          emissive={new THREE.Color(emissive)}
          emissiveIntensity={emissiveIntensity}
          color={color}
          metalness={metalness}
          roughness={roughness}
        />
      </mesh>
      {/* crown cap */}
      <mesh position={[0, h / 2 + 0.04, 0]} castShadow>
        <boxGeometry args={[w * 0.96, 0.08, d * 0.96]} />
        <meshStandardMaterial color="#cda972" metalness={1} roughness={0.25} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------- landmark centre tower --- */
/* A solid hero tower in the same style as the side buildings (the glass
   transmission material was replaced — it was the part that rendered poorly).
   Gilt/gold facade to echo the centre building of the NZ logo, plus a spire. */
function HeroTower({
  facade,
}: {
  facade: { map: THREE.Texture; emissiveMap: THREE.Texture };
}) {
  return (
    <group position={[0, 1.1, 0]}>
      <Tower
        size={[1.4, 5.0, 1.4]}
        facade={facade}
        color="#e7c98f"
        emissive="#ffd98a"
        emissiveIntensity={1.9}
        metalness={0.85}
        roughness={0.24}
      />
      {/* spire */}
      <mesh position={[0, 3.1, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.07, 1.2, 10]} />
        <meshStandardMaterial
          color="#e7c98f"
          metalness={1}
          roughness={0.16}
          emissive="#e7c98f"
          emissiveIntensity={0.5}
          toneMapped={false}
        />
      </mesh>
      {/* beacon */}
      <mesh position={[0, 3.78, 0]}>
        <sphereGeometry args={[0.085, 16, 16]} />
        <meshStandardMaterial
          color="#fff3df"
          emissive="#ffd98a"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------ floating dust pts --- */
function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 120;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = Math.random() * 8 - 1;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.035} color="#cda972" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

/* ----------------------------------------------------------- the skyline --- */
function Skyline() {
  const group = useRef<THREE.Group>(null);
  const mouse = useMouse();
  const scroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scroll.current = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const facadeAzure = useMemo(() => makeFacade("#0f2540", "#173a63", "#3f93e0", 0.5), []);
  const facadeDark = useMemo(() => makeFacade("#161310", "#241f18", "#ff9a55", 0.42), []);
  const facadeBronze = useMemo(() => makeFacade("#3a2c18", "#5a4424", "#e7c98f", 0.55), []);
  const facadeHero = useMemo(() => makeFacade("#3a2a14", "#5e4622", "#ffd98a", 0.55), []);

  useFrame((_, delta) => {
    if (!group.current) return;
    const targetY = mouse.current.x * 0.35 + scroll.current * 0.8;
    const targetX = mouse.current.y * 0.12 + scroll.current * 0.05;
    group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(1, delta * 3);
    group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(1, delta * 3);
    group.current.position.y = -0.4 - scroll.current * 1.4;
  });

  return (
    <group ref={group} position={[0, -0.4, 0]}>
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.4} floatingRange={[-0.06, 0.06]}>
        {/* center landmark tower */}
        <HeroTower facade={facadeHero} />

        {/* left azure tower */}
        <Tower
          position={[-1.7, 0.1, -0.3]}
          size={[1.1, 3.0, 1.1]}
          facade={facadeAzure}
          color="#9fc2e8"
          emissive="#3f93e0"
          metalness={0.5}
          roughness={0.3}
        />

        {/* right dark tower */}
        <Tower
          position={[1.7, -0.15, 0.1]}
          size={[1.05, 2.5, 1.05]}
          facade={facadeDark}
          color="#cbb38c"
          emissive="#ff9a55"
          metalness={0.55}
          roughness={0.35}
        />

        {/* back bronze slab */}
        <Tower
          position={[0.4, -0.4, -2.1]}
          size={[1.3, 2.0, 0.7]}
          facade={facadeBronze}
          color="#e7c98f"
          emissive="#e7c98f"
          metalness={0.8}
          roughness={0.28}
        />
        {/* back azure slab */}
        <Tower
          position={[-1.0, -0.6, -2.4]}
          size={[0.8, 1.5, 0.7]}
          facade={facadeAzure}
          color="#9fc2e8"
          emissive="#3f93e0"
          metalness={0.6}
          roughness={0.3}
        />

        <Dust />
      </Float>

      <ContactShadows
        position={[0, -1.85, 0]}
        opacity={0.45}
        scale={16}
        blur={2.6}
        far={6}
        color="#16150f"
      />
    </group>
  );
}

/* --------------------------------------------------- environment lighting --- */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={2.4}
        castShadow
        color="#fff3df"
      />
      <pointLight position={[-4, 2, 3]} intensity={18} color="#2f7fd6" distance={14} />
      <pointLight position={[4, 1, 3]} intensity={14} color="#ff8a4c" distance={14} />
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 4, -6]} scale={[12, 6, 1]} color="#fff1d6" />
        <Lightformer intensity={1.4} position={[-6, 2, 2]} scale={[6, 8, 1]} color="#bcd6f5" />
        <Lightformer intensity={1.2} position={[6, 0, 2]} scale={[6, 8, 1]} color="#ffd1ad" />
        <Lightformer intensity={1} form="ring" position={[0, 2, 4]} scale={4} color="#ffffff" />
      </Environment>
    </>
  );
}

/* ----------------------------------------------------------- the export --- */
export default function HeroScene() {
  const [ready, setReady] = useState(false);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    return (
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 size-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(176,141,87,0.45),transparent_70%)] blur-2xl" />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 transition-opacity duration-1000"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
        onCreated={() => setReady(true)}
      >
        <PerspectiveCamera makeDefault fov={34} position={[0, 1.4, 9.2]} />
        <Suspense fallback={null}>
          <Skyline />
          <Lighting />
        </Suspense>
        <fog attach="fog" args={["#f5f2ea", 12, 22]} />
      </Canvas>
    </div>
  );
}
