"use client";

/**
 * <Sini>: the engraved copper tray that carries the whole concept.
 *
 * One component, three uses:
 * - variant "hero":  the empty sini on the first screen. The engraved words in
 *   the rim band turn once every 120 s; a warm glint follows the pointer.
 * - variant "serve": the home service scene passes the plates as children.
 * - variant "table": the reservation summary. Covers (kuver) open round the rim
 *   for the party size, a green mark drops on any guest with an allergy note,
 *   the centre shows one dot per course, and "counter" turns the round sini
 *   into the long counter tray. Covers glide to their new places (FLIP, Web
 *   Animations API; no animation library).
 *
 * The copper itself is a Blender render (public/kalemkar/img/sini-*, tepsi-*):
 * the light is baked in, so the copper never rotates; only the words do.
 *
 * The home page draws two of these (hero and service) but shows one: on wide
 * screens with scroll-driven animation the service sini starts where the hero
 * one sits and travels down into the service scene (see Servis.tsx), so both
 * carry the same turning ring and stay in step until the swap.
 *
 * Reduced motion: words do not turn and appear at once; the glint stays put;
 * covers change place with a 120 ms fade instead of gliding.
 * Accessibility: the whole object is aria-hidden. Every page that uses it
 * gives the same information as text (service list, booking summary).
 */

import { useEffect, useId, useLayoutEffect, useRef } from "react";
import { asset } from "@/lib/asset";
import { img } from "@/content/kalemkar/images";
import { RIM_WORDS } from "@/content/kalemkar/menu";

type Shape = "round" | "counter";

type Props = {
  variant: "hero" | "serve" | "table";
  sizes: string;
  priority?: boolean;
  shape?: Shape;
  seats?: number;
  marks?: boolean[];
  courses?: number;
  kitchenLabel?: string;
  /** Engraved words: "spin" turns them (and draws them in once); defaults to spin for the hero. */
  ring?: "spin" | "still";
  className?: string;
  children?: React.ReactNode;
};

const srcSet = (key: "sini" | "tepsi", ext: string) => {
  const m = img(key);
  return m.widths.map((w) => `${asset(`/kalemkar/img/${key}-${w}.${ext}`)} ${Math.min(w, m.w)}w`).join(", ");
};

function Copper({ k, sizes, priority, className }: { k: "sini" | "tepsi"; sizes: string; priority?: boolean; className: string }) {
  const m = img(k);
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet(k, "avif")} sizes={sizes} />
      <img
        src={asset(`/kalemkar/img/${k}-${m.widths[1]}.webp`)}
        srcSet={srcSet(k, "webp")}
        sizes={sizes}
        alt=""
        width={m.w}
        height={m.h}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        draggable={false}
      />
    </picture>
  );
}

/** Words engraved in the plain band of the rim (r ≈ 0.634 of the half-width). */
function Ring({ spin }: { spin: boolean }) {
  // One id per ring: the home page draws two sinis.
  const id = `kk-ring-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const text = RIM_WORDS.join("  ·  ") + "  ·  ";
  const d = "M 500 500 m -317 0 a 317 317 0 1 1 634 0 a 317 317 0 1 1 -634 0";
  return (
    <svg className="kk-ring" viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
      <defs>
        <path id={id} d={d} />
      </defs>
      <g className="kk-ring-turn" data-spin={spin || undefined}>
        <text className="kk-ring-hi" dy="1.6">
          <textPath href={`#${id}`} textLength="1985" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
        <text className="kk-ring-cut">
          <textPath href={`#${id}`} textLength="1985" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </g>
    </svg>
  );
}

/** One place setting, drawn as if seen from above; "up" faces the centre. */
function Kuver({ marked }: { marked: boolean }) {
  return (
    <svg viewBox="-50 -60 100 120" aria-hidden="true" focusable="false">
      <rect className="kk-kv-napkin" x="-40" y="-14" width="80" height="62" rx="5" transform="rotate(-6)" />
      <circle className="kk-kv-plate" r="27" />
      <circle className="kk-kv-rim" r="20.5" />
      <path className="kk-kv-tool" d="M-38 -24 V30 M-42 -24 V-10 M-34 -24 V-10 M-42 -10 Q-38 -4 -34 -10" />
      <path className="kk-kv-tool" d="M38 -24 Q44 -8 38 6 V30" />
      {marked && <circle className="kk-kv-mark" cx="0" cy="-46" r="9" />}
    </svg>
  );
}

type Pos = { x: number; y: number; r: number; s: number };

/** Cover positions as fractions of the (square) sini box. */
export function seatLayout(shape: Shape, n: number): Pos[] {
  if (n <= 0) return [];
  if (shape === "counter") {
    const span = Math.min(0.66, 0.15 * n);
    return Array.from({ length: n }, (_, i) => ({
      x: 0.5 - span / 2 + (n === 1 ? span / 2 : (span * i) / (n - 1)),
      y: 0.566,
      r: 0,
      s: 0.098,
    }));
  }
  // Inside the copper rim (rim at ~0.455 of the box): the whole cover, napkin
  // and mark included, stays on the tray.
  // Up to four guests a cover is about a fifth of the tray across.
  const size = n <= 4 ? 0.2 : n <= 6 ? 0.172 : n <= 10 ? 0.13 : 0.104;
  const rad = n <= 4 ? 0.318 : n <= 6 ? 0.338 : n <= 10 ? 0.364 : 0.376;
  return Array.from({ length: n }, (_, i) => {
    const a = Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: 0.5 + rad * Math.cos(a), y: 0.5 + rad * Math.sin(a), r: (a * 180) / Math.PI - 90, s: size };
  });
}

