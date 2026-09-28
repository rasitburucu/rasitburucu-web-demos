import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import type { EffectComposer } from "postprocessing";

// Post-processing shaders normally compile on the composer's first render, all
// in one main-thread task. Here the composer starts disabled, its materials are
// compiled one by one with a frame between, and only then does it take over.

const pause = () => new Promise<void>((r) => requestAnimationFrame(() => setTimeout(r, 0)));

function collect(root: unknown, skip: Set<object>) {
  const mats = new Set<THREE.Material>();
  const seen = new Set<object>(skip);
  const visit = (o: unknown, depth: number) => {
    if (!o || typeof o !== "object" || seen.has(o) || depth > 8) return;
    seen.add(o);
    if (o instanceof THREE.Material) {
      mats.add(o);
      return;
    }
    if (o instanceof THREE.Object3D) {
      o.traverse((c) => {
        const m = (c as THREE.Mesh).material;
        if (m) (Array.isArray(m) ? m : [m]).forEach((x) => mats.add(x));
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
  return mats;
}

/** Returns true once the composer's shaders are compiled; pass it to `enabled`. */
export function useWarmComposer(ref: React.RefObject<EffectComposer | null>) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const [warm, setWarm] = useState(false);
  const started = useRef(false);
  useEffect(() => {
    let alive = true;
    (async () => {
      // passes are added a render or two after mount
      for (let i = 0; i < 30 && alive && (ref.current?.passes.length ?? 0) < 2; i++) await pause();
      const composer = ref.current;
      if (!alive || !composer || started.current) return;
      started.current = true;
      const t0 = performance.now();
      const mats = collect(composer.passes, new Set<object>([scene, camera, gl]));
      const tmp = new THREE.Scene();
      const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const tri = new THREE.BufferGeometry();
      tri.setAttribute("position", new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
      tri.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));
      const rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType });
      const prev = gl.getRenderTarget();
      for (const m of mats) {
        if (!alive) break;
        const mesh = new THREE.Mesh(tri, m);
        mesh.frustumCulled = false;
        tmp.add(mesh);
        try {
          // intermediate passes draw into targets, the last one to the screen;
          // compile() itself is synchronous, only the readiness wait is async
          gl.setRenderTarget(rt);
          const intoTarget = gl.compileAsync(tmp, cam);
          gl.setRenderTarget(null);
          const toScreen = gl.compileAsync(tmp, cam);
          gl.setRenderTarget(prev);
          await Promise.all([intoTarget, toScreen]);
        } catch {
          // a material that cannot compile standalone compiles on first use
        }
        tmp.remove(mesh);
        await pause();
      }
      gl.setRenderTarget(prev);
      tri.dispose();
      rt.dispose();
      performance.measure(`oki:post-compile (${mats.size} shaders)`, { start: t0, end: performance.now() });
      if (alive) setWarm(true);
    })();
    return () => {
      alive = false;
    };
  }, [gl, scene, camera, ref]);
  return warm;
}
