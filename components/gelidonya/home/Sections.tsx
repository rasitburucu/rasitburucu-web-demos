import Link from "next/link";
import { tr } from "@/content/gelidonya/tr";
import { MAHSUL } from "@/content/gelidonya/urunler";
import { Resim } from "../ui/Resim";

const B = tr.base;

/** Our greenhouses: the plain of plastic down to the sea, then plain words. */
export function Seralar() {
  const s = tr.seralar;
  return (
    <section className="gd-seralar" aria-labelledby="gd-seralar-title">
      <Resim k="ova" className="gd-wide" alt={s.imageAlt} sizes="100vw" />
      <div className="gd-wrap gd-seralar-text">
        <h2 id="gd-seralar-title" className="gd-h2">
          {s.title}
        </h2>
        <div className="gd-prose">
          {s.text.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p>
            <Link href={`${B}/seralarimiz/`} className="gd-link">
              {s.link}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

/** The seedling's road: a real sequence in weeks, so the numbers stay. */
export function Yol() {
  const y = tr.yol;
  return (
    <section className="gd-yol" aria-labelledby="gd-yol-title">
      <div className="gd-wrap">
        <div className="gd-yol-head">
          <h2 id="gd-yol-title" className="gd-h2">
            {y.title}
          </h2>
          <p className="gd-lead">{y.lead}</p>
        </div>
        <ol className="gd-yol-list">
          {y.steps.map((s, i) => (
            <li key={s.title}>
              <span className="gd-yol-n gd-tnum" aria-hidden="true">
                {i + 1}
              </span>
              <p className="gd-yol-week">{s.week}</p>
              <h3 className="gd-h3">{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="gd-yol-more">
          <Link href={`${B}/fidelik/`} className="gd-link">
            {y.link}
          </Link>
        </p>
      </div>
    </section>
  );
}

/** "Kas–May", or "Kas–Ara, Mar–May" for a season with a gap. Months wrap round
 *  the year; the growing year is read from September. */
export function seasonText(months: number[], names: string[]) {
  const on = (m: number) => months.includes(((m % 12) + 12) % 12);
  const runs: string[] = [];
  for (let s = 8; s < 20; s++) {
    if (!on(s) || on(s - 1)) continue;
    let e = s;
    while (on(e + 1) && e - s < 11) e++;
    runs.push(e === s ? names[s % 12] : `${names[s % 12]}–${names[e % 12]}`);
  }
  return runs.join(", ");
}

/** Harvest season as a month table: rows are crops, filled cells are harvest months.
 *  On a phone the table becomes one line per crop: a year strip and the months in words. */
export function Sezon({ caption }: { caption: string }) {
  const u = tr.urunler;
  return (
    <div className="gd-season-wrap">
      <div className="gd-season-list">
        <p className="gd-season-cap">{caption}</p>
        <ul>
          {MAHSUL.map((p) => (
            <li key={p.id}>
              <b>{p.name}</b>
              <span className="gd-season-strip" aria-hidden="true">
                {u.months.map((m, i) => (
                  <i key={m} data-on={p.months.includes(i) || undefined} />
                ))}
              </span>
              <span className="gd-season-when">{seasonText(p.months, u.months)}</span>
            </li>
          ))}
        </ul>
      </div>
      <table className="gd-season">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">
              <span className="gd-sr">Ürün</span>
            </th>
            {u.months.map((m, i) => (
              <th key={m} scope="col" abbr={u.monthsLong[i]}>
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MAHSUL.map((p) => (
            <tr key={p.id}>
              <th scope="row">
                {p.name} <small>{p.type}</small>
              </th>
              {u.months.map((m, i) => {
                const on = p.months.includes(i);
                return (
                  <td key={m} data-on={on || undefined}>
                    <span className="gd-sr">{on ? `${u.monthsLong[i]}: ${u.season}` : ""}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Urunler() {
  const u = tr.urunler;
  return (
    <section className="gd-urunler" aria-labelledby="gd-urunler-title">
      <div className="gd-wrap gd-urunler-grid">
        <div>
          <h2 id="gd-urunler-title" className="gd-h2">
            {u.title}
          </h2>
          <p className="gd-lead">{u.lead}</p>
          <Link href={`${B}/urunlerimiz/`} className="gd-btn gd-btn--dark">
            {u.cta}
          </Link>
        </div>
        <Sezon caption={u.seasonCaption} />
      </div>
    </section>
  );
}

export function Ziyaret() {
  const z = tr.ziyaret;
  const b = tr.brand;
  return (
    <section className="gd-ziyaret" aria-labelledby="gd-ziyaret-title">
      <div className="gd-wrap gd-ziyaret-in">
        <div>
          <h2 id="gd-ziyaret-title" className="gd-h2">
            {z.title}
          </h2>
          <p>{z.text}</p>
        </div>
        <div className="gd-ziyaret-act">
          <Link href={`${B}/iletisim/`} className="gd-btn gd-btn--light gd-btn--big">
            {z.cta}
          </Link>
          <a href={b.phoneHref} className="gd-ziyaret-phone gd-tnum">
            {b.phone}
          </a>
          <span className="gd-ziyaret-note">[{b.phoneNote}]</span>
        </div>
      </div>
    </section>
  );
}
