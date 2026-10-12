"use client";

// Booking summary: the stay as chosen, a sample price breakdown, and the
// guest's details. On a real site this hands over to the hotel's booking
// engine; here nothing is sent anywhere.

import Link from "next/link";
import { useState } from "react";
import { freeRooms, nearestFree, stayFree } from "@/lib/yedipencere/availability";
import { MODES, MODE_IDS, type ModeId } from "@/lib/yedipencere/arrival";
import { addDays, fmtDay, fmtRange, type Lang } from "@/lib/yedipencere/dates";
import { fill, guests as guestsText, money, nights as nightsText, steps as stepsText } from "@/lib/yedipencere/format";
import { EXTRA_GUEST, ROOM } from "@/lib/yedipencere/house";
import { href } from "@/lib/yedipencere/paths";
import { priceOf, useStay } from "@/lib/yedipencere/store";
import { COPY } from "@/content/yedipencere/copy";
import { arrival as ARRIVAL } from "@/content/yedipencere/arrival";
import { rooms as ROOM_TEXT } from "@/content/yedipencere/rooms";
import { photoSrc } from "@/content/yedipencere/photos";

function Win({ room, taken }: { room: string; taken: boolean }) {
  return (
    <svg viewBox="0 0 110 130" aria-hidden="true">
      <defs>
        <clipPath id="yp-bw">
          <rect x="18" y="12" width="74" height="98" />
        </clipPath>
      </defs>
      <rect x="18" y="12" width="74" height="98" fill="#DCE5EA" />
      <image href={photoSrc(room as never, 220)} x="18" y="12" width="74" height="98" preserveAspectRatio="xMidYMid slice" clipPath="url(#yp-bw)" opacity={taken ? 0.42 : 1} />
      {taken && (
        <g>
          <rect x="18" y="12" width="37" height="98" fill="url(#yp-lamel)" stroke="#2A201B" strokeWidth="1" />
          <rect x="55" y="12" width="37" height="98" fill="url(#yp-lamel)" stroke="#2A201B" strokeWidth="1" />
        </g>
      )}
      <rect x="14" y="8" width="82" height="106" fill="none" stroke="#2A201B" strokeWidth="2" />
      <path d="M55 12V110M18 45H92" stroke="#FAFAF8" strokeWidth="2.6" />
      <path d="M55 12V110M18 45H92" stroke="#2A201B" strokeWidth="0.9" />
      <rect x="8" y="114" width="94" height="7" fill="#F7F8F7" stroke="#2A201B" strokeWidth="1.2" />
    </svg>
  );
}

