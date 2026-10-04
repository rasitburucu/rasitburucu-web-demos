"use client";

/**
 * Bu mevsim sofrada: the service scene (signature moment 1).
 *
 * The sini stays on screen (CSS sticky, native scroll; no scroll hijacking).
 * Each plate's text block passing the middle of the viewport serves that plate:
 * it arrives from the upper right, where the waiter comes in, turning slightly
 * and settling as its shadow tightens; the previous plate slides off to the
 * lower left. Scrolling back reverses the direction. This is a step, not a
 * scrubbed video: every plate is one served course.
 *
 * Interruptible: a plate caught mid-flight starts its next move from where it
 * is. Reduced motion: plates cross-fade in 160 ms, nothing travels.
 * No JavaScript: the first plate sits on the sini and every block shows its own
 * small photo, so the menu is fully readable.
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { tr } from "@/content/kalemkar/tr";
import { DISHES } from "@/content/kalemkar/menu";
import { Sini } from "../sini/Sini";
import { Photo } from "../ui/Photo";
import type { ImageKey } from "@/content/kalemkar/images";

const s = tr.service;
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_IO = "cubic-bezier(0.77, 0, 0.175, 1)";
// Where plates come from and go to, as % of their own size.
const WAITER = "translate(38%, -60%) rotate(16deg) scale(1.04)";
const TABLE_OUT = "translate(-52%, 36%) rotate(-11deg) scale(0.98)";
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

export function Servis() {
  const [active, setActive] = useState(-1);
  const prev = useRef(-1);
  const plates = useRef<(HTMLDivElement | null)[]>([]);
  const steps = useRef<(HTMLLIElement | null)[]>([]);

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
      // On phones the sticky sini covers the top third, so the serving line sits lower.
      { rootMargin: matchMedia("(max-width: 767px)").matches ? "-64% 0px -34% 0px" : "-48% 0px -48% 0px" },
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
      move(outEl, { transform: dir > 0 ? TABLE_OUT : WAITER, opacity: 0 }, { transform: REST, opacity: 1 }, { duration: 620, easing: EASE_IO });
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
        { duration: 980, delay: outEl ? 140 : 0, easing: EASE_OUT, fill: "backwards" },
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
    <section className="kk-serve" aria-labelledby="kk-serve-title">
      <div className="kk-wrap kk-serve-head">
        <h2 id="kk-serve-title" className="kk-h2">
          {s.title}
        </h2>
        <p className="kk-lede">{s.sub}</p>
        <p className="kk-facts">{tr.hero.facts}</p>
      </div>

      <div className="kk-wrap kk-serve-grid">
        <div className="kk-serve-stage">
          <Sini variant="serve" sizes="(max-width: 767px) 80vw, 46vw">
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
          </Sini>
          <div className="kk-serve-count" aria-hidden="true">
            <span className="kk-serve-num">
              {shown + 1}
              <small>
                {s.of} {DISHES.length}
              </small>
            </span>
            <button type="button" className="kk-btn kk-btn--line kk-btn--sm" onClick={next} tabIndex={-1}>
              {last ? s.restart : s.next}
            </button>
          </div>
        </div>

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
              </div>
            </li>
          ))}
        </ol>
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
