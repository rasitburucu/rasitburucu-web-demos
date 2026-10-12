"use client";

// The way to whichever room is chosen on the first screen, drawn on the section,
// and that room's name lifted above the others.

import type { Lang } from "@/lib/yedipencere/dates";
import { fill, steps as stepsText } from "@/lib/yedipencere/format";
import { ROOM } from "@/lib/yedipencere/house";
import { COPY } from "@/content/yedipencere/copy";
import { useStay } from "@/lib/yedipencere/store";
import { RouteLine } from "./RouteLine";
import { SX, SY, TAGS, routeOf } from "./sectionRoute";

export function LiveRoute({ lang }: { lang: Lang }) {
  const { stay } = useStay();
  const r = routeOf(stay.room);
  return <RouteLine key={stay.room} d={r.d} end={r.end} flights={r.flights} steps={ROOM[stay.room].steps} lang={lang} />;
}

export function LiveTag() {
  const { stay } = useStay();
  const [tx, ty] = TAGS[stay.room];
  return (
    <text x={SX(tx)} y={SY(ty)} textAnchor="middle" className="yp-sec-tag is-active yp-sec-tag--live" aria-hidden="true">
      {ROOM[stay.room].name}
    </text>
  );
}

/** The chosen room's climb in words, under the section (and for screen readers). */
export function LiveCaption({ lang }: { lang: Lang }) {
  const { stay } = useStay();
  const r = ROOM[stay.room];
  return (
    <p className="yp-sec-cap" aria-live="polite">
      <i aria-hidden="true" />
      {fill(COPY[lang].house.caption, { oda: r.name, basamak: stepsText(r.steps, lang) })}
    </p>
  );
}
