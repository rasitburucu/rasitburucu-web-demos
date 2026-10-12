"use client";

// The chosen room, beside the drawing: its window large, the way up from the
// street door, what it sees, ceiling, night, size, a sample price and the
// one button. Taken on the chosen dates: shutters closed, the nearest free
// stretch offered.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { nearestFree, stayFree } from "@/lib/yedipencere/availability";
import { addDays, fmtRange, type Lang } from "@/lib/yedipencere/dates";
import { fill, money, nights as nightsText, steps as stepsText } from "@/lib/yedipencere/format";
import { ROOM } from "@/lib/yedipencere/house";
import { href } from "@/lib/yedipencere/paths";
import { priceOf, useStay } from "@/lib/yedipencere/store";
import { COPY } from "@/content/yedipencere/copy";
import { rooms as ROOM_TEXT } from "@/content/yedipencere/rooms";
import { StairPath } from "../draw/StairPath";
import { WindowDetail } from "../draw/WindowDetail";
import { PICK_EVENT } from "../draw/WindowLayer";
import { Arrow } from "../ui/icons";

export function bookingHref(lang: Lang, s: { room: string; checkIn: string; nights: number; guests: number }) {
  return `${href(lang, "booking")}?oda=${s.room}&giris=${s.checkIn}&gece=${s.nights}&kisi=${s.guests}`;
}

export function RoomCard({ lang }: { lang: Lang }) {
  const { stay, setStay, today, ready } = useStay();
  const t = COPY[lang];
  const room = ROOM[stay.room];
  const text = ROOM_TEXT[lang][stay.room];
  const taken = !stayFree(stay.room, stay.checkIn, stay.nights);
  const price = priceOf(stay);
  const next = taken ? nearestFree(stay.room, stay.checkIn, stay.nights, today) : null;
  const ref = useRef<HTMLElement>(null);

  // animate only after a visitor's choice, never on the first paint
  const first = useRef<string | null>(null);
  const [moved, setMoved] = useState(false);
  useEffect(() => {
    if (!ready) return;
    if (first.current === null) {
      first.current = stay.room;
      return;
    }
    if (stay.room !== first.current) setMoved(true);
  }, [stay.room, ready]);

  useEffect(() => {
    const onPick = () => {
      const el = ref.current;
      if (!el || window.innerWidth >= 900) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };
    window.addEventListener(PICK_EVENT, onPick);
    return () => window.removeEventListener(PICK_EVENT, onPick);
  }, []);

  const [live, setLive] = useState("");
  useEffect(() => {
    if (!moved) return;
    setLive(fill(t.card.selected, { oda: room.name, konum: text.position, basamak: stepsText(room.steps, lang), durum: taken ? t.card.stateTaken : t.card.stateFree }));
  }, [stay.room, moved, taken, room.name, room.steps, text.position, lang, t.card]);

  const tooMany = stay.guests > room.capacity;

  return (
    <aside className="yp-card" ref={ref} id="oda" aria-labelledby="yp-card-name" data-taken={taken || undefined}>
      <p className="yp-card-k">{t.card.through}</p>
      <div className="yp-card-win">
        <WindowDetail key={stay.room} room={stay.room} taken={taken} lang={lang} width={340} animate={moved} />
      </div>
      <h2 id="yp-card-name" className="yp-card-name">
        {room.name}
      </h2>
      <p className="yp-card-pos">{text.position}</p>
      {taken && (
        <div className="yp-card-full" role="status">
          <p>
            <b>{t.card.takenTitle}</b> {next ? fill(t.card.freeFrom, { aralik: fmtRange(next, addDays(next, stay.nights), lang) }) : t.card.noFree}
          </p>
          {next && (
            <button type="button" className="yp-btn yp-btn--sm" onClick={() => setStay({ checkIn: next })}>
              {t.card.goThere}
            </button>
          )}
        </div>
      )}
      <div className="yp-card-path">
        <StairPath key={stay.room} room={stay.room} lang={lang} animate={moved} />
      </div>
      <dl className="yp-facts">
        <div>
          <dt>{t.card.view}</dt>
          <dd>{text.view}</dd>
        </div>
        <div>
          <dt>{t.card.fromDoor}</dt>
          <dd>{stepsText(room.steps, lang)}</dd>
        </div>
        <div>
          <dt>{t.card.ceiling}</dt>
          <dd>{text.ceiling}</dd>
        </div>
        <div>
          <dt>{t.card.night}</dt>
          <dd>{text.night}</dd>
        </div>
        <div>
          <dt>{t.card.room}</dt>
          <dd>{fill(t.card.roomValue, { m2: room.m2, yatak: text.bed })}</dd>
        </div>
      </dl>
      {tooMany && <p className="yp-card-cap">{t.card.capacity}</p>}
      <div className="yp-price">
        <strong>{money(room.price, lang)}</strong>
        <span>
          {t.card.perNight}
          <br />
          {fill(t.card.total, { gece: nightsText(stay.nights, lang), tutar: money(price.total, lang) })}
        </span>
      </div>
      {taken || tooMany ? (
        <button type="button" className="yp-btn yp-btn--accent yp-btn--block" disabled>
          {t.card.reserve}
        </button>
      ) : (
        <Link href={bookingHref(lang, stay)} className="yp-btn yp-btn--accent yp-btn--block">
          {t.card.reserve}
        </Link>
      )}
      <Link href={href(lang, "room", stay.room)} className="yp-more">
        {t.card.more} <Arrow />
      </Link>
      <p className="yp-note">{t.card.live}</p>
      <p className="yp-sr" aria-live="polite">
        {live}
      </p>
    </aside>
  );
}
