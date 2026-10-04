"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import { tr, villas } from "@/content/onikitas/tr";
import { lenisOf } from "@/lib/onikitas/goto";

// The visit request behind "Bu ışıkta ziyaret iste": a native modal <dialog>
// (the browser makes the page behind it inert, Esc closes it), a 30-day
// calendar, name, phone or e-mail, party size. Concept only: nothing leaves
// this tab, there is no network request; the data lives in React state.

const DAYS = 30;
const MAX_PEOPLE = 6;
const v = tr.visit;

type Fields = { day: string; name: string; phone: string; email: string; people: number };
type Errors = Partial<Record<"day" | "name" | "contact" | "phone" | "email", string>>;
const EMPTY: Fields = { day: "", name: "", phone: "", email: "", people: 2 };

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fromIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const longDay = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" });
const monthShort = new Intl.DateTimeFormat("tr-TR", { month: "short" });
const monthLong = new Intl.DateTimeFormat("tr-TR", { month: "long" });

/** Tomorrow through 30 days out, local time. */
function upcoming() {
  const out: Date[] = [];
  const now = new Date();
  for (let i = 1; i <= DAYS; i++) out.push(new Date(now.getFullYear(), now.getMonth(), now.getDate() + i));
  return out;
}

const digits = (s: string) => s.replace(/\D/g, "").length;
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.day) e.day = v.errDate;
  if (f.name.trim().length < 2) e.name = v.errName;
  const phone = f.phone.trim();
  const email = f.email.trim();
  if (!phone && !email) e.contact = v.errContact;
  if (phone && (digits(phone) < 10 || digits(phone) > 15 || /[^\d\s+()-]/.test(phone))) e.phone = v.errPhone;
  if (email && !EMAIL.test(email)) e.email = v.errEmail;
  return e;
}

