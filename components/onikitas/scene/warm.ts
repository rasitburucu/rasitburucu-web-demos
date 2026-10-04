import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { store } from "@/lib/onikitas/store";
import type { EffectComposer } from "postprocessing";

// Post-processing shaders normally compile on the composer's first render, all
// in one main-thread task. Here the composer starts disabled and its shaders
// are compiled one by one with a frame between, and only then does it take
// over. Every shader compiles once, for the one target it really draws into:
// - the scene's materials into the composer's buffer (linear, no tone mapping);
//   their on-screen variant already compiled before the first frame (Ready);
// - each pass's own materials into a buffer, except the last pass's output
//   material, which draws to the screen.
// While warming, the renderer keeps its ACES tone mapping. The composer
// switches it off on mount, which would make every scene material compile a
// third, never-used variant (screen, no tone mapping) in one blocking frame.

const pause = () => new Promise<void>((r) => requestAnimationFrame(() => setTimeout(r, 0)));

function collect(root: unknown, skip: Set<object>, into: Set<THREE.Material>) {
  const seen = new Set<object>(skip);
  const visit = (o: unknown, depth: number) => {
    if (!o || typeof o !== "object" || seen.has(o) || depth > 8) return;
    seen.add(o);
    if (o instanceof THREE.Material) {
      into.add(o);
      return;
    }
    if (o instanceof THREE.Object3D) {
      o.traverse((c) => {
        const m = (c as THREE.Mesh).material;
        if (m) (Array.isArray(m) ? m : [m]).forEach((x) => into.add(x));
      });
      return;
    }
    if (o instanceof THREE.Texture || o instanceof THREE.RenderTarget || o instanceof THREE.BufferGeometry) return;
    if (Array.isArray(o)) {
      o.forEach((x) => visit(x, depth + 1));
      return;
    }
    const fm = (o as { fullscreenMaterial?: unknown }).fullscreenMaterial;
    if (fm) visit(fm, depth + 1);
    for (const v of Object.values(o)) visit(v, depth + 1);
  };
  visit(root, 0);
  return into;
}

type PassLike = { renderToScreen?: boolean; fullscreenMaterial?: THREE.Material };

/** Returns true once the composer's shaders are compiled; pass it to `enabled`. */
export function useWarmComposer(ref: React.RefObject<EffectComposer | null>) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const [warm, setWarm] = useState(false);
  const started = useRef(false);

  // Runs after the composer's own mount effect (children first): undo its tone
  // mapping switch until the composer actually draws.
  useEffect(() => {
    gl.toneMapping = warm ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
  }, [gl, warm]);

  useEffect(() => {
    let alive = true;
    (async () => {
      // passes are added a render or two after mount
      for (let i = 0; i < 30 && alive && (ref.current?.passes.length ?? 0) < 2; i++) await pause();
      const composer = ref.current;
      if (!alive || !composer || started.current) return;
      started.current = true;
      const t0 = performance.now();
      const rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType });
      const prev = gl.getRenderTarget();
      let count = 0;

      // 1. the scene, as the composer's render pass will draw it
      const meshes: THREE.Mesh[] = [];
      scene.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
      });
      for (const m of meshes) {
        if (!alive) break;
        // hidden meshes too (the arch wall shows only at dawn); compile() is
        // synchronous, so no frame sees the flag flipped
        const vis = m.visible;
        try {
          m.visible = true;
          gl.setRenderTarget(rt);
          const job = gl.compileAsync(m, camera, scene);
          gl.setRenderTarget(prev);
          m.visible = vis;
          await job;
          count++;
        } catch {
          // compiles on first use instead
          m.visible = vis;
          gl.setRenderTarget(prev);
        }
        await pause();
      }

      // 2. the passes: each material for the target it draws into
      const skip = new Set<object>([scene, camera, gl]);
      const toScreen = new Set<THREE.Material>();
      const toBuffer = new Set<THREE.Material>();
      for (const p of composer.passes as unknown as PassLike[]) {
        const mats = collect(p, skip, new Set());
        for (const m of mats) {
          if (p.renderToScreen && m === p.fullscreenMaterial) toScreen.add(m);
          else toBuffer.add(m);
        }
      }
      const tmp = new THREE.Scene();
      const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const tri = new THREE.BufferGeometry();
      tri.setAttribute("position", new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
      tri.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));
      const jobs: [THREE.Material, THREE.WebGLRenderTarget | null][] = [
        ...[...toBuffer].map((m) => [m, rt] as [THREE.Material, THREE.WebGLRenderTarget | null]),
        ...[...toScreen].map((m) => [m, null] as [THREE.Material, THREE.WebGLRenderTarget | null]),
      ];
      for (const [m, target] of jobs) {
        if (!alive) break;
        const mesh = new THREE.Mesh(tri, m);
        mesh.frustumCulled = false;
        tmp.add(mesh);
        // the composer draws with tone mapping off; compile() itself is
        // synchronous, so the switch never reaches a rendered frame
        const tone = gl.toneMapping;
        try {
          gl.toneMapping = THREE.NoToneMapping;
          gl.setRenderTarget(target);
          const job = gl.compileAsync(tmp, cam);
          gl.setRenderTarget(prev);
          gl.toneMapping = tone;
          await job;
          count++;
        } catch {
          // a material that cannot compile standalone compiles on first use
          gl.toneMapping = tone;
          gl.setRenderTarget(prev);
        }
        tmp.remove(mesh);
        await pause();
      }
      gl.setRenderTarget(prev);
      tri.dispose();
      rt.dispose();
      performance.measure(`oki:post-compile (${count} programs)`, { start: t0, end: performance.now() });
      if (alive) setWarm(true);
    })();
    return () => {
      alive = false;
    };
  }, [gl, scene, camera, ref]);
  return warm;
}

// The first frames are drawn without post-processing (the renderer's own ACES
// curve, the same one the effect pass uses). When the composer takes over, its
// effects start at zero and rise together, so the hand-over never shows as a
// jump. Once faded in, a later tier swap (high -> mid) cuts straight in.
let fadedOnce = false;
const FADE_S = 1.4;

/** Drives `apply(k)` from 0 to 1 once `on` is true; calls `onDone` at 1. */
export function useFadeIn(on: boolean, apply: (k: number) => void, onDone?: () => void) {
  const k = useRef(-1);
  const finished = useRef(false);
  useFrame((_, delta) => {
    if (!on || finished.current) return;
    if (k.current < 0) k.current = fadedOnce || store.still >= 0 ? 1 : 0;
    k.current = Math.min(1, k.current + Math.min(delta, 1 / 20) / FADE_S);
    const x = k.current;
    // ease-out cubic: most of the change happens early, the tail settles
    apply(1 - Math.pow(1 - x, 3));
    if (x >= 1) {
      finished.current = true;
      fadedOnce = true;
      onDone?.();
    }
  });
}
