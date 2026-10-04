import type { Metadata } from "next";
import Link from "next/link";
import { tr } from "@/content/kalemkar/tr";
import { ALLERGENS, COUNTER_EXTRAS, DISHES, MENUS, PAIRING_PRICE } from "@/content/kalemkar/menu";
import type { ImageKey } from "@/content/kalemkar/images";
import { Photo } from "@/components/kalemkar/ui/Photo";
import { tl } from "@/lib/kalemkar/format";

export const metadata: Metadata = {
  title: tr.meta.menuTitle,
  description: tr.meta.menuDescription,
  robots: { index: false, follow: false },
};

const m = tr.menuPage;

function Sample() {
  return (
    <span className="kk-sample" title={tr.sampleLong}>
      {tr.sample}
    </span>
  );
}

/** Distance rings around the house, the same top-down language as the sini. */
function SourceMap() {
  const C = 300;
  const k = 4; // px per km
  const pts = tr.sources.map((s) => {
    const a = ((s.deg - 90) * Math.PI) / 180;
    return { ...s, x: C + Math.cos(a) * s.km * k, y: C + Math.sin(a) * s.km * k };
  });
  return (
    <svg className="kk-map" viewBox="0 0 600 600" role="img" aria-label={m.mapLabel}>
      {[20, 40, 60].map((km, i) => (
        <g key={km}>
          <circle cx={C} cy={C} r={km * k} className="kk-map-ring" />
          <text x={C + 6} y={C - km * k - 6} className="kk-map-km">
            {tr.sourcesRings[i]}
          </text>
        </g>
      ))}
      <path d={`M${C} 40 V560 M40 ${C} H560`} className="kk-map-axis" />
      <text x={C} y={30} textAnchor="middle" className="kk-map-km">
        K
      </text>
      {pts.map((p) => (
        <g key={p.key}>
          <line x1={C} y1={C} x2={p.x} y2={p.y} className="kk-map-line" />
          <circle cx={p.x} cy={p.y} r="7" className="kk-map-pt" />
          <text x={p.x + (p.x > C ? 14 : -14)} y={p.y - 4} textAnchor={p.x > C ? "start" : "end"} className="kk-map-name">
            {p.name}
          </text>
          <text x={p.x + (p.x > C ? 14 : -14)} y={p.y + 16} textAnchor={p.x > C ? "start" : "end"} className="kk-map-what">
            {p.what}
          </text>
        </g>
      ))}
      <circle cx={C} cy={C} r="11" className="kk-map-home" />
      <text x={C - 16} y={C + 28} textAnchor="end" className="kk-map-name">
        {tr.sourcesCenter}
      </text>
    </svg>
  );
}

