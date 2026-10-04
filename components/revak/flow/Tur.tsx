"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { tr } from "@/content/revak/tr";
import { KADEMELER, isKademe, readParam, useShared } from "@/lib/revak/store";
import { istanbul, parseIso, slotsFor, TOUR_MINUTES, tourDays, type TourDay, type TourType } from "@/lib/revak/schedule";
import { emailOk, longDate, MONTHS, phoneOk, WEEKDAYS_SHORT } from "@/lib/revak/format";
import { downloadIcs } from "@/lib/revak/ics";
import { Icon, Mark } from "../ui/Icon";
import { KvkkLink } from "../ui/Drawer";
import { Check, Choices, FlowShell, KvkkCheck, PhoneField, SealMark, Stepper, TextField, useFlowForm, useFocusOnMount } from "./kit";

const c = tr.flows.common;
const t = tr.flows.tur;

type V = {
  tur: TourType | "";
  kademeler: string[];
  tarih: string;
  saat: string;
  gor: string[];
  veliAd: string;
  telefon: string;
  eposta: string;
  kisi: number;
  cocuk: boolean;
  plaka: string;
  kvkk: boolean;
};

const STEP_FIELDS: (keyof V & string)[][] = [["tur", "kademeler"], ["tarih", "saat"], ["veliAd", "telefon", "eposta", "kvkk"]];

