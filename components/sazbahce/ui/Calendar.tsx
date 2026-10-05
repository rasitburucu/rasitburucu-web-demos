"use client";

import { useEffect, useState } from "react";
import { tr } from "@/content/sazbahce/tr";
import { dayStates, isoDay, parseIso, type AreaState } from "@/lib/sazbahce/availability";
import { CAL_RANGE } from "@/lib/sazbahce/venue";

const c = tr.calendar;

export const longDate = (d: Date) => `${d.getDate()} ${tr.months[d.getMonth()]} ${d.getFullYear()} ${tr.weekdaysLong[d.getDay()]}`;
export const shortDate = (d: Date) => `${d.getDate()} ${tr.monthsShort[d.getMonth()]} ${tr.weekdaysShort[d.getDay()]}`;

type Props = {
  value: string;
  onChange: (iso: string) => void;
  today: Date | null;
  /** Show the four area dots and the legend (venue availability). */
  occupancy?: boolean;
  isDisabled?: (d: Date) => boolean;
  className?: string;
  headingId?: string;
};

export function Calendar({ value, onChange, today, occupancy = true, isDisabled, className, headingId }: Props) {
  const sel = parseIso(value);
  const [month, setMonth] = useState(() => new Date(sel.getFullYear(), sel.getMonth(), 1));

  // Follow the selection when it changes from elsewhere (e.g. restored from the session).
  useEffect(() => {
    const d = parseIso(value);
    setMonth((m) => (m.getFullYear() === d.getFullYear() && m.getMonth() === d.getMonth() ? m : new Date(d.getFullYear(), d.getMonth(), 1)));
  }, [value]);

  const y = month.getFullYear();
  const m = month.getMonth();
  const prev = new Date(y, m - 1, 1);
  const next = new Date(y, m + 1, 1);
  const canPrev = prev >= CAL_RANGE.from;
  const canNext = next <= CAL_RANGE.to;
  const lead = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();

  return (
    <div className={`sb-cal ${className ?? ""}`}>
      <div className="sb-cal-head">
        <button type="button" className="sb-iconbtn" aria-label={c.prev} disabled={!canPrev} onClick={() => setMonth(prev)}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M9 2 4 7l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
        <h3 id={headingId} aria-live="polite">
          {tr.months[m]} {y}
        </h3>
        <button type="button" className="sb-iconbtn" aria-label={c.next} disabled={!canNext} onClick={() => setMonth(next)}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="m5 2 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
      </div>
      <div className="sb-cal-wd" aria-hidden="true">
        {tr.weekdays.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="sb-cal-grid">
        {Array.from({ length: lead }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const d = new Date(y, m, i + 1);
          const iso = isoDay(d);
          const past = today ? d < today : false;
          const states: AreaState[] = occupancy ? dayStates(d).map(([, s]) => s).filter((s) => s !== "kapali") : [];
          const free = states.filter((s) => s === "bos").length;
          const held = states.filter((s) => s === "opsiyon").length;
          const full = occupancy && free + held === 0;
          const off = past || (isDisabled ? isDisabled(d) : false);
          return (
            <button
              key={iso}
              type="button"
              className="sb-day"
              data-full={full || undefined}
              disabled={off}
              aria-pressed={iso === value}
              aria-label={occupancy ? c.dayAria(longDate(d), free, held) : longDate(d)}
              onClick={() => onChange(iso)}
            >
              {i + 1}
              {occupancy && (
                <span className="sb-dots" aria-hidden="true">
                  {states.map((s, j) => (
                    <i key={j} data-s={s} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {occupancy && (
        <div className="sb-cal-foot">
          <span className="sb-legend" aria-hidden="true">
            <span>
              <i data-s="bos" />
              {c.legend.bos}
            </span>
            <span>
              <i data-s="opsiyon" />
              {c.legend.opsiyon}
            </span>
            <span>
              <i data-s="dolu" />
              {c.legend.dolu}
            </span>
          </span>
          <span className="sb-sample">{c.sample}</span>
        </div>
      )}
    </div>
  );
}
