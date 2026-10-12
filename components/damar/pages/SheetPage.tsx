"use client";

// A4 technical sheet for one stone and one pair, printed from the browser
// ("Save as PDF"). Stone, pair and finish come from the address; the
// estimate comes from the visitor's last calculation on the home page.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { href, type Locale } from "@/content/damar/routes";
import { FINISHES, isFinish, isStoneId, STONE_IDS, STONES, type Finish, type StoneId } from "@/content/damar/stones";
import { estimate } from "@/lib/damar/calc";
import { dict, month, num, range, size } from "@/lib/damar/dict";
import { useDamar } from "@/lib/damar/store";
import { ArrowLeft } from "../ui/Icons";
import { UsesList, ValuesTable } from "../ui/Specs";
import { Spread } from "../ui/Spread";

type Sel = { stone: StoneId; pair: number; finish: Finish };

export function SheetPage({ locale }: { locale: Locale }) {
  const d = dict(locale);
  const t = d.sheet;
  const router = useRouter();
  const [sel, setSel] = useState<Sel>({ stone: "karakalem", pair: STONES.karakalem.pairs[0][0], finish: "polished" });
  const [date, setDate] = useState("");
  const quote = useDamar((x) => x.quote);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const stone = isStoneId(q.get("stone")) ? (q.get("stone") as StoneId) : "karakalem";
    const p = Number(q.get("pair"));
    const pair = STONES[stone].pairs.find(([a]) => a === p)?.[0] ?? STONES[stone].pairs[0][0];
    const f = q.get("finish");
    setSel({ stone, pair, finish: isFinish(f) ? f : "polished" });
    setDate(new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", { dateStyle: "long" }).format(new Date()));
  }, [locale]);

  const update = (next: Sel) => {
    setSel(next);
    router.replace(`${href(locale, "sheet")}?stone=${next.stone}&pair=${next.pair}&finish=${next.finish}`, { scroll: false });
  };

  const s = STONES[sel.stone];
  const b = s.block;
  const pair = s.pairs.find(([a]) => a === sel.pair) ?? s.pairs[0];
  const pairText = range(pair[0], pair[1]);
  const est = quote && quote.stone === sel.stone ? estimate(s, quote.m2, quote.t, quote.limit) : null;

  return (
    <div className="dm-sheetwrap">
      <div className="dm-sheetbar dm-noprint">
        <Link href={`${href(locale, "home")}?stone=${sel.stone}&pair=${pair[0]}&finish=${sel.finish}#book`} className="dm-link dm-link--quiet">
          <ArrowLeft />
          {t.back}
        </Link>
        <div className="dm-sheetbar-fields">
          <label>
            <span>{t.stone}</span>
            <select value={sel.stone} onChange={(e) => isStoneId(e.target.value) && update({ ...sel, stone: e.target.value, pair: STONES[e.target.value].pairs[0][0] })}>
              {STONE_IDS.map((id) => (
                <option key={id} value={id}>
                  {STONES[id].name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{t.pair}</span>
            <select value={pair[0]} onChange={(e) => update({ ...sel, pair: Number(e.target.value) })}>
              {s.pairs.map(([a, c]) => (
                <option key={a} value={a}>
                  {range(a, c)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{d.home.ledger.finish}</span>
            <select value={sel.finish} onChange={(e) => isFinish(e.target.value) && update({ ...sel, finish: e.target.value })}>
              {FINISHES.map((f) => (
                <option key={f} value={f}>
                  {d.finishes[f].name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="button" className="dm-btn dm-btn--page" onClick={() => window.print()}>
          {t.print}
        </button>
        <p className="dm-sheetbar-tip">{t.tip}</p>
      </div>

      <article className="dm-sheet-page" aria-labelledby="dm-sheet-h">
        <header className="dm-sheet-head">
          <div className="dm-word dm-word--ink">
            {d.brand.word}
            <small>{d.brand.line}</small>
          </div>
          <div className="dm-sheet-meta">
            <div>{d.sheet.h1}</div>
            <div className="dm-num">{t.no(b.id)}</div>
            <div>
              {t.date}: {date}
            </div>
          </div>
        </header>

        <div className="dm-sheet-title">
          <h1 id="dm-sheet-h">{s.name}</h1>
          <p>{d.stones[sel.stone].line}</p>
          <p className="dm-num">{t.block(b.id, pairText)}</p>
        </div>

        <div className="dm-sheet-grid">
          <figure className="dm-sheet-fig">
            <Spread stone={sel.stone} pair={pair} finish={sel.finish} sizes="40vw" label={t.figure(s.name, pairText)} />
            <figcaption>
              {d.finishes[sel.finish].name} · {size(locale, b.size)} · {b.thickness} cm
            </figcaption>
          </figure>
          <div className="dm-sheet-specs">
            <ValuesTable locale={locale} stone={sel.stone} />
            <p className="dm-sheet-small">{d.values.note}</p>
          </div>
        </div>

        <div className="dm-sheet-grid dm-sheet-grid--3">
          <section>
            <h2>{d.stonePage.blockFacts}</h2>
            <dl>
              <dt>{d.stonePage.block}</dt>
              <dd className="dm-num">{b.id}</dd>
              <dt>{d.stonePage.left}</dt>
              <dd className="dm-num">{d.stonePage.leftValue(s.available.length, b.slabs)}</dd>
              <dt>{d.stonePage.blockSize}</dt>
              <dd className="dm-num">{size(locale, b.blockSize)}</dd>
              <dt>{d.stonePage.thickness}</dt>
              <dd className="dm-num">{b.thickness} cm</dd>
              <dt>{d.stonePage.blockFacts}</dt>
              <dd>{d.stonePage.quarried(month(locale, b.cut))}</dd>
            </dl>
          </section>
          <section>
            <h2>{d.formats.title}</h2>
            <ul>
              <li>{d.formats.slabsAll}</li>
              <li>{d.formats.tiles}</li>
              <li>{d.formats.stairs}</li>
              <li>{d.formats.tops}</li>
            </ul>
          </section>
          <section>
            <h2>{d.stonePage.usesTitle}</h2>
            <UsesList locale={locale} stone={sel.stone} />
          </section>
        </div>

        <section>
          <h2>{d.stonePage.finishesTitle}</h2>
          <div className="dm-sheet-fin">
            {FINISHES.map((f) => (
              <div key={f}>
                <b>{d.finishes[f].name}</b>
                <p>{d.finishes[f].about}</p>
              </div>
            ))}
          </div>
        </section>

        {est && quote && (
          <section className="dm-sheet-est">
            <h2>
              {t.estimate} <span>({t.estimateFor(num(locale, quote.m2), `${quote.t} cm`, d.finishes[quote.finish].name.toLocaleLowerCase(d.htmlLang))})</span>
            </h2>
            <p className="dm-num">
              {d.calc.slabs(num(locale, est.slabs))} ({d.calc.waste}) · {d.calc.bundles(num(locale, est.bundles))} · {d.calc.tonnes(num(locale, est.tonnes, 1))} ·{" "}
              {d.calc.containers(num(locale, est.containers))}
            </p>
            <p className="dm-sheet-small">{d.calc.estimate}</p>
          </section>
        )}

        <footer className="dm-sheet-foot">
          <p>
            <b>{t.contact}</b> · {d.footer.phone} ({d.footer.phoneNote}) · {d.footer.email} ({d.footer.emailNote})
          </p>
          <p>{t.note}</p>
        </footer>
      </article>
    </div>
  );
}
