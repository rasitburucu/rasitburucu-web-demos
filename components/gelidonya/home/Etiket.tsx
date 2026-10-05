"use client";

import { tr } from "@/content/gelidonya/tr";
import { SOURCE_URL } from "@/content/gelidonya/urunler";
import { isoWeek, nf, weekRange } from "@/lib/gelidonya/hesap";
import { useOrder } from "@/lib/gelidonya/siparis";

/** The trolley label: what the order comes to, with the sum written out. */
export function Etiket({ className }: { className?: string }) {
  const { order, result, today } = useOrder();
  const L = tr.label;
  const f = result.f;
  const tw = isoWeek(order.delivery);
  const sw = isoWeek(result.sowing);
  const formula =
    order.unit === "donum"
      ? L.formulaDonum(nf(order.amount), nf(f.rate), nf(result.base), f.cells, nf(Math.ceil(result.base / f.cells)), f.weeks)
      : L.formulaAdet(nf(result.base), f.cells, nf(Math.ceil(result.base / f.cells)), f.weeks);
  return (
    <aside className={`gd-tag ${className ?? ""}`} aria-label={`${f.name} ${f.kind}: ${nf(result.fide)} ${L.fide.toLocaleLowerCase("tr")}`}>
      <span className="gd-tag-twine" aria-hidden="true" />
      <span className="gd-tag-hole" aria-hidden="true" />
      <p className="gd-tag-name">
        {f.name} <small>{f.kind}</small>
      </p>
      <dl className="gd-tag-rows" aria-live="polite">
        <div>
          <dt>{L.fide}</dt>
          <dd className="gd-tag-big gd-tnum">{nf(result.fide)}</dd>
        </div>
        <div>
          <dt>{L.viyol}</dt>
          <dd>{L.viyolValue(nf(result.viyol), f.cells)}</dd>
        </div>
        <div>
          <dt>{L.sowing}</dt>
          <dd>
            {L.weekValue(sw.w, weekRange(result.sowing))}
            {sw.y !== tw.y ? ` ${sw.y}` : ""}
          </dd>
        </div>
        <div>
          <dt>{L.delivery}</dt>
          <dd>
            {L.weekValue(tw.w, weekRange(order.delivery))}
            {tw.y !== isoWeek(today).y ? ` ${tw.y}` : ""}
          </dd>
        </div>
      </dl>
      <p className="gd-tag-sum">
        {formula} {order.spare && L.spare(nf(result.spareN))}
      </p>
      <p className="gd-tag-note">
        {L.note}{" "}
        {f.id === "domates" || f.id === "domates-a" ? (
          <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
            {L.rateSource}
            <span className="gd-sr"> {tr.iletisim.newTab}</span>
          </a>
        ) : null}
      </p>
    </aside>
  );
}
