import Link from "next/link";
import { en } from "@/content/damar/en";
import { href, type Locale } from "@/content/damar/routes";
import { STONES } from "@/content/damar/stones";
import { tr } from "@/content/damar/tr";
import { Slab } from "../ui/Slab";

/** Unknown address: a book with its right page missing. The visitor may have
 *  come from either language, so both are on the page. */
export function NotFound() {
  const kk = STONES.karakalem;
  const n = kk.pairs[0][0];
  return (
    <section className="dm-wrap dm-404" aria-labelledby="dm-404-h">
      <div className="dm-404-book dm-table-bg" aria-hidden="true">
        <div className="dm-spreadimg">
          <div className="dm-page dm-page--l">
            <Slab stone="karakalem" n={n} sizes="(max-width: 760px) 44vw, 20vw" className="dm-slab" eager />
            <span className="dm-folio">{n}</span>
          </div>
          <div className="dm-page dm-page--r dm-page--missing">
            <span className="dm-folio">?</span>
          </div>
          <span className="dm-gutter" />
        </div>
      </div>
      <div className="dm-404-text">
        {([
          ["en", en],
          ["tr", tr],
        ] as [Locale, typeof en][]).map(([l, d]) => (
          <div key={l} lang={l} className="dm-404-lang">
            <h1 id={l === "en" ? "dm-404-h" : undefined} className={l === "en" ? "dm-h1" : "dm-h2"}>
              {d.notFound.title}
            </h1>
            <p className="dm-lede">{d.notFound.text}</p>
            <ul className="dm-actions">
              <li>
                <Link href={href(l, "home")} className="dm-btn dm-btn--page">
                  {d.nav.items.home}
                </Link>
              </li>
              <li>
                <Link href={href(l, "stones")} className="dm-btn dm-btn--line">
                  {d.nav.items.stones}
                </Link>
              </li>
              <li>
                <Link href={href(l, "samples")} className="dm-btn dm-btn--line">
                  {d.nav.items.samples}
                </Link>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
