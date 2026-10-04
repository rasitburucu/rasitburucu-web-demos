"use client";

/**
 * Rezervasyon: six steps that set up one evening, with the sini as the live
 * summary (signature moment 2). Choices that are not personal are kept in
 * sessionStorage; names, phone, e-mail and diet notes stay in memory only.
 * Nothing is sent: the flow ends with an .ics file and a pre-filled e-mail.
 */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { tr } from "@/content/kalemkar/tr";
import { MENUS, PAIRING_PRICE, DEPOSIT } from "@/content/kalemkar/menu";
import {
  calendar,
  nearestOpen,
  slotsFor,
  hoursUntil,
  antepInstant,
  nextOpening,
  type Deneyim,
  type MenuKey,
  type DayStatus,
} from "@/lib/kalemkar/availability";
import { dayLong, dayChip, MONTHS, phoneOk, emailOk, tl } from "@/lib/kalemkar/format";
import { useBooking, useNow, readParam, type Guest } from "@/lib/kalemkar/store";
import { downloadIcs } from "@/lib/kalemkar/ics";
import { Sini } from "../sini/Sini";
import { Calendar } from "./Calendar";
import { Waitlist } from "./Waitlist";
import { Check, ChipRadio, Note, PhoneField, Price, TextField } from "./kit";

const f = tr.flow;
const DONE_KEY = "kalemkar:tamam";
const TOTAL = 6;
const MINUTES: Record<MenuKey, number> = { sofra: 180, kisa: 120, tezgah: 210 };

