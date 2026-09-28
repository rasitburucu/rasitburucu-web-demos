"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { addLoad, emit, on, store, type Tier } from "@/lib/onikitas/store";
import { formatHour, hourFor, revealFor, STILLS } from "@/lib/onikitas/chapters";
import { Loader } from "./Loader";
import { Stills } from "./Stills";
import { VillaTip } from "./VillaTip";

const Scene = dynamic(() => import("./scene/Scene"), { ssr: false });

type Mode = "pending" | "webgl" | "stills";

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function webgl2() {
  try {
    const c = document.createElement("canvas");
    return !!c.getContext("webgl2");
  } catch {
    return false;
  }
}

function detectTier(): Tier {
  const coarse = matchMedia("(pointer: coarse)").matches;
  const small = Math.min(screen.width, screen.height) < 820;
  if (coarse && small) return "low";
  let renderer = "";
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    const ext = gl?.getExtension("WEBGL_debug_renderer_info");
    renderer = ext && gl ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
  } catch {}
  if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) return "low";
  const cores = navigator.hardwareConcurrency || 4;
  if (/intel|mali|adreno [1-5]|powervr/i.test(renderer) || cores <= 4 || coarse) return "mid";
  return "high";
}

// Copy windows (chapter-local t) during which each chapter's text is shown.
const COPY_WINDOW: [number, number][] = [
  [-1, 0.34],
  [0.1, 0.86],
  [0.12, 0.8],
  [0.1, 0.86],
  [0.1, 0.86],
  [0.05, 0.34],
  [0.12, 1.5],
];
const DIAL_WINDOW: [number, number] = [0.38, 1.5];

function useDirector(mode: Mode) {
  useEffect(() => {
    if (mode === "pending") return;
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const params = new URLSearchParams(location.search);
    const still = params.get("still");
    if (still !== null) {
      // frozen framing for poster/still capture
      const i = Math.max(0, Math.min(STILLS.length - 1, Number(still) || 0));
      const [c, t] = STILLS[i];
      store.still = i;
      store.chapter = c;
      store.t = t;
      store.hour = store.scrollHour = hourFor(c, t);
      store.reveal = revealFor(c, t);
      root.dataset.capture = "true";
      return;
    }

    const lenis = reduce ? null : new Lenis({ autoRaf: true, lerp: 0.085, anchors: true });
    (window as unknown as { __okiLenis?: Lenis | null }).__okiLenis = lenis;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    const copies = sections.map((s) => s.querySelector<HTMLElement>("[data-copy]"));
    const dial = document.querySelector<HTMLElement>("[data-dial-panel]");
    const clock = document.querySelector<HTMLElement>("[data-clock]");
    const clockName = document.querySelector<HTMLElement>("[data-clock-name]");
    const ticks = Array.from(document.querySelectorAll<HTMLElement>("[data-tick]"));
    let tops: number[] = [];
    let heights: number[] = [];
    let vh = window.innerHeight;

    const measure = () => {
      vh = window.innerHeight;
      tops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY);
      heights = sections.map((s) => s.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    document.fonts?.ready.then(measure);

    const onPointer = (e: PointerEvent) => {
      store.px = (e.clientX / window.innerWidth) * 2 - 1;
      store.py = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let lastMinute = -1;
    let lastChapter = -1;
    let lastTone = "";
    const shown = copies.map(() => false);
    let dialShown = false;
    let raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const y = lenis ? lenis.scroll : window.scrollY;
      let c = 0;
      for (let i = 0; i < tops.length; i++) if (y >= tops[i] - 1) c = i;
      const range = Math.max(1, heights[c] - vh);
      const t = Math.min(1, Math.max(0, (y - tops[c]) / range));
      store.chapter = c;
      store.t = t;
      store.scrollHour = hourFor(c, t);
      store.reveal = revealFor(c, t);
      if (c !== 5 && store.dialHour !== null) {
        store.dialHour = null;
        emit("dial");
      }
      store.hour = c === 5 && store.dialHour !== null ? store.dialHour : store.scrollHour;

      // copy blocks fade by chapter-local windows
      for (let i = 0; i < copies.length; i++) {
        const el = copies[i];
        if (!el) continue;
        const w = COPY_WINDOW[i];
        const tt = i === c ? t : i < c ? 2 : -2;
        const on = tt >= w[0] && tt <= w[1] && (i === c || (i === 0 && c === 0));
        if (on !== shown[i]) {
          shown[i] = on;
          el.dataset.on = on ? "true" : "false";
        }
      }
      if (dial) {
        const on = c === 5 && t >= DIAL_WINDOW[0];
        if (on !== dialShown) {
          dialShown = on;
          dial.dataset.on = on ? "true" : "false";
        }
      }

      const minute = Math.round(store.hour * 60);
      if (minute !== lastMinute && clock) {
        lastMinute = minute;
        clock.textContent = formatHour(store.hour);
      }
      if (c !== lastChapter) {
        lastChapter = c;
        if (clockName) clockName.textContent = sections[c]?.dataset.name ?? "";
        ticks.forEach((tk, i) => (tk.dataset.active = i === c ? "true" : "false"));
        emit("tone");
      }
      const tone = store.hour >= 19.25 ? "dark" : "light";
      if (tone !== lastTone) {
        lastTone = tone;
        store.tone = tone;
        root.dataset.tone = tone;
        emit("tone");
      }
    };
    raf = requestAnimationFrame(frame);

    // in-page links go through Lenis so the day scrolls, not jumps
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a || !lenis) return;
      const id = a.getAttribute("href")!.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = target.dataset.scrollOffset ? Number(target.dataset.scrollOffset) * vh : 0;
      lenis.scrollTo(target, { offset, duration: 1.8 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("click", onClick);
      lenis?.destroy();
    };
  }, [mode]);
}

export function Experience({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("pending");
  const [tier, setTier] = useState<Tier>("high");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const forced = params.get("mode");
    const ok = webgl2();
    const q = params.get("tier") as Tier | null;
    // mode decision happens once on the client, after first paint
    const decide = window.setTimeout(() => {
      if (!ok || forced === "stills" || (reduce && params.get("still") === null && forced !== "webgl")) setMode("stills");
      else {
        setTier(q === "high" || q === "mid" || q === "low" ? q : detectTier());
        setMode("webgl");
      }
    }, 0);
    document.fonts?.ready.then(() => addLoad(1));
    const off = on("ready", () => setReady(true));
    return () => {
      clearTimeout(decide);
      off();
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);
  useEffect(() => {
    if (ready) document.documentElement.dataset.ready = "true";
  }, [ready]);

  useDirector(mode);

  return (
    <>
      <Loader mode={mode} />
      <Stills active={mode === "stills"} webglReady={ready} />
      {mode === "webgl" ? (
        <SceneBoundary onError={() => setMode("stills")}>
          <Scene tier={tier} />
        </SceneBoundary>
      ) : null}
      <VillaTip />
      {children}
    </>
  );
}

