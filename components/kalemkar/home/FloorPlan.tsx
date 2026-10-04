"use client";

/**
 * Ev: the house drawn from above, in the same top-down language as the sini.
 * Pointing at (or focusing) a room shows it beside the plan; choosing a
 * bookable room opens the reservation with that experience selected. On touch,
 * the first tap selects and the second opens. The courtyard is informative
 * only. The plan is a real list of links for keyboard and screen readers.
 */

import Link from "next/link";
import { useRef, useState } from "react";
import { tr } from "@/content/kalemkar/tr";
import { Photo } from "../ui/Photo";
import type { ImageKey } from "@/content/kalemkar/images";

type Area = "salon" | "tezgah" | "ozel" | "avlu";
const h = tr.house;
const PHOTO: Record<Area, ImageKey> = { salon: "kiler", tezgah: "ocak", ozel: "kubbe", avlu: "ev" };
const href = (a: Area) => `${tr.base}/rezervasyon/?deneyim=${a}`;

// Small round tables in the salon: 11, in two staggered rows, kept clear of the room label.
const TABLES = [
  [110, 100], [210, 100], [310, 100], [410, 100], [510, 100], [596, 100],
  [160, 158], [260, 158], [360, 158], [460, 158], [560, 158],
];
const STOOLS = Array.from({ length: 8 }, (_, i) => 690 + i * 32);
const ROOM_CHAIRS = Array.from({ length: 7 }, (_, i) => 300 + i * 33);

export function FloorPlan() {
  const [active, setActive] = useState<Area>("salon");
  const touch = useRef(false);
  const a = h.areas[active];

  const props = (area: Area) => ({
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") setActive(area);
    },
    onPointerDown: (e: React.PointerEvent) => {
      touch.current = e.pointerType !== "mouse";
    },
    onFocus: () => setActive(area),
    "data-active": active === area || undefined,
    // First tap on touch selects the room: no page transition may pre-empt it.
    "data-kk-novt": "",
  });

  const onAreaClick = (area: Area) => (e: React.MouseEvent) => {
    if (touch.current && active !== area) {
      e.preventDefault();
      setActive(area);
    }
  };

  return (
    <section className="kk-house" id="ev" aria-labelledby="kk-house-title">
      <div className="kk-wrap">
        <div className="kk-house-head">
          <h2 id="kk-house-title" className="kk-h2">
            {h.title}
          </h2>
          <p className="kk-lede">{h.sub}</p>
        </div>
        <div className="kk-house-grid">
          <svg className="kk-plan" viewBox="0 0 1000 640" role="group" aria-label={h.planLabel}>
            <defs>
              <pattern id="kk-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <path d="M0 0 V10" stroke="currentColor" strokeWidth="1" opacity="0.28" />
              </pattern>
            </defs>
            {/* kitchen: not bookable */}
            <g className="kk-plan-kitchen" aria-hidden="true">
              <rect x="660" y="60" width="280" height="230" fill="url(#kk-hatch)" />
              <text x="800" y="182" textAnchor="middle">
                {h.kitchen}
              </text>
            </g>

            <Link href={href("salon")} className="kk-plan-area" {...props("salon")} onClick={onAreaClick("salon")} aria-label={`${h.areas.salon.name}. ${h.areas.salon.meta}`}>
              <rect x="60" y="60" width="580" height="170" />
              {TABLES.map(([x, y]) => (
                <g key={`${x}-${y}`} className="kk-plan-furn">
                  <circle cx={x} cy={y} r="17" />
                  <circle cx={x - 26} cy={y} r="5" />
                  <circle cx={x + 26} cy={y} r="5" />
                </g>
              ))}
              <text x="350" y="218" textAnchor="middle" className="kk-plan-label">
                {h.areas.salon.name}
              </text>
            </Link>

            <Link href={href("tezgah")} className="kk-plan-area" {...props("tezgah")} onClick={onAreaClick("tezgah")} aria-label={`${h.areas.tezgah.name}. ${h.areas.tezgah.meta}`}>
              <rect x="660" y="300" width="280" height="100" />
              <rect x="676" y="306" width="248" height="16" rx="3" className="kk-plan-furn kk-plan-bar" />
              {STOOLS.map((x) => (
                <circle key={x} cx={x} cy="342" r="8" className="kk-plan-furn" />
              ))}
              <text x="800" y="384" textAnchor="middle" className="kk-plan-label">
                {h.areas.tezgah.name}
              </text>
            </Link>

            <Link href={href("ozel")} className="kk-plan-area" {...props("ozel")} onClick={onAreaClick("ozel")} aria-label={`${h.areas.ozel.name}. ${h.areas.ozel.meta}`}>
              <rect x="60" y="250" width="240" height="330" />
              <path d="M60 250 L300 580 M300 250 L60 580" className="kk-plan-vault" />
              <ellipse cx="180" cy="415" rx="96" ry="120" className="kk-plan-vault" />
              <rect x="150" y="296" width="60" height="226" rx="6" className="kk-plan-furn" />
              {ROOM_CHAIRS.map((y) => (
                <g key={y} className="kk-plan-furn">
                  <circle cx="136" cy={y + 12} r="6" />
                  <circle cx="224" cy={y + 12} r="6" />
                </g>
              ))}
              <text x="180" y="566" textAnchor="middle" className="kk-plan-label">
                {h.areas.ozel.name}
              </text>
            </Link>

            <g
              className="kk-plan-area kk-plan-area--info"
              tabIndex={0}
              role="button"
              aria-pressed={active === "avlu"}
              aria-label={`${h.areas.avlu.name}. ${h.areas.avlu.body}`}
              {...props("avlu")}
              onClick={() => setActive("avlu")}
            >
              <path d="M320 250 H640 V420 H940 V580 H320 Z" />
              <path d="M480 371 l31 13 13 31 -13 31 -31 13 -31 -13 -13 -31 13 -31z" className="kk-plan-pool" />
              <text x="480" y="420" textAnchor="middle" className="kk-plan-small">
                {h.pool}
              </text>
              <g className="kk-plan-tree" aria-hidden="true">
                <circle cx="790" cy="490" r="34" />
                <circle cx="790" cy="490" r="20" />
              </g>
              <text x="620" y="560" textAnchor="middle" className="kk-plan-label">
                {h.areas.avlu.name}
              </text>
            </g>

            {/* walls */}
            <g className="kk-plan-walls" aria-hidden="true">
              <rect x="40" y="40" width="920" height="560" className="kk-plan-outer" />
              <path d="M60 240 H650 M650 40 V410 M310 240 V600 M650 295 H960 M650 410 H960" />
              <path d="M770 600 v-14 M840 600 v-14" />
            </g>
            <text x="805" y="626" textAnchor="middle" className="kk-plan-small kk-plan-entrance" aria-hidden="true">
              {h.entrance}
            </text>
            <g className="kk-plan-north" aria-hidden="true" transform="translate(912 92)">
              <path d="M0 -18 L6 4 L0 0 L-6 4Z" />
              <text y="20" textAnchor="middle">
                {h.north}
              </text>
            </g>
          </svg>

          <aside className="kk-house-panel" aria-live="polite">
            <div className="kk-house-photo" key={active}>
              <Photo k={PHOTO[active]} sizes="(max-width: 767px) 92vw, 30vw" />
            </div>
            <h3 className="kk-h3">{a.name}</h3>
            <p>{a.body}</p>
            <p className="kk-muted">{a.meta}</p>
            {active !== "avlu" && (
              <Link href={href(active)} className="kk-btn kk-btn--accent kk-btn--sm">
                {h.bookThis}
              </Link>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