const reduced = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Flow() {
  const { booking: b, update, reset, ready } = useBooking();
  const now = useNow();
  const [step, setStep] = useState(1);
  const [branch, setBranch] = useState<null | "waitlist">(null);
  const [cleared, setCleared] = useState("");
  const [payOpen, setPayOpen] = useState(false);
  const [forced, setForced] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [agree, setAgree] = useState(false);
  const [lost, setLost] = useState<string | null>(null);
  const [plusMode, setPlusMode] = useState(false);
  const headRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const lastStep = useRef(1);

  // Query parameters from the floor plan (?deneyim=) and a lost confirmation.
  useEffect(() => {
    if (!ready) return;
    const d = readParam("deneyim");
    if (d === "salon" || d === "tezgah" || d === "ozel") {
      update({ deneyim: d, menu: d === "tezgah" ? "tezgah" : b.menu === "tezgah" ? "sofra" : b.menu, kisi: d === "tezgah" ? Math.min(b.kisi, 4) : d === "ozel" ? Math.max(8, b.kisi) : b.kisi });
    }
    try {
      const code = sessionStorage.getItem(DONE_KEY);
      if (code) setLost(code);
    } catch {
      /* ignore */
    }
    // run once when the store is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Move focus to the step heading on every step change (not on first load),
  // and bring the new step in from the side it lies on: forward from the
  // right, back from the left, children 30 ms apart. Reduced motion: a fade.
  useEffect(() => {
    const dir = step >= lastStep.current ? 1 : -1;
    lastStep.current = step;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headRef.current?.focus({ preventScroll: true });
    const calm = reduced();
    window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
    const kids = Array.from(bodyRef.current?.children ?? []).slice(0, 8) as HTMLElement[];
    kids.forEach((el, i) =>
      el.animate(
        calm
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: `translateX(${dir * 12}px)` },
              { opacity: 1, transform: "none" },
            ],
        { duration: calm ? 120 : 380, delay: calm ? 0 : i * 30, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" },
      ),
    );
  }, [step, branch]);

  const isPlus = b.kisi > 6 || plusMode;
  const goPrivate = b.deneyim === "ozel" || b.kisi > 6;
  const months = useMemo(() => (now ? calendar(now, b.deneyim, b.kisi, b.menu) : []), [now, b.deneyim, b.kisi, b.menu]);
  const dayInfo = useMemo(() => {
    if (!b.tarih) return null;
    for (const m of months) for (const d of m.days) if (d.iso === b.tarih) return d;
    return null;
  }, [months, b.tarih]);
  const slots = useMemo(() => (now && b.tarih ? slotsFor(b.tarih, b.deneyim, b.kisi, b.menu, now) : []), [now, b.tarih, b.deneyim, b.kisi, b.menu]);
  const nearest = useMemo(() => (now ? nearestOpen(now, b.deneyim, b.kisi, b.menu, 3, b.tarih) : []), [now, b.deneyim, b.kisi, b.menu, b.tarih]);
  const lockInfo = now ? nextOpening(now) : null;
  const lockedLabel = lockInfo ? f.date.locked(`1 ${MONTHS[lockInfo.openOn.m]}`) : f.date.monthLocked;

  // A chosen time that no longer fits (menu, party size, experience) is removed
  // with an explicit message, never silently.
  useEffect(() => {
    if (!b.saat || !slots.length) return;
    const s = slots.find((x) => x.time === b.saat);
    if (!s || !s.ok) {
      setCleared(f.time.cleared(b.saat));
      update({ saat: undefined });
    }
  }, [slots, b.saat, update]);
  // A chosen evening that is no longer bookable is kept but flagged in step 2.

  const menu = MENUS[b.menu];
  const perPerson = menu.price + (b.eslesme ? PAIRING_PRICE : 0);
  const total = perPerson * b.kisi;
  const deposit = DEPOSIT * b.kisi;
  const notesCount = b.misafirler.filter((g) => g.notlar.length || g.diger.trim()).length;
  const marks = b.misafirler.map((g) => g.notlar.length > 0 || !!g.diger.trim());

  // Phones: the summary sini is a 112 px thumbnail. When the table changes
  // (party size, room, an allergy mark) it grows to 180 px for two seconds so
  // the covers can be read, then settles back.
  const [peek, setPeek] = useState(false);
  const peekKey = `${b.deneyim}:${Math.min(b.kisi, 14)}:${marks.slice(0, b.kisi).join("")}`;
  const peekFirst = useRef(true);
  useEffect(() => {
    if (peekFirst.current) {
      peekFirst.current = false;
      return;
    }
    if (!matchMedia("(max-width: 899px)").matches) return;
    setPeek(true);
    const t = window.setTimeout(() => setPeek(false), 2000);
    return () => window.clearTimeout(t);
  }, [peekKey]);

  /* ---------- step validity ---------- */
  const dayOk = !!dayInfo && (dayInfo.status === "bos" || dayInfo.status === "az");
  const valid = (n: number) => {
    if (n === 1) return !goPrivate;
    if (n === 2) return dayOk;
    if (n === 3) return !!b.saat && slots.some((s) => s.time === b.saat && s.ok);
    if (n === 4) return true;
    if (n === 5) return errName === "" && errPhone === "" && errEmail === "" && agree;
    return true;
  };
  const errName = !b.ad || b.ad.trim().length < 3 || !/\s/.test(b.ad.trim()) ? f.contact.errName : "";
  const errPhone = !phoneOk(b.telefon ?? "") ? f.contact.errPhone : "";
  const errEmail = !emailOk(b.eposta ?? "") ? f.contact.errEmail : "";
  const show = (k: string, e: string) => (touched[k] || forced ? e : "");

  const next = () => {
    if (!valid(step)) {
      setForced(true);
      requestAnimationFrame(() => document.querySelector<HTMLElement>(".kk-flow [aria-invalid='true'], .kk-flow .kk-error")?.scrollIntoView({ block: "center" }));
      return;
    }
    setForced(false);
    setCleared("");
    if (step === 5) {
      setPayOpen(true);
      return;
    }
    setStep((s) => Math.min(TOTAL, s + 1));
  };
  const back = () => {
    setForced(false);
    setStep((s) => Math.max(1, s - 1));
  };

  const confirm = useCallback(() => {
    const mmdd = (b.tarih ?? "").slice(5).replace("-", "");
    const code = `KLM-${mmdd}-${b.kisi}${String.fromCharCode(65 + ((mmdd.charCodeAt(3) || 0) % 26))}`;
    update({ kod: code });
    try {
      sessionStorage.setItem(DONE_KEY, code);
    } catch {
      /* ignore */
    }
    setPayOpen(false);
    setStep(6);
  }, [b.tarih, b.kisi, update]);

  const newBooking = () => {
    try {
      sessionStorage.removeItem(DONE_KEY);
    } catch {
      /* ignore */
    }
    reset();
    setLost(null);
    setAgree(false);
    setTouched({});
    setStep(1);
  };

  const setGuest = (i: number, p: Partial<Guest>) => {
    const list = b.misafirler.map((g, k) => (k === i ? { ...g, ...p } : g));
    update({ misafirler: list });
  };

  const summaryText = [
    f.experience.options[b.deneyim].name,
    `${b.kisi} kişi`,
    b.tarih ? dayLong(b.tarih) : "",
    b.saat ?? "",
    b.deneyim === "ozel" ? "" : menu.label,
    notesCount ? `${notesCount} misafir notu` : "",
  ]
    .filter(Boolean)
    .join(", ");

  /* ---------- lost confirmation (reload after step 6) ---------- */
  if (lost && step !== 6) {
    return (
      <div className="kk-wrap kk-flow-lost">
        <h1 className="kk-h2">{f.done.title}</h1>
        <p className="kk-lede">{f.done.lost}</p>
        <p>
          {f.done.code}: <strong className="kk-code">{lost}</strong>
        </p>
        <button type="button" className="kk-btn kk-btn--accent" onClick={newBooking}>
          {f.done.another}
        </button>
      </div>
    );
  }

  const sini = (
    <Sini
      variant="table"
      sizes="(max-width: 899px) 120px, 34vw"
      shape={b.deneyim === "tezgah" ? "counter" : "round"}
      seats={b.deneyim === "ozel" ? Math.min(14, Math.max(8, b.kisi)) : Math.min(b.kisi, 14)}
      marks={marks}
      courses={b.deneyim === "ozel" ? 0 : menu.plates}
      kitchenLabel={tr.house.kitchen}
    />
  );

  return (
    <div className="kk-flow" data-step={step}>
      <div className="kk-flow-main">
        <header className="kk-flow-head">
          <h1 className="kk-flow-title">{f.title}</h1>
          <p className="kk-muted">{f.sub}</p>
          {branch === null && (
            <div className="kk-progress" aria-hidden="true">
              <i style={{ transform: `scaleX(${step / TOTAL})` }} />
            </div>
          )}
          {branch === null && (
            <ol className="kk-steps" aria-label={f.step(step, TOTAL)}>
              {f.steps.map((name, i) => {
                const n = i + 1;
                const reachable = n < step && step < 6;
                return (
                  <li key={name} data-state={n === step ? "now" : n < step ? "done" : "next"}>
                    {reachable ? (
                      <button type="button" onClick={() => setStep(n)}>
                        <span>{n}</span> {name}
                      </button>
                    ) : (
                      <span aria-current={n === step ? "step" : undefined}>
                        <span>{n}</span> {name}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </header>

        {branch === "waitlist" ? (
          <Waitlist
            headRef={headRef}
            onBack={() => setBranch(null)}
            onTake={(iso, time) => {
              update({ tarih: iso, saat: time });
              setBranch(null);
              setStep(3);
            }}
          />
        ) : (
          <div className="kk-flow-step" ref={bodyRef}>
            <p className="kk-flow-count">{f.step(step, TOTAL)}</p>

            {step === 1 && (
              <>
                <h2 className="kk-h3" ref={headRef} tabIndex={-1}>
                  {f.experience.title}
                </h2>
                <div className="kk-exp" role="radiogroup" aria-label={f.experience.title}>
                  {(["salon", "tezgah", "ozel"] as Deneyim[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      role="radio"
                      aria-checked={b.deneyim === d}
                      className="kk-exp-row"
                      onClick={() => {
                        const kisi = d === "tezgah" ? Math.min(b.kisi, 4) : d === "ozel" ? Math.max(8, b.kisi) : b.kisi > 6 && !plusMode ? 6 : b.kisi;
                        if (d === "ozel") setPlusMode(true);
                        update({ deneyim: d, kisi, menu: d === "tezgah" ? "tezgah" : b.menu === "tezgah" ? "sofra" : b.menu });
                      }}
                    >
                      <MiniPlan area={d} />
                      <span className="kk-exp-name">{f.experience.options[d].name}</span>
                      <span className="kk-exp-meta">{f.experience.options[d].meta}</span>
                    </button>
                  ))}
                </div>

                <h3 className="kk-flow-sub">{f.experience.peopleTitle}</h3>
                <ChipRadio<number | "plus">
                  label={f.experience.howMany}
                  className="kk-chips kk-chips--people"
                  value={isPlus ? "plus" : b.kisi}
                  onChange={(v) => {
                    if (v === "plus") {
                      setPlusMode(true);
                      update({ kisi: Math.max(8, b.kisi), deneyim: b.deneyim === "tezgah" ? "salon" : b.deneyim, menu: b.menu === "tezgah" ? "sofra" : b.menu });
                    } else {
                      setPlusMode(false);
                      update({ kisi: v, deneyim: b.deneyim === "ozel" ? "salon" : b.deneyim });
                    }
                  }}
                  options={[
                    ...[1, 2, 3, 4, 5, 6].map((n) => ({ value: n as number | "plus", label: String(n), disabled: b.deneyim === "tezgah" && n > 4 })),
                    { value: "plus" as const, label: f.experience.plus, disabled: b.deneyim === "tezgah" },
                  ]}
                />
                {b.deneyim === "tezgah" && <p className="kk-hint">{f.experience.counterMax}</p>}
                {isPlus && (
                  <div className="kk-field kk-field--inline">
                    <label className="kk-label" htmlFor="kk-kisi-plus">
                      {f.experience.howMany}
                    </label>
                    <select id="kk-kisi-plus" className="kk-input kk-input--select" value={b.kisi} onChange={(e) => update({ kisi: Number(e.target.value) })}>
                      {Array.from({ length: 28 }, (_, i) => i + 7).map((n) => (
                        <option key={n} value={n}>
                          {n} kişi
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {b.kisi === 1 && b.deneyim === "salon" && (
                  <Note>
                    <p>{f.experience.solo}</p>
                    <button type="button" className="kk-btn kk-btn--line kk-btn--sm" onClick={() => update({ deneyim: "tezgah", menu: "tezgah" })}>
                      {f.experience.soloCta}
                    </button>
                  </Note>
                )}
                {goPrivate && (
                  <Note>
                    <p>{b.deneyim === "ozel" && b.kisi <= 14 ? f.experience.ozel : b.kisi > 14 ? f.experience.whole : f.experience.group}</p>
                    <Link href={`${tr.base}/ozel-davet/`} className="kk-btn kk-btn--accent kk-btn--sm">
                      {b.kisi > 14 ? f.experience.wholeCta : b.deneyim === "ozel" ? f.experience.ozelCta : f.experience.groupCta}
                    </Link>
                  </Note>
                )}
                <p className="kk-hint kk-hint--quiet">{f.experience.kids}</p>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="kk-h3" ref={headRef} tabIndex={-1}>
                  {f.date.title}
                </h2>
                {months.length > 0 && (
                  <Calendar
                    months={months}
                    value={b.tarih}
                    lockedLabel={lockedLabel}
                    onPick={(iso: string) => {
                      update({ tarih: iso });
                    }}
                  />
                )}
                <div aria-live="polite">
                  {dayInfo && <DayMessage status={dayInfo.status} nearest={nearest} onNearest={(iso) => update({ tarih: iso })} onWait={() => setBranch("waitlist")} />}
                  {forced && !dayOk && !dayInfo && <p className="kk-error">{f.date.pick}</p>}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="kk-h3" ref={headRef} tabIndex={-1}>
                  {f.time.title}
                </h2>
                {b.tarih && <p className="kk-muted">{dayLong(b.tarih)}</p>}
                {b.deneyim === "salon" ? (
                  <>
                    <h3 className="kk-flow-sub">{f.time.menuTitle}</h3>
                    <div className="kk-menus" role="radiogroup" aria-label={f.time.menuTitle}>
                      {(["sofra", "kisa"] as MenuKey[]).map((m) => (
                        <button key={m} type="button" role="radio" aria-checked={b.menu === m} className="kk-menu-opt" onClick={() => update({ menu: m })}>
                          <span className="kk-menu-name">{MENUS[m].label}</span>
                          <span className="kk-menu-meta">
                            {MENUS[m].plates} tabak, {MENUS[m].hours}
                          </span>
                          <Price n={MENUS[m].price} per={f.perPerson} />
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <Note>
                    <p>
                      {f.time.counterMenu} <Price n={MENUS.tezgah.price} per={f.perPerson} />
                    </p>
                  </Note>
                )}

                <h3 className="kk-flow-sub">{b.deneyim === "tezgah" ? f.time.seatingCounter : f.time.seatingSalon}</h3>
                <ChipRadio<string>
                  label={b.deneyim === "tezgah" ? f.time.seatingCounter : f.time.seatingSalon}
                  className="kk-chips kk-chips--times"
                  value={b.saat}
                  onChange={(v) => {
                    setCleared("");
                    update({ saat: v });
                  }}
                  options={slots.map((s) => ({
                    value: s.time,
                    label: s.time,
                    disabled: !s.ok,
                    note:
                      s.reason === "dolu"
                        ? f.time.full
                        : s.reason === "kisa"
                          ? f.time.notShort
                          : s.reason === "sadeceKisa"
                            ? f.time.shortOnly
                            : s.reason === "kisi"
                              ? f.time.notSeats
                              : s.left <= 2
                                ? f.time.left(s.left, b.deneyim === "tezgah" ? f.time.unitSeat : f.time.unitTable)
                                : undefined,
                  }))}
                />
                <div aria-live="polite">{cleared && <Note tone="warn">{cleared}</Note>}</div>
                {slots.length > 0 && slots.some((s) => s.reason === "dolu") && (
                  <button type="button" className="kk-textbtn" onClick={() => setBranch("waitlist")}>
                    {f.time.waitlist}
                  </button>
                )}
                {forced && !b.saat && <p className="kk-error">{f.time.pick}</p>}

                <div className="kk-pairing">
                  <Check
                    id="kk-pairing"
                    checked={b.eslesme}
                    onChange={(v) => update({ eslesme: v })}
                    label={
                      <>
                        {f.time.pairing} <Price n={PAIRING_PRICE} per={f.perPerson} />
                      </>
                    }
                    hint={f.time.pairingNote}
                  />
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="kk-h3" ref={headRef} tabIndex={-1}>
                  {f.guests.title}
                </h2>
                <p className="kk-muted">{f.guests.sub}</p>
                {now && b.tarih && b.saat && hoursUntil(b.tarih, b.saat, now) < 48 && notesCount > 0 && <Note tone="warn">{f.guests.late}</Note>}
                <div className="kk-guests">
                  {b.misafirler.slice(0, b.kisi).map((g, i) => (
                    <fieldset key={i} className="kk-guest">
                      <legend>{f.guests.guest(i + 1)}</legend>
                      <TextField id={`kk-g-${i}-ad`} label={f.guests.name} value={g.ad} onChange={(v) => setGuest(i, { ad: v })} autoComplete="off" maxLength={40} />
                      <div className="kk-guest-notes" role="group" aria-label={`${f.guests.guest(i + 1)}: ${f.guests.notes}`}>
                        {f.guests.chips.map((c) => {
                          const on = g.notlar.includes(c);
                          return (
                            <button
                              key={c}
                              type="button"
                              className="kk-chip kk-chip--sm"
                              aria-pressed={on}
                              onClick={() => setGuest(i, { notlar: on ? g.notlar.filter((x) => x !== c) : [...g.notlar, c] })}
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>
                      {g.notlar.includes("Diğer") && (
                        <TextField id={`kk-g-${i}-diger`} label={f.guests.other} placeholder={f.guests.otherPh} value={g.diger} onChange={(v) => setGuest(i, { diger: v })} maxLength={80} />
                      )}
                      {g.notlar.includes("Fıstık ve kuruyemiş") && <Note tone="warn">{f.guests.pistachio}</Note>}
                      {g.notlar.includes("Vegan") && <Note>{f.guests.vegan}</Note>}
                    </fieldset>
                  ))}
                </div>
                <h3 className="kk-flow-sub">{f.guests.occasion}</h3>
                <ChipRadio<string> label={f.guests.occasion} value={b.ozelGun} onChange={(v) => update({ ozelGun: b.ozelGun === v ? undefined : v })} options={f.guests.occasions.map((o) => ({ value: o, label: o }))} />
                <TextField id="kk-not" label={f.guests.noteLabel} value={b.not ?? ""} onChange={(v) => update({ not: v })} multiline maxLength={240} />
                <p className="kk-hint kk-hint--quiet">{f.guests.access}</p>
              </>
            )}

            {step === 5 && (
              <>
                <h2 className="kk-h3" ref={headRef} tabIndex={-1}>
                  {f.contact.title}
                </h2>
                <div className="kk-form-grid">
                  <TextField id="kk-ad" label={f.contact.name} value={b.ad ?? ""} onChange={(v) => update({ ad: v })} onBlur={() => setTouched((t) => ({ ...t, ad: true }))} autoComplete="name" error={show("ad", errName)} />
                  <PhoneField id="kk-tel" label={f.contact.phone} value={b.telefon ?? ""} onChange={(v) => update({ telefon: v })} onBlur={() => setTouched((t) => ({ ...t, tel: true }))} error={show("tel", errPhone)} />
                  <TextField id="kk-eposta" type="email" label={f.contact.email} value={b.eposta ?? ""} onChange={(v) => update({ eposta: v })} onBlur={() => setTouched((t) => ({ ...t, eposta: true }))} autoComplete="email" error={show("eposta", errEmail)} />
                </div>
                <div className="kk-policy">
                  <h3 className="kk-flow-sub">{f.contact.policyTitle}</h3>
                  <ul>
                    {f.contact.policy.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <Check id="kk-agree" checked={agree} onChange={setAgree} label={f.contact.agree} error={forced && !agree ? f.contact.errAgree : ""} />
                </div>
                <div className="kk-due">
                  <span>{f.contact.today}</span>
                  <strong>
                    {f.contact.deposit}: <Price n={deposit} />
                  </strong>
                </div>
                <p className="kk-hint">{f.contact.privacy}</p>
              </>
            )}

            {step === 6 && (
              <Done headRef={headRef} total={total} onNew={newBooking} />
            )}

            {step < 6 && (
              <div className="kk-flow-nav">
                {step > 1 ? (
                  <button type="button" className="kk-btn kk-btn--line" onClick={back}>
                    {f.back}
                  </button>
                ) : (
                  <span />
                )}
                <button type="button" className="kk-btn kk-btn--accent" onClick={next} aria-disabled={step === 1 && goPrivate ? true : undefined}>
                  {step === 5 ? f.contact.pay : f.next}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <aside className="kk-flow-side" aria-label={f.summaryLabel} data-peek={peek || undefined}>
        <div className="kk-flow-sini">{sini}</div>
        <div className="kk-flow-summary">
          <p className="kk-sr" aria-live="polite">
            {summaryText}
          </p>
          <dl className="kk-sum" aria-hidden="true">
            <div>
              <dt>{f.sum.where}</dt>
              <dd>
                {f.experience.options[b.deneyim].name}, {b.kisi} kişi
              </dd>
            </div>
            <div data-empty={!b.tarih || undefined}>
              <dt>{f.sum.day}</dt>
              <dd>{b.tarih ? dayLong(b.tarih) : "—"}</dd>
            </div>
            <div data-empty={!b.saat || undefined}>
              <dt>{f.sum.time}</dt>
              <dd>{b.saat ?? "—"}</dd>
            </div>
            {b.deneyim !== "ozel" && (
              <div>
                <dt>{f.sum.menu}</dt>
                <dd>
                  {menu.label}
                  {b.eslesme ? `, ${f.sum.pairing}` : ""}
                </dd>
              </div>
            )}
            {notesCount > 0 && (
              <div>
                <dt>{f.sum.notes}</dt>
                <dd>{f.sum.guestNotes(notesCount)}</dd>
              </div>
            )}
          </dl>
          {b.deneyim !== "ozel" && (
            <p className="kk-total">
              <span>{f.total}</span>
              <Price n={total} />
            </p>
          )}
        </div>
      </aside>

      {payOpen && <PaymentDialog onOk={confirm} onCancel={() => setPayOpen(false)} />}
    </div>
  );
}

/* ---------- pieces ---------- */

function DayMessage({ status, nearest, onNearest, onWait }: { status: DayStatus; nearest: { iso: string; time: string }[]; onNearest: (iso: string) => void; onWait: () => void }) {
  if (status === "bos" || status === "az") return null;
  if (status === "bugun-kapali") return <Note tone="warn">{f.date.sameDay} <a href={tr.contact.phoneHref}>{tr.contact.phone}</a></Note>;
  if (status === "ozel")
    return (
      <Note>
        <p>{f.date.special}</p>
        <Link className="kk-btn kk-btn--line kk-btn--sm" href={`${tr.base}/ozel-davet/`}>
          {f.date.specialCta}
        </Link>
      </Note>
    );
  return (
    <Note tone="warn">
      <p>
        <strong>{f.date.full}</strong>
      </p>
      {nearest.length > 0 && (
        <div className="kk-near">
          <span>{f.date.nearest}</span>
          {nearest.map((n) => (
            <button key={n.iso} type="button" className="kk-chip kk-chip--sm" onClick={() => onNearest(n.iso)}>
              {dayChip(n.iso)}
            </button>
          ))}
        </div>
      )}
      <button type="button" className="kk-textbtn" onClick={onWait}>
        {f.date.waitlist}
      </button>
    </Note>
  );
}

function MiniPlan({ area }: { area: Deneyim }) {
  return (
    <svg className="kk-mini" viewBox="0 0 60 40" aria-hidden="true" focusable="false">
      <rect x="1.5" y="1.5" width="57" height="37" rx="1" className="kk-mini-wall" />
      <rect x="3" y="3" width="34" height="10" className={area === "salon" ? "kk-mini-on" : "kk-mini-off"} />
      <rect x="39" y="17" width="18" height="6" className={area === "tezgah" ? "kk-mini-on" : "kk-mini-off"} />
      <rect x="3" y="15" width="14" height="22" className={area === "ozel" ? "kk-mini-on" : "kk-mini-off"} />
    </svg>
  );
}

function PaymentDialog({ onOk, onCancel }: { onOk: () => void; onCancel: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (!d.open) d.showModal();
    const onClose = () => onCancel();
    d.addEventListener("cancel", onClose);
    return () => d.removeEventListener("cancel", onClose);
  }, [onCancel]);
  const p = f.payment;
  return (
    <dialog ref={ref} className="kk-dialog" aria-labelledby="kk-pay-title">
      <h2 id="kk-pay-title" className="kk-h3">
        {p.title}
      </h2>
      <p>{p.body}</p>
      <div className="kk-dialog-act">
        <button type="button" className="kk-btn kk-btn--line" onClick={onCancel}>
          {p.cancel}
        </button>
        <button type="button" className="kk-btn kk-btn--accent" onClick={onOk} autoFocus>
          {p.ok}
        </button>
      </div>
    </dialog>
  );
}

function Done({ headRef, total, onNew }: { headRef: React.RefObject<HTMLHeadingElement | null>; total: number; onNew: () => void }) {
  const { booking: b } = useBooking();
  const d = f.done;
  const code = b.kod ?? "";
  const menu = MENUS[b.menu];
  const lines = [
    `${d.code}: ${code}`,
    `${f.experience.options[b.deneyim].name}, ${b.kisi} kişi`,
    b.tarih && b.saat ? `${dayLong(b.tarih)}, ${b.saat}` : "",
    `${menu.label}${b.eslesme ? ", alkolsüz eşleşme" : ""}`,
    `${f.total}: ${tl(total)} (örnek)`,
  ].filter(Boolean);
  const mail = `mailto:${tr.contact.email}?subject=${encodeURIComponent(d.changeSubject(code))}&body=${encodeURIComponent(lines.join("\n") + "\n\n")}`;
  const ics = () => {
    if (!b.tarih || !b.saat) return;
    downloadIcs(
      {
        uid: `${code}-${b.tarih}`,
        title: `${d.icsTitle} (${b.kisi} kişi)`,
        start: antepInstant(b.tarih, b.saat),
        minutes: MINUTES[b.menu],
        location: `Kalemkâr, ${tr.contact.address.join(", ")}`,
        description: lines.join("\n"),
      },
      `kalemkar-${code}.ics`,
    );
  };
  return (
    <div className="kk-done">
      <h2 className="kk-h2" ref={headRef} tabIndex={-1}>
        {d.title}
      </h2>
      <p className="kk-done-code">
        <span>{d.code}</span>
        <strong className="kk-code">{code}</strong>
      </p>
      <ul className="kk-done-list">
        {lines.slice(1).map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <div className="kk-done-act">
        <button type="button" className="kk-btn kk-btn--accent" onClick={ics}>
          {d.ics}
        </button>
        <a className="kk-btn kk-btn--line" href={tr.contact.mapsHref} target="_blank" rel="noopener noreferrer">
          {d.map}
        </a>
        <a className="kk-btn kk-btn--line" href={mail}>
          {d.change}
        </a>
      </div>
      <p className="kk-muted">{d.reminder}</p>
      <p className="kk-hint">{d.notSent}</p>
      <button type="button" className="kk-textbtn" onClick={onNew}>
        {d.another}
      </button>
    </div>
  );
}
