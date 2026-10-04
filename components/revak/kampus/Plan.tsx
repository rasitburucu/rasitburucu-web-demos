"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { plan, type PlanPoint } from "@/content/revak/yasam";
import { Icon } from "../ui/Icon";
import { Photo } from "../ui/Photo";

// The campus as an ink plan (not to scale): forest to the north, the courtyard and its
// arcade in the middle, one gate to the south. Each marker is a small keystone and a real
// <button>; the plan drawing itself is decoration. Picking "turda görmek istiyorum"
// collects places that open pre-ticked in the tour form (?gor=a|b).

const W = 1000;
const H = 640;

/** Deterministic canopy for the forest edge. */
function trees() {
  const out: { x: number; y: number; r: number }[] = [];
  let s = 7;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 150; i++) {
    const band = rnd();
    let x: number;
    let y: number;
    if (band < 0.62) {
      x = 30 + rnd() * 940;
      y = 18 + rnd() * 62;
    } else {
      x = 860 + rnd() * 125;
      y = 60 + rnd() * 330;
    }
    out.push({ x, y, r: 8 + rnd() * 9 });
  }
  return out;
}

/** A row of little arches: the arcade drawn along one courtyard edge. */
function arcade(x1: number, y1: number, x2: number, y2: number, n: number) {
  const d: string[] = [];
  const dx = (x2 - x1) / n;
  const dy = (y2 - y1) / n;
  const horizontal = Math.abs(dx) > Math.abs(dy);
  for (let i = 0; i < n; i++) {
    const ax = x1 + dx * i;
    const ay = y1 + dy * i;
    const bx = ax + dx;
    const by = ay + dy;
    if (horizontal) d.push(`M${ax + 2} ${ay} A${(bx - ax - 4) / 2} ${(bx - ax - 4) / 2} 0 0 1 ${bx - 2} ${by}`);
    else d.push(`M${ax} ${ay + 2} A${(by - ay - 4) / 2} ${(by - ay - 4) / 2} 0 0 ${dy > 0 ? 1 : 0} ${bx} ${by - 2}`);
  }
  return d.join(" ");
}

function PlanDrawing() {
  const canopy = useMemo(trees, []);
  const L = plan.labels;
  return (
    <svg className="rv-plan-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      {/* forest */}
      <g className="rv-plan-trees">
        {canopy.map((t, i) => (
          <circle key={i} cx={t.x} cy={t.y} r={t.r} />
        ))}
      </g>
      {/* site boundary */}
      <path className="rv-plan-site" d="M60 96 H850 Q880 96 880 126 V560 Q880 590 850 590 H560 V604 H440 V590 H90 Q60 590 60 560 Z" />
      {/* road to the gate */}
      <path className="rv-plan-road" d="M470 640 V604 M530 640 V604" />
      {/* paths */}
      <path className="rv-plan-path" d="M500 590 V402 M340 300 H322 M660 240 H680 M660 360 H680 M340 420 H332 M500 190 V172 M790 210 Q850 180 890 128 M220 460 Q260 470 340 440 M560 520 H610" />
      {/* courtyard and its arcade */}
      <rect className="rv-plan-court" x="340" y="190" width="320" height="212" />
      <path className="rv-plan-arcade" d={[arcade(340, 402, 660, 402, 16), arcade(340, 190, 660, 190, 16), arcade(340, 190, 340, 402, 10), arcade(660, 190, 660, 402, 10)].join(" ")} />
      {/* buildings */}
      <g className="rv-plan-bld">
        <rect x="425" y="104" width="150" height="68" />
        <rect x="212" y="212" width="110" height="92" />
        <rect x="680" y="176" width="112" height="128" />
        <rect x="200" y="378" width="132" height="84" />
        <rect x="680" y="380" width="150" height="124" />
        <rect x="590" y="492" width="58" height="46" />
        <rect x="100" y="404" width="112" height="80" />
      </g>
      {/* the pool inside the sports hall */}
      <rect className="rv-plan-pool" x="696" y="440" width="118" height="48" />
      <path className="rv-plan-lanes" d="M696 452 H814 M696 464 H814 M696 476 H814" />
      {/* kindergarten garden, fenced */}
      <path className="rv-plan-fence" d="M86 496 H236 V570 H86 Z" />
      <g className="rv-plan-beds">
        <rect x="102" y="512" width="34" height="14" />
        <rect x="102" y="536" width="34" height="14" />
        <circle cx="190" cy="534" r="20" />
      </g>
      {/* labels */}
      <g className="rv-plan-label">
        <text x="500" y="146" textAnchor="middle">{L.library}</text>
        <text x="267" y="262" textAnchor="middle">{L.dining}</text>
        <text x="736" y="246" textAnchor="middle">{L.blockB}</text>
        <text x="266" y="424" textAnchor="middle">{L.stage}</text>
        <text x="755" y="416" textAnchor="middle">{L.sports}</text>
        <text x="156" y="448" textAnchor="middle">{L.kinder}</text>
        <text x="500" y="300" textAnchor="middle" className="rv-plan-label--court">{L.court}</text>
        <text x="542" y="630">{L.road}</text>
        <text x="930" y="420" textAnchor="middle" className="rv-plan-label--soft">{L.forest}</text>
      </g>
      {/* north arrow */}
      <g className="rv-plan-north" transform="translate(110 140)">
        <path d="M0 -18 L7 6 L0 1 L-7 6 Z" />
        <text y="22" textAnchor="middle">{L.north}</text>
      </g>
    </svg>
  );
}

