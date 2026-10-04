"use client";

// Month grids for the "Hangi akşam?" step. Every evening is a button with its
// state in the accessible name; closed and past days are disabled, full
// evenings stay clickable so the visitor can reach the waitlist from them.

import { tr } from "@/content/kalemkar/tr";
import type { Month, DayStatus } from "@/lib/kalemkar/availability";
import { GRID_HEAD, MONTHS, WEEKDAYS } from "@/lib/kalemkar/format";

const d = tr.flow.date;
const STATUS_LABEL: Record<DayStatus, string> = {
  gecmis: "geçti",
  kapali: "kapalı",
  kilitli: "henüz açılmadı",
  ozel: "yılbaşı sofrası",
  "bugun-kapali": "online rezervasyon kapandı",
  dolu: "dolu",
  az: "az kaldı",
  bos: "boş",
};

export function Calendar({ months, value, onPick, lockedLabel }: { months: Month[]; value?: string; onPick: (iso: string, status: DayStatus) => void; lockedLabel: string }) {
  return (
    <div className="kk-cal">
      <ul className="kk-cal-legend" aria-label="Gösterim">
        <li data-s="bos">{d.legend.bos}</li>
        <li data-s="az">{d.legend.az}</li>
        <li data-s="dolu">{d.legend.dolu}</li>
        <li data-s="kapali">{d.legend.kapali}</li>
      </ul>
      <div className="kk-cal-months">
        {months.map((m) =>
          m.locked ? (
            <section key={`${m.year}-${m.month}`} className="kk-cal-month kk-cal-month--locked" aria-label={`${MONTHS[m.month]} ${m.year}`}>
              <h3 className="kk-cal-title">
                {MONTHS[m.month]} <span>{m.year}</span>
              </h3>
              <p>{lockedLabel}</p>
            </section>
          ) : (
          <section key={`${m.year}-${m.month}`} className="kk-cal-month" data-locked={m.locked || undefined} aria-label={`${MONTHS[m.month]} ${m.year}`}>
            <h3 className="kk-cal-title">
              {MONTHS[m.month]} <span>{m.year}</span>
            </h3>
            <div className="kk-cal-head" aria-hidden="true">
              {GRID_HEAD.map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
            <div className="kk-cal-grid">
              {Array.from({ length: m.lead }, (_, i) => (
                <span key={`lead-${i}`} aria-hidden="true" />
              ))}
              {m.days.map((day) => {
                const disabled = day.status === "gecmis" || day.status === "kapali" || day.status === "kilitli";
                return (
                  <button
                    key={day.iso}
                    type="button"
                    className="kk-day"
                    data-s={day.status}
                    aria-pressed={value === day.iso}
                    disabled={disabled}
                    aria-label={`${WEEKDAYS[day.weekday]}, ${day.date} ${MONTHS[m.month]}: ${STATUS_LABEL[day.status]}`}
                    onClick={() => onPick(day.iso, day.status)}
                  >
                    <span>{day.date}</span>
                    <i aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </section>
          ),
        )}
      </div>
      <p className="kk-hint">{d.sim}</p>
    </div>
  );
}
