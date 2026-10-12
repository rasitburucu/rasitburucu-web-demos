"use client";

// The signature: an open book on a grey viewing table. The two pages are two
// slabs sawn one after the other; the right one is turned over like a page,
// so the veins mirror at the joint. Turning the page brings the next pair of
// the same block; the page edges on either side thin and thicken with the
// pairs behind and ahead. "Fold out to four" opens a four-way match.
// On the first visit of a session the book opens itself once: the second
// slab lies on the first, then turns over to the right. That move is what a
// bookmatch is. Reduced motion: no opening, pages change at once.
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/damar/routes";
import { quadOf, type Finish, type Stone } from "@/content/damar/stones";
import { dict, range } from "@/lib/damar/dict";
import { preloadSlabs, slabSet, supportsAvif } from "@/lib/damar/slabs";
import { Slab } from "../ui/Slab";
import { ArrowLeft, ArrowRight, Pair, Quad } from "../ui/Icons";

export type View = "pair" | "quad";

const PAGE_SIZES = "(max-width: 760px) 46vw, (max-width: 1180px) 40vw, 26vw";
const TILE_SIZES = "(max-width: 760px) 30vw, (max-width: 1180px) 24vw, 16vw";

type Turn = { dir: 1 | -1; from: number; to: number };
type Intro = "closed" | "opening" | "off";
/** set by the layout's first script too (html.dm-opened), so a second visit
 *  in the same session paints the book open from the first frame */
export const OPENED_KEY = "damar-book-opened";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Resolve once the slabs are decoded (or after a short wait), so a turning
 *  page never shows an empty face. */
async function ready(stone: Stone, slabs: number[], sizes: string) {
  const ext = (await supportsAvif()) ? "avif" : "webp";
  const jobs = slabs.map((n) => {
    const img = new Image();
    img.sizes = sizes;
    img.srcset = slabSet(stone.id, n, ext);
    return img.decode().catch(() => undefined);
  });
  await Promise.race([Promise.all(jobs), new Promise((r) => setTimeout(r, 900))]);
}

type Props = {
  locale: Locale;
  stone: Stone;
  pairIndex: number;
  onPair: (i: number) => void;
  finish: Finish;
  view: View;
  onView: (v: View) => void;
};

