"use client";

import { tr } from "@/content/gelidonya/tr";
import { calc, defaultWeek, isoWeek, nf, plantingWeeks, weekRange } from "@/lib/gelidonya/hesap";
import { useHesap, type HesapState } from "@/lib/gelidonya/hesap-ctx";
import { useToday } from "@/lib/gelidonya/today";
import { urunById } from "@/content/gelidonya/urunler";

/** The serial-numbered order form a grower signs at the nursery or the dealer,
 *  drawn as the paper it is. On the home page it carries the calculator's
 *  order, filled in as by hand. An example: no real serial, no real stamp. */
export function SiparisFormu({ live = false, preset }: { live?: boolean; preset?: HesapState }) {
  const f = tr.form;
  const today = useToday();
  const shared = useHesap().s;
  const s = preset ?? shared;
  const u = urunById(s.urun);
  const weeks = plantingWeeks(today, u, s.graft);
  const week = s.week !== null && weeks.includes(s.week) ? s.week : defaultWeek(weeks, today);
  const r = calc({ ...s, week });
  const w = isoWeek(week);
  const sw = isoWeek(r.sowing);
  const graft = tr.calc.graftNames[s.graft];
  const anac = s.graft === "asili" ? f.anac : "—";
  return (
    <figure className={`gd-doc${preset ? " gd-doc--copy" : ""}`} id={live ? "siparis-formu" : undefined} aria-labelledby="gd-doc-cap">
      <div className="gd-doc-paper">
        <div className="gd-doc-head">
          <p className="gd-doc-firm">
            <span className="gd-word">{tr.brand.word}</span> {f.firm}
          </p>
          <p className="gd-doc-title">{f.title}</p>
          {preset && <p className="gd-doc-copy">{f.copy}</p>}
          <p className="gd-doc-no">
            {f.no} <span className="gd-tnum">{preset ? "0397" : "0412"}</span> <small>[{f.example}]</small>
          </p>
        </div>
        <dl className="gd-doc-grid">
          <div className="gd-doc-wide">
            <dt>{f.grower}</dt>
            <dd className="gd-ink-blue">{f.growerValue}</dd>
          </div>
          <div>
            <dt>{f.place}</dt>
            <dd className="gd-ink-blue">{preset ? f.placeValue2 : f.placeValue}</dd>
          </div>
          <div>
            <dt>{f.phone}</dt>
            <dd className="gd-ink-blue">{f.phoneValue}</dd>
          </div>
        </dl>
        <table className="gd-doc-table">
          <thead>
            <tr>
              <th scope="col">{f.cols.urun}</th>
              <th scope="col">{f.cols.asi}</th>
              <th scope="col">{f.cols.govde}</th>
              <th scope="col">{f.cols.viyol}</th>
              <th scope="col">{f.cols.adet}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="gd-ink-blue gd-doc-fresh" key={`${s.urun}${s.graft}${r.stems}${s.tray}${s.donum}`}>
              <td>{u.name}</td>
              <td>
                {graft}
                {s.graft === "asili" ? ` / ${anac}` : ""}
              </td>
              <td>{tr.calc.stemNames[r.stems]}</td>
              <td className="gd-tnum">
                {nf(r.viyol)} × {s.tray}
              </td>
              <td>{nf(r.fide)}</td>
            </tr>
          </tbody>
        </table>
        <dl className="gd-doc-grid">
          <div className="gd-doc-wide">
            <dt>{f.delivery}</dt>
            <dd className="gd-ink-blue gd-doc-fresh" key={week}>
              {f.deliveryValue(w.w, weekRange(week), w.y)}
            </dd>
          </div>
          <div>
            <dt>{f.sowing}</dt>
            <dd className="gd-ink-blue gd-doc-fresh" key={r.sowing}>
              {f.sowingValue(sw.w, sw.y)}
            </dd>
          </div>
          <div>
            <dt>{f.seed}</dt>
            <dd>
              <span className="gd-doc-box" data-on>
                ✓
              </span>{" "}
              {f.seedOurs}{" "}
              <span className="gd-doc-box" aria-hidden="true" /> {f.seedMine}
            </dd>
          </div>
          <div>
            <dt>{f.deposit}</dt>
            <dd>{f.depositValue}</dd>
          </div>
          <div>
            <dt>{f.pickup}</dt>
            <dd className="gd-ink-blue">{f.pickupValue}</dd>
          </div>
        </dl>
        <div className="gd-doc-sign">
          <p>{f.stampDealer}</p>
          <p>{f.signGrower}</p>
          <p>{f.signNursery}</p>
        </div>
      </div>
      <figcaption id="gd-doc-cap" className="gd-note">
        {live ? f.caption : f.captionStatic}
      </figcaption>
    </figure>
  );
}
