"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { tr } from "@/content/revak/tr";
import { belgeler, gozlem, yas } from "@/content/revak/kabul-ek";
import { arches, place, validBirth } from "@/lib/revak/age";
import { numerals } from "@/lib/revak/format";
import { KADEMELER, useShared, type Kademe } from "@/lib/revak/store";
import { Icon } from "../ui/Icon";
import { Sample } from "../ui/Bits";

const c = tr.flows.common;
const sinifLabel = (k: Kademe, id: string) => c.siniflar[k].find((s) => s.id === id)?.label ?? id;

/* ---------- "Çocuğum hangi sınıfa başlar?" ---------- */

export function AgeCalc() {
  const id = useId();
  const { update } = useShared();
  const [birth, setBirth] = useState("");
  const [yearId, setYearId] = useState(yas.years[0].id);
  const year = yas.years.find((y) => y.id === yearId) ?? yas.years[0];
  const ok = birth !== "" && validBirth(birth, year.start);
  const p = ok ? place(birth, year.start) : null;
  const yilForFlow = year.id === "2028-2029" ? undefined : year.id;

  let line = "";
  let notes: string[] = [];
  let primary: { kademe: Kademe; sinif: string } | null = null;
  let alt: { kademe: Kademe; sinif: string; label: string } | null = null;
  if (p?.kind === "young") notes = [yas.notes.tooYoung(p.readyYear)];
  if (p?.kind === "old") notes = [yas.notes.tooOld];
  if (p?.kind === "class") {
    line = yas.result(year.when, sinifLabel(p.kademe, p.sinif));
    primary = { kademe: p.kademe, sinif: p.sinif };
    if (p.early) {
      notes.push(yas.notes.early);
      alt = { kademe: "ilkokul", sinif: "1", label: yas.alt.early };
    }
    if (p.defer) {
      notes.push(yas.notes.defer);
      alt = { kademe: "anaokulu", sinif: "5y", label: yas.alt.defer };
    }
    if (p.kademe !== "anaokulu" && p.sinif !== "1") notes.push(yas.notes.later);
    if (p.sinif === "9") notes.push(yas.notes.hazirlik);
  }
  const path = p?.kind === "class" ? arches(birth, p) : [];
  const href = (x: { kademe: Kademe; sinif: string }) => `/revak/kabul/on-kayit/?kademe=${x.kademe}&sinif=${x.sinif}`;
  const remember = (x: { kademe: Kademe; sinif: string }) => update({ kademe: x.kademe, sinif: x.sinif, ...(yilForFlow ? { yil: yilForFlow } : {}) });

  return (
    <div className="rv-agecalc">
      <form className="rv-agecalc-form" onSubmit={(e) => e.preventDefault()} noValidate>
        <div className="rv-field">
          <label className="rv-label" htmlFor={`${id}-b`}>
            {yas.birth}
          </label>
          <input
            id={`${id}-b`}
            className="rv-input"
            type="date"
            min="2005-01-01"
            max={`${year.start}-09-30`}
            value={birth}
            aria-invalid={birth !== "" && !ok}
            aria-describedby={birth !== "" && !ok ? `${id}-err` : undefined}
            onChange={(e) => setBirth(e.target.value)}
          />
          {birth !== "" && !ok && (
            <p className="rv-error" id={`${id}-err`}>
              {yas.invalid}
            </p>
          )}
        </div>
        <div className="rv-field">
          <label className="rv-label" htmlFor={`${id}-y`}>
            {yas.year}
          </label>
          <select id={`${id}-y`} className="rv-input" value={yearId} onChange={(e) => setYearId(e.target.value)}>
            {yas.years.map((y) => (
              <option key={y.id} value={y.id}>
                {y.label}
              </option>
            ))}
          </select>
        </div>
        <p className="rv-agecalc-tag">
          <Sample>{yas.tag}</Sample>
          <span>{yas.tagText}</span>
        </p>
      </form>

      <div className="rv-agecalc-out" aria-live="polite">
        {!p && <p className="rv-agecalc-empty">{yas.empty}</p>}
        {p && (
          <>
            {line && <p className="rv-agecalc-line">{numerals(line)}</p>}
            <p className="rv-agecalc-months">{yas.monthsShort(p.months, year.start)}</p>
            {notes.map((n) => (
              <p key={n} className="rv-agecalc-note">
                {n}
              </p>
            ))}
            {path.length > 0 && (
              <ol className="rv-agecalc-path" aria-label={yas.timelineLabel}>
                {path.map((a) => {
                  const here = a.kademe !== null && primary?.kademe === a.kademe;
                  const past = a.year < year.start && !here;
                  return (
                    <li key={a.year} className={[here ? "is-here" : "", past ? "is-past" : ""].filter(Boolean).join(" ") || undefined}>
                      <span className="rv-agecalc-arch" aria-hidden="true" />
                      <strong>{a.kademe ? tr.levels.items[a.kademe].name : yas.graduation}</strong>
                      <span>
                        {a.kademe ? yas.sept : yas.june} {a.year}
                      </span>
                      <span>{yas.timelineAge(a.age)}</span>
                    </li>
                  );
                })}
              </ol>
            )}
            {primary && (
              <div className="rv-agecalc-act">
                <Link href={href(primary)} className="rv-btn rv-btn--seal" onClick={() => remember(primary)}>
                  {yas.cta}
                </Link>
                {alt && (
                  <Link href={href(alt)} className="rv-textlink" onClick={() => remember(alt)}>
                    {alt.label}: {yas.ctaAlt.toLocaleLowerCase("tr")}
                  </Link>
                )}
              </div>
            )}
          </>
        )}
        <details className="rv-agecalc-src">
          <summary>{yas.sourceTitle}</summary>
          <p>{yas.source}</p>
        </details>
      </div>
    </div>
  );
}

