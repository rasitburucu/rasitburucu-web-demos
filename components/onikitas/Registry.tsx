"use client";

import { useState } from "react";
import { tr, villas } from "@/content/onikitas/tr";
import { emit, store } from "@/lib/onikitas/store";
import { goTo } from "@/lib/onikitas/goto";

// "On iki ev": the facts a buyer asks for, in the DOM (not the canvas), after
// the night. A table on wide screens, one card per house on narrow ones. Each
// house can be sent to the sundial: it becomes the selected villa there, the
// day scrolls back to the evening and focus lands on that house's stone.
// Phones show the first four cards and a "show all" button (twelve cards are
// about eight screens of scrolling).

const FIRST = 4;

const selectedStone = () => document.querySelector<HTMLElement>("[data-dial-panel] [role='radio'][aria-checked='true']");

function see(i: number) {
  store.selected = i;
  emit("selected");
  goTo("ziyaret", selectedStone);
}

export function Registry() {
  const r = tr.registry;
  const c = r.cols;
  const [all, setAll] = useState(false);
  const showAll = () => {
    setAll(true);
    // the first newly shown card takes focus, so keyboard users land on it
    requestAnimationFrame(() => document.getElementById(`evler-${FIRST}`)?.focus());
  };
  return (
    <section id="evler" className="oki-registry" aria-labelledby="evler-title">
      <div className="oki-registry__inner">
        <header className="oki-registry__head">
          <h2 id="evler-title" tabIndex={-1}>
            {r.title}
          </h2>
          <p>{r.lead}</p>
        </header>

        <table className="oki-registry__table">
          <caption className="sr-only">{r.caption}</caption>
          <thead>
            <tr>
              <th scope="col">{c.no}</th>
              <th scope="col">{c.dir}</th>
              <th scope="col" data-num>
                {c.area}
              </th>
              <th scope="col" data-num>
                {c.beds}
              </th>
              <th scope="col" data-num>
                {c.plot}
              </th>
              <th scope="col">{c.pool}</th>
              <th scope="col" data-num>
                {c.hour}
              </th>
              <th scope="col">{c.status}</th>
              <th scope="col">
                <span className="sr-only">{r.see}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {villas.map((v, i) => (
              <tr key={v.no} data-status={v.status}>
                <th scope="row">
                  <span className="oki-registry__no">{v.no}</span>
                </th>
                <td>{v.dir}</td>
                <td data-num>{r.m2(v.area)}</td>
                <td data-num>{v.beds}</td>
                <td data-num>{r.m2(v.plot)}</td>
                <td>{v.pool}</td>
                <td data-num>{v.hour}</td>
                <td>
                  <span className="oki-status" data-status={v.status}>
                    {r.status[v.status]}
                  </span>
                </td>
                <td>
                  <button type="button" className="oki-see" onClick={() => see(i)}>
                    {v.status === "satildi" ? r.seeSimilar : r.see}
                    <span className="sr-only">
                      , {tr.dial.villaPrefix} {v.no}
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ol className="oki-registry__cards" id="evler-kartlar" data-all={all ? "true" : "false"}>
          {villas.map((v, i) => (
            <li key={v.no} data-status={v.status} data-more={i >= FIRST ? "true" : undefined}>
              <article aria-labelledby={`evler-${i}`}>
                <div className="oki-card__head">
                  <h3 id={`evler-${i}`} tabIndex={-1}>
                    {tr.dial.villaPrefix} {v.no}
                  </h3>
                  <span className="oki-status" data-status={v.status}>
                    {r.status[v.status]}
                  </span>
                </div>
                <dl>
                  <div>
                    <dt>{c.dir}</dt>
                    <dd>{v.dir}</dd>
                  </div>
                  <div>
                    <dt>{c.hour}</dt>
                    <dd>{v.hour}</dd>
                  </div>
                  <div>
                    <dt>{c.area}</dt>
                    <dd>{r.m2(v.area)}</dd>
                  </div>
                  <div>
                    <dt>{c.beds}</dt>
                    <dd>{v.beds}</dd>
                  </div>
                  <div>
                    <dt>{c.plot}</dt>
                    <dd>{r.m2(v.plot)}</dd>
                  </div>
                  <div>
                    <dt>{c.pool}</dt>
                    <dd>{v.pool}</dd>
                  </div>
                </dl>
                <button type="button" className="oki-see" onClick={() => see(i)}>
                  {v.status === "satildi" ? r.seeSimilar : r.see}
                  <span className="sr-only">
                    , {tr.dial.villaPrefix} {v.no}
                  </span>
                </button>
              </article>
            </li>
          ))}
        </ol>
        {!all ? (
          <button type="button" className="oki-registry__more" aria-controls="evler-kartlar" aria-expanded="false" onClick={showAll}>
            {r.showAll}
          </button>
        ) : null}

        <p className="oki-registry__note">{r.note}</p>
      </div>
    </section>
  );
}
