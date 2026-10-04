"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { tr } from "@/content/revak/tr";
import { almanak as a, type AlmanakItem, type AlmanakKind } from "@/content/revak/almanak";
import { KADEMELER, type Kademe } from "@/lib/revak/store";
import { MONTHS, WEEKDAYS } from "@/lib/revak/format";
import { parseIso, isoDate } from "@/lib/revak/schedule";
import { buildIcsDays, downloadText } from "@/lib/revak/ics";
import { Icon } from "../ui/Icon";
import { Sample } from "../ui/Bits";

// The year as a printed almanac: month headings cut like inscriptions, one ruled
// line per day or span. Filters by level and kind; a seal-red "today" rule sits
// between the past and the coming lines (resolved in the browser). Every line,
// or the whole filtered year, goes to the visitor's calendar as an .ics file.

const KINDS = Object.keys(a.kinds) as AlmanakKind[];
const monthKey = (iso: string) => iso.slice(0, 7);

function span(it: AlmanakItem) {
  const s = parseIso(it.start);
  if (!it.end) return { day: String(s.getDate()), wd: WEEKDAYS[s.getDay()] };
  const e = parseIso(it.end);
  const sameMonth = s.getMonth() === e.getMonth();
  return {
    day: `${s.getDate()}-${e.getDate()}`,
    wd: sameMonth ? `${WEEKDAYS[s.getDay()]}-${WEEKDAYS[e.getDay()]}` : `${s.getDate()} ${MONTHS[s.getMonth()]} - ${e.getDate()} ${MONTHS[e.getMonth()]}`,
  };
}

export function AlmanakList() {
  const id = useId();
  const [level, setLevel] = useState<Kademe | "all">("all");
  const [kind, setKind] = useState<AlmanakKind | "all">("all");
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(isoDate(new Date())), []);

  const items = useMemo(
    () =>
      a.items
        .filter((it) => level === "all" || !it.levels || it.levels.includes(level))
        .filter((it) => kind === "all" || it.kind === kind)
        .sort((x, y) => (x.start === y.start ? 0 : x.start < y.start ? -1 : 1)),
    [level, kind],
  );
  const months = useMemo(() => {
    const m = new Map<string, AlmanakItem[]>();
    for (const it of items) m.set(monthKey(it.start), [...(m.get(monthKey(it.start)) ?? []), it]);
    return [...m.entries()];
  }, [items]);
  // the first line that has not ended yet gets the "today" rule above it
  const nextId = today ? items.find((it) => (it.end ?? it.start) >= today)?.id : undefined;

  const ics = (list: AlmanakItem[]) =>
    buildIcsDays(
      list.map((it) => ({
        uid: `almanak-${it.id}`,
        title: `${it.title}${it.half ? ` (${a.half})` : ""}`,
        start: it.start,
        end: it.end,
        description: [it.note, it.kind === "resmi" || it.kind === "donem" ? a.official : a.icsSample].filter(Boolean).join(" · "),
      })),
    );

  return (
    <div className="rv-alm">
      <div className="rv-alm-bar" role="group" aria-label={a.filtersLabel}>
        <div className="rv-alm-filter">
          <span className="rv-label" id={`${id}-lv`}>
            {a.levelLabel}
          </span>
          <div className="rv-seg rv-seg--small" role="group" aria-labelledby={`${id}-lv`}>
            <button type="button" aria-pressed={level === "all"} onClick={() => setLevel("all")}>
              {a.levelAll}
            </button>
            {KADEMELER.map((k) => (
              <button key={k} type="button" aria-pressed={level === k} onClick={() => setLevel(k)}>
                {a.levelsShort[k]}
              </button>
            ))}
          </div>
        </div>
        <div className="rv-field rv-alm-kindsel">
          <label className="rv-label" htmlFor={`${id}-kind`}>
            {a.kindLabel}
          </label>
          <select id={`${id}-kind`} className="rv-input" value={kind} onChange={(e) => setKind(e.target.value as AlmanakKind | "all")}>
            <option value="all">{a.kindAll}</option>
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {a.kinds[k]}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="rv-btn rv-btn--ink rv-btn--sm rv-alm-all" disabled={!items.length} onClick={() => downloadText(ics(items), a.icsFile)}>
          <Icon name="calendar" size={18} />
          {a.addAll(items.length)}
        </button>
      </div>

      <div aria-live="polite" className="rv-alm-count rv-sr">
        {items.length}
      </div>

      {!items.length && <p className="rv-alm-empty">{a.empty}</p>}

      {months.map(([key, list]) => {
        const d = parseIso(`${key}-01`);
        return (
          <section key={key} className="rv-alm-month" aria-labelledby={`${id}-${key}`}>
            <h2 id={`${id}-${key}`} className="rv-alm-mname">
              {MONTHS[d.getMonth()]} <span className="rv-num">{d.getFullYear()}</span>
            </h2>
            <ol className="rv-alm-days">
              {list.map((it) => {
                const s = span(it);
                const official = it.kind === "resmi" || it.kind === "donem";
                const past = today ? (it.end ?? it.start) < today : false;
                return (
                  <li key={it.id} className={["rv-alm-line", `is-${it.kind}`, past ? "is-past" : ""].filter(Boolean).join(" ")}>
                    {it.id === nextId && (
                      <span className="rv-alm-today" aria-hidden="true">
                        {a.today}
                      </span>
                    )}
                    <p className="rv-alm-date">
                      <strong className="rv-num">{s.day}</strong>
                      <span>{s.wd}</span>
                    </p>
                    <div className="rv-alm-what">
                      <h3>
                        {it.title}
                        {it.half && <span className="rv-alm-half"> ({a.half})</span>}
                      </h3>
                      {it.note && <p>{it.note}</p>}
                      <p className="rv-alm-tags">
                        <span className={`rv-alm-kind is-${it.kind}`}>{a.kinds[it.kind]}</span>
                        {it.levels && <span>{it.levels.map((k) => a.levelsShort[k]).join(", ")}</span>}
                        {official && <span className="rv-alm-official">{a.official}</span>}
                      </p>
                    </div>
                    <button type="button" className="rv-alm-add" onClick={() => downloadText(ics([it]), `revak-${it.id}.ics`)}>
                      <Icon name="calendar" size={18} />
                      <span className="rv-alm-add-l">{a.addOne}</span>
                      <span className="rv-sr">: {it.title}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      <div className="rv-alm-foot">
        <Sample>{tr.sample.calendar}</Sample>
        <p>{a.sourceNote}</p>
      </div>
    </div>
  );
}
