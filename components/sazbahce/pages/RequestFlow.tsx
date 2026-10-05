"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { tr } from "@/content/sazbahce/tr";
import { assess } from "@/lib/sazbahce/assess";
import { dayStates, parseIso } from "@/lib/sazbahce/availability";
import { capacity, setupFor } from "@/lib/sazbahce/plan";
import { usePlan } from "@/lib/sazbahce/store";
import { AREAS, CEREMONIES, GUESTS, SETUPS, SLOTS, VENUE } from "@/lib/sazbahce/venue";
import { DayLine, Stepper } from "../home/Planner";
import { PlanView } from "../plan/PlanView";
import { Reading } from "../plan/Reading";
import { Calendar } from "../ui/Calendar";
import { shareSummary, slotText, summaryRows } from "../ui/summary";

const r = tr.requestPage;
const N = r.steps.length;

export function RequestFlow() {
  const { plan, set, today } = usePlan();
  const [step, setStep] = useState(0);
  const [seen, setSeen] = useState(0);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const head = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    head.current?.focus({ preventScroll: true });
    head.current?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    // Phones: keep the current step visible in the horizontal step list.
    const cur = document.querySelector<HTMLElement>(".sb-flow-steps [aria-current='step']");
    const list = cur?.closest("ol");
    if (cur && list && list.scrollWidth > list.clientWidth) list.scrollLeft += cur.getBoundingClientRect().left - list.getBoundingClientRect().left - 16;
  }, [step]);

  const a = useMemo(() => assess({ date: plan.date, area: plan.area, ceremony: plan.ceremony, guests: plan.guests, setup: plan.setup }), [plan.date, plan.area, plan.ceremony, plan.guests, plan.setup]);
  const states = Object.fromEntries(dayStates(parseIso(plan.date)));

  const go = (i: number) => {
    setStep(i);
    setSeen((s) => Math.max(s, i));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (plan.name.trim().split(/\s+/).filter(Boolean).length < 2) e.name = r.contact.errName;
    const digits = plan.phone.replace(/\D/g, "").replace(/^90/, "").replace(/^0/, "");
    if (!/^5\d{9}$/.test(digits)) e.phone = r.contact.errPhone;
    setErrors(e);
    return !e.name && !e.phone;
  };

  const next = () => {
    if (step === N - 1 && !validate()) return;
    go(step + 1);
  };

  const done = step === N;

  return (
    <div className="sb-flow">
      <nav className="sb-flow-steps" aria-label={r.stepsLabel}>
        <ol>
          {r.steps.map((label, i) => (
            <li key={label}>
              <button type="button" onClick={() => go(i)} disabled={i > seen} aria-current={i === step ? "step" : undefined}>
                <span className="sb-flow-n" aria-hidden="true">
                  {i + 1}
                </span>
                {label}
              </button>
            </li>
          ))}
          <li>
            <button type="button" onClick={() => go(N)} disabled={seen < N} aria-current={done ? "step" : undefined}>
              <span className="sb-flow-n" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path d="M2 6.5 5 9l5-6" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </span>
              {r.summaryTitle}
            </button>
          </li>
        </ol>
      </nav>

      <div className="sb-flow-panel">
        {!done && (
          <p className="sb-flow-of" aria-hidden="true">
            {r.stepOf(step + 1, N)}
          </p>
        )}
        <h2 ref={head} tabIndex={-1} className="sb-h3 sb-flow-h">
          {done ? r.summaryTitle : r.steps[step]}
        </h2>

        {step === 0 && (
          <div className="sb-flow-body sb-flow-cal">
            <Calendar value={plan.date} onChange={(date) => set({ date })} today={today} />
            <DayLine date={plan.date} />
          </div>
        )}

        {step === 1 && (
          <div className="sb-flow-body">
            <div className="sb-flow-field">
              <span className="sb-cell-label" id="sb-r-tur">
                {tr.planner.ceremonyLabel}
              </span>
              <div className="sb-chips" role="group" aria-labelledby="sb-r-tur">
                {CEREMONIES.map((k) => (
                  <button key={k} type="button" className="sb-chip" aria-pressed={plan.ceremony === k} onClick={() => set({ ceremony: k })}>
                    {tr.ceremonies[k]}
                  </button>
                ))}
              </div>
            </div>
            <div className="sb-flow-field">
              <label className="sb-cell-label" htmlFor="sb-r-guests">
                {tr.planner.guestsLabel}
              </label>
              <Stepper value={plan.guests} onChange={(guests) => set({ guests })} big />
              <input id="sb-r-guests" type="range" min={GUESTS.min} max={GUESTS.max} step={GUESTS.step} value={plan.guests} onChange={(e) => set({ guests: Number(e.target.value) })} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="sb-flow-body sb-flow-area">
            <div className="sb-flow-field">
              <span className="sb-cell-label" id="sb-r-area">
                {tr.planner.areaLabel}
              </span>
              <div className="sb-areapick" role="group" aria-labelledby="sb-r-area">
                {AREAS.map((k) => {
                  const cap = capacity(k, plan.ceremony, plan.setup);
                  return (
                    <button key={k} type="button" aria-pressed={plan.area === k} onClick={() => set({ area: k })}>
                      <i data-s={states[k]} aria-hidden="true" />
                      <b>{tr.areas[k].name}</b>
                      <small>{cap ? tr.planner.upTo(cap) : tr.corporatePage.none}</small>
                    </button>
                  );
                })}
              </div>
            </div>
            {plan.ceremony === "kurumsal" && (
              <div className="sb-flow-field">
                <label className="sb-cell-label" htmlFor="sb-r-setup">
                  {tr.planner.setupLabel}
                </label>
                <select id="sb-r-setup" className="sb-select" value={setupFor(plan.ceremony, plan.setup)} onChange={(e) => set({ setup: e.target.value as typeof plan.setup })}>
                  {SETUPS.map((s) => (
                    <option key={s} value={s} disabled={!VENUE[plan.area].setups[s]}>
                      {tr.setups[s]}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="sb-flow-field">
              <span className="sb-cell-label" id="sb-r-slot">
                {tr.planner.slotLabel}
              </span>
              <div className="sb-seg sb-seg--3" role="group" aria-labelledby="sb-r-slot">
                {SLOTS.map((k) => (
                  <button key={k} type="button" aria-pressed={plan.slot === k} onClick={() => set({ slot: k })}>
                    {tr.slots[k].label}
                  </button>
                ))}
              </div>
              <small className="sb-slot-line">{slotText(plan)}</small>
            </div>
            <PlanView area={plan.area} layout={a.kind === "ok" || a.kind === "over" ? a.layout : null} onPick={(area) => set({ area })} className="sb-flow-plan">
              <Reading a={a} area={plan.area} ceremony={plan.ceremony} guests={plan.guests} setup={plan.setup} onArea={(area) => set({ area })} onNikah={() => set({ ceremony: "nikah" })} />
            </PlanView>
          </div>
        )}

        {step === 3 && (
          <div className="sb-flow-body">
            <fieldset className="sb-fieldset">
              <legend className="sb-cell-label">{r.cateringLabel}</legend>
              {Object.entries(r.catering).map(([k, label]) => (
                <label key={k} className="sb-check">
                  <input type="radio" name="catering" value={k} checked={plan.catering === k} onChange={() => set({ catering: k })} />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>
            <fieldset className="sb-fieldset">
              <legend className="sb-cell-label">{r.extrasLabel}</legend>
              {Object.entries(r.extras).map(([k, label]) => (
                <label key={k} className="sb-check">
                  <input
                    type="checkbox"
                    checked={plan.extras.includes(k)}
                    onChange={(e) => set({ extras: e.target.checked ? [...plan.extras, k] : plan.extras.filter((x) => x !== k) })}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>
          </div>
        )}

        {step === 4 && (
          <div className="sb-flow-body sb-flow-contact">
            <label className="sb-field">
              <span>{r.contact.name}</span>
              <input autoComplete="name" value={plan.name} aria-invalid={!!errors.name} aria-describedby={errors.name ? "sb-e-name" : undefined} onChange={(e) => set({ name: e.target.value })} />
              {errors.name && (
                <span id="sb-e-name" className="sb-err">
                  {errors.name}
                </span>
              )}
            </label>
            <label className="sb-field">
              <span>{r.contact.phone}</span>
              <input type="tel" inputMode="tel" autoComplete="tel" placeholder="5xx xxx xx xx" value={plan.phone} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "sb-e-phone" : undefined} onChange={(e) => set({ phone: e.target.value })} />
              {errors.phone && (
                <span id="sb-e-phone" className="sb-err">
                  {errors.phone}
                </span>
              )}
            </label>
            <label className="sb-field">
              <span>{r.contact.email}</span>
              <input type="email" autoComplete="email" value={plan.email} onChange={(e) => set({ email: e.target.value })} />
            </label>
            <fieldset className="sb-fieldset sb-fieldset--row">
              <legend className="sb-cell-label">{r.contact.reach}</legend>
              {(Object.keys(r.contact.reachOptions) as (keyof typeof r.contact.reachOptions)[]).map((k) => (
                <label key={k} className="sb-check">
                  <input type="radio" name="reach" checked={plan.reach === k} onChange={() => set({ reach: k })} />
                  <span>{r.contact.reachOptions[k]}</span>
                </label>
              ))}
            </fieldset>
            <label className="sb-field">
              <span>{r.contact.note}</span>
              <textarea placeholder={r.contact.notePh} value={plan.note} onChange={(e) => set({ note: e.target.value })} />
            </label>
          </div>
        )}

        {done && (
          <div className="sb-flow-body">
            <p className="sb-muted">{r.summaryLead}</p>
            <dl className="sb-sum">
              {summaryRows(plan, true).map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
              <div>
                <dt>{r.contact.name}</dt>
                <dd>
                  {plan.name}
                  {plan.phone ? `, ${plan.phone}` : ""}
                  {plan.email ? `, ${plan.email}` : ""}
                </dd>
              </div>
              {plan.note && (
                <div>
                  <dt>{r.contact.note}</dt>
                  <dd>{plan.note}</dd>
                </div>
              )}
            </dl>
            <div className="sb-sum-act">
              <button type="button" className="sb-btn sb-btn--accent" onClick={() => setSent(true)}>
                {r.send}
              </button>
              <button
                type="button"
                className="sb-btn sb-btn--line"
                onClick={async () => {
                  if ((await shareSummary(plan, true)) === "copied") setCopied(true);
                }}
              >
                {r.share}
              </button>
            </div>
            <p className="sb-note" role="status">
              {sent ? r.sentBody : copied ? tr.summary.copied : r.notSent}
            </p>
          </div>
        )}

        {!done && (
          <div className="sb-flow-nav">
            {step > 0 && (
              <button type="button" className="sb-btn sb-btn--line" onClick={() => go(step - 1)}>
                {r.back}
              </button>
            )}
            <button type="button" className="sb-btn sb-btn--accent" onClick={next}>
              {step === N - 1 ? r.toSummary : r.next}
            </button>
            {step === N - 1 && <span className="sb-sample">{r.notSent}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
