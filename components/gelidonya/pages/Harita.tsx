"use client";

// Visit map drawn from real OpenStreetMap geometry (content/gelidonya/map-geo.json,
// built by scripts/fetch-gelidonya-map.mjs; the method of the Sazbahçe map).
// Everything is local SVG: the parent site's CSP allows no outside tiles,
// frames or scripts. Two scales: the region (Antalya to Demre along the D400)
// and close (the Kumluca plain). Labels and strokes keep their on-screen size.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import geo from "@/content/gelidonya/map-geo.json";
import { tr } from "@/content/gelidonya/tr";

const m = tr.map;

type ViewKey = "region" | "close";
type Box = { x: number; y: number; w: number; h: number };
type Mode = "wide" | "narrow";

const KX = (Math.cos((geo.origin.lat * Math.PI) / 180) * 111320) / geo.unitMetres;
const KY = 110574 / geo.unitMetres;
/** lat/lon -> map units (10 m, origin 36.40 N 30.30 E, y down). */
const at = (lat: number, lon: number): [number, number] => [(lon - geo.origin.lon) * KX, (geo.origin.lat - lat) * KY];

/** A view: centre, width in km, aspect (w/h). */
function box(lat: number, lon: number, km: number, aspect: number): Box {
  const [cx, cy] = at(lat, lon);
  const w = (km * 1000) / geo.unitMetres;
  const h = w / aspect;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}
const VIEWS: Record<ViewKey, Record<Mode, Box>> = {
  region: { wide: box(36.555, 30.3, 126, 16 / 10), narrow: box(36.56, 30.34, 84, 4 / 5) },
  close: { wide: box(36.3455, 30.292, 10, 16 / 10), narrow: box(36.346, 30.293, 6.2, 4 / 5) },
};

type Kind = "city" | "town" | "village" | "sea" | "cape" | "road" | "edge";
type Label = {
  t: string;
  lat: number;
  lon: number;
  k: Kind;
  dx?: number;
  dy?: number;
  a?: "start" | "middle" | "end";
  dot?: boolean;
  rot?: number;
  only?: Mode;
};

const P = (name: string) => {
  const p = (geo.places as Record<string, number[]>)[name];
  return { lat: geo.origin.lat - p[1] / KY, lon: geo.origin.lon + p[0] / KX };
};

// Label sets per view. Places as in OSM; no businesses.
const LABELS: Record<ViewKey, Label[]> = {
  region: [
    { t: "Antalya", ...P("Antalya"), k: "city", dot: true, dx: -10, dy: 18, a: "end" },
    { t: "Kemer", ...P("Kemer"), k: "town", dot: true, dx: -10, dy: 5, a: "end" },
    { t: "Kumluca", ...P("Kumluca"), k: "town", dot: true, dx: -10, dy: -8, a: "end" },
    { t: "Finike", ...P("Finike"), k: "town", dot: true, dx: -8, dy: -10, a: "end" },
    { t: "Demre", ...P("Demre"), k: "town", dot: true, dx: 0, dy: -12, a: "middle" },
    { t: "Elmalı", ...P("Elmalı"), k: "town", dot: true, dx: 10, dy: 5 },
    { t: m.sea, lat: 36.4, lon: 30.62, k: "sea", a: "middle" },
    { t: m.cape, lat: 36.218, lon: 30.41, k: "cape", dx: 12, dy: 0 },
  ],
  close: [
    { t: "Kumluca", lat: 36.3702, lon: 30.2876, k: "town", a: "middle", dy: -4 },
    { t: "Kum", ...P("Kum"), k: "village", a: "middle" },
    { t: "Göksu", ...P("Göksu"), k: "village", a: "middle", only: "wide" },
    { t: "Hızırkahya", ...P("Hızırkahya"), k: "village", a: "middle", only: "wide" },
    { t: "Kavakköy", ...P("Kavakköy"), k: "village", a: "middle", only: "wide" },
    { t: "Beykonak", ...P("Beykonak"), k: "village", a: "middle", only: "wide" },
    { t: "Hacıveliler", ...P("Hacıveliler"), k: "village", a: "end", dx: -10, only: "wide" },
    { t: "Camikırığı Cd.", lat: 36.3415, lon: 30.2963, k: "road", rot: 76, dx: -9 },
    { t: m.sea, lat: 36.3185, lon: 30.315, k: "sea", a: "middle", only: "narrow" },
  ],
};

