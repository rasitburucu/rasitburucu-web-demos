"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { villas, typologies, availableCount, compass, getVilla, type Villa } from "@/content/onikitas/villas";
import { tr } from "@/content/onikitas/tr";
import { neighbour } from "@/lib/onikitas/geometry";
import { Photo } from "../Photo";
import { usePlanFilters, useSmoothScroll } from "../shell/Shell";
import { PlanSvg } from "./PlanSvg";
import { PreviewPanel } from "./PreviewPanel";
import { StatusMark } from "./StatusMark";
import { useMediaQuery } from "./useMediaQuery";

const fmt = (n: number) => n.toLocaleString("tr-TR");

function matches(v: Villa, f: ReturnType<typeof usePlanFilters>["filters"]) {
  const t = typologies[v.type];
  if (f.bedrooms.length && !f.bedrooms.includes(t.bedrooms)) return false;
  if (f.view.length && !f.view.includes(v.view)) return false;
  if (f.onlyAvailable && v.status !== "available") return false;
  return true;
}

export function StonePlan() {
  const p = tr.plan;
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const { filters, setFilters } = usePlanFilters();
  const { scrollTo } = useSmoothScroll();

  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string>("01");
  const [hour, setHour] = useState(16.5);

  const dimmed = useMemo(() => new Set(villas.filter((v) => !matches(v, filters)).map((v) => v.id)), [filters]);
  const matching = villas.filter((v) => matches(v, filters));
  const filtersActive = filters.bedrooms.length > 0 || filters.view.length > 0 || filters.onlyAvailable;

  // ----- intro: stones drop once when the plan first enters the viewport -----
  const planWrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(planWrapRef, { once: true, amount: 0.35 });
  const [intro, setIntro] = useState<"hidden" | "drop" | "static">("static");
  const counterRef = useRef<HTMLSpanElement>(null);
  const introStarted = useRef(false);

  useEffect(() => {
    // Hide stones only after hydration, and only when motion is allowed, so
    // the static HTML and reduced-motion users always see the full plan.
    if (reduce || introStarted.current) return;
    const rect = planWrapRef.current?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight * 0.65) return; // already on screen: skip intro
    setIntro("hidden");
  }, [reduce]);

  const counterAnim = useRef<ReturnType<typeof animate> | null>(null);
  useEffect(() => {
    if (!inView || intro !== "hidden" || introStarted.current) return;
    introStarted.current = true;
    setIntro("drop");
    const node = counterRef.current;
    counterAnim.current = animate(0, villas.length, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (node) node.textContent = String(Math.round(v));
      },
    });
  }, [inView, intro]);
  useEffect(() => () => counterAnim.current?.stop(), []);

  // On small screens the plan is wider than the viewport: start centred.
  useEffect(() => {
    const el = planWrapRef.current;
    if (!el || isDesktop) return;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, [isDesktop]);

  // ----- URL sync (?v=07) -----
  const writeUrl = useCallback((id: string | null) => {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("v", id);
    else url.searchParams.delete("v");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, []);

  const select = useCallback(
    (id: string | null) => {
      setSelected(id);
      if (id) setFocusId(id);
      writeUrl(id);
    },
    [writeUrl],
  );

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("v");
    if (id && getVilla(id)) {
      setSelected(id);
      setFocusId(id);
      setIntro("static");
      introStarted.current = true;
      const t = window.setTimeout(() => scrollTo("#plan"), 150);
      return () => window.clearTimeout(t);
    }
  }, [scrollTo]);

  // ----- keyboard -----
  const svgRef = useRef<SVGSVGElement>(null);
  const focusVilla = (id: string) => {
    setFocusId(id);
    requestAnimationFrame(() => {
      svgRef.current?.querySelector<SVGGElement>(`[data-villa="${id}"]`)?.focus();
    });
  };

  const onKeyNav = (e: React.KeyboardEvent, id: string) => {
    const map: Record<string, "up" | "down" | "left" | "right"> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };
    if (map[e.key]) {
      e.preventDefault();
      focusVilla(neighbour(id, map[e.key]));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(id);
    } else if (e.key === "Escape" && selected) {
      e.preventDefault();
      select(null);
    }
  };

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("[data-booking-open='true']")) {
        const id = selected;
        select(null);
        focusVilla(id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, select]);

  // ----- cursor card (motion values, no re-render per move) -----
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 500, damping: 40 });
  const sy = useSpring(my, { stiffness: 500, damping: 40 });
  const onPointerMove = (e: React.PointerEvent) => {
    const r = planWrapRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left + 18);
    my.set(e.clientY - r.top + 18);
  };
  const hoverVilla = hovered ? getVilla(hovered) : null;

  // ----- filters -----
  const toggleBed = (n: number) =>
    setFilters((f) => ({ ...f, bedrooms: f.bedrooms.includes(n) ? f.bedrooms.filter((b) => b !== n) : [...f.bedrooms, n] }));
  const toggleView = (k: "sea" | "grove") =>
    setFilters((f) => ({ ...f, view: f.view.includes(k) ? f.view.filter((b) => b !== k) : [...f.view, k] }));

  const selectedVilla = selected ? getVilla(selected) ?? null : null;

  return (
    <section id="plan" aria-labelledby="onk-plan-h" className="relative bg-lime-deep">
      <div className="mx-auto max-w-[1600px] px-4 pb-20 pt-20 sm:px-8 lg:px-12 lg:pb-28 lg:pt-28">
        <h2 id="onk-plan-h" className="text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.95]">
          {p.heading}
        </h2>
        <p className="measure mt-4 text-[1.1rem] text-olive-soft">{p.intro}</p>

        {/* filter bar */}
        <div className="mt-10 flex flex-col gap-5 border-y border-olive/20 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3" role="group" aria-label={p.filters}>
            <div className="flex items-center gap-2" role="group" aria-label={p.bedrooms}>
              <span className="mr-1 text-sm text-olive-soft">{p.bedrooms}</span>
              {[3, 4, 5].map((n) => (
                <button key={n} type="button" className="chip label-mono !text-[0.85rem]" aria-pressed={filters.bedrooms.includes(n)} onClick={() => toggleBed(n)}>
                  {n}+1
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2" role="group" aria-label={p.viewLabel}>
              <span className="mr-1 text-sm text-olive-soft">{p.viewLabel}</span>
              {(["sea", "grove"] as const).map((k) => (
                <button key={k} type="button" className="chip" aria-pressed={filters.view.includes(k)} onClick={() => toggleView(k)}>
                  {tr.view[k]}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="chip"
              aria-pressed={filters.onlyAvailable}
              onClick={() => setFilters((f) => ({ ...f, onlyAvailable: !f.onlyAvailable }))}
            >
              <span aria-hidden className="inline-block h-2.5 w-2.5 bg-tile" />
              {p.onlyAvailable}
            </button>
            {filtersActive ? (
              <button type="button" className="text-sm underline underline-offset-4 hover:text-tile-ink" onClick={() => setFilters({ bedrooms: [], view: [], onlyAvailable: false })}>
                {p.clear}
              </button>
            ) : null}
          </div>
          <p className="shrink-0" aria-live="polite">
            <span className="font-display text-[1.6rem] leading-none">
              <span ref={counterRef}>{villas.length}</span>
              {p.counterRest(availableCount)}
            </span>
            {filtersActive ? (
              <span className="mt-1 block text-sm text-olive-soft">{p.filtered(matching.length, matching.filter((v) => v.status === "available").length)}</span>
            ) : null}
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[62fr_38fr] lg:gap-10">
          {/* plan */}
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div
              ref={planWrapRef}
              className="relative overflow-x-auto overscroll-x-contain shadow-[0_1px_0_#3b3a2e26,0_24px_48px_-32px_#3b3a2e59] lg:overflow-hidden"
              onPointerMove={canHover ? onPointerMove : undefined}
            >
              <PlanSvg
                ref={svgRef}
                mode="interactive"
                hour={hour}
                selected={selected}
                hovered={hovered}
                focusId={focusId}
                dimmed={dimmed}
                introState={intro}
                onHover={setHovered}
                onSelect={(id) => select(id)}
                onKeyNav={onKeyNav}
                onFocusVilla={setFocusId}
                className="block h-auto w-full min-w-[680px] touch-manipulation lg:min-w-0"
              />
              <AnimatePresence>
                {canHover && hoverVilla && hovered !== selected ? (
                  <motion.div
                    key="card"
                    aria-hidden
                    className="pointer-events-none absolute left-0 top-0 z-10 flex w-[250px] gap-3 bg-lime p-2.5 shadow-[0_10px_30px_-10px_#3b3a2e66]"
                    style={{ x: sx, y: sy }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Photo k={hoverVilla.images[0]} sizes="64px" decorative className="h-16 w-16 shrink-0 object-cover" />
                    <div className="min-w-0 text-[0.8rem] leading-snug">
                      <p className="font-display text-[1.05rem] leading-tight">
                        N°{hoverVilla.id} {hoverVilla.name}
                      </p>
                      <p className="text-olive-soft">
                        {typologies[hoverVilla.type].layout} · {hoverVilla.interior} m² + {fmt(hoverVilla.plot)} m² arsa
                      </p>
                      <p className="text-olive-soft">
                        {tr.view[hoverVilla.view]} {hoverVilla.bearing}° · {tr.status[hoverVilla.status]}
                      </p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <Legend />
            <p className="mt-2 text-[0.8rem] text-olive-soft">{p.keyboardHint}</p>
          </div>

          {/* index / preview */}
          <div className="relative min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              {selectedVilla && isDesktop ? (
                <motion.div
                  key={`preview-${selectedVilla.id}`}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <PreviewPanel villa={selectedVilla} hour={hour} setHour={setHour} onBack={() => select(null)} variant="panel" />
                </motion.div>
              ) : (
                <motion.div
                  key="index"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <IndexTable
                    hovered={hovered}
                    selected={selected}
                    dimmed={dimmed}
                    onHover={setHovered}
                    onSelect={(id) => select(id)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* mobile bottom sheet */}
      <AnimatePresence>
        {selectedVilla && !isDesktop ? (
          <MobileSheet key="sheet" onClose={() => select(null)}>
            <PreviewPanel villa={selectedVilla} hour={hour} setHour={setHour} onBack={() => select(null)} variant="sheet" />
          </MobileSheet>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function Legend() {
  const p = tr.plan;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 border border-olive/30 bg-lime px-3 py-2 text-[0.82rem]">
      <span className="label-mono text-olive-soft">{p.legend}</span>
      <span className="flex items-center gap-2">
        <svg width="22" height="14" aria-hidden>
          <rect x="1" y="1" width="20" height="12" fill="#b5532c" stroke="#3b3a2e" strokeWidth="1" />
        </svg>
        {tr.status.available}
      </span>
      <span className="flex items-center gap-2">
        <svg width="22" height="14" aria-hidden>
          <rect x="1.5" y="1.5" width="19" height="11" fill="#f6f2ea" stroke="#3b3a2e" strokeWidth="1.8" strokeDasharray="0.1 3.4" strokeLinecap="round" />
        </svg>
        {tr.status.reserved}
      </span>
      <span className="flex items-center gap-2">
        <svg width="22" height="14" aria-hidden>
          <defs>
            <pattern id="lg-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="4" stroke="#3b3a2e" strokeWidth="1.2" />
            </pattern>
          </defs>
          <rect x="1" y="1" width="20" height="12" fill="url(#lg-hatch)" stroke="#3b3a2e" strokeWidth="1" />
        </svg>
        {tr.status.sold}
      </span>
      <span className="flex items-center gap-2">
        <svg width="22" height="14" aria-hidden>
          <rect x="7" y="1" width="8" height="12" fill="#1e3442" fillOpacity="0.2" stroke="#1e3442" strokeOpacity="0.5" />
        </svg>
        Havuz
      </span>
    </div>
  );
}

function IndexTable({
  hovered,
  selected,
  dimmed,
  onHover,
  onSelect,
}: {
  hovered: string | null;
  selected: string | null;
  dimmed: Set<string>;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const t = tr.plan.table;
  return (
    <table className="w-full border-collapse text-left text-[0.92rem]">
      <caption className="sr-only">{t.caption}</caption>
      <thead>
        <tr className="border-b border-olive/40 text-[0.78rem] text-olive-soft">
          <th scope="col" className="py-2 pr-2 font-normal">{t.no}</th>
          <th scope="col" className="py-2 pr-2 font-normal">{t.name}</th>
          <th scope="col" className="hidden py-2 pr-2 font-normal sm:table-cell lg:hidden 2xl:table-cell">{t.type}</th>
          <th scope="col" className="py-2 pr-2 font-normal">{t.rooms}</th>
          <th scope="col" className="whitespace-nowrap py-2 pr-2 text-right font-normal">{t.interior}</th>
          <th scope="col" className="hidden py-2 pr-2 text-right font-normal md:table-cell lg:hidden 2xl:table-cell">{t.plot}</th>
          <th scope="col" className="hidden py-2 pr-2 font-normal md:table-cell">{t.view}</th>
          <th scope="col" className="py-2 font-normal">{t.status}</th>
        </tr>
      </thead>
      <tbody>
        {villas.map((v) => {
          const ty = typologies[v.type];
          const active = hovered === v.id || selected === v.id;
          return (
            <tr
              key={v.id}
              className={`border-b border-olive/12 transition-[opacity,background-color] duration-300 ${active ? "bg-lime" : ""} ${dimmed.has(v.id) ? "opacity-30" : ""}`}
              onMouseEnter={() => onHover(v.id)}
              onMouseLeave={() => onHover(null)}
            >
              <td className="label-mono py-3 pr-2 !text-[0.85rem]">{v.id}</td>
              <th scope="row" className="py-3 pr-2 font-normal">
                <button
                  type="button"
                  className="font-display text-[1.15rem] leading-none hover:text-tile-ink focus-visible:text-tile-ink"
                  onClick={() => onSelect(v.id)}
                  onFocus={() => onHover(v.id)}
                  onBlur={() => onHover(null)}
                >
                  {v.name}
                  <span className="sr-only">, {tr.status[v.status]}</span>
                </button>
              </th>
              <td className="hidden py-3 pr-2 sm:table-cell lg:hidden 2xl:table-cell">{ty.name}</td>
              <td className="label-mono py-3 pr-2 !text-[0.85rem]">{ty.layout}</td>
              <td className="label-mono whitespace-nowrap py-3 pr-2 text-right !text-[0.85rem]">{v.interior} m²</td>
              <td className="label-mono hidden whitespace-nowrap py-3 pr-2 text-right !text-[0.85rem] md:table-cell lg:hidden 2xl:table-cell">{fmt(v.plot)} m²</td>
              <td className="hidden whitespace-nowrap py-3 pr-2 md:table-cell">
                {tr.view[v.view]} <span className="label-mono text-olive-soft">{v.bearing}° {compass(v.bearing)}</span>
              </td>
              <td className="py-3">
                <StatusMark status={v.status} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function MobileSheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const reduce = useReducedMotion();
  const controls = useDragControls();
  return (
    <motion.div
      role="dialog"
      aria-modal="false"
      aria-label={tr.plan.heading}
      className="fixed inset-x-0 bottom-0 z-50 flex flex-col bg-lime shadow-[0_-18px_40px_-20px_#3b3a2e80]"
      style={{ maxHeight: expanded ? "92dvh" : "58dvh" }}
      initial={reduce ? { opacity: 0 } : { y: "100%" }}
      animate={reduce ? { opacity: 1 } : { y: 0 }}
      exit={reduce ? { opacity: 0 } : { y: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 36 }}
      drag={reduce ? false : "y"}
      dragListener={false}
      dragControls={controls}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.15, bottom: 0.6 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 90 || info.velocity.y > 600) {
          if (expanded) setExpanded(false);
          else onClose();
        } else if (info.offset.y < -60 || info.velocity.y < -500) setExpanded(true);
      }}
    >
      <button
        type="button"
        className="mx-auto flex h-9 w-full shrink-0 touch-none items-center justify-center"
        onPointerDown={(e) => controls.start(e)}
        aria-label={tr.plan.preview.expand}
        aria-expanded={expanded}
        onClick={() => setExpanded((e) => !e)}
      >
        <span aria-hidden className="block h-1 w-10 bg-olive/40" />
      </button>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6" data-lenis-prevent>
        {children}
      </div>
    </motion.div>
  );
}
