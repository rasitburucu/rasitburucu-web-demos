"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { tr } from "@/content/gelidonya/tr";
import { DAY, telYaz } from "@/lib/gelidonya/hesap";
import { useOrder } from "@/lib/gelidonya/siparis";

const GUN = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const AY = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const fmt = (t: number) => {
  const d = new Date(t);
  return { day: GUN[d.getUTCDay()], date: `${d.getUTCDate()} ${AY[d.getUTCMonth()]}` };
};

/** Visit booking at the nursery: next ten opening days, a time band, who. Never sent. */
export function RandevuFormu() {
  const p = tr.iletisim;
  const { today } = useOrder();
  const days = useMemo(() => {
    const out: number[] = [];
    for (let t = today + DAY; out.length < 10; t += DAY) if (new Date(t).getUTCDay() !== 0) out.push(t);
    return out;
  }, [today]);
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState(p.slots[0]);
  const [what, setWhat] = useState(p.whatOptions[2]);
  const [people, setPeople] = useState("2");
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [err, setErr] = useState<{ name?: string; tel?: string }>({});
  const [done, setDone] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const chosen = day ?? days[0];

  useEffect(() => {
    if (done) box.current?.focus();
  }, [done]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const x: typeof err = {};
    if (!name.trim()) x.name = p.required;
    const d = tel.replace(/\D/g, "");
    if (!d) x.tel = p.required;
    else if (d.length < 10 || d.length > 11) x.tel = p.phoneInvalid;
    setErr(x);
    if (x.name) document.getElementById("gd-r-name")?.focus();
    else if (x.tel) document.getElementById("gd-r-tel")?.focus();
    else setDone(true);
  };

  if (done) {
    const f = fmt(chosen);
    return (
      <div className="gd-card gd-slip" ref={box} tabIndex={-1} role="status" aria-labelledby="gd-r-done">
        <h3 id="gd-r-done" className="gd-h3">
          {p.slipTitle}
        </h3>
        <dl className="gd-slip-rows">
          <div><dt>{p.day}</dt><dd>{f.date}, {f.day}</dd></div>
          <div><dt>{p.slot}</dt><dd>{slot}</dd></div>
          <div><dt>{p.what}</dt><dd>{what}</dd></div>
          <div><dt>{p.people}</dt><dd>{people}</dd></div>
          <div><dt>{p.name}</dt><dd>{name}</dd></div>
          <div><dt>{p.phone}</dt><dd>{telYaz(tel)}</dd></div>
        </dl>
        <p>{p.slipText}</p>
        <p className="gd-demo">{p.slipDemo}</p>
        <div className="gd-slip-act">
          <button type="button" className="gd-btn gd-btn--line" onClick={() => setDone(false)}>
            {p.slipEdit}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="gd-card gd-form" onSubmit={submit} noValidate aria-labelledby="gd-r-title" data-gd-bar-hide>
      <h2 id="gd-r-title" className="gd-h3">
        {p.formTitle}
      </h2>
      <fieldset className="gd-field">
        <legend>
          {p.day} <span className="gd-legend-hint">({p.sunday})</span>
        </legend>
        <div className="gd-chips gd-days">
          {days.map((t) => {
            const f = fmt(t);
            return (
              <label key={t} className="gd-chip">
                <input type="radio" name="gun" checked={chosen === t} onChange={() => setDay(t)} />
                <span>
                  <b>{f.date}</b>
                  <i>{f.day}</i>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <fieldset className="gd-field">
        <legend>{p.slot}</legend>
        <div className="gd-chips">
          {p.slots.map((s) => (
            <label key={s} className="gd-chip">
              <input type="radio" name="saat" checked={slot === s} onChange={() => setSlot(s)} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="gd-field">
        <legend>{p.what}</legend>
        <div className="gd-chips">
          {p.whatOptions.map((s) => (
            <label key={s} className="gd-chip">
              <input type="radio" name="ne" checked={what === s} onChange={() => setWhat(s)} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="gd-req-grid">
        <div className="gd-input">
          <label htmlFor="gd-r-people">{p.people}</label>
          <select id="gd-r-people" value={people} onChange={(e) => setPeople(e.target.value)}>
            {["1", "2", "3", "4", "5", "6–10"].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="gd-input">
          <label htmlFor="gd-r-name">{p.name}</label>
          <input id="gd-r-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!err.name} aria-describedby={err.name ? "gd-r-name-e" : undefined} />
          {err.name && <p id="gd-r-name-e" className="gd-err">{err.name}</p>}
        </div>
        <div className="gd-input gd-input--full">
          <label htmlFor="gd-r-tel">{p.phone}</label>
          <input id="gd-r-tel" type="tel" inputMode="tel" autoComplete="tel" value={tel} onChange={(e) => setTel(e.target.value)} aria-invalid={!!err.tel} aria-describedby={err.tel ? "gd-r-tel-e" : undefined} />
          {err.tel && <p id="gd-r-tel-e" className="gd-err">{err.tel}</p>}
        </div>
      </div>
      <button type="submit" className="gd-btn gd-btn--dark gd-btn--big">
        {p.submit}
      </button>
      <p className="gd-demo">{p.demo}</p>
    </form>
  );
}
