"use client";

// Visit map drawn from real OpenStreetMap geometry (content/sazbahce/map-geo.json,
// built by scripts/fetch-sazbahce-map.mjs). Everything is local SVG: the parent
// site's CSP allows no outside tiles, frames or scripts. Two scales: the region
// (Bursa, the sea, the lake) and close (D200, Gölyazı yolu, the venue).
// Labels and strokes keep their on-screen size at every scale.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import geo from "@/content/sazbahce/map-geo.json";
import { tr } from "@/content/sazbahce/tr";

const m = tr.visitPage.map;
const links = tr.visitPage.mapLinks;

type ViewKey = "region" | "close";
type Box = { x: number; y: number; w: number; h: number };

const KX = (Math.cos((geo.origin.lat * Math.PI) / 180) * 111320) / geo.unitMetres;
const KY = 110574 / geo.unitMetres;
/** lat/lon -> map units (10 m, origin 40.20 N 28.75 E, y down). */
const at = (lat: number, lon: number): [number, number] => [(lon - geo.origin.lon) * KX, (geo.origin.lat - lat) * KY];

/** A view: centre, width in km, aspect (w/h). */
function box(lat: number, lon: number, km: number, aspect: number): Box {
  const [cx, cy] = at(lat, lon);
  const w = (km * 1000) / geo.unitMetres;
  const h = w / aspect;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}
const VIEWS: Record<ViewKey, { wide: Box; narrow: Box }> = {
  region: { wide: box(40.25, 28.75, 70, 16 / 10), narrow: box(40.25, 28.8, 54, 1) },
  close: { wide: box(40.184, 28.695, 12, 16 / 10), narrow: box(40.183, 28.668, 9, 1) },
};

type Kind = "city" | "town" | "village" | "water" | "sea" | "edge" | "road";
type Label = {
  t: string;
  lat: number;
  lon: number;
  k: Kind;
  /** offset in screen px */
  dx?: number;
  dy?: number;
  a?: "start" | "middle" | "end";
  dot?: boolean;
  rot?: number;
  /** pin the label to the left/right edge of the view (lat gives the height) */
  edge?: "left" | "right";
};
type Mode = "wide" | "narrow";
type Placed = Label & { only?: Mode };

// Label sets per view. Places are as in OSM; no businesses.
const LABELS: Record<ViewKey, Placed[]> = {
  region: [
    { t: m.sea, lat: 40.41, lon: 28.6, k: "sea", a: "middle", only: "wide" },
    { t: m.sea, lat: 40.415, lon: 28.8, k: "sea", a: "middle", only: "narrow" },
    { t: m.lake, lat: 40.163, lon: 28.53, k: "water", a: "middle", only: "wide" },
    { t: m.lake, lat: 40.149, lon: 28.4855, k: "water", a: "start", only: "narrow" },
    { t: m.bursa, lat: 40.1826, lon: 29.0675, k: "city", dot: true, dx: 9, dy: 5, only: "wide" },
    { t: m.bursa, lat: 40.1826, lon: 29.0675, k: "city", dot: true, a: "middle", dy: 22, only: "narrow" },
    { t: m.mudanya, lat: 40.3753, lon: 28.8838, k: "town", dot: true, dx: -8, dy: 16, a: "end" },
    { t: m.karacabey, lat: 40.216, lon: 28.359, k: "town", dot: true, dx: 7, dy: -8, only: "wide" },
    { t: m.istanbul, lat: 40.385, lon: 0, k: "edge", edge: "right" },
  ],
  close: [
    { t: m.lake, lat: 40.163, lon: 28.645, k: "water", a: "middle", only: "wide" },
    { t: m.lake, lat: 40.155, lon: 28.645, k: "water", a: "middle", only: "narrow" },
    { t: m.golyazi, lat: 40.1654, lon: 28.6776, k: "village", dot: true, dx: 9, dy: 5 },
    { t: m.akcalar, lat: 40.1744, lon: 28.7478, k: "village", dot: true, dx: -8, dy: -8, a: "end", only: "wide" },
    { t: m.fadilli, lat: 40.1535, lon: 28.7086, k: "village", dot: true, dx: 8, dy: -6, only: "wide" },
    { t: m.golyaziYolu, lat: 40.1985, lon: 28.6843, k: "road", dx: 11, rot: 90 },
    { t: m.toBursa, lat: 40.2135, lon: 0, k: "edge", edge: "right", dy: 20, only: "wide" },
    { t: m.toKaracabey, lat: 40.2165, lon: 0, k: "edge", edge: "left", dy: 16, only: "wide" },
  ],
};

