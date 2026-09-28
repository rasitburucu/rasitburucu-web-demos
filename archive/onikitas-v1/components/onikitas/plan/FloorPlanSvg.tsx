import { plans, roomArea, type LevelId, type Room } from "@/content/onikitas/plans";
import type { TypologyId } from "@/content/onikitas/villas";
import { tr } from "@/content/onikitas/tr";

const S = 20; // svg units per metre
const PAD = 14;
const INK = "#3b3a2e";

type Props = {
  type: TypologyId;
  level: LevelId;
  furnished?: boolean;
  labels?: boolean;
  title?: string;
  className?: string;
  id?: string;
};

export function levelOf(type: TypologyId, level: LevelId) {
  return plans[type][level];
}

/** Simple architectural floor plan drawn from room rectangles (metres). */
export function FloorPlanSvg({ type, level, furnished = false, labels = true, title, className, id }: Props) {
  const lv = plans[type][level];
  if (!lv) return null;
  const W = lv.w * S + PAD * 2;
  const H = lv.h * S + PAD * 2;
  const indoor = lv.rooms.filter((r) => !r.outdoor && r.kind !== "house");
  const isSite = level === "bahce";

  return (
    <svg
      id={id}
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
      style={{ fontFamily: "var(--font-schibsted), system-ui, sans-serif" }}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <pattern id={`hatch-${type}-${level}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={INK} strokeOpacity="0.18" strokeWidth="1" />
        </pattern>
      </defs>
      <g transform={`translate(${PAD} ${PAD})`}>
        {/* outdoor first, then rooms */}
        {lv.rooms
          .filter((r) => r.outdoor)
          .map((r, i) => (
            <OutdoorRoom key={`o${i}`} r={r} furnished={furnished || isSite} />
          ))}
        {lv.rooms
          .filter((r) => !r.outdoor)
          .map((r, i) =>
            r.kind === "house" ? (
              <g key={`h${i}`}>
                <rect x={r.x * S} y={r.y * S} width={r.w * S} height={r.h * S} fill={`url(#hatch-${type}-${level})`} stroke={INK} strokeWidth="3" />
              </g>
            ) : (
              <rect key={`r${i}`} x={r.x * S} y={r.y * S} width={r.w * S} height={r.h * S} fill="#fbf8f2" stroke={INK} strokeWidth="1.2" />
            ),
          )}
        {/* exterior wall around indoor rooms */}
        {indoor.length > 0 ? <OuterWall rooms={indoor} /> : null}
        {furnished && !isSite
          ? lv.rooms.filter((r) => !r.outdoor).map((r, i) => <Furniture key={`f${i}`} r={r} />)
          : null}
        {lv.rooms.filter((r) => r.kind === "stair").map((r, i) => <Stair key={`s${i}`} r={r} />)}
        {labels
          ? lv.rooms.map((r, i) => <RoomLabel key={`l${i}`} r={r} site={isSite} furnished={furnished} />)
          : null}
      </g>
    </svg>
  );
}

function OuterWall({ rooms }: { rooms: Room[] }) {
  const x0 = Math.min(...rooms.map((r) => r.x));
  const y0 = Math.min(...rooms.map((r) => r.y));
  const x1 = Math.max(...rooms.map((r) => r.x + r.w));
  const y1 = Math.max(...rooms.map((r) => r.y + r.h));
  return (
    <rect x={x0 * S} y={y0 * S} width={(x1 - x0) * S} height={(y1 - y0) * S} fill="none" stroke={INK} strokeWidth="4" />
  );
}