export function VisitDialog({
  open,
  onClose,
  villa,
  time,
  returnFocus,
}: {
  open: boolean;
  onClose: () => void;
  villa: number;
  time: string;
  returnFocus: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const doneHead = useRef<HTMLHeadingElement>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [f, setF] = useState<Fields>(EMPTY);
  const [err, setErr] = useState<Errors>({});
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState<Fields | null>(null);
  const doneRef = useRef(false);
  const downOnBackdrop = useRef(false);
  const id = useId();
  const ids = {
    title: `${id}-title`,
    day: `${id}-day`,
    dayErr: `${id}-day-err`,
    name: `${id}-name`,
    nameErr: `${id}-name-err`,
    contactHint: `${id}-contact-hint`,
    contactErr: `${id}-contact-err`,
    phone: `${id}-phone`,
    phoneErr: `${id}-phone-err`,
    email: `${id}-email`,
    emailErr: `${id}-email-err`,
  };

  // portal into the demo root: keeps the fonts and tokens, escapes the dial
  // panel's visibility and transforms
  useEffect(() => setHost(document.querySelector<HTMLElement>(".oki-root") ?? document.body), []);

  // the calendar is computed when the dialog opens (client clock, no SSR)
  const days = useMemo(() => (open ? upcoming() : []), [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      lenisOf()?.stop();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open, host]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onDialogClose = () => {
      lenisOf()?.start();
      // a finished request starts fresh next time; an unfinished one is kept
      if (doneRef.current) {
        setF(EMPTY);
        setErr({});
        setTried(false);
      }
      setDone(null);
      onClose();
      const back = returnFocus.current;
      if (back) requestAnimationFrame(() => back.focus({ preventScroll: true }));
    };
    d.addEventListener("close", onDialogClose);
    return () => d.removeEventListener("close", onDialogClose);
  }, [host, onClose, returnFocus]);

  useEffect(() => {
    doneRef.current = done !== null;
    if (done) doneHead.current?.focus();
  }, [done]);

  const set = <K extends keyof Fields>(k: K, val: Fields[K]) => {
    const next = { ...f, [k]: val };
    setF(next);
    if (tried) setErr(validate(next));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    const found = validate(f);
    setErr(found);
    const d = ref.current;
    if (!d) return;
    const first = found.day
      ? d.querySelector<HTMLElement>("input[name='oki-day']")
      : found.name
        ? document.getElementById(ids.name)
        : found.contact || found.phone
          ? document.getElementById(ids.phone)
          : found.email
            ? document.getElementById(ids.email)
            : null;
    if (first) {
      first.focus();
      return;
    }
    setDone({ ...f, name: f.name.trim(), phone: f.phone.trim(), email: f.email.trim() });
  };

  const close = () => ref.current?.close();

  if (!host) return null;

  const house = villas[villa];
  const note = house.status === "satista" ? null : v.statusNote[house.status];
  const lead = days[0] ? (days[0].getDay() + 6) % 7 : 0;
  const months = Array.from(new Set(days.map((d) => monthLong.format(d))));

  return createPortal(
    <dialog
      ref={ref}
      className="oki-visit-dialog"
      aria-labelledby={ids.title}
      data-lenis-prevent
      onPointerDown={(e) => {
        downOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        // a click on the backdrop (the dialog box itself, outside the sheet)
        // closes; a drag that started inside the sheet does not
        if (e.target === e.currentTarget && downOnBackdrop.current) close();
      }}
    >
      <div className="oki-sheet">
        <button type="button" className="oki-sheet__close" onClick={close} aria-label={v.close}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </svg>
        </button>

        {done ? (
          <div className="oki-sheet__done">
            <h2 id={ids.title} ref={doneHead} tabIndex={-1} className="oki-sheet__title">
              {v.done.title}
            </h2>
            <p className="oki-sheet__lead">{v.done.body}</p>
            <dl className="oki-sheet__receipt">
              <div>
                <dt>{v.done.rows.villa}</dt>
                <dd>
                  {tr.dial.villaPrefix} {house.no}, {house.facing.toLocaleLowerCase("tr-TR")}
                </dd>
              </div>
              <div>
                <dt>{v.done.rows.light}</dt>
                <dd>{v.lightAt(time)}</dd>
              </div>
              <div>
                <dt>{v.done.rows.date}</dt>
                <dd>{longDay.format(fromIso(done.day))}</dd>
              </div>
              <div>
                <dt>{v.done.rows.people}</dt>
                <dd>{v.peopleCount(done.people)}</dd>
              </div>
              <div>
                <dt>{v.done.rows.name}</dt>
                <dd>{done.name}</dd>
              </div>
              <div>
                <dt>{v.done.rows.contact}</dt>
                <dd>{[done.phone, done.email].filter(Boolean).join(" · ")}</dd>
              </div>
            </dl>
            <p className="oki-sheet__notsent">{v.done.notSent}</p>
            <div className="oki-sheet__actions">
              <button type="button" className="oki-cta" onClick={close}>
                {v.done.ok}
              </button>
            </div>
          </div>
        ) : (
          <form className="oki-sheet__form" noValidate onSubmit={submit}>
            <h2 id={ids.title} className="oki-sheet__title">
              {v.title}
            </h2>
            <p className="oki-sheet__lead">{v.lead}</p>

            <div className="oki-sheet__summary">
              <p className="oki-sheet__kicker">{v.summary}</p>
              <p className="oki-sheet__pick">
                <span className="oki-sheet__villa">
                  {tr.dial.villaPrefix} {house.no}
                </span>
                <span>
                  {house.facing}. {v.lightAt(time)}.
                </span>
              </p>
              {note ? <p className="oki-sheet__note">{note}</p> : null}
            </div>

            <fieldset className="oki-field oki-days-pick" data-invalid={err.day ? "true" : undefined} aria-describedby={err.day ? ids.dayErr : undefined}>
              <legend>
                {v.date} <span className="oki-field__hint">{v.dateHint}</span>
              </legend>
              <p className="oki-days-pick__months" aria-hidden="true">
                {months.join(" – ")}
              </p>
              <div className="oki-days-pick__grid">
                {v.weekdays.map((w) => (
                  <span key={w} className="oki-days-pick__wd" aria-hidden="true">
                    {w}
                  </span>
                ))}
                {days.map((d, i) => {
                  const value = iso(d);
                  const first = d.getDate() === 1;
                  return (
                    <label
                      key={value}
                      className="oki-day"
                      style={i === 0 ? { gridColumnStart: lead + 1 } : undefined}
                      data-weekend={d.getDay() === 0 || d.getDay() === 6 ? "true" : undefined}
                    >
                      <input
                        type="radio"
                        name="oki-day"
                        value={value}
                        checked={f.day === value}
                        onChange={() => set("day", value)}
                        aria-describedby={err.day ? ids.dayErr : undefined}
                      />
                      <span aria-hidden="true" className="oki-day__n">
                        {d.getDate()}
                        {first ? <small>{monthShort.format(d)}</small> : null}
                      </span>
                      <span className="sr-only">{longDay.format(d)}</span>
                    </label>
                  );
                })}
              </div>
              {err.day ? (
                <p id={ids.dayErr} className="oki-err">
                  {err.day}
                </p>
              ) : null}
            </fieldset>

            <div className="oki-field">
              <label htmlFor={ids.name}>{v.name}</label>
              <input
                id={ids.name}
                type="text"
                autoComplete="name"
                value={f.name}
                onChange={(e) => set("name", e.target.value)}
                aria-invalid={err.name ? true : undefined}
                aria-describedby={err.name ? ids.nameErr : undefined}
              />
              {err.name ? (
                <p id={ids.nameErr} className="oki-err">
                  {err.name}
                </p>
              ) : null}
            </div>

            <fieldset className="oki-field oki-contact">
              <legend>{v.contact}</legend>
              <p id={ids.contactHint} className="oki-field__hint">
                {v.contactHint}
              </p>
              <div className="oki-contact__row">
                <div>
                  <label htmlFor={ids.phone}>{v.phone}</label>
                  <input
                    id={ids.phone}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={f.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    aria-invalid={err.phone || err.contact ? true : undefined}
                    aria-describedby={[ids.contactHint, err.contact ? ids.contactErr : "", err.phone ? ids.phoneErr : ""].filter(Boolean).join(" ")}
                  />
                  {err.phone ? (
                    <p id={ids.phoneErr} className="oki-err">
                      {err.phone}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor={ids.email}>{v.email}</label>
                  <input
                    id={ids.email}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    spellCheck={false}
                    value={f.email}
                    onChange={(e) => set("email", e.target.value)}
                    aria-invalid={err.email || err.contact ? true : undefined}
                    aria-describedby={[ids.contactHint, err.contact ? ids.contactErr : "", err.email ? ids.emailErr : ""].filter(Boolean).join(" ")}
                  />
                  {err.email ? (
                    <p id={ids.emailErr} className="oki-err">
                      {err.email}
                    </p>
                  ) : null}
                </div>
              </div>
              {err.contact ? (
                <p id={ids.contactErr} className="oki-err">
                  {err.contact}
                </p>
              ) : null}
            </fieldset>

            <fieldset className="oki-field oki-people">
              <legend>{v.people}</legend>
              <div className="oki-people__row">
                {Array.from({ length: MAX_PEOPLE }, (_, i) => i + 1).map((n) => (
                  <label key={n} className="oki-people__opt">
                    <input type="radio" name="oki-people" value={n} checked={f.people === n} onChange={() => set("people", n)} />
                    <span aria-hidden="true">{n}</span>
                    <span className="sr-only">{v.peopleCount(n)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <p className="oki-sheet__privacy">{v.privacy}</p>
            <div className="oki-sheet__actions">
              <button type="submit" className="oki-cta">
                {v.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>,
    host,
  );
}
