"use client";

// Live parts of a room page: its window under the chosen dates, and the box
// that books it (dates, the next fourteen nights, price, one button).

import Link from "next/link";
import { useEffect } from "react";
import { nearestFree, stayFree, taken } from "@/lib/yedipencere/availability";
import { addDays, diffDays, fmtDate, fmtDay, fmtRange, type Lang } from "@/lib/yedipencere/dates";
import { fill, guests as guestsText, money, nights as nightsText } from "@/lib/yedipencere/format";
import { ROOM, type RoomId } from "@/lib/yedipencere/house";
import { priceOf, useStay } from "@/lib/yedipencere/store";
import { COPY } from "@/content/yedipencere/copy";
import { WindowDetail } from "../draw/WindowDetail";
import { bookingHref } from "../home/RoomCard";
import { Calendar } from "../ui/icons";

/** Viewing a room's page chooses that room. */
function useChoose(room: RoomId) {
  const { stay, setStay, ready } = useStay();
  useEffect(() => {
    if (ready && stay.room !== room) setStay({ room });
    // only when the page (room) or readiness changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, ready]);
}

/** The room's own page always shows its view; availability lives in the box beside it. */
export function RoomWindow({ room, lang }: { room: RoomId; lang: Lang }) {
  useChoose(room);
  return <WindowDetail room={room} taken={false} lang={lang} width={560} />;
}

export function RoomBuy({ room, lang }: { room: RoomId; lang: Lang }) {
  const { stay, setStay, setSheet, today } = useStay();
  const t = COPY[lang];
  const r = ROOM[room];
  const s = { ...stay, room };
  const isTaken = !stayFree(room, stay.checkIn, stay.nights);
  const next = isTaken ? nearestFree(room, stay.checkIn, stay.nights, today) : null;
  const p = priceOf(s);
  const tooMany = stay.guests > r.capacity;
  const start = diffDays(today, stay.checkIn) > 3 ? addDays(stay.checkIn, -3) : today;
  const nights14 = Array.from({ length: 14 }, (_, i) => addDays(start, i));
  return (
    <div className="yp-room-buy">
      <button type="button" className="yp-dates-chip yp-dates-chip--show" onClick={() => setSheet(true)} aria-haspopup="dialog">
        <Calendar />
        <span className="yp-chip-main">
          {fmtRange(stay.checkIn, addDays(stay.checkIn, stay.nights), lang)} · {nightsText(stay.nights, lang)} · {guestsText(stay.guests, lang)}
        </span>
        <span className="yp-chip-act">{t.dates.change}</span>
      </button>
      <div>
        <p className="yp-room-weeks-k">{t.room.weeks}</p>
        <div className="yp-room-weeks">
          {nights14.map((n) => {
            const isT = taken(room, n);
            const inStay = diffDays(stay.checkIn, n) >= 0 && diffDays(stay.checkIn, n) < stay.nights;
            return (
              <button
                key={n}
                type="button"
                className="yp-cell"
                data-taken={isT || undefined}
                data-stay={inStay || undefined}
                aria-disabled={isT || undefined}
                aria-label={fill(isT ? t.rooms.cellTaken : t.rooms.cellFree, { oda: r.name, tarih: fmtDay(n, lang) })}
                title={fmtDate(n, lang)}
                onClick={() => {
                  if (!isT) setStay({ checkIn: n, room });
                }}
              />
            );
          })}
        </div>
      </div>
      {isTaken && (
        <div className="yp-card-full" role="status">
          <p>
            <b>{t.card.takenTitle}</b> {next ? fill(t.card.freeFrom, { aralik: fmtRange(next, addDays(next, stay.nights), lang) }) : t.card.noFree}
          </p>
          {next && (
            <button type="button" className="yp-btn yp-btn--sm" onClick={() => setStay({ checkIn: next, room })}>
              {t.card.goThere}
            </button>
          )}
        </div>
      )}
      {tooMany && <p className="yp-card-cap">{t.card.capacity}</p>}
      <div className="yp-price">
        <strong>{money(r.price, lang)}</strong>
        <span>
          {t.card.perNight}
          <br />
          {fill(t.card.total, { gece: nightsText(stay.nights, lang), tutar: money(p.total, lang) })}
        </span>
      </div>
      {isTaken || tooMany ? (
        <button type="button" className="yp-btn yp-btn--accent yp-btn--block" disabled>
          {t.card.reserve}
        </button>
      ) : (
        <Link href={bookingHref(lang, s)} className="yp-btn yp-btn--accent yp-btn--block">
          {t.card.reserve}
        </Link>
      )}
      <p className="yp-note">{t.card.live}</p>
    </div>
  );
}
