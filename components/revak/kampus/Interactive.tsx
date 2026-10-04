"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { tr } from "@/content/revak/tr";
import { nearestSlots } from "@/lib/revak/schedule";
import { formatPhone, phoneOk } from "@/lib/revak/format";
import { Icon } from "../ui/Icon";
import { Photo } from "../ui/Photo";
import { servis } from "@/content/revak/yasam";
import { Sample } from "../ui/Bits";

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
            <RouteMap id={d.id} name={d.name} pickup={d.pickup} minutes={d.minutes} />
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

/* ---------- route diagram: ink lines from the district to the arch ---------- */

const addMin = (hhmm: string, m: number) => {
  const [h, mm] = hhmm.split(".").map(Number);
  const t = h * 60 + mm + m;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}.${String(t % 60).padStart(2, "0")}`;
};

function RouteMap({ id, name, pickup, minutes }: { id: string; name: string; pickup: string; minutes: number }) {
  const stops = servis.stops[id] ?? [];
  const arrive = addMin(pickup, minutes);
  const W = 560;
  const X0 = 24;
  const X1 = W - 56;
  const Y = 96;
  const n = stops.length;
  const xs = stops.map((_, i) => X0 + ((X1 - X0) * i) / n);
  // half-arch spans between stops: the roads leave the arcade as arches
  const d = [...xs, X1].reduce((acc, x, i, arr) => {
    if (i === 0) return `M${x} ${Y}`;
    const r = (x - arr[i - 1]) / 2;
    return `${acc} A${r} ${r * 0.62} 0 0 1 ${x} ${Y}`;
  }, "");
  return (
    <figure className="rv-routemap">
      <div className="rv-routemap-head">
        <figcaption>{servis.mapTitle(name)}</figcaption>
        <Sample>{tr.sample.schedule}</Sample>
      </div>
      <svg viewBox={`0 0 ${W} 150`} role="img" aria-label={servis.mapLabel(name)}>
        <path d={d} className="rv-routemap-line" />
        <line x1={X0 - 12} x2={W - 8} y1={Y} y2={Y} className="rv-routemap-ground" />
        {stops.map(([stop, time], i) => (
          <g key={stop} transform={`translate(${xs[i]} ${Y})`}>
            <circle r="6" className="rv-routemap-stop" />
            <text y="30" textAnchor={i === 0 ? "start" : "middle"} className="rv-routemap-name">
              {stop}
            </text>
            <text y="50" textAnchor={i === 0 ? "start" : "middle"} className="rv-routemap-time">
              {time}
            </text>
          </g>
        ))}
        <g transform={`translate(${X1} ${Y})`}>
          <path d="M-13 0 V-17 A13 13 0 0 1 13 -17 V0 H7.5 V-16 A7.5 7.5 0 0 0 -7.5 -16 V0 Z" className="rv-routemap-arch" />
          <text y="30" textAnchor="middle" className="rv-routemap-name">
            {servis.school}
          </text>
          <text y="50" textAnchor="middle" className="rv-routemap-time rv-routemap-time--arrive">
            {arrive}
          </text>
        </g>
      </svg>
      <dl className="rv-routemap-facts">
        <div>
          <dt>{servis.arrive}</dt>
          <dd>{arrive}</dd>
        </div>
        <div>
          <dt>{servis.evening}</dt>
          <dd>{servis.eveningText(minutes)}</dd>
        </div>
      </dl>
    </figure>
  );
}

export function RouteRules() {
  return (
    <div className="rv-route-rules">
      <h3>{servis.rulesTitle}</h3>
      <ol>
        {servis.rules.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ol>
    </div>
  );
}
