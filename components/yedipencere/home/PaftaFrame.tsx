"use client";

// The drawing sheet's frame: on wide screens all three elevations stand side
// by side; on phones one at a time, chosen with the Sokak / Avlu / Deniz tabs.
// The tab follows the chosen room when it is picked elsewhere (the step profile).

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/yedipencere/dates";
import { fill } from "@/lib/yedipencere/format";
import { ROOM, SIDES, type Side } from "@/lib/yedipencere/house";
import { useStay } from "@/lib/yedipencere/store";
import { COPY } from "@/content/yedipencere/copy";

export function PaftaFrame({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const { stay } = useStay();
  const [side, setSide] = useState<Side>(ROOM[stay.room].side);
  const t = COPY[lang];
  useEffect(() => setSide(ROOM[stay.room].side), [stay.room]);
  return (
    <div className="yp-pafta" data-side={side}>
      <div className="yp-tabs" role="group" aria-label={t.drawing.tabs}>
        {SIDES.map((s) => (
          <button key={s.id} type="button" aria-pressed={side === s.id} onClick={() => setSide(s.id)}>
            <span>{t.sides[s.id]}</span>
            <small>{fill(t.sideRooms, { n: s.rooms.length })}</small>
          </button>
        ))}
      </div>
      {children}
      <div className="yp-pafta-foot">
        <span>
          <i className="yp-shut-key" aria-hidden="true" />
          {t.drawing.legendClosed}
        </span>
        <span>{t.drawing.fictional}</span>
      </div>
    </div>
  );
}