const SHIELDS: Record<ViewKey, { t: string; lat: number; lon: number; only?: Mode }[]> = {
  region: [
    { t: "D400", lat: 36.47, lon: 30.475 },
    { t: "D400", lat: 36.27, lon: 30.06, only: "wide" },
  ],
  close: [{ t: "D400", lat: 36.335, lon: 30.2775 }],
};

// where the pin's note card sits, relative to the pin (screen px)
const CARD: Record<ViewKey, Record<Mode, { dx: number; dy: number; side: "left" | "right" }>> = {
  region: { wide: { dx: 18, dy: 30, side: "right" }, narrow: { dx: 16, dy: 34, side: "right" } },
  close: { wide: { dx: 18, dy: 26, side: "right" }, narrow: { dx: -16, dy: 30, side: "left" } },
};

const SIZE: Record<Kind, number> = { city: 15.5, town: 14, village: 13, sea: 13, cape: 12.5, road: 12, edge: 13 };
const WEIGHT: Record<Kind, number> = { city: 700, town: 700, village: 500, sea: 600, cape: 600, road: 500, edge: 600 };

const C = {
  land: "#f4f5f1",
  sea: "#cfdcdb",
  shore: "#6f8a88",
  river: "#a3c0c2",
  ink: "#111311",
  ink2: "#454a44",
  waterInk: "#36524f",
  trunk: "#7b8178",
  primary: "#aeb3ab",
  tertiary: "#b9bdb5",
  minor: "#d0d3cc",
  greenhouse: "#e3e6e0",
  greenhouseLine: "#a9aea6",
  orchard: "#e2e8d6",
  town: "#e6e3dc",
  accent: "#3f8f1f",
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Harita() {
  const [view, setView] = useState<ViewKey>("close");
  const [mode, setMode] = useState<Mode>("wide");
  const target = VIEWS[view][mode];
  const [vb, setVb] = useState<Box>(target);
  const vbRef = useRef(vb);
  vbRef.current = vb;
  const svgRef = useRef<SVGSVGElement>(null);
  const lastView = useRef<ViewKey>(view);
  const [px, setPx] = useState(800);

  useIso(() => {
    const mq = window.matchMedia("(max-width: 599px)");
    const on = () => setMode(mq.matches ? "narrow" : "wide");
    on();
    mq.addEventListener("change", on);
    const el = svgRef.current;
    const ro = new ResizeObserver(() => el && setPx(el.clientWidth || 800));
    if (el) ro.observe(el);
    return () => {
      mq.removeEventListener("change", on);
      ro.disconnect();
    };
  }, []);

  // move between scales: 600 ms, zoom in log space; instant with reduced motion
  useEffect(() => {
    const from = vbRef.current;
    const to = target;
    if (from.x === to.x && from.y === to.y && from.w === to.w && from.h === to.h) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scaleChanged = lastView.current !== view;
    lastView.current = view;
    if (reduce || !scaleChanged) {
      setVb(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / 600);
      const e = ease(t);
      const w = Math.exp(Math.log(from.w) + (Math.log(to.w) - Math.log(from.w)) * e);
      const h = Math.exp(Math.log(from.h) + (Math.log(to.h) - Math.log(from.h)) * e);
      const cx = from.x + from.w / 2 + (to.x + to.w / 2 - from.x - from.w / 2) * e;
      const cy = from.y + from.h / 2 + (to.y + to.h / 2 - from.y - from.h / 2) * e;
      setVb({ x: cx - w / 2, y: cy - h / 2, w, h });
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, view]);

  const u = vb.w / px; // map units per screen px
  // minor roads and land use fade in as we zoom in
  const near = Math.max(0, Math.min(1, (3200 - vb.w) / 1600));
  const [vx, vy] = [geo.venue.x, geo.venue.y];
  const card = CARD[view][mode];
  const visible = <T extends { only?: Mode }>(l: T) => !l.only || l.only === mode;

  const steps = [500, 1000, 2000, 5000, 10000, 20000];
  const metres = steps.reduce((best, s) => (Math.abs(s - vb.w * 2) < Math.abs(best - vb.w * 2) ? s : best), steps[0]);
  const bar = metres / geo.unitMetres;
  const barLabel = metres >= 1000 ? `${metres / 1000} km` : `${metres} m`;

  const halo = { paintOrder: "stroke" as const, stroke: C.land, strokeWidth: 3.4 * u, strokeLinejoin: "round" as const };
  const seaHalo = { ...halo, stroke: C.sea };

  const cardW = 214 * u;
  const cardH = 48 * u;
  const cardX = Math.min(Math.max(card.side === "left" ? vx + card.dx * u - cardW : vx + card.dx * u, vb.x + 8 * u), vb.x + vb.w - 8 * u - cardW);
  const cardY = Math.min(Math.max(vy + card.dy * u, vb.y + 8 * u), vb.y + vb.h - 30 * u - cardH);

  const { lat, lon } = geo.venue;
  const google = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  const apple = `https://maps.apple.com/?ll=${lat},${lon}&q=${encodeURIComponent(m.links.pinName)}`;
  const osm = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`;

  return (
    <div className="gd-map">
      <div className="gd-map-bar" role="group" aria-label={m.scaleLabel}>
        {(["close", "region"] as ViewKey[]).map((k) => (
          <button key={k} type="button" className="gd-btn gd-btn--line gd-btn--sm" aria-pressed={view === k} onClick={() => setView(k)}>
            {m.views[k]}
          </button>
        ))}
      </div>
      <div className="gd-map-frame">
        <svg
          ref={svgRef}
          viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label={view === "region" ? m.regionLabel : m.closeLabel}
          className="gd-map-svg"
        >
          <rect x={vb.x} y={vb.y} width={vb.w} height={vb.h} fill={C.land} />
          <g opacity={near}>
            <path d={geo.land.town} fill={C.town} />
            <path d={geo.land.orchard} fill={C.orchard} />
            <path d={geo.land.greenhouse} fill={C.greenhouse} stroke={C.greenhouseLine} strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
          </g>
          <path d={geo.sea} fill={C.sea} stroke={C.shore} strokeWidth={0.9} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          <path d={geo.islands} fill={C.land} stroke={C.shore} strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
          <path d={geo.rivers} fill="none" stroke={C.river} strokeWidth={1.1} vectorEffect="non-scaling-stroke" strokeLinejoin="round" opacity={1 - near * 0.6} />
          <path d={geo.streams} fill="none" stroke={C.river} strokeWidth={1.3} vectorEffect="non-scaling-stroke" strokeLinejoin="round" opacity={near} />

          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={geo.roads.minor} stroke={C.minor} strokeWidth={1.2} vectorEffect="non-scaling-stroke" opacity={near} />
            <path d={geo.roads.tertiary + geo.roads.secondary} stroke={C.tertiary} strokeWidth={2} vectorEffect="non-scaling-stroke" opacity={near} />
            <path d={geo.roads.primary} stroke={C.primary} strokeWidth={1.2} vectorEffect="non-scaling-stroke" opacity={1 - near * 0.3} />
            <path d={geo.roads.trunk} stroke={C.land} strokeWidth={3.6} vectorEffect="non-scaling-stroke" />
            <path d={geo.roads.trunk} stroke={C.trunk} strokeWidth={1.8} vectorEffect="non-scaling-stroke" />
            <path d={geo.roads.d400} stroke={C.land} strokeWidth={5.6} vectorEffect="non-scaling-stroke" />
            <path d={geo.roads.d400} stroke={C.ink} strokeWidth={3} vectorEffect="non-scaling-stroke" />
          </g>

          {SHIELDS[view].filter(visible).map((s) => {
            const [x, y] = at(s.lat, s.lon);
            const w = (s.t.length * 7.8 + 12) * u;
            const h = 19 * u;
            return (
              <g key={s.t + s.lat}>
                <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={2 * u} fill={C.ink} />
                <text x={x} y={y + 4.4 * u} textAnchor="middle" fontSize={12.5 * u} fontWeight={700} fill="#fff">
                  {s.t}
                </text>
              </g>
            );
          })}

          {LABELS[view].filter(visible).map((l) => {
            const [x, y] = at(l.lat, l.lon);
            const tx = x + (l.dx ?? 0) * u;
            const ty = y + (l.dy ?? 0) * u;
            const sea = l.k === "sea";
            const fs = SIZE[l.k] * u;
            return (
              <g key={l.t + l.lat}>
                {l.dot && <circle cx={x} cy={y} r={(l.k === "city" ? 5.5 : 4) * u} fill={C.ink} stroke={C.land} strokeWidth={1.4 * u} />}
                <text
                  x={tx}
                  y={ty}
                  textAnchor={l.a ?? "start"}
                  fontSize={fs}
                  fontWeight={WEIGHT[l.k]}
                  fontStyle={l.k === "cape" ? "italic" : undefined}
                  letterSpacing={sea ? `${0.16 * fs}` : undefined}
                  fill={sea || l.k === "cape" ? C.waterInk : l.k === "road" || l.k === "village" ? C.ink2 : C.ink}
                  transform={l.rot ? `rotate(${l.rot} ${tx} ${ty})` : undefined}
                  {...(sea ? seaHalo : halo)}
                >
                  {sea ? l.t.toLocaleUpperCase("tr") : l.t}
                </text>
              </g>
            );
          })}

          {/* the nursery: pin, leader, note card */}
          <g>
            <line
              x1={vx}
              y1={vy}
              x2={Math.min(Math.max(vx, cardX), cardX + cardW)}
              y2={Math.min(Math.max(vy, cardY), cardY + cardH)}
              stroke={C.ink}
              strokeWidth={1.3}
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={vx} cy={vy} r={14 * u} fill={C.accent} opacity={0.25} />
            <circle cx={vx} cy={vy} r={7 * u} fill={C.accent} stroke={C.ink} strokeWidth={2 * u} />
            <rect x={cardX} y={cardY} width={cardW} height={cardH} fill="#fff" stroke={C.ink} strokeWidth={1.5 * u} />
            <text x={cardX + 10 * u} y={cardY + 20 * u} fontSize={15 * u} fontWeight={700} fill={C.ink}>
              {m.venue}
            </text>
            <text x={cardX + 10 * u} y={cardY + 38 * u} fontSize={12.5 * u} fill={C.ink2}>
              {m.venueNote}
            </text>
          </g>

          {/* north mark and scale bar */}
          <g transform={`translate(${vb.x + 22 * u} ${vb.y + 30 * u})`}>
            <path d={`M0 ${-12 * u}L${6 * u} ${5 * u}L0 ${1 * u}L${-6 * u} ${5 * u}Z`} fill={C.ink} />
            <text y={21 * u} textAnchor="middle" fontSize={12 * u} fontWeight={700} fill={C.ink} {...halo}>
              {m.north}
            </text>
          </g>
          <g transform={`translate(${vb.x + 44 * u} ${vb.y + 34 * u})`}>
            <path d={`M0 ${-6 * u}V0H${bar}V${-6 * u}`} fill="none" stroke={C.ink} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            <text x={bar + 6 * u} y={1 * u} fontSize={12 * u} fill={C.ink} {...halo}>
              {barLabel}
            </text>
          </g>
        </svg>
        <p className="gd-map-attr">
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
            {m.attribution}
          </a>{" "}
          ({m.licence})
        </p>
      </div>
      <ul className="gd-map-links">
        <li>
          <a href={google} target="_blank" rel="noopener noreferrer" className="gd-link">
            {m.links.google}
            <span className="gd-sr"> {tr.iletisim.newTab}</span>
          </a>
        </li>
        <li>
          <a href={apple} target="_blank" rel="noopener noreferrer" className="gd-link">
            {m.links.apple}
            <span className="gd-sr"> {tr.iletisim.newTab}</span>
          </a>
        </li>
        <li>
          <a href={osm} target="_blank" rel="noopener noreferrer" className="gd-link">
            {m.links.osm}
            <span className="gd-sr"> {tr.iletisim.newTab}</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
