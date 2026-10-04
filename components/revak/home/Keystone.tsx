"use client";

import { useRef, useState } from "react";
import { tr } from "@/content/revak/tr";
import { gsap, useGSAP } from "@/lib/revak/motion";

const t = tr.keystone;

/* ------------------------------------------------------------------------ *
 * "Kilit taşı": where the walk ends, an arch is laid stone by stone as the
 * page scrolls. The voussoirs settle from both springers in turn; the
 * keystone drops in last and, as it seats, the arch carries itself (a short
 * settle, a little dust). Then the arch takes the wall and the inscription
 * stone (kitabe) above it, where a parent can carve the child's name.
 *
 * Every stone is its own small SVG, positioned in % of a 600 × 620 box, so
 * the scrubbed motion is CSS transform/opacity on HTML elements (composited),
 * never SVG attribute changes (which repaint the whole drawing every frame).
 * Reduced motion / no JS: the arch stands finished; the form works the same.
 * The name lives in this component's state only: never sent, never stored.
 * ------------------------------------------------------------------------ */

const W = 600;
const H = 620;
const CX = 300;
const CY = 360; // springing line
const R_IN = 140;
const R_OUT = 215;
const R_KEY = 232;
const N = 9; // voussoirs, the middle one is the keystone
const KEY = 4;

const rad = (d: number) => (d * Math.PI) / 180;
const pt = (r: number, a: number): [number, number] => [CX + r * Math.cos(rad(a)), CY - r * Math.sin(rad(a))];
const f = (n: number) => Math.round(n * 10) / 10;

type Shape = { d: string; box: [number, number, number, number] };

function bbox(points: [number, number][], pad = 2): [number, number, number, number] {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const x0 = Math.floor(Math.min(...xs) - pad);
  const y0 = Math.floor(Math.min(...ys) - pad);
  return [x0, y0, Math.ceil(Math.max(...xs) + pad) - x0, Math.ceil(Math.max(...ys) + pad) - y0];
}

// one voussoir: inner arc (intrados) and outer arc (extrados) between two radial joints
function voussoir(i: number): Shape & { mid: number } {
  const a0 = 180 - (180 / N) * i;
  const a1 = 180 - (180 / N) * (i + 1);
  const mid = (a0 + a1) / 2;
  const i0 = pt(R_IN, a0);
  const i1 = pt(R_IN, a1);
  if (i === KEY) {
    // the keystone: taller than the ring and flared, with a flat top
    const o0 = pt(R_KEY, a0 - 1);
    const o1 = pt(R_KEY, a1 + 1);
    const top = Math.min(o0[1], o1[1]);
    const d = `M${f(i0[0])} ${f(i0[1])}L${f(o0[0])} ${f(top)}L${f(o1[0])} ${f(top)}L${f(i1[0])} ${f(i1[1])}A${R_IN} ${R_IN} 0 0 0 ${f(i0[0])} ${f(i0[1])}Z`;
    return { d, box: bbox([i0, i1, [o0[0], top], [o1[0], top], pt(R_IN, mid)]), mid };
  }
  const o0 = pt(R_OUT, a0);
  const o1 = pt(R_OUT, a1);
  const d = `M${f(i0[0])} ${f(i0[1])}L${f(o0[0])} ${f(o0[1])}A${R_OUT} ${R_OUT} 0 0 1 ${f(o1[0])} ${f(o1[1])}L${f(i1[0])} ${f(i1[1])}A${R_IN} ${R_IN} 0 0 0 ${f(i0[0])} ${f(i0[1])}Z`;
  return { d, box: bbox([i0, i1, o0, o1, pt(R_OUT, mid), pt(R_IN, mid)]), mid };
}

const STONES = Array.from({ length: N }, (_, i) => voussoir(i));
// laying order: springers first, left and right in turn, the keystone last
const ORDER = [0, 8, 1, 7, 2, 6, 3, 5];

// piers: four courses, alternating one and two blocks, an impost on top
const PIER_BLOCKS: [number, number, number, number][] = [];
for (const [x0, x1] of [
  [40, 160],
  [440, 560],
]) {
  for (let k = 0; k < 4; k++) {
    const y = 372 + k * 62;
    if (k % 2) PIER_BLOCKS.push([x0, y, (x1 - x0) / 2, 62], [x0 + (x1 - x0) / 2, y, (x1 - x0) / 2, 62]);
    else PIER_BLOCKS.push([x0, y, x1 - x0, 62]);
  }
}

