"use client";

import { useState } from "react";
import { tr } from "@/content/sazbahce/tr";
import { usePlan } from "@/lib/sazbahce/store";
import { shortDate } from "../ui/Calendar";

const v = tr.visitPage;

/** Visit request: one of the next open days, a time, how many people. Sends nothing. */
export function Appointment() {
  const { today, plan, set } = usePlan();
  const [day, setDay] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [people, setPeople] = useState(0);
  const [sent, setSent] = useState(false);
  const days: Date[] = [];
  if (today) {
    for (let i = 1; days.length < 12; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      if (d.getDay() !== 1) days.push(d);
    }
  }
  const chosen = day ?? 0;

  return (
    <form
      className="sb-appt"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <fieldset className="sb-fieldset">
        <legend className="sb-cell-label">{v.dayLabel}</legend>
        <div className="sb-appt-days">
          {days.map((d, i) => (
            <label key={d.toISOString()} className="sb-pill">
              <input type="radio" name="day" checked={chosen === i} onChange={() => setDay(i)} />
              <span>{shortDate(d)}</span>
            </label>
          ))}
        </div>
        <p className="sb-sample">{v.closedDay}</p>
      </fieldset>
      <fieldset className="sb-fieldset sb-fieldset--row">
        <legend className="sb-cell-label">{v.timeLabel}</legend>
        {v.times.map((t, i) => (
          <label key={t} className="sb-pill">
            <input type="radio" name="time" checked={time === i} onChange={() => setTime(i)} />
            <span>{t}</span>
          </label>
        ))}
      </fieldset>
      <fieldset className="sb-fieldset sb-fieldset--row">
        <legend className="sb-cell-label">{v.peopleLabel}</legend>
        {v.people.map((t, i) => (
          <label key={t} className="sb-pill">
            <input type="radio" name="people" checked={people === i} onChange={() => setPeople(i)} />
            <span>{t}</span>
          </label>
        ))}
      </fieldset>
      <div className="sb-appt-contact">
        <label className="sb-field">
          <span>{v.name}</span>
          <input autoComplete="name" value={plan.name} onChange={(e) => set({ name: e.target.value })} />
        </label>
        <label className="sb-field">
          <span>{v.phone}</span>
          <input type="tel" inputMode="tel" autoComplete="tel" value={plan.phone} onChange={(e) => set({ phone: e.target.value })} />
        </label>
      </div>
      <div className="sb-sum-act">
        <button type="submit" className="sb-btn sb-btn--accent">
          {v.submit}
        </button>
      </div>
      <p className="sb-note" role="status">
        {sent && days[chosen] ? v.sentBody(shortDate(days[chosen]), v.times[time]) : v.notSent}
      </p>
    </form>
  );
}