export function Book({ locale, stone, pairIndex, onPair, finish, view, onView }: Props) {
  const d = dict(locale);
  const b = d.home.book;
  const [turn, setTurn] = useState<Turn | null>(null);
  const [intro, setIntro] = useState<Intro>("closed");
  const [note, setNote] = useState("");
  const [unfolding, setUnfolding] = useState(false);
  const busy = useRef(false);
  const pointer = useRef<{ x: number; y: number; id: number } | null>(null);
  const pairs = stone.pairs;
  const [a, bR] = pairs[pairIndex];

  // the opening, once per session
  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(OPENED_KEY) === "1";
      window.sessionStorage.setItem(OPENED_KEY, "1");
    } catch {
      /* storage off: open anyway */
    }
    if (seen || reduced() || /[?&]stone=/.test(window.location.search)) {
      document.documentElement.classList.add("dm-opened");
      setIntro("off");
      return;
    }
    let alive = true;
    void ready(stone, [pairs[pairIndex][1]], PAGE_SIZES).then(() => alive && setIntro("opening"));
    return () => {
      alive = false;
    };
    // once, for the first pair the visitor sees
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep the neighbours warm: a turn should never wait for the network
  useEffect(() => {
    const near = [pairIndex - 1, pairIndex + 1].filter((i) => i >= 0 && i < pairs.length).flatMap((i) => pairs[i]);
    const id = window.setTimeout(() => preloadSlabs(stone.id, near, PAGE_SIZES), 400);
    return () => window.clearTimeout(id);
  }, [stone.id, pairIndex, pairs]);

  // a new stone opens at its first page, without a turn
  useEffect(() => {
    setTurn(null);
    busy.current = false;
  }, [stone.id]);

  const go = useCallback(
    async (to: number) => {
      if (busy.current || to === pairIndex) return;
      if (intro !== "off") {
        document.documentElement.classList.add("dm-opened");
        setIntro("off");
      }
      if (to < 0 || to >= pairs.length) {
        setNote(to < 0 ? b.first : b.last);
        return;
      }
      setNote("");
      if (view === "quad") onView("pair");
      if (reduced() || view === "quad") {
        onPair(to);
        return;
      }
      busy.current = true;
      await ready(stone, [...pairs[to]], PAGE_SIZES);
      setTurn({ dir: to > pairIndex ? 1 : -1, from: pairIndex, to });
    },
    [pairIndex, pairs, view, onView, onPair, stone, intro, b.first, b.last],
  );

  const done = () => {
    if (!turn) return;
    onPair(turn.to);
    setTurn(null);
    busy.current = false;
  };

  const fold = () => {
    const next: View = view === "pair" ? "quad" : "pair";
    setNote("");
    document.documentElement.classList.add("dm-opened");
    setIntro("off");
    if (next === "quad" && !reduced()) setUnfolding(true);
    onView(next);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      void go(pairIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      void go(pairIndex - 1);
    }
  };

  // swipe: horizontal drags turn the page, vertical ones scroll the page
  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    pointer.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onUp = (e: React.PointerEvent) => {
    const p = pointer.current;
    pointer.current = null;
    if (!p || p.id !== e.pointerId) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) void go(pairIndex + (dx < 0 ? 1 : -1));
  };

  // what the static pages show while a leaf is turning
  const from = turn ? pairs[turn.from] : pairs[pairIndex];
  const to = turn ? pairs[turn.to] : pairs[pairIndex];
  const leftN = turn ? (turn.dir > 0 ? from[0] : to[0]) : a;
  const rightN = turn ? (turn.dir > 0 ? to[1] : from[1]) : bR;
  const frontN = turn ? (turn.dir > 0 ? from[1] : to[1]) : 0;
  const backN = turn ? (turn.dir > 0 ? to[0] : from[0]) : 0;
  const shownIndex = turn ? turn.to : pairIndex;
  const before = shownIndex;
  const after = pairs.length - 1 - shownIndex;
  const closed = intro !== "off" && view === "pair";

  const [q1, q2, q3, q4] = quadOf(stone, pairIndex);
  const label = view === "quad" ? b.quadLabel(q1, q4, stone.block.id) : b.pairLabel(a, bR, stone.block.id);

  return (
    <div className="dm-bookwrap" id="book">
      <div
        className="dm-stage"
        data-view={view}
        data-finish={finish}
        data-ground={stone.ground}
        role="group"
        aria-roledescription={b.region}
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (pointer.current = null)}
      >
        <div className="dm-book" key={stone.id} style={{ "--before": before, "--after": after } as React.CSSProperties} aria-hidden={view === "quad"}>
          <span className="dm-edge dm-edge--l" />
          <span className="dm-edge dm-edge--r" />
          <div className="dm-page dm-page--l">
            <Slab stone={stone.id} n={leftN} sizes={PAGE_SIZES} priority={pairIndex === 0} eager className="dm-slab" />
            <span className="dm-sheen" />
            <span className="dm-tex" />
            <span className="dm-folio">{leftN}</span>
          </div>
          <div className="dm-page dm-page--r" data-blank={closed || undefined}>
            <Slab stone={stone.id} n={rightN} sizes={PAGE_SIZES} priority={pairIndex === 0} eager className="dm-slab dm-mirror" />
            <span className="dm-sheen" />
            <span className="dm-tex" />
            <span className="dm-folio">{rightN}</span>
          </div>
          <span className="dm-gutter" />

          {closed && (
            /* the second slab, face up on the first, before it turns over */
            <div
              className="dm-leaf dm-leaf--intro"
              data-go={intro === "opening" || undefined}
              onAnimationEnd={(e) => {
                if (e.target !== e.currentTarget) return;
                document.documentElement.classList.add("dm-opened");
                setIntro("off");
              }}
            >
              <div className="dm-face dm-face--front">
                <Slab stone={stone.id} n={bR} sizes={PAGE_SIZES} eager className="dm-slab dm-mirror" />
                <span className="dm-sheen" />
                <span className="dm-tex" />
                <span className="dm-folio dm-folio--r">{bR}</span>
              </div>
              <div className="dm-face dm-face--back">
                <Slab stone={stone.id} n={bR} sizes={PAGE_SIZES} eager className="dm-slab" />
                <span className="dm-sheen" />
                <span className="dm-tex" />
                <span className="dm-folio dm-folio--l">{bR}</span>
              </div>
            </div>
          )}

          {turn && (
            <div className="dm-leaf" data-dir={turn.dir} onAnimationEnd={(e) => e.target === e.currentTarget && done()}>
              <div className="dm-face dm-face--front">
                <Slab stone={stone.id} n={frontN} sizes={PAGE_SIZES} eager className="dm-slab dm-mirror" />
                <span className="dm-sheen" />
                <span className="dm-tex" />
                <span className="dm-folio dm-folio--r">{frontN}</span>
              </div>
              <div className="dm-face dm-face--back">
                <Slab stone={stone.id} n={backN} sizes={PAGE_SIZES} eager className="dm-slab" />
                <span className="dm-sheen" />
                <span className="dm-tex" />
                <span className="dm-folio dm-folio--l">{backN}</span>
              </div>
            </div>
          )}
        </div>

        {view === "quad" && (
          <div className="dm-quad" data-unfold={unfolding || undefined} onAnimationEnd={() => setUnfolding(false)}>
            <div className="dm-quad-row">
              <QuadTile stone={stone} n={q1} kind="a" />
              <QuadTile stone={stone} n={q2} kind="b" />
            </div>
            <div className="dm-quad-row dm-quad-row--fold">
              <QuadTile stone={stone} n={q3} kind="c" />
              <QuadTile stone={stone} n={q4} kind="d" />
            </div>
          </div>
        )}
      </div>

      <div className="dm-turns">
        <button type="button" className="dm-turn-btn" onClick={() => void go(pairIndex - 1)} aria-disabled={pairIndex === 0 || undefined}>
          <ArrowLeft />
          <span>{b.prev}</span>
        </button>
        <label className="dm-now">
          <span className="dm-sr">{b.pair}</span>
          <select value={pairIndex} onChange={(e) => void go(Number(e.target.value))}>
            {pairs.map(([x, y], i) => (
              <option key={x} value={i}>
                {range(x, y)}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="dm-turn-btn dm-turn-btn--next" onClick={() => void go(pairIndex + 1)} aria-disabled={pairIndex === pairs.length - 1 || undefined}>
          <span>{b.next}</span>
          <ArrowRight />
        </button>
        <button type="button" className="dm-fold" aria-pressed={view === "quad"} onClick={fold}>
          {view === "quad" ? <Pair /> : <Quad />}
          <span>{view === "quad" ? b.unfold : b.fold}</span>
        </button>
      </div>
      <p className="dm-turn-note" aria-live="polite">
        {note || (view === "quad" ? b.nowQuad(q1, q4) : b.now(a, bR))}
      </p>
      <p className="dm-photo-note">{b.photo}</p>
    </div>
  );
}

/** A landscape tile of the four-way match: the portrait slab turned a quarter
 *  and mirrored like its place in the match (b across, c down, d both). */
function QuadTile({ stone, n, kind }: { stone: Stone; n: number; kind: "a" | "b" | "c" | "d" }) {
  return (
    <div className={`dm-tile dm-tile--${kind}`}>
      <Slab stone={stone.id} n={n} sizes={TILE_SIZES} eager className="dm-slab" />
      <span className="dm-sheen" />
      <span className="dm-tex" />
      <span className="dm-folio">{n}</span>
    </div>
  );
}
