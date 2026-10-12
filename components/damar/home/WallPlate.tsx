"use client";

// The pair from the book, drawn to scale on a wall: a 1.80 m figure and a
// door for size, dimension lines in metres. Same stone, same slabs, same
// finish as the book above; pair or four-way.
import type { Locale } from "@/content/damar/routes";
import { quadOf, type Finish, type Stone } from "@/content/damar/stones";
import { dict, metres, range } from "@/lib/damar/dict";
import { Slab } from "../ui/Slab";
import type { View } from "./Book";

// drawing in centimetres
const W = 980;
const H = 470;
const FLOOR = 430;
const X0 = 80;

function layout(view: View) {
  const w = view === "pair" ? 380 : 640;
  const h = view === "pair" ? 320 : 380;
  const x = X0;
  const y = FLOOR - h;
  const figure = x + w + 70;
  const door = x + w + 140;
  return { w, h, x, y, figure, door };
}

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const SIZES = "(max-width: 760px) 30vw, 22vw";

export function WallPlate({ locale, stone, pair, finish, view, onView }: { locale: Locale; stone: Stone; pair: [number, number]; finish: Finish; view: View; onView: (v: View) => void }) {
  const d = dict(locale);
  const t = d.home.wall;
  const L = layout(view);
  const [q1, q2, q3, q4] = quadOf(stone, stone.pairs.findIndex((p) => p[0] === pair[0]));
  const slabsText = view === "pair" ? range(pair[0], pair[1]) : range(q1, q4);

  return (
    <section className="dm-wall" aria-labelledby="dm-wall-h">
      <div className="dm-wrap dm-wall-in">
        <div className="dm-wall-text">
          <h2 id="dm-wall-h" className="dm-h2">
            {t.title}
          </h2>
          <p>{t.text}</p>
          <div className="dm-seg dm-seg--ink" role="group" aria-label={t.figure}>
            <button type="button" aria-pressed={view === "pair"} onClick={() => onView("pair")}>
              {t.pair}
            </button>
            <button type="button" aria-pressed={view === "quad"} onClick={() => onView("quad")}>
              {t.quad}
            </button>
          </div>
          <p className="dm-wall-showing">{t.showing(stone.name, slabsText)}</p>
        </div>

        <figure className="dm-plate">
          <div className="dm-elev" style={{ aspectRatio: `${W} / ${H}` }} data-view={view} data-finish={finish} data-ground={stone.ground}>
            <div
              className="dm-elev-stone"
              style={{ left: pct(L.x, W), top: pct(L.y, H), width: pct(L.w, W), height: pct(L.h, H) }}
              role="img"
              aria-label={`${t.figure}: ${t.showing(stone.name, slabsText)}`}
            >
              {view === "pair" ? (
                <div className="dm-elev-pair">
                  <div className="dm-elev-slab">
                    <Slab stone={stone.id} n={pair[0]} sizes={SIZES} className="dm-slab" />
                    <span className="dm-sheen" />
                    <span className="dm-tex" />
                  </div>
                  <div className="dm-elev-slab">
                    <Slab stone={stone.id} n={pair[1]} sizes={SIZES} className="dm-slab dm-mirror" />
                    <span className="dm-sheen" />
                    <span className="dm-tex" />
                  </div>
                </div>
              ) : (
                <div className="dm-elev-quad">
                  {([q1, q2, q3, q4] as const).map((n, i) => (
                    <div key={`${n}-${i}`} className={`dm-tile dm-tile--${"abcd"[i]}`}>
                      <Slab stone={stone.id} n={n} sizes={SIZES} className="dm-slab" />
                      <span className="dm-sheen" />
                      <span className="dm-tex" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} className="dm-elev-lines" aria-hidden="true" preserveAspectRatio="none">
              {/* floor */}
              <line x1="0" y1={FLOOR} x2={W} y2={FLOOR} className="dm-l-strong" />
              {Array.from({ length: 49 }, (_, i) => (
                <line key={i} x1={i * 20} y1={FLOOR + 22} x2={i * 20 + 14} y2={FLOOR} className="dm-l-hair" />
              ))}
              {/* wall outline around the stone */}
              <rect x={L.x} y={L.y} width={L.w} height={L.h} className="dm-l-strong dm-l-none" />
              {/* width dimension */}
              <line x1={L.x} y1={L.y - 22} x2={L.x + L.w} y2={L.y - 22} className="dm-l-thin" />
              <line x1={L.x} y1={L.y - 32} x2={L.x} y2={L.y - 12} className="dm-l-thin" />
              <line x1={L.x + L.w} y1={L.y - 32} x2={L.x + L.w} y2={L.y - 12} className="dm-l-thin" />
              {/* height dimension */}
              <line x1={L.x - 30} y1={L.y} x2={L.x - 30} y2={FLOOR} className="dm-l-thin" />
              <line x1={L.x - 40} y1={L.y} x2={L.x - 20} y2={L.y} className="dm-l-thin" />
              <line x1={L.x - 40} y1={FLOOR} x2={L.x - 20} y2={FLOOR} className="dm-l-thin" />
              {/* door: frame, leaf, handle */}
              <rect x={L.door} y={FLOOR - 210} width={90} height={210} className="dm-l-strong dm-l-none" />
              <rect x={L.door + 6} y={FLOOR - 204} width={78} height={204} className="dm-l-thin dm-l-none" />
              <line x1={L.door + 72} y1={FLOOR - 104} x2={L.door + 80} y2={FLOOR - 104} className="dm-l-strong" />
              {/* scale figure, 1.80 m */}
              <g transform={`translate(${L.figure} ${FLOOR - 180})`} className="dm-figure">
                <circle cx="0" cy="12" r="11" />
                <path d="M-17 34 Q0 26 17 34 L21 96 L13 98 L11 60 L9 180 L1 180 L0 104 L-1 180 L-9 180 L-11 60 L-13 98 L-21 96 Z" />
              </g>
            </svg>

            <span className="dm-dim dm-dim--w" style={{ left: pct(L.x + L.w / 2, W), top: pct(L.y - 22, H) }}>
              {metres(locale, L.w / 100)} m
            </span>
            <span className="dm-dim dm-dim--h" style={{ left: pct(L.x - 30, W), top: pct(L.y + L.h / 2, H) }}>
              {metres(locale, L.h / 100)} m
            </span>
          </div>
          <figcaption>{t.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
