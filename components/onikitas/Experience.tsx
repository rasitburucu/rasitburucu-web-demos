"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { addLoad, emit, on, store, type Tier } from "@/lib/onikitas/store";
import { formatHour, hourFor, revealFor, STILLS } from "@/lib/onikitas/chapters";
import { goTo } from "@/lib/onikitas/goto";
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

/** One throwaway WebGL2 context: is it there, and what GPU is behind it. Released at once. */
function probeGL(): { ok: boolean; renderer: string } {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return { ok: false, renderer: "" };
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return { ok: true, renderer };
  } catch {
    return { ok: false, renderer: "" };
  }
}

const SOFTWARE_GL = /swiftshader|llvmpipe|software|basic render/i;

function detectTier(renderer: string): Tier {
  const coarse = matchMedia("(pointer: coarse)").matches;
  const small = Math.min(screen.width, screen.height) < 820;
  if (coarse && small) return "low";
  if (SOFTWARE_GL.test(renderer)) return "low";
  const cores = navigator.hardwareConcurrency || 4;
  if (/intel|mali|adreno [1-5]|powervr/i.test(renderer) || cores <= 4 || coarse) return "mid";
  return "high";
}

// Copy windows (chapter-local t) during which each chapter's text is shown.
// Sized against the chapter lengths in lib/onikitas/chapters.ts so that no
// stretch without words is longer than about half a screen (the longest,
// şafak into sabah, is ~52svh while the camera walks through the arch).
const COPY_WINDOW: [number, number][] = [
  [-1, 0.62],
  [0.04, 0.85],
  [0.06, 0.82],
  [0.06, 0.85],
  [0.06, 0.85],
  // akşam: the question stays up while the dial is in use
  [0.03, 1.5],
  // yatsı: the closing line and its links stay until the registry arrives
  [0.08, 1.5],
];
const DIAL_WINDOW: [number, number] = [0.3, 1.5];
/**
 * Evening tone switch (decimal hours), with a small hysteresis band. Late
 * enough that the golden hour keeps the limewash rails and dark ink; the
 * night rails come with the dusk.
 */
