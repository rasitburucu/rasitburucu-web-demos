"use client";

import { useEffect, useId, useState } from "react";
import { menu, type Allergen, type Dish } from "@/content/revak/yasam";
import { MONTHS } from "@/lib/revak/format";

// The lunch menu as an ink-ruled exercise-book page, two weeks, two kitchens
// (primary and up / kindergarten with three meals). Allergens are small letters in
// circles with a legend; today's row carries a seal-red margin line. Dates are
// resolved in the browser so a static page always shows the current week.

type Week = { range: string; todayIdx: number };

function weeks(now: Date): Week[] {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const wd = d.getDay(); // 0 Sun .. 6 Sat
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((wd + 6) % 7) + (wd === 0 || wd === 6 ? 7 : 0));
  const out: Week[] = [];
  for (let w = 0; w < 2; w++) {
    const a = new Date(monday);
    a.setDate(monday.getDate() + w * 7);
    const b = new Date(a);
    b.setDate(a.getDate() + 4);
    const range = a.getMonth() === b.getMonth() ? `${a.getDate()}-${b.getDate()} ${MONTHS[b.getMonth()]}` : `${a.getDate()} ${MONTHS[a.getMonth()]} - ${b.getDate()} ${MONTHS[b.getMonth()]}`;
    const todayIdx = w === 0 && wd >= 1 && wd <= 5 ? wd - 1 : -1;
    out.push({ range, todayIdx });
  }
  return out;
}

function Marks({ a }: { a?: Allergen[] }) {
  if (!a?.length) return null;
  return (
    <span className="rv-alg">
      {a.map((x) => (
        <abbr key={x} title={menu.allergens[x]} className="rv-alg-mark">
          {x}
          <span className="rv-sr"> ({menu.allergens[x]})</span>
        </abbr>
      ))}
    </span>
  );
}

function DishLine({ d }: { d: Dish }) {
  return (
    <span className="rv-dish">
      {d.d}
      <Marks a={d.a} />
    </span>
  );
}

export function MenuBook() {
  const id = useId();
  const [w, setW] = useState(0);
  const [tab, setTab] = useState<"ilk" | "ana">("ilk");
  const [cal, setCal] = useState<Week[] | null>(null);
  useEffect(() => setCal(weeks(new Date())), []);
  const today = cal?.[w]?.todayIdx ?? -1;

  return (
    <div className="rv-menubook">
      <div className="rv-menubook-bar">
        <div className="rv-seg" role="group" aria-label={menu.weekLabel}>
          {menu.weeks.map((label, i) => (
            <button key={label} type="button" aria-pressed={w === i} onClick={() => setW(i)}>
              {label}
              {cal && <small>{cal[i].range}</small>}
            </button>
          ))}
        </div>
        <div className="rv-seg" role="group" aria-label={menu.tabLabel}>
          {(["ilk", "ana"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={tab === k} onClick={() => setTab(k)}>
              {menu.tabs[k]}
            </button>
          ))}
        </div>
      </div>

      {cal && w === 0 && cal[0].todayIdx < 0 && <p className="rv-menubook-weekend">{menu.weekend}</p>}
      <div className="rv-menubook-page" id={`${id}-page`} aria-live="polite">
        {tab === "ilk" ? (
          <ol className="rv-menubook-days">
            {menu.ilk[w].map((d, i) => (
              <li key={d.day} className={i === today ? "is-today" : undefined}>
                <p className="rv-menubook-day">
                  {d.day}
                  {i === today && <span className="rv-menubook-today">{menu.today}</span>}
                </p>
                <ul className="rv-menubook-dishes">
                  {d.dishes.map((x) => (
                    <li key={x.d}>
                      <DishLine d={x} />
                    </li>
                  ))}
                </ul>
                <p className="rv-menubook-veg">
                  <span>{menu.vegLabel}</span> {d.veg ? <DishLine d={d.veg} /> : menu.vegSame}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <ol className="rv-menubook-days rv-menubook-days--ana">
            {menu.ana[w].map((d, i) => (
              <li key={d.day} className={i === today ? "is-today" : undefined}>
                <p className="rv-menubook-day">
                  {d.day}
                  {i === today && <span className="rv-menubook-today">{menu.today}</span>}
                </p>
                <dl className="rv-menubook-meals">
                  {(["kahvalti", "ogle", "ikindi"] as const).map((m) => (
                    <div key={m}>
                      <dt>{menu.meals[m]}</dt>
                      <dd>
                        <DishLine d={d[m]} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="rv-menubook-foot">
        <div>
          <h3>{menu.legendTitle}</h3>
          <ul className="rv-alg-legend">
            {(Object.keys(menu.allergens) as Allergen[]).map((x) => (
              <li key={x}>
                <span className="rv-alg-mark" aria-hidden="true">
                  {x}
                </span>
                {menu.allergens[x]}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{menu.principlesTitle}</h3>
          <ul className="rv-menubook-rules">
            {menu.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="rv-menubook-app">{menu.appNote}</p>
        </div>
      </div>
    </div>
  );
}
