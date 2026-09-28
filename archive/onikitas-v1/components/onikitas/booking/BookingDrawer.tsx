"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { tr } from "@/content/onikitas/tr";
import { villas, getVilla, typologies } from "@/content/onikitas/villas";
import { nextDays, formatDay, type DayOption } from "@/lib/onikitas/dates";
import { useSmoothScroll, type BookingPrefill, type Slot, type ViewingType } from "../shell/Shell";

// Front-end only. Nothing typed here leaves the browser tab: no fetch, no
// storage, no analytics. State is dropped when the drawer closes.

const TIMES: Record<ViewingType, string[]> = {
  onsite: ["10:00", "11:30", "14:00", "15:30", "17:00"],
  video: ["10:00", "12:00", "15:00", "17:00", "19:00"],
  phone: ["09:30", "11:00", "13:30", "16:00", "18:30"],
};
const DURATION: Record<ViewingType, number> = { onsite: 90, video: 45, phone: 20 };
const COUNTRY_CODES = ["+90", "+44", "+49", "+7", "+971", "+1", "+31", "+33", "+41", "+46"];

type Errors = Partial<Record<"name" | "email" | "phone" | "consent" | "slots", string>>;

export function BookingDrawer({ open, prefill, onClose }: { open: boolean; prefill: BookingPrefill; onClose: () => void }) {
  return <AnimatePresence>{open ? <Drawer key="drawer" prefill={prefill} onClose={onClose} /> : null}</AnimatePresence>;
}