export function TurFlow() {
  const { shared, update, ready } = useShared();
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [done, setDone] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const applied = useRef(false);

  const f = useFlowForm<V>(
    { tur: "", kademeler: [], tarih: "", saat: "", gor: [], veliAd: "", telefon: "", eposta: "", kisi: 2, cocuk: false, plaka: "", kvkk: false },
    {
      tur: (v) => (v.tur ? "" : t.s1.errors.tur),
      kademeler: (v) => (v.kademeler.length ? "" : t.s1.errors.kademeler),
      tarih: (v) => (v.tarih ? "" : t.s2.errors.day),
      saat: (v) => (v.saat ? "" : t.s2.errors.time),
      veliAd: (v) => (v.veliAd.trim().includes(" ") ? "" : c.fieldErrors.veliAd),
      telefon: (v) => (phoneOk(v.telefon) ? "" : c.errors.phone),
      eposta: (v) => (emailOk(v.eposta) ? "" : c.errors.email),
      kvkk: (v) => (v.kvkk ? "" : c.kvkkError),
    },
  );
  const v = f.values;

  const days = useMemo<TourDay[]>(() => (now && v.tur ? tourDays(now, v.tur) : []), [now, v.tur]);
  const slots = v.tur && v.tarih ? slotsFor(v.tarih, v.tur) : [];

  // Prefill once: deep link (?tur=&tarih=&saat=&kademe=) and shared state.
  useEffect(() => {
    if (!ready || applied.current) return;
    applied.current = true;
    const today = new Date();
    setNow(today);
    const qt = readParam("tur");
    const tur: TourType | "" = qt === "yerinde" || qt === "cevrimici" ? qt : "";
    const qk = readParam("kademe");
    const k = isKademe(qk) ? qk : shared.kademe;
    const qd = readParam("tarih");
    const qs = readParam("saat");
    let tarih = "";
    let saat = "";
    if (tur && qd && qs) {
      const day = tourDays(today, tur).find((d) => d.iso === qd && d.schoolDay);
      const slot = day && slotsFor(qd, tur).find((s) => s.time === qs && s.left > 0);
      if (slot) {
        tarih = qd;
        saat = qs;
      }
    }
    // places picked on the campus plan (?gor=Kütüphane|Revir), only known options
    const gor = (readParam("gor") ?? "").split("|").filter((x) => t.s2.seeOptions.includes(x));
    f.patch({
      tur,
      kademeler: k ? [k] : [],
      tarih,
      saat,
      ...(gor.length ? { gor } : {}),
      ...(shared.veliAd ? { veliAd: shared.veliAd } : {}),
      ...(shared.telefon ? { telefon: shared.telefon } : {}),
      ...(shared.eposta ? { eposta: shared.eposta } : {}),
    });
    if (tur && k && tarih) {
      setStep(1);
      setMaxReached(1);
    }
  }, [ready, shared, f]);

  const go = (n: number) => {
    setStep(n);
    setMaxReached((m) => Math.max(m, n));
  };
  const next = () => {
    if (!f.check(STEP_FIELDS[step])) return;
    if (step === 0 && v.kademeler.length === 1 && isKademe(v.kademeler[0])) update({ kademe: v.kademeler[0] });
    if (step === 2) {
      update({ veliAd: v.veliAd.trim(), telefon: v.telefon, eposta: v.eposta.trim() });
      setDone(true);
      return;
    }
    go(step + 1);
  };

  if (done) return <Done v={v} onChange={() => (setDone(false), go(1))} />;

  const titles = [t.s1.title, t.s2.title, t.s3.title];
  const summary = (
    <div className="rv-summary-card" aria-live="polite">
      <h2>{t.summary.title}</h2>
      <dl>
        <div>
          <dt>{t.summary.type}</dt>
          <dd>{v.tur ? t.s1.types[v.tur].label : t.summary.empty}</dd>
        </div>
        <div>
          <dt>{t.summary.date}</dt>
          <dd>{v.tarih ? longDate(v.tarih) : t.summary.empty}</dd>
        </div>
        <div>
          <dt>{t.summary.time}</dt>
          <dd>{v.saat || t.summary.empty}</dd>
        </div>
        {v.tur && (
          <div>
            <dt>{t.summary.length}</dt>
            <dd>{t.summary.minutes(TOUR_MINUTES[v.tur])}</dd>
          </div>
        )}
      </dl>
      <p className="rv-summary-free">{t.summary.price}</p>
    </div>
  );

  // Month label(s) above the day strip, e.g. "Eylül - Ekim 2026".
  const months = Array.from(new Set(days.map((d) => parseIso(d.iso).getMonth())));
  const monthLabel = days.length ? `${months.map((m) => MONTHS[m]).join(" - ")} ${parseIso(days[days.length - 1].iso).getFullYear()}` : "";

  return (
    <FlowShell
      name={t.name}
      steps={t.steps}
      step={step}
      maxReached={maxReached}
      onStep={go}
      title={titles[step]}
      onBack={step > 0 ? () => go(step - 1) : undefined}
      onNext={next}
      nextLabel={step === 2 ? t.s3.submit : undefined}
      submitNote={step === 2}
      aside={summary}
    >
      {step === 0 && (
        <>
          <Choices
            name="tur"
            label={t.s1.tur}
            variant="wide"
            value={v.tur}
            error={f.shown("tur")}
            onChange={(x) => {
              const tur = x as TourType;
              const keep = v.tarih && slotsFor(v.tarih, tur).some((s) => s.time === v.saat && s.left > 0);
              f.patch({ tur, ...(keep ? {} : { tarih: "", saat: "" }) });
            }}
            options={(["yerinde", "cevrimici"] as const).map((k) => ({ value: k, label: t.s1.types[k].label, hint: t.s1.types[k].text }))}
          />
          <Choices
            name="kademeler"
            label={t.s1.kademeler}
            multi
            variant="chips"
            value={v.kademeler}
            error={f.shown("kademeler")}
            onChange={(x) => f.set("kademeler", x as string[])}
            options={KADEMELER.map((k) => ({ value: k, label: c.kademe[k] }))}
          />
        </>
      )}

      {step === 1 && (
        <>
          <fieldset className="rv-fieldset" id="rv-f-tarih" aria-invalid={!!f.shown("tarih") || undefined} aria-describedby={f.shown("tarih") ? "rv-f-tarih-err" : undefined}>
            <legend>
              {t.s2.day} <small>{monthLabel}</small>
            </legend>
            <div className="rv-days">
              {days.map((d) => {
                const disabled = !d.schoolDay || d.full;
                const dt = parseIso(d.iso);
                return (
                  <label key={d.iso} className="rv-choice rv-day">
                    <input
                      type="radio"
                      name="rv-f-tarih"
                      value={d.iso}
                      checked={v.tarih === d.iso}
                      disabled={disabled}
                      aria-label={`${longDate(d.iso)}${disabled ? `, ${d.holiday ? t.s2.holiday : d.schoolDay ? t.s2.full : t.s2.closed}` : ""}`}
                      onChange={() => {
                        const ok = slotsFor(d.iso, v.tur as TourType).some((s) => s.time === v.saat && s.left > 0);
                        f.patch({ tarih: d.iso, ...(ok ? {} : { saat: "" }) });
                      }}
                    />
                    <span className="rv-choice-face" aria-hidden="true">
                      <small>{WEEKDAYS_SHORT[d.weekday]}</small>
                      <strong>{dt.getDate()}</strong>
                      <small>{disabled ? (d.holiday ? t.s2.holiday : d.schoolDay ? t.s2.full : t.s2.closed) : MONTHS[dt.getMonth()].slice(0, 3)}</small>
                    </span>
                  </label>
                );
              })}
            </div>
            {f.shown("tarih") && (
              <p className="rv-error" id="rv-f-tarih-err">
                {f.shown("tarih")}
              </p>
            )}
          </fieldset>

          <fieldset className="rv-fieldset" id="rv-f-saat" aria-invalid={!!f.shown("saat") || undefined} aria-describedby={f.shown("saat") ? "rv-f-saat-err" : undefined}>
            <legend>{t.s2.time}</legend>
            {!v.tarih ? (
              <p className="rv-hint">{t.s2.pickDay}</p>
            ) : (
              (["sabah", "ogleden", "aksam"] as const)
                .filter((p) => slots.some((s) => s.part === p))
                .map((p) => (
                  <div key={p} className="rv-slot-group">
                    <h3>{t.s2.parts[p]}</h3>
                    <div className="rv-times">
                      {slots
                        .filter((s) => s.part === p)
                        .map((s) => (
                          <label key={s.time} className="rv-choice">
                            <input type="radio" name="rv-f-saat" value={s.time} checked={v.saat === s.time} disabled={s.left === 0} onChange={() => f.set("saat", s.time)} />
                            <span className="rv-choice-face">
                              <strong>{s.time}</strong>
                              <span>{s.left === 0 ? t.s2.full : t.s2.left(s.left)}</span>
                            </span>
                          </label>
                        ))}
                    </div>
                  </div>
                ))
            )}
            {f.shown("saat") && (
              <p className="rv-error" id="rv-f-saat-err">
                {f.shown("saat")}
              </p>
            )}
          </fieldset>

          {v.tur === "yerinde" && (
            <Choices
              name="gor"
              label={t.s2.see}
              optional
              multi
              variant="chips"
              value={v.gor}
              onChange={(x) => f.set("gor", x as string[])}
              options={t.s2.seeOptions.map((s) => ({ value: s, label: s }))}
            />
          )}
        </>
      )}

      {step === 2 && (
        <>
          <TextField name="veliAd" label={c.fields.veliAd} value={v.veliAd} autoComplete="name" error={f.shown("veliAd")} onChange={(x) => f.set("veliAd", x)} onBlur={() => f.blur("veliAd")} />
          <div className="rv-field-row">
            <PhoneField name="telefon" label={c.fields.telefon} value={v.telefon} error={f.shown("telefon")} onChange={(x) => f.set("telefon", x)} onBlur={() => f.blur("telefon")} />
            <TextField
              name="eposta"
              label={c.fields.eposta}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={v.eposta}
              error={f.shown("eposta")}
              onChange={(x) => f.set("eposta", x)}
              onBlur={() => f.blur("eposta")}
            />
          </div>
          <Stepper name="kisi" label={t.s3.kisi} value={v.kisi} min={1} max={4} onChange={(n) => f.set("kisi", n)} lessLabel={t.s3.less} moreLabel={t.s3.more} />
          {v.tur === "yerinde" && (
            <>
              <Check name="cocuk" switchStyle checked={v.cocuk} onChange={(x) => f.set("cocuk", x)} hint={t.s3.cocukHint}>
                {t.s3.cocuk}
              </Check>
              <TextField
                name="plaka"
                label={t.s3.plaka}
                optional
                hint={t.s3.plakaHint}
                value={v.plaka}
                maxLength={12}
                autoComplete="off"
                onChange={(x) => f.set("plaka", x.toLocaleUpperCase("tr"))}
                onBlur={() => f.blur("plaka")}
              />
            </>
          )}
          <KvkkCheck checked={v.kvkk} onChange={(x) => f.set("kvkk", x)} error={f.shown("kvkk")} drawer={<KvkkLink label={c.kvkkLink} />} />
        </>
      )}
    </FlowShell>
  );
}

