"use client";

import { useState } from "react";
import { useHesap, type HesapState } from "@/lib/gelidonya/hesap-ctx";
import { tr } from "@/content/gelidonya/tr";
import { SOURCE_URL, URUNLER, urunById, type Asi } from "@/content/gelidonya/urunler";
import { calc, defaultWeek, DONUM, isoWeek, nf, plantingWeeks, weekRange } from "@/lib/gelidonya/hesap";
import { useToday } from "@/lib/gelidonya/today";
import { WaButton, WaIcon } from "../shell/Wa";

type State = HesapState;

/** The seedling sum: product, kind, stems, tray, dönüm, planting week ->
 *  seedlings, trays, sowing week, with the formula written out. Every control
 *  keeps its size whatever is chosen, so nothing on the page moves. */
export function Hesap({ toForm = false }: { toForm?: boolean }) {
  const c = tr.calc;
  const today = useToday();
  const { s, setS } = useHesap();
  const [draft, setDraft] = useState<string | null>(null);
  const u = urunById(s.urun);
  const weeks = plantingWeeks(today, u, s.graft);
  const week = s.week !== null && weeks.includes(s.week) ? s.week : defaultWeek(weeks, today);
  const r = calc({ ...s, week });
  const tw = isoWeek(week);
  const sw = isoWeek(r.sowing);
  const thisYear = isoWeek(today).y;
  const set = (p: Partial<State>) => setS((o) => ({ ...o, ...p }));
  const setUrun = (id: string) => {
    const n = urunById(id);
    setS((o) => ({ ...o, urun: id, graft: n.def.graft, stems: n.def.stems, tray: n.def.tray }));
  };
  const setDonum = (n: number) => set({ donum: Math.min(DONUM.max, Math.max(DONUM.min, Math.round(n) || DONUM.min)) });

  const weekText = (m: number) => {
    const w = isoWeek(m);
    return c.weekValue(w.w, weekRange(m), w.y !== thisYear ? w.y : undefined);
  };
  const kind = c.graftNames[s.graft].toLocaleLowerCase("tr");
  const stemsText = c.stemNames[r.stems].toLocaleLowerCase("tr");
  const message = c.message(u.name, kind, stemsText, s.tray, nf(s.donum), nf(r.fide), nf(r.viyol), weekText(week));
  const oneStem = u.stems.length === 1;

  return (
    <div className="gd-calc" aria-labelledby="gd-calc-title">
      <div className="gd-calc-head">
        <h2 id="gd-calc-title" className="gd-calc-title">
          {c.title}
        </h2>
        <p className="gd-calc-lead">{c.lead}</p>
      </div>
      <form className="gd-calc-form" onSubmit={(e) => e.preventDefault()}>
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
                <input
                  type="radio"
                  name="gd-c-govde"
                  value={n}
                  checked={r.stems === n}
                  onChange={() => set({ stems: n })}
                  disabled={!u.stems.includes(n)}
                />
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

      <div className="gd-calc-out" aria-live="polite">
        <dl className="gd-calc-nums">
          <div>
            <dt>{c.outFide}</dt>
            <dd className="gd-tnum">{nf(r.fide)}</dd>
          </div>
          <div>
            <dt>{c.outViyol}</dt>
            <dd className="gd-tnum">{nf(r.viyol)}</dd>
            <dd className="gd-calc-sub">{c.lastTray(r.last, s.tray)}</dd>
          </div>
          <div>
            <dt>{c.outSowing}</dt>
            <dd className="gd-tnum">{c.outSowingValue(sw.w)}</dd>
            <dd className="gd-calc-sub">
              {weekRange(r.sowing)}
              {sw.y !== tw.y || sw.y !== thisYear ? ` ${sw.y}` : ""}
            </dd>
          </div>
        </dl>
        <p className="gd-calc-formula">
          <span>{c.formula1(nf(s.donum), nf(u.heads), r.stems, nf(r.fide))}</span>
          <span>{c.formula2(nf(r.fide), s.tray, nf(r.viyol))}</span>
          <span>{c.formula3(tw.w, r.weeks, sw.w)}</span>
        </p>
      </div>
      <p className="gd-calc-note">
        {u.headsSourced ? (
          <>
            {c.noteSourced} (
            <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
              {c.noteSource}
              <span className="gd-sr"> {tr.iletisim.newTab}</span>
            </a>
            ). {c.noteRest}
          </>
        ) : (
          c.noteUnsourced
        )}
      </p>
      <div className="gd-calc-act">
        <WaButton message={message} className="gd-btn gd-btn--line">
          <WaIcon /> {c.ask}
        </WaButton>
        {toForm && (
          <a href="#siparis-formu" className="gd-link gd-calc-toform">
            {c.toForm}
          </a>
        )}
      </div>
    </div>
  );
}
