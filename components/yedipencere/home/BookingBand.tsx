"use client";

// The last band of the home page: the stay as chosen above, one button.

import Link from "next/link";
import { stayFree } from "@/lib/yedipencere/availability";
import { addDays, fmtRange, type Lang } from "@/lib/yedipencere/dates";
import { fill, guests, money, nights } from "@/lib/yedipencere/format";
import { ROOM } from "@/lib/yedipencere/house";
import { priceOf, useStay } from "@/lib/yedipencere/store";
import { COPY } from "@/content/yedipencere/copy";
import { photoSrc, PHOTOS } from "@/content/yedipencere/photos";
import { bookingHref } from "./RoomCard";
import { Arrow } from "../ui/icons";

export function BookingBand({ lang }: { lang: Lang }) {
  const { stay } = useStay();
  const t = COPY[lang];
  const room = ROOM[stay.room];
  const taken = !stayFree(stay.room, stay.checkIn, stay.nights);
  const p = priceOf(stay);
  return (
    <section className="yp-band" aria-labelledby="yp-band-h">
      <div className="yp-wrap yp-band-in">
        <div className="yp-band-win" aria-hidden="true">
          <svg viewBox="0 0 120 150">
            <defs>
              <clipPath id="yp-band-cp">
                <rect x="20" y="16" width="80" height="112" />
              </clipPath>
            </defs>
            <rect x="20" y="16" width="80" height="112" fill="#DCE5EA" />
            <image href={photoSrc(stay.room, 240)} x="20" y="16" width="80" height="112" preserveAspectRatio="xMidYMid slice" clipPath="url(#yp-band-cp)" opacity={taken ? 0.42 : 1} />
            <rect x="15" y="11" width="90" height="122" fill="none" stroke="#2A201B" strokeWidth="2" />
            <path d="M60 16V128M20 54H100" stroke="#FAFAF8" strokeWidth="3" />
            <path d="M60 16V128M20 54H100" stroke="#2A201B" strokeWidth="1" />
            <rect x="10" y="132" width="100" height="7" fill="#F7F8F7" stroke="#2A201B" strokeWidth="1.2" />
          </svg>
          <span className="yp-sr">{PHOTOS[stay.room].alt[lang]}</span>
        </div>
        <div className="yp-band-text">
          <h2 id="yp-band-h">{fill(t.band.title, { oda: room.name, aralik: fmtRange(stay.checkIn, addDays(stay.checkIn, stay.nights), lang) })}</h2>
          <p>{taken ? fill(t.band.taken, { oda: room.name }) : fill(t.band.sub, { gece: nights(stay.nights, lang), kisi: guests(stay.guests, lang), tutar: money(p.total, lang) })}</p>
        </div>
        <Link href={bookingHref(lang, stay)} className="yp-btn yp-btn--accent yp-btn--lg">
          {t.band.button} <Arrow />
        </Link>
      </div>
    </section>
  );
}
