// The three elevations of the house as a survey drawing (rölöve): lane,
// courtyard and sea. Static parts are rendered on the server; the windows
// (which open, close and take a photo) are drawn by WindowLayer on top.
// Fictional house, drawn from the documented grammar of Kaleiçi houses:
// rubble-stone ground floor, timber-frame upper floor, bay window on brackets,
// chamfered corner, double street door, courtyard with cistern and orange tree,
// sea wing on the old city wall, belvedere (köşk) on the roof.

import type { Lang } from "@/lib/yedipencere/dates";
import { COPY } from "@/content/yedipencere/copy";
import { BEGONVIL, BEGONVIL_D, FINE, G, INK, INK2, M, ORANGE, WALL, X, Y, f, scatter } from "./geom";
import { ELEV } from "./windows";

type P = { ox: number };

function Eaves({ ox, from, to, y = 6.6 }: P & { from: number; to: number; y?: number }) {
  const n = Math.round((to - from - 0.2) / 0.4);
  return (
    <g>
      <rect x={X(ox, from)} y={Y(y + 0.25)} width={(to - from) * M} height={0.25 * M} fill="#F7F8F7" className="c-ana" />
      <path d={Array.from({ length: n + 1 }, (_, i) => `M${f(X(ox, from + 0.1 + i * 0.4))} ${f(Y(y))}V${f(Y(y + 0.25))}`).join("")} className="c-ince" fill="none" />
    </g>
  );
}

function Shadow({ x, y, w, h, o = 0.5 }: { x: number; y: number; w: number; h: number; o?: number }) {
  return <rect x={x} y={y} width={w} height={h} fill="url(#yp-golge)" fillOpacity={o} />;
}

function Kot({ x, m, text, side = "right" }: { x: number; m: number; text: string; side?: "right" | "left" }) {
  const y = Y(m);
  return (
    <g className="yp-kot" aria-hidden="true">
      <path d={`M${x} ${y} l6 -6 h-12 z`} fill="none" stroke={INK} strokeWidth="0.8" />
      <line x1={x - 14} y1={y} x2={x + 30} y2={y} className="c-silik" />
      <text x={side === "right" ? x + 9 : x - 9} y={y - 4} textAnchor={side === "right" ? "start" : "end"} className="yp-kot-t">
        {text}
      </text>
    </g>
  );
}

function Title({ ox, text, at = 4.5 }: P & { text: string; at?: number }) {
  const cx = X(ox, at);
  return (
    <g aria-hidden="true">
      <text x={cx} y={Y(-5.15)} textAnchor="middle" className="yp-elev-title">
        {text}
      </text>
      <line x1={cx - 64} y1={Y(-5.15) + 6} x2={cx + 64} y2={Y(-5.15) + 6} className="c-orta" />
    </g>
  );
}

/* ---------------------------------------------------------------- lane */