const SHIELDS: Record<ViewKey, { t: string; lat: number; lon: number; motorway?: boolean; only?: Mode }[]> = {
  region: [
    { t: m.o5, lat: 40.2735, lon: 28.6, motorway: true, only: "wide" },
    { t: m.o5, lat: 40.2605, lon: 28.86, motorway: true },
    { t: m.d200, lat: 40.2195, lon: 28.92 },
  ],
  close: [
    { t: m.d200, lat: 40.2135, lon: 28.725, only: "wide" },
    { t: m.d200, lat: 40.2128, lon: 28.7, only: "narrow" },
  ],
};

// where the pin's note card sits, relative to the pin (screen px), per view and width
const CARD: Record<ViewKey, Record<Mode, { dx: number; dy: number; side: "left" | "right" }>> = {
  region: { wide: { dx: 16, dy: 22, side: "right" }, narrow: { dx: 14, dy: 26, side: "right" } },
  close: { wide: { dx: -16, dy: -78, side: "left" }, narrow: { dx: -14, dy: -92, side: "left" } },
};

const SIZE: Record<Kind, number> = { city: 16, town: 13.5, village: 13.5, water: 12, sea: 12.5, edge: 13, road: 12.5 };
const WEIGHT: Record<Kind, number> = { city: 700, town: 500, village: 500, water: 600, sea: 600, edge: 600, road: 500 };

