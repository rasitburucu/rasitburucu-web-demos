// A section through the house, from the lane to the sea: entrance hall
// (taşlık), courtyard with its cistern and orange tree, the timber stair to the
// upstairs hall (sofa), the sea wing on the old city wall, the belvedere (köşk)
// and the cliff. The far side of the courtyard is drawn as seen beyond.
// Used with numbered parts (house page) or with one room's way from the street
// door highlighted (room pages). Fictional house; drawn for this project.

import type { Lang } from "@/lib/yedipencere/dates";
import { ROOM, ROOMS, type RoomId } from "@/lib/yedipencere/house";
import { COPY } from "@/content/yedipencere/copy";
import { FINE, INK, INK2, ORANGE, WALL, scatter, f } from "./geom";
import { RouteLine } from "./RouteLine";
import { LiveRoute, LiveTag } from "./LiveRoute";
import { PARTS, S, SX, SY, TAGS, routeOf } from "./sectionRoute";

const X = SX;
const Y = SY;
type Pt = [number, number];

function Tag({ id, active }: { id: RoomId; active: boolean }) {
  const [tx, ty] = TAGS[id];
  return (
    <text x={X(tx)} y={Y(ty)} textAnchor="middle" className={`yp-sec-tag${active ? " is-active" : ""}`}>
      {ROOM[id].name}
    </text>
  );
}

