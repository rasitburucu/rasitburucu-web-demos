"use client";

// "Pazının içi": a pinned section whose scroll progress takes the P30 apart
// module by module along its joint axes, holds it open, puts it back together
// and returns it to work in the cell. GSAP ScrollTrigger pins and scrubs one
// number (p); the 3D scene, the vector drawing, the labels and the status
// strip all read it. Reduced motion: no pin, the open state with every label.
// No WebGL (or a weak device): the same teardown as a technical drawing.

import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { tr } from "@/content/pazi/tr";
import { kademeDpr, kaliteKademesi } from "@/lib/pazi/tier";
import { PART_COUNT, PART_IDS, P_OPEN, amounts, doneIn, framing, headIn, holdIn, introOut, readout, type Phase } from "./model";
import { ANCHOR, CHAIN, IN_WRIST_LOWER, TRAVEL, TeardownDrawing, VIEW, WRIST_LOWER } from "./Drawing";
import type { Anchor, TeardownScene } from "./scene";
import { arrangeLabels, countCrossings, leaderD, type LabelSlot } from "./labels";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

type Mode = "pending" | "webgl" | "vector";

const NARROW = "(max-width: 900px)";
const pad2 = (n: number) => String(n).padStart(2, "0");

export function Teardown() {
  const a = tr.about;
  const t = a.teardown;
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef<HTMLDivElement>(null);
  const leaders = useRef<SVGSVGElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const done = useRef<HTMLParagraphElement>(null);
  const hold = useRef<HTMLParagraphElement>(null);
  const hmi = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const sceneRef = useRef<TeardownScene | null>(null);
  const progress = useRef({ p: 0 });
  const slots = useRef<(LabelSlot | null)[]>([]);
  const amountsBuf = useRef<number[]>(new Array(PART_COUNT).fill(0));
  const last = useRef({ phase: "" as Phase | "", count: -1, active: -2 });
  const [mode, setMode] = useState<Mode>("pending");
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);
  const [narrow, setNarrow] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = matchMedia(NARROW);
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  /* ------------------------------------------------------------ anchors */

  /** Vector drawing anchors in stage pixels at progress p. */
  const drawingAnchors = (p: number): Anchor[] => {
    const svg = drawing.current?.querySelector("svg");
    const st = view.current;
    if (!svg || !st) return [];
    const e = amounts(p, new Array(PART_COUNT).fill(0));
    const sr = st.getBoundingClientRect();
    const rr = svg.getBoundingClientRect();
    const s = Math.min(rr.width / VIEW.w, rr.height / VIEW.h);
    const ox = rr.left - sr.left + (rr.width - VIEW.w * s) / 2;
    const oy = rr.top - sr.top + (rr.height - VIEW.h * s) / 2;
    return PART_IDS.map((id) => {
      let [x, y] = ANCHOR[id];
      for (const c of CHAIN[id]) {
        const k = e[PART_IDS.indexOf(c)];
        x += TRAVEL[c][0] * k;
        y += TRAVEL[c][1] * k;
      }
      if (IN_WRIST_LOWER.includes(id)) {
        const k = e[PART_IDS.indexOf("wrist")];
        x += WRIST_LOWER[0] * k;
        y += WRIST_LOWER[1] * k;
      }
      return { x: ox + (x - VIEW.x) * s, y: oy + (-y - VIEW.y) * s, z: 0 };
    });
  };

  const anchorsNow = (p: number) => (sceneRef.current && readyRef.current ? sceneRef.current.project() : drawingAnchors(p));

  /* ------------------------------------------------------------ labels */

  /** Column slots for the labels, from the fully open layout (wide screens). */
  const layout = () => {
    const st = stage.current;
    const ol = list.current;
    if (!st || !ol) return;
    const items = Array.from(ol.children) as HTMLElement[];
    if (!st.dataset.labels) {
      slots.current = [];
      return;
    }
    const open = sceneRef.current && readyRef.current ? sceneRef.current.projectOpen() : drawingAnchors(P_OPEN);
    if (open.length !== PART_COUNT) return;
    const W = st.clientWidth;
    const H = st.clientHeight;
    const gut = Math.max(16, Math.min(40, W * 0.025));
    const colW = Math.min(260, Math.max(200, W * 0.19));
    // pinned: the heading has faded before the first top-left label appears (model.headIn);
    // still: the heading stays, so the left column starts under it
    const pinned = root.current?.dataset.motion === "pin";
    const headBox = head.current?.getBoundingClientRect();
    const stBox = st.getBoundingClientRect();
    // both columns start the same distance under the one-line point of the open state,
    // so the sentence and the first row of labels keep their rhythm
    const holdBox = hold.current?.getBoundingClientRect();
    const holdTop = holdBox && holdBox.height ? holdBox.bottom - stBox.top + 76 : 20;
    const topL = Math.max(holdTop, !pinned && headBox ? headBox.bottom - stBox.top + 18 : 20);
    const topR = holdTop;
    const hmiH = hmi.current && getComputedStyle(hmi.current).position === "absolute" ? hmi.current.offsetHeight : 0;
    const bottom = H - hmiH - 16;
    const hs = items.map((el) => el.offsetHeight || 48);
    const next = arrangeLabels(
      open.map((p) => ({ x: p.x, y: p.y })),
      hs,
      { left: gut, right: W - gut - colW, colW, topL, topR, bottom },
    );
    slots.current = next;
    if (process.env.NODE_ENV !== "production") (window as unknown as { __tdCross?: number }).__tdCross = countCrossings(next, open);
    items.forEach((el, i) => {
      const s = next[i];
      if (!s) return;
      el.style.width = `${s.w}px`;
      el.style.transform = `translate(${Math.round(s.x)}px, ${Math.round(s.y)}px)`;
      el.dataset.side = s.side < 0 ? "l" : "r";
    });
  };

  /** Leader lines and label visibility for the current progress. */
  const drawLabels = (p: number) => {
    const st = stage.current;
    const ol = list.current;
    const svg = leaders.current;
    if (!st || !ol || !svg) return;
    const e = amountsBuf.current;
    amounts(p, e);
    const { active } = readout(p);
    const items = Array.from(ol.children) as HTMLElement[];
    const anchors = anchorsNow(p);
    const wide = !!st.dataset.labels;
    const paths = svg.querySelectorAll<SVGPathElement>("path[data-i]");
    const dots = svg.querySelectorAll<SVGCircleElement>("circle[data-i]");
    for (let i = 0; i < PART_COUNT; i++) {
      const vis = Math.min(1, Math.max(0, (e[i] - 0.12) / 0.33));
      const el = items[i];
      if (el) {
        el.style.opacity = wide ? String(vis) : "";
        el.dataset.active = i === active ? "true" : "false";
      }
      const s = slots.current[i];
      const an = anchors[i];
      const path = paths[i];
      const c = dots[i];
      if (!path || !c) continue;
      if (!wide || !s || !an || vis <= 0.001 || an.z > 1) {
        path.style.opacity = "0";
        c.style.opacity = "0";
        continue;
      }
      path.setAttribute("d", leaderD(s, an));
      path.style.opacity = String(vis);
      c.setAttribute("cx", an.x.toFixed(1));
      c.setAttribute("cy", an.y.toFixed(1));
      c.style.opacity = String(vis);
      c.dataset.active = i === active ? "true" : "false";
    }
    // phones: one marker on the part in focus
    const d = dot.current;
    if (d) {
      const an = active >= 0 ? anchors[active] : null;
      if (!wide && an && e[active] > 0.3) {
        d.style.opacity = "1";
        d.style.transform = `translate(${an.x.toFixed(1)}px, ${an.y.toFixed(1)}px)`;
      } else d.style.opacity = "0";
    }
  };

  /* ------------------------------------------------------------ apply */

  const apply = (p: number) => {
    const e = amounts(p, amountsBuf.current);
    const scene = sceneRef.current;
    if (scene) scene.setProgress(p);

    // vector drawing (fallback, and first paint before WebGL)
    const dw = drawing.current;
    if (dw && (!scene || !readyRef.current)) {
      const f = framing(p);
      const isNarrow = !!stage.current && !stage.current.dataset.labels;
      dw.style.transform = isNarrow ? `translateY(${((1 - f) * 12).toFixed(2)}%)` : `translateX(${((1 - f) * 17).toFixed(2)}%)`;
      dw.querySelectorAll<SVGGElement>("[data-td]").forEach((g) => {
        const id = g.dataset.td as (typeof PART_IDS)[number];
        const k = e[PART_IDS.indexOf(id)];
        const [x, y] = TRAVEL[id];
        g.setAttribute("transform", k > 0 ? `translate(${(x * k).toFixed(1)} ${(-y * k).toFixed(1)})` : "");
      });
      const lower = dw.querySelector<SVGGElement>("[data-td-lower]");
      const kw = e[PART_IDS.indexOf("wrist")];
      lower?.setAttribute("transform", kw > 0 ? `translate(${(WRIST_LOWER[0] * kw).toFixed(1)} ${(-WRIST_LOWER[1] * kw).toFixed(1)})` : "");
      dw.querySelectorAll<SVGPathElement>("[data-tg]").forEach((g) => {
        const id = g.dataset.tg as (typeof PART_IDS)[number];
        const k = e[PART_IDS.indexOf(id)];
        let x = 0;
        let y = 0;
        for (const c of CHAIN[id].slice(0, -1)) {
          const kc = e[PART_IDS.indexOf(c)];
          x += TRAVEL[c][0] * kc;
          y += TRAVEL[c][1] * kc;
        }
        if (IN_WRIST_LOWER.includes(id)) {
          x += WRIST_LOWER[0] * kw;
          y += WRIST_LOWER[1] * kw;
        }
        g.setAttribute("transform", `translate(${x.toFixed(1)} ${(-y).toFixed(1)})`);
        g.setAttribute("opacity", (0.7 * Math.min(1, k * 1.4)).toFixed(3));
      });
      drawLabels(p);
    }

    // text layers
    const set = (el: HTMLElement | null, v: number, lift = 0) => {
      if (!el) return;
      el.style.opacity = v.toFixed(3);
      el.style.visibility = v < 0.01 ? "hidden" : "";
      if (lift) el.style.transform = `translateY(${((1 - v) * lift).toFixed(1)}px)`;
    };
    const pinned = root.current?.dataset.motion === "pin";
    if (pinned) {
      set(intro.current, 1 - introOut(p), 0);
      set(head.current, headIn(p), 12);
      set(done.current, doneIn(p), 12);
      set(hold.current, holdIn(p));
    }

    // status strip
    const r = readout(p);
    const h = hmi.current;
    const l = last.current;
    if (h && (r.phase !== l.phase || r.count !== l.count || r.active !== l.active)) {
      l.phase = r.phase;
      l.count = r.count;
      l.active = r.active;
      h.dataset.phase = r.phase;
      const q = (s: string) => h.querySelector<HTMLElement>(s);
      const count = q("[data-k=count]");
      const mod = q("[data-k=module]");
      const ph = q("[data-k=phase]");
      const cap = q("[data-k=caption]");
      if (count) count.textContent = pad2(r.count);
      const id = r.active >= 0 ? PART_IDS[r.active] : null;
      const part = id ? a.parts[id] : null;
      if (mod) mod.textContent = part ? part.name : r.phase === "work" ? t.phases.work : t.none;
      if (ph) ph.textContent = t.phases[r.phase];
      if (cap) cap.textContent = part ? part.text : "";
      h.querySelectorAll<HTMLElement>("[data-tick]").forEach((el, i) => {
        el.dataset.on = i < r.count ? "true" : "false";
      });
    }
  };

  /* ------------------------------------------------------------ scroll */

  useGSAP(
    () => {
      const el = root.current;
      if (!el || narrow === null) return;
      const mm = gsap.matchMedia();
      mm.add({ pin: "(prefers-reduced-motion: no-preference)", still: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        // ?hareket=0 forces the still layout (checks), like the live cell;
        // ?kare=0.57 holds the pinned stage at one progress without scrolling (stills, OG image)
        const params = new URLSearchParams(location.search);
        const forced = params.get("hareket") === "0";
        const kare = Number(params.get("kare"));
        const pin = (ctx.conditions as { pin: boolean }).pin && !forced;
        const st0 = stage.current;
        if (pin && params.has("kare") && kare >= 0 && kare <= 1) {
          el.dataset.motion = "pin";
          el.dataset.still = "true";
          if (st0) {
            if (narrow) delete st0.dataset.labels;
            else st0.dataset.labels = "true";
          }
          progress.current.p = kare;
          layout();
          apply(kare);
          return () => {
            delete el.dataset.motion;
            delete el.dataset.still;
          };
        }
        el.dataset.motion = pin ? "pin" : "static";
        const st = stage.current;
        if (st) {
          if (narrow) delete st.dataset.labels;
          else st.dataset.labels = "true";
        }
        if (!pin) {
          progress.current.p = P_OPEN;
          layout();
          apply(P_OPEN);
          drawLabels(P_OPEN);
          return;
        }
        const header = parseFloat(getComputedStyle(el).getPropertyValue("--pz-header-h")) || 64;
        const state = progress.current;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            pin: true,
            start: `top ${header}px`,
            end: () => `+=${Math.round(window.innerHeight * (narrow ? 4.6 : 7))}`,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: () => {
              layout();
              apply(state.p);
            },
          },
        });
        tl.to(state, { p: 1, onUpdate: () => apply(state.p) });
        if (process.env.NODE_ENV !== "production") (window as unknown as { __tdST?: unknown }).__tdST = tl.scrollTrigger;
        layout();
        apply(state.p);
        return () => {
          delete el.dataset.motion;
        };
      });
      let off = false;
      document.fonts?.ready.then(() => {
        if (!off) ScrollTrigger.refresh();
      });
      return () => {
        off = true;
        mm.revert();
      };
    },
    { scope: root, dependencies: [narrow], revertOnUpdate: true },
  );

  /* ------------------------------------------------------------ scene */

  useEffect(() => {
    if (narrow === null) return;
    const q = kaliteKademesi();
    const params = new URLSearchParams(location.search);
    if (q.kademe === "yok" || q.kademe === "dusuk" || params.get("cizim") === "1") {
      setMode("vector");
      return;
    }
    setMode("webgl");
    let alive = true;
    let scene: TeardownScene | null = null;
    const start = () =>
      import("./scene")
        .then(({ TeardownScene }) => {
          if (!alive || !canvas.current) return;
          const kaba = matchMedia("(pointer: coarse)").matches;
          scene = new TeardownScene(canvas.current, {
            quality: q.kademe === "yuksek" ? "high" : "mid",
            dpr: Math.min(kademeDpr(q.kademe, undefined, kaba), 1.75),
            narrow,
            onRender: () => drawLabels(progress.current.p),
          });
          sceneRef.current = scene;
          scene.setProgress(progress.current.p);
          readyRef.current = true;
          scene.renderNow();
          setReady(true);
          if (process.env.NODE_ENV !== "production") (window as unknown as { __td?: unknown }).__td = scene;
        })
        .catch(() => alive && setMode("vector"));
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const handle = idle ? idle(start, { timeout: 900 }) : window.setTimeout(start, 120);
    return () => {
      alive = false;
      if (!idle) window.clearTimeout(handle);
      sceneRef.current = null;
      readyRef.current = false;
      scene?.dispose();
      setReady(false);
    };
    // drawLabels reads refs only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [narrow]);

  // once the scene draws, lay the labels out against it (and on every resize)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!ready || !scene) return;
    scene.onResize = () => {
      layout();
      drawLabels(progress.current.p);
    };
    layout();
    apply(progress.current.p);
    scene.renderNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // vector mode: relayout on resize (the scene handles its own)
  useEffect(() => {
    if (mode !== "vector" || !stage.current) return;
    const ro = new ResizeObserver(() => {
      layout();
      apply(progress.current.p);
    });
    ro.observe(stage.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  /* ------------------------------------------------------------ markup */

  return (
    <section ref={root} id={t.id} className="pz-td" data-mode={mode} data-ready={ready ? "true" : "false"} aria-labelledby="pz-td-title">
      <div ref={intro} className="pz-td-intro">
        <h1 className="pz-display pz-td-h1">{a.intro.title}</h1>
        <div className="pz-td-story">
          {a.intro.story.map((s) => (
            <p key={s}>{s}</p>
          ))}
        </div>
        <p className="pz-td-hint">
          <svg width="14" height="18" viewBox="0 0 14 18" aria-hidden="true">
            <path d="M7 1v15M1.5 10.5 7 16l5.5-5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          {a.intro.hint}
        </p>
      </div>

      <div ref={stage} className="pz-td-stage">
        <div ref={head} className="pz-td-head">
          <h2 id="pz-td-title" className="pz-h2">
            {t.title}
          </h2>
          <p>{t.lead}</p>
        </div>
        <p ref={done} className="pz-td-done">
          {t.done}
        </p>
        <p ref={hold} className="pz-td-hold">
          {t.hold}
        </p>

        <div ref={view} className="pz-td-view">
          <div ref={drawing} className="pz-td-drawing" aria-hidden={mode === "webgl" ? "true" : undefined}>
            <TeardownDrawing label={t.drawing} />
          </div>
          {mode === "webgl" ? <canvas ref={canvas} className="pz-td-canvas" aria-hidden="true" /> : null}
          <svg ref={leaders} className="pz-td-leaders" aria-hidden="true">
            {PART_IDS.map((id, i) => (
              <path key={id} data-i={i} />
            ))}
            {PART_IDS.map((id, i) => (
              <circle key={id} data-i={i} r="3.5" />
            ))}
          </svg>
          <span ref={dot} className="pz-td-dot" aria-hidden="true" />
        </div>

        <div ref={hmi} className="pz-td-hmi" data-phase="ready" aria-hidden="true">
          <dl className="pz-td-cells">
            <div>
              <dt>{t.part}</dt>
              <dd>
                <span data-k="count">00</span>
                <small>/ {pad2(PART_COUNT)}</small>
              </dd>
            </div>
            <div className="pz-td-mod">
              <dt>{t.module}</dt>
              <dd data-k="module">{t.none}</dd>
            </div>
            <div>
              <dt>{t.status}</dt>
              <dd>
                <span className="pz-lamp" />
                <span data-k="phase">{t.phases.ready}</span>
              </dd>
            </div>
          </dl>
          <ol className="pz-td-ticks">
            {PART_IDS.map((id) => (
              <li key={id} data-tick="" data-on="false" />
            ))}
          </ol>
          <p className="pz-td-caption" data-k="caption" />
        </div>

        <h3 className="pz-sr">{t.listTitle}</h3>
        <ol ref={list} className="pz-td-parts">
          {PART_IDS.map((id, i) => {
            const part = a.parts[id];
            return (
              <li key={id} className="pz-td-label" data-part={id} style={{ "--i": i } as CSSProperties}>
                <span className="pz-td-num pz-mono">{pad2(i + 1)}</span>
                <span className="pz-td-name">
                  {part.name}
                  {part.code ? <span className="pz-td-code pz-mono"> {part.code}</span> : null}
                </span>
                <span className="pz-td-text">{part.text}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/** Phones: the same list after the pinned stage, for scanning (screen readers use the list inside). */
export function TeardownList() {
  const a = tr.about;
  return (
    <div className="pz-wrap pz-td-after" aria-hidden="true">
      <p className="pz-td-after-title">{a.teardown.listTitle}</p>
      <ol>
        {PART_IDS.map((id, i) => {
          const part = a.parts[id];
          return (
            <li key={id}>
              <span className="pz-mono">{pad2(i + 1)}</span>
              <span>
                <strong>{part.name}</strong>
                {part.code ? <span className="pz-mono"> {part.code}</span> : null} {part.text}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