/* ---------- observation day, by level ---------- */

export function Gozlem() {
  const id = useId();
  const [k, setK] = useState<Kademe>("anaokulu");
  return (
    <div className="rv-gozlem">
      <p className="rv-gozlem-title" id={`${id}-t`}>
        {gozlem.title}
      </p>
      <div className="rv-seg rv-seg--small" role="group" aria-labelledby={`${id}-t`}>
        {KADEMELER.map((x) => (
          <button key={x} type="button" aria-pressed={k === x} onClick={() => setK(x)}>
            {c.kademe[x]}
          </button>
        ))}
      </div>
      <p className="rv-gozlem-text" aria-live="polite">
        {gozlem.items[k]}
      </p>
    </div>
  );
}

/* ---------- documents checklist (ticks stay in this browser only) ---------- */

const DOC_KEY = "revak:belgeler";

export function Documents() {
  const id = useId();
  const { shared } = useShared();
  const [k, setK] = useState<Kademe>("ilkokul");
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    if (shared.kademe) setK(shared.kademe);
  }, [shared.kademe]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DOC_KEY);
      if (raw) setDone((JSON.parse(raw) as unknown[]).filter((x): x is string => typeof x === "string"));
    } catch {
      /* storage blocked */
    }
  }, []);
  const save = (next: string[]) => {
    setDone(next);
    try {
      localStorage.setItem(DOC_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const items = belgeler.items.filter((i) => !i.levels || i.levels.includes(k));
  const n = items.filter((i) => done.includes(i.id)).length;

  return (
    <div className="rv-docs rv-print">
      <p className="rv-docs-printtitle">
        {tr.brand.full} · {belgeler.title} · {c.kademe[k]}
      </p>
      <div className="rv-docs-bar">
        <div className="rv-field">
          <label className="rv-label" htmlFor={`${id}-k`}>
            {belgeler.levelLabel}
          </label>
          <select id={`${id}-k`} className="rv-input" value={k} onChange={(e) => setK(e.target.value as Kademe)}>
            {KADEMELER.map((x) => (
              <option key={x} value={x}>
                {c.kademe[x]}
              </option>
            ))}
          </select>
        </div>
        <p className="rv-docs-progress" aria-live="polite">
          {belgeler.progress(n, items.length)}
        </p>
      </div>
      <ul className="rv-docs-list">
        {items.map((i) => {
          const on = done.includes(i.id);
          return (
            <li key={i.id}>
              <label className={on ? "is-done" : undefined}>
                <input type="checkbox" checked={on} onChange={() => save(on ? done.filter((x) => x !== i.id) : [...done, i.id])} />
                <span className="rv-docs-box" aria-hidden="true">
                  <Icon name="check" size={16} />
                </span>
                <span className="rv-docs-text">
                  {i.text}
                  {i.note && <small>{i.note}</small>}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <div className="rv-docs-act">
        <button type="button" className="rv-btn rv-btn--line rv-btn--sm" onClick={() => window.print()}>
          <Icon name="print" size={18} />
          {belgeler.print}
        </button>
        {done.length > 0 && (
          <button type="button" className="rv-inline-link" onClick={() => save([])}>
            {belgeler.reset}
          </button>
        )}
      </div>
    </div>
  );
}
