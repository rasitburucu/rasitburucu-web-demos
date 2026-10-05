"use client";

import { useEffect, useRef, useState } from "react";
import { tr } from "@/content/gelidonya/tr";
import { FIDELER } from "@/content/gelidonya/urunler";
import { isoWeek, LIMITS, nf, weekRange } from "@/lib/gelidonya/hesap";
import { useOrder } from "@/lib/gelidonya/siparis";
import { Resim } from "../ui/Resim";
import { Etiket } from "./Etiket";
import { SonViyol } from "./SonViyol";

/** Weeks shown at once on wide screens (two rows of three). */
const PER = 6;

/** First screen: the greenhouse aisle, the order desk in front of it, the
 *  last tray of the order on the aisle floor at the front. */
export function Hero() {
  const h = tr.hero;
  const { order, weeks, result, grow, today, setFide, setUnit, setAmount, step, setDelivery } = useOrder();
  const [draft, setDraft] = useState<string | null>(null);
  const weekRow = useRef<HTMLDivElement>(null);
  const f = result.f;
  const sel = Math.max(0, weeks.indexOf(order.delivery));
  const pages = Math.ceil(weeks.length / PER);
  const [page, setPage] = useState(() => Math.floor(sel / PER));
  // the page always opens on the chosen week (also after a product change)
  useEffect(() => setPage(Math.floor(sel / PER)), [sel, order.fideId]);

  // keep the chosen week in view inside its scrolling row
  useEffect(() => {
    const row = weekRow.current;
    const sel = row?.querySelector<HTMLElement>("input:checked")?.parentElement;
    if (row && sel) row.scrollLeft = Math.max(0, sel.offsetLeft - row.offsetLeft - 24);
  }, [order.fideId, weeks]);

  const lim = LIMITS[order.unit];
  const shown = draft ?? nf(order.amount);
  const thisYear = isoWeek(today).y;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = document.getElementById("tezgah");
    target?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    window.setTimeout(() => document.getElementById("gd-ad")?.focus({ preventScroll: true }), 450);
  };

  return (
    <section className="gd-hero" id="siparis" aria-labelledby="gd-hero-title">
      <Resim
        k="sera-ici"
        className="gd-hero-media"
        alt={h.imageAlt}
        sizes="100vw"
        priority
        narrow={{ k: "sera-ici-dar", media: "(max-width: 899px)", sizes: "100vw" }}
      />
      <div className="gd-hero-desk">
        <h1 id="gd-hero-title" className="gd-h1">
          {/* two fixed lines on wide screens: the font swap cannot re-wrap them */}
          {h.title.split(/(?<=,) /).map((line) => (
            <span key={line} className="gd-h1-line">
              {line}{" "}
            </span>
          ))}
        </h1>
        <p className="gd-hero-lead">{h.lead}</p>
        <form className="gd-order" onSubmit={onSubmit} noValidate>
          <fieldset className="gd-field">
            <legend>{h.product}</legend>
            <div className="gd-chips gd-chips--scroll">
              {FIDELER.map((p) => (
                <label key={p.id} className="gd-chip">
                  <input type="radio" name="urun" value={p.id} checked={order.fideId === p.id} onChange={() => setFide(p.id)} />
                  <span>
                    {p.name} <i>{p.kind}</i>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="gd-field">
            <legend>{h.amount}</legend>
            <div className="gd-amount">
              <div className="gd-seg" role="radiogroup" aria-label={h.amount}>
                {(["donum", "adet"] as const).map((u) => (
                  <label key={u} className="gd-seg-opt">
                    <input type="radio" name="birim" value={u} checked={order.unit === u} onChange={() => setUnit(u)} />
                    <span>{u === "donum" ? h.unitDonum : h.unitAdet}</span>
                  </label>
                ))}
              </div>
              <div className="gd-stepper">
                <button type="button" onClick={() => step(-1)} aria-label={h.minus} disabled={order.amount <= lim.min}>
                  <span aria-hidden="true">−</span>
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  aria-label={order.unit === "donum" ? h.amountDonum : h.amountAdet}
                  value={shown}
                  onFocus={(e) => {
                    setDraft(String(order.amount));
                    requestAnimationFrame(() => e.target.select());
                  }}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setDraft(digits);
                    if (digits) setAmount(parseInt(digits, 10));
                  }}
                  onBlur={() => {
                    setDraft(null);
                    if (order.amount < lim.min) setAmount(lim.min);
                  }}
                  className="gd-tnum"
                />
                <button type="button" onClick={() => step(1)} aria-label={h.plus} disabled={order.amount >= lim.max}>
                  <span aria-hidden="true">+</span>
                </button>
              </div>
            </div>
          </fieldset>

          <fieldset className="gd-field">
            <legend>
              {h.week} <span className="gd-legend-hint">({h.weekHint})</span>
            </legend>
            <div className="gd-chips gd-chips--scroll gd-weeks" ref={weekRow}>
              {weeks.map((m, i) => {
                const w = isoWeek(m);
                return (
                  <label key={m} className={`gd-chip gd-chip--week${Math.floor(i / PER) !== page ? " gd-off" : ""}`}>
                    <input type="radio" name="hafta" value={m} checked={order.delivery === m} onChange={() => setDelivery(m)} />
                    <span>
                      <b>
                        {h.weekLabel(w.w)}
                        {w.y !== thisYear ? ` ${w.y}` : ""}
                      </b>
                      <i>{weekRange(m)}</i>
                    </span>
                  </label>
                );
              })}
            </div>
            <div className="gd-week-pager">
              <button type="button" className="gd-btn gd-btn--line gd-btn--sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                <span aria-hidden="true">←</span> {h.weeksPrev}
              </button>
              <button type="button" className="gd-btn gd-btn--line gd-btn--sm" onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} disabled={page >= pages - 1}>
                {h.weeksNext} <span aria-hidden="true">→</span>
              </button>
            </div>
          </fieldset>

          <div className="gd-order-go">
            <button type="submit" className="gd-btn gd-btn--dark gd-btn--big">
              {h.cta}
            </button>
            <p>{h.ctaNote}</p>
          </div>
        </form>
      </div>

      <div className="gd-hero-front">
        <Etiket className="gd-hero-tag" />
        <div className="gd-hero-tray">
          <SonViyol
            f={f}
            filled={result.last}
            grow={grow}
            label={h.trayAlt(result.last, f.cells, `${f.name.toLocaleLowerCase("tr")} (${f.kind})`)}
            className="gd-tray-canvas"
          />
          <p className="gd-tray-cap" aria-hidden="true">
            {h.trayLabel(result.last, f.cells)}
          </p>
        </div>
      </div>
    </section>
  );
}