export default function Sofra() {
  return (
    <div className="kk-menu-page">
      <header className="kk-wrap kk-mp-head">
        <div>
          <p className="kk-mp-range">{m.range}</p>
          <h1 className="kk-h1">{m.title}</h1>
          <p className="kk-lede">{m.intro}</p>
        </div>
        <div className="kk-mp-prices">
          {(Object.keys(MENUS) as (keyof typeof MENUS)[]).map((key) => (
            <div key={key} className="kk-mp-price">
              <h2 className="kk-h3">{MENUS[key].label}</h2>
              <p className="kk-mp-amount">
                {tl(MENUS[key].price)} <Sample />
              </p>
              <p className="kk-muted">
                {MENUS[key].plates} tabak, {MENUS[key].hours}. {m.variants[key]}
              </p>
            </div>
          ))}
          <p className="kk-hint">{m.priceLine}</p>
        </div>
      </header>

      <section className="kk-wrap kk-mp-list" aria-label={m.title}>
        <ol>
          {DISHES.map((d, i) => (
            <li key={d.key} className="kk-dish">
              <Photo k={d.key as ImageKey} sizes="(max-width: 767px) 38vw, 220px" className="kk-dish-photo" />
              <div className="kk-dish-text">
                <p className="kk-dish-n">
                  {i + 1}
                  {d.short && <span className="kk-dish-short">{m.shortMark}</span>}
                </p>
                <h2 className="kk-dish-name">{d.name}</h2>
                <p>{d.line}</p>
                <p className="kk-muted">{d.source}</p>
                <p className="kk-dish-allergens">
                  {d.allergens.length
                    ? d.allergens
                        .map((a, i) => {
                          const l = ALLERGENS.find((x) => x.key === a)!.label;
                          // Sentence case after the first item; "Antep" stays a name.
                          return i === 0 || l.startsWith("Antep") ? l : l.charAt(0).toLocaleLowerCase("tr") + l.slice(1);
                        })
                        .join(", ") + ` ${m.contains}.`
                    : m.allergenNone + "."}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <aside className="kk-mp-counter">
          <h2 className="kk-h3">{m.counterTitle}</h2>
          <ul>
            {COUNTER_EXTRAS.map((x) => (
              <li key={x.name}>
                <strong>{x.name}</strong>
                <span className="kk-muted">{x.line}</span>
              </li>
            ))}
          </ul>
          <figure>
            <Photo k="cekic" sizes="(max-width: 767px) 80vw, 26vw" />
          </figure>
        </aside>
      </section>

      <section className="kk-wrap kk-mp-allergens" aria-labelledby="kk-alg">
        <div className="kk-mp-section-head">
          <h2 id="kk-alg" className="kk-h2">
            {m.allergenTitle}
          </h2>
          <p className="kk-lede">{m.allergenNote}</p>
        </div>
        <div className="kk-table-wrap" tabIndex={0} role="region" aria-labelledby="kk-alg">
          <table className="kk-table">
            <caption className="kk-sr">{m.tableCaption}</caption>
            <thead>
              <tr>
                <th scope="col">{m.dishCol}</th>
                {ALLERGENS.map((a) => (
                  <th key={a.key} scope="col" data-key={a.key} title={a.label}>
                    <span>{a.short}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DISHES.map((d) => (
                <tr key={d.key}>
                  <th scope="row">{d.name}</th>
                  {ALLERGENS.map((a) => {
                    const has = d.allergens.includes(a.key);
                    return (
                      <td key={a.key} data-key={a.key} data-has={has || undefined}>
                        {has ? <span aria-label={`${a.label} ${m.contains}`}>●</span> : <span className="kk-sr">yok</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="kk-wrap kk-mp-two">
        <div className="kk-mp-pairing">
          <h2 className="kk-h2">{m.pairingTitle}</h2>
          <p className="kk-lede">{m.pairingBody}</p>
          <ul className="kk-pair-list">
            {DISHES.map((d) => (
              <li key={d.key}>
                <span>{d.name}</span>
                <span className="kk-muted">{d.pairing}</span>
              </li>
            ))}
          </ul>
          <p className="kk-mp-amount">
            {tl(PAIRING_PRICE)} <Sample />
          </p>
        </div>
        <div className="kk-mp-sources">
          <h2 className="kk-h2">{m.sourcesTitle}</h2>
          <p className="kk-lede">{m.sourcesBody}</p>
          <SourceMap />
          <ul className="kk-sr">
            {tr.sources.map((s) => (
              <li key={s.key}>
                {s.name}, yaklaşık {s.km} km: {s.what}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="kk-wrap kk-mp-past" aria-labelledby="kk-past">
        <div>
          <h2 id="kk-past" className="kk-h3">
            {m.pastTitle}
          </h2>
          <p className="kk-muted">{m.pastBody}</p>
        </div>
        <ul>
          {m.past.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <figure className="kk-mp-past-photo">
          <Photo k="fistik" sizes="(max-width: 767px) 60vw, 18vw" />
        </figure>
      </section>

      <div className="kk-wrap kk-mp-cta">
        <Link href={`${tr.base}/rezervasyon/`} className="kk-btn kk-btn--accent">
          {m.book}
        </Link>
      </div>
    </div>
  );
}