function OutdoorRoom({ r, furnished }: { r: Room; furnished: boolean }) {
  const x = r.x * S;
  const y = r.y * S;
  const w = r.w * S;
  const h = r.h * S;
  if (r.kind === "pool") {
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} fill="#1e3442" fillOpacity="0.16" stroke="#1e3442" strokeOpacity="0.55" strokeWidth="1.2" />
        <line x1={x + 6} y1={y + h / 2} x2={x + w - 6} y2={y + h / 2} stroke="#1e3442" strokeOpacity="0.3" strokeDasharray="4 5" />
      </g>
    );
  }
  if (r.kind === "green") {
    const trees: [number, number][] = [];
    const n = Math.max(2, Math.round((r.w * r.h) / 40));
    for (let i = 0; i < n; i++) {
      const tx = x + ((i * 37 + 11) % Math.max(1, w - 24)) + 12;
      const ty = y + ((i * 53 + 17) % Math.max(1, h - 24)) + 12;
      trees.push([tx, ty]);
    }
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} fill="#d8ccb8" fillOpacity="0.25" stroke={INK} strokeOpacity="0.25" strokeDasharray="3 4" />
        {furnished
          ? trees.map(([tx, ty], i) => (
              <g key={i}>
                <circle cx={tx} cy={ty} r="9" fill="none" stroke={INK} strokeOpacity="0.45" />
                <circle cx={tx} cy={ty} r="1.6" fill={INK} fillOpacity="0.5" />
              </g>
            ))
          : null}
      </g>
    );
  }
  // terraces
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#d8ccb8" fillOpacity="0.45" stroke={INK} strokeOpacity="0.55" strokeDasharray="5 4" />
      {furnished && r.kind === "terrace" && r.w >= 4 ? (
        <g stroke={INK} strokeOpacity="0.5" fill="none">
          <rect x={x + w * 0.62} y={y + 0.4 * S} width={0.7 * S} height={Math.min(1.9, r.h - 0.8) * S} />
          <rect x={x + w * 0.62 + 1 * S} y={y + 0.4 * S} width={0.7 * S} height={Math.min(1.9, r.h - 0.8) * S} />
          <circle cx={x + w * 0.25} cy={y + h / 2} r={0.55 * S} />
        </g>
      ) : null}
    </g>
  );
}

function Stair({ r }: { r: Room }) {
  // treads on the right third of the room
  const x = (r.x + r.w - Math.min(1.2, r.w * 0.4)) * S;
  const w = Math.min(1.2, r.w * 0.4) * S;
  const y = (r.y + 0.3) * S;
  const h = (r.h - 0.6) * S;
  const n = Math.max(4, Math.floor(h / 9));
  return (
    <g stroke={INK} strokeOpacity="0.6" strokeWidth="0.8">
      <rect x={x} y={y} width={w} height={h} fill="none" />
      {Array.from({ length: n - 1 }, (_, i) => (
        <line key={i} x1={x} x2={x + w} y1={y + ((i + 1) * h) / n} y2={y + ((i + 1) * h) / n} />
      ))}
    </g>
  );
}