export function Section({ lang, room, parts = false, live = false, label }: { lang: Lang; room?: RoomId; parts?: boolean; live?: boolean; label: string }) {
  const route = room ? routeOf(room) : null;
  const crown: [number, number, number][] = [
    [5.9, 3.7, 1.15], [5.1, 3.2, 0.8], [6.7, 3.25, 0.85], [5.9, 2.85, 0.75], [5.35, 4.25, 0.72], [6.45, 4.25, 0.75],
  ];
  const oranges: Pt[] = [[5.5, 3.0], [6.3, 3.6], [5.2, 3.8], [6.8, 3.0], [5.9, 4.3], [5.8, 2.6], [6.6, 4.2], [5.0, 3.3]];
  return (
    <svg className="yp-section" viewBox="0 0 980 540" role="img" aria-label={label}>
      {/* ground cut below grade */}
      <rect x={X(0.45)} y={Y(0)} width={16.05 * S} height={2.95 * S} fill="#EFEBE4" />
      <rect x={X(0.45)} y={Y(0)} width={16.05 * S} height={2.95 * S} fill="url(#yp-golge)" fillOpacity="0.12" />

      {/* ---- lane ---- */}
      <rect x={X(-2.7)} y={Y(-0.16)} width={2.7 * S} height="9" fill="url(#yp-arnavut)" />
      <line x1={X(-2.9)} y1={Y(-0.16)} x2={X(0)} y2={Y(-0.16)} className="c-ana" />

      {/* ---- courtyard, far side seen beyond ---- */}
      <g className="yp-sec-beyond">
        <rect x={X(4.6)} y={Y(3.4)} width={5.4 * S} height={3.4 * S} fill="url(#yp-moloz)" fillOpacity="0.55" stroke={FINE} strokeWidth="0.8" />
        <rect x={X(4.6)} y={Y(6.6)} width={5.4 * S} height={3.2 * S} fill={WALL} stroke={FINE} strokeWidth="0.8" />
        {/* courtyard room: window and door */}
        <rect x={X(7.05)} y={Y(2.4)} width={0.75 * S} height={1.45 * S} fill="#DCE5EA" stroke={INK2} strokeWidth="0.9" />
        <rect x={X(8.3)} y={Y(2.35)} width={0.8 * S} height={2.35 * S} fill="url(#yp-ahsap)" stroke={INK2} strokeWidth="0.9" />
        {/* upstairs hall balustrade and the principal room's door */}
        <rect x={X(7.2)} y={Y(5.6)} width={0.8 * S} height={2.05 * S} fill="url(#yp-ahsap)" stroke={INK2} strokeWidth="0.9" />
        <rect x={X(4.6)} y={Y(4.35)} width={5.4 * S} height={0.9 * S} fill="#F7F8F7" stroke={INK2} strokeWidth="0.9" />
        <path d={Array.from({ length: 16 }, (_, i) => `M${X(4.65 + i * 0.33)} ${Y(4.3)}l${f(0.3 * S)} ${f(0.8 * S)}`).join("")} stroke={FINE} strokeWidth="0.6" fill="none" />
        <line x1={X(4.6)} y1={Y(3.45)} x2={X(10)} y2={Y(3.45)} stroke={INK2} strokeWidth="1.2" />
      </g>
      {/* timber stair to the upstairs hall, 20 risers, with its rail */}
      <path
        d={`M${X(4.9)} ${Y(0)}` + Array.from({ length: 20 }, (_, i) => `V${Y((3.4 * (i + 1)) / 20)}H${X(4.9 + (4.7 * (i + 1)) / 20)}`).join("")}
        fill="none"
        stroke={INK}
        strokeWidth="1.1"
      />
      <path d={`M${X(4.9)} ${Y(0)}L${X(9.6)} ${Y(3.4)}`} stroke={INK} strokeWidth="0.7" fill="none" />
      <path d={`M${X(4.9)} ${Y(0.95)}L${X(9.6)} ${Y(4.35)}M${X(4.9)} ${Y(0)}V${Y(0.95)}`} stroke={INK} strokeWidth="1" fill="none" />
      {/* cistern under the courtyard */}
      <path d={`M${X(7.3)} ${Y(-2.6)}V${Y(-1.0)}A${f(1.2 * S)} ${f(0.62 * S)} 0 0 1 ${X(9.7)} ${Y(-1.0)}V${Y(-2.6)}Z`} fill="#E9EEF0" className="c-ana" />
      <rect x={X(7.35)} y={Y(-1.95)} width={2.3 * S} height={0.62 * S} fill="url(#yp-deniz)" />
      <path d={`M${X(8.35)} ${Y(0)}V${Y(-0.42)}M${X(8.75)} ${Y(0)}V${Y(-0.42)}`} className="c-orta" fill="none" />
      <rect x={X(8.15)} y={Y(0.6)} width={0.8 * S} height={0.6 * S} fill="#EDEAE3" className="c-ana" />
      <path d={`M${X(8.25)} ${Y(0.6)}V${Y(1.55)}H${X(8.85)}V${Y(0.6)}`} className="c-orta" fill="none" />
      {/* courtyard pebbles */}
      <rect x={X(4.6)} y={Y(0)} width={5.4 * S} height="6" fill="url(#yp-cakil)" />
      {/* bitter-orange tree, in front */}
      <path d={`M${X(5.75)} ${Y(0)}C${X(5.8)} ${Y(0.9)} ${X(5.65)} ${Y(1.7)} ${X(5.9)} ${Y(2.5)}`} stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <g>
        {crown.map(([cx, cy, r], i) => (
          <circle key={i} cx={X(cx)} cy={Y(cy)} r={f(r * S)} fill="#F4F6F1" stroke={INK} strokeWidth="0.9" />
        ))}
        {crown.map(([cx, cy, r], i) => (
          <circle key={`i${i}`} cx={X(cx)} cy={Y(cy)} r={f(r * S - 2)} fill="#F4F6F1" />
        ))}
        <path d={scatter(150, 5.9, 3.55, 1.6, 1.2).map(([sx, sy]) => `M${X(sx)} ${Y(sy)}l3 -1.8`).join("")} stroke="#55705A" strokeWidth="0.8" fill="none" />
        {oranges.map(([ox, oy], i) => (
          <circle key={`o${i}`} cx={X(ox)} cy={Y(oy)} r="3.6" fill={ORANGE} stroke={INK} strokeWidth="0.6" />
        ))}
      </g>

      {/* ---- lane wing ---- */}
      <rect x={X(0.45)} y={Y(0)} width={4.15 * S} height="6" fill="url(#yp-cakil)" />
      {/* street wall, cut: stone below with the door opening, timber frame above */}
      <rect x={X(0)} y={Y(3.4)} width={0.45 * S} height={0.5 * S} fill="url(#yp-moloz)" className="c-ana" strokeWidth="2" />
      <path d={`M${X(0)} ${Y(-0.16)}V${Y(0)}H${X(0.45)}`} className="c-ana" strokeWidth="2" fill="none" />
      <path d={`M${X(0.08)} ${Y(2.9)}V${Y(0)}M${X(0.37)} ${Y(2.9)}V${Y(0)}`} stroke={INK} strokeWidth="0.8" fill="none" />
      <rect x={X(0)} y={Y(6.6)} width={0.2 * S} height={3.05 * S} fill={WALL} className="c-ana" />
      {/* bay window over the lane, cut */}
      <path d={`M${X(-0.9)} ${Y(6.45)}H${X(0)}M${X(-0.9)} ${Y(3.6)}H${X(0)}M${X(-0.9)} ${Y(6.45)}V${Y(3.6)}`} className="c-ana" strokeWidth="2" fill="none" />
      <rect x={X(-0.97)} y={Y(5.85)} width="5" height={1.35 * S} fill="#DCE5EA" stroke={INK} strokeWidth="1" />
      <path d={`M${X(-0.9)} ${Y(3.6)}C${X(-0.9)} ${Y(3.05)} ${X(-0.55)} ${Y(2.75)} ${X(0)} ${Y(2.6)}`} className="c-ana" strokeWidth="1.8" fill="none" />
      {/* floor of the upstairs rooms */}
      <rect x={X(0)} y={Y(3.55)} width={4.6 * S} height={0.15 * S} fill="url(#yp-ahsap)" className="c-orta" />
      <line x1={X(-0.9)} y1={Y(6.6)} x2={X(4.6)} y2={Y(6.6)} className="c-orta" />
      {/* wall between the lane wing and the courtyard */}
      <rect x={X(4.45)} y={Y(3.4)} width={0.15 * S} height={1.0 * S} fill="url(#yp-moloz)" className="c-ana" />
      <rect x={X(4.45)} y={Y(6.6)} width={0.15 * S} height={1.0 * S} fill={WALL} className="c-ana" />
      {/* the Taşlık room's door, seen beyond */}
      <rect x={X(2.9)} y={Y(2.4)} width={0.9 * S} height={2.4 * S} fill="url(#yp-ahsap)" stroke={INK2} strokeWidth="0.9" />
      {/* roof of the lane wing, cut */}
      <path d={`M${X(-1.15)} ${Y(6.88)}L${X(2.3)} ${Y(8.35)}L${X(5.3)} ${Y(6.95)}L${X(5.3)} ${Y(6.75)}L${X(2.3)} ${Y(8.12)}L${X(-1.15)} ${Y(6.66)}Z`} fill="url(#yp-kiremit)" className="c-ana" />

      {/* ---- sea wing on the city wall ---- */}
      <rect x={X(10)} y={Y(3.4)} width={6.5 * S} height={4.0 * S} fill="url(#yp-sur)" className="c-ana" strokeWidth="2" />
      <rect x={X(16.38)} y={Y(2.4)} width="5" height={0.9 * S} fill={INK} />
      {/* stair hall floor, the two steps into the sea room, room floor */}
      <path d={`M${X(10)} ${Y(3.4)}H${X(12.2)}V${Y(3.57)}H${X(12.4)}V${Y(3.74)}H${X(16.5)}`} className="c-ana" fill="none" />
      <rect x={X(12.6)} y={Y(6.6)} width={0.14 * S} height={1.2 * S} fill={WALL} className="c-ana" />
      <rect x={X(16.3)} y={Y(6.6)} width={0.2 * S} height={2.86 * S} fill={WALL} className="c-ana" />
      <rect x={X(16.3)} y={Y(5.8)} width={0.2 * S} height={1.6 * S} fill="#DCE5EA" stroke={INK} strokeWidth="1" />
      {/* the narrow belvedere stair, 14 steep risers, seen beyond */}
      <path
        d={`M${X(10.1)} ${Y(3.4)}` + Array.from({ length: 14 }, (_, i) => `V${Y(3.4 + (3.22 * (i + 1)) / 14)}H${X(10.1 + (2.4 * (i + 1)) / 14)}`).join("")}
        fill="none"
        stroke={INK2}
        strokeWidth="1"
      />
      {/* belvedere floor and walls */}
      <path d={`M${X(12.5)} ${Y(6.62)}H${X(14.2)}V${Y(6.79)}H${X(14.4)}V${Y(6.96)}H${X(16.5)}`} className="c-ana" fill="none" />
      <line x1={X(10)} y1={Y(6.6)} x2={X(12.5)} y2={Y(6.6)} className="c-orta" />
      <rect x={X(16.3)} y={Y(9.3)} width={0.2 * S} height={2.34 * S} fill={WALL} className="c-ana" />
      <rect x={X(16.3)} y={Y(8.75)} width={0.2 * S} height={1.2 * S} fill="#DCE5EA" stroke={INK} strokeWidth="1" />
      <rect x={X(11.95)} y={Y(9.3)} width={0.2 * S} height={2.68 * S} fill={WALL} className="c-ana" />
      <path d={`M${X(9.7)} ${Y(6.65)}L${X(11.95)} ${Y(7.5)}`} className="c-ana" fill="none" />
      <path d={`M${X(11.6)} ${Y(9.5)}L${X(14.25)} ${Y(10.6)}L${X(16.9)} ${Y(9.5)}L${X(16.9)} ${Y(9.32)}L${X(14.25)} ${Y(10.4)}L${X(11.6)} ${Y(9.32)}Z`} fill="url(#yp-kiremit)" className="c-ana" />
      <line x1={X(12.15)} y1={Y(9.3)} x2={X(16.3)} y2={Y(9.3)} className="c-orta" />

      {/* ---- cliff and sea ---- */}
      <path
        d={`M${X(10)} ${Y(-0.6)}L${X(16.5)} ${Y(-0.6)}L${X(16.5)} ${Y(0)}L${X(17.1)} ${Y(-0.9)}L${X(16.8)} ${Y(-1.8)}L${X(17.4)} ${Y(-2.7)}L${X(17.2)} ${Y(-3.4)}L${X(10)} ${Y(-3.4)}Z`}
        fill="url(#yp-traverten)"
        className="c-ana"
      />
      <rect x={X(10)} y={Y(-0.6)} width={6.5 * S} height={0.6 * S} fill="url(#yp-sur)" className="c-orta" />
      <path d={`M${X(-2.9)} ${Y(-3.45)}H${X(12.5)}l7 -10l7 20l7 -10H${X(24.5)}`} stroke="#FAFAF8" strokeWidth="7" fill="none" />
      <path d={`M${X(-2.9)} ${Y(-3.45)}H${X(12.5)}l7 -10l7 20l7 -10H${X(24.5)}`} className="c-orta" fill="none" />
      <rect x={X(17.0)} y={Y(-3.6)} width={7.4 * S} height={1.0 * S} fill="url(#yp-deniz)" />
      <g aria-hidden="true">
        <path d={`M${X(19.0)} ${Y(0)}V${Y(-3.4)}M${X(18.85)} ${Y(0)}H${X(19.15)}M${X(18.85)} ${Y(-3.4)}H${X(19.15)}`} stroke={INK2} strokeWidth="0.8" fill="none" />
        <text x={X(19.2)} y={Y(-1.6)} className="yp-kot-t">
          {COPY[lang].drawing.cliff}
        </text>
      </g>


      {/* numbered parts */}
      {parts && (
        <g aria-hidden="true">
          {PARTS.map(([px, py], i) => (
            <g key={i} className="yp-sec-part">
              <circle cx={X(px)} cy={Y(py)} r="11" />
              <text x={X(px)} y={Y(py) + 4.5} textAnchor="middle">
                {i + 1}
              </text>
            </g>
          ))}
        </g>
      )}

      {route && room && <RouteLine d={route.d} end={route.end} flights={route.flights} steps={ROOM[room].steps} lang={lang} />}
      {live && <LiveRoute lang={lang} />}
      {/* room names, above the route so they stay readable */}
      <g aria-hidden="true">
        {ROOMS.map((r) => (
          <Tag key={r.id} id={r.id} active={r.id === room} />
        ))}
        {live && <LiveTag />}
      </g>
      <text x={X(-2.7)} y={Y(-0.16) + 26} className="yp-sec-note" aria-hidden="true">
        {lang === "tr" ? "Sokak" : "Lane"}
      </text>
      <text x={X(23.6)} y={Y(-3.6) + 24} textAnchor="end" className="yp-sec-note" aria-hidden="true">
        {lang === "tr" ? "Deniz" : "Sea"}
      </text>
    </svg>
  );
}
