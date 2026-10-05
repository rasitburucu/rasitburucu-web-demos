"use client";

import { useMemo, useState } from "react";
import { tr } from "@/content/sazbahce/tr";
import { assess } from "@/lib/sazbahce/assess";
import { SETUPS, VENUE, type AreaKey, type Setup } from "@/lib/sazbahce/venue";
import { PlanView } from "../plan/PlanView";
import { Reading } from "../plan/Reading";
import { Stepper } from "../home/Planner";
import { PlanWith, requestPage } from "./PlanWith";

const c = tr.corporatePage;
const AREAS_C: AreaKey[] = ["ambar", "cayir", "avlu"];

/** Desk-side planner for corporate events: area, layout and head count on the shore plan. */
export function CorporatePlanner() {
  const [area, setArea] = useState<AreaKey>("ambar");
  const [setup, setSetup] = useState<Setup>("tiyatro");
  const [guests, setGuests] = useState(120);
  const a = useMemo(() => assess({ area, ceremony: "kurumsal", guests, setup }), [area, guests, setup]);
  const layout = a.kind === "ok" || a.kind === "over" ? a.layout : null;

  return (
    <div className="sb-corp">
      <div className="sb-corp-controls">
        <div className="sb-cell sb-cell--plain">
          <span className="sb-cell-label" id="sb-c-area">
            {tr.planner.areaLabel}
          </span>
          <div className="sb-seg sb-seg--3" role="group" aria-labelledby="sb-c-area">
            {AREAS_C.map((k) => (
              <button key={k} type="button" aria-pressed={area === k} onClick={() => setArea(k)}>
                {tr.areas[k].name}
              </button>
            ))}
          </div>
        </div>
        <div className="sb-cell sb-cell--plain">
          <span className="sb-cell-label" id="sb-c-setup">
            {tr.planner.setupLabel}
          </span>
          <div className="sb-setups" role="group" aria-labelledby="sb-c-setup">
            {SETUPS.map((k) => (
              <button key={k} type="button" aria-pressed={setup === k} onClick={() => setSetup(k)} data-off={!VENUE[area].setups[k] || undefined}>
                <SetupIcon s={k} />
                <span>
                  {tr.setups[k]}
                  <small>{VENUE[area].setups[k] ? `${tr.setupHints[k]}. ${tr.planner.upTo(VENUE[area].setups[k] as number)}` : c.none}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="sb-cell sb-cell--plain">
          <label className="sb-cell-label" htmlFor="sb-c-guests">
            {c.people}
          </label>
          <Stepper value={guests} onChange={setGuests} big />
          <input id="sb-c-guests" type="range" min={20} max={400} step={10} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
        </div>
        <PlanWith patch={{ ceremony: "kurumsal", area, guests, setup }} href={requestPage} label={c.cta} className="sb-btn sb-btn--accent" />
      </div>
      <PlanView area={area} layout={layout} onPick={(k) => k !== "iskele" && setArea(k)} disabled={["iskele"]} className="sb-corp-plan" close>
        <Reading a={a} area={area} ceremony="kurumsal" guests={guests} setup={setup} onArea={setArea} />
      </PlanView>
    </div>
  );
}

/** Tiny top-down pictogram of each layout. */
function SetupIcon({ s }: { s: Setup }) {
  const ink = "currentColor";
  return (
    <svg width="34" height="26" viewBox="0 0 34 26" aria-hidden="true" className="sb-setup-ico">
      {s === "yuvarlak" && [8, 26].map((x) => [8, 19].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r="4.5" fill="none" stroke={ink} strokeWidth="1.3" />))}
      {s === "uzun" && [7, 19].map((y) => <rect key={y} x="3" y={y - 2} width="28" height="4" fill="none" stroke={ink} strokeWidth="1.3" />)}
      {s === "tiyatro" && (
        <>
          <path d="M6 3h22" stroke={ink} strokeWidth="2" />
          {[9, 14, 19, 24].map((y) => [5, 10, 15, 20, 25, 30].map((x) => <rect key={`${x}${y}`} x={x - 1.2} y={y - 1.2} width="2.4" height="2.4" fill={ink} />))}
        </>
      )}
      {s === "sinif" && (
        <>
          <path d="M6 3h22" stroke={ink} strokeWidth="2" />
          {[9, 17].map((y) => [3, 19].map((x) => <rect key={`${x}${y}`} x={x} y={y} width="12" height="3" fill="none" stroke={ink} strokeWidth="1.2" />))}
        </>
      )}
      {s === "u" && <path d="M6 5v16h22V5" fill="none" stroke={ink} strokeWidth="3" />}
      {s === "kokteyl" && [6, 17, 28].map((x) => [7, 19].map((y) => <circle key={`${x}${y}`} cx={x + (y > 10 ? -3 : 0)} cy={y} r="2.4" fill={ink} />))}
    </svg>
  );
}