function Done({ v, onChange }: { v: V; onChange: () => void }) {
  const h = useFocusOnMount<HTMLHeadingElement>();
  const d = t.done;
  const tur = v.tur as TourType;
  const first = v.veliAd.trim().split(/\s+/)[0] ?? "";
  const ics = () =>
    downloadIcs(
      {
        uid: `tur-${v.tarih}-${v.saat}`,
        title: tur === "yerinde" ? d.icsTitle : d.icsTitleOnline,
        start: istanbul(v.tarih, v.saat),
        minutes: TOUR_MINUTES[tur],
        location: tur === "yerinde" ? d.location : tr.flows.tur.s1.types.cevrimici.label,
        description: d.icsDesc,
      },
      "revak-kampus-turu.ics",
    );
  return (
    <div className="rv-wrap rv-done">
      <SealMark />
      <h1 ref={h} tabIndex={-1}>
        {d.title(first)}
      </h1>
      <p className="rv-done-lede">{d.text}</p>

      <div className="rv-ticket">
        <div className="rv-ticket-main">
          <p className="rv-ticket-kicker">
            {t.s1.types[tur].label}, {d.guests(v.kisi)}
          </p>
          <p className="rv-ticket-date">{longDate(v.tarih)}</p>
          <p className="rv-ticket-time">{v.saat}</p>
          <dl>
            <div>
              <dt>{d.meet}</dt>
              <dd>{tur === "yerinde" ? d.meetOnsite : d.meetOnline}</dd>
            </div>
            <div>
              <dt>{d.host}</dt>
              <dd>{d.hostName}</dd>
            </div>
          </dl>
        </div>
        <div className="rv-ticket-stub" aria-hidden="true">
          <Mark size={40} className="rv-mark" />
          <strong>{v.saat}</strong>
          <span>{tr.brand.full}</span>
        </div>
      </div>

      <div className="rv-ticket-actions">
        <button type="button" className="rv-btn rv-btn--ink" onClick={ics}>
          <Icon name="calendar" size={18} />
          {d.ics}
        </button>
        {tur === "yerinde" && (
          <a href={tr.contact.mapsHref} target="_blank" rel="noopener noreferrer" className="rv-btn rv-btn--line">
            <Icon name="pin" size={18} />
            {d.directions}
          </a>
        )}
        <button type="button" className="rv-btn rv-btn--quiet" onClick={onChange}>
          {d.change}
        </button>
      </div>

      <div className="rv-next-cards">
        <div className="rv-next-card">
          <h2>{d.onKayit}</h2>
          <p>{tr.kabul.paths[0].text}</p>
          <Link href={`/revak/kabul/on-kayit/${v.kademeler.length === 1 ? `?kademe=${v.kademeler[0]}` : ""}`} className="rv-btn rv-btn--seal">
            {tr.kabul.paths[0].cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
