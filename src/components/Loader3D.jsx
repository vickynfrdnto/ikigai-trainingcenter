import React, {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

/* ══════════════════════════════════════
   CONFIG — semua angka penting ada di sini
══════════════════════════════════════ */

const CONFIG = {
  logoSrc: "/ikigai_tc.png",
  duration: 2600, // lama animasi progres (ms)
  holdAtFull: 400, // jeda di 100% sebelum keluar (ms)
  exitDuration: 700, // lama animasi keluar (ms)
  holdUntilReady: 95, // progres tertahan di angka ini sampai logo selesai dimuat
  maxExtraWait: 4000, // batas tunggu ekstra bila logo lambat/gagal (ms)
  logoY: 0.1,
  steps: [
    "Menyiapkan portal...",
    "Memuat materi training...",
    "Menyinkronkan data...",
    "Siap!",
  ],
  colors: {
    emerald: "#34d399",
    emeraldSoft: "#bbf7d0",
    emeraldDeep: "#065f46",
    gold: "#fbbf24",
  },
};

/* ══════════════════════════════════════
   HOOKS
══════════════════════════════════════ */

// Skala logo agar cincin lebar tidak terpotong di layar sempit / HP
function useResponsiveLogoScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const SAFE_ASPECT = 0.8;
    let raf = 0;

    const compute = () => {
      const w = window.innerWidth;
      const aspect = w / window.innerHeight;
      let next = aspect < SAFE_ASPECT ? aspect / SAFE_ASPECT : 1;
      if (w < 400) next *= 0.9;
      setScale(Math.max(next, 0.5));
    };
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  return scale;
}

// true setelah gambar selesai dimuat (atau gagal, supaya loader tidak macet)
function useAssetReady(src) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const img = new Image();
    const done = () => active && setReady(true);
    img.onload = done;
    img.onerror = done;
    img.src = src;
    return () => {
      active = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return ready;
}

function usePrefersReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia?.(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return undefined;
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

/* ══════════════════════════════════════
   3D SCENE
══════════════════════════════════════ */

function CameraAnimation() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.25) * 0.06;
    camera.position.y = Math.cos(t * 0.25) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function FloatingEmeraldLogo({ isExiting, baseScale, logoSrc }) {
  const groupRef = useRef();
  const logoRef = useRef();
  const ringRef1 = useRef();
  const ringRef2 = useRef();
  const glowRef = useRef();
  const { emerald, emeraldSoft, gold } = CONFIG.colors;

  const texture = useLoader(THREE.TextureLoader, logoSrc);

  // Warna & ketajaman tekstur yang benar
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
  }, [texture]);

  // delta dipakai agar kecepatan animasi sama di layar 60Hz maupun 120Hz
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    const group = groupRef.current;
    if (group) {
      group.position.y = CONFIG.logoY + Math.sin(t * 1.1) * 0.035;
      const target = isExiting ? baseScale * 1.12 : baseScale;
      group.scale.setScalar(
        THREE.MathUtils.damp(group.scale.x, target, 5, delta)
      );
    }
    if (logoRef.current) logoRef.current.rotation.z = Math.sin(t * 0.35) * 0.01;
    if (ringRef1.current) ringRef1.current.rotation.z += 0.15 * delta;
    if (ringRef2.current) ringRef2.current.rotation.z -= 0.09 * delta;
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.15 + Math.sin(t * 1.5) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={[0, CONFIG.logoY, 0]} scale={baseScale}>
      {/* Glow */}
      <mesh ref={glowRef} position={[0, 0, -0.12]}>
        <circleGeometry args={[2.05, 64]} />
        <meshBasicMaterial
          color={emerald}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Cincin emerald */}
      <group ref={ringRef1}>
        <mesh>
          <torusGeometry args={[1.75, 0.012, 16, 100, Math.PI * 1.75]} />
          <meshBasicMaterial color={emerald} transparent opacity={0.55} />
        </mesh>
        <mesh position={[1.75, 0, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color={emeraldSoft} />
        </mesh>
      </group>

      {/* Cincin emas */}
      <group ref={ringRef2}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.95, 0.008, 16, 100, Math.PI * 1.55]} />
          <meshBasicMaterial color={gold} transparent opacity={0.25} />
        </mesh>
      </group>

      {/* Logo */}
      <mesh ref={logoRef}>
        <circleGeometry args={[1.4, 64]} />
        <meshBasicMaterial
          map={texture}
          transparent
          side={THREE.DoubleSide}
          alphaTest={0.05}
        />
      </mesh>
    </group>
  );
}

