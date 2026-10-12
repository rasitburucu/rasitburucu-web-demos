"use client";

// The same walk as a list a phone can follow: one row per street or flight,
// the turn into it, its length, surface and steps, and what you pass on the way.

import type { Lang } from "@/lib/yedipencere/dates";
import { fill, metres } from "@/lib/yedipencere/format";
import type { Walk } from "@/lib/yedipencere/route";
import { COPY } from "@/content/yedipencere/copy";
import { arrival as ARRIVAL } from "@/content/yedipencere/arrival";
import { legName } from "./names";

export function Itinerary({ walk, lang, startName, roomName, roomSteps, handover }: { walk: Walk; lang: Lang; startName: string; roomName: string; roomSteps: number; handover: string }) {
  const t = COPY[lang];
  const a = ARRIVAL[lang];
  return (
    <ol className="yp-itin">
      <li className="yp-itin-row" data-kind="start">
        <span className="yp-itin-spine" aria-hidden="true" />
        <div>
          <p className="yp-itin-name">{fill(t.arrival.startAt, { yer: startName })}</p>
          <p className="yp-itin-meta">
            {handover} <span className="yp-tag">{t.arrival.serviceSample}</span>
          </p>
        </div>
      </li>
      {walk.legs.map((leg, i) => {
        const steps = leg.kind === "steps";
        const marks = walk.landmarks.filter((lm) => lm.at >= leg.at && lm.at < leg.at + leg.m);
        const turn = i > 0 && leg.turn && leg.turn !== "straight" ? a.turns[leg.turn] : null;
        return (
          <li key={i} className="yp-itin-row" data-kind={steps ? "steps" : "walk"} data-surface={leg.surface}>
            <span className="yp-itin-spine" aria-hidden="true" />
            <div>
              {turn && <p className="yp-itin-turn">{turn}</p>}
              <p className="yp-itin-name">
                {steps ? (leg.dir === "down" ? fill(t.arrival.stepsDown, { n: leg.steps }) : fill(t.arrival.stepsUp, { n: leg.steps })) : legName(leg, lang)}
                {steps && leg.stepsSample && <span className="yp-tag">{t.measuredSample}</span>}
              </p>
              <p className="yp-itin-meta">
                {metres(Math.round(leg.m), lang)}
                {!steps && (
                  <>
                    {" · "}
                    {a.surfaces[leg.surface]}
                    {leg.surfaceSample && <span className="yp-tag">{t.measuredSample}</span>}
                  </>
                )}
                {leg.slope && <> · {t.arrival.slope}</>}
                {steps && leg.pieces.some((p) => p.handrail) && <> · {t.arrival.handrail}</>}
              </p>
              {marks.map((lm) => (
                <p key={lm.name} className="yp-itin-lm">
                  {fill(lm.side === "left" ? t.arrival.landmarkLeft : t.arrival.landmarkRight, { ad: lang === "en" && lm.nameEn ? lm.nameEn : lm.name })}
                </p>
              ))}
            </div>
          </li>
        );
      })}
      <li className="yp-itin-row" data-kind="end">
        <span className="yp-itin-spine" aria-hidden="true" />
        <div>
          <p className="yp-itin-name">{t.arrival.door}</p>
          <p className="yp-itin-meta">{fill(t.arrival.insideAfter, { oda: roomName, basamak: `${roomSteps} ${lang === "tr" ? "basamak" : roomSteps === 1 ? "step" : "steps"}` })}</p>
        </div>
      </li>
    </ol>
  );
}
