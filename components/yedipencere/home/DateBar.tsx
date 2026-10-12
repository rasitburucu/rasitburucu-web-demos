"use client";

// Check-in, nights and guests: the usual pattern, kept within reach. Wide
// screens step days with arrows and open the calendar on the date; phones get
// one line that opens the date sheet.

import { addDays, diffDays, fmtDate, fmtDay, type Lang } from "@/lib/yedipencere/dates";
import { fill, guests as guestsText, nights as nightsText } from "@/lib/yedipencere/format";
import { MAX_GUESTS, MAX_NIGHTS } from "@/lib/yedipencere/house";
import { useStay } from "@/lib/yedipencere/store";
import { COPY } from "@/content/yedipencere/copy";
import { Calendar, ChevronLeft, ChevronRight, Minus, Plus } from "../ui/icons";

export function DateBar({ lang }: { lang: Lang }) {
  const { stay, setStay, today, setSheet } = useStay();
  const t = COPY[lang].dates;
  const out = addDays(stay.checkIn, stay.nights);
  const canPrev = diffDays(today, stay.checkIn) >= 1;
  const canNext = diffDays(today, stay.checkIn) < 365;

  return (
    <div className="yp-dates">
      <div className="yp-dates-bar" role="group" aria-label={t.sheetTitle}>
        <div className="yp-dfield yp-dfield--date">
          <button type="button" className="yp-dval" onClick={() => setSheet(true)} aria-haspopup="dialog" aria-label={`${t.checkIn}: ${fmtDay(stay.checkIn, lang)}. ${t.openCalendar}`}>
            <small>{t.checkIn}</small>
            <strong>
              {fmtDay(stay.checkIn, lang)}
              <Calendar className="yp-dval-ico" />
            </strong>
          </button>
          <div className="yp-step">
            <button type="button" aria-label={t.prevDay} disabled={!canPrev} onClick={() => setStay({ checkIn: addDays(stay.checkIn, -1) })}>
              <ChevronLeft />
            </button>
            <button type="button" aria-label={t.nextDay} disabled={!canNext} onClick={() => setStay({ checkIn: addDays(stay.checkIn, 1) })}>
              <ChevronRight />
            </button>
          </div>
        </div>
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
        {t.checkOut}: <b>{fmtDay(out, lang)}</b>, {t.checkOutBy} · {t.checkInAfter}
      </p>
      <button type="button" className="yp-dates-chip" onClick={() => setSheet(true)} aria-haspopup="dialog">
        <Calendar />
        <span className="yp-chip-main">{fill(t.summary, { giris: `${fmtDate(stay.checkIn, lang)} – ${fmtDate(out, lang)}`, gece: nightsText(stay.nights, lang), kisi: guestsText(stay.guests, lang) })}</span>
        <span className="yp-chip-act">{t.change}</span>
      </button>
    </div>
  );
}