function EmeraldSparks({ count }) {
  const pointsRef = useRef();

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      spd[i] = 0.12 + Math.random() * 0.18; // unit per detik
    }
    return { positions: pos, speeds: spd };
  }, [count]);

  useFrame((_, delta) => {
    const attr = pointsRef.current?.geometry.attributes.position;
    if (!attr) return;
    const arr = attr.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta;
      if (arr[i * 3 + 1] > 4) arr[i * 3 + 1] = -4;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={CONFIG.colors.emeraldSoft}
        size={0.02}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Scene({ isExiting, baseScale, logoSrc, sparkCount }) {
  return (
    <>
      <CameraAnimation />
      <ambientLight intensity={0.7} />
      <pointLight position={[0, 2.5, 4]} intensity={2} color={CONFIG.colors.emerald} />
      <pointLight position={[0, -2, -2]} intensity={0.8} color={CONFIG.colors.emeraldDeep} />
      <EmeraldSparks count={sparkCount} />
      <FloatingEmeraldLogo isExiting={isExiting} baseScale={baseScale} logoSrc={logoSrc} />
    </>
  );
}

/* ══════════════════════════════════════
   FALLBACK (tanpa WebGL)
   Dipakai bila WebGL gagal / context hilang,
   atau pengguna memilih "kurangi animasi".
══════════════════════════════════════ */

function FallbackLogo({ src, animated }) {
  return (
    <div className={`ld-fallback ${animated ? "is-animated" : ""}`} aria-hidden="true">
      <span className="ld-fallback-glow" />
      <span className="ld-fallback-ring" />
      <img src={src} alt="" draggable="false" />
    </div>
  );
}

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.warn("[Loader3D] Scene 3D gagal, memakai tampilan cadangan.", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/* ══════════════════════════════════════
   STYLES
══════════════════════════════════════ */

const LD_CSS = `
.ld {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(circle at center, #065f46 0%, #064e3b 45%, #022c22 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  opacity: 1;
  transform: scale(1);
  filter: blur(0);
  transition: opacity .7s ease, transform .7s ease, filter .7s ease;
  animation: ld-in .35s ease-out;
}
.ld.is-exiting { opacity: 0; transform: scale(1.04); filter: blur(6px); pointer-events: none; }

.ld-canvas { position: absolute; inset: 0; }

.ld-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at center, transparent 45%, rgba(0, 0, 0, .22) 100%);
}

/* ── Progres ── */
.ld-footer {
  position: absolute;
  z-index: 10;
  left: 50%;
  bottom: calc(9% + env(safe-area-inset-bottom, 0px));
  transform: translateX(-50%);
  width: min(82%, 320px);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ld-track { width: 100%; height: 4px; border-radius: 999px; background: rgba(255,255,255,.14); overflow: hidden; }
.ld-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #10b981, #34d399, #fde047);
  box-shadow: 0 0 18px rgba(52, 211, 153, .55);
  transition: width .2s ease-out;
}
.ld-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #bbf7d0;
  font-size: .74rem;
  font-weight: 700;
  letter-spacing: .04em;
}
.ld-step { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ld-pct { font-variant-numeric: tabular-nums; }

/* ── Fallback logo ── */
.ld-fallback { position: relative; width: min(46vw, 210px); aspect-ratio: 1; display: grid; place-items: center; margin-bottom: 6%; }
.ld-fallback img { position: relative; width: 72%; height: 72%; object-fit: contain; border-radius: 50%; }
.ld-fallback-glow { position: absolute; inset: -12%; border-radius: 50%; background: rgba(52, 211, 153, .16); }
.ld-fallback-ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid transparent; border-top-color: #34d399; border-right-color: rgba(52, 211, 153, .35); }
.ld-fallback.is-animated .ld-fallback-ring { animation: ld-spin 2.4s linear infinite; }
.ld-fallback.is-animated .ld-fallback-glow { animation: ld-breathe 2.6s ease-in-out infinite; }

@keyframes ld-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes ld-spin { to { transform: rotate(360deg); } }
@keyframes ld-breathe { 0%, 100% { opacity: .6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }

@media (prefers-reduced-motion: reduce) {
  .ld { animation: none; transition: opacity .3s ease; }
  .ld.is-exiting { transform: none; filter: none; }
  .ld-fill { transition: none; }
}
`;

/* ══════════════════════════════════════
   LOADER
══════════════════════════════════════ */

export default function Loader3D({
  onFinish,
  logoSrc = CONFIG.logoSrc,
  duration = CONFIG.duration,
  steps = CONFIG.steps,
}) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);

  const logoScale = useResponsiveLogoScale();
  const assetReady = useAssetReady(logoSrc);
  const reduceMotion = usePrefersReducedMotion();

  // Simpan nilai terbaru di ref agar efek progres tidak restart tiap render
  // (sebelumnya onFinish ada di dependency, sehingga progres bisa mengulang
  // dari 0 bila parent mengirim fungsi inline).
  const onFinishRef = useRef(onFinish);
  const readyRef = useRef(assetReady);
  onFinishRef.current = onFinish;
  readyRef.current = assetReady;

  useEffect(() => {
    let raf = 0;
    let finished = false;
    const timers = [];
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const eased = 1 - Math.pow(1 - Math.min(1, elapsed / duration), 2.2);
      const canFinish = readyRef.current || elapsed > duration + CONFIG.maxExtraWait;
      const cap = canFinish ? 100 : CONFIG.holdUntilReady;
      const value = Math.min(Math.floor(eased * 100), cap);

      setProgress(value);

      if (value >= 100 && !finished) {
        finished = true;
        timers.push(
          setTimeout(() => {
            setIsExiting(true);
            timers.push(setTimeout(() => onFinishRef.current?.(), CONFIG.exitDuration));
          }, CONFIG.holdAtFull)
        );
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [duration]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 600;
  const useFallback = reduceMotion || webglFailed;
  const stepLabel =
    steps[Math.min(steps.length - 1, Math.floor((progress / 100) * steps.length))];

  const fallback = <FallbackLogo src={logoSrc} animated={!reduceMotion} />;

  return (
    <div className={`ld ${isExiting ? "is-exiting" : ""}`}>
      <style>{LD_CSS}</style>

      {useFallback ? (
        fallback
      ) : (
        <SceneBoundary fallback={fallback}>
          <Canvas
            className="ld-canvas"
            camera={{ position: [0, 0, 5.5], fov: 50 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener("webglcontextlost", (event) => {
                event.preventDefault();
                setWebglFailed(true);
              });
            }}
          >
            <Suspense fallback={null}>
              <Scene
                isExiting={isExiting}
                baseScale={logoScale}
                logoSrc={logoSrc}
                sparkCount={isMobile ? 20 : 35}
              />
            </Suspense>
          </Canvas>
        </SceneBoundary>
      )}

      <div className="ld-footer">
        <div
          className="ld-track"
          role="progressbar"
          aria-label="Memuat portal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div className="ld-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="ld-meta">
          <span className="ld-step">{stepLabel}</span>
          <span className="ld-pct">{progress}%</span>
        </div>
      </div>

      <div className="ld-vignette" />
    </div>
  );
}