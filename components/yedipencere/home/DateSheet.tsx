"use client";

// The date sheet: a month calendar (the chosen room's taken nights drawn as
// shuttered days), nights and guests. A modal dialog on every screen size;
// on phones it rises from the bottom.

import { useEffect, useRef, useState } from "react";
import { taken } from "@/lib/yedipencere/availability";
import { addDays, diffDays, fmtDay, monthName, weekday, weekHeader, type Lang } from "@/lib/yedipencere/dates";
import { fill } from "@/lib/yedipencere/format";
import { MAX_GUESTS, MAX_NIGHTS, ROOM } from "@/lib/yedipencere/house";
import { useStay } from "@/lib/yedipencere/store";
import { COPY } from "@/content/yedipencere/copy";
import { ChevronLeft, ChevronRight, Minus, Plus } from "../ui/icons";

const monthOf = (iso: string) => iso.slice(0, 7);
const shiftMonth = (ym: string, k: number) => {
  const [y, m] = ym.split("-").map(Number);
  const n = y * 12 + (m - 1) + k;
  return `${Math.floor(n / 12)}-${String((n % 12) + 1).padStart(2, "0")}`;
};

function Month({ lang, view }: { lang: Lang; view: string }) {
  const { stay, setStay, today } = useStay();
  const t = COPY[lang].dates;
  const [y, m] = view.split("-").map(Number);
  const first = `${view}-01`;
  const lead = (weekday(first) + 6) % 7;
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => `${view}-${String(i + 1).padStart(2, "0")}`)];
  const room = ROOM[stay.room];
  return (
    <div className="yp-cal">
      <div className="yp-cal-head" aria-hidden="true">
        {weekHeader(lang).map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="yp-cal-grid">
        {cells.map((iso, i) => {
          if (!iso) return <span key={`b${i}`} />;
          const off = diffDays(today, iso);
          const disabled = off < 0 || off > 365;
          const inStay = diffDays(stay.checkIn, iso) >= 0 && diffDays(stay.checkIn, iso) < stay.nights;
          const isTaken = !disabled && taken(stay.room, iso);
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              aria-pressed={iso === stay.checkIn}
              data-stay={inStay || undefined}
              data-taken={isTaken || undefined}
              aria-label={`${fmtDay(iso, lang)}${isTaken ? `, ${fill(t.takenLegend, { oda: room.name })}` : ""}`}
              onClick={() => setStay({ checkIn: iso })}
            >
              {Number(iso.slice(8))}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DateSheet({ lang }: { lang: Lang }) {
  const { stay, setStay, today, sheet, setSheet } = useStay();
  const ref = useRef<HTMLDialogElement>(null);
  const [view, setView] = useState(monthOf(stay.checkIn));
  const t = COPY[lang].dates;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (sheet && !d.open) {
      setView(monthOf(stay.checkIn));
      d.showModal();
    }
    if (!sheet && d.open) d.close();
    // the month follows the stay only when the sheet opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet]);

  const min = monthOf(today);
  const max = monthOf(addDays(today, 365));
  const [y, m] = view.split("-").map(Number);

  return (
    <dialog
      ref={ref}
      className="yp-dialog yp-sheet"
      aria-labelledby="yp-sheet-h"
      onClose={() => setSheet(false)}
      onCancel={() => setSheet(false)}
      onClick={(e) => {
        if (e.target === ref.current) setSheet(false);
      }}
    >
      <div className="yp-dialog-in">
        <h2 id="yp-sheet-h">{t.sheetTitle}</h2>
        <div className="yp-cal-nav">
          <button type="button" aria-label={t.prevMonth} disabled={view <= min} onClick={() => setView(shiftMonth(view, -1))}>
            <ChevronLeft />
          </button>
          <p aria-live="polite">
            {monthName(m - 1, lang)} {y}
          </p>
          <button type="button" aria-label={t.nextMonth} disabled={view >= max} onClick={() => setView(shiftMonth(view, 1))}>
            <ChevronRight />
          </button>
        </div>
        <Month lang={lang} view={view} />
        <p className="yp-cal-legend">
          <span className="yp-cal-key yp-cal-key--taken" aria-hidden="true" />
          {fill(t.takenLegend, { oda: ROOM[stay.room].name })}
          <span className="yp-cal-key yp-cal-key--stay" aria-hidden="true" />
          {t.stayLegend}
        </p>
        <div className="yp-sheet-steps">
          <div className="yp-dfield">
            <div className="yp-dval yp-dval--static">
              <small>{t.nights}</small>
              <strong>{stay.nights}</strong>
            </div>
            <div className="yp-step">
              <button type="button" aria-label={t.fewerNights} disabled={stay.nights <= 1} onClick={() => setStay({ nights: stay.nights - 1 })}>
                <Minus />
              </button>
              <button type="button" aria-label={t.moreNights} disabled={stay.nights >= MAX_NIGHTS} onClick={() => setStay({ nights: stay.nights + 1 })}>
                <Plus />
              </button>
            </div>
          </div>
          <div className="yp-dfield">
            <div className="yp-dval yp-dval--static">
              <small>{t.guests}</small>
              <strong>{stay.guests}</strong>
            </div>
            <div className="yp-step">
              <button type="button" aria-label={t.fewerGuests} disabled={stay.guests <= 1} onClick={() => setStay({ guests: stay.guests - 1 })}>
                <Minus />
              </button>
              <button type="button" aria-label={t.moreGuests} disabled={stay.guests >= MAX_GUESTS} onClick={() => setStay({ guests: stay.guests + 1 })}>
                <Plus />
              </button>
            </div>
          </div>
        </div>
        <p className="yp-dates-out">
          {t.checkOut}: <b>{fmtDay(addDays(stay.checkIn, stay.nights), lang)}</b>, {t.checkOutBy}
        </p>
        <button type="button" className="yp-btn yp-btn--accent yp-btn--block" onClick={() => setSheet(false)}>
          {t.done}
        </button>
      </div>
    </dialog>
  );
}
