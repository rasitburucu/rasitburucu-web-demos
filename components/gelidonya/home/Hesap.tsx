"use client";

import { useState } from "react";
import { useHesap, type HesapState } from "@/lib/gelidonya/hesap-ctx";
import { tr } from "@/content/gelidonya/tr";
import { URUNLER, urunById, type Asi } from "@/content/gelidonya/urunler";
import { calc, defaultWeek, DONUM, isoWeek, plantingWeeks, weekRange } from "@/lib/gelidonya/hesap";
import { useToday } from "@/lib/gelidonya/today";

/** The seedling sum, shared by the controls, the results and the countdown
 *  strip (and, through the provider, the order form further down). */
export function useHesapHesabi() {
  const c = tr.calc;
  const today = useToday();
  const { s, setS } = useHesap();
  const u = urunById(s.urun);
  const weeks = plantingWeeks(today, u, s.graft);
  const week = s.week !== null && weeks.includes(s.week) ? s.week : defaultWeek(weeks, today);
  const r = calc({ ...s, week });
  const thisYear = isoWeek(today).y;
  const set = (p: Partial<HesapState>) => setS((o) => ({ ...o, ...p }));
  const setUrun = (id: string) => {
    const n = urunById(id);
    setS((o) => ({ ...o, urun: id, graft: n.def.graft, stems: n.def.stems, tray: n.def.tray }));
  };
  const setDonum = (n: number) => set({ donum: Math.min(DONUM.max, Math.max(DONUM.min, Math.round(n) || DONUM.min)) });
  const weekText = (m: number) => {
    const w = isoWeek(m);
    return c.weekValue(w.w, weekRange(m), w.y !== thisYear ? w.y : undefined);
  };
  return { s, set, setUrun, setDonum, u, weeks, week, r, thisYear, weekText };
}

type H = ReturnType<typeof useHesapHesabi>;

/** Product, dönüm, graft, stems, tray, planting week. Every control keeps its
 *  size whatever is chosen, so nothing on the page moves. */
export function HesapDenetim({ h }: { h: H }) {
  const c = tr.calc;
  const { s, set, setUrun, setDonum, u, weeks, week, r, weekText } = h;
  const [draft, setDraft] = useState<string | null>(null);
  const oneStem = u.stems.length === 1;
  return (
    <form className="gd-calc-form" onSubmit={(e) => e.preventDefault()} aria-label={c.title}>
      <div className="gd-in gd-in--product">
        <label htmlFor="gd-c-urun">{c.product}</label>
        <select id="gd-c-urun" value={s.urun} onChange={(e) => setUrun(e.target.value)}>
          {URUNLER.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="gd-in gd-in--donum">
        <label htmlFor="gd-c-donum">{c.donum}</label>
        <div className="gd-stepper">
          <button type="button" onClick={() => setDonum(s.donum - 1)} aria-label={c.minus} disabled={s.donum <= DONUM.min}>
            <span aria-hidden="true">−</span>
          </button>
          <input
            id="gd-c-donum"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            className="gd-tnum"
            value={draft ?? String(s.donum)}
            onFocus={(e) => {
              setDraft(String(s.donum));
              requestAnimationFrame(() => e.target.select());
            }}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
              setDraft(digits);
              if (digits) setDonum(parseInt(digits, 10));
            }}
            onBlur={() => setDraft(null)}
          />
          <button type="button" onClick={() => setDonum(s.donum + 1)} aria-label={c.plus} disabled={s.donum >= DONUM.max}>
            <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>
      <fieldset className="gd-in gd-in--graft">
        <legend>{c.graft}</legend>
        <div className="gd-seg">
          {(["asili", "asisiz"] as Asi[]).map((a) => (
            <label key={a} className="gd-seg-opt">
              <input type="radio" name="gd-c-asi" value={a} checked={s.graft === a} onChange={() => set({ graft: a })} disabled={!u.graft.includes(a)} />
              <span>{c.graftNames[a]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="gd-in gd-in--stems">
        <legend>
          {c.stems}
          <span className="gd-in-hint" aria-live="polite">
            {oneStem ? c.stemOnly : ""}
          </span>
        </legend>
        <div className="gd-seg">
          {([1, 2] as const).map((n) => (
            <label key={n} className="gd-seg-opt">
              <input type="radio" name="gd-c-govde" value={n} checked={r.stems === n} onChange={() => set({ stems: n })} disabled={!u.stems.includes(n)} />
              <span>{c.stemNames[n]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="gd-in gd-in--tray">
        <label htmlFor="gd-c-viyol">{c.tray}</label>
        <select id="gd-c-viyol" value={s.tray} onChange={(e) => set({ tray: Number(e.target.value) })}>
          {u.trays.map((t) => (
            <option key={t} value={t}>
              {c.trayShort(t)}
            </option>
          ))}
        </select>
      </div>
      <div className="gd-in gd-in--week">
        <label htmlFor="gd-c-hafta">{c.week}</label>
        <select id="gd-c-hafta" value={week} onChange={(e) => set({ week: Number(e.target.value) })}>
          {weeks.map((m) => (
            <option key={m} value={m}>
              {weekText(m)}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
