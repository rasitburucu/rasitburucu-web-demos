"use client";

import { useEffect, useRef, useState } from "react";
import { tr } from "@/content/gelidonya/tr";
import { MAHSUL } from "@/content/gelidonya/urunler";

type F = { product: string; amount: string; unit: string; where: string; when: string; pack: string; company: string; name: string; contact: string; note: string };
const REQUIRED: (keyof F)[] = ["amount", "where", "when", "name", "contact"];

/** Buyer request for our own produce. Never sent: shows a summary instead. */
export function AliciFormu() {
  const u = tr.urunlerimiz;
  const fl = u.fields;
  const [v, setV] = useState<F>({ product: MAHSUL[0].name, amount: "", unit: fl.units[1], where: "", when: "", pack: u.pack[0], company: "", name: "", contact: "", note: "" });
  const [err, setErr] = useState<Partial<Record<keyof F, string>>>({});
  const [done, setDone] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) box.current?.focus();
  }, [done]);

  const set = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setV((s) => ({ ...s, [k]: e.target.value }));
    if (err[k]) setErr((x) => ({ ...x, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const x: Partial<Record<keyof F, string>> = {};
    for (const k of REQUIRED) if (!v[k].trim()) x[k] = u.required;
    setErr(x);
    const first = REQUIRED.find((k) => x[k]);
    if (first) {
      document.getElementById(`gd-a-${first}`)?.focus();
      return;
    }
    setDone(true);
  };

  const input = (k: keyof F, label: string, opts: { hint?: string; full?: boolean; type?: string; inputMode?: "numeric" | "text" | "email"; auto?: string } = {}) => (
    <div className={`gd-input${opts.full ? " gd-input--full" : ""}`}>
      <label htmlFor={`gd-a-${k}`}>{label}</label>
      <input
        id={`gd-a-${k}`}
        type={opts.type ?? "text"}
        inputMode={opts.inputMode}
        autoComplete={opts.auto ?? "off"}
        placeholder={opts.hint}
        value={v[k]}
        onChange={set(k)}
        aria-invalid={!!err[k]}
        aria-describedby={err[k] ? `gd-a-${k}-e` : undefined}
      />
      {err[k] && (
        <p id={`gd-a-${k}-e`} className="gd-err">
          {err[k]}
        </p>
      )}
    </div>
  );

  if (done) {
    const rows: [string, string][] = [
      [fl.product, v.product],
      [fl.amount, `${v.amount} ${v.unit.toLocaleLowerCase("tr")}`],
      [fl.where, v.where],
      [fl.when, v.when],
      [fl.pack, v.pack],
      [fl.company, v.company || "—"],
      [fl.name, v.name],
      [fl.contact, v.contact],
    ];
    if (v.note) rows.push([fl.note, v.note]);
    return (
      <div className="gd-card gd-slip" ref={box} tabIndex={-1} role="status" aria-labelledby="gd-a-done">
        <h3 id="gd-a-done" className="gd-h3">
          {u.summaryTitle}
        </h3>
        <dl className="gd-slip-rows">
          {rows.map(([a, b]) => (
            <div key={a}>
              <dt>{a}</dt>
              <dd>{b}</dd>
            </div>
          ))}
        </dl>
        <p>{u.summaryText}</p>
        <p className="gd-demo">{u.summaryDemo}</p>
        <div className="gd-slip-act">
          <button type="button" className="gd-btn gd-btn--line" onClick={() => setDone(false)}>
            {u.summaryEdit}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="gd-card gd-form" onSubmit={submit} noValidate aria-labelledby="gd-a-title" data-gd-bar-hide>
      <h2 id="gd-a-title" className="gd-h3">
        {u.formTitle}
      </h2>
      <p className="gd-muted">{u.formLead}</p>
      <div className="gd-req-grid">
        <div className="gd-input gd-input--full">
          <label htmlFor="gd-a-product">{fl.product}</label>
          <select id="gd-a-product" value={v.product} onChange={set("product")}>
            {MAHSUL.map((m) => (
              <option key={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        {input("amount", fl.amount, { inputMode: "numeric" })}
        <div className="gd-input">
          <label htmlFor="gd-a-unit">{fl.unit}</label>
          <select id="gd-a-unit" value={v.unit} onChange={set("unit")}>
            {fl.units.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        {input("where", fl.where, { hint: fl.whereHint })}
        {input("when", fl.when, { hint: fl.whenHint })}
        <div className="gd-input gd-input--full">
          <label htmlFor="gd-a-pack">{fl.pack}</label>
          <select id="gd-a-pack" value={v.pack} onChange={set("pack")}>
            {u.pack.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        {input("company", fl.company, { auto: "organization" })}
        {input("name", fl.name, { auto: "name" })}
        {input("contact", fl.contact, { full: true, auto: "email" })}
        <div className="gd-input gd-input--full">
          <label htmlFor="gd-a-note">{fl.note}</label>
          <textarea id="gd-a-note" value={v.note} onChange={set("note")} />
        </div>
      </div>
      <button type="submit" className="gd-btn gd-btn--dark gd-btn--big">
        {u.submit}
      </button>
      <p className="gd-demo">{u.demo}</p>
    </form>
  );
}
