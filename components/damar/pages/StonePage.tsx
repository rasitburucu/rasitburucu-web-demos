import Link from "next/link";
import { href, type Locale } from "@/content/damar/routes";
import { FINISHES, STONE_IDS, STONES, type StoneId } from "@/content/damar/stones";
import { dict, month, range, size } from "@/lib/damar/dict";
import { ArrowLeft, ArrowRight, Sheet } from "../ui/Icons";
import { SampleTile } from "../ui/Slab";
import { UsesList, ValuesTable } from "../ui/Specs";
import { Spread } from "../ui/Spread";
import { AddSampleButton } from "./AddSampleButton";

/** One stone, one block: the first pair large, every pair of the block in
 *  cut order, the test values, the finishes and where it works. */
export function StonePage({ locale, id }: { locale: Locale; id: StoneId }) {
  const d = dict(locale);
  const p = d.stonePage;
  const s = STONES[id];
  const b = s.block;
  const i = STONE_IDS.indexOf(id);
  const prev = STONE_IDS[(i + STONE_IDS.length - 1) % STONE_IDS.length];
  const next = STONE_IDS[(i + 1) % STONE_IDS.length];
  const home = href(locale, "home");
  const first = s.pairs[0];

  return (
    <>
      <div className="dm-wrap dm-crumbs">
        <Link href={href(locale, "stones")} className="dm-link dm-link--quiet">
          <ArrowLeft />
          {p.back}
        </Link>
      </div>

      <section className="dm-wrap dm-stonehero" aria-labelledby="dm-stone-h">
        <div className="dm-stonehero-text">
          <h1 id="dm-stone-h" className="dm-h1">
            {s.name}
          </h1>
          <p className="dm-stone-line">{d.stones[id].line}</p>
          <p className="dm-lede">{d.stones[id].about}</p>
          <dl className="dm-facts dm-facts--wide">
            <div>
              <dt>{p.block}</dt>
              <dd className="dm-num">{b.id}</dd>
            </div>
            <div>
              <dt>{p.left}</dt>
              <dd className="dm-num">{p.leftValue(s.available.length, b.slabs)}</dd>
            </div>
            <div>
              <dt>{p.slabSize}</dt>
              <dd className="dm-num">{size(locale, b.size)}</dd>
            </div>
            <div>
              <dt>{p.thickness}</dt>
              <dd className="dm-num">{b.thickness} cm</dd>
            </div>
            <div>
              <dt>{p.blockSize}</dt>
              <dd className="dm-num">{size(locale, b.blockSize)}</dd>
            </div>
            <div>
              <dt>{p.blockFacts}</dt>
              <dd>{p.quarried(month(locale, b.cut))}</dd>
            </div>
          </dl>
          <div className="dm-actions">
            <Link href={`${home}?stone=${id}#book`} className="dm-btn dm-btn--page">
              {p.seePairs}
              <ArrowRight />
            </Link>
            <Link href={`${href(locale, "samples")}?stone=${id}#quote`} className="dm-btn dm-btn--line">
              {p.quote}
            </Link>
            <AddSampleButton locale={locale} stone={id} pair={first[0]} />
            <Link href={`${href(locale, "sheet")}?stone=${id}`} className="dm-btn dm-btn--line">
              <Sheet />
              {p.sheet}
            </Link>
          </div>
        </div>
        <div className="dm-stonehero-img dm-table-bg">
          <Spread stone={id} pair={first} sizes="(max-width: 1023px) 46vw, 24vw" priority label={d.home.book.pairLabel(first[0], first[1], b.id)} />
        </div>
      </section>

      <section className="dm-wrap dm-pairs" aria-labelledby="dm-pairs-h">
        <div className="dm-pairs-head">
          <h2 id="dm-pairs-h" className="dm-h2">
            {p.pairsTitle}
          </h2>
          <p className="dm-lede">{p.pairsText}</p>
        </div>
        <ol className="dm-pairs-row">
          {s.pairs.map(([a, c]) => (
            <li key={a}>
              <Link href={`${home}?stone=${id}&pair=${a}#book`} aria-label={p.pairLink(a, c)}>
                <Spread stone={id} pair={[a, c]} sizes="(max-width: 760px) 22vw, 8vw" folios={false} />
                <span className="dm-num">{range(a, c)}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="dm-onpage dm-sheetband" aria-labelledby="dm-values-h">
        <div className="dm-wrap dm-spec">
          <div>
            <h2 id="dm-values-h" className="dm-h2">
              {d.values.title}
            </h2>
            <ValuesTable locale={locale} stone={id} />
            <p className="dm-note-ink">{d.values.note}</p>
          </div>
          <div>
            <h2 className="dm-h2">{d.formats.title}</h2>
            <ul className="dm-formats">
              <li>{d.formats.slabsAll}</li>
              <li>{d.formats.tiles}</li>
              <li>{d.formats.stairs}</li>
              <li>{d.formats.tops}</li>
            </ul>
            <h2 className="dm-h2 dm-spec-uses">{p.usesTitle}</h2>
            <UsesList locale={locale} stone={id} />
          </div>
        </div>
      </section>

      <section className="dm-wrap dm-finishes" aria-labelledby="dm-sfin-h">
        <div className="dm-finishes-head">
          <h2 id="dm-sfin-h" className="dm-h2">
            {p.finishesTitle}
          </h2>
        </div>
        <ul className="dm-swatches">
          {FINISHES.map((f) => (
            <li key={f}>
              <div className="dm-swatch" data-finish={f} data-ground={s.ground}>
                <SampleTile stone={id} alt={`${s.name}, ${d.finishes[f].name}`} className="dm-slab" />
                <span className="dm-sheen" />
                <span className="dm-tex" />
              </div>
              <h3 className="dm-h3">{d.finishes[f].name}</h3>
              <p>{d.finishes[f].about}</p>
            </li>
          ))}
        </ul>
      </section>

      <nav className="dm-wrap dm-stonenav" aria-label={d.nav.items.stones}>
        <Link href={href(locale, "stone", prev)} className="dm-stonenav-link">
          <span className="dm-label">{p.prevStone}</span>
          <span className="dm-stonenav-name">
            <ArrowLeft /> {STONES[prev].name}
          </span>
        </Link>
        <Link href={href(locale, "stone", next)} className="dm-stonenav-link dm-stonenav-link--next">
          <span className="dm-label">{p.nextStone}</span>
          <span className="dm-stonenav-name">
            {STONES[next].name} <ArrowRight />
          </span>
        </Link>
      </nav>
    </>
  );
}
