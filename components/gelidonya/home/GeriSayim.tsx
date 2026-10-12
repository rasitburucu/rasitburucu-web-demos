"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { tr } from "@/content/gelidonya/tr";
import { SOURCE_URL, type Asi } from "@/content/gelidonya/urunler";
import { dayRange, isoWeek, nf, takvim, weekRange } from "@/lib/gelidonya/hesap";
import { FideEvresi } from "../ui/Cizimler";
import { WaButton, WaIcon } from "../shell/Wa";
import { HesapDenetim, useHesapHesabi } from "./Hesap";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The site's promise made visible: "we count back from your planting week".
 *  The sum on top (what to order), the strip under it (when each step happens). */
export function GeriSayim() {
  const g = tr.geri;
  const c = tr.calc;
  const h = useHesapHesabi();
  const { s, u, week, r, thisYear, weekText } = h;
  const tw = isoWeek(week);
  const sw = isoWeek(r.sowing);
  const kind = c.graftNames[s.graft].toLocaleLowerCase("tr");
  const stemsText = c.stemNames[r.stems].toLocaleLowerCase("tr");
  const message = c.message(u.name, kind, stemsText, s.tray, nf(s.donum), nf(r.fide), nf(r.viyol), weekText(week));

  return (
    <section className="gd-sec gd-gs" id="fide-hesabi" aria-labelledby="gd-gs-title">
      <div className="gd-wrap">
        <div className="gd-gs-head">
          <h2 id="gd-gs-title" className="gd-h2">
            {g.title}
          </h2>
          <p className="gd-lead">{g.lead}</p>
        </div>

        <div className="gd-gs-top">
          <div className="gd-calc">
            <HesapDenetim h={h} />
          </div>
          <div className="gd-gs-out">
            <dl className="gd-calc-nums" aria-live="polite">
              <div>
                <dt>{c.outFide}</dt>
                <dd className="gd-tnum">{nf(r.fide)}</dd>
              </div>
              <div>
                <dt>{c.outViyol}</dt>
                <dd className="gd-tnum">{nf(r.viyol)}</dd>
                <dd className="gd-calc-sub">{c.lastTray(r.last, s.tray)}</dd>
              </div>
              <div>
                <dt>{c.outSowing}</dt>
                <dd className="gd-tnum">{c.outSowingValue(sw.w)}</dd>
                <dd className="gd-calc-sub">
                  {weekRange(r.sowing)}
                  {sw.y !== tw.y || sw.y !== thisYear ? ` ${sw.y}` : ""}
                </dd>
              </div>
            </dl>
            <p className="gd-calc-formula">
              <span>{c.formula1(nf(s.donum), nf(u.heads), r.stems, nf(r.fide))}</span>
              <span>{c.formula2(nf(r.fide), s.tray, nf(r.viyol))}</span>
              <span>{c.formula3(tw.w, r.weeks, sw.w)}</span>
            </p>
            <p className="gd-calc-note">
              {u.headsSourced ? (
                <>
                  {c.noteSourced} (
                  <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
                    {c.noteSource}
                    <span className="gd-sr"> {tr.iletisim.newTab}</span>
                  </a>
                  ). {c.noteRest}
                </>
              ) : (
                c.noteUnsourced
              )}
            </p>
          </div>
        </div>

        <Serit graft={s.graft} sowing={r.sowing} weeks={r.weeks} delivery={week} />

        <div className="gd-gs-act">
          <WaButton message={message} className="gd-btn gd-btn--dark">
            <WaIcon /> {c.ask}
          </WaButton>
          <a href="#siparis-formu" className="gd-link">
            {c.toForm}
          </a>
        </div>
      </div>
    </section>
  );
}

/** The countdown strip: an ordered list of the stops from sowing to delivery,
 *  each with its week, its dates and a drawing of the seedling at that stage. */
