"use client";

/**
 * Bu mevsim sofrada: the service scene (signature moment 1).
 *
 * One sini from the first screen to the table. On wide screens that support
 * scroll-driven animation, the sini in this scene starts exactly where the hero
 * sini sits and, as the page scrolls, shrinks and settles into the service
 * stage; the hero copy is hidden while this one flies. Two wrappers do it, both
 * on the root scroll timeline over the same range (0 to the scroll at which the
 * stage becomes sticky):
 *   .kk-fly       cancels the scroll (linear), so the sini holds its place in
 *                 the viewport the way the sticky stage will;
 *   .kk-fly-path  carries it from the hero box to the stage box (eased).
 * At the end of the range both are identity and position: sticky takes over,
 * so there is no hand-off. JS only measures the two boxes on load and resize.
 * Phones, reduced motion and browsers without scroll timelines keep two sinis
 * (hero + sticky stage): nothing travels, nothing is lost.
 *
 * The sini then stays on screen (CSS sticky, native scroll; no scroll
 * hijacking). Each plate's text block passing the middle of the viewport
 * serves that plate: it arrives from the upper right, where the waiter comes
 * in, turning slightly and settling as its shadow tightens; the previous plate
 * slides off to the lower left. Scrolling back reverses the direction. This is
 * a step, not a scrubbed video: every plate is one served course.
 *
 * Interruptible: a plate caught mid-flight starts its next move from where it
 * is. Reduced motion: plates cross-fade in 160 ms, nothing travels.
 * No JavaScript: the first plate sits on the sini and every block shows its own
 * small photo, so the menu is fully readable.
 */

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { tr } from "@/content/kalemkar/tr";
import { DISHES } from "@/content/kalemkar/menu";
import { Sini } from "../sini/Sini";
import { Photo } from "../ui/Photo";
import type { ImageKey } from "@/content/kalemkar/images";

const s = tr.service;
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_IO = "cubic-bezier(0.77, 0, 0.175, 1)";
// Arrival: softer than --kk-out so the waiter's path is seen before the plate settles.
const EASE_ARRIVE = "cubic-bezier(0.22, 0.9, 0.3, 1)";
// Where plates come from and go to, as % of their own size.
const WAITER = "translate(38%, -60%) rotate(16deg) scale(1.04)";
const TABLE_OUT = "translate(-36%, 26%) rotate(-9deg) scale(0.96)";
const REST = "translate(0%, 0%) rotate(0deg) scale(1)";

function move(el: HTMLElement, to: { transform: string; opacity: number }, from: { transform?: string; opacity?: number }, opts: KeyframeAnimationOptions) {
  const cs = getComputedStyle(el);
  const running = el.getAnimations().length > 0;
  const start = running ? { transform: cs.transform === "none" ? REST : cs.transform, opacity: Number(cs.opacity) } : from;
  el.getAnimations().forEach((a) => a.cancel());
  el.style.transform = to.transform;
  el.style.opacity = String(to.opacity);
  return el.animate([start, to], opts);
}

/** Measure the hero box and the stage box; publish them as CSS variables. */
function useFlight(grid: React.RefObject<HTMLDivElement | null>, stage: React.RefObject<HTMLDivElement | null>, fly: React.RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const home = grid.current?.closest<HTMLElement>("[data-kk-home]");
    const hero = home?.querySelector<HTMLElement>(".kk-hero-object .kk-sini");
    if (!home || !hero || !grid.current || !stage.current || !fly.current) return;
    const supported = typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()");
    const mq = matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    const measure = () => {
      raf = 0;
      if (!supported || !mq.matches) {
        home.removeAttribute("data-fly");
        return;
      }
      const y = window.scrollY;
      const h = hero.getBoundingClientRect();
      const g = grid.current!.getBoundingClientRect();
      const st = stage.current!.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(stage.current!).top) || 0;
      const w = fly.current!.offsetWidth;
      const end = g.top + y - top;
      if (end < 200 || !w || !h.width) {
        home.removeAttribute("data-fly");
        return;
      }
      const set = (k: string, v: string) => home.style.setProperty(k, v);
      set("--kk-fly-end", `${end.toFixed(1)}px`);
      set("--kk-fly-x", `${(h.left - st.left).toFixed(1)}px`);
      set("--kk-fly-y", `${(h.top + y - top).toFixed(1)}px`);
      set("--kk-fly-s", (h.width / w).toFixed(4));
      home.setAttribute("data-fly", "");
    };
    const later = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    // Where nothing travels (phones, reduced motion, no scroll timelines) the
    // two sinis still never show at once: the service one takes over with a
    // short opacity change as soon as it enters the screen.
    const handOver = new IntersectionObserver(([e]) => home.toggleAttribute("data-sini-down", e.isIntersecting || e.boundingClientRect.top < 0), {
      rootMargin: "0px 0px -12% 0px",
    });
    handOver.observe(fly.current);
    home.setAttribute("data-handover", ""); // set only once JS runs: without it both sinis stay visible
    const ro = new ResizeObserver(later);
    ro.observe(grid.current);
    ro.observe(hero);
    window.addEventListener("resize", later);
    mq.addEventListener("change", later);
    document.fonts?.ready.then(later);
    return () => {
      handOver.disconnect();
      home.removeAttribute("data-handover");
      ro.disconnect();
      window.removeEventListener("resize", later);
      mq.removeEventListener("change", later);
      cancelAnimationFrame(raf);
      home.removeAttribute("data-fly");
    };
  }, [grid, stage, fly]);
}

