"use client";

// Rooms page: the seven windows at one scale, and every room over two weeks.

import Link from "next/link";
import { useState } from "react";
import { stayFree, taken } from "@/lib/yedipencere/availability";
import { addDays, dayShort, diffDays, fmtDate, fmtDay, weekday, type Lang } from "@/lib/yedipencere/dates";
import { fill, money, steps as stepsText } from "@/lib/yedipencere/format";
import { BY_STEPS, ROOM, SIDES, type RoomId } from "@/lib/yedipencere/house";
import { href } from "@/lib/yedipencere/paths";
import { useStay } from "@/lib/yedipencere/store";
import { COPY } from "@/content/yedipencere/copy";
import { rooms as ROOM_TEXT } from "@/content/yedipencere/rooms";
import { WindowDetail } from "../draw/WindowDetail";
import { ChevronLeft, ChevronRight } from "../ui/icons";

const SIDE_WORD: Record<Lang, Record<string, string>> = {
  tr: { sokak: "sokak", avlu: "avlu", deniz: "deniz" },
  en: { sokak: "lane", avlu: "courtyard", deniz: "sea" },
};

function WindowCard({ id, lang }: { id: RoomId; lang: Lang }) {
  const { stay } = useStay();
  const r = ROOM[id];
  const isTaken = !stayFree(id, stay.checkIn, stay.nights);
  const wide = r.window === "cumba" || r.window === "band";
  return (
    <Link href={href(lang, "room", id)} className="yp-wcard" aria-label={`${r.name}: ${ROOM_TEXT[lang][id].view}, ${stepsText(r.steps, lang)}`}>
      <WindowDetail room={id} taken={isTaken} lang={lang} width={wide ? 300 : 200} />
      <span className="yp-wcard-name">{r.name}</span>
      <span className="yp-wcard-meta">
        {stepsText(r.steps, lang)} · {SIDE_WORD[lang][r.side]}
      </span>
      <span className="yp-wcard-price">
        {money(r.price, lang)} <span className="yp-muted">/ {COPY[lang].rooms.perNight}</span>
        {isTaken && <span className="yp-tag">{COPY[lang].drawing.taken}</span>}
      </span>
    </Link>
  );
}

export function WindowSheet({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  return (
    <div className="yp-wsheet">
      <div className="yp-wsheet-sides">
        {SIDES.map((s) => (
          <section key={s.id} className={`yp-wsheet-side yp-wsheet-side--${s.id}`} aria-label={t.sides[s.id]}>
            <h3>{t.elevations[s.id]}</h3>
            <div className="yp-wsheet-row">
              {s.rooms.map((id) => (
                <WindowCard key={id} id={id} lang={lang} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export function TwoWeeks({ lang }: { lang: Lang }) {
  const { stay, setStay, today } = useStay();
  const t = COPY[lang];
  // the table opens on the week of the chosen check-in (Monday first), never before today
  const monday = addDays(stay.checkIn, -((weekday(stay.checkIn) + 6) % 7));
  const [offset, setOffset] = useState(0);
  let start = addDays(monday, offset);
  if (diffDays(today, start) < 0) start = today;
  const nights = Array.from({ length: 14 }, (_, i) => addDays(start, i));
  const canPrev = diffDays(today, start) > 0;
  return (
    <div>
      <div className="yp-grid-tools">
        <div className="yp-grid-legend" aria-hidden="true">
          <span>
            <i className="yp-cellkey" /> {t.rooms.legendFree}
          </span>
          <span>
            <i className="yp-cellkey yp-cellkey--taken" /> {t.rooms.legendTaken}
          </span>
          <span>
            <i className="yp-cellkey yp-cellkey--stay" /> {t.rooms.legendStay}
          </span>
        </div>
        <div className="yp-step">
          <button type="button" aria-label={t.rooms.prev} disabled={!canPrev} onClick={() => setOffset((o) => o - 14)}>
            <ChevronLeft />
          </button>
          <button type="button" aria-label={t.rooms.next} disabled={diffDays(today, start) > 330} onClick={() => setOffset((o) => o + 14)}>
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="yp-grid-scroll" tabIndex={0} aria-label={t.rooms.gridTitle}>
        <table className="yp-grid">
          <caption className="yp-sr">
            {t.rooms.gridTitle}: {fmtDate(nights[0], lang)} – {fmtDate(nights[13], lang)}
          </caption>
          <thead>
            <tr>
              <th scope="col">
                <span className="yp-sr">{t.card.room}</span>
              </th>
              {nights.map((n) => (
                <th key={n} scope="col" data-weekend={weekday(n) === 5 || weekday(n) === 6 || undefined}>
                  {dayShort(n, lang)}
                  <small>{Number(n.slice(8))}</small>
                </th>
              ))}
              <th scope="col">
                <span className="yp-sr">{t.card.perNight}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {BY_STEPS.map((id) => {
              const r = ROOM[id];
              return (
                <tr key={id}>
                  <th scope="row">
                    <Link href={href(lang, "room", id)}>{r.name}</Link>
                    <small>{fill(t.rooms.rowMeta, { basamak: stepsText(r.steps, lang), yon: SIDE_WORD[lang][r.side] })}</small>
                  </th>
                  {nights.map((n) => {
                    const isTaken = taken(id, n);
                    const inStay = id === stay.room && diffDays(stay.checkIn, n) >= 0 && diffDays(stay.checkIn, n) < stay.nights;
                    const label = fill(isTaken ? t.rooms.cellTaken : t.rooms.cellFree, { oda: r.name, tarih: fmtDay(n, lang) });
                    return (
                      <td key={n}>
                        <button
                          type="button"
                          className="yp-cell"
                          data-taken={isTaken || undefined}
                          data-stay={inStay || undefined}
                          aria-label={label}
                          aria-disabled={isTaken || undefined}
                          onClick={() => {
                            if (!isTaken) setStay({ room: id, checkIn: n });
                          }}
                        />
                      </td>
                    );
                  })}
                  <td className="yp-grid-price">{money(r.price, lang)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
