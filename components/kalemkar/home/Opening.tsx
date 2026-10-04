"use client";

import { tr } from "@/content/kalemkar/tr";
import { countdown, nextOpening } from "@/lib/kalemkar/availability";
import { MONTHS, MONTHS_LOC } from "@/lib/kalemkar/format";
import { useNow } from "@/lib/kalemkar/store";

const o = tr.opening;

/** "Aralık sofrası 1'inde açılıyor" with a countdown to the next 1st, 10.00. */
export function Opening() {
  const now = useNow(30_000);
  const info = now ? nextOpening(now) : null;
  const month = info ? MONTHS[info.lockedMonth] : "";
  const left = info && now ? countdown(info.at, now) : null;
  const openDay = info ? `1 ${MONTHS[info.openOn.m]}` : "";
  const mail = `mailto:${tr.contact.email}?subject=${encodeURIComponent(o.notifySubject(month))}&body=${encodeURIComponent(o.notifyBody)}`;

  return (
    <div className="kk-open">
      <div>
        <h2 id="kk-open-title" className="kk-h2">
          {info ? o.title(month, `1 ${MONTHS_LOC[info.openOn.m]}`) : o.body}
        </h2>
        <p className="kk-lede">{o.body}</p>
      </div>
      <div className="kk-open-side">
        {left && (
          <p className="kk-count" aria-live="off">
            <span className="kk-count-label">
              {o.left} ({openDay}, 10.00)
            </span>
            <span className="kk-count-row">
              <b>{left.days}</b> {o.units.days} <b>{left.hours}</b> {o.units.hours} <b>{left.minutes}</b> {o.units.minutes}
            </span>
          </p>
        )}
        <a className="kk-btn kk-btn--line" href={mail}>
          {o.notify}
        </a>
      </div>
    </div>
  );
}
