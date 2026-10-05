"use client";

import Link from "next/link";
import { useMemo } from "react";
import { tr } from "@/content/sazbahce/tr";
import { assess } from "@/lib/sazbahce/assess";
import { dayStates, daySummary, parseIso } from "@/lib/sazbahce/availability";
import { usePlan } from "@/lib/sazbahce/store";
import { ceremonyStart, clock, clockAt, sunTimes } from "@/lib/sazbahce/sun";
import { AREAS, CEREMONIES, GUESTS, SLOTS, VENUE, type AreaKey } from "@/lib/sazbahce/venue";
import { PlanView } from "../plan/PlanView";
import { Reading } from "../plan/Reading";
import { Calendar, longDate, shortDate } from "../ui/Calendar";
import { Photo } from "../ui/Photo";
import type { ImageKey } from "@/content/sazbahce/images";

const p = tr.planner;
const c = tr.calendar;

export function DayLine({ date }: { date: string }) {
  const d = parseIso(date);
  const sum = daySummary(d);
  const names = (l: AreaKey[]) => l.map((a) => tr.areas[a].name).join(", ");
  const winter = sum.kapali.length > 0;
  return (
    <p className="sb-dayline" aria-live="polite">
      <b>{longDate(d)}</b>
      <span>
        {sum.open ? "" : `${c.allBusy} `}
        {sum.bos.length > 0 && `${c.free} ${names(sum.bos)}. `}
        {sum.opsiyon.length > 0 && `${c.held} ${names(sum.opsiyon)}. `}
        {sum.open > 0 && sum.dolu.length > 0 && `${c.busy} ${names(sum.dolu)}. `}
        {winter ? `${c.winter} ` : ""}
        {c.sunset(clockAt(sunTimes(d).set))}
      </span>
    </p>
  );
}

export function Stepper({ value, onChange, big }: { value: number; onChange: (n: number) => void; big?: boolean }) {
  return (
    <div className={`sb-stepper ${big ? "sb-stepper--big" : ""}`}>
      <button type="button" aria-label={p.less} disabled={value <= GUESTS.min} onClick={() => onChange(value - GUESTS.step)}>
        −
      </button>
      <output aria-live="polite" aria-label={`${value} ${p.guestsUnit}`}>{value}</output>
      <button type="button" aria-label={p.more} disabled={value >= GUESTS.max} onClick={() => onChange(value + GUESTS.step)}>
        +
      </button>
    </div>
  );
}

export function AreaCard({ area, className }: { area: AreaKey; className?: string }) {
  const a = tr.areas[area];
  const v = VENUE[area];
  return (
    <figure className={`sb-areacard ${className ?? ""}`}>
      <div className="sb-areacard-ph">
        {AREAS.map((k) => (
          <Photo key={k} k={k as ImageKey} sizes="(max-width: 759px) 34vw, 260px" className="sb-fade" alt={k === area ? tr.areas[k].photoAlt : ""} on={k === area} />
        ))}
      </div>
      <figcaption>
        <b>{a.name}</b>
        <span>
          {a.kind}. {v.ceremonyOnly ? p.upTo(v.cap) : p.capacity(v.min, v.cap)}
        </span>
        <Link href={`${tr.base}/alanlar/#${area}`} className="sb-link">
          {p.seeArea}
        </Link>
      </figcaption>
    </figure>
  );
}

