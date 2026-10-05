"use client";

import { useEffect, useRef, useState } from "react";
import type { Fide } from "@/content/gelidonya/urunler";
import { drawStake } from "@/lib/gelidonya/viyol-ciz";
import { drawTrayImg, loadSet, trayImgRatio, trayShare, type TraySet } from "@/lib/gelidonya/viyol-kare";

type Props = { f: Fide; filled: number; grow: number; label: string; className?: string };

const FALLBACK = `"Arial Narrow", sans-serif`;
/** The tray lies a little turned on the aisle floor (8°, counter-clockwise). */
const TILT = (-8 * Math.PI) / 180;

/** The order's last tray, large, cells filling one by one (signature moment 1). */
export function SonViyol({ f, filled, grow, label, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const prev = useRef({ grow: -1, id: "" });
  const [set, setSet] = useState<TraySet | null>(null);

  useEffect(() => {
    let on = true;
    loadSet(f).then(
      (s) => on && setSet(s),
      () => undefined,
    );
    return () => {
      on = false;
    };
  }, [f]);

  useEffect(() => {
    const cv = ref.current;
    const cx = cv?.getContext("2d");
    if (!cv || !cx || !set || set.leaf !== f.leaf || set.cells !== f.cells) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = !reduce && (prev.current.grow !== grow || prev.current.id !== f.id);
    prev.current = { grow, id: f.id };
    // the name stake says what a grower would write on it: crop and grafted or not
    const stakeText = `${f.name} ${f.kind}`.toLocaleUpperCase("tr");
    // canvas cannot read CSS variables: resolve the display face's family here
    const fam = getComputedStyle(cv).getPropertyValue("--gd-display").trim();
    const FONT = fam ? `${fam}, ${FALLBACK}` : FALLBACK;
    let raf = 0;
    let t0 = performance.now();

    const size = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx.imageSmoothingQuality = "high";
      return r;
    };
    let box = size();

    const frame = (now: number) => {
      const W = box.width;
      const H = box.height;
      cx.clearRect(0, 0, W, H);
      const ratio = trayImgRatio(f.cells);
      const c = Math.cos(TILT);
      const s = Math.abs(Math.sin(TILT));
      const w = Math.min(W / (c + ratio * s), H / (s + ratio * c));
      const h = w * ratio;
      const el = animate ? now - t0 : 1e9;
      cx.save();
      cx.translate(W / 2, H / 2);
      cx.rotate(TILT);
      drawTrayImg(cx, set, -w / 2, -h / 2, w, filled, 11, (n) => Math.min(1, Math.max(0, (el - n * 22) / 300)));
      const t = trayShare(f.cells);
      drawStake(cx, -w / 2 + w * (t.x + t.w * 0.6), -h / 2 + h * t.y - w * 0.012, (w * t.w) / 10.5, stakeText, FONT);
      cx.restore();
      if (el < filled * 22 + 320) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame((now) => {
      t0 = now;
      frame(now);
    });
    const ro = new ResizeObserver(() => {
      box = size();
      frame(performance.now() + 1e9);
    });
    ro.observe(cv);
    document.fonts?.ready.then(() => frame(performance.now() + 1e9));
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [f, filled, grow, set]);

  return <canvas ref={ref} className={className} role="img" aria-label={label} />;
}