function Furniture({ r }: { r: Room }) {
  const x = r.x * S;
  const y = r.y * S;
  const w = r.w * S;
  const h = r.h * S;
  const p = { stroke: INK, strokeOpacity: 0.55, fill: "none", strokeWidth: 0.9 } as const;
  switch (r.kind) {
    case "living":
      return (
        <g {...p}>
          <rect x={x + 0.5 * S} y={y + h - 1.5 * S} width={Math.min(3, r.w - 1.5) * S} height={0.9 * S} />
          <rect x={x + 1 * S} y={y + h - 3 * S} width={1.3 * S} height={0.7 * S} />
          <rect x={x + w - 1.6 * S} y={y + h - 2.6 * S} width={0.9 * S} height={0.9 * S} />
          <rect x={x + 0.4 * S} y={y + 0.4 * S} width={Math.min(2.2, r.w - 1) * S} height={0.35 * S} />
        </g>
      );
    case "bed": {
      const bw = r.w >= 4.5 ? 1.8 : 1.4;
      return (
        <g {...p}>
          <rect x={x + w / 2 - (bw / 2) * S} y={y + 0.2 * S} width={bw * S} height={2 * S} />
          <rect x={x + w / 2 - (bw / 2 - 0.15) * S} y={y + 0.35 * S} width={(bw / 2 - 0.25) * S} height={0.4 * S} />
          <rect x={x + w / 2 + 0.1 * S} y={y + 0.35 * S} width={(bw / 2 - 0.25) * S} height={0.4 * S} />
        </g>
      );
    }
    case "dining": {
      const tw = Math.min(2.4, r.w - 2);
      const cx = x + w / 2;
      const cy = y + h / 2;
      return (
        <g {...p}>
          <rect x={cx - (tw / 2) * S} y={cy - 0.5 * S} width={tw * S} height={1 * S} />
          {[-1, 0, 1].map((k) => (
            <g key={k}>
              <circle cx={cx + k * (tw / 3) * S} cy={cy - 0.85 * S} r={0.22 * S} />
              <circle cx={cx + k * (tw / 3) * S} cy={cy + 0.85 * S} r={0.22 * S} />
            </g>
          ))}
        </g>
      );
    }
    case "kitchen":
      return (
        <g {...p}>
          <rect x={x + 0.1 * S} y={y + 0.1 * S} width={w - 0.2 * S} height={0.6 * S} />
          <rect x={x + 0.1 * S} y={y + 0.7 * S} width={0.6 * S} height={h - 1.2 * S} />
          {r.w >= 5 ? <rect x={x + w / 2 - 1 * S} y={y + h / 2} width={2 * S} height={0.9 * S} /> : null}
        </g>
      );
    case "bath":
      return (
        <g {...p}>
          {r.w >= 3 ? <rect x={x + 0.15 * S} y={y + 0.15 * S} width={1.7 * S} height={0.75 * S} rx="6" /> : null}
          <rect x={x + w - 0.8 * S} y={y + h - 0.7 * S} width={0.6 * S} height={0.45 * S} rx="3" />
        </g>
      );
    case "study":
      return (
        <g {...p}>
          <rect x={x + 0.3 * S} y={y + 0.3 * S} width={2 * S} height={0.7 * S} />
          <circle cx={x + 1.3 * S} cy={y + 1.5 * S} r={0.3 * S} />
        </g>
      );
    default:
      return null;
  }
}

function RoomLabel({ r, site, furnished }: { r: Room; site: boolean; furnished: boolean }) {
  const area = roomArea(r);
  if (r.kind === "stair" && area < 10) return null;
  if (!site && area < 5 && r.w < 3) return null;
  const name = tr.rooms[r.label] ?? r.label;
  const small = site ? 11 : r.w < 3.5 ? 7 : 8.4;
  const showArea = !site && r.kind !== "house" && r.kind !== "green";
  // With furniture drawn, move labels into the free part of each room.
  let cx = (r.x + r.w / 2) * S;
  let cy = (r.y + r.h / 2) * S;
  let anchor: "middle" | "start" | "end" = "middle";
  if (furnished && !site) {
    if (r.kind === "bed") cy = (r.y + r.h - 0.9) * S;
    else if (r.kind === "dining") {
      anchor = "start";
      cx = (r.x + 0.35) * S;
      cy = (r.y + 0.9) * S;
    } else if (r.kind === "kitchen") {
      anchor = "end";
      cx = (r.x + r.w - 0.3) * S;
      cy = (r.y + r.h - 0.75) * S;
    } else if (r.kind === "living") {
      anchor = "end";
      cx = (r.x + r.w - 0.4) * S;
      cy = (r.y + 1.3) * S;
    } else if (r.kind === "terrace") {
      cx = (r.x + r.w * 0.44) * S;
    } else if (r.kind === "bath" && r.w >= 3) cy = (r.y + r.h - 0.9) * S;
  }
  return (
    <g textAnchor={anchor} fill={INK}>
      <text x={cx} y={showArea ? cy - 2 : cy + 3} fontSize={small} fontWeight={500}>
        {name}
      </text>
      {showArea ? (
        <text x={cx} y={cy + small + 1} fontSize={small * 0.86} fillOpacity={0.75} style={{ fontFamily: "var(--font-plex-mono), monospace" }}>
          {area} m²
        </text>
      ) : null}
    </g>
  );
}

export function interiorArea(type: TypologyId, level: LevelId) {
  const lv = plans[type][level];
  if (!lv) return 0;
  return lv.rooms.filter((r) => !r.outdoor && r.kind !== "house").reduce((s, r) => s + roomArea(r), 0);
}