function Drawer({ prefill, onClose }: { prefill: BookingPrefill; onClose: () => void }) {
  const b = tr.booking;
  const reduce = useReducedMotion();
  const uid = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const smooth = useSmoothScroll();

  const [step, setStep] = useState<0 | 1 | 2 | 3>(prefill.step ?? 0);
  const [type, setType] = useState<ViewingType>(prefill.type ?? "onsite");
  const [chosen, setChosen] = useState<string[]>((prefill.villas ?? []).filter((id) => getVilla(id)?.status !== "sold").slice(0, 3));
  const [days, setDays] = useState<DayOption[]>([]);
  const [day, setDay] = useState<string | null>(prefill.date ?? null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [lang, setLang] = useState("TR");
  const [tzNote, setTzNote] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cc, setCc] = useState("+90");
  const [phone, setPhone] = useState("");
  const [timing, setTiming] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  // mount: dates, timezone, focus, scroll lock
  useEffect(() => {
    const d = nextDays(7);
    setDays(d);
    setDay((cur) => (cur && d.some((x) => x.iso === cur) ? cur : d[0]?.iso ?? null));
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && tz !== "Europe/Istanbul") setTzNote(tz);
    } catch {
      /* ignore */
    }
    returnFocus.current = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    smooth.stop();
    const t = window.setTimeout(() => headingRef.current?.focus(), 60);
    return () => {
      window.clearTimeout(t);
      html.style.overflow = prevOverflow;
      smooth.start();
      returnFocus.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // focus trap + Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === headingRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // move focus to the step heading when the step changes
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  // ----- validation -----
  const errors: Errors = useMemo(() => {
    const e: Errors = {};
    if (name.trim().split(/\s+/).filter((w) => w.length > 1).length < 2) e.name = b.contact.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) e.email = b.contact.errors.email;
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15) e.phone = b.contact.errors.phone;
    if (!consent) e.consent = b.contact.errors.consent;
    if (slots.length === 0) e.slots = b.date.required;
    return e;
  }, [name, email, phone, consent, slots, b]);

  const show = (k: keyof Errors) => (submitted || touched[k] ? errors[k] : undefined);

  const toggleSlot = (time: string) => {
    if (!day) return;
    setSlots((s) => {
      const exists = s.find((x) => x.date === day && x.time === time);
      if (exists) return s.filter((x) => x !== exists);
      if (s.length >= 3) return s;
      return [...s, { date: day, time }];
    });
  };

  const next = () => {
    if (step === 1 && errors.slots) {
      setTouched((t) => ({ ...t, slots: true }));
      return;
    }
    setStep((s) => (s < 2 ? ((s + 1) as 1 | 2) : s));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const order: (keyof Errors)[] = ["name", "email", "phone", "consent"];
    const firstBad = order.find((k) => errors[k]);
    if (firstBad) {
      panelRef.current?.querySelector<HTMLElement>(`#${CSS.escape(`${uid}-${firstBad}`)}`)?.focus();
      return;
    }
    setStep(3);
  };

  const downloadIcs = useCallback(() => {
    const s = slots[0];
    if (!s) return;
    const [y, m, d] = s.date.split("-");
    const [hh, mm] = s.time.split(":").map(Number);
    const end = hh * 60 + mm + DURATION[type];
    const pad = (n: number) => String(n).padStart(2, "0");
    const start = `${y}${m}${d}T${pad(hh)}${pad(mm)}00`;
    const finish = `${y}${m}${d}T${pad(Math.floor(end / 60))}${pad(end % 60)}00`;
    const villaText = chosen.length ? chosen.map((id) => `N°${id}`).join(", ") : b.done.noVilla;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Onikitas konsept//TR",
      "BEGIN:VEVENT",
      `UID:${start}-onikitas-demo`,
      `DTSTAMP:${start}`,
      `DTSTART;TZID=Europe/Istanbul:${start}`,
      `DTEND;TZID=Europe/Istanbul:${finish}`,
      `SUMMARY:Onikitaş, ${b.type.options[type].label} (konsept)`,
      `DESCRIPTION:${villaText}. ${b.done.demo}`,
      "LOCATION:Yalıkavak, Bodrum",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "onikitas-ziyaret.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [slots, type, chosen, b]);

  const addable = villas.filter((v) => v.status !== "sold" && !chosen.includes(v.id));
  const stepTitle = step < 3 ? b.steps[step] : b.done.title;

  return (
    <div className="fixed inset-0 z-[70]" data-booking-open="true">
      <motion.div
        className="absolute inset-0 bg-olive/45"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        className="absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col bg-lime shadow-[-24px_0_60px_-30px_#3b3a2e99]"
        initial={reduce ? { opacity: 0 } : { x: "100%" }}
        animate={reduce ? { opacity: 1 } : { x: 0 }}
        exit={reduce ? { opacity: 0 } : { x: "100%" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <header className="flex items-start justify-between gap-4 border-b border-olive/15 px-5 pb-4 pt-5 sm:px-8">
          <div>
            <p id={`${uid}-title`} className="font-display text-[1.7rem] leading-none">
              {b.title}
            </p>
            {step < 3 ? (
              <div className="mt-3 flex items-center gap-3">
                <span className="label-mono text-olive-soft">{b.stepOf(step + 1, 3)}</span>
                <span aria-hidden className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className={`block h-[3px] w-8 ${i <= step ? "bg-olive" : "bg-olive/15"}`} />
                  ))}
                </span>
              </div>
            ) : null}
          </div>
          <button type="button" onClick={onClose} className="-mr-2 grid h-11 w-11 place-items-center" aria-label={b.close}>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <path d="M2 2 L16 16 M16 2 L2 16" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </header>

        <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8" data-lenis-prevent>
            <h2 ref={headingRef} tabIndex={-1} className="text-[2rem] leading-tight outline-none">
              {stepTitle}
            </h2>

            {step === 0 ? (
              <div className="mt-6 space-y-8">
                <fieldset>
                  <legend className="text-sm text-olive-soft">{b.type.legend}</legend>
                  <div className="mt-3 grid gap-2">
                    {(Object.keys(b.type.options) as ViewingType[]).map((k) => (
                      <label
                        key={k}
                        className={`flex cursor-pointer items-center justify-between gap-4 px-4 py-3.5 transition-colors ${
                          type === k ? "bg-olive text-lime" : "shadow-[inset_0_0_0_1px_#3b3a2e33] hover:shadow-[inset_0_0_0_1px_#3b3a2e]"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <input type="radio" name={`${uid}-type`} value={k} checked={type === k} onChange={() => setType(k)} className="h-4 w-4 accent-[#b5532c]" />
                          <span className="font-medium">{b.type.options[k].label}</span>
                        </span>
                        <span className={`text-sm ${type === k ? "text-lime/80" : "text-olive-soft"}`}>{b.type.options[k].detail}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-sm text-olive-soft">{b.villas.legend}</legend>
                  <p className="mt-1 text-[0.85rem] text-olive-soft">{b.villas.hint}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {chosen.length === 0 ? <li className="text-[0.92rem]">{b.villas.none}</li> : null}
                    {chosen.map((id) => {
                      const v = getVilla(id)!;
                      return (
                        <li key={id} className="flex items-center gap-2 bg-travertine/60 py-1.5 pl-3 pr-1">
                          <span className="label-mono">N°{id}</span>
                          <span>{v.name}</span>
                          <button
                            type="button"
                            className="grid h-8 w-8 place-items-center hover:text-tile-ink"
                            aria-label={b.villas.remove(id)}
                            onClick={() => setChosen((c) => c.filter((x) => x !== id))}
                          >
                            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                              <path d="M1 1 L9 9 M9 1 L1 9" stroke="currentColor" strokeWidth="1.3" />
                            </svg>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-3">
                    <label htmlFor={`${uid}-add`} className="sr-only">
                      {b.villas.add}
                    </label>
                    <select
                      id={`${uid}-add`}
                      className="field !w-auto min-w-[220px]"
                      value=""
                      disabled={chosen.length >= 3}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v) setChosen((c) => (c.length < 3 ? [...c, v] : c));
                      }}
                    >
                      <option value="">{chosen.length >= 3 ? b.villas.hint : b.villas.add}</option>
                      {addable.map((v) => (
                        <option key={v.id} value={v.id}>
                          N°{v.id} {v.name} · {typologies[v.type].name} {typologies[v.type].layout} · {tr.status[v.status]}
                        </option>
                      ))}
                    </select>
                  </div>
                </fieldset>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="mt-6 space-y-8">
                <p className="text-[0.92rem] text-olive-soft">{b.date.hint}</p>
                <fieldset>
                  <legend className="text-sm text-olive-soft">{b.date.legend}</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {days.map((d) => {
                      const count = slots.filter((s) => s.date === d.iso).length;
                      return (
                        <button
                          key={d.iso}
                          type="button"
                          aria-pressed={day === d.iso}
                          className="chip relative !flex-col !items-start !gap-0.5 !px-3 !py-2"
                          onClick={() => setDay(d.iso)}
                        >
                          <span className="text-[0.75rem] opacity-75">{d.weekday}</span>
                          <span className="label-mono !text-[0.9rem]">
                            {d.day} {d.month}
                          </span>
                          {count ? (
                            <span aria-hidden className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center bg-tile text-[0.65rem] text-paper">
                              {count}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset aria-describedby={`${uid}-slots-err`}>
                  <legend className="text-sm text-olive-soft">{b.date.times}</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {TIMES[type].map((t) => {
                      const on = !!slots.find((s) => s.date === day && s.time === t);
                      const full = slots.length >= 3 && !on;
                      return (
                        <button key={t} type="button" aria-pressed={on} disabled={full || !day} className="chip label-mono !text-[0.9rem]" onClick={() => toggleSlot(t)}>
                          {t}
                        </button>
                      );
                    })}
                  </div>
                  {slots.length >= 3 ? <p className="mt-2 text-[0.85rem] text-olive-soft">{b.date.max}</p> : null}
                  <p id={`${uid}-slots-err`} className="mt-2 text-[0.88rem] text-tile-ink" role="alert">
                    {touched.slots ? errors.slots : ""}
                  </p>
                </fieldset>

                <div aria-live="polite">
                  <p className="text-sm text-olive-soft">{b.date.picked(slots.length)}</p>
                  <ul className="mt-2 space-y-1.5">
                    {slots.map((s) => (
                      <li key={s.date + s.time} className="flex items-center justify-between gap-3 border-b border-olive/12 pb-1.5">
                        <span>
                          {formatDay(s.date)} <span className="label-mono">{s.time}</span>
                        </span>
                        <button type="button" className="text-sm underline underline-offset-4 hover:text-tile-ink" onClick={() => setSlots((x) => x.filter((y) => y !== s))}>
                          {b.date.remove}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <fieldset>
                  <legend className="text-sm text-olive-soft">{b.date.language}</legend>
                  <div className="mt-3 flex gap-2">
                    {b.languages.map((l) => (
                      <button key={l} type="button" aria-pressed={lang === l} className="chip label-mono !min-w-12 justify-center" onClick={() => setLang(l)}>
                        {l}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <p className="text-[0.85rem] text-olive-soft">
                  {b.date.tzNote} {tzNote ? b.date.tzLocal(tzNote) : null}
                </p>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="mt-6 space-y-5">
                <Field id={`${uid}-name`} label={b.contact.name} error={show("name")}>
                  <input
                    id={`${uid}-name`}
                    className="field"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    aria-invalid={!!show("name")}
                    aria-describedby={show("name") ? `${uid}-name-err` : undefined}
                  />
                </Field>
                <Field id={`${uid}-email`} label={b.contact.email} error={show("email")}>
                  <input
                    id={`${uid}-email`}
                    type="email"
                    inputMode="email"
                    className="field"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    aria-invalid={!!show("email")}
                    aria-describedby={show("email") ? `${uid}-email-err` : undefined}
                  />
                </Field>
                <Field id={`${uid}-phone`} label={b.contact.phone} error={show("phone")}>
                  <div className="flex gap-2">
                    <label htmlFor={`${uid}-cc`} className="sr-only">
                      {b.contact.country}
                    </label>
                    <select id={`${uid}-cc`} className="field !w-[6.5rem] shrink-0" value={cc} onChange={(e) => setCc(e.target.value)} autoComplete="tel-country-code">
                      {COUNTRY_CODES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <input
                      id={`${uid}-phone`}
                      type="tel"
                      inputMode="tel"
                      className="field"
                      autoComplete="tel-national"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                      aria-invalid={!!show("phone")}
                      aria-describedby={show("phone") ? `${uid}-phone-err` : undefined}
                    />
                  </div>
                </Field>

                <fieldset className="pt-2">
                  <legend className="text-sm">
                    {b.contact.timing} <span className="text-olive-soft">({b.contact.optional})</span>
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {b.contact.timingOptions.map((o) => (
                      <button key={o} type="button" aria-pressed={timing === o} className="chip" onClick={() => setTiming((t) => (t === o ? null : o))}>
                        {o}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="pt-2">
                  <label className="flex cursor-pointer items-start gap-3 text-[0.92rem]">
                    <input
                      id={`${uid}-consent`}
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        setTouched((t) => ({ ...t, consent: true }));
                      }}
                      className="mt-1 h-4 w-4 shrink-0 accent-[#b5532c]"
                      aria-invalid={!!show("consent")}
                      aria-describedby={show("consent") ? `${uid}-consent-err` : undefined}
                    />
                    <span>{b.contact.consent}</span>
                  </label>
                  {show("consent") ? (
                    <p id={`${uid}-consent-err`} className="mt-2 text-[0.88rem] text-tile-ink">
                      {show("consent")}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="mt-4 space-y-6">
                <p className="text-[1.02rem]">{b.done.body}</p>
                <div className="bg-lime-deep p-5 shadow-[inset_0_0_0_1px_#3b3a2e22]">
                  <p className="text-sm text-olive-soft">{b.done.summary}</p>
                  <dl className="mt-3 space-y-3 text-[0.95rem]">
                    <div>
                      <dt className="sr-only">{b.type.legend}</dt>
                      <dd className="font-medium">
                        {b.type.options[type].label}, {DURATION[type]} dk · {lang}
                      </dd>
                    </div>
                    <div>
                      <dt className="sr-only">{b.villas.legend}</dt>
                      <dd>{chosen.length ? chosen.map((id) => `N°${id} ${getVilla(id)?.name}`).join(", ") : b.done.noVilla}</dd>
                    </div>
                    <div>
                      <dt className="sr-only">{b.date.times}</dt>
                      <dd>
                        <ul className="space-y-1">
                          {slots.map((s) => (
                            <li key={s.date + s.time}>
                              {formatDay(s.date)} <span className="label-mono">{s.time}</span>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </div>
                <button type="button" className="btn-line" onClick={downloadIcs}>
                  {b.done.ics}
                </button>
                <p className="label-mono border-t border-olive/15 pt-4 text-olive-soft">{b.done.demo}</p>
              </div>
            ) : null}
          </div>

          <footer className="flex items-center justify-between gap-3 border-t border-olive/15 px-5 py-4 sm:px-8">
            {step > 0 && step < 3 ? (
              <button type="button" className="text-[0.95rem] underline underline-offset-4 hover:text-tile-ink" onClick={() => setStep((s) => (s - 1) as 0 | 1)}>
                {b.back}
              </button>
            ) : (
              <span />
            )}
            {step < 2 ? (
              <button type="button" className="btn-tile" onClick={next}>
                {b.next}
              </button>
            ) : step === 2 ? (
              <button type="submit" className="btn-tile">
                {b.submit}
              </button>
            ) : (
              <button type="button" className="btn-tile" onClick={onClose}>
                {b.done.close}
              </button>
            )}
          </footer>
        </form>
      </motion.div>
    </div>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-2 text-[0.88rem] text-tile-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
