import Link from "next/link";
import { href, type Locale } from "@/content/damar/routes";
import { FINISHES, STONE_IDS, STONES } from "@/content/damar/stones";
import { dict, size } from "@/lib/damar/dict";
import { ArrowRight } from "../ui/Icons";
import { SampleTile } from "../ui/Slab";
import { CompareTable, UsesMatrix } from "../ui/Specs";
import { Spread } from "../ui/Spread";

/** Four stones as the chapters of the book, then the comparison, the
 *  finishes and where each stone works. */
export function StonesPage({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const p = d.stonesPage;
  return (
    <>
      <header className="dm-phead dm-wrap">
        <h1 className="dm-h1">{p.h1}</h1>
        <p className="dm-lede">{p.lede}</p>
      </header>

      <section className="dm-wrap dm-chapters" aria-label={p.h1}>
        {STONE_IDS.map((id, i) => {
          const s = STONES[id];
          return (
            <article key={id} className="dm-chapter" aria-labelledby={`dm-ch-${id}`}>
              <Link href={href(locale, "stone", id)} className="dm-chapter-img" tabIndex={-1} aria-hidden="true">
                <Spread stone={id} pair={s.pairs[0]} sizes="(max-width: 760px) 44vw, (max-width: 1280px) 22vw, 15vw" priority={i < 2} folios={false} />
              </Link>
              <div className="dm-chapter-text">
                <p className="dm-chapter-no dm-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 id={`dm-ch-${id}`} className="dm-h2">
                  <Link href={href(locale, "stone", id)}>{s.name}</Link>
                </h2>
                <p className="dm-chapter-line">{d.stones[id].line}</p>
                <p className="dm-chapter-about">{d.stones[id].about}</p>
                <p className="dm-chapter-facts dm-num">
                  <span>{p.inStock(s.available.length, s.block.id)}</span>
                  <span>
                    {size(locale, s.block.size)} · {s.block.thickness} cm
                  </span>
                </p>
                <Link href={href(locale, "stone", id)} className="dm-link">
                  {p.open(s.name)}
                  <ArrowRight />
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <section className="dm-onpage dm-sheetband" aria-labelledby="dm-compare-h">
        <div className="dm-wrap dm-sheetband-in">
          <div className="dm-sheetband-head">
            <h2 id="dm-compare-h" className="dm-h2">
              {p.compare}
            </h2>
            <p className="dm-note-ink">{p.compareNote}</p>
          </div>
          <CompareTable locale={locale} />
        </div>
      </section>

      <section className="dm-wrap dm-finishes" aria-labelledby="dm-fin-h">
        <div className="dm-finishes-head">
          <h2 id="dm-fin-h" className="dm-h2">
            {p.finishesTitle}
          </h2>
          <p className="dm-lede">{p.finishesText}</p>
        </div>
        <ul className="dm-swatches">
          {FINISHES.map((f) => (
            <li key={f}>
              <div className="dm-swatch" data-finish={f} data-ground="light">
                <SampleTile stone="karakalem" alt={p.finishesSwatch(`${STONES.karakalem.name}, ${d.finishes[f].name}`)} className="dm-slab" />
                <span className="dm-sheen" />
                <span className="dm-tex" />
              </div>
              <h3 className="dm-h3">{d.finishes[f].name}</h3>
              <p>{d.finishes[f].about}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="dm-onpage dm-sheetband" aria-labelledby="dm-uses-h">
        <div className="dm-wrap dm-sheetband-in">
          <div className="dm-sheetband-head">
            <h2 id="dm-uses-h" className="dm-h2">
              {p.usesTitle}
            </h2>
            <p className="dm-note-ink">{p.usesNote}</p>
          </div>
          <UsesMatrix locale={locale} />
        </div>
      </section>
    </>
  );
}