export function BookingPage({ lang }: { lang: Lang }) {
  const { stay, setStay, setSheet, trip, setTrip, today } = useStay();
  const t = COPY[lang];
  const b = t.booking;
  const a = ARRIVAL[lang];
  const r = ROOM[stay.room];
  const text = ROOM_TEXT[lang][stay.room];
  const out = addDays(stay.checkIn, stay.nights);
  const taken = !stayFree(stay.room, stay.checkIn, stay.nights);
  const p = priceOf(stay);
  const tooMany = stay.guests > r.capacity;
  const others = taken || tooMany ? freeRooms(stay.checkIn, stay.nights).filter((id) => id !== stay.room && ROOM[id].capacity >= stay.guests) : [];
  const next = taken ? nearestFree(stay.room, stay.checkIn, stay.nights, today) : null;

  const [form, setForm] = useState({ name: "", email: "", phone: "", time: "", plate: "", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const field = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value })),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (form.name.trim().length < 2) err.name = b.errName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) err.email = b.errEmail;
    if (taken || tooMany) err.stay = b.errTaken;
    setErrors(err);
    if (Object.keys(err).length) {
      const first = document.getElementById(err.name ? "yp-f-name" : err.email ? "yp-f-email" : "yp-book-sum");
      first?.focus();
      return;
    }
    setDone(true);
  };

  return (
    <div className="yp-page">
      <header className="yp-page-head">
        <h1 className="yp-h1">{b.title}</h1>
        <p className="yp-lead">{b.lead}</p>
      </header>
      <div className="yp-book">
        <section className="yp-book-sum" id="yp-book-sum" tabIndex={-1} aria-labelledby="yp-sum-h">
          <h2 id="yp-sum-h" className="yp-h3">
            {b.stay}
          </h2>
          <div className="yp-book-room">
            <Win room={stay.room} taken={taken} />
            <div>
              <b>{r.name}</b>
              <span>{text.position}</span>
              <br />
              <span>{fill(t.card.roomValue, { m2: r.m2, yatak: text.bed })}</span>
            </div>
          </div>
          {(taken || tooMany) && (
            <div className="yp-book-warn" role="alert">
              {taken && <p>{fill(b.takenTitle, { oda: r.name })}</p>}
              {tooMany && !taken && <p>{fill(b.tooMany, { oda: r.name })}</p>}
              {others.length > 0 ? (
                <>
                  <p>{b.takenOther}</p>
                  <ul>
                    {others.map((id) => (
                      <li key={id}>
                        <button type="button" className="yp-btn yp-btn--sm" onClick={() => setStay({ room: id })}>
                          {fill(b.switchTo, { oda: ROOM[id].name })}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>{b.takenNone}</p>
              )}
              {next && (
                <p>
                  {fill(b.takenNearest, { oda: r.name, aralik: fmtRange(next, addDays(next, stay.nights), lang) })}{" "}
                  <button type="button" className="yp-btn yp-btn--sm" onClick={() => setStay({ checkIn: next })}>
                    {t.card.goThere}
                  </button>
                </p>
              )}
            </div>
          )}
          <dl>
            <div>
              <dt>{b.checkIn}</dt>
              <dd>
                {fmtDay(stay.checkIn, lang)}, {b.checkInAt}
              </dd>
            </div>
            <div>
              <dt>{b.checkOut}</dt>
              <dd>
                {fmtDay(out, lang)}, {b.checkOutAt}
              </dd>
            </div>
            <div>
              <dt>{b.nights}</dt>
              <dd>{nightsText(stay.nights, lang)}</dd>
            </div>
            <div>
              <dt>{b.guests}</dt>
              <dd>{guestsText(stay.guests, lang)}</dd>
            </div>
            <div>
              <dt>{b.fromDoor}</dt>
              <dd>{stepsText(r.steps, lang)}</dd>
            </div>
          </dl>
          <div className="yp-book-actions">
            <Link href={href(lang, "rooms")}>{b.changeRoom}</Link>
            <button type="button" onClick={() => setSheet(true)} aria-haspopup="dialog">
              {b.changeDates}
            </button>
          </div>
          <div className="yp-book-lines" aria-label={b.priceTitle}>
            <h3 className="yp-h4">{b.priceTitle}</h3>
            <div>
              <span>{fill(b.line, { gece: nightsText(stay.nights, lang), fiyat: money(r.price, lang) })}</span>
              <span>{money(p.rooms, lang)}</span>
            </div>
            {p.extras > 0 && (
              <div>
                <span>{fill(b.extra, { gece: nightsText(stay.nights, lang), fiyat: money(EXTRA_GUEST, lang) })}</span>
                <span>{money(p.extras, lang)}</span>
              </div>
            )}
            <div>
              <span>{b.breakfast}</span>
              <span>{b.included}</span>
            </div>
            <div>
              <span>{b.taxes}</span>
              <span>{b.taxesValue}</span>
            </div>
            <div className="yp-book-total">
              <span>
                {b.total} <span className="yp-tag">{t.sample}</span>
              </span>
              <b>{money(p.total, lang)}</b>
            </div>
          </div>
          <dl>
            <div>
              <dt>{b.cancel}</dt>
              <dd>{b.cancelValue}</dd>
            </div>
            <div>
              <dt>{b.payment}</dt>
              <dd>{b.paymentValue}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="yp-form-h">
          {done ? (
            <div className="yp-done" role="status">
              <h2>{b.doneTitle}</h2>
              <p>{b.doneBody}</p>
              <p>
                <b>{r.name}</b> · {fmtRange(stay.checkIn, out, lang)} · {guestsText(stay.guests, lang)} · {money(p.total, lang)} ({t.sample})
              </p>
              <div className="yp-dialog-act">
                <button type="button" className="yp-btn" onClick={() => window.print()}>
                  {b.print}
                </button>
                <Link href={href(lang, "arrival")} className="yp-btn yp-btn--accent">
                  {b.doneArrival}
                </Link>
                <button type="button" className="yp-btn yp-btn--line" onClick={() => setDone(false)}>
                  {b.edit}
                </button>
              </div>
            </div>
          ) : (
            <form className="yp-form" onSubmit={submit} noValidate>
              <h2 id="yp-form-h" className="yp-h3">
                {b.formTitle}
              </h2>
              <label className="yp-field" data-error={errors.name ? "" : undefined}>
                <span>
                  {b.name} <small>({b.required})</small>
                </span>
                <input id="yp-f-name" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? "yp-e-name" : undefined} {...field("name")} />
                {errors.name && (
                  <span className="yp-err" id="yp-e-name">
                    {errors.name}
                  </span>
                )}
              </label>
              <div className="yp-form-row">
                <label className="yp-field" data-error={errors.email ? "" : undefined}>
                  <span>
                    {b.email} <small>({b.required})</small>
                  </span>
                  <input id="yp-f-email" type="email" autoComplete="email" inputMode="email" required aria-invalid={!!errors.email} aria-describedby={errors.email ? "yp-e-email" : undefined} {...field("email")} />
                  {errors.email && (
                    <span className="yp-err" id="yp-e-email">
                      {errors.email}
                    </span>
                  )}
                </label>
                <label className="yp-field">
                  <span>{b.phone}</span>
                  <input type="tel" autoComplete="tel" inputMode="tel" {...field("phone")} />
                  <small>{b.phoneHint}</small>
                </label>
              </div>
              <div className="yp-form-row">
                <label className="yp-field">
                  <span>{b.arrivalTime}</span>
                  <select {...field("time")}>
                    <option value="">—</option>
                    {b.times.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <label className="yp-field">
                  <span>{b.arrivingBy}</span>
                  <select value={trip.mode} onChange={(e) => setTrip({ mode: e.target.value as ModeId, start: MODES[e.target.value as ModeId][0] })}>
                    {MODE_IDS.map((m) => (
                      <option key={m} value={m}>
                        {a.modes[m]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {trip.mode === "arac" && (
                <label className="yp-field">
                  <span>{b.plate}</span>
                  <input autoComplete="off" spellCheck={false} {...field("plate")} onChange={(e) => setForm((f) => ({ ...f, plate: e.target.value.toUpperCase() }))} />
                  <small>{b.plateHint}</small>
                </label>
              )}
              <label className="yp-field">
                <span>{b.note}</span>
                <textarea placeholder={b.notePlaceholder} {...field("note")} />
              </label>
              {errors.stay && (
                <p className="yp-err" role="alert">
                  {errors.stay}
                </p>
              )}
              <div className="yp-form-send">
                <button type="submit" className="yp-btn yp-btn--accent yp-btn--lg">
                  {b.submit}
                </button>
                <p className="yp-note">{b.notSent}</p>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
