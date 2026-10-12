"use client";

// Home page state: which stone, which pair, which finish, pair or four-way,
// and the visitor's project (m², thickness, payload). The book, the ledger,
// the table of contents and the wall plate all read from here.
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/content/damar/routes";
import { isFinish, isStoneId, pairIndexOf, STONES, type Finish, type StoneId, type Thickness } from "@/content/damar/stones";
import { estimate, M2_MAX, type Payload } from "@/lib/damar/calc";
import { dict, range } from "@/lib/damar/dict";
import { addSample, saveQuote, showToast } from "@/lib/damar/store";
import { Book, type View } from "./Book";
import { Ledger } from "./Ledger";
import { Toc } from "./Toc";
import { WallPlate } from "./WallPlate";

const parseM2 = (s: string) => {
  const v = Number(s.replace(",", "."));
  return Number.isFinite(v) ? Math.min(M2_MAX, v) : NaN;
};

export function HomeTool({ locale, intro }: { locale: Locale; intro: React.ReactNode }) {
  const d = dict(locale);
  const [stoneId, setStoneId] = useState<StoneId>("karakalem");
  const [pairIndex, setPairIndex] = useState(0);
  const [finish, setFinish] = useState<Finish>("polished");
  const [view, setView] = useState<View>("pair");
  const [m2Text, setM2Text] = useState("120");
  const [t, setT] = useState<Thickness>(2);
  const [limit, setLimit] = useState<Payload>(27);

  const stone = STONES[stoneId];
  const pair = stone.pairs[pairIndex] ?? stone.pairs[0];
  const m2 = parseM2(m2Text);
  const est = useMemo(() => estimate(stone, m2, t, limit), [stone, m2, t, limit]);

  // arriving from a stone page: ?stone=duman&pair=23&finish=honed
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const s = q.get("stone");
    if (!isStoneId(s)) return;
    setStoneId(s);
    setPairIndex(pairIndexOf(STONES[s], Number(q.get("pair")) || undefined));
    setT(STONES[s].block.thickness);
    const f = q.get("finish");
    if (isFinish(f)) setFinish(f);
  }, []);

  // the quote travels to the phone bar and the quote form
  useEffect(() => {
    if (!Number.isFinite(m2) || m2 < 1) return;
    const id = window.setTimeout(() => saveQuote({ stone: stoneId, pair: pair[0], m2, t, finish, limit }), 250);
    return () => window.clearTimeout(id);
  }, [stoneId, pair, m2, t, finish, limit]);

  const chooseStone = (id: StoneId) => {
    if (id === stoneId) return;
    setStoneId(id);
    setPairIndex(0);
    setView("pair");
    setT(STONES[id].block.thickness);
  };

  const add = () => {
    const { result, count } = addSample(stoneId, pair[0], finish);
    const what = `${stone.name} ${range(pair[0], pair[1])}, ${d.finishes[finish].name.toLocaleLowerCase(d.htmlLang)}`;
    if (result === "added") showToast(d.toast.added(what, count), true);
    else showToast(result === "already" ? d.toast.already : d.toast.full, true);
  };

  const jumpToSlab = (n: number) => {
    const i = pairIndexOf(stone, n);
    if (i !== pairIndex) {
      setView("pair");
      setPairIndex(i);
    }
  };

  return (
    <>
      <section className="dm-spread" aria-labelledby="dm-h1">
        <div className="dm-intro">{intro}</div>
        <Toc locale={locale} current={stoneId} onStone={chooseStone} />
        <Book locale={locale} stone={stone} pairIndex={pairIndex} onPair={setPairIndex} finish={finish} view={view} onView={setView} />
        <Ledger
          locale={locale}
          stone={stone}
          pair={pair}
          finish={finish}
          onFinish={setFinish}
          m2Text={m2Text}
          onM2={setM2Text}
          t={t}
          onT={setT}
          limit={limit}
          onLimit={setLimit}
          est={est}
          onAddSample={add}
          onSlab={jumpToSlab}
        />
      </section>
      <WallPlate locale={locale} stone={stone} pair={pair} finish={finish} view={view} onView={setView} />
    </>
  );
}