export function CampusPlan() {
  const id = useId();
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const p: PlanPoint = plan.points[active];
  const on = p.see ? picked.includes(p.see) : false;
  const tourHref = `/revak/kabul/kampus-turu/?tur=yerinde${picked.length ? `&gor=${encodeURIComponent(picked.join("|"))}` : ""}`;
  const go = (d: number) => setActive((a) => (a + d + plan.points.length) % plan.points.length);

  return (
    <div className="rv-plan">
      <div className="rv-plan-map">
        <PlanDrawing />
        <ul className="rv-plan-marks" aria-label={plan.label}>
          {plan.points.map((pt, i) => (
            <li key={pt.id} style={{ left: `${(pt.x / W) * 100}%`, top: `${(pt.y / H) * 100}%` }}>
              <button
                type="button"
                className="rv-plan-mark"
                aria-pressed={i === active}
                aria-controls={`${id}-panel`}
                data-picked={pt.see && picked.includes(pt.see) ? "" : undefined}
                onClick={() => setActive(i)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M4 3h16l-3.5 18h-9Z" />
                </svg>
                <span className="rv-sr">{pt.name}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="rv-plan-hint">{plan.hint}</p>
      </div>

      <div className="rv-plan-panel" id={`${id}-panel`} aria-live="polite">
        <div className="rv-plan-card" key={p.id}>
          <Photo k={p.image} arch sizes="(max-width: 860px) 40vw, 14vw" className="rv-plan-photo" />
          <div>
            <p className="rv-plan-count rv-num">
              {active + 1} / {plan.points.length}
            </p>
            <h3>{p.name}</h3>
            <p>{p.text}</p>
          </div>
        </div>
        <div className="rv-plan-act">
          {p.see ? (
            <button
              type="button"
              className="rv-btn rv-btn--line rv-plan-pick"
              aria-pressed={on}
              onClick={() => setPicked((arr) => (on ? arr.filter((x) => x !== p.see) : [...arr, p.see as string]))}
            >
              {on && <Icon name="check" size={18} />}
              {plan.pick}
            </button>
          ) : (
            <p className="rv-plan-always">{plan.always}</p>
          )}
          <div className="rv-plan-step">
            <button type="button" className="rv-icon-btn" onClick={() => go(-1)} aria-label={plan.points[(active - 1 + plan.points.length) % plan.points.length].name}>
              <Icon name="arrowLeft" size={20} />
            </button>
            <button type="button" className="rv-icon-btn" onClick={() => go(1)} aria-label={plan.points[(active + 1) % plan.points.length].name}>
              <Icon name="arrow" size={20} />
            </button>
          </div>
        </div>
        {picked.length > 0 && (
          <div className="rv-plan-picked">
            <p>
              <strong>{picked.join(", ")}</strong>
              <br />
              <span>{plan.picked}</span>
            </p>
            <Link href={tourHref} className="rv-btn rv-btn--seal">
              {plan.tourCta(picked.length)}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