// the wall the finished arch carries (spandrels), the cornice and the inscription stone
const KO = pt(R_KEY, 180 - (180 / N) * KEY - 1); // keystone's outer left corner
const EX = pt(R_OUT, 180 - (180 / N) * KEY); // extrados at the keystone's left joint
const UP: [number, number, number, number] = [30, 22, 540, 338]; // x, y, w, h of the upper group
const SPANDREL_L = `M40 360L85 360A${R_OUT} ${R_OUT} 0 0 1 ${f(EX[0])} ${f(EX[1])}L${f(KO[0])} ${f(KO[1])}L${f(KO[0])} 128L40 128Z`;
const SPANDREL_R = `M560 360L515 360A${R_OUT} ${R_OUT} 0 0 0 ${f(W - EX[0])} ${f(EX[1])}L${f(W - KO[0])} ${f(KO[1])}L${f(W - KO[0])} 128L560 128Z`;

const FILLS = ["#d8d0bf", "#d2c9b6", "#dcd5c6", "#d5cdbb", "#cfc6b3"];
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const place = ([x, y, w, h]: [number, number, number, number], ox = 0, oy = 0, ow = W, oh = H) => ({
  left: pct(x - ox, ow),
  top: pct(y - oy, oh),
  width: pct(w, ow),
  height: pct(h, oh),
});

const DUST = [
  [-1, 0.2],
  [-1, -0.4],
  [-0.6, -0.9],
  [1, 0.2],
  [1, -0.4],
  [0.6, -0.9],
];

const upper = (s: string) => s.toLocaleUpperCase("tr-TR");
const clean = (s: string) => s.replace(/\s+/g, " ").trim().slice(0, 24);

export function Keystone() {
  const root = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [carved, setCarved] = useState("");
  const [run, setRun] = useState(0);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => build(el));
      return () => mm.revert();
    },
    { scope: root },
  );

  const lines = carved ? [upper(carved)] : t.motto.map(upper);
  const n = Math.max(10, ...lines.map((l) => l.length));

  return (
    <section ref={root} className="rv-ks" id="kilit-tasi" aria-labelledby="rv-ks-title">
      <div className="rv-ks-stage">
        <div className="rv-wrap rv-ks-in">
          <div className="rv-ks-arch">
            <div className="rv-ks-ground" aria-hidden="true" />
            <svg className="rv-ks-piers" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
              {PIER_BLOCKS.map(([x, y, w, h], i) => (
                <rect key={i} x={x} y={y} width={w} height={h} fill={FILLS[(i * 3) % FILLS.length]} className="rv-ks-block" />
              ))}
              <rect x={34} y={360} width={132} height={12} className="rv-ks-impost" />
              <rect x={434} y={360} width={132} height={12} className="rv-ks-impost" />
            </svg>

            <div className="rv-ks-ring" aria-hidden="true">
              {STONES.map((s, i) => (
                <svg
                  key={i}
                  className={i === KEY ? "rv-ks-stone rv-ks-key" : "rv-ks-stone"}
                  data-i={i}
                  data-mid={s.mid}
                  viewBox={s.box.join(" ")}
                  style={place(s.box)}
                  focusable="false"
                >
                  <path d={s.d} fill={i === KEY ? "#dcd4c3" : FILLS[i % FILLS.length]} className="rv-ks-face" />
                </svg>
              ))}
              {DUST.map(([dx, dy], i) => (
                <span
                  key={i}
                  className="rv-ks-dust"
                  data-dx={dx}
                  data-dy={dy}
                  style={{ left: pct(CX + dx * 34, W), top: pct(CY - 182 + dy * 12, H) }}
                />
              ))}
            </div>

            <div className="rv-ks-upper" style={place(UP)}>
              <svg viewBox={UP.join(" ")} aria-hidden="true" focusable="false">
                <defs>
                  <pattern id="rv-ks-courses" width="96" height="58" patternUnits="userSpaceOnUse" x="40" y="128">
                    <path d="M0 58H96M48 0V29M0 29H96M96 29V58" className="rv-ks-joint" />
                  </pattern>
                </defs>
                <path d={SPANDREL_L} className="rv-ks-wall" />
                <path d={SPANDREL_R} className="rv-ks-wall" />
                <path d={SPANDREL_L} fill="url(#rv-ks-courses)" />
                <path d={SPANDREL_R} fill="url(#rv-ks-courses)" />
                <rect x={30} y={110} width={540} height={18} className="rv-ks-cornice" />
                <rect x={60} y={22} width={480} height={88} className="rv-ks-plaque" />
                <rect x={68} y={30} width={464} height={72} className="rv-ks-plaque-in" />
              </svg>
              {/* the inscription: the school's word, or the name carved into it */}
              <p className="rv-ks-kitabe" style={{ "--n": n } as React.CSSProperties}>
                <span className="rv-sr">{carved ? carved : t.motto.join(" ")}</span>
                <span className="rv-ks-letters" aria-hidden="true" key={run} data-carved={carved ? "" : undefined}>
                  {lines.map((l, li) => (
                    <span key={li} className="rv-ks-line">
                      {Array.from(l).map((ch, ci) => (
                        <span key={ci} className="rv-ks-ch" style={{ "--i": ci } as React.CSSProperties}>
                          {ch === " " ? " " : ch}
                        </span>
                      ))}
                    </span>
                  ))}
                </span>
              </p>
            </div>
          </div>

          <div className="rv-ks-copy">
            <h2 className="rv-ks-title" id="rv-ks-title">
              {t.title}
            </h2>
            <form
              className="rv-ks-form"
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                const v = clean(name);
                setName(v);
                setCarved(v);
                setRun((r) => r + 1);
              }}
            >
              <label htmlFor="rv-ks-name" className="rv-ks-label">
                {t.label}
              </label>
              <div className="rv-ks-row">
                <input
                  id="rv-ks-name"
                  className="rv-input"
                  type="text"
                  value={name}
                  maxLength={24}
                  autoComplete="off"
                  autoCapitalize="words"
                  spellCheck={false}
                  aria-describedby="rv-ks-note"
                  onChange={(e) => setName(e.target.value)}
                />
                <button type="submit" className="rv-btn rv-btn--line">
                  {t.submit}
                </button>
              </div>
              <p className="rv-ks-note" id="rv-ks-note">
                {t.note}
              </p>
              <p className="rv-sr" aria-live="polite">
                {carved ? t.carved(carved) : ""}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */

