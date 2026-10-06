import Link from "next/link";
import { tr } from "@/content/gelidonya/tr";
import { HAZIR, LISTE_TARIHI, MAHSUL } from "@/content/gelidonya/urunler";
import { tarih } from "@/lib/gelidonya/hesap";
import { Resim } from "../ui/Resim";
import { HazirTablo } from "../ui/HazirTablo";
import { SiparisFormu } from "../ui/SiparisFormu";
import type { HesapState } from "@/lib/gelidonya/hesap-ctx";

const B = tr.base;

/** A slice of the ready list: what is on the bench this week. */
export function HazirOnizleme() {
  const h = tr.hazirOn;
  const rows = HAZIR.filter((r) => r.durum !== "olacak").slice(0, 5);
  return (
    <section className="gd-sec gd-sec--white" aria-labelledby="gd-hon-title">
      <div className="gd-wrap">
        <div className="gd-sec-head">
          <div>
            <h2 id="gd-hon-title" className="gd-h2">
              {h.title}
            </h2>
            <p className="gd-lead">{h.lead}</p>
          </div>
          <p className="gd-updated">
            {tr.hazir.updated(tarih(LISTE_TARIHI))}{" "}
            <span className="gd-muted">[{tr.hazir.updatedNote}]</span>
          </p>
        </div>
        <HazirTablo rows={rows} caption={h.title} />
        <p className="gd-sec-more">
          <Link href={`${B}/hazir-fide/`} className="gd-btn gd-btn--dark">
            {h.all(HAZIR.length)}
          </Link>
        </p>
      </div>
    </section>
  );
}

/** How an order goes: a real sequence, so the numbers stay. */
export function Surec({
  headingLevel = 2,
  withLink = true,
  live = false,
  preset,
}: {
  headingLevel?: 2 | 3;
  withLink?: boolean;
  live?: boolean;
  preset?: HesapState;
}) {
  const s = tr.surec;
  const Hd = `h${headingLevel}` as "h2" | "h3";
  return (
    <div className="gd-surec">
      <div className="gd-surec-row">
        <ol className="gd-steps">
          {s.steps.map((st, i) => (
            <li key={st.title}>
              <span className="gd-step-n gd-tnum" aria-hidden="true">
                {i + 1}
              </span>
              <Hd className="gd-h3">{st.title}</Hd>
              <p>{st.text}</p>
            </li>
          ))}
        </ol>
        <SiparisFormu live={live} preset={preset} />
      </div>
      <p className="gd-note">{s.note}</p>
      {withLink && (
        <p>
          <Link href={`${B}/fidelik/#siparis`} className="gd-link">
            {s.link}
          </Link>
        </p>
      )}
    </div>
  );
}

export function SurecSection() {
  const s = tr.surec;
  return (
    <section className="gd-sec" aria-labelledby="gd-surec-title">
      <div className="gd-wrap">
        <div className="gd-sec-head gd-sec-head--narrow">
          <h2 id="gd-surec-title" className="gd-h2">
            {s.title}
          </h2>
          <p className="gd-lead">{s.lead}</p>
        </div>
        <Surec headingLevel={3} live />
      </div>
    </section>
  );
}

/** Our own greenhouses: the reason to buy seedlings here. */
export function Kendi() {
  const k = tr.kendi;
  return (
    <section className="gd-sec gd-sec--white" aria-labelledby="gd-kendi-title">
      <div className="gd-wrap">
        <Resim k="ova" className="gd-band" alt={k.imageAlt} sizes="(min-width: 1440px) 90rem, 100vw" />
        <div className="gd-split gd-band-text">
          <h2 id="gd-kendi-title" className="gd-h2">
            {k.title}
          </h2>
          <div className="gd-prose">
            {k.text.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>
              <Link href={`${B}/seralarimiz/`} className="gd-link">
                {k.link}
              </Link>
            </p>
          </div>
        </div>
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

/** Harvest season as a month table: rows are crops, filled cells are harvest
 *  months. Months run from September (the growing year). On a phone each crop
 *  becomes one line: a year strip and the months in words. */
const ORDER = [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7];
export function Sezon({
  caption,
  compact,
}: {
  caption: string;
  compact?: boolean;
}) {
  const rows = compact
    ? MAHSUL.filter((m) =>
        ["domates", "biber", "hiyar", "patlican"].includes(m.id),
      )
    : MAHSUL;
  return (
    <div className="gd-season-wrap">
      <div className="gd-season-list">
        <p className="gd-season-cap">{caption}</p>
        <ul>
          {rows.map((p) => (
            <li key={p.id}>
              <b>
                {p.name} <small>{p.type}</small>
              </b>
              <span className="gd-season-strip" aria-hidden="true">
                {ORDER.map((i) => (
                  <i key={i} data-on={p.months.includes(i) || undefined} />
                ))}
              </span>
              <span className="gd-season-when">
                {seasonText(p.months, tr.months)}
              </span>
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
            {ORDER.map((i) => (
              <th key={i} scope="col" abbr={tr.monthsLong[i]}>
                {tr.months[i]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id}>
              <th scope="row">
                {p.name} <small>{p.type}</small>
              </th>
              {ORDER.map((i) => {
                const on = p.months.includes(i);
                return (
                  <td key={i} data-on={on || undefined}>
                    <span className="gd-sr">
                      {on ? `${tr.monthsLong[i]}: ${tr.season}` : ""}
                    </span>
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

export function UrunKapisi() {
  const u = tr.urunKapi;
  return (
    <section className="gd-sec" aria-labelledby="gd-uk-title">
      <div className="gd-wrap gd-split">
        <div className="gd-prose">
          <h2 id="gd-uk-title" className="gd-h2">
            {u.title}
          </h2>
          <p>{u.text}</p>
          <p>
            <Link
              href={`${B}/urunlerimiz/#talep`}
              className="gd-btn gd-btn--dark"
            >
              {u.cta}
            </Link>
          </p>
        </div>
        <Sezon caption={u.seasonCaption} compact />
      </div>
    </section>
  );
}

export function Ziyaret() {
  const z = tr.ziyaret;
  const c = tr.contact;
  return (
    <section className="gd-sec gd-sec--ink" aria-labelledby="gd-ziyaret-title">
      <div className="gd-wrap gd-ziyaret">
        <div>
          <h2 id="gd-ziyaret-title" className="gd-h2">
            {z.title}
          </h2>
          <p>{z.text}</p>
          <p>
            <Link
              href={`${B}/iletisim/#harita`}
              className="gd-btn gd-btn--light"
            >
              {z.map}
            </Link>
          </p>
        </div>
        <dl className="gd-facts">
          <div>
            <dt>{tr.iletisim.addressTitle}</dt>
            <dd>
              <address>
                {c.address.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </address>
            </dd>
          </div>
          <div>
            <dt>{z.teslim}</dt>
            <dd>
              <span>
                {z.teslimText}{" "}
                <span className="gd-faint">[{z.teslimNote}]</span>
              </span>
            </dd>
          </div>
          <div>
            <dt>{tr.iletisim.hoursTitle}</dt>
            <dd>
              {c.hours.map((h) => (
                <span key={h}>{h}</span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