export function Planner() {
  const { plan, set, today, setSheet } = usePlan();
  const a = useMemo(() => assess({ date: plan.date, area: plan.area, ceremony: plan.ceremony, guests: plan.guests }), [plan.date, plan.area, plan.ceremony, plan.guests]);
  const layout = a.kind === "ok" || a.kind === "over" ? a.layout : null;
  const states = Object.fromEntries(dayStates(parseIso(plan.date)));

  return (
    <section className="sb-hero" id="planla" aria-labelledby="sb-h1">
      <div className="sb-hero-photo">
        <Photo k="golyazi" mobile="golyaziM" priority sizes="100vw" />
        <div className="sb-hero-text">
          <h1 id="sb-h1" className="sb-h1">
            {tr.hero.title}
          </h1>
          <p className="sb-hero-sub">{tr.hero.sub}</p>
        </div>
        <p className="sb-hero-cap">{tr.hero.photoCaption}</p>
      </div>

      <div className="sb-sheet">
        <h2 className="sb-sr">{tr.hero.planHeading}</h2>
        <div className="sb-sheet-cal" id="sb-takvim">
          <Calendar value={plan.date} onChange={(date) => set({ date })} today={today} headingId="sb-cal-h" />
          <DayLine date={plan.date} />
        </div>

        <PlanView area={plan.area} frame={plan.ceremony === "nikah" && plan.area === "cayir" && a.kind === "ok" ? "nikah" : undefined} layout={layout} onPick={(area) => set({ area })} disabled={plan.ceremony === "nikah" ? [] : ["iskele"]} className="sb-sheet-plan">
          <Reading
            a={a}
            area={plan.area}
            ceremony={plan.ceremony}
            guests={plan.guests}
            onArea={(area) => set({ area })}
            onNikah={() => set({ ceremony: "nikah" })}
          />
          <div className="sb-plan-cta">
            <button type="button" className="sb-btn sb-btn--accent" onClick={() => setSheet(true)}>
              {p.cta}
            </button>
            <small>{p.ctaNote}</small>
          </div>
        </PlanView>

        <div className="sb-sheet-card-gap" aria-hidden="true" />
        <AreaCard area={plan.area} className="sb-sheet-card" />

        <div className="sb-antet" role="group" aria-label={tr.hero.planHeading}>
          <div className="sb-cell sb-cell--tur">
            <span className="sb-cell-label" id="sb-l-tur">
              {p.ceremonyLabel}
            </span>
            <div className="sb-chips" role="group" aria-labelledby="sb-l-tur">
              {CEREMONIES.map((k) => (
                <button key={k} type="button" className="sb-chip" aria-pressed={plan.ceremony === k} onClick={() => set({ ceremony: k })}>
                  {tr.ceremonies[k]}
                </button>
              ))}
            </div>
          </div>
          <div className="sb-cell sb-cell--guests">
            <label className="sb-cell-label" htmlFor="sb-guests">
              {p.guestsLabel}
            </label>
            <Stepper value={plan.guests} onChange={(guests) => set({ guests })} big />
            <input
              id="sb-guests"
              type="range"
              min={GUESTS.min}
              max={GUESTS.max}
              step={GUESTS.step}
              value={plan.guests}
              onChange={(e) => set({ guests: Number(e.target.value) })}
            />
          </div>
          <div className="sb-cell sb-cell--area">
            <span className="sb-cell-label" id="sb-l-area">
              {p.areaLabel}
            </span>
            <div className="sb-seg" role="group" aria-labelledby="sb-l-area">
              {AREAS.map((k) => (
                <button key={k} type="button" aria-pressed={plan.area === k} onClick={() => set({ area: k })}>
                  <i data-s={states[k]} aria-hidden="true" />
                  {tr.areas[k].name}
                </button>
              ))}
            </div>
          </div>
          <div className="sb-cell sb-cell--slot">
            <span className="sb-cell-label" id="sb-l-slot">
              {p.slotLabel}
            </span>
            <div className="sb-seg sb-seg--3" role="group" aria-labelledby="sb-l-slot">
              {SLOTS.map((k) => (
                <button key={k} type="button" aria-pressed={plan.slot === k} onClick={() => set({ slot: k })}>
                  {tr.slots[k].label}
                </button>
              ))}
            </div>
            <small className="sb-slot-line" aria-live="polite">
              {plan.slot === "gunbatimi" ? p.slotSunset(clock(ceremonyStart(parseIso(plan.date))), clockAt(sunTimes(parseIso(plan.date)).set)) : tr.slots[plan.slot].range}
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Phones: date, guests and the summary stay under the thumb. */
export function MobileBar() {
  const { plan, set, setSheet } = usePlan();
  return (
    <div className="sb-mbar" role="group" aria-label={tr.mobileBar.label}>
      <a href="#sb-takvim" className="sb-mbar-date">
        {shortDate(parseIso(plan.date))}
        <small>{tr.mobileBar.free(daySummary(parseIso(plan.date)).bos.length, daySummary(parseIso(plan.date)).opsiyon.length)}</small>
      </a>
      <Stepper value={plan.guests} onChange={(guests) => set({ guests })} />
      <button type="button" className="sb-btn sb-btn--accent" onClick={() => setSheet(true)}>
        {tr.mobileBar.summary}
      </button>
    </div>
  );
}