/**
 * Nine small marks round the lower rim, in the sini's own language (like the
 * punched dots of the engraving): served plates are filled, the plate on the
 * sini is green. Pure state, no motion of its own, so reduced motion shows the
 * same count. Hidden while the sini is still the empty hero sini.
 */
function CourseDots({ served, total }: { served: number; total: number }) {
  const step = 8; // degrees between marks
  const start = 90 - ((total - 1) * step) / 2; // centred under the sini (90° = straight down)
  return (
    <svg className="kk-dots" viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
      {Array.from({ length: total }, (_, i) => {
        // Left to right: the first course on the left, as the counter reads.
        const a = ((start + (total - 1 - i) * step) * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={(500 + Math.cos(a) * 470).toFixed(1)}
            cy={(500 + Math.sin(a) * 470).toFixed(1)}
            r="7"
            data-s={i < served ? "done" : i === served ? "now" : undefined}
          />
        );
      })}
    </svg>
  );
}

export function Servis() {
  const [active, setActive] = useState(-1);
  const prev = useRef(-1);
  const plates = useRef<(HTMLDivElement | null)[]>([]);
  const steps = useRef<(HTMLLIElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  useFlight(gridRef, stageRef, flyRef);

  // Which block is crossing the middle of the viewport.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setActive(0);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      // On phones the sticky sini band covers about the top third: the serving
      // line sits just below it, where the block's text is read.
      { rootMargin: matchMedia("(max-width: 767px)").matches ? "-38% 0px -60% 0px" : "-48% 0px -48% 0px" },
    );
    steps.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // Serve.
  useEffect(() => {
    if (active < 0 || active === prev.current) return;
    const from = prev.current;
    prev.current = active;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dir = active > from ? 1 : -1;
    const inEl = plates.current[active];
    const outEl = from >= 0 ? plates.current[from] : null;
    // Anything else still visible (fast scrolling) leaves quietly.
    plates.current.forEach((p, i) => {
      if (!p || i === active || i === from) return;
      if (p.style.opacity !== "0") move(p, { transform: TABLE_OUT, opacity: 0 }, {}, { duration: calm ? 1 : 240, easing: EASE_IO });
    });
    if (calm) {
      if (inEl) move(inEl, { transform: REST, opacity: 1 }, { transform: REST, opacity: 0 }, { duration: 160, easing: "linear" });
      if (outEl) move(outEl, { transform: REST, opacity: 0 }, { transform: REST, opacity: 1 }, { duration: 160, easing: "linear" });
      return;
    }
    if (outEl) {
      // Cleared quickly: gone before it leaves the copper, so no ghost on the dark table.
      const a = move(outEl, { transform: dir > 0 ? TABLE_OUT : WAITER, opacity: 0 }, { transform: REST, opacity: 1 }, { duration: 560, easing: EASE_IO });
      const fx = a.effect as KeyframeEffect | null;
      if (fx) {
        const [k0, k1] = fx.getKeyframes();
        fx.setKeyframes([k0, { opacity: 0, offset: 0.62 }, k1]);
      }
    }
    if (inEl) {
      const startT = dir > 0 ? WAITER : TABLE_OUT;
      const cs = getComputedStyle(inEl);
      const running = inEl.getAnimations().length > 0;
      inEl.getAnimations().forEach((a) => a.cancel());
      inEl.style.transform = REST;
      inEl.style.opacity = "1";
      inEl.animate(
        [
          { transform: running ? cs.transform : startT, opacity: running ? Number(cs.opacity) : 0, offset: 0 },
          { opacity: 1, offset: 0.22 },
          { transform: REST, opacity: 1, offset: 1 },
        ],
        { duration: 980, delay: outEl ? 140 : 0, easing: EASE_ARRIVE, fill: "backwards" },
      );
      const sh = inEl.querySelector<HTMLElement>(".kk-plate-shadow");
      sh?.animate(
        [
          { transform: "translate(16%, 22%) scale(1.2)", opacity: 0.12 },
          { transform: "translate(3%, 5%) scale(1)", opacity: 0.62 },
        ],
        { duration: 980, delay: outEl ? 140 : 0, easing: EASE_OUT, fill: "backwards" },
      );
    }
  }, [active]);

  const next = () => {
    const target = steps.current[active >= DISHES.length - 1 ? 0 : Math.max(0, active + 1)];
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    target?.scrollIntoView({ block: "center", behavior: calm ? "auto" : "smooth" });
  };

  const shown = Math.max(0, active);
  const last = active >= DISHES.length - 1;

  return (
    <section className="kk-serve" aria-labelledby="kk-serve-title" data-started={active >= 0 || undefined}>
      <div ref={gridRef} className="kk-wrap kk-serve-grid">
        <div className="kk-serve-text">
          <header className="kk-serve-head">
            <h2 id="kk-serve-title" className="kk-h2">
              {s.title}
            </h2>
            <p className="kk-lede">{s.sub}</p>
            <p className="kk-facts">{tr.hero.facts}</p>
          </header>

          <ol className="kk-serve-steps">
            {DISHES.map((d, i) => (
              <li
                key={d.key}
                ref={(el) => {
                  steps.current[i] = el;
                }}
                data-i={i}
                className="kk-step"
                data-active={i === active || undefined}
              >
                <div className="kk-step-in">
                  <Photo k={d.key as ImageKey} sizes="120px" className="kk-step-thumb" />
                  <p className="kk-step-n" aria-hidden="true">
                    {i + 1}
                    <small>
                      {s.of} {DISHES.length}
                    </small>
                  </p>
                  <h3 className="kk-step-name">{d.name}</h3>
                  <p className="kk-step-line">{d.line}</p>
                  <dl className="kk-step-meta">
                    <div>
                      <dt>{s.fromLabel}</dt>
                      <dd>{d.source}</dd>
                    </div>
                    <div>
                      <dt>{s.pairingLabel}</dt>
                      <dd>{d.pairing}</dd>
                    </div>
                  </dl>
                  {/* Wide screens: the count sits under the text it belongs to. */}
                  <div className="kk-step-count" aria-hidden="true">
                    <span className="kk-serve-num">
                      {i + 1}
                      <small>
                        {s.of} {DISHES.length}
                      </small>
                    </span>
                    {i === active && (
                      <button type="button" className="kk-btn kk-btn--line kk-btn--sm" onClick={next} tabIndex={-1}>
                        {last ? s.restart : s.next}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div ref={stageRef} className="kk-serve-stage">
          <div ref={flyRef} className="kk-fly">
            <div className="kk-fly-path">
              {/* Same sizes as the hero sini: one download, and sharp while it is still large. */}
              <Sini variant="serve" ring="spin" priority sizes="(max-width: 767px) 92vw, 72vw">
                <div className="kk-plates">
                  {DISHES.map((d, i) => (
                    <div
                      key={d.key}
                      ref={(el) => {
                        plates.current[i] = el;
                      }}
                      className="kk-plate"
                      data-i={i}
                    >
                      <div className="kk-plate-shadow" />
                      <Photo k={d.key as ImageKey} sizes="(max-width: 767px) 40vw, 24vw" alt="" />
                    </div>
                  ))}
                </div>
                <CourseDots served={active} total={DISHES.length} />
              </Sini>
            </div>
          </div>
          <div className="kk-serve-count" aria-hidden="true">
            <span className="kk-serve-num">
              {shown + 1}
              <small>
                {s.of} {DISHES.length}
              </small>
            </span>
            <span className="kk-serve-name">{DISHES[shown].name}</span>
            <button type="button" className="kk-btn kk-btn--line kk-btn--sm" onClick={next} tabIndex={-1}>
              {last ? s.restart : s.next}
            </button>
          </div>
        </div>
      </div>

      <div className="kk-wrap kk-serve-end">
        <Link href={`${tr.base}/sofra/`} className="kk-btn kk-btn--line">
          {s.allMenu}
        </Link>
        <Link href={`${tr.base}/rezervasyon/`} className="kk-btn kk-btn--accent">
          {s.book}
        </Link>
      </div>
    </section>
  );
}