const C = {
  land: "#F3F5F1",
  water: "#B7D0CB",
  sea: "#B2CCC6",
  shore: "#6E8F87",
  river: "#9BBDB7",
  ink: "#1D3830",
  ink2: "#4F655C",
  waterInk: "#2E5148",
  motorway: "#6F8079",
  trunk: "#C9974A",
  primary: "#CCD5CE",
  minor: "#B9C4BC",
  accent: "#E8AF56",
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function VisitMap() {
  const [view, setView] = useState<ViewKey>("region");
  const [mode, setMode] = useState<Mode>("wide");
  const target = VIEWS[view][mode];
  const [vb, setVb] = useState<Box>(target);
  const vbRef = useRef(vb);
  vbRef.current = vb;
  const svgRef = useRef<SVGSVGElement>(null);
  const lastView = useRef<ViewKey>(view);
  const [px, setPx] = useState(700); // rendered width in CSS px

  // phones get a square frame; measure the drawn width so text stays a fixed size
  useIso(() => {
    const mq = window.matchMedia("(max-width: 599px)");
    const on = () => setMode(mq.matches ? "narrow" : "wide");
    on();
    mq.addEventListener("change", on);
    const el = svgRef.current;
    const ro = new ResizeObserver(() => el && setPx(el.clientWidth || 700));
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
    // a width change (phone <-> desktop frame) jumps; only a change of scale moves
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
  const fs = (k: Kind) => SIZE[k] * u;
  // minor roads and the Gölyazı road fade in as we zoom in
  const near = Math.max(0, Math.min(1, (2600 - vb.w) / 1200));
  const [vx, vy] = [geo.venue.x, geo.venue.y];
  const card = CARD[view][mode];
  const visible = <T extends { only?: Mode }>(l: T) => !l.only || l.only === mode;

  // scale bar: a round length near a fifth of the width
  const steps = [500, 1000, 2000, 5000, 10000];
  const metres = steps.reduce((best, s) => (Math.abs(s - vb.w * 2) < Math.abs(best - vb.w * 2) ? s : best), steps[0]);
  const bar = metres / geo.unitMetres;
  const barLabel = metres >= 1000 ? `${metres / 1000} km` : `${metres} m`;

  const halo = { paintOrder: "stroke" as const, stroke: C.land, strokeWidth: 3.2 * u, strokeLinejoin: "round" as const };
  const waterHalo = { ...halo, stroke: C.water };

  const lines = [m.venue, m.venueNote];
  const cardW = 204 * u;
  const cardH = 46 * u;
  // keep the card inside the frame whatever the width
  const cardX = Math.min(
    Math.max(card.side === "left" ? vx + card.dx * u - cardW : vx + card.dx * u, vb.x + 8 * u),
    vb.x + vb.w - 8 * u - cardW,
  );
  const cardY = vy + card.dy * u;

  const { lat, lon } = geo.venue;
  const google = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  const apple = `https://maps.apple.com/?ll=${lat},${lon}&q=${encodeURIComponent(links.pinName)}`;
  const osm = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=14/${lat}/${lon}`;

  return (
    <div className="sb-map">
      <div className="sb-map-bar" role="group" aria-label={m.scaleLabel}>
        {(["region", "close"] as ViewKey[]).map((k) => (
          <button key={k} type="button" className="sb-chip" aria-pressed={view === k} onClick={() => setView(k)}>
            {m.views[k]}
          </button>
        ))}
      </div>
      <div className="sb-map-frame">
        <svg
          ref={svgRef}
          viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label={view === "region" ? m.regionLabel : m.closeLabel}
          className="sb-region"
          data-view={view}
        >
          <rect x={vb.x} y={vb.y} width={vb.w} height={vb.h} fill={C.land} />
          <path d={geo.sea} fill={C.sea} stroke={C.shore} strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
          <path d={geo.rivers} fill="none" stroke={C.river} strokeWidth={1.1} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          <path d={geo.lake} fill={C.water} fillRule="evenodd" stroke={C.shore} strokeWidth={0.9} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />

          {/* roads, quietest first */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={geo.roads.primary} stroke={C.primary} strokeWidth={0.9} vectorEffect="non-scaling-stroke" opacity={1 - near * 0.4} />
            <path d={geo.roads.minor} stroke={C.minor} strokeWidth={1.1} vectorEffect="non-scaling-stroke" opacity={near} />
            <path d={geo.roads.trunk} stroke={C.land} strokeWidth={4.2} vectorEffect="non-scaling-stroke" />
            <path d={geo.roads.trunk} stroke={C.trunk} strokeWidth={2.2} vectorEffect="non-scaling-stroke" />
            <path d={geo.roads.golyaziYolu} stroke={C.ink} strokeWidth={4.6} vectorEffect="non-scaling-stroke" opacity={near} />
            <path d={geo.roads.golyaziYolu} stroke={C.accent} strokeWidth={2.8} vectorEffect="non-scaling-stroke" opacity={near} />
            <path d={geo.roads.motorway} stroke={C.land} strokeWidth={5} vectorEffect="non-scaling-stroke" />
            <path d={geo.roads.motorway} stroke={C.motorway} strokeWidth={2.6} vectorEffect="non-scaling-stroke" />
          </g>

          {SHIELDS[view].filter(visible).map((s) => {
            const [x, y] = at(s.lat, s.lon);
            const w = (s.t.length * 7.6 + 12) * u;
            const h = 18 * u;
            return (
              <g key={s.t + s.lon}>
                <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={3 * u} fill={s.motorway ? C.ink : C.land} stroke={C.ink} strokeWidth={1.2 * u} />
                <text x={x} y={y + 4.2 * u} textAnchor="middle" fontSize={12 * u} fontWeight={700} fill={s.motorway ? C.land : C.ink}>
                  {s.t}
                </text>
              </g>
            );
          })}

          {LABELS[view].filter(visible).map((l) => {
            const [gx, y] = at(l.lat, l.lon);
            let x = gx;
            let anchor = l.a ?? "start";
            if (l.edge === "right") {
              x = vb.x + vb.w - 10 * u;
              anchor = "end";
            } else if (l.edge === "left") {
              x = vb.x + 10 * u;
              anchor = "start";
            }
            const tx = x + (l.dx ?? 0) * u;
            const ty = y + (l.dy ?? 0) * u;
            const water = l.k === "water" || l.k === "sea";
            const text = water ? l.t.toLocaleUpperCase("tr") : l.t;
            return (
              <g key={l.t + l.lat + (l.only ?? "")}>
                {l.dot && <circle cx={x} cy={y} r={(l.k === "city" ? 5.5 : 3.6) * u} fill={C.ink} stroke={C.land} strokeWidth={1.4 * u} />}
                <text
                  x={tx}
                  y={ty}
                  textAnchor={anchor}
                  fontSize={fs(l.k)}
                  fontWeight={WEIGHT[l.k]}
                  letterSpacing={water ? `${0.14 * fs(l.k)}` : undefined}
                  fill={water ? C.waterInk : l.k === "road" ? C.ink2 : C.ink}
                  transform={l.rot ? `rotate(${l.rot} ${tx} ${ty})` : undefined}
                  {...(water ? waterHalo : halo)}
                >
                  {text}
                </text>
              </g>
            );
          })}

          {/* the venue: pin, leader, note card */}
          <g>
            <line
              x1={vx}
              y1={vy}
              x2={Math.min(Math.max(vx, cardX), cardX + cardW)}
              y2={Math.min(Math.max(vy, cardY), cardY + cardH)}
              stroke={C.ink}
              strokeWidth={1.2}
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={vx} cy={vy} r={15 * u} fill={C.accent} opacity={0.35} />
            <circle cx={vx} cy={vy} r={6.5 * u} fill={C.accent} stroke={C.ink} strokeWidth={1.8 * u} />
            <rect x={cardX} y={cardY} width={cardW} height={cardH} rx={3 * u} fill={C.land} stroke={C.ink} strokeWidth={1 * u} opacity={0.97} />
            <text x={cardX + 10 * u} y={cardY + 19 * u} fontSize={15 * u} fontWeight={700} fill={C.ink}>
              {lines[0]}
            </text>
            <text x={cardX + 10 * u} y={cardY + 36 * u} fontSize={12.5 * u} fill={C.ink2}>
              {lines[1]}
            </text>
          </g>

          {/* north mark and scale bar */}
          <g transform={`translate(${vb.x + 22 * u} ${vb.y + vb.h - 58 * u})`}>
            <path d={`M0 ${-10 * u}L${5 * u} ${4 * u}L0 ${1 * u}L${-5 * u} ${4 * u}Z`} fill={C.ink} />
            <text y={18 * u} textAnchor="middle" fontSize={11.5 * u} fontWeight={700} fill={C.ink} {...halo}>
              {m.north}
            </text>
          </g>
          <g transform={`translate(${vb.x + 14 * u} ${vb.y + vb.h - 14 * u})`}>
            <path d={`M0 ${-5 * u}V0H${bar}V${-5 * u}`} fill="none" stroke={C.ink} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
            <text x={bar + 6 * u} y={1 * u} fontSize={11.5 * u} fill={C.ink} {...halo}>
              {barLabel}
            </text>
          </g>
        </svg>
        <p className="sb-map-attr">
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
            {m.attribution}
          </a>{" "}
          ({m.licence})
        </p>
      </div>
      <ul className="sb-map-links">
        <li>
          <a href={google} target="_blank" rel="noopener noreferrer" className="sb-link">
            {links.google}
          </a>
        </li>
        <li>
          <a href={apple} target="_blank" rel="noopener noreferrer" className="sb-link">
            {links.apple}
          </a>
        </li>
        <li>
          <a href={osm} target="_blank" rel="noopener noreferrer" className="sb-link">
            {links.osm}
          </a>
        </li>
      </ul>
    </div>
  );
}