function build(section: HTMLElement) {
  const arch = section.querySelector<HTMLElement>(".rv-ks-arch")!;
  const ring = section.querySelector<HTMLElement>(".rv-ks-ring")!;
  const stones = Array.from(section.querySelectorAll<SVGSVGElement>(".rv-ks-stone"));
  const key = stones[KEY];
  const dust = Array.from(section.querySelectorAll<HTMLElement>(".rv-ks-dust"));
  const up = section.querySelector<HTMLElement>(".rv-ks-upper")!;
  const title = section.querySelector<HTMLElement>(".rv-ks-title")!;
  const form = section.querySelector<HTMLElement>(".rv-ks-form")!;
  // drawing units → px at the current size
  const u = () => arch.clientWidth / W;

  section.classList.add("is-live");
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  // each voussoir comes in along its own radius, from outside and below, turning into place
  ORDER.forEach((i, k) => {
    const s = stones[i];
    const m = rad(Number(s.dataset.mid));
    const side = i < KEY ? -1 : 1;
    tl.fromTo(
      s,
      {
        x: () => Math.cos(m) * 150 * u(),
        y: () => (-Math.sin(m) * 150 + 70) * u(),
        rotation: side * 14,
        opacity: 0,
      },
      { x: 0, y: 0, rotation: 0, opacity: 1, duration: 1.1 },
      k * 0.85,
    );
  });
  // the keystone drops in from above, gathering speed
  const keyAt = tl.duration() + 0.15;
  tl.fromTo(key, { y: () => -230 * u(), opacity: 0 }, { y: 0, opacity: 1, duration: 1.15, ease: "power3.in" }, keyAt);
  const seat = keyAt + 1.15;
  // it seats: a short settle of the whole arch, a little dust from the joints
  tl.fromTo(ring, { y: 0 }, { y: () => 2.5 * u(), duration: 0.14, ease: "power1.out" }, seat);
  tl.to(ring, { y: 0, duration: 0.4, ease: "power2.out" }, seat + 0.14);
  dust.forEach((d) => {
    const dx = Number(d.dataset.dx);
    const dy = Number(d.dataset.dy);
    tl.fromTo(
      d,
      { x: 0, y: 0, scale: 0.4, opacity: 0 },
      { x: () => dx * 26 * u(), y: () => (dy * 18 - 6) * u(), scale: 1.6, opacity: 0.75, duration: 0.3, ease: "power2.out" },
      seat,
    );
    tl.to(d, { opacity: 0, scale: 2.2, y: () => (dy * 18 - 16) * u(), duration: 0.6, ease: "power1.in" }, seat + 0.3);
  });
  // the arch now carries the wall and the inscription stone
  tl.fromTo(up, { y: () => -50 * u(), opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power2.inOut" }, seat + 0.5);
  tl.fromTo(title, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, seat + 0.9);
  tl.fromTo(form, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, seat + 1.05);
  tl.to({}, { duration: 1.6 }); // the finished arch holds while the page moves on

  // The stage is sticky inside a section whose height CSS sets from the first paint
  // (html.rv-live, like the walk): no pin, no layout shift.
  const st = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      invalidateOnRefresh: true,
      onToggle: (self) => section.classList.toggle("is-active", self.isActive),
    },
  });
  st.add(tl);

  return () => {
    st.scrollTrigger?.kill();
    st.kill();
    section.classList.remove("is-live", "is-active");
    gsap.set([...stones, ...dust, up, title, form, ring], { clearProps: "all" });
  };
}