export function SokakBase() {
  const ox = ELEV.sokak.ox;
  const x = (m: number) => X(ox, m);
  const blooms: [number, number, number][] = [
    [0.2, 2.9, 0.55], [0.7, 3.3, 0.6], [1.3, 3.15, 0.55], [1.9, 3.35, 0.6], [2.5, 3.05, 0.5],
    [2.95, 2.7, 0.45], [0.05, 2.35, 0.4], [3.05, 2.2, 0.32], [1.0, 3.75, 0.42], [1.75, 3.8, 0.4],
  ];
  return (
    <g>
      <rect x={x(-1.2)} y={G} width={11.4 * M} height={0.55 * M} fill="url(#yp-arnavut)" />
      <line x1={x(-1.4)} y1={G} x2={x(10.2)} y2={G} className="c-ana" strokeWidth="2" />
      {/* rubble-stone ground floor, plastered timber-frame upper floor */}
      <rect x={x(0)} y={Y(3.4)} width={9 * M} height={3.4 * M} fill="url(#yp-moloz)" className="c-ana" />
      <rect x={x(0)} y={Y(6.6)} width={9 * M} height={3.2 * M} fill={WALL} className="c-ana" />
      <rect x={x(-0.05)} y={Y(3.55)} width={9.1 * M} height={0.16 * M} fill="#D9D2CB" className="c-orta" />
      {/* 45° chamfered corner, against cart wheels */}
      <path d={`M${x(0)} ${G}V${Y(2)}l${0.28 * M} ${-0.22 * M}V${G}`} fill="#E5E0DA" className="c-orta" />
      <path
        d={`M${x(0.35)} ${Y(3.55)}V${Y(6.6)}M${x(8.65)} ${Y(3.55)}V${Y(6.6)}M${x(0.35)} ${Y(5.1)}L${x(1.6)} ${Y(6.6)}M${x(8.65)} ${Y(5.1)}L${x(7.5)} ${Y(6.6)}`}
        className="c-silik"
        fill="none"
      />
      {/* double street door */}
      <rect x={x(0.85)} y={Y(2.9)} width={1.7 * M} height={2.9 * M} fill="#ECE7E1" className="c-ana" />
      <rect x={x(1.0)} y={Y(2.7)} width={1.4 * M} height={2.7 * M} fill="url(#yp-ahsap)" className="c-orta" />
      <line x1={x(1.7)} y1={Y(2.7)} x2={x(1.7)} y2={G} className="c-orta" />
      <path d={`M${x(1.15)} ${Y(2.45)}h${0.4 * M}v${0.9 * M}h${-0.4 * M}z M${x(1.85)} ${Y(2.45)}h${0.4 * M}v${0.9 * M}h${-0.4 * M}z`} className="c-ince" fill="none" />
      <circle cx={x(1.6)} cy={Y(1.15)} r="1.8" fill={INK} />
      <circle cx={x(1.8)} cy={Y(1.15)} r="1.8" fill={INK} />
      <line x1={x(1.0)} y1={G - 0.16 * M} x2={x(2.4)} y2={G - 0.16 * M} className="c-ince" />
      {/* bougainvillea over the door */}
      <path d={`M${x(2.95)} ${G}C${x(3.1)} ${Y(1)} ${x(2.8)} ${Y(1.8)} ${x(3.0)} ${Y(2.6)}`} className="c-orta" fill="none" />
      <g>
        {blooms.map(([bx, by, r], i) => (
          <circle key={i} cx={f(x(bx))} cy={f(Y(by))} r={f(r * M)} fill={BEGONVIL} fillOpacity={0.2} />
        ))}
        <path d={scatter(80, 1.55, 3.15, 1.6, 0.66).map(([sx, sy]) => `M${f(x(sx))} ${f(Y(sy))}q2 -3 4 0`).join("")} stroke={BEGONVIL_D} strokeWidth="0.75" fill="none" />
        {scatter(26, 1.5, 3.1, 1.5, 0.6).map(([sx, sy], i) => (
          <circle key={`p${i}`} cx={f(x(sx))} cy={f(Y(sy))} r={1.5} fill={BEGONVIL} fillOpacity={0.75} />
        ))}
      </g>
      {/* bay window (cumba) on three brackets */}
      <rect x={x(2.95)} y={Y(6.45)} width={3.3 * M} height={2.9 * M} fill={WALL} className="c-ana" />
      <rect x={x(2.95)} y={Y(4.25)} width={3.3 * M} height={0.7 * M} fill="url(#yp-ahsap)" className="c-orta" />
      <path
        d={Array.from({ length: 5 }, (_, i) => {
          const xx = x(3.05 + i * 0.62);
          return `M${f(xx)} ${f(Y(4.2))}l${0.56 * M} ${-0.6 * M}M${f(xx)} ${f(Y(3.6))}l${0.56 * M} ${0.6 * M}`;
        }).join("")}
        className="c-silik"
        fill="none"
      />
      {[3.1, 4.6, 6.1].map((bx) => (
        <path key={bx} d={`M${f(x(bx))} ${Y(3.55)}C${f(x(bx))} ${Y(3.0)} ${f(x(bx - 0.05))} ${Y(2.85)} ${f(x(bx - 0.32))} ${Y(2.55)}`} className="c-ana" strokeWidth="1.8" fill="none" />
      ))}
      <rect x={x(2.8)} y={Y(3.6)} width={3.6 * M} height={0.12 * M} fill={INK} />
      {/* eaves and hipped roof */}
      <Eaves ox={ox} from={-0.7} to={9.7} />
      <path d={`M${x(-0.75)} ${Y(6.85)}L${x(1.9)} ${Y(8.25)}L${x(7.1)} ${Y(8.25)}L${x(9.75)} ${Y(6.85)}Z`} fill="url(#yp-kiremit)" className="c-ana" />
      <Shadow x={x(0)} y={Y(6.6)} w={9 * M} h={0.32 * M} />
      <Shadow x={x(2.95)} y={Y(3.55)} w={3.3 * M} h={0.22 * M} o={0.45} />
    </g>
  );
}

