"use client";

// The block ledger beside the book: which block, which slabs, how many are
// left, the finish, and what the visitor's project comes to in slabs,
// bundles, tonnes and 20 ft containers. Four blocks of information at most.
import Link from "next/link";
import { href, type Locale } from "@/content/damar/routes";
import { FINISHES, slabStatus, type Finish, type Stone, type Thickness } from "@/content/damar/stones";
import { PAYLOADS, type Estimate, type Payload } from "@/lib/damar/calc";
import { dict, month, num, size } from "@/lib/damar/dict";
import { ArrowRight, Box, Sheet } from "../ui/Icons";

type Props = {
  locale: Locale;
  stone: Stone;
  pair: [number, number];
  finish: Finish;
  onFinish: (f: Finish) => void;
  m2Text: string;
  onM2: (v: string) => void;
  t: Thickness;
  onT: (t: Thickness) => void;
  limit: Payload;
  onLimit: (l: Payload) => void;
  est: Estimate | null;
  onAddSample: () => void;
  onSlab: (n: number) => void;
};

export function Ledger(p: Props) {
  const { locale, stone, pair, est } = p;
  const d = dict(locale);
  const l = d.home.ledger;
  const c = d.calc;
  const blk = stone.block;
  const cells = Array.from({ length: blk.slabs }, (_, i) => i + 1);
  const quoteHref = `${href(locale, "samples")}#quote`;

  return (
    <aside className="dm-ledger" aria-labelledby="dm-ledger-title">
      <div className="dm-ledger-block">
        <h2 id="dm-ledger-title" className="dm-label">
          {l.title}
        </h2>
        <p className="dm-blockno">
          <span className="dm-label">{l.block}</span>
          <span className="dm-blockno-id">{blk.id}</span>
        </p>
        <p className="dm-maker">{l.maker(month(locale, blk.cut))}</p>
      </div>

      <div className="dm-ledger-block">
        <dl className="dm-facts">
          <div>
            <dt>{l.slabs}</dt>
            <dd className="dm-num">{l.slabsValue(pair[0], pair[1], blk.slabs)}</dd>
          </div>
          <div>
            <dt>{l.each}</dt>
            <dd className="dm-num">
              {size(locale, blk.size)} · {blk.thickness} cm
            </dd>
          </div>
          <div>
            <dt>{l.left}</dt>
            <dd className="dm-num">{l.leftValue(stone.available.length)}</dd>
          </div>
        </dl>
        <div className="dm-strip-cells" role="img" aria-label={l.strip(stone.available.length, blk.slabs)} style={{ "--cells": blk.slabs } as React.CSSProperties}>
          {cells.map((n) => {
            const st = slabStatus(blk, n);
            const here = n === pair[0] || n === pair[1];
            return (
              <i
                key={n}
                data-s={here ? "pair" : st}
                onClick={st === "stock" && !here ? () => p.onSlab(n) : undefined}
                title={`${n}`}
              />
            );
          })}
        </div>
        <ul className="dm-legend" aria-hidden="true">
          <li data-s="pair">{l.legend.pair}</li>
          <li data-s="stock">{l.legend.stock}</li>
          <li data-s="reserved">{l.legend.reserved}</li>
          <li data-s="sold">{l.legend.sold}</li>
        </ul>
      </div>

      <div className="dm-ledger-block" role="group" aria-labelledby="dm-finish-label">
        <p id="dm-finish-label" className="dm-label">
          {l.finish}
        </p>
        <div className="dm-seg dm-seg--finish">
          {FINISHES.map((f) => (
            <button key={f} type="button" aria-pressed={p.finish === f} onClick={() => p.onFinish(f)}>
              {d.finishes[f].name}
            </button>
          ))}
        </div>
      </div>

      <div className="dm-ledger-block dm-calc">
        <p className="dm-label" id="dm-project">
          {c.project}
        </p>
        <div className="dm-calc-row">
          <label className="dm-m2">
            <span className="dm-sr">{c.m2}</span>
            <input
              type="number"
              inputMode="decimal"
              min={1}
              max={20000}
              step={1}
              value={p.m2Text}
              onChange={(e) => p.onM2(e.target.value)}
              aria-describedby="dm-calc-res"
            />
            <span aria-hidden="true">{c.m2Unit}</span>
          </label>
          <div className="dm-seg dm-seg--t" role="group" aria-label={c.thickness}>
            {([2, 3] as Thickness[]).map((t) => (
              <button key={t} type="button" aria-pressed={p.t === t} onClick={() => p.onT(t)}>
                {t} cm
              </button>
            ))}
          </div>
        </div>
        <label className="dm-payload">
          <span>{c.payload}</span>
          <select value={p.limit} onChange={(e) => p.onLimit(Number(e.target.value) as Payload)}>
            {PAYLOADS.map((x) => (
              <option key={x} value={x}>
                {c.payloads[x]}
              </option>
            ))}
          </select>
        </label>
        <div className="dm-res" id="dm-calc-res" aria-live="polite">
          {est ? (
            <>
              <p className="dm-res-main dm-num">
                <b>{c.slabs(num(locale, est.slabs))}</b> <span className="dm-res-sub">{c.waste}</span>
                <br />
                {c.bundles(num(locale, est.bundles))} · {c.tonnes(num(locale, est.tonnes, 1))} ·{" "}
                <b>{c.containers(num(locale, est.containers))}</b>
              </p>
              <p className="dm-res-note">
                {p.t !== blk.thickness
                  ? c.thicknessNote(blk.id, `${blk.thickness} cm`, blk.next)
                  : est.over
                    ? c.over(blk.next)
                    : c.enough}{" "}
                {est.roomM2 >= 20 ? c.room(num(locale, Math.floor(est.roomM2 / 10) * 10)) : c.full}
              </p>
            </>
          ) : (
            <p className="dm-res-note">{c.empty}</p>
          )}
        </div>
        <div className="dm-ledger-cta" data-dm-bar-hide>
          <Link href={quoteHref} className="dm-btn dm-btn--page dm-btn--block">
            <span>{est ? l.quote(num(locale, est.slabs), blk.id) : l.quoteEmpty}</span>
            <ArrowRight />
          </Link>
          <button type="button" className="dm-btn dm-btn--line dm-btn--block" onClick={p.onAddSample}>
            <Box />
            <span>{l.addSample}</span>
          </button>
          <Link href={`${href(locale, "sheet")}?stone=${stone.id}&pair=${pair[0]}&finish=${p.finish}`} className="dm-link dm-ledger-sheet">
            <Sheet />
            {l.sheet}
          </Link>
        </div>
        <p className="dm-fine">
          {c.estimate} {l.fine}
        </p>
      </div>
    </aside>
  );
}