const TONE_DARK_FROM = 19.4;
const TONE_LIGHT_BELOW = 19.25;

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

    // the part of the screen the dial panel and the evening question leave to
    // the scene: the camera centres its frame (and a close-up) there
    const measureFree = () => {
      if (!dial || !store.dialOn) {
        store.free = null;
        return;
      }
      const W = window.innerWidth;
      const H = window.innerHeight;
      const p = dial.getBoundingClientRect();
      // the evening question is out of the way during a close-up: the header's foot is the top
      const q = root.dataset.close === "true" ? ({ bottom: 96 } as DOMRect) : copies[5]?.getBoundingClientRect();
      if (p.width > W * 0.7) {
        // phones: the band between the question and the panel
        const y0 = q ? q.bottom + 16 : H * 0.3;
        const y1 = Math.max(y0 + 80, p.top - 12);
        store.free = [0, y0 / H, 1, Math.min(1, y1 / H)];
      } else {
        // wide screens: beside the panel, under the question
        const left = p.left < W / 2;
        const y0 = q ? Math.min(q.bottom + 12, H * 0.62) : H * 0.3;
        store.free = [left ? (p.right + 16) / W : 0, y0 / H, left ? 1 : (p.left - 16) / W, 1];
      }
    };
    // each copy's text bed hugs its lines, not the copy's box: the widest
    // line's left and right edges, measured from the rendered text
    const fitBeds = () => {
      const range = document.createRange();
      for (const el of copies) {
        if (!el) continue;
        const box = el.getBoundingClientRect();
        if (!box.width) continue;
        let l = Infinity;
        let r = -Infinity;
        const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n = walk.nextNode(); n; n = walk.nextNode()) {
          if (!n.textContent?.trim() || n.parentElement?.closest(".sr-only")) continue;
          range.selectNodeContents(n);
          for (const rc of range.getClientRects()) {
            if (rc.width < 1) continue;
            l = Math.min(l, rc.left);
            r = Math.max(r, rc.right);
          }
        }
        // links and buttons are boxes wider than their words
        el.querySelectorAll("a").forEach((a) => {
          const rc = a.getBoundingClientRect();
          l = Math.min(l, rc.left);
          r = Math.max(r, rc.right);
        });
        if (!Number.isFinite(l)) continue;
        el.style.setProperty("--bed-l", `${Math.max(0, Math.round(l - box.left))}px`);
        el.style.setProperty("--bed-r", `${Math.max(0, Math.round(box.right - r))}px`);
      }
    };
    const measure = () => {
      vh = window.innerHeight;
      tops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY);
      heights = sections.map((s) => s.offsetHeight);
      measureFree();
      fitBeds();
    };
    measure();
    const offPanel = on("panel", () => requestAnimationFrame(measureFree));
    const offFocus = on("focus", () => requestAnimationFrame(measureFree));
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
    let lastPast = false;
    const shown = copies.map(() => false);
    let dialShown = false;
    let raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const y = lenis ? lenis.scroll : window.scrollY;
      // past the day: the header gets a solid bed so it never sits on the registry
      const last = tops.length - 1;
      const past = last >= 0 && y >= tops[last] + heights[last] - 96;
      if (past !== lastPast) {
        lastPast = past;
        root.dataset.past = past ? "true" : "false";
      }
      let c = 0;
      for (let i = 0; i < tops.length; i++) if (y >= tops[i] - 1) c = i;
      const range = Math.max(1, heights[c] - vh);
      const t = Math.min(1, Math.max(0, (y - tops[c]) / range));
      store.chapter = c;
      store.t = t;
      store.scrollHour = hourFor(c, t);
      store.reveal = revealFor(c, t);
      // the dial's hour rules the scene only while the dial is on screen; the
      // choice itself is kept, so coming back finds the same light
      const dialOn = c === 5 && t >= DIAL_WINDOW[0];
      store.hour = dialOn && store.dialHour !== null ? store.dialHour : store.scrollHour;

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
      if (dialOn !== dialShown) {
        // leaving the evening ends a visit from the registry: no way back to offer
        if (!dialOn && store.fromList >= 0) {
          store.fromList = -1;
          emit("focus");
        }
        dialShown = dialOn;
        store.dialOn = dialOn;
        if (dial) dial.dataset.on = dialOn ? "true" : "false";
        emit("dial");
        // phones drop the evening body under the dial: the bed and the free band change
        requestAnimationFrame(() => {
          measureFree();
          fitBeds();
        });
      }

      const minute = Math.round(store.hour * 60);
      if (minute !== lastMinute && clock) {
        lastMinute = minute;
        clock.textContent = formatHour(store.hour);
      }
      if (c !== lastChapter) {
        lastChapter = c;
        if (clockName) clockName.textContent = sections[c]?.dataset.name ?? "";
        root.dataset.side = sections[c]?.dataset.side ?? "l";
        ticks.forEach((tk, i) => (tk.dataset.active = i === c ? "true" : "false"));
        emit("tone");
      }
      // Ink flips to limewash as the slope falls into evening shade. Hysteresis
      // keeps it from flickering when the scroll rests near the threshold.
      const tone =
        lastTone === "dark" ? (store.hour < TONE_LIGHT_BELOW ? "light" : "dark") : store.hour >= TONE_DARK_FROM ? "dark" : "light";
      if (tone !== lastTone) {
        lastTone = tone;
        store.tone = tone;
        root.dataset.tone = tone;
        emit("tone");
      }
    };
    raf = requestAnimationFrame(frame);

    // in-page links go through Lenis so the day scrolls, not jumps, and land
    // keyboard focus on the control they lead to (see lib/onikitas/goto.ts)
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      // the phone menu panel closes once a section is picked
      a.closest("details")?.removeAttribute("open");
      const id = a.getAttribute("href")!.slice(1);
      if (!lenis && id !== "ziyaret" && id !== "evler") return;
      if (goTo(id)) e.preventDefault();
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("click", onClick);
      offPanel();
      offFocus();
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
    const q = params.get("tier") as Tier | null;
    // The mode decision (and with it the scene's ~1 MB of code and its shader
    // compiles) waits until the first paint is on screen and the main thread
    // is idle, so the headline and its fonts never queue behind three.js.
    let raf = 0;
    let idle = 0;
    let timer = 0;
    const decide = () => {
      // the probe context costs tens of ms in the GPU process: after the paint too
      const gpu = probeGL();
      // a software rasteriser can draw the scene but not at a usable frame rate
      const ok = gpu.ok && (forced === "webgl" || !SOFTWARE_GL.test(gpu.renderer));
      if (!ok || forced === "stills" || (reduce && params.get("still") === null && forced !== "webgl")) setMode("stills");
      else {
        setTier(q === "high" || q === "mid" || q === "low" ? q : detectTier(gpu.renderer));
        setMode("webgl");
      }
    };
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        if (ric) idle = ric(decide, { timeout: 700 });
        else timer = window.setTimeout(decide, 60);
      });
    });
    document.fonts?.ready.then(() => addLoad(1));
    const off = on("ready", () => setReady(true));
    return () => {
      cancelAnimationFrame(raf);
      if (idle) (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback?.(idle);
      clearTimeout(timer);
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

