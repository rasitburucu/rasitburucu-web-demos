"use client";

import { useState } from "react";
import type { LessonRow } from "@/content/revak/kademe";

type Labels = { ekLabel: string; totalLabel: string; lesson: string; none: string; caption: string };

/**
 * The weekly timetable as a ruled ledger page. Wide screens: every class side by
 * side, the school's additions marked with a seal dot. Phones: one class at a
 * time, picked from a row of tabs, so the numbers stay large and nothing scrolls sideways.
 */
export function Lessons({ cols, colLabel, rows, id, c }: { cols: string[]; colLabel: string; rows: LessonRow[]; id: string; c: Labels }) {
  const [pick, setPick] = useState(0);
  const total = (i: number) => rows.reduce((s, r) => s + (r.hours[i] ?? 0), 0);

  return (
    <div className="rv-lessons">
      <table className="rv-lessons-table">
        <caption className="rv-sr">{c.caption}</caption>
        <thead>
          <tr>
            <th scope="col">
              <span className="rv-sr">{c.lesson}</span>
            </th>
            {cols.map((col) => (
              <th key={col} scope="col">
                <span className="rv-lessons-colname">{col}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className={r.ek ? "is-ek" : undefined}>
              <th scope="row">
                {r.name}
                {r.ek && <span className="rv-ek-dot" role="img" aria-label={c.ekLabel} />}
              </th>
              {r.hours.map((h, i) => (
                <td key={i}>{h ?? <span aria-label={c.none}>·</span>}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">{c.totalLabel}</th>
            {cols.map((col, i) => (
              <td key={col}>{total(i)}</td>
            ))}
          </tr>
        </tfoot>
      </table>

      {/* phones */}
      <div className="rv-lessons-m">
        <div className="rv-lessons-tabs" role="tablist" aria-label={colLabel}>
          {cols.map((col, i) => (
            <button
              key={col}
              type="button"
              role="tab"
              id={`${id}-t${i}`}
              aria-selected={pick === i}
              aria-controls={`${id}-p`}
              tabIndex={pick === i ? 0 : -1}
              onClick={() => setPick(i)}
              onKeyDown={(e) => {
                const n = e.key === "ArrowRight" ? Math.min(cols.length - 1, i + 1) : e.key === "ArrowLeft" ? Math.max(0, i - 1) : -1;
                if (n < 0) return;
                e.preventDefault();
                setPick(n);
                (e.currentTarget.parentElement?.children[n] as HTMLElement | undefined)?.focus();
              }}
            >
              {col}
            </button>
          ))}
        </div>
        <ul className="rv-lessons-list" role="tabpanel" id={`${id}-p`} aria-labelledby={`${id}-t${pick}`}>
          {rows
            .filter((r) => r.hours[pick] != null)
            .map((r) => (
              <li key={r.name} className={r.ek ? "is-ek" : undefined}>
                <span>
                  {r.name}
                  {r.ek && <span className="rv-ek-dot" role="img" aria-label={c.ekLabel} />}
                </span>
                <strong>{r.hours[pick]}</strong>
              </li>
            ))}
          <li className="rv-lessons-total">
            <span>{c.totalLabel}</span>
            <strong>{total(pick)}</strong>
          </li>
        </ul>
      </div>

      <p className="rv-lessons-key">
        <span className="rv-ek-dot" aria-hidden="true" /> {c.ekLabel}
      </p>
    </div>
  );
}
