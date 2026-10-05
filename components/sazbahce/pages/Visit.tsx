"use client";

import { useEffect, useState } from "react";
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

/** Schematic region map: Bursa to the east, the lake, Gölyazı and the venue on the east shore. */
export function RegionMap() {
  const ink = "#1D3830";
  const m = v.map;
  // phones: frame the east shore, Gölyazı, the venue and Bursa, so labels stay legible
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 599px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return (
    <svg viewBox={narrow ? "150 110 650 330" : "0 0 800 460"} role="img" aria-label={v.mapLabel} className="sb-region">
      <rect width="800" height="460" fill="#F3F4EE" />
      {/* Sea of Marmara to the north */}
      <path d="M0 0H800V62C700 82 640 58 560 74C470 92 400 64 300 80C200 96 120 70 0 88Z" fill="#B9D0CB" />
      <text x="400" y="40" textAnchor="middle" fontFamily="var(--sb-sans)" fontWeight="600" fontSize="14" letterSpacing="0.14em" fill="#3F6259">
        {m.sea.toLocaleUpperCase("tr")}
      </text>
      {/* the lake */}
      <path
        d="M120 250C130 200 190 170 260 176C320 160 380 170 420 190C452 206 468 236 462 266C456 300 420 322 370 330C310 340 240 336 190 318C140 300 112 284 120 250Z"
        fill="#B4CEC9"
        stroke={ink}
        strokeWidth="1.4"
      />
      {[[220, 240, 10], [305, 222, 7], [370, 250, 6]].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill="#E2EBDD" stroke={ink} strokeWidth="0.8" />
      ))}
      {/* Gölyazı: a small peninsula on the north-east shore */}
      <path d="M398 186C404 168 424 166 430 180C434 192 424 202 412 200" fill="#E2EBDD" stroke={ink} strokeWidth="1" />
      <text x="436" y="168" fontFamily="var(--sb-sans)" fontSize="13" fill={ink}>
        {m.golyazi}
      </text>
      <text x="270" y="298" textAnchor="middle" fontFamily="var(--sb-sans)" fontWeight="600" fontSize="14" letterSpacing="0.12em" fill="#3F6259">
        {m.lake.toLocaleUpperCase("tr")}
      </text>
      {/* roads */}
      <path d="M700 250C620 246 560 236 510 244C486 248 474 254 466 258" fill="none" stroke="#C9974A" strokeWidth="3" />
      <path d="M700 250C690 190 676 140 660 62" fill="none" stroke="#7E8E86" strokeWidth="3" />
      <path d="M560 236C520 222 470 206 432 196" fill="none" stroke="#C9974A" strokeWidth="2" strokeDasharray="6 5" />
      <text x="672" y="132" fontFamily="var(--sb-sans)" fontSize="12" fill="#4F655C">
        {m.o5}
      </text>
      {/* towns */}
      <circle cx="700" cy="250" r="9" fill={ink} />
      <text x="716" y="255" fontFamily="var(--sb-sans)" fontWeight="700" fontSize="16" fill={ink}>
        {m.bursa}
      </text>
      <circle cx="560" cy="86" r="5" fill={ink} />
      <text x="572" y="104" fontFamily="var(--sb-sans)" fontSize="13" fill={ink}>
        {m.mudanya}
      </text>
      <path d="M660 62l-10 -30M660 62l12 -28" stroke="#7E8E86" strokeWidth="3" fill="none" />
      <text x="676" y="24" fontFamily="var(--sb-sans)" fontSize="13" fill={ink}>
        {m.istanbul} ↑
      </text>
      {/* the venue */}
      <g transform="translate(466 258)">
        <circle r="16" fill="#E8AF56" opacity="0.35" />
        <circle r="7" fill="#E8AF56" stroke={ink} strokeWidth="1.6" />
      </g>
      <text x="482" y="290" fontFamily="var(--sb-sans)" fontWeight="700" fontSize="17" fill={ink}>
        {m.venue}
      </text>
    </svg>
  );
}
