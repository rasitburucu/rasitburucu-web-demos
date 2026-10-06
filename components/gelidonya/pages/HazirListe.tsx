"use client";

import { useMemo, useState } from "react";
import { tr } from "@/content/gelidonya/tr";
import { HAZIR, LISTE_TARIHI, URUNLER, urunById, type Asi } from "@/content/gelidonya/urunler";
import { DAY, gunAy, nf } from "@/lib/gelidonya/hesap";
import { HazirTablo, satirAdet } from "../ui/HazirTablo";

const H = tr.hazir;
type Hz = "" | "today" | "two";
type F = { urun: string; asi: "" | Asi; viyol: string; hazir: Hz };
const EMPTY: F = { urun: "", asi: "", viyol: "", hazir: "" };

const products = URUNLER.filter((u) => HAZIR.some((r) => r.urun === u.id));
const trays = [...new Set(HAZIR.map((r) => r.viyol))].sort((a, b) => a - b);
const RANK = { hazir: 0, boylu: 1, olacak: 2 } as const;
const SORTED = [...HAZIR].sort((a, b) => RANK[a.durum] - RANK[b.durum] || a.hazir - b.hazir);

/** Filterable, printable ready list. Filters are native selects in a fixed
 *  grid, so choosing never moves the page; the count is announced. */
export function HazirListe() {
  const [f, setF] = useState<F>(EMPTY);
  const [fold, setFold] = useState(false);
  const set = (k: keyof F) => (e: React.ChangeEvent<HTMLSelectElement>) => setF((o) => ({ ...o, [k]: e.target.value }));
  const rows = useMemo(
    () =>
      SORTED.filter(
        (r) =>
          (!f.urun || r.urun === f.urun) &&
          (!f.asi || r.asi === f.asi) &&
          (!f.viyol || String(r.viyol) === f.viyol) &&
          (!f.hazir || (f.hazir === "today" ? r.durum !== "olacak" : r.hazir <= LISTE_TARIHI + 14 * DAY)),
      ),
    [f],
  );
  const dirty = f.urun || f.asi || f.viyol || f.hazir;
  const active = [f.urun, f.asi, f.viyol, f.hazir].filter(Boolean).length;

  const csv = () => {
    const c = H.cols;
    const head = [c.urun, c.tip, "Aşı", "Anaç", c.govde, c.viyol, c.adet, c.hazir, c.durum];
    const lines = rows.map((r) => [
      urunById(r.urun).name,
      r.tip,
      H.asiNames[r.asi],
      r.asi === "asili" ? r.anac : "",
      H.govdeValue(r.govde),
      String(r.viyol),
      String(satirAdet(r)),
      gunAy(r.hazir),
      H.durum[r.durum],
    ]);
    const text = "﻿" + [head, ...lines].map((l) => l.map((x) => `"${x.replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = H.csvName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="gd-hzl">
      <button type="button" className="gd-btn gd-btn--line gd-filter-toggle" aria-expanded={fold} aria-controls="gd-filtreler" onClick={() => setFold((o) => !o)}>
        {H.filters} ({active}) <span className="gd-muted">{H.count(rows.length, HAZIR.length)}</span>
      </button>
      <form id="gd-filtreler" className="gd-filters" data-open={fold || undefined} onSubmit={(e) => e.preventDefault()} aria-label={H.filters}>
        <div className="gd-in">
          <label htmlFor="gd-f-urun">{H.fUrun}</label>
          <select id="gd-f-urun" value={f.urun} onChange={set("urun")}>
            <option value="">{H.all}</option>
            {products.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
        <div className="gd-in">
          <label htmlFor="gd-f-asi">{H.fAsi}</label>
          <select id="gd-f-asi" value={f.asi} onChange={set("asi")}>
            <option value="">{H.all}</option>
            <option value="asili">{H.asiNames.asili}</option>
            <option value="asisiz">{H.asiNames.asisiz}</option>
          </select>
        </div>
        <div className="gd-in">
          <label htmlFor="gd-f-viyol">{H.fViyol}</label>
          <select id="gd-f-viyol" value={f.viyol} onChange={set("viyol")}>
            <option value="">{H.all}</option>
            {trays.map((t) => (
              <option key={t} value={t}>
                {H.viyolValue(t)}
              </option>
            ))}
          </select>
        </div>
        <div className="gd-in">
          <label htmlFor="gd-f-hazir">{H.fHazir}</label>
          <select id="gd-f-hazir" value={f.hazir} onChange={set("hazir")}>
            <option value="">{H.all}</option>
            <option value="today">{H.hazirOpts.today}</option>
            <option value="two">{H.hazirOpts.two}</option>
          </select>
        </div>
        <div className="gd-filters-foot">
          <p className="gd-count" aria-live="polite">
            <b className="gd-tnum">{H.count(rows.length, HAZIR.length)}</b>
            <span className="gd-muted">{rows.length > 0 ? `${nf(rows.reduce((s, r) => s + satirAdet(r), 0))} fide` : "—"}</span>
          </p>
          <button type="button" className="gd-btn gd-btn--line gd-btn--sm" onClick={() => setF(EMPTY)} disabled={!dirty}>
            {H.reset}
          </button>
        </div>
      </form>
      {rows.length ? (
        <HazirTablo rows={rows} caption={H.title} id="gd-hazir-tablo" />
      ) : (
        <p className="gd-empty" role="status">
          {H.empty}
        </p>
      )}
      <div className="gd-hzl-act">
        <button type="button" className="gd-btn gd-btn--dark" onClick={() => window.print()}>
          {H.print}
        </button>
        <button type="button" className="gd-btn gd-btn--line" onClick={csv} disabled={!rows.length}>
          {H.csv}
        </button>
      </div>
    </div>
  );
}
