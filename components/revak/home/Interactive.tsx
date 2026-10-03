"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { tr } from "@/content/revak/tr";
import { downloadIcs } from "@/lib/revak/ics";
import { istanbul, nearestSlots } from "@/lib/revak/schedule";
import { shortDate } from "@/lib/revak/format";
import { Icon } from "../ui/Icon";
import { Photo } from "../ui/Photo";

/* ---------- alumni: domestic / abroad tabs ---------- */

export function AlumniTabs() {
  const a = tr.alumni;
  const [tab, setTab] = useState<"home" | "abroad">("home");
  const id = useId();
  const tabs = ["home", "abroad"] as const;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const list = tab === "home" ? a.home : a.abroad;
  return (
    <div>
      <div
        className="rv-tabs"
        role="tablist"
        aria-label={a.tabsLabel}
        onKeyDown={(e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          const next = tab === "home" ? "abroad" : "home";
          setTab(next);
          refs.current[tabs.indexOf(next)]?.focus();
        }}
      >
        {tabs.map((k, i) => (
          <button
            key={k}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-${k}`}
            aria-selected={tab === k}
            aria-controls={`${id}-panel`}
            tabIndex={tab === k ? 0 : -1}
            onClick={() => setTab(k)}
          >
            {a.tabs[k]}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${tab}`}>
        <ul className="rv-uni">
          {list.map((u) => (
            <li key={u.name}>
              <span>{u.name}</span>
              <span>{u.n}</span>
            </li>
          ))}
        </ul>
        <p className="rv-uni-rest">{tab === "home" ? a.homeRest : a.abroadRest}</p>
      </div>
    </div>
  );
}

/* ---------- clubs: the row in focus shows its photograph ---------- */

export function ClubList() {
  const c = tr.clubs;
  const [on, setOn] = useState(0);
  const unique = Array.from(new Set(c.items.map((i) => i.image)));
  return (
    <div className="rv-clubs-grid">
      <div>
        <h2 className="rv-h2">{c.title}</h2>
        <p className="rv-lede">{c.intro}</p>
        <ul className="rv-clubs-list">
          {c.items.map((item, i) => (
            <li key={item.name}>
              <button
                type="button"
                aria-pressed={on === i}
                onPointerEnter={() => setOn(i)}
                onFocus={() => setOn(i)}
                onClick={() => setOn(i)}
              >
                <span className="rv-club-name">{item.name}</span>
                <span className="rv-club-range">{item.range}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="rv-clubs-more">{c.more}</p>
      </div>
      <div className="rv-clubs-media" aria-hidden="true">
        <div className="rv-clubs-stack">
          {unique.map((img) => (
            <div key={img} className="rv-club-img" data-on={c.items[on].image === img}>
              <Photo k={img} sizes="(max-width: 860px) 1px, 30vw" reveal={false} />
            </div>
          ))}
        </div>
        <p className="rv-clubs-caption">
          {c.items[on].name}, {c.items[on].range.toLocaleLowerCase("tr")}
        </p>
      </div>
    </div>
  );
}

/* ---------- events: filter + calendar file ---------- */

export function EventTable() {
  const e = tr.events;
  const [mode, setMode] = useState<"all" | "onsite" | "online">("all");
  const items = e.items.filter((i) => mode === "all" || i.mode === mode);
  return (
    <>
      <div className="rv-events-head">
        <h2 className="rv-h2">{e.title}</h2>
        <fieldset className="rv-filter">
          <legend className="rv-sr">{e.filterLabel}</legend>
          {(["all", "onsite", "online"] as const).map((m) => (
            <label key={m}>
              <input type="radio" name="rv-ev-mode" value={m} checked={mode === m} onChange={() => setMode(m)} />
              <span>{e.filters[m]}</span>
            </label>
          ))}
        </fieldset>
      </div>
      {items.length === 0 ? (
        <p className="rv-muted">{e.empty}</p>
      ) : (
        <ul className="rv-events-list">
          {items.map((ev) => (
            <li key={ev.id}>
              <p className="rv-ev-date">
                <strong>{ev.day}</strong>
                <span>
                  {ev.month}, {ev.weekday}
                </span>
              </p>
              <div className="rv-ev-main">
                <h3>{ev.title}</h3>
                <p>{ev.text}</p>
              </div>
              <p className="rv-ev-where">
                {ev.where}
                <span>{ev.time}</span>
              </p>
              <div className="rv-ev-act">
                {"cta" in ev && ev.cta ? (
                  <Link href={ev.cta.href} className="rv-btn rv-btn--seal rv-btn--sm">
                    {ev.cta.label}
                  </Link>
                ) : null}
                <button
                  type="button"
                  className="rv-ev-ics"
                  onClick={() =>
                    downloadIcs(
                      {
                        uid: `${ev.id}-${ev.iso}`,
                        title: `${ev.title} | Revak Okulları`,
                        start: istanbul(ev.iso, ev.start),
                        minutes: ev.minutes,
                        location: ev.mode === "online" ? e.filters.online : `${ev.where}, Revak Okulları, Zekeriyaköy, Sarıyer`,
                        description: ev.text,
                      },
                      `revak-${ev.id}.ics`,
                    )
                  }
                >
                  <Icon name="calendar" size={18} />
                  {e.addToCal}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/* ---------- nearest free tour slots ---------- */

export function NearestSlots() {
  const c = tr.closing;
  const [slots, setSlots] = useState<ReturnType<typeof nearestSlots> | null>(null);
  useEffect(() => setSlots(nearestSlots(new Date(), "yerinde", 3)), []);
  return (
    <div>
      <span className="rv-slots-label" id="rv-slots-label">
        {c.slotsLabel}
      </span>
      <div className="rv-slots" aria-labelledby="rv-slots-label" aria-busy={slots === null}>
        {slots === null
          ? [0, 1, 2].map((i) => <div key={i} className="rv-slot-skel" aria-hidden="true" />)
          : slots.map((s) => (
              <Link key={s.iso + s.time} href={`/revak/kabul/kampus-turu/?tur=yerinde&tarih=${s.iso}&saat=${s.time}`} className="rv-slot">
                <strong>
                  {shortDate(s.iso)}, {s.time}
                </strong>
                <span>{c.left(s.left)}</span>
              </Link>
            ))}
      </div>
      <Link href="/revak/kabul/kampus-turu/" className="rv-textlink">
        {c.other}
      </Link>
    </div>
  );
}