function courseLayout(shape: Shape, n: number) {
  if (shape === "counter") {
    return Array.from({ length: n }, (_, i) => ({ x: 0.5 - 0.36 + (0.72 * i) / Math.max(1, n - 1), y: 0.397 }));
  }
  return Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: 0.5 + 0.105 * Math.cos(a), y: 0.5 + 0.105 * Math.sin(a) };
  });
}

const reduced = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Sini({ variant, sizes, priority, shape = "round", seats = 0, marks = [], courses = 0, kitchenLabel, ring, className, children }: Props) {
  const spin = variant !== "table" && (ring ? ring === "spin" : variant === "hero");
  const box = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLDivElement>(null);
  const last = useRef(new Map<string, Pos>());

  // Pointer glint: lerped toward the pointer, only while the sini is on screen.
  useEffect(() => {
    const el = box.current;
    const sh = sheen.current;
    if (!el || !sh) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || reduced()) return;
    let tx = 0.3, ty = 0.28, x = tx, y = ty, raf = 0, visible = false;
    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      sh.style.setProperty("--lx", `${(x * 100).toFixed(2)}%`);
      sh.style.setProperty("--ly", `${(y * 100).toFixed(2)}%`);
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      if (!visible) return;
      const r = el.getBoundingClientRect();
      tx = Math.min(1.1, Math.max(-0.1, (e.clientX - r.left) / r.width));
      ty = Math.min(1.1, Math.max(-0.1, (e.clientY - r.top) / r.height));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      el.toggleAttribute("data-visible", visible);
    });
    io.observe(el);
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Words turn only while visible (CSS animation paused otherwise).
  useEffect(() => {
    const el = box.current;
    if (!el || !spin) return;
    const io = new IntersectionObserver(([e]) => el.toggleAttribute("data-visible", e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [spin]);

  // FLIP for covers: glide from the last position to the new one.
  const layout = variant === "table" ? seatLayout(shape, seats) : [];
  const key = `${shape}:${seats}`;
  useLayoutEffect(() => {
    const el = box.current;
    if (!el || variant !== "table") return;
    const W = el.clientWidth;
    const prev = last.current;
    const next = new Map<string, Pos>();
    const calm = reduced();
    el.querySelectorAll<HTMLElement>("[data-seat]").forEach((node, i) => {
      const id = node.dataset.seat!;
      const p = layout[i];
      if (!p) return;
      next.set(id, p);
      const o = prev.get(id);
      const to = `translate(-50%, -50%) rotate(${p.r}deg)`;
      node.getAnimations().forEach((a) => a.cancel());
      if (calm) {
        if (!o || o.x !== p.x || o.y !== p.y) node.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120 });
        return;
      }
      if (!o) {
        node.animate(
          [
            { transform: `${to} scale(0.4)`, opacity: 0 },
            { transform: to, opacity: 1 },
          ],
          { duration: 460, delay: 40 + i * 35, easing: "cubic-bezier(0.16,1,0.3,1)", fill: "backwards" },
        );
        return;
      }
      if (o.x === p.x && o.y === p.y && o.r === p.r) return;
      const dx = (o.x - p.x) * W;
      const dy = (o.y - p.y) * W;
      // Take the short way round when the angle wraps.
      let fromR = o.r;
      while (fromR - p.r > 180) fromR -= 360;
      while (p.r - fromR > 180) fromR += 360;
      node.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) translate(-50%, -50%) rotate(${fromR}deg) scale(${o.s / p.s})` },
          { transform: to },
        ],
        { duration: 560, delay: i * 18, easing: "cubic-bezier(0.16,1,0.3,1)", fill: "backwards" },
      );
    });
    last.current = next;
    // layout is derived from key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, variant]);

  const cls = ["kk-sini", `kk-sini--${variant}`, className].filter(Boolean).join(" ");
  return (
    <div ref={box} className={cls} data-shape={shape} data-ring={spin ? "spin" : undefined} aria-hidden="true">
      <div className="kk-sini-shadow" />
      <Copper k="sini" sizes={sizes} priority={priority} className="kk-sini-copper kk-sini-round" />
      {variant === "table" && <Copper k="tepsi" sizes={sizes} className="kk-sini-copper kk-sini-long" />}
      {variant !== "table" ? <Ring spin={spin} /> : <div className="kk-sini-ringwrap"><Ring spin={false} /></div>}
      <div ref={sheen} className="kk-sini-sheen" />
      {variant === "table" && (
        <>
          {kitchenLabel && <span className="kk-sini-kitchen">{kitchenLabel}</span>}
          <div className="kk-sini-courses">
            {courseLayout(shape, courses).map((c, i) => (
              <i key={i} style={{ left: `${c.x * 100}%`, top: `${c.y * 100}%`, transitionDelay: `${i * 20}ms` }} />
            ))}
          </div>
          <div className="kk-sini-seats">
            {layout.map((p, i) => (
              <div
                key={i}
                data-seat={i}
                className="kk-kuver"
                style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, width: `${p.s * 100}%`, transform: `translate(-50%, -50%) rotate(${p.r}deg)` }}
              >
                <Kuver marked={!!marks[i]} />
              </div>
            ))}
          </div>
        </>
      )}
      {children}
    </div>
  );
}
