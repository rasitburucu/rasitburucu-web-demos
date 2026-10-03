"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { tr } from "@/content/revak/tr";
import { nearestSlots } from "@/lib/revak/schedule";
import { formatPhone, phoneOk } from "@/lib/revak/format";
import { Icon } from "../ui/Icon";
import { Photo } from "../ui/Photo";

/* ---------- "Bir gün burada": a school day, stop by stop ---------- */

export function DayTimeline() {
  const d = tr.kampus.day;
  const [level, setLevel] = useState<"ilkokul" | "lise">("ilkokul");
  const [i, setI] = useState(0);
  const [tourHref, setTourHref] = useState("/revak/kabul/kampus-turu/?tur=yerinde");
  const railRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const stops = d[level];
  const stop = stops[i];
  const last = i === stops.length - 1;

  useEffect(() => {
    const s = nearestSlots(new Date(), "yerinde", 1)[0];
    const k = level === "lise" ? "lise" : "ilkokul";
    if (s) setTourHref(`/revak/kabul/kampus-turu/?tur=yerinde&kademe=${k}&tarih=${s.iso}&saat=${s.time}`);
  }, [level]);

  const focusStop = (n: number) => {
    setI(n);
    const btn = railRef.current?.querySelectorAll("button")[n] as HTMLButtonElement | undefined;
    btn?.focus();
    btn?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  };

  return (
    <section className="rv-section rv-ink rv-on-ink" id="bir-gun" aria-labelledby={`${id}-title`}>
      <div className="rv-wrap">
        <div className="rv-day-head">
          <div>
            <h2 id={`${id}-title`}>{d.title}</h2>
            <p>{d.intro}</p>
          </div>
          <div className="rv-tabs" role="group" aria-label={d.toggleLabel}>
            {(["ilkokul", "lise"] as const).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={level === k}
                onClick={() => {
                  setLevel(k);
                  setI(0);
                }}
              >
                {d.toggle[k]}
              </button>
            ))}
          </div>
        </div>

        <div
          className="rv-rail"
          role="tablist"
          aria-label={d.railLabel}
          ref={railRef}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") focusStop(Math.min(stops.length - 1, i + 1));
            else if (e.key === "ArrowLeft") focusStop(Math.max(0, i - 1));
            else if (e.key === "Home") focusStop(0);
            else if (e.key === "End") focusStop(stops.length - 1);
            else return;
            e.preventDefault();
          }}
        >
          <span className="rv-rail-progress" style={{ width: `${(i / (stops.length - 1)) * 100}%` }} aria-hidden="true" />
          {stops.map((s, n) => (
            <button
              key={level + s.time}
              type="button"
              role="tab"
              id={`${id}-tab-${n}`}
              aria-selected={n === i}
              aria-controls={`${id}-panel`}
              tabIndex={n === i ? 0 : -1}
              onClick={() => setI(n)}
            >
              {s.time}
            </button>
          ))}
        </div>

        <div className="rv-stop rv-stop-anim" key={level + i} role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${i}`}>
          <Photo k={stop.image} arch reveal={false} sizes="(max-width: 860px) 90vw, 40vw" />
          <div>
            <p className="rv-stop-time" aria-hidden="true">
              {stop.time}
            </p>
            <h3>{stop.title}</h3>
            <p>{stop.text}</p>
            <div className="rv-stop-nav">
              {last ? (
                <>
                  <Link href={tourHref} className="rv-btn rv-btn--seal">
                    {d.cta}
                  </Link>
                  <small>{d.ctaNote}</small>
                </>
              ) : (
                <button type="button" className="rv-btn rv-btn--line" onClick={() => setI(i + 1)}>
                  {stops[i + 1].time}, {stops[i + 1].title.toLocaleLowerCase("tr")}
                  <Icon name="arrow" size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- transport route check ---------- */

export function RouteCheck() {
  const t = tr.kampus.transport;
  const [district, setDistrict] = useState("");
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);
  const errRef = useRef<HTMLInputElement>(null);
  const d = t.districts.find((x) => x.id === district);
  const phoneError = touched && !phoneOk(phone) ? tr.flows.common.errors.phone : "";

  return (
    <div className="rv-transport-panel">
      <div className="rv-field">
        <label className="rv-label" htmlFor="rv-district">
          {t.label}
        </label>
        <select
          id="rv-district"
          className="rv-input"
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value);
            setDone(false);
            setTouched(false);
          }}
        >
          <option value="">{t.placeholder}</option>
          {t.districts.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
      </div>

      <div aria-live="polite">
        {d && d.pickup && d.minutes && (
          <div className="rv-route-result">
            <h3>{t.found(d.name)}</h3>
            <dl className="rv-route-facts">
              <div>
                <dt>{t.pickup}</dt>
                <dd>
                  {d.pickup}
                  <small>{t.pickupNote}</small>
                </dd>
              </div>
              <div>
                <dt>{t.duration}</dt>
                <dd>
                  {d.minutes}
                  <small>dk</small>
                </dd>
              </div>
            </dl>
            <ul className="rv-checks">
              {t.features.map((f) => (
                <li key={f}>
                  <Icon name="check" size={18} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}
        {d && !d.pickup && (
          <div className="rv-route-result">
            <h3>{t.none(d.name)}</h3>
            {done ? (
              <p className="rv-note">
                <Icon name="check" size={20} />
                {t.requestDone}
              </p>
            ) : (
              <form
                noValidate
                className="rv-flow-fields"
                onSubmit={(e) => {
                  e.preventDefault();
                  setTouched(true);
                  if (!phoneOk(phone)) return errRef.current?.focus();
                  setDone(true);
                }}
              >
                <p className="rv-muted">{t.noneText}</p>
                <div className="rv-field">
                  <label className="rv-label" htmlFor="rv-route-phone">
                    {t.requestLabel}
                  </label>
                  <div className="rv-phone">
                    <span className="rv-phone-prefix" aria-hidden="true">
                      +90
                    </span>
                    <input
                      ref={errRef}
                      id="rv-route-phone"
                      className="rv-input"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      placeholder="5xx xxx xx xx"
                      value={phone}
                      aria-invalid={!!phoneError}
                      aria-describedby={phoneError ? "rv-route-phone-err" : undefined}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      onBlur={() => phone && setTouched(true)}
                    />
                  </div>
                  {phoneError && (
                    <p className="rv-error" id="rv-route-phone-err">
                      {phoneError}
                    </p>
                  )}
                </div>
                <button type="submit" className="rv-btn rv-btn--ink" style={{ justifySelf: "start" }}>
                  {t.requestCta}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