export function SokakTop({ lang }: { lang: Lang }) {
  const ox = ELEV.sokak.ox;
  const t = COPY[lang];
  const kx = X(ox, -1.95);
  return (
    <g>
      <Kot x={kx} m={0} text="±0,00" />
      <Kot x={kx} m={3.4} text={lang === "tr" ? "+3,40" : "+3.40"} />
      <Title ox={ox} text={t.elevations.sokak} />
      <KeyPlan lang={lang} />
    </g>
  );
}

/** Small plan in the corner: which way each elevation is looked at. */
function KeyPlan({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const arrow = (x1: number, y1: number, x2: number, y2: number) => {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const h = (d: number) => `l${f(-7 * Math.cos(a + d))} ${f(-7 * Math.sin(a + d))}`;
    return <path d={`M${x1} ${y1}L${x2} ${y2}M${x2} ${y2}${h(-0.45)}M${x2} ${y2}${h(0.45)}`} stroke={BEGONVIL} strokeWidth="1.6" fill="none" strokeLinecap="round" />;
  };
  return (
    <g className="yp-keyplan" transform="translate(8 24) scale(0.84)" aria-label={t.drawing.keyPlan} role="img">
      <rect x="0" y="0" width="196" height="84" fill="#FAFAF8" stroke="#C9C3BB" strokeWidth="0.8" />
      <rect x="30" y="14" width="34" height="58" fill="#E9E5DF" stroke={INK} strokeWidth="1.2" />
      <rect x="64" y="52" width="58" height="20" fill="#E9E5DF" stroke={INK} strokeWidth="1.2" />
      <rect x="122" y="10" width="40" height="62" fill="#E9E5DF" stroke={INK} strokeWidth="1.2" />
      <circle cx="92" cy="34" r="7" fill="none" stroke={INK} strokeWidth="0.8" />
      <path d="M168 6 L172 20 L168 34 L173 48 L168 62 L172 78" stroke={INK} strokeWidth="1.2" fill="none" />
      <path d={Array.from({ length: 6 }, (_, i) => `M172 ${10 + i * 12}L180 ${6 + i * 12}`).join("")} stroke={INK} strokeWidth="0.6" fill="none" />
      {arrow(6, 43, 25, 43)}
      {arrow(92, 22, 92, 45)}
      {arrow(192, 43, 166, 43)}
      <text x="5" y="62" className="yp-kp-t">
        {t.sides.sokak}
      </text>
      <text x="100" y="20" className="yp-kp-t">
        {t.sides.avlu}
      </text>
      <text x="193" y="62" textAnchor="end" className="yp-kp-t">
        {t.sides.deniz}
      </text>
    </g>
  );
}

/* ----------------------------------------------------------- courtyard */

export function AvluBase() {
  const ox = ELEV.avlu.ox;
  const x = (m: number) => X(ox, m);
  const crown: [number, number, number][] = [
    [0.4, 4.0, 1.25], [-0.5, 3.4, 0.9], [1.3, 3.5, 0.95], [0.5, 2.9, 0.85], [-0.2, 4.6, 0.75], [1.1, 4.6, 0.8],
  ];
  const oranges: [number, number][] = [
    [0.1, 3.2], [0.9, 3.9], [-0.3, 4.1], [1.5, 3.3], [0.5, 4.7], [0.2, 2.8], [1.2, 4.5], [-0.6, 3.5], [0.7, 3.4], [-0.1, 3.7],
  ];
  return (
    <g>
      <rect x={x(-1.2)} y={G} width={11.4 * M} height={0.55 * M} fill="url(#yp-cakil)" />
      <line x1={x(-1.4)} y1={G} x2={x(10.2)} y2={G} className="c-ana" strokeWidth="2" />
      <rect x={x(0)} y={Y(3.4)} width={9 * M} height={3.4 * M} fill="url(#yp-moloz)" className="c-ana" />
      <rect x={x(0)} y={Y(6.6)} width={9 * M} height={3.2 * M} fill={WALL} className="c-ana" />
      {/* the half-open upstairs hall (sofa) with its balustrade */}
      <rect x={x(0.8)} y={Y(6.55)} width={4.6 * M} height={3.1 * M} fill="url(#yp-golge)" fillOpacity="0.35" />
      {[0.8, 2.3, 3.85, 5.35].map((px) => (
        <rect key={px} x={f(x(px) - 2.5)} y={Y(6.55)} width="5" height={3.1 * M} fill="#F7F8F7" className="c-orta" />
      ))}
      <rect x={x(0.8)} y={Y(4.35)} width={4.6 * M} height={0.9 * M} fill="#F7F8F7" className="c-orta" />
      <path
        d={Array.from({ length: 14 }, (_, i) => {
          const xx = 0.85 + i * 0.325;
          return `M${f(x(xx))} ${f(Y(4.3))}l${f(0.3 * M)} ${f(0.8 * M)}M${f(x(xx + 0.3))} ${f(Y(4.3))}l${f(-0.3 * M)} ${f(0.8 * M)}`;
        }).join("")}
        className="c-ince"
        fill="none"
      />
      <rect x={x(-0.05)} y={Y(3.55)} width={9.1 * M} height={0.16 * M} fill="#D9D2CB" className="c-orta" />
      {/* arched passage from the taşlık */}
      <path d={`M${x(1.2)} ${G}V${Y(1.85)}A${0.8 * M} ${0.8 * M} 0 0 1 ${x(2.8)} ${Y(1.85)}V${G}Z`} fill="url(#yp-golge)" className="c-ana" />
      <path d={`M${x(1.0)} ${G}V${Y(1.85)}A${1.0 * M} ${1.0 * M} 0 0 1 ${x(3.0)} ${Y(1.85)}V${G}`} className="c-orta" fill="none" />
      {/* the courtyard room's door */}
      <rect x={x(7.25)} y={Y(2.35)} width={1.0 * M} height={2.35 * M} fill="url(#yp-ahsap)" className="c-ana" />
      <line x1={x(7.25)} y1={G - 0.15 * M} x2={x(8.25)} y2={G - 0.15 * M} className="c-ince" />
      {/* cistern rim with its pulley frame */}
      <rect x={x(3.55)} y={Y(0.85)} width={1.15 * M} height={0.85 * M} fill="#EDEAE3" className="c-ana" />
      <ellipse cx={x(4.125)} cy={Y(0.85)} rx={0.6 * M} ry="3.5" fill="#F7F8F7" className="c-orta" />
      <path d={`M${x(3.7)} ${Y(0.85)}V${Y(2.0)}H${x(4.55)}V${Y(0.85)}`} className="c-orta" fill="none" />
      <circle cx={x(4.125)} cy={Y(1.8)} r="4" className="c-orta" fill="none" />
      <line x1={x(4.125)} y1={Y(1.65)} x2={x(4.125)} y2={Y(1.1)} className="c-ince" />
      {/* bitter-orange tree */}
      <path d={`M${x(0.25)} ${G}C${x(0.3)} ${Y(1)} ${x(0.15)} ${Y(1.8)} ${x(0.45)} ${Y(2.6)}`} className="c-ana" strokeWidth="2.2" fill="none" />
      <g>
        {crown.map(([cx, cy, r], i) => (
          <circle key={i} cx={f(x(cx))} cy={f(Y(cy))} r={f(r * M)} fill="#F4F6F1" stroke={INK} strokeWidth="0.9" />
        ))}
        {crown.map(([cx, cy, r], i) => (
          <circle key={`i${i}`} cx={f(x(cx))} cy={f(Y(cy))} r={f(r * M - 2)} fill="#F4F6F1" />
        ))}
        <path d={scatter(130, 0.4, 3.75, 1.75, 1.35).map(([sx, sy]) => `M${f(x(sx))} ${f(Y(sy))}l2.6 -1.6`).join("")} stroke="#55705A" strokeWidth="0.75" fill="none" />
        {oranges.map(([ox2, oy], i) => (
          <circle key={`o${i}`} cx={f(x(ox2))} cy={f(Y(oy))} r="3.2" fill={ORANGE} stroke={INK} strokeWidth="0.6" />
        ))}
      </g>
      <Eaves ox={ox} from={-0.7} to={9.7} />
      <path d={`M${x(-0.75)} ${Y(6.85)}L${x(1.9)} ${Y(8.25)}L${x(7.1)} ${Y(8.25)}L${x(9.75)} ${Y(6.85)}Z`} fill="url(#yp-kiremit)" className="c-ana" />
      <Shadow x={x(0)} y={Y(6.6)} w={9 * M} h={0.32 * M} />
    </g>
  );
}

export function AvluTop({ lang }: { lang: Lang }) {
  return <Title ox={ELEV.avlu.ox} text={COPY[lang].elevations.avlu} />;
}

/* ----------------------------------------------------------------- sea */

export function DenizBase() {
  const ox = ELEV.deniz.ox;
  const x = (m: number) => X(ox, m);
  return (
    <g>
      {/* travertine cliff, broken off: the sea is about 30 m below */}
      <path
        d={`M${x(-1.0)} ${G}L${x(10.6)} ${G}L${x(10.9)} ${Y(-1.2)}L${x(10.4)} ${Y(-2.3)}L${x(10.8)} ${Y(-3.6)}L${x(10.5)} ${Y(-4.2)}L${x(-1.1)} ${Y(-4.2)}L${x(-0.8)} ${Y(-2.8)}L${x(-1.2)} ${Y(-1.5)}Z`}
        fill="url(#yp-traverten)"
        className="c-ana"
      />
      <path d={`M${x(-1.6)} ${Y(-4.25)}H${x(4.3)}l6 -9l6 18l6 -9H${x(11.4)}`} stroke="#F7F8F7" strokeWidth="6" fill="none" />
      <path d={`M${x(-1.6)} ${Y(-4.25)}H${x(4.3)}l6 -9l6 18l6 -9H${x(11.4)}`} className="c-orta" fill="none" />
      <rect x={x(-1.6)} y={Y(-4.6)} width={13 * M} height={1.6 * M} fill="url(#yp-deniz)" />
      <line x1={x(-1.6)} y1={G} x2={x(11.2)} y2={G} className="c-ana" strokeWidth="2" />
      {/* the old city wall carries the sea wing */}
      <rect x={x(0)} y={Y(3.4)} width={10 * M} height={3.4 * M} fill="url(#yp-sur)" className="c-ana" />
      <rect x={x(1.95)} y={Y(2.3)} width={0.16 * M} height={1.0 * M} fill={INK} />
      <rect x={x(7.15)} y={Y(2.3)} width={0.16 * M} height={1.0 * M} fill={INK} />
      <rect x={x(0)} y={Y(6.6)} width={10 * M} height={3.2 * M} fill={WALL} className="c-ana" />
      <rect x={x(-0.05)} y={Y(3.55)} width={10.1 * M} height={0.16 * M} fill="#D9D2CB" className="c-orta" />
      <path d={`M${x(0.35)} ${Y(3.55)}V${Y(6.6)}M${x(9.65)} ${Y(3.55)}V${Y(6.6)}`} className="c-silik" fill="none" />
      <Eaves ox={ox} from={-0.7} to={10.7} />
      <path d={`M${x(-0.75)} ${Y(6.85)}L${x(1.3)} ${Y(8.1)}L${x(4.4)} ${Y(8.1)}L${x(4.4)} ${Y(6.85)}Z`} fill="url(#yp-kiremit)" className="c-ana" />
      {/* belvedere (köşk) */}
      <rect x={x(4.4)} y={Y(9.3)} width={5.3 * M} height={2.45 * M} fill={WALL} className="c-ana" />
      <path d={`M${x(4.55)} ${Y(6.85)}V${Y(9.3)}M${x(9.55)} ${Y(6.85)}V${Y(9.3)}`} className="c-silik" fill="none" />
      <Eaves ox={ox} from={4.0} to={10.1} y={9.3} />
      <path d={`M${x(3.95)} ${Y(9.55)}L${x(7.05)} ${Y(10.6)}L${x(10.15)} ${Y(9.55)}Z`} fill="url(#yp-kiremit)" className="c-ana" />
      <Shadow x={x(0)} y={Y(6.6)} w={4.4 * M} h={0.32 * M} />
      <Shadow x={x(4.4)} y={Y(6.6)} w={5.6 * M} h={0.32 * M} />
      <Shadow x={x(4.4)} y={Y(9.3)} w={5.3 * M} h={0.26 * M} />
    </g>
  );
}

export function DenizTop({ lang }: { lang: Lang }) {
  const ox = ELEV.deniz.ox;
  const x = (m: number) => X(ox, m);
  const t = COPY[lang];
  const dx = x(11.35);
  return (
    <g>
      <Kot x={x(10.95)} m={9.3} text={lang === "tr" ? "+9,30" : "+9.30"} />
      {/* cliff height, drawn broken */}
      <g aria-hidden="true">
        <path d={`M${dx - 4} ${G}H${dx + 4}M${dx} ${G}V${Y(-4.2)}M${dx - 4} ${Y(-4.2)}H${dx + 4}`} stroke={INK2} strokeWidth="0.8" fill="none" />
        <text x={dx + 6} y={Y(-2.0)} className="yp-kot-t">
          {t.drawing.cliff}
        </text>
      </g>
      <Title ox={ox} text={t.elevations.deniz} />
      <line x1={x(-1.6)} y1={Y(-4.6) + 1.6 * M} x2={x(11.4)} y2={Y(-4.6) + 1.6 * M} stroke={FINE} strokeWidth="0.6" />
    </g>
  );
}