function Serit({ graft, sowing, weeks, delivery }: { graft: Asi; sowing: number; weeks: number; delivery: number }) {
  const g = tr.geri;
  const stops = takvim(sowing, weeks, graft);
  const ids = stops.map((d) => d.id).join(" ");
  const ref = useRef<HTMLOListElement>(null);
  const last = useRef<{ w: number; pos: Map<string, [number, number]> } | null>(null);

  // the dates only "tick" after the grower changes something, never on load
  const key = `${sowing}|${weeks}|${graft}`;
  const [initial] = useState(key);
  const [moved, setMoved] = useState(false);
  if (key !== initial && !moved) setMoved(true);

  // the seedlings grow out of their cells once, when the strip comes into view
  useEffect(() => {
    const ol = ref.current;
    if (!ol || reduced() || !("IntersectionObserver" in window)) return;
    if (ol.getBoundingClientRect().top < window.innerHeight * 0.85) return;
    ol.dataset.grow = "wait";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        ol.dataset.grow = "go";
        io.disconnect();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(ol);
    return () => io.disconnect();
  }, []);

  // grafted has six stops, ungrafted five: the stops slide to their new places
  useLayoutEffect(() => {
    const ol = ref.current;
    if (!ol) return;
    const box = ol.getBoundingClientRect();
    const items = Array.from(ol.children) as HTMLElement[];
    const pos = new Map(
      items.map((el) => {
        const b = el.getBoundingClientRect();
        return [el.dataset.id ?? "", [b.left - box.left, b.top - box.top]] as [string, [number, number]];
      }),
    );
    const before = last.current;
    last.current = { w: box.width, pos };
    if (!before || before.w !== box.width || reduced() || typeof ol.animate !== "function") return;
    for (const el of items) {
      const was = before.pos.get(el.dataset.id ?? "");
      const now = pos.get(el.dataset.id ?? "")!;
      if (was) {
        const dx = was[0] - now[0];
        const dy = was[1] - now[1];
        if (dx || dy) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 280, easing: EASE });
      } else {
        el.animate([{ opacity: 0, transform: "scale(0.94)" }, { opacity: 1, transform: "none" }], { duration: 280, easing: EASE });
      }
    }
  }, [ids]);

  const yearOf = (t: number) => new Date(t).getUTCFullYear();
  const weekLabel = (a: number, b: number) => {
    const x = isoWeek(a).w;
    const y = isoWeek(b).w;
    return x === y ? g.week(x) : `${x}.–${g.week(y)}`;
  };

  return (
    <div className="gd-serit">
      <h3 className="gd-serit-title">{g.stripTitle(weeks)}</h3>
      <ol ref={ref} className="gd-serit-list" aria-label={g.stripLabel} data-n={stops.length}>
        {stops.map((d, i) => {
          const st = g.stops[d.id];
          const ends = d.id === "ekim" || d.id === "teslim";
          const range = d.id === "ekim" ? weekRange(sowing) : d.id === "teslim" ? weekRange(delivery) : dayRange(d.a, d.b);
          const yr = ends ? yearOf(d.a) : 0;
          const when = `${weekLabel(d.a, d.b)} ${range}${yr ? ` ${yr}` : ""}`;
          return (
            <li key={d.id} data-id={d.id} className={`gd-serit-stop gd-serit-stop--${d.id}`} style={{ "--i": i } as React.CSSProperties}>
              <span className="gd-serit-fig">
                <FideEvresi evre={d.id} asili={graft === "asili"} />
              </span>
              <span className="gd-serit-mark" aria-hidden="true" />
              <span className="gd-serit-text">
                <span className="gd-serit-name">{st.name}</span>
                <span className={`gd-serit-when${moved ? " gd-tick" : ""}`} key={when}>
                  <b>{weekLabel(d.a, d.b)}</b>
                  <span className="gd-tnum">
                    {range}
                    {yr ? ` ${yr}` : ""}
                  </span>
                </span>
                <span className="gd-serit-note">{st.text}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <p className="gd-serit-foot">{g.note}</p>
    </div>
  );
}
